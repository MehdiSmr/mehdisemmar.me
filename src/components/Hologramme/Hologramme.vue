<script lang="ts" setup>
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import * as THREE from 'three'
import { computed, onUnmounted, ref, watch } from 'vue'
import { activeHologramCard } from './cardState'
const { onLoop } = useRenderLoop()

const rotationY = ref(0)
const cardY = ref(1.75)
const cardTiltX = ref(0)
const cardScale = ref(0)
const cardOpacity = ref(0)
const cardTexture = ref<THREE.CanvasTexture | null>(null)
const scanTexture = ref<THREE.CanvasTexture | null>(null)
const hasCard = computed(() => !!activeHologramCard.value)
let textureRequestId = 0
let floatPhase = 0
let scanOffset = 0

const normalizeImagePath = (image: string) => {
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    if (image.startsWith('./')) return `/${image.slice(2)}`
    return image
}

const loadCardImage = async (imagePath?: string) => {
    if (!imagePath) return null

    const normalizedPath = normalizeImagePath(imagePath)
    return new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => resolve(image)
        image.onerror = () => resolve(null)
        image.src = normalizedPath
    })
}

const setCardTexture = (nextTexture: THREE.CanvasTexture | null) => {
    if (cardTexture.value && cardTexture.value !== nextTexture) {
        cardTexture.value.dispose()
    }
    cardTexture.value = nextTexture
}

const setScanTexture = (nextTexture: THREE.CanvasTexture | null) => {
    if (scanTexture.value && scanTexture.value !== nextTexture) {
        scanTexture.value.dispose()
    }
    scanTexture.value = nextTexture
}

const createScanTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(0.45, 'rgba(64, 224, 208, 0.03)')
    gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.33)')
    gradient.addColorStop(0.55, 'rgba(64, 224, 208, 0.03)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 2.4)
    texture.needsUpdate = true

    return texture
}

const ensureScanTexture = () => {
    if (!scanTexture.value) {
        const texture = createScanTexture()
        if (texture) setScanTexture(texture)
    }
}

const getFittedFont = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, minSize: number) => {
    let size = startSize
    while (size > minSize) {
        ctx.font = `bold ${size}px "Courier New", monospace`
        if (ctx.measureText(text).width <= maxWidth) break
        size -= 2
    }
    return `bold ${Math.max(size, minSize)}px "Courier New", monospace`
}

const drawCardTexture = async () => {
    const card = activeHologramCard.value
    if (!card) {
        setCardTexture(null)
        return
    }

    const requestId = ++textureRequestId
    const loadedImage = await loadCardImage(card.image)
    if (requestId !== textureRequestId) return

    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(10, 15, 20, 0.97)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    borderGradient.addColorStop(0, '#40e0d0')
    borderGradient.addColorStop(0.5, '#00ff88')
    borderGradient.addColorStop(1, '#40e0d0')
    ctx.strokeStyle = borderGradient
    ctx.lineWidth = 8
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32)

    for (let y = 24; y < canvas.height - 24; y += 4) {
        ctx.fillStyle = 'rgba(64, 224, 208, 0.07)'
        ctx.fillRect(24, y, canvas.width - 48, 1.5)
    }

    const drawCrispText = (
      text: string,
      x: number,
      y: number,
      fillStyle: string,
      font: string,
      strokeStyle = 'rgba(0, 0, 0, 0.9)',
      lineWidth = 3,
    ) => {
      ctx.font = font
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = strokeStyle
      ctx.strokeText(text, x, y)
      ctx.fillStyle = fillStyle
      ctx.fillText(text, x, y)
    }

    const cardTypeLabel = card.type.replace(/_/g, ' ')
    const nameFont = getFittedFont(ctx, card.name, 520, 52, 34)
    const typeFont = getFittedFont(ctx, cardTypeLabel, 520, 28, 20)

    drawCrispText((card.category || 'hologram').toUpperCase(), 48, 70, '#00ff88', 'bold 28px "Courier New", monospace', 'rgba(0, 0, 0, 0.9)', 3)
    drawCrispText(card.name, 48, 140, '#e8fdff', nameFont, 'rgba(0, 0, 0, 0.92)', 4)
    drawCrispText(card.period, 48, 190, '#9ed6e6', 'bold 29px "Courier New", monospace', 'rgba(0, 0, 0, 0.88)', 3)
    drawCrispText(cardTypeLabel, 48, 245, '#c8f5ff', typeFont, 'rgba(0, 0, 0, 0.94)', 3)

    const imageX = 612
    const imageY = 74
    const imageW = 360
    const imageH = 220
    ctx.fillStyle = 'rgba(64, 224, 208, 0.14)'
    ctx.fillRect(imageX, imageY, imageW, imageH)
    ctx.strokeStyle = 'rgba(64, 224, 208, 0.58)'
    ctx.lineWidth = 3
    ctx.strokeRect(imageX, imageY, imageW, imageH)
    if (loadedImage) {
        ctx.drawImage(loadedImage, imageX, imageY, imageW, imageH)
    } else {
        ctx.fillStyle = '#40e0d0'
        ctx.font = 'bold 24px "Courier New", monospace'
        ctx.fillText('NO PREVIEW', imageX + 95, imageY + 120)
    }

    const summary = (card.description || card.skills?.join(' • ') || '').slice(0, 180)
    if (summary) {
        ctx.fillStyle = '#f1fcff'
        ctx.font = 'bold 24px "Courier New", monospace'
        const maxWidth = 540
        const words = summary.split(' ')
        let line = ''
        let y = 300
        for (const word of words) {
            const test = `${line}${word} `
            if (ctx.measureText(test).width > maxWidth) {
                drawCrispText(line.trim(), 48, y, '#f1fcff', 'bold 24px "Courier New", monospace', 'rgba(0, 0, 0, 0.88)', 2)
                line = `${word} `
                y += 36
            } else {
                line = test
            }
            if (y > 520) break
        }
        if (line && y <= 520) {
          drawCrispText(line.trim(), 48, y, '#f1fcff', 'bold 24px "Courier New", monospace', 'rgba(0, 0, 0, 0.88)', 2)
        }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    setCardTexture(texture)
}

