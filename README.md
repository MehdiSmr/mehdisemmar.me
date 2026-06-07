# mehdisemmar.me

Live at [mehdisemmar.me](https://mehdisemmar.me)

Source for my personal portfolio site. It ships two ways to look at the same content:

- A standard scrolling portfolio with experience, projects, recommendations and a 3D terminal teaser.
- An interactive terminal portfolio where you navigate the content through a small command-line interface, with holographic project cards rendered alongside it.

The terminal experience is only offered on pointer-based devices with a viewport wide enough to use it (see `src/utils/device.ts`); touch devices and narrow screens are redirected to the scrolling version.

## Stack

- Vue 3 with `<script setup>` and TypeScript
- Vite for dev and build
- Vue Router for the two routes
- Vue I18n for English/French copy
- TresJS (`@tresjs/core`, `@tresjs/cientos`) on top of Three.js for the 3D scenes

## Routes

| Path | View | Notes |
| --- | --- | --- |
| `/` | `LazyPortfolio.vue` | Scrolling portfolio, available everywhere |
| `/terminal-portfolio` | `TerminalPortfolio.vue` | Terminal experience, gated by device check |

Unknown paths redirect to `/`.

## Terminal commands

The CLI lives in `src/components/Terminal/CLI.ts`. Supported commands:

`help`, `aboutme`, `skills`, `ls`, `cd`, `open`, `goto`, `close`, `clear`, `exit`

Typing in the terminal supports tab autocompletion.

## Content

All portfolio content (experience, projects, extracurriculars, recommendations) is defined in `src/data/portfolio.ts`. Localized labels and translated copy are derived from it in `src/data/portfolioLocalized.ts`. To update what the site shows, edit those files rather than the components.

Images, sounds and recommendation avatars live under `public/assets/`.

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

## Build

```bash
npm run build
```

`vue-tsc` type-checks the project and Vite outputs the static site to `dist/`. Preview the production build with:

```bash
npm run preview
```

## Deployment

The site is served as static assets from `dist/`. Cloudflare configuration is in `wrangler.jsonc`.

## License

The source code is released under the [MIT License](LICENSE).

The license covers the code only. The personal content under `public/assets/` and `src/data/` (text, images, photos, and the recommendation quotes and avatars) is all rights reserved and may not be reused.
