<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as THREE from 'three'
import Terminal3D from '../components/Terminal3DSimple.vue'
import { experienceData, projectData } from '../data/portfolio'

const router = useRouter()
const { t, locale } = useI18n()

// Reactive state
const activeSection = ref(0)
const scrollState = reactive({
  lastScrollY: 0,
  direction: 'down' as 'up' | 'down',
  seenItems: new Set<Element>()
})

let scrollListener: (() => void) | null = null
let observerInstances: IntersectionObserver[] = []

// Static portfolio data - imported from separate file to avoid i18n parsing issues
const experienceItems = ref(experienceData)
const projectItems = ref(projectData)

// Cached DOM elements
const sectionElements = ref<{ [key: string]: HTMLElement }>({})

// 3D Holographic Background
const holographicCanvas = ref<HTMLCanvasElement | null>(null)
const prefersReducedMotion = ref(false)
const holographicBackgroundLoaded = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let objectGroup: THREE.Group
let mainObject: THREE.LineSegments
let coreObject: THREE.LineSegments
let particles: THREE.Mesh[] = []
let mainMaterial: THREE.LineBasicMaterial
let coreMaterial: THREE.LineBasicMaterial

const baseRotationSpeed = 0.001
const maxRotationSpeed = 0.02
let currentRotationSpeed = baseRotationSpeed
const baseScale = 1.0
const maxScale = 3.0
let currentScale = baseScale
let scrollProgress = 0
const objectColor = new THREE.Color(0x40e0d0)
let animationFrameId: number

// Update scroll direction
const updateScrollDirection = () => {
  const currentScrollY = window.scrollY
  scrollState.direction = currentScrollY > scrollState.lastScrollY ? 'down' : 'up'
  scrollState.lastScrollY = currentScrollY
}

// Update active section based on scroll position
const updateActiveSection = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 2
  let currentSection = 0
  
  const sections = ['section-0', 'section-1', 'section-2']
  
  for (let i = 0; i < sections.length; i++) {
    const element = sectionElements.value[sections[i]]
    if (element) {
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      
      if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
        currentSection = i
        break
      }
      
      if (i === sections.length - 1 && scrollPosition >= elementTop) {
        currentSection = i
      }
    }
  }
  
  activeSection.value = currentSection
}

// Unified animation setup for all scroll-triggered elements
const setupScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('.timeline-item, .modern-card')
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (scrollState.direction === 'down' && !scrollState.seenItems.has(entry.target)) {
          const delay = entry.target.classList.contains('modern-card') ? index * 100 : 0
          setTimeout(() => entry.target.classList.add('animate-in'), delay)
          scrollState.seenItems.add(entry.target)
        } else if (scrollState.seenItems.has(entry.target)) {
          entry.target.classList.add('animate-in')
        }
      } else if (scrollState.direction === 'up' && scrollState.seenItems.has(entry.target)) {
        entry.target.classList.remove('animate-in')
      }
    })
  }, { threshold: 0.2, rootMargin: '50px' })
  
  animatedElements.forEach(element => observer.observe(element))
  observerInstances.push(observer)
}

onMounted(() => {
  // Check for reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  
  // Listen for changes in reduced motion preference
  mediaQuery.addListener((e) => {
    prefersReducedMotion.value = e.matches
    if (e.matches && animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    } else if (!e.matches) {
      animateHolographic()
    }
  })
  
  // Cache DOM elements
  const sections = ['section-0', 'section-1', 'section-2']
  sections.forEach(id => {
    const element = document.getElementById(id)
    if (element) sectionElements.value[id] = element
  })
  
  // Setup scroll listener
  scrollListener = () => {
    updateScrollDirection()
    updateActiveSection()
  }
  
  window.addEventListener('scroll', scrollListener, { passive: true })
  window.addEventListener('resize', onHolographicResize)
  
  // Initialize animations after DOM is ready
  setTimeout(() => {
    updateActiveSection()
    setupScrollAnimations()
    
    // Initialize 3D background
    if (!prefersReducedMotion.value) {
      initHolographicBackground()
      createHolographicObjects()
      animateHolographic()
    }
  }, 500)
})

onUnmounted(() => {
  scrollListener && window.removeEventListener('scroll', scrollListener)
  window.removeEventListener('resize', onHolographicResize)
  observerInstances.forEach(observer => observer.disconnect())
  cleanupHolographic()
})

// Helper functions
const scrollToSection = (index: number) => {
  activeSection.value = index
  sectionElements.value[`section-${index}`]?.scrollIntoView({ behavior: 'smooth' })
}