watch(activeHologramCard, () => {
    drawCardTexture()
}, { immediate: true })

onUnmounted(() => {
    setCardTexture(null)
    setScanTexture(null)
})

onLoop(() => {
    ensureScanTexture()
    if (scanTexture.value) {
      scanOffset = (scanOffset + 0.011) % 1
      scanTexture.value.offset.y = -scanOffset
      scanTexture.value.needsUpdate = true
    }

    floatPhase += 0.028
    rotationY.value = Math.sin(floatPhase) * 0.12
    cardY.value = 1.75 + Math.sin(floatPhase * 1.2) * 0.11
    cardTiltX.value = Math.sin(floatPhase * 0.8) * 0.04
    const targetScale = hasCard.value ? 1 : 0
    const targetOpacity = hasCard.value ? 0.92 : 0
    cardScale.value += (targetScale - cardScale.value) * 0.12
    cardOpacity.value += (targetOpacity - cardOpacity.value) * 0.12
})

</script>

<template>
    <div id="hologramme">
        <TresCanvas>
            <TresPerspectiveCamera :position="[0, 1, 6.2]"/>
            <TresMesh
              :position="[0, cardY, 0]"
              :rotation="[cardTiltX, rotationY, 0]"
              :scale="[Math.max(cardScale, 0.001), Math.max(cardScale, 0.001), 1]"
            >
                <TresPlaneGeometry :args="[3.95, 2.55]" />
                <TresMeshStandardMaterial
                  color="#0a0f14"
                  :emissive="'#40e0d0'"
                  :emissiveIntensity="0.08"
                  :transparent="true"
                  :opacity="Math.max(cardOpacity * 0.3, 0)"
                  :side="THREE.DoubleSide"
                />
            </TresMesh>
            <TresMesh
              :position="[0, cardY, -0.08]"
              :rotation="[cardTiltX, rotationY, 0]"
              :scale="[Math.max(cardScale, 0.001), Math.max(cardScale, 0.001), 1]"
            >
                <TresPlaneGeometry :args="[3.95, 2.55]" />
                <TresMeshStandardMaterial
                  :map="cardTexture || undefined"
                  color="#ffffff"
                  :emissive="'#40e0d0'"
                  :emissiveIntensity="0.12"
                  :transparent="true"
                  :opacity="cardOpacity"
                  :side="THREE.DoubleSide"
                />
            </TresMesh>
            <TresMesh
              :position="[0, cardY, -0.11]"
              :rotation="[cardTiltX, rotationY, 0]"
              :scale="[Math.max(cardScale, 0.001), Math.max(cardScale, 0.001), 1]"
            >
                <TresPlaneGeometry :args="[3.95, 2.55]" />
                <TresMeshBasicMaterial
                  :map="scanTexture || undefined"
                  color="#40e0d0"
                  :transparent="true"
                  :opacity="Math.max(cardOpacity * 0.27, 0)"
                  :side="THREE.DoubleSide"
                  :blending="THREE.AdditiveBlending"
                  :depthWrite="false"
                />
            </TresMesh>
            <TresAmbientLight :intensity="0.45" />
            <TresPointLight :position="[3, 3, 5]" :intensity="0.7" color="#40e0d0" />
        </TresCanvas>
    </div>
</template>

<style scoped>
#hologramme {
    position: fixed;
    top: 15%;
    width: 50%;
    height: 80%;
    right: 0;
    filter: drop-shadow(0 0 20px rgba(64, 224, 208, 0.25));
    mask-image: linear-gradient(to top, transparent, black 22%, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, transparent, black 22%, black 80%, transparent 100%);
}

@media screen and (max-width: 1024px) {
    #hologramme {
        width: 50%;
        height: 64%;
        top: 16%;
        right: 0;
    }
}

@media screen and (max-width: 768px) {
    #hologramme {
        width: 50%;
        height: 56%;
        top: 17%;
        right: 0;
    }
}
</style>
