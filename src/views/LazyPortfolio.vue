<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Terminal3D from '../components/Terminal3DSimple.vue'

const router = useRouter()
const { t, locale } = useI18n()

// Sections data structure with holographic card information
const sections = {
  experience: [
    { 
      name: "Raven Connected", 
      period: "SEP 2025 - DEC 2025",
      description: "AI/ML Engineer developing intelligent surveillance systems and computer vision solutions. Working on deep learning models for real-time video analytics and automated threat detection using TensorFlow and PyTorch.", 
      image: "https://imgs.search.brave.com/fwsmOfTPxHGUqygMdSOKjDjTom-RK-C3eAS1OTyGjZ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Z2V0cm8uY29tL2Nv/bXBhbmllcy83ZWNh/ODg0OC1lNDM2LTU0/MWYtYjhkNS05ZTAw/NGM4Yzc0OWMtMTc0/NjQ5NTQ1Mw",
      type: "AI_ML_ENGINEER_INTERN",
      link: "https://ravenconnected.com",
      skills: ["Python", "TensorFlow", "PyTorch", "Computer Vision", "Deep Learning", "AI/ML"]
    },
    { 
      name: "Versaterm", 
      period: "MAY 2025 - AUG 2025",
      description: "Built dynamic record retrieval tool with PostgreSQL and 4JS GUI frontend for VRMS integration. Developed NCIC response parser using Linux environment (Vim, PuTTY) with dynamic column views, backup systems, and CSV import/export functionality, deployed to production. Created Electron-based platform for configuring VMobile forms used by officers, enabling JSON-driven mobile communication interfaces.", 
      image: "https://imgs.search.brave.com/EZFUsOYfAdI2DxYn3g_aHpP-Yc47vwMhHrRkvogmi9M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5sYWJjb21wYXJl/LmNvbS9tLzUzL3Zl/bmRvci8xMDgwNDku/anBn",
      type: "FULL_STACK_DEVELOPER_INTERN",
      link: "https://versaterm.com",
      skills: ["PostgreSQL", "4JS", "Electron", "Linux", "JSON", "Production"]
    },
    { 
      name: "Wouessi Digital", 
      period: "FEB 2025 - MAR 2025",
      description: "Improved website visibility by implementing responsive blog page with pagination using React.js and Tailwind CSS. Migrated codebase to TypeScript and enhanced data flow across 3+ microservices with Express.js and MongoDB.", 
      image: "https://imgs.search.brave.com/3LbSjAc7rvVJ8nu09kZycIRRHyLGH-qXiHi6Lq-__bk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zbWFy/dGhpcHBvLm9yZy93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8x/Mi93b3Vlc3Nzc3Mu/cG5n",
      type: "SOFTWARE_DEVELOPER_INTERN",
      link: "https://wouessi.com",
      skills: ["React.js", "Tailwind CSS", "TypeScript", "Express.js", "MongoDB"]
    },
    { 
      name: "ISED Canada", 
      period: "JAN 2025 - APR 2025",
      description: "Resolved 7+ critical frontend and backend bugs using JavaScript, LWC, Apex, and SOQL, improving web platform stability. Built CRM features and managed Salesforce admin tasks for 10,000+ users in agile environment.", 
      image: "https://imgs.search.brave.com/HPAXn7LzT5LrOpS1d4sq2dn-VVsFM9BO0W7iJyOVrqE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/Y29oZXJlbnRjb21t/b25zLmNvbS8zMDB4/MjAwcGFkL29yZ2Fu/aXphdGlvbnMvb3Jn/YW5pemF0aW9uL2xv/Z28vY2Y4NmM1ZDEt/ZDAwMS00YThlLWI2/MTAtNmY4YWE4YTNm/YjU2LmpwZw",
      type: "SALESFORCE_DEVELOPER_INTERN",
      link: "https://ised-isde.canada.ca",
      skills: ["JavaScript", "LWC", "Apex", "SOQL", "Salesforce", "CRM"]
    },
    { 
      name: "Shared Services Canada", 
      period: "JUL 2024 - AUG 2024",
      description: "Cut data processing time by 70% by automating financial reconciliation in Excel using VB.NET. Created detailed documentation and demo video, presenting to 30+ stakeholders. Audited high-value invoices, identifying $10K+ billing discrepancies.", 
      image: "https://imgs.search.brave.com/fm6UoB4eKGpQ1S12OJejCK8DDvmI73DlaTIhfGU31iU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMnE3/OWl1N3k3NDhqei5j/bG91ZGZyb250Lm5l/dC9zL19zcXVhcmVs/b2dvLzk2eDk2L2Yx/OGMzYzUzZjkzNzdi/YmMzNDI2ZDM2YWM0/ZTFiNmI0",
      type: "DATA_ANALYST_INTERN",
      link: "https://ssc-spc.gc.ca",
      skills: ["VB.NET", "Excel", "Automation", "Data Analysis", "Financial Systems"]
    }
  ],
  projects: [
    { 
      name: "RZO Sports", 
      period: "2024 - ONGOING",
      description: "Co-founded RZO Sports, a two-sided platform for amateur athletes and sports venues. Placed top 2 out of 40+ candidates in pitch competition. Leading MVP development with Spring Boot, React.js, MySQL, Docker, and Nginx using JWT/OAuth 2.0.", 
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      type: "STARTUP_PLATFORM",
      link: "https://github.com/FtKuBo/rzo-sports",
      skills: ["Spring Boot", "React.js", "MySQL", "Docker", "Nginx", "JWT/OAuth"]
    },
    { 
      name: "DollaResume", 
      period: "2024",
      description: "Developed AI-powered resume generator using JavaScript, React.js, and Gadget. Integrated PDF generation ensuring 98% compatibility in ATS tests for optimized resume formatting. Won $300 cash prize in Gadget Challenge.", 
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&auto=format",
      type: "AI_RESUME_GENERATOR",
      link: "https://github.com/FtKuBo/dollaresume",
      skills: ["JavaScript", "React.js", "Gadget", "PDF Generation", "AI"]
    },
    { 
      name: "SeekAndFind", 
      period: "2024",
      description: "Built event-driven web application connecting uOttawa students who lost and found items using Solace PubSub+ message broker, containerized Spring Boot API, and React.js frontend. Developed for uOttaHack 7 Solace challenge.", 
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&auto=format",
      type: "EVENT_DRIVEN_PLATFORM",
      link: "https://github.com/FtKuBo/seekandfind",
      skills: ["Spring Boot", "React.js", "Solace PubSub+", "Docker", "Event-Driven"]
    },
    { 
      name: "Portfolio Website", 
      period: "2024 - ONGOING",
      description: "Dual-interface portfolio website featuring traditional scrollable view and terminal-based CLI experience. Built with Vue.js, TypeScript, and modern web technologies with responsive design and dynamic animations.", 
      image: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=400&h=300&fit=crop&auto=format",
      type: "PERSONAL_PORTFOLIO",
      link: "https://github.com/FtKuBo/mehdisemmar.me",
      skills: ["Vue.js", "TypeScript", "CSS3", "Responsive Design", "Animations"]
    }
  ],
  skills: [
    {
      name: "Programming Languages",
      period: "2022 - PRESENT",
      description: "Python, Java, JavaScript, HTML5, CSS3, Dart, C/C++, NASM, SQL, Bash. Proficient in multiple paradigms including OOP, functional programming, and system-level programming.",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop&auto=format",
      type: "CORE_LANGUAGES",
      link: "https://github.com/FtKuBo?tab=repositories"
    },
    {
      name: "Frameworks & Libraries",
      period: "2023 - PRESENT",
      description: "Spring Boot, React.js, Express.js, Node.js, Tailwind CSS, Flutter, Django, TensorFlow. Experience building full-stack applications with modern web and mobile frameworks.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&auto=format",
      type: "FRAMEWORKS_LIBRARIES",
      link: "https://github.com/FtKuBo?tab=repositories"
    },
    {
      name: "Cloud & DevOps",
      period: "2023 - PRESENT",
      description: "AWS, Google Cloud, Docker, Git, Linux, Vim, Postman. Experience with containerization, cloud deployment, version control, and API development/testing tools.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&auto=format",
      type: "CLOUD_DEVOPS",
      link: "https://github.com/FtKuBo?tab=repositories"
    },
    {
      name: "Specialized Technologies",
      period: "2024 - PRESENT",
      description: "Salesforce (LWC, Apex, SOQL), Genero 4GL, PostgreSQL, MongoDB, PubSub+, VB.NET. Enterprise and specialized technology stack experience from professional internships.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format",
      type: "ENTERPRISE_TECH",
      link: "https://linkedin.com/in/mehdisemmar"
    }
  ],
  extracurriculars: [
    { 
      name: "Logistics Team Lead", 
      period: "2025",
      description: "Leading logistics operations for Software Engineering Student Association events. Coordinating tech talks, hackathons, and networking sessions with 500+ participants, managing event planning and execution for university's largest engineering student organization.", 
      image: "https://imgs.search.brave.com/qVa0K62R3Pm79hMJQ1jwXGhxV4iwaeWeaISCrmQUL6k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly96ZW5w/cm9zcGVjdC1wcm9k/dWN0aW9uLnMzLmFt/YXpvbmF3cy5jb20v/dXBsb2Fkcy9waWN0/dXJlcy82NWE5ZDI0/MWRiODEyMTAwMDFm/ZmNhMWEvcGljdHVy/ZQ",
      type: "LEADERSHIP_ROLE",
      link: "https://sesa.engineering.uottawa.ca"
    },
    { 
      name: "uOttaHack 8 Dev Team", 
      period: "2025",
      description: "Core development team member for Ottawa's largest hackathon. Built registration platform, judging systems, and live dashboards serving 1000+ participants.", 
      image: "https://imgs.search.brave.com/aWsVRwAO5OhYk-jp1lfDqo6aRB60xFEBCs7w1ENK6JI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/MDc3M2M3YWViM2Zi/OTM3NTM0MTkzODAv/Njc5MTU1MzY0YjYw/YTllYTZkZWQ0ZDJi/X2hhY2sucG5n",
      type: "HACKATHON_ORGANIZER",
      link: "https://uottahack.ca"
    },
    { 
      name: "Math Mentor", 
      period: "2022 - 2023",
      description: "Volunteer mathematics tutor for École des grands helping high school students excel in calculus and linear algebra. Developed interactive learning materials and conducted weekly study sessions.", 
      image: "https://imgs.search.brave.com/QDxXucSk6HxRvHrzwljVrGDZH0YYJRirEeLF2qFrrwY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dW90dGF3YS5jYS9l/dHVkZXMvc2l0ZXMv/Zy9maWxlcy9iaHJz/a2QyOTYvZmlsZXMv/c3R5bGVzL21heF93/aWR0aF9sXzE0NzBw/eC9wdWJsaWMvMjAy/My0wOC9zY3JlZW5z/aG90JTIwZWNvbGUl/MjBkZXMlMjBncmFu/ZHMuanBnP2l0b2s9/UmpKRUlqRE8",
      type: "COMMUNITY_SERVICE",
      link: "https://ecoleddesgrandsuottawa.ca"
    },
    { 
      name: "University of Ottawa", 
      period: "2023 - 2027",
      description: "BASc Software Engineering (Eng. Management & Entrepreneurship) Co-op - GPA: 4.0/4.0 - x4 Dean's List - TD Green Scholarship recipient. HarvardX CS50 AI certification.", 
      image: "https://imgs.search.brave.com/57qPRpY3yu944Dr3WCJNC6Xsn_xexz7gHYJcFHIQbhI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dW90dGF3YS5jYS9h/Ym91dC11cy9zaXRl/cy9nL2ZpbGVzL2Jo/cnNrZDMzNi9maWxl/cy8yMDI1LTA1L3VP/dHRhd2FfbG9nby1n/d19nYXJuZXQucG5n",
      type: "ACADEMIC_EXCELLENCE",
      link: "https://engineering.uottawa.ca"
    }
  ]
}

