import { ref } from 'vue'
import { playSound } from '../../utils/sound'

type HologramCategory = 'experience' | 'projects' | 'extracurriculars'

interface HologramCardData {
  category?: HologramCategory
  name: string
  period: string
  type: string
  description?: string
  skills?: string[]
  link?: string
  image?: string
}

const activeHologramCard = ref<HologramCardData | null>(null)

const showHologramCard = (card: HologramCardData) => {
  activeHologramCard.value = card
  playSound('modalOpen', 0.32)
}

const hideHologramCard = () => {
  if (activeHologramCard.value) {
    playSound('modalClose', 0.28)
  }
  activeHologramCard.value = null
}

export {
  activeHologramCard,
  showHologramCard,
  hideHologramCard,
  type HologramCardData,
  type HologramCategory,
}