const goToTerminal = () => router.push('/terminal-portfolio')
const toggleLanguage = () => locale.value = locale.value === 'en' ? 'fr' : 'en'
const scrollToTerminalSection = () => document.querySelector('.about-section')?.scrollIntoView({ behavior: 'smooth' })
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const initHolographicBackground = () => {
  if (!holographicCanvas.value || prefersReducedMotion.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0f14, 10, 50)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 15

  renderer = new THREE.WebGLRenderer({
    canvas: holographicCanvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x0a0f14, 0.0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  scene.add(new THREE.AmbientLight(0x40e0d0, 0.2))
  const pointLight = new THREE.PointLight(0x00ff88, 0.5, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)
  
  // Mark as loaded after a short delay to ensure everything is ready
  setTimeout(() => {
    holographicBackgroundLoaded.value = true
  }, 100)
}

const createHolographicObjects = () => {
  objectGroup = new THREE.Group()
  scene.add(objectGroup)

  mainMaterial = new THREE.LineBasicMaterial({ color: objectColor, transparent: true, opacity: 0.25 })
  const wireframe = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(3, 1))
  mainObject = new THREE.LineSegments(wireframe, mainMaterial)
  objectGroup.add(mainObject)

  coreMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15 })
  const coreWireframe = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.5, 0))
  coreObject = new THREE.LineSegments(coreWireframe, coreMaterial)
  objectGroup.add(coreObject)

  const particleCount = 1000
  
  for (let i = 0; i < particleCount; i++) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 4, 4),
      new THREE.MeshBasicMaterial({ color: objectColor, transparent: true, opacity: 0.4 })
    )
    
    const radius = 5 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    particle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    )
    
    particle.userData = { radius, theta, phi, speed: 0.0005 + Math.random() * 0.001 }
    particles.push(particle)
    objectGroup.add(particle)
  }

}

const calculateScrollProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress = Math.min(scrollTop / docHeight, 1)
}

const updateScrollBasedAnimation = () => {
  calculateScrollProgress()
  currentRotationSpeed = baseRotationSpeed + (maxRotationSpeed - baseRotationSpeed) * scrollProgress
  currentScale = baseScale + (maxScale - baseScale) * scrollProgress
}

const onHolographicResize = () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const updateHolographicAnimation = () => {
  if (!objectGroup) return

  updateScrollBasedAnimation()
  
  objectGroup.rotation.y += currentRotationSpeed
  objectGroup.rotation.x += currentRotationSpeed * 0.3
  
  const time = Date.now() * 0.0005
  const pulse = Math.sin(time * 2) * 0.02 + 0.98
  objectGroup.scale.setScalar(currentScale * pulse)
  
  if (coreObject) {
    coreObject.rotation.x += currentRotationSpeed * 1.2
    coreObject.rotation.y -= currentRotationSpeed * 1.5
  }
  
  particles.forEach((particle) => {
    const userData = particle.userData
    userData.theta += userData.speed * (1 + scrollProgress * 3)
    
    const radius = userData.radius
    const theta = userData.theta
    const phi = userData.phi + Math.sin(userData.theta * 2) * 0.05
    
    particle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    )
    
    const targetOpacity = 0.4 + scrollProgress * 0.3
    const material = particle.material as THREE.MeshBasicMaterial
    material.opacity += (targetOpacity - material.opacity) * 0.1
  })
}

const animateHolographic = () => {
  if (prefersReducedMotion.value) return
  
  animationFrameId = requestAnimationFrame(animateHolographic)
  
  updateHolographicAnimation()
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}


const cleanupHolographic = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (renderer) renderer.dispose()
  
  particles.forEach(particle => {
    particle.geometry.dispose()
    const material = particle.material as THREE.MeshBasicMaterial
    material.dispose()
  })
  
  particles = []
}
</script>

