# mehdisemmar.me

Source for my personal site — live at [mehdisemmar.me](https://mehdisemmar.me).

A home page, a blog of write-ups on places I have worked, and a running log that
reads itself out of a Google Sheet. Black, white, one grey, one typeface.

> **Using this repo:** the code is MIT and yours to fork. The writing and the
> photographs are not — see [LICENSE](LICENSE). Fork it and put your own content
> in; that is what it is for.

## Stack

- Vue 3 with `<script setup>` and TypeScript
- Vite for dev and build
- Vue Router
- `markdown-it` for blog post bodies

No CSS framework, no component library, no state management. Four runtime
dependencies in total.

## Getting it running

```bash
npm install
npm run dev
```

Then open the URL Vite prints. The home page and blog work immediately; the
running log needs a sheet id (below) and shows an empty state without one.

```bash
npm run build      # vue-tsc type-check, then a static build into dist/
npm run preview    # serve that build locally
```

## How it fits together

```
src/
  main.ts               routes
  style.css             the three colours, one typeface, and .underlink
  data/content.ts       site chrome and the home page's copy, en + fr
  content/posts/        blog posts, as markdown
  composables/
    usePosts.ts         reads the markdown at build time
    useSheetLog.ts      reads the running log at run time
    useLang.ts          the en/fr toggle
  views/                one file per route
  components/           header, and the running log's photo carousel
```

| Path | View | Notes |
| --- | --- | --- |
| `/` | `HomeView.vue` | Portrait, bio, contact links |
| `/blog` | `BlogView.vue` | Every post as title and date, newest first |
| `/blog/:slug` | `PostView.vue` | One post |
| `/running` | `LogView.vue` | Running log, from a Google Sheet |

Unknown paths redirect to `/`. The router uses history mode, so the host has to
serve `index.html` for unmatched paths — see `wrangler.jsonc`.

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

| Field | Meaning |
| --- | --- |
| `title` | Post title, and the whole of its row on the blog index. Defaults to the slug. |
| `role` | Line under the title, on the post's own page. Optional. |
| `dates` | Free text, shown as written. |
| `order` | Sort key — higher is newer. Ties fall back to the slug. |
| `skills` | Listed at the foot of the post. Optional. |

The frontmatter parser accepts `key: value` and `key: [a, b, c]`, one per line —
a small YAML subset, not the whole language. It lives in `usePosts.ts` and is
about thirty lines; extend it there if you need more.

### Images

Put them anywhere under `public/assets/` and reference them by path. An image
alone in a paragraph becomes a `<figure>`, with its alt text set beneath as the
caption; images elsewhere in a paragraph render inline.

### French

A post with no `.fr.md` falls back to its English file and is labelled as
untranslated, so French can be added one post at a time. Site chrome is
translated in `src/data/content.ts`.

## The running log

The running log reads from a Google Sheet at run time, so a new entry needs no
rebuild. Copy `.env.example` to `.env` and set `VITE_RUNNING_LOG` to the sheet
id. The sheet's first row must be exactly:

```
name | date | thoughts | image1 | image2 | image3 | maps
```

Rows are cached in `localStorage` for a day. While editing the sheet, flip
`CACHE_ENABLED` in `src/composables/useSheetLog.ts` to `false`.

Two things that will bite you:

- **The sheet must be readable by anyone with the link**, or the fetch fails and
  the page says so.
- **So must every photo.** Drive share links are rewritten to the thumbnail
  endpoint, which serves a sign-in page rather than an image for anything not
  publicly shared. A photo that fails to load is dropped, and an entry whose
  only photo fails shows no carousel at all — which looks identical to an entry
  that never had one.

## Design notes

Three colours, defined once in `style.css`: white, black, and one grey for any
control that is not currently selected. Photographs keep their own colour and
sit on the page with no mat or border. There are no rules or separators —
spacing does that work. One typeface, Lora, at every size.

Outbound links that need to read as controls use `.underlink`, which draws its
underline twice so the rule can erase itself on hover rather than merely
changing colour.

## Deployment

Static assets from `dist/`, on Cloudflare. Configuration is in `wrangler.jsonc`.
`VITE_RUNNING_LOG` is read at build time, so it has to be set wherever the build
runs — it ends up in the bundle, which is fine: the sheet has to be world
readable for the fetch to work at all.

## License

Two licenses, one file. Code is MIT; the writing and photographs are all rights
reserved. See [LICENSE](LICENSE) for exactly which files fall on which side.
