<template>
  <div
    class="holo-scene"
    :class="{ dragging }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="holo-card" :style="{ transform: `rotateY(${rotationY}deg)` }">
      <img class="profile-image" :src="imageSrc" alt="Me" draggable="false" />
      <div class="holo-overlay"></div>
      <div class="holo-prism"></div>
      <div class="holo-scanline"></div>
      <div class="holo-glow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const imageSrc = ref('/me.jpeg')
const rotationY = ref(0)
const dragging = ref(false)
const lastX = ref(0)
const activePointerId = ref<number | null>(null)
const angularVelocity = ref(0)

let inertiaFrameId: number | null = null

const ROTATION_SENSITIVITY = 0.7
const INERTIA_DAMPING = 0.94
const MIN_INERTIA_SPEED = 0.02

const stopInertia = () => {
  if (inertiaFrameId) {
    cancelAnimationFrame(inertiaFrameId)
    inertiaFrameId = null
  }
}

const startInertia = () => {
  stopInertia()

  const animate = () => {
    if (dragging.value) return

    if (Math.abs(angularVelocity.value) < MIN_INERTIA_SPEED) {
      angularVelocity.value = 0
      inertiaFrameId = null
      return
    }

    rotationY.value += angularVelocity.value
    angularVelocity.value *= INERTIA_DAMPING
    inertiaFrameId = requestAnimationFrame(animate)
  }

  inertiaFrameId = requestAnimationFrame(animate)
}

const onPointerDown = (event: PointerEvent) => {
  const element = event.currentTarget as HTMLElement | null

  dragging.value = true
  activePointerId.value = event.pointerId
  lastX.value = event.clientX
  angularVelocity.value = 0
  stopInertia()

  element?.setPointerCapture?.(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value || activePointerId.value !== event.pointerId) return

  const delta = event.clientX - lastX.value
  lastX.value = event.clientX

  const step = delta * ROTATION_SENSITIVITY
  rotationY.value += step
  angularVelocity.value = step

  event.preventDefault()
}

const onPointerUp = (event: PointerEvent) => {
  if (activePointerId.value !== event.pointerId) return

  const element = event.currentTarget as HTMLElement | null
  element?.releasePointerCapture?.(event.pointerId)

  dragging.value = false
  activePointerId.value = null
  startInertia()
}

onUnmounted(() => {
  stopInertia()
})
</script>

<style scoped>
.holo-scene {
  margin-top: 0;
  perspective: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  user-select: none;
  touch-action: none;
  animation: floatScene 4s ease-in-out infinite;
}

.holo-scene {
  cursor: auto !important;
}

.holo-card:hover,
.holo-card:hover *,
.holo-scene.dragging,
.holo-scene.dragging * {
  cursor: grab !important;
}

.holo-card {
  position: relative;
  width: clamp(220px, 28vw, 360px);
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(64, 224, 208, 0.5);
  background: linear-gradient(160deg, rgba(10, 16, 20, 0.8), rgba(5, 8, 12, 0.92));
  transform-style: preserve-3d;
  transition: none;
  will-change: transform;
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.35),
    0 0 28px rgba(64, 224, 208, 0.25),
    0 0 50px rgba(0, 255, 200, 0.12);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.05) contrast(1.05);
}

.holo-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg, rgba(64, 224, 208, 0.1), transparent 35%),
    linear-gradient(300deg, rgba(0, 255, 136, 0.12), transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 55%);
  mix-blend-mode: screen;
  pointer-events: none;
  animation: holoPulse 5.5s ease-in-out infinite;
}

.holo-prism {
  position: absolute;
  inset: -20%;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(64, 224, 208, 0.14) 35%,
    rgba(255, 0, 255, 0.12) 48%,
    rgba(0, 255, 136, 0.14) 62%,
    transparent 78%
  );
  transform: translateX(-55%) rotate(8deg);
  mix-blend-mode: screen;
  pointer-events: none;
  animation: prismSweep 5.8s ease-in-out infinite;
}

.holo-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03) 0,
    rgba(255, 255, 255, 0.03) 1px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  opacity: 0.6;
}

.holo-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 0 24px rgba(64, 224, 208, 0.25),
    inset 0 0 48px rgba(0, 255, 136, 0.12);
  animation: edgeGlow 2.8s ease-in-out infinite;
}

@keyframes floatScene {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes holoPulse {
  0%,
  100% {
    opacity: 0.55;
    filter: hue-rotate(0deg);
  }
  50% {
    opacity: 0.82;
    filter: hue-rotate(22deg);
  }
}

@keyframes prismSweep {
  0%,
  100% {
    transform: translateX(-55%) rotate(8deg);
    opacity: 0.35;
  }
  50% {
    transform: translateX(55%) rotate(8deg);
    opacity: 0.8;
  }
}

@keyframes edgeGlow {
  0%,
  100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}

</style>