<template>
  <div class="lazy-portfolio">
    <!-- Mobile viewport optimization -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <!-- Background effect -->
    <div class="matrix-bg"></div>
    <!-- 3D Holographic Background -->
    <canvas 
      ref="holographicCanvas"
      class="holographic-background"
      :class="{ 
        'reduced-motion': prefersReducedMotion,
        'loaded': holographicBackgroundLoaded
      }"
    />
    
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-left">
          <div class="nav-user-name" @click="scrollToTop">mehdi@portfolio</div>
          <button @click="goToTerminal" class="nav-btn terminal-btn">
            <span class="terminal-icon">></span>
            <span class="terminal-icon">_</span>
            <span class="terminal-text">{{ t('nav.terminal') }}</span>
          </button>
          <a href="https://drive.google.com/file/d/1yAeZgKOKwJ5VYsKCBAKyI-1YeKvt0BVP/view?usp=sharing" target="_blank" class="nav-btn">
            {{ t('nav.resume') }}
          </a>
          <button @click="toggleLanguage" class="nav-btn">
            {{ locale === 'en' ? 'FR' : 'EN' }}
          </button>
        </div>
        <div class="nav-links">
          <a @click="scrollToTerminalSection" :class="{ active: activeSection === 0 }">{{ t('nav.about') }}</a>
          <a @click="scrollToSection(1)" :class="{ active: activeSection === 1 }">{{ t('nav.experience') }}</a>
          <a @click="scrollToSection(2)" :class="{ active: activeSection === 2 }">{{ t('nav.projects') }}</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="section-0" class="hero-section">
      <div class="hero-content">
        <div class="glitch-wrapper">
          <h1 class="glitch" data-text="MEHDI SEMMAR">MEHDI SEMMAR</h1>
        </div>
        <p class="subtitle typing">SOFTWARE_ENGINEER</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-label">STATUS:</span>
            <span class="stat-value online">ONLINE</span>
          </div>
          <div class="stat">
            <span class="stat-label">LOCATION:</span>
            <span class="stat-value">OTTAWA, ON</span>
          </div>
          <div class="stat">
            <span class="stat-label">GPA:</span>
            <span class="stat-value">4.0/4.0</span>
          </div>
        </div>
        <div class="cta-container">
          <button @click="scrollToTerminalSection" class="cta-button">
            <span>EXPLORE_PORTFOLIO</span>
            <span class="arrow">↓</span>
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="section-container">
        <h2 class="section-title">
            <span class="prompt">$</span> open -a Terminal
        </h2>
        <div class="about-container-centered">
            <Terminal3D v-if="holographicBackgroundLoaded || prefersReducedMotion" />
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="section-1" class="content-section experience-timeline">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> cat ~/experience.log
        </h2>
        <div class="timeline-container">
          <div class="timeline-line"></div>
          <div v-for="(item, index) in experienceItems" :key="index" class="timeline-item" :class="{ 'timeline-right': index % 2 === 1 }" :style="{ animationDelay: (index * 0.2) + 's' }">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <!-- Timeline Date - positioned on opposite side of card -->
            <div class="timeline-date" :class="{ 'timeline-date-left': index % 2 === 1, 'timeline-date-right': index % 2 === 0 }">
              <div class="date-content">
                <span class="date-period">{{ item.period }}</span>
              </div>
            </div>
            <a :href="item.link" target="_blank" class="modern-card clickable-card">
              <div class="card-background">
                <img :src="item.image" :alt="item.name" class="card-bg-img" />
                <div class="card-overlay"></div>
              </div>
              <div class="card-hover-overlay">
                <div class="hover-header">
                  <h3 class="hover-company-name">{{ item.name }}</h3>
                  <p class="hover-position-title">{{ item.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) }}</p>
                </div>
                <div class="hover-footer">
                  <div class="hover-globe">
                    <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div class="hover-skills">
                    <span v-for="(skill, skillIndex) in item.skills" :key="skillIndex" class="skill-tag" :style="{ animationDelay: (skillIndex * 0.05) + 's' }">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="section-2" class="content-section alt-bg final-section">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> ls ~/projects
        </h2>
        <div class="projects-grid">
          <a v-for="(item, index) in projectItems" :key="index" :href="item.link" target="_blank" class="modern-card clickable-card">
            <div class="card-background">
              <img :src="item.image" :alt="item.name" class="card-bg-img" />
              <div class="card-overlay"></div>
            </div>
            <div class="card-hover-overlay">
              <div class="hover-header">
                <h3 class="hover-project-name">{{ item.name }}</h3>
                <p class="hover-project-type">{{ item.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) }}</p>
              </div>
              <div class="hover-footer">
                <div class="hover-github">
                  <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div class="hover-skills">
                  <span v-for="(skill, skillIndex) in item.skills" :key="skillIndex" class="skill-tag" :style="{ animationDelay: (skillIndex * 0.05) + 's' }">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>


    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-text">
          <span class="prompt">$</span> echo "Built with Vue.js | © 2025 Mehdi Semmar"
        </div>
        <div class="footer-links">
          <a href="https://github.com/FtKuBo" target="_blank" class="social-link">GITHUB</a>
          <a href="https://linkedin.com/in/mehdisemmar" target="_blank" class="social-link">LINKEDIN</a>
          <a href="https://codewars.com/users/FtKuBo" target="_blank" class="social-link">CODEWARS</a>
          <a href="mailto:msemm031@uottawa.ca" class="social-link">EMAIL</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import '../assets/styles/LazyPortfolio.css';
</style>
