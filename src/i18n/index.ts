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
      education: 'Hey, I’m Mehdi Semmar, a Software Engineering student at the University of Ottawa, Canada. 🇨🇦',
      specialization: 'I’m driven by the thrill of turning complex problems into elegant software solutions. Whether it’s AI/ML, full-stack development, or building tools for real-world applications, I aim to create impact with every line of code. 🚀',
      outside: 'Outside of coding, I enjoy mentoring students, leading events for Software Engineering Student Association, and staying active through sports and music.',
      connect: 'Always up for a conversation about tech, innovation, or the latest in AI, let’s connect! 💻',
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
      education:'Salut, je suis Mehdi Semmar, étudiant en Génie Logiciel à l’Université d’Ottawa, Canada. 🇨🇦', 
      specialization: 'Je suis passionné par la transformation de problèmes complexes en solutions logicielles élégantes. De l’IA/ML au développement full-stack et aux outils pour le monde réel, je m’efforce de créer un impact à chaque ligne de code. 🚀',
      outside: 'En dehors du codage, j’aime encadrer des étudiants, organiser des événements pour l’Association des Étudiants en Génie Logiciel et rester actif grâce au sport et à la musique.',
      connect: 'Toujours partant pour discuter de tech, d’innovation ou des dernières avancées en IA, n’hésitez pas à me joindre! 💻', 
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
