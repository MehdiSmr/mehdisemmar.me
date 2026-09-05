import MarkdownIt from 'markdown-it'
import type { Lang } from '../data/content'

/**
 * Blog posts are markdown files, read at build time. To add one, drop a file
 * into `src/content/posts` named `<slug>.<lang>.md` — nothing else to wire up.
 *
 * Images go in `public/assets/…` and are referenced by plain path, so
 * `![caption](/assets/posts/vertex/office.jpg)` works anywhere in the body.
 *
 * A post with no `.fr.md` falls back to its English file, so French can be
 * added one post at a time.
 */

export interface Post {
  slug: string
  lang: Lang
  /** False when this is the English file standing in for a missing translation. */
  translated: boolean
  title: string
  /** Role or capacity — the line under the title. */
  role: string
  /** Free-text dates, shown as written. */
  dates: string
  /** Sort key. Higher is newer; ties fall back to the slug. */
  order: number
  skills: string[]
  /** Rendered HTML body. */
  html: string
}

interface Front {
  [key: string]: string | string[]
}

const FRONT = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * A deliberately small YAML subset: `key: value` and `key: [a, b, c]`, one per
 * line. Enough for the fields above, and it keeps a parser dependency out of
 * the bundle.
 */
function parseFront(raw: string): { front: Front; body: string } {
  const m = FRONT.exec(raw)
  if (!m) return { front: {}, body: raw }

  const front: Front = {}
  for (const line of m[1].split('\n')) {
    const at = line.indexOf(':')
    if (at < 0) continue
    const key = line.slice(0, at).trim()
    if (!key || key.startsWith('#')) continue

    let value = line.slice(at + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      front[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => unquote(s.trim()))
        .filter(Boolean)
      continue
    }
    value = unquote(value)
    if (value) front[key] = value
  }

  return { front, body: raw.slice(m[0].length) }
}

function unquote(s: string): string {
  const q = s.startsWith('"') && s.endsWith('"')
  const a = s.startsWith("'") && s.endsWith("'")
  return q || a ? s.slice(1, -1) : s
}

function str(front: Front, key: string): string {
  const v = front[key]
  return typeof v === 'string' ? v : ''
}

function list(front: Front, key: string): string[] {
  const v = front[key]
  return Array.isArray(v) ? v : []
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

/** Every outbound link opens in a new tab; in-page anchors are left alone. */
const openLink = md.renderer.rules.link_open
md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
  const href = String(tokens[i].attrGet('href') ?? '')
  if (/^https?:/i.test(href)) {
    tokens[i].attrSet('target', '_blank')
    tokens[i].attrSet('rel', 'noopener noreferrer')
  }
  return openLink ? openLink(tokens, i, opts, env, self) : self.renderToken(tokens, i, opts)
}

/** Body photos are lazy — a post can carry a lot of them. */
const openImage = md.renderer.rules.image
md.renderer.rules.image = (tokens, i, opts, env, self) => {
  tokens[i].attrSet('loading', 'lazy')
  tokens[i].attrSet('decoding', 'async')
  return openImage ? openImage(tokens, i, opts, env, self) : self.renderToken(tokens, i, opts)
}

/**
 * A paragraph holding nothing but an image becomes a `<figure>`, with the alt
 * text repeated as its caption. `<figure>` cannot legally nest inside `<p>`, so
 * the paragraph's own tag is rewritten rather than wrapped.
 */
md.core.ruler.push('image_figure', (state) => {
  const tokens = state.tokens

  for (let i = 1; i < tokens.length - 1; i++) {
    if (tokens[i].type !== 'inline') continue

    const kids = tokens[i].children ?? []
    if (kids.length !== 1 || kids[0].type !== 'image') continue

    const open = tokens[i - 1]
    const close = tokens[i + 1]
    if (open.type !== 'paragraph_open' || close.type !== 'paragraph_close') continue

    open.tag = 'figure'
    close.tag = 'figure'
    open.attrSet('class', 'plate')

    // The image token's content is its alt text.
    const alt = kids[0].content
    if (!alt) continue

    const caption = new state.Token('html_block', '', 0)
    caption.content = `<figcaption>${md.utils.escapeHtml(alt)}</figcaption>`
    tokens.splice(i + 1, 0, caption)
    i++
  }
})

/** `<slug>.<lang>.md`; a file without a language segment is treated as English. */
const NAME = /([^/]+?)(?:\.(en|fr))?\.md$/

const files = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

/** Parsed once at module load — the files cannot change at runtime. */
const byLang: Record<Lang, Map<string, Post>> = { en: new Map(), fr: new Map() }

for (const [path, raw] of Object.entries(files)) {
  const name = NAME.exec(path)
  if (!name) continue

  const slug = name[1]
  const lang = (name[2] ?? 'en') as Lang
  const { front, body } = parseFront(raw)

  byLang[lang].set(slug, {
    slug,
    lang,
    translated: true,
    title: str(front, 'title') || slug,
    role: str(front, 'role'),
    dates: str(front, 'dates'),
    order: Number(str(front, 'order')) || 0,
    skills: list(front, 'skills'),
    html: md.render(body)
  })
}

/** Newest first. Equal `order` values fall back to the slug, so ties are stable. */
function byNewest(a: Post, b: Post) {
  return b.order - a.order || a.slug.localeCompare(b.slug)
}

/**
 * Every post in `lang`, with the English file standing in wherever a
 * translation is missing. Ordering is the same in both languages.
 */
export function postsIn(lang: Lang): Post[] {
  const out: Post[] = []
  for (const [slug, en] of byLang.en) {
    const local = lang === 'en' ? undefined : byLang[lang].get(slug)
    out.push(local ?? { ...en, lang, translated: lang === 'en' })
  }
  return out.sort(byNewest)
}

export function postAt(slug: string, lang: Lang): Post | undefined {
  return postsIn(lang).find((p) => p.slug === slug)
}
