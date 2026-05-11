import { ref } from 'vue'

type SoundKey =
  | 'uiClick'
  | 'modalOpen'
  | 'modalClose'
  | 'terminalSuccess'
  | 'terminalError'

const SOUND_STORAGE_KEY = 'portfolio_sound_enabled'

const SOUND_SOURCES: Record<SoundKey, string> = {
  uiClick: '/assets/sounds/ui-click.mp3',
  modalOpen: '/assets/sounds/modal-open.mp3',
  modalClose: '/assets/sounds/modal-close.wav',
  terminalSuccess: '/assets/sounds/terminal-success.wav',
  terminalError: '/assets/sounds/terminal-error.wav',
}

const hasWindow = typeof window !== 'undefined'
const initialEnabled = hasWindow
  ? window.localStorage.getItem(SOUND_STORAGE_KEY) !== 'false'
  : true

const soundEnabled = ref(initialEnabled)
const audioCache = new Map<SoundKey, HTMLAudioElement>()

const getAudio = (key: SoundKey) => {
  const cached = audioCache.get(key)
  if (cached) return cached

  const audio = new Audio(SOUND_SOURCES[key])
  audio.preload = 'auto'
  audioCache.set(key, audio)
  return audio
}

const setSoundEnabled = (enabled: boolean) => {
  soundEnabled.value = enabled
  if (hasWindow) {
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled))
  }
}

const toggleSoundEnabled = () => {
  const next = !soundEnabled.value
  setSoundEnabled(next)
  return next
}

const playSound = (key: SoundKey, volume = 0.4) => {
  if (!soundEnabled.value) return

  try {
    const audio = getAudio(key)
    audio.volume = Math.min(Math.max(volume, 0), 1)
    audio.currentTime = 0
    const maybePromise = audio.play()
    if (maybePromise && typeof maybePromise.catch === 'function') {
      maybePromise.catch(() => {
        // no-op: autoplay restriction or file failure
      })
    }
  } catch {
    // no-op: missing file or autoplay restriction
  }
}

export {
  soundEnabled,
  setSoundEnabled,
  toggleSoundEnabled,
  playSound,
  type SoundKey,
}