const activeSection = ref(0)
let typingInterval: any
let scrollListener: (() => void) | null = null
let observerInstances: IntersectionObserver[] = []

// Scroll animation tracking
let lastScrollY = 0
let scrollDirection = 'down'
const seenItems = new Set<Element>()


// Function to update active section based on scroll position
const updateActiveSection = () => {
  const sections = [
    { id: 'section-0', index: 0 }, // About/Hero
    { id: 'section-1', index: 1 }, // Experience
    { id: 'section-2', index: 2 }  // Projects
  ]
  
  const scrollPosition = window.scrollY + window.innerHeight / 2
  
  let currentSection = 0
  
  for (let i = 0; i < sections.length; i++) {
    const element = document.getElementById(sections[i].id)
    if (element) {
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      
      if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
        currentSection = sections[i].index
        break
      }
      
      // If we're past the last section, keep it active
      if (i === sections.length - 1 && scrollPosition >= elementTop) {
        currentSection = sections[i].index
      }
    }
  }
  
  activeSection.value = currentSection
}

// Track scroll direction
const updateScrollDirection = () => {
  const currentScrollY = window.scrollY
  scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
  lastScrollY = currentScrollY
}

// Setup scroll-triggered animations
const setupScrollAnimations = () => {
  // Timeline items animation
  const timelineItems = document.querySelectorAll('.timeline-item')
  timelineItems.forEach((item) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Item is entering viewport
          if (scrollDirection === 'down' && !seenItems.has(entry.target)) {
            // First time seeing this item while scrolling down - animate in
            entry.target.classList.add('animate-in')
            seenItems.add(entry.target)
          } else if (seenItems.has(entry.target)) {
            // Item has been seen before - just show it without animation
            entry.target.classList.add('animate-in')
          }
        } else {
          // Item is leaving viewport
          if (scrollDirection === 'up' && seenItems.has(entry.target)) {
            // Scrolling up and item is leaving - slide out
            entry.target.classList.remove('animate-in')
          }
        }
      })
    }, { threshold: 0.2, rootMargin: '50px' })
    
    observer.observe(item)
    observerInstances.push(observer)
  })
  
  // Project cards animation
  const projectCards = document.querySelectorAll('.modern-card')
  projectCards.forEach((card, index) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Item is entering viewport
          if (scrollDirection === 'down' && !seenItems.has(entry.target)) {
            // First time seeing this item while scrolling down - animate in with delay
            setTimeout(() => {
              entry.target.classList.add('animate-in')
            }, index * 100)
            seenItems.add(entry.target)
          } else if (seenItems.has(entry.target)) {
            // Item has been seen before - just show it without animation
            entry.target.classList.add('animate-in')
          }
        } else {
          // Item is leaving viewport
          if (scrollDirection === 'up' && seenItems.has(entry.target)) {
            // Scrolling up and item is leaving - slide out
            entry.target.classList.remove('animate-in')
          }
        }
      })
    }, { threshold: 0.2, rootMargin: '50px' })
    
    observer.observe(card)
    observerInstances.push(observer)
  })
}

