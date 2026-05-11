import {
  experienceData,
  projectData,
  extracurricularsData,
  recommendationsData,
} from './portfolio'

type SupportedLocale = 'en' | 'fr'

const typeLabels: Record<string, { en: string; fr: string }> = {
  AI_ML_ENGINEER_INTERN: { en: 'AI/ML Engineer Intern', fr: 'Stagiaire Ingénieur IA/ML' },
  FULL_STACK_DEVELOPER_INTERN: { en: 'Full-Stack Developer Intern', fr: 'Stagiaire Développeur Full-Stack' },
  SOFTWARE_ENGINEER_INTERN: { en: 'Software Engineer Intern', fr: 'Stagiaire Ingénieur Logiciel' },
  SOFTWARE_DEVELOPER_INTERN: { en: 'Software Developer Intern', fr: 'Stagiaire Développeur Logiciel' },
  SALESFORCE_DEVELOPER_INTERN: { en: 'Salesforce Developer Intern', fr: 'Stagiaire Développeur Salesforce' },
  DATA_ANALYST_INTERN: { en: 'Data Analyst Intern', fr: 'Stagiaire Analyste de Données' },
  UBEREATS_FOR_SPORT_VENUES: { en: 'UberEats for Sport Venues', fr: 'UberEats pour installations sportives' },
  AI_RESUME_GENERATOR: { en: 'AI Resume Generator', fr: 'Générateur de CV par IA' },
  CHROME_EXTENSION: { en: 'Chrome Extension', fr: 'Extension Chrome' },
  LOST_ITEM_FINDER: { en: 'Lost Item Finder', fr: 'Localisateur d’objets perdus' },
  RUNNING_MOBILE_APP: { en: 'Running Mobile App', fr: 'Application mobile de course' },
  OPERATING_SYSTEM: { en: 'Operating System', fr: 'Système d’exploitation' },
  IMAGE_COMPRESSION_ALGORITHM: { en: 'Image Compression Algorithm', fr: 'Algorithme de compression d’images' },
  '2D_GAME': { en: '2D Game', fr: 'Jeu 2D' },
  LEADERSHIP_ROLE: { en: 'Leadership Role', fr: 'Rôle de leadership' },
  HACKATHON_ORGANIZER: { en: 'Hackathon Organizer', fr: 'Organisateur de hackathon' },
  COMMUNITY_SERVICE: { en: 'Community Service', fr: 'Engagement communautaire' },
  ACADEMIC_EXCELLENCE: { en: 'Academic Excellence', fr: 'Excellence académique' },
  TEACHING_ASSISTANT: { en: 'Teaching Assistant', fr: 'Auxiliaire d\'enseignement' },
}

const frExperienceDescriptions: Record<string, string> = {
  'Vertex Inc.': 'Stagiaire ingénieur logiciel (poste entrant, été 2026).',
  'Raven Connected': 'Prévision du volume de tas de feuilles à partir d’images avec SAM3/SAM3D, contribuant à conclure un contrat client à 4 chiffres. Génération de données synthétiques et entraînement d’un modèle de segmentation sur des millions d’images Raven. Conception d’un pipeline IA intégrant segmentation, génération 3D (VGGT), Gaussian splatting et estimation de hauteur avec Depth Pro pour corriger la position 3D de Raven en remplacement d’une calibration gyroscope.',
  Versaterm: 'Conception d’un outil dynamique de récupération d’enregistrements avec PostgreSQL et une interface 4JS pour l’intégration VRMS. Développement d’un parseur de réponses NCIC sous Linux (Vim, PuTTY) avec vues de colonnes dynamiques, sauvegardes et import/export CSV, déployé en production. Création d’une plateforme Electron pour configurer les formulaires VMobile utilisés par les agents.',
  'Wouessi Inc.': 'Amélioration de la visibilité du site en implémentant une page blog responsive avec pagination en React.js et Tailwind CSS. Migration du code vers TypeScript et amélioration des flux de données sur plus de 3 microservices avec Express.js et MongoDB.',
  'ISED Canada': 'Résolution de plus de 7 bogues critiques frontend et backend avec JavaScript, LWC, Apex et SOQL, améliorant la stabilité de la plateforme web. Développement de fonctionnalités CRM et gestion de tâches administrateur Salesforce pour plus de 10 000 utilisateurs en mode agile.',
  'Shared Services Canada': 'Réduction de 70 % du temps de traitement des données grâce à l’automatisation de la réconciliation financière dans Excel avec VB.NET. Création d’une documentation détaillée et d’une démo présentée à plus de 30 parties prenantes. Audit de factures à forte valeur et identification de plus de 10k d’écarts de facturation.',
}

