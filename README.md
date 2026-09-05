# mehdisemmar.me

Live at [mehdisemmar.me](https://mehdisemmar.me)

Source for my personal site: a home page, a blog of write-ups on places I have
worked, and a running log. Monochrome, serif, deliberately plain.

## Stack

- Vue 3 with `<script setup>` and TypeScript
- Vite for dev and build
- Vue Router
- `markdown-it` for blog post bodies

## Routes

| Path | View | Notes |
| --- | --- | --- |
| `/` | `HomeView.vue` | Portrait, bio, contact links |
| `/blog` | `BlogView.vue` | Every post as title and date, newest first |
| `/blog/:slug` | `PostView.vue` | One post |
| `/running` | `LogView.vue` | Running log, backed by a Google Sheet |

Unknown paths redirect to `/`.

## Writing a blog post

Posts are markdown files in `src/content/posts`, named `<slug>.<lang>.md`. Drop
a file in and it appears — there is nothing else to register. The file name is
the URL: `vertex.en.md` is served at `/blog/vertex`.

```markdown
---
title: Vertex Inc.
role: Software Engineering Intern
dates: Summer 2026
order: 70
skills: [Go, PostgreSQL, Terraform]
---

Body prose, **bold**, *italic*, [links](https://example.com), lists, quotes.

![Caption text](/assets/posts/vertex/office.jpg)
```

Frontmatter fields:

| Field | Meaning |
| --- | --- |
| `title` | Post title, and the whole of its row on the blog index. Defaults to the slug. |
| `role` | Line under the title, on the post's own page. Optional. |
| `dates` | Free text, shown as written. |
| `order` | Sort key — higher is newer. Ties fall back to the slug. |
| `skills` | Listed at the foot of the post. Optional. |

The parser accepts `key: value` and `key: [a, b, c]`, one per line — a small
YAML subset, not the whole language.

### Images

Put them anywhere under `public/assets/` and reference them by path. An image
alone in a paragraph becomes a `<figure>`, with its alt text set beneath as the
caption. Images elsewhere in a paragraph render inline.

Photographs sit on the page directly — no mat, no border — and keep their own
colour. Everything else is black, white, and one grey for controls that are not
currently selected.

### French

A post with no `.fr.md` falls back to its English file and is labelled as
untranslated, so French can be added one post at a time.

## Running log

The running log reads from a Google Sheet at runtime, so a new entry needs no
rebuild. Set `VITE_RUNNING_LOG` to the sheet id (see `.env.example`). The
sheet's first row must be the header:

```
name | date | thoughts | image1 | image2 | image3 | maps
```

Rows are cached in `localStorage` for a day. While editing the sheet, flip
`CACHE_ENABLED` in `src/composables/useSheetLog.ts` to `false`.

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints.

## Build

```bash
npm run build
```

`vue-tsc` type-checks the project and Vite outputs the static site to `dist/`.
Preview the production build with `npm run preview`.

## Deployment

Served as static assets from `dist/`. Cloudflare configuration is in
`wrangler.jsonc`.

## License

The source code is released under the [MIT License](LICENSE).

The license covers the code only. The personal content under `public/assets/`,
`src/content/` and `src/data/` (text, images and photos) is all rights reserved
and may not be reused.