onMounted(() => {
  // Add scroll listener for dynamic section detection and scroll direction tracking
  scrollListener = () => {
    updateScrollDirection()
    updateActiveSection()
  }
  
  window.addEventListener('scroll', scrollListener, { passive: true })
  
  // Initial check
  setTimeout(() => {
    updateActiveSection()
    setupScrollAnimations()
  }, 500) // Wait for elements to be rendered
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
  }
  if (typingInterval) {
    clearInterval(typingInterval)
  }
  // Clean up observers
  observerInstances.forEach(observer => observer.disconnect())
  observerInstances = []
})

const scrollToSection = (index: number) => {
  activeSection.value = index
  const element = document.getElementById(`section-${index}`)
  element?.scrollIntoView({ behavior: 'smooth' })
}

const goToTerminal = () => {
  router.push('/terminal-portfolio')
}

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'fr' : 'en'
}

const scrollToTerminalSection = () => {
  const element = document.querySelector('.about-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}


const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <div class="nav-user-name" @click="scrollToTop">{{ t('nav.mehdisemmar') }}</div>
          <button @click="goToTerminal" class="terminal-btn">
            <span class="terminal-icon">></span>
            <span class="terminal-icon">_</span>
            <span class="terminal-text">{{ t('nav.terminal') }}</span>
          </button>
          <a href="https://drive.google.com/file/d/1yAeZgKOKwJ5VYsKCBAKyI-1YeKvt0BVP/view?usp=sharing" target="_blank" class="resume-btn">
            {{ t('nav.resume') }}
          </a>
          <button @click="toggleLanguage" class="language-btn">
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
          <div v-for="(item, index) in sections.experience" :key="index" class="timeline-item" :class="{ 'timeline-right': index % 2 === 1 }" :style="{ animationDelay: (index * 0.2) + 's' }">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <a :href="item.link" target="_blank" class="modern-card clickable-card">
              <div class="card-background">
                <img :src="item.image" :alt="item.name" class="card-bg-img" />
                <div class="card-overlay"></div>
              </div>
              <div class="card-hover-overlay">
                <div class="hover-header">
                  <h3 class="hover-company-name">{{ item.name }}</h3>
                  <p class="hover-position-title">{{ item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}</p>
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
          <a v-for="(item, index) in sections.projects" :key="index" :href="item.link" target="_blank" class="modern-card clickable-card">
            <div class="card-background">
              <img :src="item.image" :alt="item.name" class="card-bg-img" />
              <div class="card-overlay"></div>
            </div>
            <div class="card-hover-overlay">
              <div class="hover-header">
                <h3 class="hover-project-name">{{ item.name }}</h3>
                <p class="hover-project-type">{{ item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}</p>
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
/* Base responsive setup */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

body {
  overflow-x: hidden;
  min-width: 320px;
}

/* Prevent horizontal scrolling */
.lazy-portfolio {
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

/* Reset cursor for lazy portfolio */
.lazy-portfolio {
  cursor: auto !important;
}

.lazy-portfolio * {
  cursor: auto !important;
  pointer-events: auto !important;
}

/* Clickable card styles */
.clickable-card {
  cursor: pointer !important;
  text-decoration: none !important;
  color: inherit !important;
  pointer-events: auto !important;
  display: block !important;
}

.clickable-card:hover,
.clickable-card:visited,
.clickable-card:active {
  cursor: pointer !important;
  text-decoration: none !important;
  color: inherit !important;
}

/* Ensure all clickable card elements show pointer cursor */
.clickable-card *,
.clickable-card *:hover {
  cursor: pointer !important;
  pointer-events: none !important;
}

/* Re-enable pointer events for the main clickable card */
.clickable-card {
  pointer-events: auto !important;
}

.social-link {
  cursor: pointer !important;
}

/* Matrix background effect */
.matrix-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0f14;
  z-index: -1;
  overflow: hidden;
}

.matrix-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(64, 224, 208, 0.03) 2px,
      rgba(64, 224, 208, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(64, 224, 208, 0.03) 2px,
      rgba(64, 224, 208, 0.03) 4px
    );
  animation: matrix-rain 20s linear infinite;
}

@keyframes matrix-rain {
  0% { transform: translateY(0); }
  100% { transform: translateY(100px); }
}

/* Navigation */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(10, 15, 20, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(64, 224, 208, 0.3);
  z-index: 1000;
  padding: 1rem 0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-user-name {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #40e0d0;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(64, 224, 208, 0.5);
  letter-spacing: 1px;
  cursor: pointer !important;
  transition: all 0.3s ease;
}

.nav-user-name:hover {
  transform: translateY(-1px);
}

.terminal-btn {
  background: transparent;
  border: 2px solid #40e0d0;
  color: #40e0d0;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer !important;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  height: 44px;
}

.terminal-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(64, 224, 208, 0.2);
  transition: left 0.3s ease;
}

.terminal-btn:hover::before {
  left: 0;
}

.terminal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
  cursor: pointer !important;
}

.terminal-icon {
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 0.9rem;
}

.terminal-text {
  position: relative;
  z-index: 1;
}

.resume-btn {
  background: transparent;
  border: 2px solid #40e0d0;
  color: #40e0d0;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer !important;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  height: 44px;
}

.resume-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(64, 224, 208, 0.2);
  transition: left 0.3s ease;
}

.resume-btn:hover::before {
  left: 0;
}

.resume-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
  cursor: pointer !important;
}

