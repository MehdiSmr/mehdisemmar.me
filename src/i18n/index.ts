import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      terminal: 'TERMINAL',
      resume: 'RESUME',
      about: 'ABOUT',
      experience: 'EXPERIENCE',
      projects: 'PROJECTS'
    },
    terminal: {
      command: 'cat ~/whoami.txt',
      title: 'Software Engineer | AI/ML Enthusiast',
      education: 'University of Ottawa - GPA: 4.0/4.0',
      specialization: 'Specialization: Full-Stack & AI/ML Development',
      focus: 'Current Focus: Deep Learning & Computer Vision',
      leadership: 'Leading logistics for Software Engineering Student',
      events: 'Association events and contributing to major hackathons.',
      innovation: 'Building innovative solutions that bridge cutting-edge',
      applications: 'technology and real-world applications.',
      motto: '🚀 Always learning, always building, always innovating.'
    },
    footer: {
      built: 'Built with Vue.js | © 2025 Mehdi Semmar'
    }
  },
  fr: {
    nav: {
      terminal: 'TERMINAL',
      resume: 'CV',
      about: 'À PROPOS',
      experience: 'EXPÉRIENCE',
      projects: 'PROJETS'
    },
    terminal: {
      command: 'cat ~/quijesuis.txt',
      title: 'Ingénieur Logiciel | Spécialiste IA/ML',
      education: 'Université d’Ottawa - MPC: 4.0/4.0',
      specialization: 'Spécialisation: Développement Full-Stack & IA/ML',
      focus: 'Focus Actuel: Apprentissage Profond & Vision par Ordinateur',
      leadership: 'Direction de la logistique pour l’Association des Étudiants',
      events: 'en Génie Logiciel et contribution aux hackathons majeurs.',
      innovation: 'Création de solutions innovantes qui lient les technologies',
      applications: 'de pointe aux applications du monde réel.',
      motto: '🚀 Toujours apprendre, toujours construire, toujours innover.'
    },
    footer: {
      built: 'Construit avec Vue.js | © 2025 Mehdi Semmar'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