const frExtracurricularDescriptions: Record<string, string> = {
  'Teaching Assistant — ITI1121': 'Auxiliaire d’enseignement pour ITI1121 (Java et programmation orientée objet). Animation des laboratoires, correction des intra et finaux, accompagnement des étudiants dans leurs travaux, lecture et correction du code avec rétroaction détaillée.',
  'Logistics Team Lead': 'Responsable des opérations logistiques pour les événements de la Software Engineering Student Association. Coordination de conférences, hackathons et sessions de réseautage pour plus de 500 participants.',
  'uOttaHack 8 Dev Team': 'Membre de l’équipe de développement du plus grand hackathon d’Ottawa. Contribution à la plateforme d’inscription, aux systèmes de jugement et aux tableaux de bord en direct pour plus de 1000 participants.',
  'Math Mentor': 'Tuteur bénévole en mathématiques à l’École des grands, aidant des élèves du secondaire en calcul et algèbre linéaire. Création de supports interactifs et animation de séances hebdomadaires.',
  'University of Ottawa': 'Baccalauréat en génie logiciel (gestion et entrepreneuriat) en coop — MPC : 4.0/4.0 — 4x liste du doyen — boursier TD Green. Certification HarvardX CS50 AI.',
}

const frRecommendationQuotes: Record<string, string> = {
  'Jacob Taylor': 'Mehdi est un développeur exceptionnel. Au sein de l’équipe de développement uOttaHack 8, il a constamment respecté les délais, dépassé les attentes et livré une plateforme de gestion des participants très aboutie pour les check-ins et les repas. Il a aussi contribué à maintenir une architecture robuste, efficace et conforme aux bonnes pratiques. C’est un plaisir de travailler avec Mehdi, je le recommande fortement.',
  'Izien Iremiren': 'J’ai eu l’opportunité de mentorer Mehdi durant l’été et je l’ai vu livrer un travail à fort impact, prêt pour la production, avec peu de supervision. Il a pris en charge les correctifs et le backlog liés aux parseurs, implémenté des solutions stables, et conçu des outils ainsi qu’une interface améliorant les tests et la gestion côté client. Mehdi apprend vite, communique bien et équilibre qualité et rapidité de livraison. Je le recommande vivement.',
  'Farouk Kazeem': 'J’ai eu le plaisir de mentorer Mehdi pendant son stage chez Versaterm, où il a apporté de précieuses contributions à l’application vMobile Companion. Il a rapidement pris en main Electron et livré un MVP fonctionnel. Ce qui m’a le plus impressionné est sa capacité à s’adapter, prendre des responsabilités et livrer des résultats rapidement. Proactif, pertinent dans ses questions et excellent en collaboration, je le recommande fortement.',
}

const toSupportedLocale = (locale: string): SupportedLocale => (locale.startsWith('fr') ? 'fr' : 'en')

const monthMapEnToFr: Record<string, string> = {
  January: 'janvier',
  February: 'février',
  March: 'mars',
  April: 'avril',
  May: 'mai',
  June: 'juin',
  July: 'juillet',
  August: 'août',
  September: 'septembre',
  October: 'octobre',
  November: 'novembre',
  December: 'décembre',
}

const localizeRecommendationDate = (date: string | undefined, locale: SupportedLocale) => {
  if (!date) return date
  if (locale !== 'fr') return date

  const match = date.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/)
  if (!match) return date

  const [, monthEn, day, year] = match
  const monthFr = monthMapEnToFr[monthEn]
  if (!monthFr) return date

  return `${Number(day)} ${monthFr} ${year}`
}

const localizeType = (type: string, locale: SupportedLocale) => {
  const label = typeLabels[type]
  if (label) return label[locale]
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export const getLocalizedPortfolioData = (localeInput: string) => {
  const locale = toSupportedLocale(localeInput)

  const localizedExperienceData = experienceData.map((item) => ({
    ...item,
    type: localizeType(item.type, locale),
    description: locale === 'fr' ? frExperienceDescriptions[item.name] || item.description : item.description,
  }))

  const localizedProjectData = projectData.map((item) => ({
    ...item,
    type: localizeType(item.type, locale),
  }))

  const localizedExtracurricularsData = extracurricularsData.map((item) => ({
    ...item,
    type: localizeType(item.type, locale),
    description: locale === 'fr' ? frExtracurricularDescriptions[item.name] || item.description : item.description,
  }))

  const localizedRecommendationsData = recommendationsData.map((item) => ({
    ...item,
    quote: locale === 'fr' ? frRecommendationQuotes[item.name] || item.quote : item.quote,
    date: localizeRecommendationDate(item.date, locale),
  }))

  return {
    experienceData: localizedExperienceData,
    projectData: localizedProjectData,
    extracurricularsData: localizedExtracurricularsData,
    recommendationsData: localizedRecommendationsData,
  }
}
