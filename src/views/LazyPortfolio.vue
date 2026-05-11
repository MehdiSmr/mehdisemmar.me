<script lang="ts" setup>
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Terminal3D from '../components/Terminal3DSimple.vue'
import HolographicCard from '../components/HolographicCard.vue'
import { getLocalizedPortfolioData } from '../data/portfolioLocalized'
import { isTerminalExperienceAllowed } from '../utils/device'
import { playSound, soundEnabled, toggleSoundEnabled } from '../utils/sound'

const router = useRouter()
const { t, locale } = useI18n()

// Reactive state
const activeSection = ref(0)
const isTerminalAvailable = ref(isTerminalExperienceAllowed())
const soundButtonIcon = computed(() => (soundEnabled.value ? '🔊' : '🔇'))
const scrollState = reactive({
  lastScrollY: 0,
  direction: 'down' as 'up' | 'down',
  seenItems: new Set<Element>()
})

let scrollListener: (() => void) | null = null
let observerInstances: IntersectionObserver[] = []

type LocalizedPortfolio = ReturnType<typeof getLocalizedPortfolioData>
type LocalizedExperience = LocalizedPortfolio['experienceData'][number]

const localizedPortfolio = computed(() => getLocalizedPortfolioData(locale.value))
const experienceItems = computed(() => localizedPortfolio.value.experienceData)
const projectItems = computed(() => localizedPortfolio.value.projectData)
const recommendationItems = computed(() => localizedPortfolio.value.recommendationsData)
const selectedExperience = ref<LocalizedExperience | null>(null)

// Cached DOM elements
const sectionElements = ref<{ [key: string]: HTMLElement }>({})

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
  
  const sections = ['section-0', 'section-1', 'section-2', 'section-3']
  
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
  const animatedElements = document.querySelectorAll('.timeline-item, .modern-card, .recommendation-card')
  
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

const updateTerminalAvailability = () => {
  isTerminalAvailable.value = isTerminalExperienceAllowed()
}

onMounted(() => {
  updateTerminalAvailability()
  window.addEventListener('resize', updateTerminalAvailability)

  // Cache DOM elements
  const sections = ['section-0', 'section-1', 'section-2', 'section-3']
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
  window.addEventListener('keydown', handleEscape)
  // Initialize animations after DOM is ready
  setTimeout(() => {
    updateActiveSection()
    setupScrollAnimations()
  }, 500)
})

onUnmounted(() => {
  scrollListener && window.removeEventListener('scroll', scrollListener)
  window.removeEventListener('resize', updateTerminalAvailability)
  window.removeEventListener('keydown', handleEscape)
  observerInstances.forEach(observer => observer.disconnect())
})

// Helper functions
const playUiClick = () => playSound('uiClick', 0.35)

const scrollToSection = (index: number) => {
  playUiClick()
  activeSection.value = index
  sectionElements.value[`section-${index}`]?.scrollIntoView({ behavior: 'smooth' })
}

const goToTerminal = () => {
  if (!isTerminalAvailable.value) return
  playUiClick()
  router.push('/terminal-portfolio')
}

const toggleLanguage = () => {
  playUiClick()
  locale.value = locale.value === 'en' ? 'fr' : 'en'
}

const toggleSiteSound = () => {
  playUiClick()
  toggleSoundEnabled()
}

const scrollToTerminalSection = () => {
  playUiClick()
  document.querySelector('.about-section')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToTop = () => {
  playUiClick()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openExperienceInfo = (experience: LocalizedExperience) => {
  playUiClick()
  selectedExperience.value = experience
}

const closeExperienceInfo = () => {
  playUiClick()
  selectedExperience.value = null
}
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedExperience.value) {
    closeExperienceInfo()
  }
}

</script>

