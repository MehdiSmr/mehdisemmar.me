import MarkdownIt from 'markdown-it'

/**
 * One markdown configuration for the whole site: blog post bodies, and the
 * short prose on the home page. `html: false` means authored markup never
 * reaches the page, so rendered output is safe to bind with `v-html`.
 */
export const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

/**
 * Outbound links open in a new tab. Links beginning with `/` are this site's
 * own and are left alone — HomeView routes them through vue-router rather than
 * letting the browser reload the page.
 */
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
 * Width hints an image can carry as its markdown title, so a logo need not run
 * the full width of the column: `![](/logo.png "small")`. Anything else in the
 * title position is ignored and left alone.
 */
const SIZES = new Set(['small', 'medium'])

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

    // A recognised hint sizes the figure and is consumed, so it never reaches
    // the page as a tooltip.
    const hint = String(kids[0].attrGet('title') ?? '').trim()
    const sized = SIZES.has(hint)
    if (sized) kids[0].attrs = (kids[0].attrs ?? []).filter(([name]) => name !== 'title')

    open.tag = 'figure'
    close.tag = 'figure'
    open.attrSet('class', sized ? `plate ${hint}` : 'plate')

    // The image token's content is its alt text.
    const alt = kids[0].content
    if (!alt) continue

    const caption = new state.Token('html_block', '', 0)
    caption.content = `<figcaption>${md.utils.escapeHtml(alt)}</figcaption>`
    tokens.splice(i + 1, 0, caption)
    i++
  }
})

const isFigureOpen = (t: { type: string; tag: string }) =>
  t.type === 'paragraph_open' && t.tag === 'figure'

const isFigureClose = (t: { type: string; tag: string }) =>
  t.type === 'paragraph_close' && t.tag === 'figure'

/**
 * Two or more images in a row become a grid. Nothing to mark up: writing the
 * images back to back is the whole convention, and a lone image is left as the
 * full-width figure it already was.
 *
 * Runs after `image_figure`, which is what turns those paragraphs into figures.
 */
md.core.ruler.push('image_grid', (state) => {
  const tokens = state.tokens

  for (let i = 0; i < tokens.length; i++) {
    if (!isFigureOpen(tokens[i])) continue

    // Walk the run of adjacent figures, counting them.
    let end = i
    let count = 0
    while (end < tokens.length && isFigureOpen(tokens[end])) {
      let close = end
      while (close < tokens.length && !isFigureClose(tokens[close])) close++
      if (close === tokens.length) break
      end = close + 1
      count++
    }

    if (count < 2) {
      i = end - 1
      continue
    }

    const open = new state.Token('html_block', '', 0)
    open.content = '<div class="figure-grid">\n'
    const shut = new state.Token('html_block', '', 0)
    shut.content = '</div>\n'

    tokens.splice(end, 0, shut)
    tokens.splice(i, 0, open)
    i = end + 1
  }
})

/**
 * Renders a single line or paragraph without wrapping it in `<p>` — for copy
 * that already sits inside an element of its own.
 */
export function renderInline(src: string): string {
  return md.renderInline(src)
}
