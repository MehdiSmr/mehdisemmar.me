<script lang="ts" setup>
import { computed } from 'vue'
import PlateCarousel from '../components/PlateCarousel.vue'
import { lang } from '../composables/useLang'
import { toEntries, useSheetLog } from '../composables/useSheetLog'
import { content, type PageSection } from '../data/content'

const props = defineProps<{ kind: PageSection }>()

const d = computed(() => content[lang.value])
const { rows: sheetRows, loading, failed } = useSheetLog(props.kind)

/**
 * The sheet is the only source. An empty sheet means an empty log; a failed
 * fetch says so plainly rather than showing something that is not real.
 */
const posts = computed(() =>
  sheetRows.value ? toEntries(sheetRows.value, lang.value, d.value.map) : []
)

/** Only ever the loading note now; the entry count is not shown. */
const mark = computed(() => (loading.value ? d.value.loading : ''))
</script>

<template>
  <div class="log">
    <div class="masthead">
      <RouterLink class="back" to="/">{{ d.back }}</RouterLink>
      <div class="titleline">
        <h1 class="title">{{ d.labels[kind] }}</h1>
        <div class="mark">{{ mark }}</div>
      </div>
      <p class="blurb">{{ d.blurbs[kind] }}</p>
    </div>

    <p v-if="failed" class="empty">{{ d.error }}</p>
    <p v-else-if="!loading && posts.length === 0" class="empty">{{ d.empty }}</p>

    <article v-for="post in posts" :key="post.b" class="post">
      <div class="date">{{ post.a }}</div>
      <h2 class="head">{{ post.b }}</h2>
      <PlateCarousel :images="post.images" :caption="d.plates[kind]" :alt="post.b" />
      <p class="body">{{ post.c }}</p>
      <a v-if="post.link" class="link" :href="post.link.href" target="_blank" rel="noopener">
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
  gap: 20px;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 26px;
}

.back {
  font: 400 10.5px/1 var(--mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  align-self: flex-start;
}

.titleline {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 28px;
}

.title {
  margin: 0;
  font: 300 46px/1.05 var(--display);
  letter-spacing: -0.01em;
}

.mark {
  font: 400 11px/1 var(--mono);
  font-feature-settings: 'tnum';
  color: var(--mark);
  white-space: nowrap;
}

.blurb {
  margin: 0;
  max-width: 440px;
  font: 400 13.5px/1.8 var(--serif);
  color: var(--muted);
}

.empty {
  margin: 0;
  font: 400 13.5px/1.7 var(--serif);
  color: rgba(32, 31, 29, 0.42);
  font-style: italic;
}

.post {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 44px;
  border-bottom: 1px solid var(--rule-soft);
}

.date {
  font: 400 10.5px/1 var(--mono);
  font-feature-settings: 'tnum';
  letter-spacing: 0.16em;
  color: var(--accent);
}

.head {
  margin: 0;
  font: 400 32px/1.15 var(--display);
  letter-spacing: -0.005em;
  text-wrap: pretty;
}

.body {
  margin: 0;
  max-width: 560px;
  font: 400 15px/1.85 var(--serif);
  color: var(--prose);
  text-align: justify;
  hyphens: auto;
}

.link {
  font: 400 10.5px/1.6 var(--mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(182, 130, 53, 0.5);
  align-self: flex-start;
  padding-bottom: 2px;
  margin-top: 4px;
}

@media (max-width: 720px) {
  .log {
    gap: 40px;
  }

  .title {
    font-size: 36px;
  }

  .head {
    font-size: 26px;
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
