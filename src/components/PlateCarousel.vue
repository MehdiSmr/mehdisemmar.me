<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Real images, in order. However many there are is however many slides. */
    images?: string[]
    /** Mono caption shown on the blank plate. */
    caption: string
    /** Alt text stem; each slide gets its index appended. */
    alt?: string
  }>(),
  { images: () => [], alt: '' }
)

/** A slot carries its real index, so clones still caption and number correctly. */
interface Slot {
  src: string
  n: number
}

const track = ref<HTMLElement | null>(null)
/** Index into `view`, including the cloned ends. */
const slot = ref(0)

/** Slides that failed to load, so a missing fallback file shows the hatch. */
const broken = ref(new Set<string>())

const real = computed<Slot[]>(() => {
  // No photos yet: a single blank plate, not a strip of them.
  const src = props.images.length > 0 ? props.images : ['']
  return src.map((s, n) => ({ src: broken.value.has(s) ? '' : s, n }))
})

const many = computed(() => real.value.length > 1)

/**
 * The last slide is cloned before the first and the first after the last, so a
 * wrap scrolls forward into a clone and is silently repositioned once it
 * settles. That makes 03 → 01 animate like any other step.
 */
const view = computed<Slot[]>(() => {
  const r = real.value
  if (r.length < 2) return r
  return [r[r.length - 1], ...r, r[0]]
})

const at = computed(() => view.value[slot.value]?.n ?? 0)
const counter = computed(
  () => `${String(at.value + 1).padStart(2, '0')} / ${String(real.value.length).padStart(2, '0')}`
)

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

function jump(i: number, smooth: boolean) {
  const el = track.value
  if (!el || el.clientWidth === 0) return
  el.scrollTo({ left: i * el.clientWidth, behavior: smooth && !reduced() ? 'smooth' : 'auto' })
}

function step(dir: number) {
  const el = track.value
  if (!el || el.clientWidth === 0) return
  const i = Math.round(el.scrollLeft / el.clientWidth) + dir
  jump(Math.max(0, Math.min(i, view.value.length - 1)), true)
}

/** Once a scroll into a cloned end settles, hop to its real twin without animating. */
function settle() {
  const el = track.value
  if (!el || !many.value || el.clientWidth === 0) return
  const n = real.value.length
  const i = Math.round(el.scrollLeft / el.clientWidth)
  if (i === 0) jump(n, false)
  else if (i === n + 1) jump(1, false)
}

let frame = 0
let timer = 0
function onScroll() {
  if (!frame) {
    frame = requestAnimationFrame(() => {
      frame = 0
      const el = track.value
      if (!el || el.clientWidth === 0) return
      slot.value = Math.round(el.scrollLeft / el.clientWidth)
    })
  }
  clearTimeout(timer)
  timer = setTimeout(settle, 140)
}

/** Widths are in pixels, so a resize has to re-anchor the current slide. */
function onResize() {
  jump(slot.value, false)
}

onMounted(async () => {
  track.value?.addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onResize)
  await nextTick()
  if (many.value) {
    slot.value = 1
    jump(1, false)
  }
})

onBeforeUnmount(() => {
  track.value?.removeEventListener('scroll', onScroll)
  removeEventListener('resize', onResize)
  if (frame) cancelAnimationFrame(frame)
  clearTimeout(timer)
})
</script>

<template>
  <figure class="plate">
    <div
      ref="track"
      class="track"
      :class="{ single: !many }"
      :tabindex="many ? 0 : undefined"
      role="group"
      aria-roledescription="carousel"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
    >
      <div v-for="(s, i) in view" :key="i" class="slide">
        <img
          v-if="s.src"
          class="shot"
          :src="s.src"
          :alt="alt ? `${alt}, photo ${s.n + 1}` : ''"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          @error="broken = new Set(broken).add(s.src)"
        />
        <div v-else class="hatch">
          <div class="caption">{{ caption }}</div>
        </div>
      </div>
    </div>

    <figcaption v-if="many" class="bar">
      <span class="count">{{ counter }}</span>
      <span class="arrows">
        <button type="button" aria-label="Previous" @click="step(-1)">‹</button>
        <button type="button" aria-label="Next" @click="step(1)">›</button>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.plate {
  margin: 6px 0;
  padding: 9px;
  max-width: 540px;
  background: #f3f0ec;
  border: 1px solid rgba(32, 31, 29, 0.12);
}

.track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}

/* A lone plate should behave exactly as it did before the carousel existed. */
.track.single {
  overflow-x: hidden;
}

.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.hatch {
  height: 230px;
  background: repeating-linear-gradient(135deg, #e7e2db 0 6px, #f1ece5 6px 12px);
  display: flex;
  align-items: flex-end;
  padding: 10px;
}

.caption {
  font: 400 9.5px/1.4 var(--mono);
  color: #7d7979;
}

.shot {
  display: block;
  width: 100%;
  height: 230px;
  /* `contain`, not `cover`: the whole frame stays visible and the leftover
     space is the mat's own colour, so a tall photo reads as mounted rather
     than cropped. The fixed height keeps slides from jumping as you move. */
  object-fit: contain;
  background: #f3f0ec;
  /* Desaturated at rest so heterogeneous photos read as one system. */
  filter: grayscale(1) contrast(1.03);
  transition: filter 0.4s var(--ease);
}

.plate:hover .shot,
.track:focus-visible .shot {
  filter: none;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 9px 1px 1px;
}

.count {
  font: 400 9.5px/1 var(--mono);
  font-feature-settings: 'tnum';
  letter-spacing: 0.14em;
  color: #7d7979;
}

.arrows {
  display: flex;
  gap: 10px;
}

.arrows button {
  font: 400 14px/1 var(--mono);
  color: var(--accent);
  padding: 0 2px;
  transition: color 0.3s ease;
}

.arrows button:hover {
  color: var(--ink);
}

@media (max-width: 720px) {
  .hatch,
  .shot {
    height: 180px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    scroll-behavior: auto;
  }
}
</style>
