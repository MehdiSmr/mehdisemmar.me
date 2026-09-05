<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Photos, in order. However many there are is however many slides. */
    images?: string[]
    /** Alt text stem; each slide gets its index appended. */
    alt?: string
  }>(),
  { images: () => [], alt: '' }
)

/** A slot carries its real index, so clones still number correctly. */
interface Slot {
  src: string
  n: number
}

const track = ref<HTMLElement | null>(null)
/** Index into `view`, including the cloned ends. */
const slot = ref(0)

/** Photos that failed to load; they drop out rather than leaving a gap. */
const broken = ref(new Set<string>())

const real = computed<Slot[]>(() =>
  props.images
    .map((src, n) => ({ src, n }))
    .filter((s) => s.src !== '' && !broken.value.has(s.src))
)

const many = computed(() => real.value.length > 1)

/**
 * The last slide is cloned before the first and the first after the last, so a
 * wrap scrolls forward into a clone and is silently repositioned once it
 * settles. That makes the last-to-first step animate like any other.
 */
const view = computed<Slot[]>(() => {
  const r = real.value
  if (r.length < 2) return r
  return [r[r.length - 1], ...r, r[0]]
})

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
  <!-- No photos, no plate: an entry without images shows nothing at all. -->
  <figure v-if="real.length" class="plate">
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
          class="shot"
          :src="s.src"
          :alt="alt ? `${alt}, photo ${s.n + 1}` : ''"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          @error="broken = new Set(broken).add(s.src)"
        />
      </div>
    </div>

    <!-- The arrows are the whole control; there is no counter beside them. -->
    <figcaption v-if="many" class="bar">
      <button type="button" aria-label="Previous" @click="step(-1)">‹</button>
      <button type="button" aria-label="Next" @click="step(1)">›</button>
    </figcaption>
  </figure>
</template>

<style scoped>
/* The photograph sits on the page directly — no mat, no border. */
.plate {
  margin: 6px 0;
  max-width: 540px;
}

.track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}

/* A lone photo should behave exactly as a plain plate would. */
.track.single {
  overflow-x: hidden;
}

.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.shot {
  display: block;
  width: 100%;
  height: 230px;
  /* `contain`, not `cover`: the whole frame stays visible. The leftover space
     is the page's own white, so nothing frames the photo. The fixed height
     keeps slides from jumping as you move between them. */
  object-fit: contain;
  /* Pinned left, so a narrow photo lines up with the text beside it rather
     than floating in the middle of the slide. */
  object-position: left center;
  background: var(--ground);
}

/* Left, under the photo's own left edge. */
.bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 9px 1px 1px;
}

.bar button {
  font: 400 16px/1 var(--serif);
  color: var(--gray);
  padding: 0 2px;
  transition: color 0.3s ease;
}

.bar button:hover,
.bar button:active {
  color: var(--ink);
}

@media (max-width: 720px) {
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
