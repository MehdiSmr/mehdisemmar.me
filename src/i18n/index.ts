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
    hero: {
      title: 'MEHDI SEMMAR',
      subtitle: 'SOFTWARE_ENGINEER',
      status: 'STATUS:',
      online: 'ONLINE',
      location: 'LOCATION:',
      locationValue: 'OTTAWA, ON',
      gpa: 'GPA:',
      gpaValue: '4.0/4.0',
      explorePortfolio: 'EXPLORE_PORTFOLIO'
    },
    sections: {
      aboutTitle: '$ cat ~/whoami.txt',
      experienceTitle: '$ cat ~/experience.log',
      projectsTitle: '$ ls ~/projects'
    },
    terminal: {
      prompt: 'mehdi@portfolio',
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
    experience: {
      ravenConnected: {
        name: 'Raven Connected',
        period: 'SEP 2025 - DEC 2025',
        description: 'AI/ML Engineer developing intelligent surveillance systems and computer vision solutions. Working on deep learning models for real-time video analytics and automated threat detection using TensorFlow and PyTorch.',
        type: 'AI/ML Engineer Intern'
      },
      versaterm: {
        name: 'Versaterm',
        period: 'MAY 2025 - AUG 2025',
        description: 'Built dynamic record retrieval tool with PostgreSQL and 4JS GUI frontend for VRMS integration. Developed NCIC response parser using Linux environment (Vim, PuTTY) with dynamic column views, backup systems, and CSV import/export functionality, deployed to production. Created Electron-based platform for configuring VMobile forms used by officers, enabling JSON-driven mobile communication interfaces.',
        type: 'Full-Stack Developer Intern'
      },
      wouessi: {
        name: 'Wouessi Digital',
        period: 'FEB 2025 - MAR 2025',
        description: 'Improved website visibility by implementing responsive blog page with pagination using React.js and Tailwind CSS. Migrated codebase to TypeScript and enhanced data flow across 3+ microservices with Express.js and MongoDB.',
        type: 'Software Developer Intern'
      },
      ised: {
        name: 'ISED Canada',
        period: 'JAN 2025 - APR 2025',
        description: 'Resolved 7+ critical frontend and backend bugs using JavaScript, LWC, Apex, and SOQL, improving web platform stability. Built CRM features and managed Salesforce admin tasks for 10,000+ users in agile environment.',
        type: 'Salesforce Developer Intern'
      },
      ssc: {
        name: 'Shared Services Canada',
        period: 'JUL 2024 - AUG 2024',
        description: 'Cut data processing time by 70% by automating financial reconciliation in Excel using VB.NET. Created detailed documentation and demo video, presenting to 30+ stakeholders. Audited high-value invoices, identifying $10K+ billing discrepancies.',
        type: 'Data Analyst Intern'
      }
    },
    projects: {
      rzoSports: {
        name: 'RZO Sports',
        period: '2024 - ONGOING',
        description: 'Co-founded RZO Sports, a two-sided platform for amateur athletes and sports venues. Placed top 2 out of 40+ candidates in pitch competition. Leading MVP development with Spring Boot, React.js, MySQL, Docker, and Nginx using JWT/OAuth 2.0.',
        type: 'Startup Platform'
      },
      dollaResume: {
        name: 'DollaResume',
        period: '2024',
        description: 'Developed AI-powered resume generator using JavaScript, React.js, and Gadget. Integrated PDF generation ensuring 98% compatibility in ATS tests for optimized resume formatting. Won $300 cash prize in Gadget Challenge.',
        type: 'AI Resume Generator'
      },
      seekAndFind: {
        name: 'SeekAndFind',
        period: '2024',
        description: 'Built event-driven web application connecting uOttawa students who lost and found items using Solace PubSub+ message broker, containerized Spring Boot API, and React.js frontend. Developed for uOttaHack 7 Solace challenge.',
        type: 'Event-Driven Platform'
      },
      portfolio: {
        name: 'Portfolio Website',
        period: '2024 - ONGOING',
        description: 'Dual-interface portfolio website featuring traditional scrollable view and terminal-based CLI experience. Built with Vue.js, TypeScript, and modern web technologies with responsive design and dynamic animations.',
        type: 'Personal Portfolio'
      }
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
    hero: {
      title: 'MEHDI SEMMAR',
      subtitle: 'INGÉNIEUR_LOGICIEL | INGÉNIEUR_IA_ML',
      status: 'STATUT:',
      online: 'EN LIGNE',
      location: 'LIEU:',
      locationValue: 'OTTAWA, ON',
      gpa: 'MPC:',
      gpaValue: '4.0/4.0',
      explorePortfolio: 'EXPLORER_PORTFOLIO'
    },
    sections: {
      aboutTitle: '$ cat ~/quijesuis.txt',
      experienceTitle: '$ cat ~/experience.log',
      projectsTitle: '$ ls ~/projets'
    },
    terminal: {
      prompt: 'mehdi@portfolio',
      command: 'cat ~/quijesuis.txt',
      title: 'Ingénieur Logiciel | Spécialiste IA/ML',
      education: 'Université d\'Ottawa - MPC: 4.0/4.0',
      specialization: 'Spécialisation: Développement Full-Stack & IA/ML',
      focus: 'Focus Actuel: Apprentissage Profond & Vision par Ordinateur',
      leadership: 'Direction de la logistique pour l\'Association des Étudiants',
      events: 'en Génie Logiciel et contribution aux hackathons majeurs.',
      innovation: 'Création de solutions innovantes qui lient les technologies',
      applications: 'de pointe aux applications du monde réel.',
      motto: '🚀 Toujours apprendre, toujours construire, toujours innover.'
    },
    experience: {
      ravenConnected: {
        name: 'Raven Connected',
        period: 'SEP 2025 - DÉC 2025',
        description: 'Ingénieur IA/ML développant des systèmes de surveillance intelligents et des solutions de vision par ordinateur. Travail sur des modèles d\'apprentissage profond pour l\'analyse vidéo en temps réel et la détection automatisée de menaces utilisant TensorFlow et PyTorch.',
        type: 'Stagiaire Ingénieur IA/ML'
      },
      versaterm: {
        name: 'Versaterm',
        period: 'MAI 2025 - AOU 2025',
        description: 'Construction d\'un outil de récupération d\'enregistrements dynamique avec PostgreSQL et interface GUI 4JS pour l\'intégration VRMS. Développement d\'un analyseur de réponses NCIC utilisant l\'environnement Linux (Vim, PuTTY) avec vues de colonnes dynamiques, systèmes de sauvegarde et fonctionnalité d\'import/export CSV, déployé en production. Création d\'une plateforme basée sur Electron pour configurer les formulaires VMobile utilisés par les officiers.',
        type: 'Stagiaire Développeur Full-Stack'
      },
      wouessi: {
        name: 'Wouessi Digital',
        period: 'FÉV 2025 - MAR 2025',
        description: 'Amélioration de la visibilité du site web en implémentant une page de blog responsive avec pagination utilisant React.js et Tailwind CSS. Migration de la base de code vers TypeScript et amélioration du flux de données à travers 3+ microservices avec Express.js et MongoDB.',
        type: 'Stagiaire Développeur Logiciel'
      },
      ised: {
        name: 'ISDE Canada',
        period: 'JAN 2025 - AVR 2025',
        description: 'Résolution de 7+ bugs critiques frontend et backend utilisant JavaScript, LWC, Apex et SOQL, améliorant la stabilité de la plateforme web. Construction de fonctionnalités CRM et gestion des tâches administratives Salesforce pour 10 000+ utilisateurs en environnement agile.',
        type: 'Stagiaire Développeur Salesforce'
      },
      ssc: {
        name: 'Services Partagés Canada',
        period: 'JUL 2024 - AOU 2024',
        description: 'Réduction du temps de traitement des données de 70% en automatisant la réconciliation financière dans Excel utilisant VB.NET. Création de documentation détaillée et vidéo de démonstration, présentation à 30+ parties prenantes. Audit de factures de haute valeur, identification de $10K+ d\'écarts de facturation.',
        type: 'Stagiaire Analyste de Données'
      }
    },
    projects: {
      rzoSports: {
        name: 'RZO Sports',
        period: '2024 - EN COURS',
        description: 'Co-fondation de RZO Sports, une plateforme bilatérale pour athlètes amateurs et lieux sportifs. Placement top 2 sur 40+ candidats dans une compétition de pitch. Direction du développement MVP avec Spring Boot, React.js, MySQL, Docker et Nginx utilisant JWT/OAuth 2.0.',
        type: 'Plateforme Startup'
      },
      dollaResume: {
        name: 'DollaResume',
        period: '2024',
        description: 'Développement d\'un générateur de CV alimenté par IA utilisant JavaScript, React.js et Gadget. Intégration de génération PDF assurant 98% de compatibilité dans les tests ATS pour un formatage de CV optimisé. Gagné un prix en espèces de $300 dans le Défi Gadget.',
        type: 'Générateur de CV IA'
      },
      seekAndFind: {
        name: 'SeekAndFind',
        period: '2024',
        description: 'Construction d\'une application web pilotée par événements connectant les étudiants uOttawa qui ont perdu et trouvé des objets utilisant le courtier de messages Solace PubSub+, API Spring Boot conteneurisée et frontend React.js. Développé pour le défi Solace uOttaHack 7.',
        type: 'Plateforme Pilotée par Événements'
      },
      portfolio: {
        name: 'Site Web Portfolio',
        period: '2024 - EN COURS',
        description: 'Site web portfolio à double interface présentant une vue défilable traditionnelle et une expérience CLI basée sur terminal. Construit avec Vue.js, TypeScript et technologies web modernes avec design responsive et animations dynamiques.',
        type: 'Portfolio Personnel'
      }
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
