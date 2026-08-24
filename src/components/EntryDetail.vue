<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { lang } from '../composables/useLang'
import { content, type Entry } from '../data/content'

const props = defineProps<{
  /** Every entry in the section this was opened from. Navigation never leaves it. */
  entries: Entry[]
  index: number
  /** Uppercase kicker above the title — the section this entry came from. */
  kicker: string
}>()

const emit = defineEmits<{ close: []; 'update:index': [number] }>()

/** Blank plates to stand in with while an entry has no photos yet. */
const BLANK_PLATES = 4

const d = computed(() => content[lang.value])
const entry = computed(() => props.entries[props.index])
const detail = computed(() => entry.value?.detail ?? {})
const plates = computed<string[]>(() =>
  entry.value?.images?.length ? entry.value.images : Array<string>(BLANK_PLATES).fill('')
)

const first = computed(() => props.index <= 0)
const last = computed(() => props.index >= props.entries.length - 1)
const counter = computed(
  () =>
    `${String(props.index + 1).padStart(2, '0')} / ${String(props.entries.length).padStart(2, '0')}`
)

/** Stops at both ends — a section never runs into the next one. */
function move(dir: number) {
  const next = props.index + dir
  if (next < 0 || next > props.entries.length - 1) return
  emit('update:index', next)
}

const panel = ref<HTMLElement | null>(null)
let restoreTo: HTMLElement | null = null

/** Document-level so Escape still closes if focus wanders out of the panel. */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') move(-1)
  else if (e.key === 'ArrowRight') move(1)
}

onMounted(() => {
  restoreTo = document.activeElement as HTMLElement | null
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKey)
  panel.value?.focus()
})

onBeforeUnmount(() => {
  // Cleared outright rather than restored to a captured value: capturing would
  // record 'hidden' whenever this mounts over an existing lock (a hot reload
  // with the popup open) and leave the page unscrollable for good.
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
  restoreTo?.focus?.()
})
</script>

<template>
  <div class="scrim" @click="emit('close')">
    <div
      ref="panel"
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      tabindex="-1"
      @click.stop
    >
      <div class="top">
        <div class="kicker">{{ kicker }}</div>
        <button type="button" class="close" @click="emit('close')">{{ d.close }}</button>
      </div>

      <!-- Keyed so moving between entries fades rather than swapping abruptly.
           Re-creating the element also resets its scroll to the top. -->
      <div :key="index" class="content">
        <h2 id="detail-title" class="title">{{ entry.b }}</h2>
        <div class="meta">{{ detail.meta ?? entry.a }}</div>

        <div class="plates">
          <div v-for="(src, i) in plates" :key="i" class="plate">
            <img
              v-if="src"
              class="shot"
              :src="src"
              :alt="`${entry.b} — ${i + 1}`"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="hatch">
              <div class="caption">{{ d.photo }} · {{ String(i + 1).padStart(2, '0') }}</div>
            </div>
          </div>
        </div>

        <p class="body">{{ detail.body ?? entry.c }}</p>

        <div v-if="detail.skills?.length" class="skills">
          <div class="skillhead">{{ d.skills }}</div>
          <div class="chips">
            <span v-for="s in detail.skills" :key="s" class="chip">{{ s }}</span>
          </div>
        </div>

        <a v-if="entry.link" class="link" :href="entry.link.href" target="_blank" rel="noopener">
          {{ entry.link.label }}
        </a>
      </div>

      <div class="nav">
        <span class="count">{{ counter }}</span>
        <span class="arrows">
          <button type="button" :disabled="first" aria-label="Previous entry" @click="move(-1)">
            ‹
          </button>
          <button type="button" :disabled="last" aria-label="Next entry" @click="move(1)">›</button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(32, 31, 29, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: omFade 0.3s ease both;
}

/* Fixed height, not max-height, so every entry opens the same panel whatever
   its length. The panel itself never scrolls — only `.content` inside it does,
   which keeps the kicker and the section arrows pinned in place. */
.panel {
  width: 760px;
  height: 86vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--ground);
  border: 1px solid var(--rule);
  box-shadow: 0 18px 48px rgba(45, 43, 43, 0.22);
  padding: 44px 48px 48px;
  animation: omRise 0.42s var(--ease) both;
}

.top {
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 28px;
  margin-bottom: 6px;
}

.kicker {
  font: 400 10.5px/1 var(--mono);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
}

.close {
  font: 400 11px/1 var(--mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(32, 31, 29, 0.45);
  transition: color 0.3s ease;
}

.close:hover {
  color: var(--ink);
}

.content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  animation: omFade 0.28s ease both;
}

.title {
  margin: 0 0 8px;
  font: 300 40px/1.08 var(--display);
  letter-spacing: -0.01em;
  text-wrap: pretty;
}

.meta {
  font: 400 11px/1 var(--mono);
  font-feature-settings: 'tnum';
  color: rgba(32, 31, 29, 0.45);
  margin-bottom: 26px;
}

.plates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
}

.plate {
  padding: 8px;
  background: #f3f0ec;
  border: 1px solid rgba(32, 31, 29, 0.12);
}

.hatch {
  height: 170px;
  background: repeating-linear-gradient(135deg, #e7e2db 0 6px, #f1ece5 6px 12px);
  display: flex;
  align-items: flex-end;
  padding: 9px;
}

.caption {
  font: 400 9.5px/1.4 var(--mono);
  color: #7d7979;
}

.shot {
  display: block;
  width: 100%;
  height: 170px;
  object-fit: cover;
  filter: grayscale(1) contrast(1.03);
  transition: filter 0.4s var(--ease);
}

.plate:hover .shot {
  filter: none;
}

.body {
  margin: 0 0 30px;
  font: 400 15px/1.85 var(--serif);
  color: var(--prose);
  text-align: justify;
  hyphens: auto;
}

.skills {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skillhead {
  font: 400 10.5px/1 var(--serif);
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(32, 31, 29, 0.45);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  font: 400 11px/1 var(--mono);
  letter-spacing: 0.06em;
  padding: 7px 11px;
  border: 1px solid rgba(182, 130, 53, 0.45);
  color: var(--accent);
  border-radius: 4px;
}

.link {
  display: inline-block;
  margin-top: 26px;
  font: 400 11px/1.6 var(--mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(182, 130, 53, 0.55);
  padding-bottom: 2px;
}

/* Moves within the section only; both arrows stop at the ends. Pinned below
   the scrolling content so it stays reachable in a long entry. */
.nav {
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--rule-soft);
}

.count {
  font: 400 9.5px/1 var(--mono);
  font-feature-settings: 'tnum';
  letter-spacing: 0.14em;
  color: rgba(32, 31, 29, 0.45);
}

.arrows {
  display: flex;
  gap: 14px;
}

.arrows button {
  font: 400 16px/1 var(--mono);
  color: var(--accent);
  padding: 0 3px;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.arrows button:hover:not(:disabled) {
  color: var(--ink);
}

.arrows button:disabled {
  opacity: 0.22;
}

@media (max-width: 720px) {
  .scrim {
    padding: 16px;
  }

  .panel {
    width: 100%;
    height: 92vh;
    padding: 28px 22px 32px;
  }

  .title {
    font-size: 30px;
  }

  .plates {
    gap: 10px;
  }

  .hatch,
  .shot {
    height: 130px;
  }

  .body {
    text-align: left;
  }
}
</style>
