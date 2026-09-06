<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { lang } from '../composables/useLang'
import { renderInline } from '../composables/useMarkdown'
import { content, links, portrait } from '../data/content'

const router = useRouter()
const d = computed(() => content[lang.value])

/** The bio is markdown, so a paragraph can link into the blog as it reads. */
const paragraphs = computed(() => d.value.bio.map(renderInline))

/**
 * Links inside that markdown are plain anchors. Same-site ones are handed to
 * the router so they do not reload the page; modified clicks (new tab, new
 * window) and outbound links are left to the browser.
 */
function onProseClick(e: MouseEvent) {
  const anchor = (e.target as HTMLElement).closest('a')
  const href = anchor?.getAttribute('href')
  if (!href?.startsWith('/')) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  router.push(href)
}
</script>

<template>
  <div class="home">
    <div class="split">
      <figure class="frame">
        <img :src="portrait" :alt="d.portraitAlt" decoding="async" />
      </figure>

      <div class="col">
        <!-- Authored markdown, rendered with html disabled — no raw tags get through. -->
        <div class="prose" @click="onProseClick">
          <p v-for="(para, i) in paragraphs" :key="i" v-html="para"></p>
        </div>

        <nav class="foot" aria-label="Elsewhere">
          <a class="underlink" :href="links.github" target="_blank" rel="noopener">github</a>
          <a class="underlink" :href="links.linkedin" target="_blank" rel="noopener">linkedin</a>
          <a class="underlink" :href="links.email">email</a>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  animation: omRise 0.5s var(--ease) both;
}

/*
 * Portrait left, prose right, as a matched pair: two columns of equal width,
 * and `stretch` gives them equal height. The photograph and the block of text
 * end up the same rectangle, which is the whole point of the arrangement.
 *
 * `max-width` keeps that rectangle from growing unreasonably on a wide screen;
 * the pair stays centred in the shell.
 */
.split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;
  align-items: stretch;
  max-width: 880px;
}

/* The photograph sits on the page directly — no mat, no border. */
.frame {
  margin: 0;
}

/* No fixed aspect ratio: the height comes from the text, and the photo is
   cropped to fill whatever that turns out to be. */
.frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.col {
  display: flex;
  flex-direction: column;
}

.prose {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.prose p {
  margin: 0;
  font: 400 15px/1.85 var(--serif);
  text-wrap: pretty;
}

/*
 * The `.underlink` treatment, rebuilt for links sitting inside flowing prose.
 * That class positions two pseudo-elements, which cannot wrap across a line
 * break; two stacked background gradients can. The effect is the same — a
 * black rule always drawn, and a near-white one wiping over it on hover while
 * the text greys.
 */
.prose :deep(a) {
  color: var(--ink);
  padding-bottom: 2px;
  background-image:
    linear-gradient(var(--hairline), var(--hairline)),
    linear-gradient(var(--ink), var(--ink));
  background-size:
    0 1px,
    100% 1px;
  background-position:
    0 100%,
    0 100%;
  background-repeat: no-repeat;
  transition:
    background-size 0.4s var(--ease),
    color 0.4s var(--ease);
}

.prose :deep(a:hover) {
  color: var(--gray);
  background-size:
    100% 1px,
    100% 1px;
}

@media (prefers-reduced-motion: reduce) {
  .prose :deep(a) {
    transition: none;
  }
}

/* Sits under the last paragraph, on the portrait's bottom edge. */
.foot {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: auto;
  padding-top: 40px;
  font: 400 11px/1 var(--serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* Underlined, unlike the header's nav — these read as things to click rather
   than as a statement of where you are. See `.underlink` in style.css. */

@media (max-width: 860px) {
  /* Portrait over prose, and no longer full width — a stacked photo that
     spans the column reads as a banner rather than a portrait. With nothing
     beside it, it goes back to its own proportions. */
  .split {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .frame {
    max-width: 260px;
  }

  .frame img {
    height: auto;
    aspect-ratio: 4 / 5;
  }

  .foot {
    padding-top: 32px;
  }
}
</style>
