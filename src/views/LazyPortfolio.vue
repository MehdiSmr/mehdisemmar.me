<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Sections data structure with holographic card information
const sections = {
  experience: [
    { 
      name: "Raven Connected", 
      period: "SEP 2025 - DEC 2025",
      description: "AI/ML Engineer developing intelligent surveillance systems and computer vision solutions. Working on deep learning models for real-time video analytics and automated threat detection using TensorFlow and PyTorch.", 
      image: "https://imgs.search.brave.com/fwsmOfTPxHGUqygMdSOKjDjTom-RK-C3eAS1OTyGjZ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Z2V0cm8uY29tL2Nv/bXBhbmllcy83ZWNh/ODg0OC1lNDM2LTU0/MWYtYjhkNS05ZTAw/NGM4Yzc0OWMtMTc0/NjQ5NTQ1Mw",
      type: "AI_ML_ENGINEER_INTERN",
      link: "https://ravenconnected.com"
    },
    { 
      name: "Versaterm", 
      period: "MAY 2025 - AUG 2025",
      description: "Built dynamic record retrieval tool with PostgreSQL and 4JS GUI frontend for VRMS integration. Developed NCIC response parser using Linux environment (Vim, PuTTY) with dynamic column views, backup systems, and CSV import/export functionality, deployed to production. Created Electron-based platform for configuring VMobile forms used by officers, enabling JSON-driven mobile communication interfaces.", 
      image: "https://imgs.search.brave.com/EZFUsOYfAdI2DxYn3g_aHpP-Yc47vwMhHrRkvogmi9M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5sYWJjb21wYXJl/LmNvbS9tLzUzL3Zl/bmRvci8xMDgwNDku/anBn",
      type: "FULL_STACK_DEVELOPER_INTERN",
      link: "https://versaterm.com"
    },
    { 
      name: "Wouessi Digital", 
      period: "FEB 2025 - MAR 2025",
      description: "Improved website visibility by implementing responsive blog page with pagination using React.js and Tailwind CSS. Migrated codebase to TypeScript and enhanced data flow across 3+ microservices with Express.js and MongoDB.", 
      image: "https://imgs.search.brave.com/3LbSjAc7rvVJ8nu09kZycIRRHyLGH-qXiHi6Lq-__bk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zbWFy/dGhpcHBvLm9yZy93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8x/Mi93b3Vlc3Nzc3Mu/cG5n",
      type: "SOFTWARE_DEVELOPER_INTERN",
      link: "https://wouessi.com"
    },
    { 
      name: "ISED Canada", 
      period: "JAN 2025 - APR 2025",
      description: "Resolved 7+ critical frontend and backend bugs using JavaScript, LWC, Apex, and SOQL, improving web platform stability. Built CRM features and managed Salesforce admin tasks for 10,000+ users in agile environment.", 
      image: "https://imgs.search.brave.com/HPAXn7LzT5LrOpS1d4sq2dn-VVsFM9BO0W7iJyOVrqE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/Y29oZXJlbnRjb21t/b25zLmNvbS8zMDB4/MjAwcGFkL29yZ2Fu/aXphdGlvbnMvb3Jn/YW5pemF0aW9uL2xv/Z28vY2Y4NmM1ZDEt/ZDAwMS00YThlLWI2/MTAtNmY4YWE4YTNm/YjU2LmpwZw",
      type: "SALESFORCE_DEVELOPER_INTERN",
      link: "https://ised-isde.canada.ca"
    },
    { 
      name: "Shared Services Canada", 
      period: "JUL 2024 - AUG 2024",
      description: "Cut data processing time by 70% by automating financial reconciliation in Excel using VB.NET. Created detailed documentation and demo video, presenting to 30+ stakeholders. Audited high-value invoices, identifying $10K+ billing discrepancies.", 
      image: "https://imgs.search.brave.com/fm6UoB4eKGpQ1S12OJejCK8DDvmI73DlaTIhfGU31iU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMnE3/OWl1N3k3NDhqei5j/bG91ZGZyb250Lm5l/dC9zL19zcXVhcmVs/b2dvLzk2eDk2L2Yx/OGMzYzUzZjkzNzdi/YmMzNDI2ZDM2YWM0/ZTFiNmI0",
      type: "DATA_ANALYST_INTERN",
      link: "https://ssc-spc.gc.ca"
    }
  ],
  projects: [
    { 
      name: "RZO Sports", 
      period: "2024 - ONGOING",
      description: "Co-founded RZO Sports, a two-sided platform for amateur athletes and sports venues. Placed top 2 out of 40+ candidates in pitch competition. Leading MVP development with Spring Boot, React.js, MySQL, Docker, and Nginx using JWT/OAuth 2.0.", 
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      type: "STARTUP_PLATFORM",
      link: "https://github.com/FtKuBo/rzo-sports"
    },
    { 
      name: "DollaResume", 
      period: "2024",
      description: "Developed AI-powered resume generator using JavaScript, React.js, and Gadget. Integrated PDF generation ensuring 98% compatibility in ATS tests for optimized resume formatting. Won $300 cash prize in Gadget Challenge.", 
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&auto=format",
      type: "AI_RESUME_GENERATOR",
      link: "https://github.com/FtKuBo/dollaresume"
    },
    { 
      name: "SeekAndFind", 
      period: "2024",
      description: "Built event-driven web application connecting uOttawa students who lost and found items using Solace PubSub+ message broker, containerized Spring Boot API, and React.js frontend. Developed for uOttaHack 7 Solace challenge.", 
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&auto=format",
      type: "EVENT_DRIVEN_PLATFORM",
      link: "https://github.com/FtKuBo/seekandfind"
    },
    { 
      name: "Portfolio Website", 
      period: "2024 - ONGOING",
      description: "Dual-interface portfolio website featuring traditional scrollable view and terminal-based CLI experience. Built with Vue.js, TypeScript, and modern web technologies with responsive design and dynamic animations.", 
      image: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=400&h=300&fit=crop&auto=format",
      type: "PERSONAL_PORTFOLIO",
      link: "https://github.com/FtKuBo/mehdisemmar.me"
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
const typedText = ref('')
const fullText = "MEHDI_SEMMAR_PORTFOLIO"
let typingInterval: any
let scrollListener: (() => void) | null = null

// Function to update active section based on scroll position
const updateActiveSection = () => {
  const sections = [
    { id: 'section-0', index: 0 }, // About/Hero
    { id: 'section-1', index: 1 }, // Experience
    { id: 'section-2', index: 2 }, // Projects
    { id: 'section-3', index: 3 }, // Skills
    { id: 'section-4', index: 4 }  // Extracurriculars
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

onMounted(() => {
  // Typing animation for header
  let i = 0
  typingInterval = setInterval(() => {
    if (i < fullText.length) {
      typedText.value += fullText[i]
      i++
    } else {
      clearInterval(typingInterval)
    }
  }, 100)
  
  // Add scroll listener for dynamic section detection
  scrollListener = () => {
    updateActiveSection()
  }
  
  window.addEventListener('scroll', scrollListener, { passive: true })
  
  // Initial check
  setTimeout(() => {
    updateActiveSection()
  }, 500) // Wait for elements to be rendered
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
  }
  if (typingInterval) {
    clearInterval(typingInterval)
  }
})

const scrollToSection = (index: number) => {
  activeSection.value = index
  const element = document.getElementById(`section-${index}`)
  element?.scrollIntoView({ behavior: 'smooth' })
}

const goToHome = () => {
  router.push('/')
}

</script>

<template>
  <div class="lazy-portfolio">
    <!-- Background effect -->
    <div class="matrix-bg"></div>
    
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-left">
          <button @click="goToHome" class="home-btn">
            <span class="icon">←</span>
            <span>HOME</span>
          </button>
          <div class="nav-logo">
            <span class="typing-text">{{ typedText }}<span class="cursor">_</span></span>
          </div>
        </div>
        <div class="nav-links">
          <a @click="scrollToSection(0)" :class="{ active: activeSection === 0 }">ABOUT</a>
          <a @click="scrollToSection(1)" :class="{ active: activeSection === 1 }">EXPERIENCE</a>
          <a @click="scrollToSection(2)" :class="{ active: activeSection === 2 }">PROJECTS</a>
          <a @click="scrollToSection(3)" :class="{ active: activeSection === 3 }">SKILLS</a>
          <a @click="scrollToSection(4)" :class="{ active: activeSection === 4 }">EXTRACURRICULARS</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="section-0" class="hero-section">
      <div class="hero-content">
        <div class="glitch-wrapper">
          <h1 class="glitch" data-text="MEHDI SEMMAR">MEHDI SEMMAR</h1>
        </div>
        <p class="subtitle typing">SOFTWARE_ENGINEER | ML_AI_ENGINEER</p>
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
          <button @click="scrollToSection(1)" class="cta-button">
            <span>EXPLORE_PORTFOLIO</span>
            <span class="arrow">↓</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="section-1" class="content-section">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> ls ~/experience
        </h2>
        <div class="cards-grid">
          <a v-for="(item, index) in sections.experience" :key="index" :href="item.link" target="_blank" class="holo-card clickable-card">
            <div class="card-image-section">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" class="hologram-img" />
                <div class="holo-overlay"></div>
              </div>
            </div>
            <div class="card-content-section">
              <div class="card-header">
                <span class="card-icon">◉</span>
                <div class="card-title-group">
                  <h3>{{ item.name }}</h3>
                  <span class="card-type">{{ item.type }}</span>
                </div>
              </div>
              <div class="card-period-section">
                <div class="card-period">
                  <span class="period-label">PERIOD:</span>
                  <span class="period-value">{{ item.period }}</span>
                </div>
              </div>
              <div class="card-description-section">
                <p class="card-description">{{ item.description }}</p>
              </div>
              <div class="card-footer-section">
                <div class="card-footer">
                  <span class="status-indicator"></span>
                  <span class="card-link">VIEW_DETAILS →</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="section-2" class="content-section alt-bg">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> ls ~/projects
        </h2>
        <div class="cards-grid">
          <a v-for="(item, index) in sections.projects" :key="index" :href="item.link" target="_blank" class="holo-card clickable-card">
            <div class="card-image-section">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" class="hologram-img" />
                <div class="holo-overlay"></div>
              </div>
            </div>
            <div class="card-content-section">
              <div class="card-header">
                <span class="card-icon">▣</span>
                <div class="card-title-group">
                  <h3>{{ item.name }}</h3>
                  <span class="card-type">{{ item.type }}</span>
                </div>
              </div>
              <div class="card-period-section">
                <div class="card-period">
                  <span class="period-label">TIMELINE:</span>
                  <span class="period-value">{{ item.period }}</span>
                </div>
              </div>
              <div class="card-description-section">
                <p class="card-description">{{ item.description }}</p>
              </div>
              <div class="card-footer-section">
                <div class="card-footer">
                  <span class="status-indicator"></span>
                  <span class="card-link">LAUNCH_PROJECT →</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="section-3" class="content-section">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> ls ~/skills
        </h2>
        <div class="cards-grid">
          <div v-for="(item, index) in sections.skills" :key="index" class="holo-card skills-card">
            <div class="card-image-section">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" class="hologram-img" />
                <div class="holo-overlay"></div>
              </div>
            </div>
            <div class="card-content-section">
              <div class="card-header">
                <span class="card-icon">⚡</span>
                <div class="card-title-group">
                  <h3>{{ item.name }}</h3>
                  <span class="card-type">{{ item.type }}</span>
                </div>
              </div>
              <div class="card-period-section">
                <div class="card-period">
                  <span class="period-label">EXPERIENCE:</span>
                  <span class="period-value">{{ item.period }}</span>
                </div>
              </div>
              <div class="card-description-section">
                <p class="card-description">{{ item.description }}</p>
              </div>
              <div class="card-footer-section">
                <div class="card-footer">
                  <span class="status-indicator"></span>
                  <span class="card-link">SKILL_SET →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Extracurriculars Section -->
    <section id="section-4" class="content-section alt-bg">
      <div class="section-container">
        <h2 class="section-title">
          <span class="prompt">$</span> ls ~/extracurriculars
        </h2>
        <div class="cards-grid">
          <a v-for="(item, index) in sections.extracurriculars" :key="index" :href="item.link" target="_blank" class="holo-card clickable-card">
            <div class="card-image-section">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" class="hologram-img" />
                <div class="holo-overlay"></div>
              </div>
            </div>
            <div class="card-content-section">
              <div class="card-header">
                <span class="card-icon">◈</span>
                <div class="card-title-group">
                  <h3>{{ item.name }}</h3>
                  <span class="card-type">{{ item.type }}</span>
                </div>
              </div>
              <div class="card-period-section">
                <div class="card-period">
                  <span class="period-label">DURATION:</span>
                  <span class="period-value">{{ item.period }}</span>
                </div>
              </div>
              <div class="card-description-section">
                <p class="card-description">{{ item.description }}</p>
              </div>
              <div class="card-footer-section">
                <div class="card-footer">
                  <span class="status-indicator"></span>
                  <span class="card-link">read_more →</span>
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
  border: 1px solid rgba(0, 255, 136, 0.5);
  color: #00ff88;
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
}

.home-btn:hover {
  background: rgba(0, 255, 136, 0.1);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
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

/* Ensure home button, navigation elements, and CTA button have pointer cursor */
.home-btn,
.home-btn *,
.nav-links a,
.cta-button,
.cta-button * {
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

/* Responsive Design */
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
    gap: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }
  
  .nav-logo {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  
  .nav-links {
    display: none;
  }
  
  .home-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    white-space: nowrap;
    flex-shrink: 0;
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
}

/* Small devices (larger phones, 481px to 768px) */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .nav-content {
    padding: 0 1.5rem;
  }
  
  .nav-logo {
    font-size: 1.1rem;
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
}

/* Medium devices (tablets, 769px to 1024px) */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .nav-content {
    max-width: 900px;
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
  
  .card-image {
    height: 180px;
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
</style>