<template>
  <div class="lazy-portfolio">
    <!-- Mobile viewport optimization -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <!-- Background effect -->
    <div class="matrix-bg"></div>
    
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-left">
          <div class="nav-user-name" @click="scrollToTop">mehdi@portfolio</div>
          <button v-if="isTerminalAvailable" @click="goToTerminal" class="nav-btn terminal-btn">
            <span class="terminal-icon">></span>
            <span class="terminal-icon">_</span>
            <span class="terminal-text">{{ t('nav.terminal') }}</span>
          </button>
          <a href="https://drive.google.com/file/d/1JrU8KFuf08TUqRCJ4uShRZ3PCklILJcc/view?usp=sharing" target="_blank" class="nav-btn" @click="playUiClick">
            {{ t('nav.resume') }}
          </a>
          <button @click="toggleSiteSound" class="nav-btn sound-toggle-btn" :aria-label="soundEnabled ? 'Disable sound' : 'Enable sound'" :title="soundEnabled ? 'Disable sound' : 'Enable sound'">
            <span class="sound-icon">{{ soundButtonIcon }}</span>
          </button>
          <button @click="toggleLanguage" class="nav-btn">
            {{ locale === 'en' ? 'EN' : 'FR' }}
          </button>
        </div>
        <div class="nav-links">
          <a @click="scrollToTerminalSection" :class="{ active: activeSection === 0 }">{{ t('nav.about') }}</a>
          <a @click="scrollToSection(1)" :class="{ active: activeSection === 1 }">{{ t('nav.experience') }}</a>
          <a @click="scrollToSection(2)" :class="{ active: activeSection === 2 }">{{ t('nav.projects') }}</a>
          <a @click="scrollToSection(3)" :class="{ active: activeSection === 3 }">{{ t('nav.recommendations') }}</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="section-0" class="hero-section">
      <div class="hero-content">
        <div class="glitch-wrapper">
          <h1 class="glitch" data-text="MEHDI SEMMAR">MEHDI SEMMAR</h1>
        </div>
        <p class="subtitle typing">{{ t('hero.role') }}</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-label">{{ t('hero.statusLabel') }}</span>
            <span class="stat-value online">{{ t('hero.statusValue') }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">{{ t('hero.locationLabel') }}</span>
            <span class="stat-value">OTTAWA, ON</span>
          </div>
          <div class="stat">
            <span class="stat-label">{{ t('hero.gpaLabel') }}</span>
            <span class="stat-value">4.0/4.0</span>
          </div>
        </div>
        <div class="hero-cta-card-stack">
          <div class="cta-container">
            <button @click="scrollToTerminalSection" class="cta-button">
              <span>{{ t('hero.cta') }}</span>
              <span class="arrow">↓</span>
            </button>
          </div>
          <div class="hero-card-wrapper">
            <HolographicCard />
          </div>
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
            <Terminal3D />
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
            <article class="modern-card experience-card">
              <div class="card-background">
                <img :src="item.image" :alt="item.name" class="card-bg-img" />
                <div class="card-overlay"></div>
              </div>
              <div class="card-hover-overlay">
                <div class="hover-header">
                  <h3 class="hover-company-name">{{ item.name }}</h3>
                  <p class="hover-position-title">{{ item.type }}</p>
                </div>
                <div class="hover-footer">
                  <div class="hover-actions">
                    <a :href="item.link" target="_blank" class="hover-action-btn" aria-label="Visit company website" @click.stop="playUiClick">
                      <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </a>
                    <button type="button" class="hover-action-btn info-action-btn" aria-label="Open more details" @click.stop="openExperienceInfo(item)">
                      <span class="info-glyph">i</span>
                    </button>
                  </div>
                  <div class="hover-skills">
                    <span v-for="(skill, skillIndex) in item.skills" :key="skillIndex" class="skill-tag" :style="{ animationDelay: (skillIndex * 0.05) + 's' }">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
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
          <article v-for="(item, index) in projectItems" :key="index" class="modern-card project-card">
            <div class="card-background">
              <img :src="item.image" :alt="item.name" class="card-bg-img" />
              <div class="card-overlay"></div>
            </div>
            <div class="card-hover-overlay">
              <div class="hover-header">
                <h3 class="hover-project-name">{{ item.name }}</h3>
                <p class="hover-project-type">{{ item.type }}</p>
              </div>
              <div class="hover-footer">
                <div class="hover-actions">
                  <a v-if="item.githubLink" :href="item.githubLink" target="_blank" class="hover-action-btn" aria-label="Open project repository" @click.stop="playUiClick">
                    <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a v-if="item.websiteLink" :href="item.websiteLink" target="_blank" class="hover-action-btn" aria-label="Open project website" @click.stop="playUiClick">
                    <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </a>
                </div>
                <div class="hover-skills">
                  <span v-for="(skill, skillIndex) in item.skills" :key="skillIndex" class="skill-tag" :style="{ animationDelay: (skillIndex * 0.05) + 's' }">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Recommendations Section -->
    <section id="section-3" class="content-section recommendations-section">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> cat ~/recommendations.log
        </h2>
        <div class="recommendations-grid">
          <a
            v-for="(item, index) in recommendationItems"
            :key="index"
            :href="item.linkedinUrl"
            target="_blank"
            @click="playUiClick"
            class="recommendation-card"
            :style="{ animationDelay: (index * 0.12) + 's' }"
          >
            <div class="recommendation-person">
              <img v-if="item.avatar" :src="item.avatar" :alt="item.name" class="recommendation-avatar" />
              <div class="recommendation-meta">
                <span class="recommendation-name">{{ item.name }}</span>
                <span class="recommendation-role">{{ item.role }} · {{ item.company }}</span>
                <span v-if="item.date" class="recommendation-date">{{ item.date }}</span>
              </div>
            </div>
            <p class="recommendation-quote">“{{ item.quote }}”</p>
          </a>
        </div>
      </div>
    </section>

    <div v-if="selectedExperience" class="info-modal-backdrop" @click="closeExperienceInfo">
      <div class="info-modal" @click.stop>
        <div class="info-modal-header">
          <h3>{{ selectedExperience.name }}</h3>
          <button type="button" class="info-modal-close" @click="closeExperienceInfo">×</button>
        </div>
        <p class="info-modal-role">{{ selectedExperience.type }}</p>
        <p class="info-modal-period">{{ selectedExperience.period }}</p>
        <p class="info-modal-description">{{ selectedExperience.description }}</p>
        <div class="info-modal-skills">
          <span v-for="(skill, index) in selectedExperience.skills" :key="index" class="skill-tag">{{ skill }}</span>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-text">
          <span class="prompt">$</span> echo "{{ t('footer.built') }}"
        </div>
        <div class="footer-links">
          <a href="mailto:msemm031@uottawa.ca" class="social-link" @click="playUiClick">EMAIL</a>
          <a href="https://www.linkedin.com/in/mehdi-semmar-946a1b27b/" target="_blank" class="social-link" @click="playUiClick">LINKEDIN</a>
          <a href="https://github.com/MehdiSmr" target="_blank" class="social-link" @click="playUiClick">GITHUB</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import '../assets/styles/LazyPortfolio.css';
</style>
