<script lang="ts" setup>
import { computed } from 'vue'
import PlateCarousel from '../components/PlateCarousel.vue'
import { lang } from '../composables/useLang'
import { toEntries, useSheetLog } from '../composables/useSheetLog'
import { content } from '../data/content'

const d = computed(() => content[lang.value])
const { rows: sheetRows, loading, failed } = useSheetLog()

/**
 * The sheet is the only source. An empty sheet means an empty log; a failed
 * fetch says so plainly rather than showing something that is not real.
 */
const posts = computed(() =>
  sheetRows.value ? toEntries(sheetRows.value, lang.value, d.value.runningLinkLabel) : []
)

/** Only ever the loading note; the entry count is not shown. */
const mark = computed(() => (loading.value ? d.value.loading : ''))
</script>

<template>
  <div class="log">
    <div class="masthead">
      <div class="titleline">
        <h1 class="title">{{ d.running.title }}</h1>
        <div class="mark">{{ mark }}</div>
      </div>
      <p class="blurb">{{ d.running.blurb }}</p>
    </div>

    <p v-if="failed" class="empty">{{ d.error }}</p>
    <p v-else-if="!loading && posts.length === 0" class="empty">{{ d.empty }}</p>

    <!-- Keyed by position, not name: two runs can share a title. -->
    <article v-for="(post, i) in posts" :key="i" class="post">
      <div class="date">{{ post.a }}</div>
      <h2 class="head">{{ post.b }}</h2>
      <PlateCarousel :images="post.images" :alt="post.b" />
      <p class="body">{{ post.c }}</p>
      <a
        v-if="post.link"
        class="link underlink"
        :href="post.link.href"
        target="_blank"
        rel="noopener"
      >
        {{ post.link.label }}
      </a>
    </article>
  </div>
</template>

<style scoped>
.log {
  display: flex;
  flex-direction: column;
  gap: 52px;
  animation: omRise 0.5s var(--ease) both;
}

.masthead {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.titleline {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 28px;
}

.title {
  margin: 0;
  font: 400 30px/1.15 var(--serif);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mark {
  font: 400 11px/1 var(--serif);
  font-feature-settings: 'tnum';
  color: var(--gray);
  white-space: nowrap;
}

.blurb {
  margin: 0;
  max-width: 440px;
  font: 400 13.5px/1.8 var(--serif);
}

.empty {
  margin: 0;
  font: 400 13.5px/1.7 var(--serif);
  color: var(--gray);
  font-style: italic;
}

/* Entries are separated by space alone — no rule between them. */
.post {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 44px;
}

.date {
  font: 400 10.5px/1 var(--serif);
  font-feature-settings: 'tnum';
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gray);
}

.head {
  margin: 0;
  font: 400 21px/1.35 var(--serif);
  text-wrap: pretty;
}

.body {
  margin: 0;
  max-width: 560px;
  font: 400 15px/1.85 var(--serif);
  text-align: justify;
  hyphens: auto;
}

/* Underlined so it reads as a control — see `.underlink` in style.css. */
.link {
  font: 400 10.5px/1.6 var(--serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  align-self: flex-start;
  margin-top: 4px;
}

@media (max-width: 720px) {
  .log {
    gap: 40px;
  }

  .title {
    font-size: 24px;
  }

  .head {
    font-size: 19px;
  }

  .titleline {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .body {
    text-align: left;
  }
}
</style>
