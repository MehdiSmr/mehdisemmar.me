<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EntryDetail from '../components/EntryDetail.vue'
import { lang } from '../composables/useLang'
import { SECTIONS, content, links, type Section, type SectionKey } from '../data/content'

const router = useRouter()
const open = ref<SectionKey | null>('work')

/**
 * Which entry's popup is showing. Held as a section plus a position so the
 * popup can walk that section — and only that section.
 */
const detail = ref<{ key: SectionKey; i: number } | null>(null)

const d = computed(() => content[lang.value])

const rows = (key: SectionKey) => d.value.entries[key]

const sections = SECTIONS

/** Rows are numbered by position in the index; the arrow marks a row that leaves it. */
function mark(section: Section, i: number) {
  const n = String(i + 1).padStart(2, '0')
  return section.kind === 'accordion' ? n : `${n}  →`
}

function moveDetail(i: number) {
  if (detail.value) detail.value.i = i
}

function activate(section: Section) {
  if (section.kind === 'page') {
    router.push(`/${section.key}`)
    return
  }
  open.value = open.value === section.key ? null : section.key
}
</script>

<template>
  <div class="index">
    <p class="intro">{{ d.intro }}</p>

    <div class="list">
      <div v-for="(section, i) in sections" :key="section.key" class="section">
        <a
          v-if="section.kind === 'external'"
          class="row"
          :href="section.href"
          target="_blank"
          rel="noopener"
        >
          <span class="label">{{ d.labels[section.key] }}</span>
          <span class="mark">{{ mark(section, i) }}</span>
        </a>

        <button
          v-else
          type="button"
          class="row"
          :class="{ open: open === section.key }"
          :aria-expanded="section.kind === 'accordion' ? open === section.key : undefined"
          :aria-controls="section.kind === 'accordion' ? `panel-${section.key}` : undefined"
          @click="activate(section)"
        >
          <span class="label">{{ d.labels[section.key] }}</span>
          <span class="mark">{{ mark(section, i) }}</span>
        </button>

        <div
          v-if="section.kind === 'accordion' && open === section.key"
          :id="`panel-${section.key}`"
          class="panel"
        >
          <p v-if="rows(section.key).length === 0" class="empty">{{ d.empty }}</p>

          <div v-else class="entries">
            <div v-for="(row, ri) in rows(section.key)" :key="row.b" class="entry">
              <div class="a">{{ row.a }}</div>
              <button
                type="button"
                class="thumb"
                :aria-label="`${row.b}, details`"
                @click="detail = { key: section.key, i: ri }"
              >
                <img
                  v-if="row.images?.[0]"
                  :src="row.images[0]"
                  :alt="row.b"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                />
                <div v-else class="hatch" aria-hidden="true"></div>
              </button>
              <div class="rest">
                <div class="b">{{ row.b }}</div>
                <p v-if="row.c" class="c">{{ row.c }}</p>
                <a v-if="row.link" class="link" :href="row.link.href" target="_blank" rel="noopener">
                  {{ row.link.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EntryDetail
      v-if="detail"
      :entries="rows(detail.key)"
      :index="detail.i"
      :kicker="d.labels[detail.key]"
      @update:index="moveDetail"
      @close="detail = null"
    />

    <nav class="foot" aria-label="Elsewhere">
      <a :href="links.email">email</a>
      <a :href="links.github" target="_blank" rel="noopener">github</a>
      <a :href="links.linkedin" target="_blank" rel="noopener">linkedin</a>
      <a :href="links.resume" target="_blank" rel="noopener">{{ d.labels.cv }}</a>
    </nav>
  </div>
</template>

<style scoped>
.index {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.intro {
  margin: 0;
  max-width: 420px;
  font: 400 15px/1.75 var(--serif);
  color: var(--body);
}

.list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--rule);
}

.section {
  border-bottom: 1px solid var(--rule);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  width: 100%;
  padding: 22px 2px;
  padding-left: 2px;
  color: var(--ink);
  transition:
    padding-left 0.35s var(--ease),
    color 0.3s ease;
}

.row:hover {
  color: var(--accent);
}

.row.open {
  padding-left: 14px;
  color: var(--accent);
}

.label {
  font: 400 13px/1 var(--serif);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.mark {
  font: 400 11px/1 var(--mono);
  font-feature-settings: 'tnum';
  color: var(--mark);
  white-space: pre;
}

.panel {
  padding: 0 2px 34px;
  animation: omRise 0.5s var(--ease) both;
}

.empty {
  margin: 0;
  font: 400 13.5px/1.7 var(--serif);
  color: rgba(32, 31, 29, 0.42);
  font-style: italic;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 660px;
}

.entry {
  display: grid;
  grid-template-columns: 74px 56px 1fr;
  gap: 22px;
  align-items: start;
}

.a {
  font: 400 11px/1.5 var(--mono);
  font-feature-settings: 'tnum';
  color: rgba(32, 31, 29, 0.45);
  padding-top: 4px;
}

/* A 56px square plate — the log plate's mat and hairline at index scale.
   Clicking it opens the entry's detail popup. */
.thumb {
  display: block;
  width: 100%;
  padding: 4px;
  background: #f3f0ec;
  border: 1px solid rgba(32, 31, 29, 0.14);
  transition: border-color 0.3s ease;
}

.thumb:hover {
  border-color: var(--gold);
}

.thumb img,
.hatch {
  display: block;
  width: 100%;
  aspect-ratio: 1;
}

.thumb img {
  object-fit: cover;
  filter: grayscale(1) contrast(1.03);
  transition: filter 0.4s var(--ease);
}

.thumb:hover img,
.thumb:focus-visible img {
  filter: none;
}

.hatch {
  background: repeating-linear-gradient(135deg, #e7e2db 0 5px, #f1ece5 5px 10px);
}

.rest {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.b {
  font: 600 19px/1.2 var(--display);
}

.c {
  margin: 0;
  font: 400 13.5px/1.7 var(--serif);
  color: var(--muted);
  text-wrap: pretty;
}

.link {
  font: 400 11px/1.6 var(--mono);
  letter-spacing: 0.08em;
  border-bottom: 1px solid rgba(182, 130, 53, 0.5);
  align-self: flex-start;
  padding-bottom: 1px;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  font: 400 11px/1 var(--serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@media (max-width: 720px) {
  .index {
    gap: 40px;
  }

  /* Date takes its own line; the plate sits beside the text below it. */
  .entry {
    grid-template-columns: 56px 1fr;
    gap: 8px 16px;
  }

  .a {
    grid-column: 1 / -1;
    padding-top: 0;
  }
}
</style>
