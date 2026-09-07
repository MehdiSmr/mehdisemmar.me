import type { Lang } from '../data/content'

/**
 * One date format for the whole site, used by the running log and the blog
 * alike. Day and month swap by language; the year always trails, as both
 * locales write it.
 */

const PLAIN = /^(\d{4})-(\d{2})-(\d{2})$/

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Accepts either a plain `YYYY-MM-DD` or a full ISO timestamp. A plain date
 * carries no time zone, so its parts are read as written — handing it to `Date`
 * would place it at UTC midnight and shift it a day west of Greenwich.
 *
 * Returns '' for anything it cannot read, so a caller can fall back to
 * whatever the author actually typed.
 */
export function formatDate(value: string, lang: Lang): string {
  if (!value) return ''

  const plain = PLAIN.exec(value)
  if (plain) {
    const [, yyyy, mm, dd] = plain
    return lang === 'fr' ? `${dd}.${mm}.${yyyy}` : `${mm}.${dd}.${yyyy}`
  }

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  const yyyy = String(d.getFullYear())
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  return lang === 'fr' ? `${dd}.${mm}.${yyyy}` : `${mm}.${dd}.${yyyy}`
}
