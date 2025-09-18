<template>
  <canvas 
    ref="threeCanvas"
    class="holographic-background"
    :class="{ 
      'reduced-motion': prefersReducedMotion,
      'loaded': isLoaded
    }"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// Props for customization
interface Props {
  opacity?: number
  baseColor?: string
  hoverColor?: string
  animationSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  opacity: 0.4,
  baseColor: '#40e0d0',
  hoverColor: '#00ff88',
  animationSpeed: 1
})

// Refs
const threeCanvas = ref<HTMLCanvasElement | null>(null)
const prefersReducedMotion = ref(false)
const isLoaded = ref(false)
const isLoading = ref(true)

// 3D Scene variables
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let objectGroup: THREE.Group
let mainObject: THREE.LineSegments
let coreObject: THREE.LineSegments
let particles: THREE.Mesh[] = []
let mainMaterial: THREE.LineBasicMaterial
let coreMaterial: THREE.LineBasicMaterial

// Animation properties
let isHovering = false
const baseRotationSpeed = 0.002 * props.animationSpeed
const hoverRotationSpeed = 0.008 * props.animationSpeed
let currentRotationSpeed = baseRotationSpeed
let targetRotationSpeed = baseRotationSpeed

// Color properties
const baseColor = new THREE.Color(props.baseColor)
const hoverColor = new THREE.Color(props.hoverColor)
let currentColor = baseColor.clone()
let targetColor = baseColor.clone()

// Animation frame ID for cleanup
let animationFrameId: number

// Define component emits
const emit = defineEmits(['loaded'])

const init = () => {
  if (!threeCanvas.value) return

  isLoading.value = true

  // Scene setup
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0f14, 10, 50)

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  )
  camera.position.z = 15

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x0a0f14, 0.1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0x40e0d0, 0.3)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x00ff88, 1, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // Mark as loaded after a short delay to ensure everything is ready
  setTimeout(() => {
    isLoaded.value = true
    isLoading.value = false
    emit('loaded')
  }, 100)
}

const createObjects = () => {
  // Create main group for all objects
  objectGroup = new THREE.Group()
  scene.add(objectGroup)

  // Create wireframe dodecahedron (main object)
  createMainObject()
  
  // Create orbiting particles
  createOrbitingParticles()
  
  // Create background grid
  createBackgroundGrid()
}

const createMainObject = () => {
  // Dodecahedron geometry for a complex, interesting shape
  const geometry = new THREE.DodecahedronGeometry(3, 1)
  
  // Wireframe material with holographic properties
  mainMaterial = new THREE.LineBasicMaterial({
    color: baseColor,
    transparent: true,
    opacity: props.opacity,
    linewidth: 2
  })

  // Convert geometry to wireframe
  const wireframe = new THREE.WireframeGeometry(geometry)
  mainObject = new THREE.LineSegments(wireframe, mainMaterial)
  
  objectGroup.add(mainObject)

  // Add inner core (smaller, brighter)
  const coreGeometry = new THREE.IcosahedronGeometry(1.5, 0)
  coreMaterial = new THREE.LineBasicMaterial({
    color: hoverColor,
    transparent: true,
    opacity: props.opacity * 0.5,
    linewidth: 1
  })
  
  const coreWireframe = new THREE.WireframeGeometry(coreGeometry)
  coreObject = new THREE.LineSegments(coreWireframe, coreMaterial)
  objectGroup.add(coreObject)
}

const createOrbitingParticles = () => {
  const particleCount = 20
  
  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.02, 4, 4)
    const material = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: props.opacity * 1.5
    })
    
    const particle = new THREE.Mesh(geometry, material)
    
    // Random orbital positions
    const radius = 5 + Math.random() * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    particle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    )
    
    // Store orbital properties
    particle.userData = {
      radius: radius,
      theta: theta,
      phi: phi,
      speed: (0.001 + Math.random() * 0.002) * props.animationSpeed
    }
    
    particles.push(particle)
    objectGroup.add(particle)
  }
}

