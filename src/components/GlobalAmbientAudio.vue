<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { soundEnabled } from '../utils/sound'

const ambientAudio = ref<HTMLAudioElement | null>(null)

const syncAmbientPlayback = () => {
  const audio = ambientAudio.value
  if (!audio) return

  if (!soundEnabled.value) {
    audio.pause()
    return
  }

  const maybePromise = audio.play()
  if (maybePromise && typeof maybePromise.catch === 'function') {
    maybePromise.catch(() => {
      // blocked until user gesture; retried on interaction
    })
  }
}

const unlockAmbientPlayback = () => {
  syncAmbientPlayback()
}

watch(soundEnabled, () => {
  syncAmbientPlayback()
})

onMounted(() => {
  syncAmbientPlayback()
  window.addEventListener('pointerdown', unlockAmbientPlayback, { passive: true })
  window.addEventListener('keydown', unlockAmbientPlayback)
  window.addEventListener('touchstart', unlockAmbientPlayback, { passive: true })
})

onUnmounted(() => {
  ambientAudio.value?.pause()
  window.removeEventListener('pointerdown', unlockAmbientPlayback)
  window.removeEventListener('keydown', unlockAmbientPlayback)
  window.removeEventListener('touchstart', unlockAmbientPlayback)
})
</script>

<template>
  <audio
    ref="ambientAudio"
    src="/assets/sounds/terminal-ambience-loop.wav"
    loop
    preload="auto"
    class="ambient-audio"
  />
</template>

<style scoped>
.ambient-audio {
  display: none;
}
</style>
