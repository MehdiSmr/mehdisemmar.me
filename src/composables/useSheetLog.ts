import { ref, type Ref } from 'vue'
import type { Entry, Lang, PageSection } from '../data/content'

/**
 * Log pages read their entries from a Google Sheet at runtime, so adding a row
 * to the sheet publishes it without a rebuild. Results are cached in
 * localStorage for a day; a failed fetch leaves the caller on its seed content.
 *
 * Each sheet's first row must be:
 *   name | date | thoughts | image1 | image2 | image3 | maps
 */

const SHEET_IDS: Record<PageSection, string | undefined> = {
  coffee: import.meta.env.VITE_COFFEE_LOG,
  running: import.meta.env.VITE_RUNNING_LOG
}

const DAY = 24 * 60 * 60 * 1000
const CACHE_PREFIX = 'log-cache:'

/**
 * Rows are kept for a day, so a repeat visit costs no request at all.
 * Set to false while editing the sheet and every load fetches fresh; stored
 * entries are then deleted rather than ignored, so switching back on cannot
 * bring stale data back.
 */
const CACHE_ENABLED = true

/** One sheet row, before it is shaped for a given language. */
interface SheetRow {
  name: string
  /** ISO string, or '' when the cell could not be read as a date. */
  date: string
  thoughts: string
  images: string[]
  maps: string
}

interface Cached {
  at: number
  rows: SheetRow[]
}

/**
 * `headers=1` is required, not optional: a sheet holding only its header row
 * (a log with no entries yet) otherwise reports zero headers and returns the
 * header as data with unlabelled columns.
 */
const endpoint = (id: string) =>
  `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1`

/** The response is JSON wrapped in a JS callback, so it is sliced out. */
function parseGviz(text: string): unknown {
  const open = text.indexOf('{')
  const close = text.lastIndexOf('}')
  if (open < 0 || close <= open) throw new Error('unrecognised sheet response')
  return JSON.parse(text.slice(open, close + 1))
}

const DATE_CALL = /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/
const DAY_FIRST = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/

/** gviz sends dates as `Date(y,m,d,...)` with a 0-indexed month. */
function toISO(cell: { v?: unknown; f?: unknown } | null): string {
  if (!cell) return ''
  if (typeof cell.v === 'string') {
    const m = DATE_CALL.exec(cell.v)
    if (m) {
      const [, y, mo, d, h, mi, s] = m
      return new Date(+y, +mo, +d, +(h ?? 0), +(mi ?? 0), +(s ?? 0)).toISOString()
    }
  }
  const shown = typeof cell.f === 'string' ? cell.f : typeof cell.v === 'string' ? cell.v : ''
  if (!shown) return ''
  // The sheet's own display format is day-first, which Date.parse reads as month-first.
  const dm = DAY_FIRST.exec(shown)
  if (dm) return new Date(+dm[3], +dm[2] - 1, +dm[1]).toISOString()
  const t = Date.parse(shown)
  return Number.isNaN(t) ? '' : new Date(t).toISOString()
}

const DRIVE_ID = /(?:\/file\/d\/|[?&]id=)([\w-]{20,})/

/** Drive share links do not render in <img>; their thumbnail endpoint does. */
function toImageUrl(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim() : ''
  if (!s) return ''
  if (s.includes('drive.google.com')) {
    const m = DRIVE_ID.exec(s)
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200`
  }
  return s
}

function text(cell: { v?: unknown } | null): string {
  return cell && typeof cell.v === 'string' ? cell.v.trim() : ''
}

interface GvizTable {
  status?: string
  table?: {
    cols?: { label?: string }[]
    rows?: { c?: ({ v?: unknown; f?: unknown } | null)[] }[]
  }
}

function toRows(payload: unknown): SheetRow[] {
  const data = payload as GvizTable
  const cols = data.table?.cols ?? []
  const at = (label: string) =>
    cols.findIndex((c) => (c.label ?? '').trim().toLowerCase() === label)

  const iName = at('name')
  const iDate = at('date')
  const iThoughts = at('thoughts')
  const iMaps = at('maps')
  const iImages = ['image1', 'image2', 'image3'].map(at)

  const pick = (c: ({ v?: unknown; f?: unknown } | null)[], i: number) => (i < 0 ? null : c[i] ?? null)

  return (data.table?.rows ?? [])
    .map((row) => {
      const c = row.c ?? []
      return {
        name: text(pick(c, iName)),
        date: toISO(pick(c, iDate)),
        thoughts: text(pick(c, iThoughts)),
        images: iImages.map((i) => toImageUrl(pick(c, i)?.v)).filter(Boolean),
        maps: text(pick(c, iMaps))
      }
    })
    // A trailing blank row in a spreadsheet is normal; a nameless entry is not.
    .filter((r) => r.name !== '')
}

function readCache(kind: PageSection): SheetRow[] | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + kind)
    if (!raw) return null
    const { at, rows } = JSON.parse(raw) as Cached
    if (!Array.isArray(rows) || Date.now() - at > DAY) return null
    return rows
  } catch {
    return null
  }
}

function writeCache(kind: PageSection, rows: SheetRow[]) {
  try {
    localStorage.setItem(CACHE_PREFIX + kind, JSON.stringify({ at: Date.now(), rows } as Cached))
  } catch {
    // Private browsing and disabled storage both throw; the fetch still worked.
  }
}

function clearCache(kind: PageSection) {
  try {
    localStorage.removeItem(CACHE_PREFIX + kind)
  } catch {
    // Nothing stored to begin with.
  }
}

/** Newest first, matching how the seed entries are ordered. */
function byNewest(a: SheetRow, b: SheetRow) {
  return (b.date || '').localeCompare(a.date || '')
}

function mark(iso: string, lang: Lang): string {
  if (!iso) return ''
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return lang === 'fr' ? `${dd}.${mm}` : `${mm}.${dd}`
}

/** Shapes cached rows into the same `Entry` the rest of the site renders. */
export function toEntries(rows: SheetRow[], lang: Lang, mapLabel: string): Entry[] {
  return [...rows].sort(byNewest).map((r) => ({
    a: mark(r.date, lang),
    b: r.name,
    c: r.thoughts,
    images: r.images,
    ...(r.maps ? { link: { label: mapLabel, href: r.maps } } : {})
  }))
}

export interface SheetLog {
  rows: Ref<SheetRow[] | null>
  /** True once a fetch has failed and no cache was available. */
  failed: Ref<boolean>
  loading: Ref<boolean>
}

export function useSheetLog(kind: PageSection): SheetLog {
  const rows = ref<SheetRow[] | null>(null)
  const failed = ref(false)
  const loading = ref(true)

  const id = SHEET_IDS[kind]
  if (!id) {
    // No sheet configured: the caller falls back to its seed entries.
    failed.value = true
    loading.value = false
    return { rows, failed, loading }
  }

  if (CACHE_ENABLED) {
    const cached = readCache(kind)
    if (cached) {
      rows.value = cached
      loading.value = false
      return { rows, failed, loading }
    }
  } else {
    clearCache(kind)
  }

  fetch(endpoint(id))
    .then((res) => {
      if (!res.ok) throw new Error(`sheet responded ${res.status}`)
      return res.text()
    })
    .then((body) => {
      const parsed = toRows(parseGviz(body))
      rows.value = parsed
      if (CACHE_ENABLED) writeCache(kind, parsed)
    })
    .catch(() => {
      failed.value = true
    })
    .finally(() => {
      loading.value = false
    })

  return { rows, failed, loading }
}