.language-btn {
  background: transparent;
  border: 2px solid #40e0d0;
  color: #40e0d0;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer !important;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 44px;
  position: relative;
  overflow: hidden;
}

.language-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(64, 224, 208, 0.2);
  transition: left 0.3s ease;
}

.language-btn:hover::before {
  left: 0;
}

.language-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
  cursor: pointer !important;
}

.nav-logo {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  color: #40e0d0;
  text-shadow: 0 0 10px rgba(64, 224, 208, 0.5);
}

.typing-text {
  display: inline-block;
}

.cursor {
  animation: blink 1s step-end infinite;
  color: #00ff88;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: #e0f7ff;
  text-decoration: none;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.nav-links a:hover,
.nav-links a.active {
  color: #40e0d0;
  text-shadow: 0 0 5px rgba(64, 224, 208, 0.5);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 1px;
  background: #40e0d0;
  transition: width 0.3s ease;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.home-btn {
  background: transparent;
  border: 2px solid #40e0d0;
  color: #40e0d0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(64, 224, 208, 0.2);
  transition: left 0.3s ease;
}

.home-btn:hover::before {
  left: 0;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
}

.home-btn .icon {
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.home-btn:hover .icon {
  transform: translateX(-3px);
}

/* Ensure all navigation elements have pointer cursor */
.home-btn,
.home-btn *,
.nav-links a,
.cta-button,
.cta-button *,
.terminal-btn,
.terminal-btn *,
.resume-btn,
.resume-btn *,
.language-btn,
.language-btn *,
.nav-user-name {
  cursor: pointer !important;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

.glitch-wrapper {
  margin-bottom: 1rem;
}

.glitch {
  font-size: 4rem;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  color: #e0f7ff;
  letter-spacing: 0.1em;
  animation: glitch-skew 1s infinite linear alternate-reverse;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.3s infinite linear alternate-reverse;
  color: #00ff88;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.3s infinite linear alternate-reverse;
  color: #40e0d0;
  z-index: -2;
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(2deg); }
  40% { transform: skew(-2deg); }
  60% { transform: skew(1deg); }
  80% { transform: skew(-1deg); }
  100% { transform: skew(0deg); }
}

@keyframes glitch-1 {
  0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, -2px); }
  20% { clip-path: inset(92% 0 1% 0); transform: translate(2px, 2px); }
  40% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
  80% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, 2px); }
  100% { clip-path: inset(58% 0 43% 0); transform: translate(2px, -2px); }
}

@keyframes glitch-2 {
  0% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
  20% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, 2px); }
  40% { clip-path: inset(58% 0 43% 0); transform: translate(2px, -2px); }
  60% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, -2px); }
  80% { clip-path: inset(92% 0 1% 0); transform: translate(2px, 2px); }
  100% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, 2px); }
}

.subtitle {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  color: #40e0d0;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.typing {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 3s steps(40, end);
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.stat {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(64, 224, 208, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.stat-label {
  color: #87ceeb;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.stat-value {
  color: #e0f7ff;
  font-weight: bold;
}

.stat-value.online {
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
}

.cta-container {
  margin-top: 2rem;
}

.cta-button {
  background: transparent;
  border: 2px solid #40e0d0;
  color: #40e0d0;
  padding: 1rem 2rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(64, 224, 208, 0.2);
  transition: left 0.3s ease;
}

.cta-button:hover::before {
  left: 0;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
}

.arrow {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(5px); }
  60% { transform: translateY(3px); }
}

/* Content Sections */
.content-section {
  min-height: 100vh;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
}

.content-section.alt-bg {
  background: rgba(0, 20, 25, 0.5);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section-title {
  font-family: 'Courier New', monospace;
  font-size: 2rem;
  color: #40e0d0;
  margin-bottom: 3rem;
  text-shadow: 0 0 10px rgba(64, 224, 208, 0.3);
}

.prompt {
  color: #00ff88;
  margin-right: 0.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Modern card styles for both experience and projects */
.modern-card {
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.95), rgba(0, 35, 45, 0.85));
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
  height: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40e0d0, #00ff88, #40e0d0, transparent);
  animation: holo-scan 4s linear infinite;
  z-index: 2;
}

.modern-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 15px 40px rgba(64, 224, 208, 0.3),
    0 0 20px rgba(0, 255, 136, 0.2);
  border-color: #40e0d0;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.card-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(1) hue-rotate(160deg) saturate(1.5) brightness(1.1) contrast(1.2);
  transition: all 0.3s ease;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(64, 224, 208, 0.1) 0%, rgba(0, 255, 136, 0.05) 50%, rgba(64, 224, 208, 0.1) 100%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

.modern-card:hover .card-bg-img {
  transform: scale(1.1);
  filter: sepia(1) hue-rotate(160deg) saturate(2) brightness(1.2) contrast(1.3);
}

.modern-card:hover .card-overlay {
  opacity: 1;
}

/* Title overlay on card (always visible) */
.card-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 20, 25, 0.95));
  padding: 3rem 1.5rem 1.5rem 1.5rem;
  z-index: 3;
}

.overlay-company-name,
.overlay-project-name {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(224, 247, 255, 0.5);
  line-height: 1.2;
}

.overlay-position-title,
.overlay-project-type {
  color: #40e0d0;
  font-size: 0.85rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

/* Hover overlay (hidden by default) */
.card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.92), rgba(0, 35, 45, 0.92));
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 4;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.modern-card:hover .card-hover-overlay {
  opacity: 1;
}

.hover-header {
  text-align: center;
  margin-bottom: 1rem;
}

.hover-company-name,
.hover-project-name {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(224, 247, 255, 0.5);
  line-height: 1.2;
}

.hover-position-title,
.hover-project-type {
  color: #40e0d0;
  font-size: 0.85rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.hover-footer {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.hover-globe {
  display: flex;
  align-items: center;
}

.globe-icon {
  width: 2rem;
  height: 2rem;
  color: #40e0d0;
  filter: drop-shadow(0 0 10px rgba(64, 224, 208, 0.5));
  transition: all 0.3s ease;
}

.modern-card:hover .globe-icon {
  color: #00ff88;
  filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.7));
  transform: scale(1.1);
}

.hover-github {
  display: flex;
  align-items: center;
}

.github-icon {
  width: 2rem;
  height: 2rem;
  color: #40e0d0;
  filter: drop-shadow(0 0 10px rgba(64, 224, 208, 0.5));
  transition: all 0.3s ease;
}

.modern-card:hover .github-icon {
  color: #00ff88;
  filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.7));
  transform: scale(1.1);
}

.hover-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
  max-width: 60%;
}

