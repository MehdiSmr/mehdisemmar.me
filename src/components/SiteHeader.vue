<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { lang, setLang } from '../composables/useLang'
import { content, links } from '../data/content'

const d = computed(() => content[lang.value])
const route = useRoute()

/**
 * Marked by section rather than by route, so a single post keeps `blog` lit.
 * Home is exact: everything starts with `/`.
 */
const at = (base: string) =>
  base === '/' ? route.path === '/' : route.path === base || route.path.startsWith(`${base}/`)
</script>

<template>
  <header class="head">
    <RouterLink class="name" to="/">mehdi semmar</RouterLink>

    <div class="right">
      <nav class="nav" aria-label="Sections">
        <RouterLink to="/" :class="{ on: at('/') }">{{ d.nav.home }}</RouterLink>
        <!-- Leaves the site, so it is never the current section. -->
        <a :href="links.resume" target="_blank" rel="noopener">{{ d.nav.resume }}</a>
        <RouterLink to="/blog" :class="{ on: at('/blog') }">{{ d.nav.blog }}</RouterLink>
        <RouterLink to="/running" :class="{ on: at('/running') }">{{ d.nav.running }}</RouterLink>
      </nav>

      <nav class="langs" aria-label="Language">
        <button
          type="button"
          :class="{ on: lang === 'en' }"
          :aria-pressed="lang === 'en'"
          @click="setLang('en')"
        >
          en
        </button>
        <span class="dot" aria-hidden="true">·</span>
        <button
          type="button"
          :class="{ on: lang === 'fr' }"
          :aria-pressed="lang === 'fr'"
          @click="setLang('fr')"
        >
          fr
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
  flex-wrap: wrap;
}

.name {
  font: 400 12px/1 var(--serif);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.right {
  display: flex;
  align-items: baseline;
  gap: 28px;
}

.nav,
.langs {
  display: flex;
  font: 400 11px/1 var(--serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.nav {
  gap: 20px;
}

.langs {
  gap: 10px;
}

/* The whole site's control state, in one rule: grey until it is the current
   one or under the cursor, then black. No underline, ever. */
.nav a,
.langs button {
  color: var(--gray);
  transition: color 0.3s ease;
}

.nav a.on,
.nav a:hover,
.langs button.on,
.langs button:hover {
  color: var(--ink);
}

.dot {
  color: var(--gray);
}

@media (max-width: 560px) {
  .right {
    width: 100%;
    justify-content: space-between;
    gap: 16px;
  }
}
</style>
