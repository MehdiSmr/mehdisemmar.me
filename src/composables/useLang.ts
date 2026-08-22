import { ref, watch } from 'vue'
import type { Lang } from '../data/content'

const STORAGE_KEY = 'lang'

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'fr') return stored
  } catch {
    // private mode or blocked storage — fall through to the browser preference
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export const lang = ref<Lang>(initialLang())

export function setLang(next: Lang) {
  lang.value = next
}

watch(
  lang,
  (next) => {
    document.documentElement.lang = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // nothing to do — the choice just won't persist
    }
  },
  { immediate: true }
)