.skill-tag {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.2), rgba(0, 255, 136, 0.1));
  border: 1px solid rgba(64, 224, 208, 0.4);
  color: #e0f7ff;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  opacity: 0;
  animation: skill-fade-in 0.6s ease forwards;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(224, 247, 255, 0.3);
  white-space: nowrap;
  display: inline-block;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(64, 224, 208, 0.3);
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.3), rgba(0, 255, 136, 0.2));
  border-color: #00ff88;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.company-logo,
.project-logo {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(64, 224, 208, 0.3);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(1) hue-rotate(160deg) saturate(1.5) brightness(1.1) contrast(1.2);
  transition: all 0.3s ease;
}

.modern-card:hover .logo-img {
  transform: scale(1.1);
  filter: sepia(1) hue-rotate(160deg) saturate(2) brightness(1.2) contrast(1.3);
}

.company-info,
.project-info {
  flex: 1;
  min-width: 0;
}

.company-name,
.project-name {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 8px rgba(224, 247, 255, 0.3);
  line-height: 1.2;
}

.position-title,
.project-description {
  color: #87ceeb;
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.3;
  opacity: 0.9;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
}

.tech-badge {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.2), rgba(0, 255, 136, 0.1));
  border: 1px solid rgba(64, 224, 208, 0.4);
  color: #e0f7ff;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  opacity: 0;
  animation: skill-fade-in 0.6s ease forwards;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(224, 247, 255, 0.3);
  white-space: nowrap;
  display: inline-block;
  flex-shrink: 0;
}

.tech-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(64, 224, 208, 0.3);
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.3), rgba(0, 255, 136, 0.2));
  border-color: #00ff88;
}

.card {
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.95), rgba(0, 35, 45, 0.85));
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40e0d0, transparent);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(64, 224, 208, 0.2);
  border-color: #40e0d0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon {
  color: #00ff88;
  font-size: 1.5rem;
}

.card h3 {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 1.2rem;
  margin: 0;
}

.card-description {
  color: #87ceeb;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.card-link {
  color: #40e0d0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.card:hover .card-link {
  transform: translateX(5px);
}

/* Footer */
.footer {
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(64, 224, 208, 0.3);
  padding: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-text {
  font-family: 'Courier New', monospace;
  color: #87ceeb;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.social-link {
  color: #40e0d0;
  text-decoration: none;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
}

/* Holographic Cards */
.holo-card {
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.95), rgba(0, 35, 45, 0.85));
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* Card section alignment - Enhanced for consistency */
.card-image-section {
  flex-shrink: 0;
  height: 200px; /* Fixed height for all images */
  overflow: hidden;
}

.card-content-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  position: relative;
  height: 450px; /* Fixed total height for all card content */
}

.card-header {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  height: 70px; /* Fixed height for header section */
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.card-period-section {
  position: absolute;
  top: 105px; /* 1.5rem + 70px + 1rem spacing */
  left: 1.5rem;
  right: 1.5rem;
  height: 35px; /* Fixed height for period section */
  display: flex;
  align-items: center;
}

.card-description-section {
  position: absolute;
  top: 155px; /* Previous sections + spacing */
  left: 1.5rem;
  right: 1.5rem;
  bottom: 70px; /* Leave space for footer */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.card-footer-section {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  height: 50px; /* Fixed height for footer - ensures perfect alignment */
  display: flex;
  align-items: center;
}

.holo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40e0d0, #00ff88, #40e0d0, transparent);
  animation: holo-scan 4s linear infinite;
  z-index: 2;
}

@keyframes holo-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.holo-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 15px 40px rgba(64, 224, 208, 0.3),
    0 0 20px rgba(0, 255, 136, 0.2);
  border-color: #40e0d0;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid rgba(64, 224, 208, 0.2);
}

.hologram-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: 
    sepia(1) 
    hue-rotate(160deg) 
    saturate(2) 
    brightness(1.1) 
    contrast(1.2);
  transition: all 0.3s ease;
}

.holo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(
      45deg, 
      rgba(64, 224, 208, 0.1) 0%, 
      rgba(0, 255, 136, 0.05) 50%, 
      rgba(64, 224, 208, 0.1) 100%
    );
  mix-blend-mode: screen;
  opacity: 0.7;
}

.holo-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(64, 224, 208, 0.1) 2px,
      rgba(64, 224, 208, 0.1) 4px
    );
  animation: holo-lines 3s linear infinite;
}

@keyframes holo-lines {
  0% { transform: translateX(0); }
  100% { transform: translateX(20px); }
}

.holo-card:hover .hologram-img {
  filter: 
    sepia(1) 
    hue-rotate(160deg) 
    saturate(2.5) 
    brightness(1.3) 
    contrast(1.5);
  transform: scale(1.05);
}

.holo-card:hover .holo-overlay {
  opacity: 1;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title-group {
  flex: 1;
}

.card-title-group h3 {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(224, 247, 255, 0.3);
}

.card-type {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #40e0d0;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.8;
  display: block;
}

.card-period {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
}

.period-label {
  color: #87ceeb;
  margin-right: 0.5rem;
}

.period-value {
  color: #00ff88;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
}

.holo-card .card-description {
  color: #b0c4de;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
  flex: 1;
}

.holo-card .card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  width: 100%;
  position: relative;
}

.holo-card .status-indicator {
  width: 10px;
  height: 10px;
  background: #00ff88;
  border-radius: 50%;
  animation: holo-pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  flex-shrink: 0;
}

@keyframes holo-pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
  }
}

.holo-card .card-link {
  color: #40e0d0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: auto;
  flex-shrink: 0;
}

.holo-card:hover .card-link {
  transform: translateX(8px);
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
}

/* Project Grid Styles */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.95), rgba(0, 35, 45, 0.85));
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  height: 400px;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40e0d0, #00ff88, #40e0d0, transparent);
  animation: holo-scan 4s linear infinite;
  z-index: 2;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 15px 40px rgba(64, 224, 208, 0.3),
    0 0 20px rgba(0, 255, 136, 0.2);
  border-color: #40e0d0;
}

.project-image-section {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(1) hue-rotate(160deg) saturate(1.5) brightness(1.1) contrast(1.2);
  transition: all 0.3s ease;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(64, 224, 208, 0.1) 0%, rgba(0, 255, 136, 0.05) 50%, rgba(64, 224, 208, 0.1) 100%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

.project-name {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  color: #e0f7ff;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7), 0 0 10px rgba(224, 247, 255, 0.5);
  z-index: 3;
}

.project-skills-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.98), rgba(0, 35, 45, 0.95));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 4;
}

.project-card:hover .project-skills-overlay {
  opacity: 1;
}

.project-skills-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
}

.skills-icon {
  font-size: 1.5rem;
}

.skills-title {
  color: #40e0d0;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 2px;
}