const createBackgroundGrid = () => {
  // Create a subtle background grid
  const gridGeometry = new THREE.PlaneGeometry(50, 50, 20, 20)
  const gridMaterial = new THREE.LineBasicMaterial({
    color: 0x40e0d0,
    transparent: true,
    opacity: 0.03,
    linewidth: 1
  })
  
  const grid = new THREE.WireframeGeometry(gridGeometry)
  const gridMesh = new THREE.LineSegments(grid, gridMaterial)
  gridMesh.position.z = -20
  scene.add(gridMesh)
}

const onMouseEnter = () => {
  isHovering = true
  targetRotationSpeed = hoverRotationSpeed
  targetColor = hoverColor
}

const onMouseLeave = () => {
  isHovering = false
  targetRotationSpeed = baseRotationSpeed
  targetColor = baseColor
}

const onWindowResize = () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const updateAnimation = () => {
  if (!objectGroup) return

  // Smooth rotation speed transition
  currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.1
  
  // Smooth color transition
  currentColor.lerp(targetColor, 0.05)
  
  // Update material colors
  if (mainMaterial) {
    mainMaterial.color.copy(currentColor)
  }
  
  // Rotate main object
  objectGroup.rotation.y += currentRotationSpeed
  objectGroup.rotation.x += currentRotationSpeed * 0.5
  
  // Rotate core object independently
  if (coreObject) {
    coreObject.rotation.x += currentRotationSpeed * 1.5
    coreObject.rotation.y -= currentRotationSpeed * 2
  }
  
  // Update orbiting particles
  particles.forEach((particle) => {
    const userData = particle.userData
    userData.theta += userData.speed
    
    const radius = userData.radius
    const theta = userData.theta
    const phi = userData.phi + Math.sin(userData.theta * 2) * 0.1
    
    particle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    )
    
    // Update particle opacity based on hover state
    const targetOpacity = (isHovering ? props.opacity * 2 : props.opacity * 1.5)
    const material = particle.material as THREE.MeshBasicMaterial
    material.opacity += (targetOpacity - material.opacity) * 0.1
  })
  
  // Subtle pulsing effect
  const time = Date.now() * 0.001
  const pulse = Math.sin(time * 2) * 0.05 + 0.95
  objectGroup.scale.setScalar(pulse)
}

const animate = () => {
  if (prefersReducedMotion.value) return
  
  animationFrameId = requestAnimationFrame(animate)
  
  updateAnimation()
  renderer.render(scene, camera)
}

const setupEventListeners = () => {
  if (!threeCanvas.value) return
  
  // Mouse hover events
  threeCanvas.value.addEventListener('mouseenter', onMouseEnter)
  threeCanvas.value.addEventListener('mouseleave', onMouseLeave)
  
  // Window resize
  window.addEventListener('resize', onWindowResize)
}

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (threeCanvas.value) {
    threeCanvas.value.removeEventListener('mouseenter', onMouseEnter)
    threeCanvas.value.removeEventListener('mouseleave', onMouseLeave)
  }
  
  window.removeEventListener('resize', onWindowResize)
  
  // Dispose of Three.js resources
  if (renderer) {
    renderer.dispose()
  }
  
  // Clean up geometries and materials
  particles.forEach(particle => {
    particle.geometry.dispose()
    const material = particle.material as THREE.MeshBasicMaterial
    material.dispose()
  })
}

onMounted(() => {
  // Check for reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  
  // Listen for changes in reduced motion preference
  mediaQuery.addListener((e) => {
    prefersReducedMotion.value = e.matches
    if (e.matches) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    } else {
      animate()
    }
  })
  
  if (!prefersReducedMotion.value) {
    init()
    createObjects()
    setupEventListeners()
    animate()
  }
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.holographic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.holographic-background.loaded {
  opacity: 0.6;
}

.holographic-background.reduced-motion {
  display: none;
}

/* Ensure the canvas doesn't interfere with other content */
.holographic-background {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
