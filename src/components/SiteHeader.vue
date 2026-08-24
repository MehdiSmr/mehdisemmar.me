<script lang="ts" setup>
import { lang, setLang } from '../composables/useLang'
</script>

<template>
  <header class="head">
    <div class="name">mehdi semmar</div>
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
  </header>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
}

.name {
  font: 400 12px/1 var(--serif);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.langs {
  display: flex;
  gap: 10px;
  font: 400 11px/1 var(--serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.langs button {
  color: rgba(32, 31, 29, 0.42);
  transition: color 0.3s ease;
}

.langs button.on,
.langs button:hover {
  color: var(--accent);
}

.dot {
  color: rgba(32, 31, 29, 0.3);
}
</style>