.project-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.project-skill-tag {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.2), rgba(0, 255, 136, 0.1));
  border: 1px solid rgba(64, 224, 208, 0.4);
  color: #e0f7ff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  letter-spacing: 1px;
  opacity: 0;
  animation: skill-fade-in 0.6s ease forwards;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(224, 247, 255, 0.3);
}

.project-skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(64, 224, 208, 0.3);
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.3), rgba(0, 255, 136, 0.2));
  border-color: #00ff88;
}

.project-hover-footer {
  margin-top: auto;
}

.hover-action {
  color: #40e0d0;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.project-card:hover .hover-action {
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
}

.project-card:hover .project-img {
  transform: scale(1.1);
  filter: sepia(1) hue-rotate(160deg) saturate(2) brightness(1.2) contrast(1.3);
}

/* Responsive Design */
/* Ultra small devices (phones, 280px to 320px) */
@media screen and (max-width: 320px) {
  .nav-left {
    gap: 0.3rem;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  
  .nav-user-name {
    font-size: 0.75rem;
    max-width: 80px;
  }
  
  .terminal-btn, .resume-btn, .language-btn {
    min-width: 60px;
    height: 32px;
    padding: 0.3rem 0.4rem;
    font-size: 0.65rem;
  }
  
  .glitch {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.7rem;
  }
  
  .stat {
    max-width: 250px;
    padding: 0.8rem 1rem;
  }
  
  .modern-card {
    min-height: 250px;
  }
  
  .project-card {
    height: 250px;
  }
}

/* Extra small devices (phones, 320px to 480px) */
@media screen and (max-width: 480px) {
  .nav-bar {
    padding: 0.8rem 0;
  }
  
  .nav-content {
    padding: 0 1rem;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: none;
  }
  
  .nav-left {
    gap: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    flex-wrap: wrap;
  }
  
  .nav-user-name {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }
  
  .terminal-btn, .resume-btn, .language-btn {
    min-width: 80px;
    height: 36px;
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .nav-links {
    display: none;
  }
  
  .home-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 80px;
    height: 36px;
  }
  
  .home-btn .icon {
    font-size: 0.9rem;
  }
  
  .hero-section {
    padding: 2rem 1rem;
    min-height: calc(100vh - 4rem);
  }
  
  .hero-content {
    max-width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .glitch {
    font-size: 2.2rem;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }
  
  .subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    line-height: 1.4;
    margin-bottom: 2rem;
    max-width: 100%;
    word-break: break-word;
    white-space: normal;
  }
  
  .hero-stats {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 2.5rem;
    width: 100%;
    align-items: center;
  }
  
  .stat {
    padding: 1rem 1.2rem;
    width: 100%;
    max-width: 280px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
    display: block;
    margin: 0;
  }
  
  .stat-value {
    font-size: 0.9rem;
    display: block;
  }
  
  .cta-button {
    padding: 1rem 2rem;
    font-size: 0.9rem;
    letter-spacing: 1px;
    margin-top: 1rem;
  }
  
  .content-section {
    padding: 4rem 1rem;
  }
  
  .section-container {
    width: 100%;
    padding: 0;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 0.5rem;
    justify-items: center;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 100%;
  }
  
  .project-card {
    height: 300px;
  }
  
  .project-name {
    font-size: 1rem;
  }
  
  .skills-title {
    font-size: 0.9rem;
  }
  
  .project-skill-tag {
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
  }
  
  .hover-action {
    font-size: 0.8rem;
  }
  
  .holo-card {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
  
  .card-image {
    height: 140px;
  }
  
  .holo-card .card-content-section {
    padding: 1.2rem;
  }
  
  .card-title-group h3 {
    font-size: 1.1rem;
  }
  
  .card-type {
    font-size: 0.65rem;
  }
  
  .card-period {
    font-size: 0.7rem;
  }
  
  .holo-card .card-description {
    font-size: 0.85rem;
    line-height: 1.5;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .footer-text {
    font-size: 0.8rem;
  }
  
  .footer-links {
    gap: 1rem;
  }
  
  .social-link {
    font-size: 0.8rem;
  }
  
  /* Mobile touch optimizations */
  .modern-card, .project-card {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  .terminal-btn, .resume-btn, .language-btn, .cta-button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(64, 224, 208, 0.2);
  }
  
  /* Improve mobile scrolling */
  .lazy-portfolio {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }
  
  /* Mobile animation performance */
  .modern-card, .timeline-item {
    will-change: transform, opacity;
  }
  
  .modern-card:hover {
    transform: none; /* Disable hover transform on mobile */
  }
}

/* Small devices (larger phones, 481px to 768px) */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .nav-content {
    padding: 0 1.5rem;
  }
  
  .nav-user-name {
    font-size: 1rem;
  }
  
  .terminal-btn, .resume-btn, .language-btn {
    min-width: 100px;
    height: 40px;
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .nav-links a {
    font-size: 0.8rem;
  }
  
  .hero-section {
    padding: 3rem 1.5rem;
  }
  
  .glitch {
    font-size: 2.8rem;
    letter-spacing: 0.1em;
  }
  
  .subtitle {
    font-size: 1.1rem;
    letter-spacing: 1.5px;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  
  .stat {
    padding: 0.9rem 1.2rem;
  }
  
  .cta-button {
    padding: 0.9rem 1.8rem;
    font-size: 0.95rem;
  }
  
  .content-section {
    padding: 5rem 1.5rem;
  }
  
  .section-title {
    font-size: 1.7rem;
    margin-bottom: 2.5rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
  }
  
  .project-card {
    height: 350px;
  }
  
  .card-image {
    height: 160px;
  }
  
  .holo-card .card-content {
    padding: 1.2rem;
  }
  
  .card-title-group h3 {
    font-size: 1.2rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .timeline-item,
  .timeline-right {
    width: calc(100% - 80px);
    margin-left: auto;
  }
  
  .timeline-marker,
  .timeline-right .timeline-marker {
    left: -40px;
  }
  
  .timeline-line {
    left: 30px;
  }
  
  /* Mobile-specific improvements */
  .about-section {
    padding: 4rem 1.5rem;
  }
  
  .terminal-3d-container {
    max-width: 320px;
    height: 240px;
  }
  
  /* Touch improvements */
  .clickable-card {
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(64, 224, 208, 0.2);
  }
}

/* Medium devices (tablets, 769px to 1024px) */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .nav-content {
    max-width: 900px;
  }
  
  .nav-user-name {
    font-size: 1.05rem;
  }
  
  .terminal-btn, .resume-btn, .language-btn {
    min-width: 110px;
    height: 42px;
    padding: 0.55rem 0.9rem;
    font-size: 0.85rem;
  }
  
  .nav-links {
    gap: 1.5rem;
  }
  
  .nav-links a {
    font-size: 0.85rem;
  }
  
  .hero-section {
    padding: 3.5rem 2rem;
  }
  
  .glitch {
    font-size: 3.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .hero-stats {
    gap: 1.5rem;
  }
  
  .content-section {
    padding: 5.5rem 2rem;
  }
  
  .section-container {
    max-width: 900px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.8rem;
  }
  
  .projects-grid {
    max-width: 800px;
  }
  
  .card-image {
    height: 180px;
  }
  
  /* Tablet-specific optimizations */
  .about-section {
    padding: 5rem 2rem;
  }
  
  /* Better tablet navigation */
  .nav-left {
    gap: 1.2rem;
  }
  
  .hero-stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.2rem;
  }
  
  .stat {
    min-width: 200px;
    max-width: 250px;
  }
}

/* Large devices (desktops, 1025px to 1440px) */
@media screen and (min-width: 1025px) and (max-width: 1440px) {
  .nav-content {
    max-width: 1200px;
  }
  
  .hero-section {
    padding: 4rem 2rem;
  }
  
  .glitch {
    font-size: 4rem;
  }
  
  .content-section {
    padding: 6rem 2rem;
  }
  
  .section-container {
    max-width: 1200px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .card-image {
    height: 200px;
  }
}

/* Extra large devices (large desktops, 1441px to 1920px) */
@media screen and (min-width: 1441px) and (max-width: 1920px) {
  .nav-content {
    max-width: 1400px;
    padding: 0 3rem;
  }
  
  .nav-logo {
    font-size: 1.4rem;
  }
  
  .nav-links {
    gap: 2.5rem;
  }
  
  .nav-links a {
    font-size: 1rem;
  }
  
  .home-btn {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
  
  .hero-section {
    padding: 5rem 3rem;
  }
  
  .glitch {
    font-size: 5rem;
    letter-spacing: 0.15em;
  }
  
  .subtitle {
    font-size: 1.4rem;
    letter-spacing: 2.5px;
    margin-bottom: 2.5rem;
  }
  
  .hero-stats {
    gap: 2.5rem;
    margin-bottom: 3.5rem;
  }
  
  .stat {
    padding: 1.2rem 2rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
  
  .cta-button {
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
    letter-spacing: 2.5px;
  }
  
  .content-section {
    padding: 7rem 3rem;
  }
  
  .section-container {
    max-width: 1400px;
  }
  
  .section-title {
    font-size: 2.4rem;
    margin-bottom: 3.5rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
  }
  
  .card-image {
    height: 240px;
  }
  
  .holo-card .card-content-section {
    padding: 2rem;
  }
  
  .card-title-group h3 {
    font-size: 1.5rem;
  }
  
  .card-type {
    font-size: 0.8rem;
  }
  
  .card-period {
    font-size: 0.9rem;
  }
  
  .holo-card .card-description {
    font-size: 1rem;
  }
  
  .holo-card .card-link {
    font-size: 1rem;
  }
  
  .footer-content {
    max-width: 1400px;
    gap: 3rem;
  }
  
  .footer-text {
    font-size: 1rem;
  }
  
  .footer-links {
    gap: 2.5rem;
  }
  
  .social-link {
    font-size: 1rem;
  }
}

/* Timeline styles for experience section */
.experience-timeline {
  position: relative;
  padding-top: 7rem;
  padding-bottom: 7rem;
}

.timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: linear-gradient(to bottom, transparent, #40e0d0, #40e0d0, #40e0d0, transparent);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 6rem;
  width: 45%;
  left: 0;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.timeline-right {
  left: 55%;
  transform: translateX(50px);
}

.timeline-item.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.modern-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modern-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.timeline-marker {
  position: absolute;
  top: 3rem;
  right: -3.5rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-right .timeline-marker {
  left: -3.5rem;
  right: auto;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #00ff88;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.7);
}

.marker-pulse {
  position: absolute;
  width: 24px;
  height: 24px;
  background: rgba(0, 255, 136, 0.3);
  border-radius: 50%;
  animation: marker-pulse 2s ease-in-out infinite;
}

@keyframes marker-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

.timeline-card {
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.95), rgba(0, 35, 45, 0.85));
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40e0d0, #00ff88, #40e0d0, transparent);
  animation: holo-scan 4s linear infinite;
  z-index: 2;
}

.timeline-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 15px 40px rgba(64, 224, 208, 0.3),
    0 0 20px rgba(0, 255, 136, 0.2);
  border-color: #40e0d0;
}

.timeline-card-header {
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(64, 224, 208, 0.2);
}

.card-image-section {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1.2rem;
}

.timeline-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(1) hue-rotate(160deg) saturate(1.5) brightness(1.1) contrast(1.2);
  transition: all 0.3s ease;
}

.timeline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(64, 224, 208, 0.1) 0%, rgba(0, 255, 136, 0.05) 50%, rgba(64, 224, 208, 0.1) 100%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

.timeline-card:hover .timeline-img {
  transform: scale(1.1);
  filter: sepia(1) hue-rotate(160deg) saturate(2) brightness(1.2) contrast(1.3);
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.company-title {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(224, 247, 255, 0.3);
}

.timeline-meta {
  display: flex;
  align-items: center;
}

.timeline-label {
  color: #87ceeb;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  font-family: 'Courier New', monospace;
}

.timeline-status {
  color: #00ff88;
  font-size: 0.8rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
  font-family: 'Courier New', monospace;
}

.timeline-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.timeline-skills {
  margin-bottom: 1.5rem;
}

.skills-header-timeline {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.terminal-prompt {
  color: #00ff88;
  margin-right: 0.5rem;
}

.skills-command {
  color: #40e0d0;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.timeline-skill-tag {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.2), rgba(0, 255, 136, 0.1));
  border: 1px solid rgba(64, 224, 208, 0.4);
  color: #e0f7ff;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  letter-spacing: 1px;
  opacity: 0;
  animation: skill-fade-in 0.6s ease forwards;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(224, 247, 255, 0.3);
  display: inline-block;
}

@keyframes skill-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(64, 224, 208, 0.3);
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.3), rgba(0, 255, 136, 0.2));
  border-color: #00ff88;
}

.timeline-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
}

.action-text {
  color: #40e0d0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
  text-transform: uppercase;
}

.action-arrow {
  color: #40e0d0;
  transition: all 0.3s ease;
}

.timeline-card:hover .action-text,
.timeline-card:hover .action-arrow {
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
}

.timeline-card:hover .action-arrow {
  transform: translateX(3px);
}

/* Responsive styles for timeline */
@media screen and (max-width: 768px) {
  .timeline-line {
    left: 20px;
  }

  .timeline-item,
  .timeline-right {
    width: calc(100% - 60px);
    margin-left: auto;
    left: 0;
    margin-bottom: 4rem;
    animation: fade-in-up 0.8s ease-out forwards;
  }
  
  .modern-card {
    max-width: 100%;
    height: auto;
    min-height: 280px;
  }
  
  .timeline-container {
    padding: 1rem 0;
  }
  
  .experience-timeline {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .timeline-marker,
  .timeline-right .timeline-marker {
    left: -30px;
    right: auto;
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* Ultra large devices (4K and beyond, 1921px+) */
@media screen and (min-width: 1921px) {
  .nav-content {
    max-width: 1800px;
    padding: 0 4rem;
  }
  
  .nav-logo {
    font-size: 1.6rem;
  }
  
  .nav-links {
    gap: 3rem;
  }
  
  .nav-links a {
    font-size: 1.1rem;
  }
  
  .home-btn {
    padding: 0.7rem 1.4rem;
    font-size: 1.1rem;
  }
  
  .hero-section {
    padding: 6rem 4rem;
  }
  
  .hero-content {
    max-width: 1000px;
  }
  
  .glitch {
    font-size: 6rem;
    letter-spacing: 0.2em;
  }
  
  .subtitle {
    font-size: 1.6rem;
    letter-spacing: 3px;
    margin-bottom: 3rem;
  }
  
  .hero-stats {
    gap: 3rem;
    margin-bottom: 4rem;
  }
  
  .stat {
    padding: 1.4rem 2.4rem;
  }
  
  .stat-label {
    font-size: 1rem;
  }
  
  .cta-button {
    padding: 1.4rem 3rem;
    font-size: 1.2rem;
    letter-spacing: 3px;
  }
  
  .content-section {
    padding: 8rem 4rem;
  }
  
  .section-container {
    max-width: 1800px;
  }
  
  .section-title {
    font-size: 2.8rem;
    margin-bottom: 4rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 3rem;
  }
  
  .card-image {
    height: 280px;
  }
  
  .holo-card .card-content-section {
    padding: 2.5rem;
  }
  
  .card-title-group h3 {
    font-size: 1.7rem;
  }
  
  .card-type {
    font-size: 0.9rem;
  }
  
  .card-period {
    font-size: 1rem;
  }
  
  .holo-card .card-description {
    font-size: 1.1rem;
    line-height: 1.7;
  }
  
  .holo-card .card-link {
    font-size: 1.1rem;
  }
  
  .footer-content {
    max-width: 1800px;
    gap: 4rem;
    padding: 3rem;
  }
  
  .footer-text {
    font-size: 1.1rem;
  }
  
  .footer-links {
    gap: 3rem;
  }
  
  .social-link {
    font-size: 1.1rem;
  }
}

/* About Section */
.about-section {
  padding: 6rem 2rem;
  background: rgba(0, 15, 20, 0.3);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-container-centered {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 400px;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-header {
  margin-bottom: 1rem;
}

.about-title {
  font-family: 'Courier New', monospace;
  font-size: 2rem;
  color: #40e0d0;
  margin: 0;
  text-shadow: 0 0 10px rgba(64, 224, 208, 0.3);
}

.about-description {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-description p {
  color: #b0c4de;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
  text-align: justify;
}

.about-right {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* 3D Terminal Styles */
.terminal-3d-container {
  perspective: 1000px;
  width: 100%;
  max-width: 450px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.terminal-3d {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.terminal-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9));
  border: 2px solid #40e0d0;
  border-radius: 12px;
  box-shadow: 
    0 0 20px rgba(64, 224, 208, 0.3),
    inset 0 0 20px rgba(0, 255, 136, 0.1);
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.terminal-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40e0d0, #00ff88, #40e0d0, transparent);
  animation: terminal-scan 3s linear infinite;
}

@keyframes terminal-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.terminal-header {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(0, 255, 136, 0.05));
  border-bottom: 1px solid rgba(64, 224, 208, 0.3);
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terminal-buttons {
  display: flex;
  gap: 0.5rem;
}

.terminal-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
}

.terminal-button.close {
  background: #ff5f56;
  box-shadow: 0 0 8px rgba(255, 95, 86, 0.5);
}

.terminal-button.minimize {
  background: #ffbd2e;
  box-shadow: 0 0 8px rgba(255, 189, 46, 0.5);
}

.terminal-button.maximize {
  background: #27ca3f;
  box-shadow: 0 0 8px rgba(39, 202, 63, 0.5);
}

.terminal-title {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 0.9rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(224, 247, 255, 0.3);
}

.terminal-body {
  padding: 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
}

.terminal-line {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.prompt-user {
  color: #00ff88;
  font-weight: bold;
}

.prompt-separator {
  color: #e0f7ff;
  margin: 0 2px;
}

.prompt-path {
  color: #40e0d0;
  font-weight: bold;
}

.prompt-symbol {
  color: #e0f7ff;
  margin: 0 4px;
}

.command {
  color: #87ceeb;
}

.terminal-line.output {
  color: #b0c4de;
  padding-left: 1rem;
  margin-bottom: 0.3rem;
}

.typing-cursor {
  color: #00ff88;
  animation: terminal-blink 1s step-end infinite;
}

@keyframes terminal-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Terminal Hover Effects */
.terminal-3d-container:hover .terminal-screen {
  box-shadow: 
    0 0 30px rgba(64, 224, 208, 0.5),
    inset 0 0 30px rgba(0, 255, 136, 0.2),
    0 10px 40px rgba(0, 0, 0, 0.3);
  border-color: #00ff88;
}

.terminal-3d-container:hover .terminal-title {
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

.terminal-3d-container:hover .prompt-user,
.terminal-3d-container:hover .typing-cursor {
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

/* Responsive About Section */
@media screen and (max-width: 768px) {
  .about-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .about-title {
    font-size: 1.5rem;
  }
  
  .about-description p {
    font-size: 0.9rem;
    text-align: left;
  }
  
  .terminal-3d-container {
    max-width: 350px;
    height: 280px;
  }
  
  .terminal-body {
    padding: 1rem;
    font-size: 0.8rem;
  }
  
  .terminal-title {
    font-size: 0.8rem;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  .about-container {
    gap: 3rem;
  }
  
  .about-title {
    font-size: 1.8rem;
  }
  
  .terminal-3d-container {
    max-width: 400px;
    height: 320px;
  }
}

@media screen and (min-width: 1441px) {
  .about-section {
    padding: 8rem 3rem;
  }
  
  /* High-DPI display optimizations */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .glitch, .section-title {
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
  
  .about-container {
    gap: 5rem;
  }
  
  .about-title {
    font-size: 2.4rem;
  }
  
  .about-description p {
    font-size: 1.1rem;
    line-height: 1.8;
  }
  
  .terminal-3d-container {
    max-width: 500px;
    height: 400px;
  }
  
  .terminal-body {
    font-size: 1rem;
    padding: 2rem;
  }
  
  .terminal-title {
    font-size: 1rem;
  }
}
</style>
