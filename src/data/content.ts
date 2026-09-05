export type Lang = 'en' | 'fr'

/**
 * Site chrome and the home page's own copy. Blog posts do not live here —
 * they are markdown files under `src/content/posts`, read by usePosts.
 */

export const links = {
  email: 'mailto:msemm031@uottawa.ca',
  github: 'https://github.com/MehdiSmr',
  linkedin: 'https://www.linkedin.com/in/mehdi-semmar-946a1b27b/',
  /**
   * Google Drive, not public/ — the file is swapped in Drive without a redeploy.
   * Requires the file to stay shared as "anyone with the link".
   */
  resume: 'https://drive.google.com/file/d/1YUbbRJ3UaRxa_8-T3BiMeN-EsW04bigT/view?usp=sharing'
}

/** The portrait on the home page. */
export const portrait = '/me.jpeg'

export interface LangContent {
  nav: { home: string; resume: string; blog: string; running: string }
  /** Home page paragraphs, in order. */
  bio: string[]
  portraitAlt: string
  /** Standing head and blurb for each page that has one. */
  blog: { title: string; blurb: string }
  running: { title: string; blurb: string }
  back: string
  /** Shown when a page has nothing to list. */
  empty: string
  loading: string
  error: string
  /** Link label under a running log entry. */
  runningLinkLabel: string
  /** Heading above a post's skill chips. */
  skills: string
  /** Sits under a post's title on the blog index. */
  readMore: string
  /** Noted on a post shown in English to a reader who chose French. */
  untranslated: string
}

export const content: Record<Lang, LangContent> = {
  en: {
    nav: { home: 'home', resume: 'résumé', blog: 'blog', running: 'running' },
    bio: [
      'Placeholder. Write the real paragraph here — who you are, what you are studying, what you are building, and whatever else belongs on a first impression.',
      'A second paragraph, if you want one. Replace or delete it.'
    ],
    portraitAlt: 'Mehdi Semmar',
    blog: {
      title: 'blog',
      blurb: 'Placeholder. One line on what these write-ups are.'
    },
    running: {
      title: 'running log',
      blurb: 'Mornings, splits, and what the run actually felt like.'
    },
    back: '← back',
    empty: 'Nothing here yet.',
    loading: 'Loading…',
    error: 'Oupsy, this log would not load. Try again in a moment.',
    runningLinkLabel: 'strava',
    skills: 'skills',
    readMore: 'read',
    untranslated: 'Not translated yet — shown in English.'
  },
  fr: {
    nav: { home: 'accueil', resume: 'cv', blog: 'blogue', running: 'course' },
    bio: [
      "Texte à remplacer. Écris ici le vrai paragraphe — qui tu es, ce que tu étudies, ce que tu construis, et tout ce qui mérite d'être dit en premier.",
      'Un deuxième paragraphe, si tu en veux un. Remplace-le ou supprime-le.'
    ],
    portraitAlt: 'Mehdi Semmar',
    blog: {
      title: 'blogue',
      blurb: 'Texte à remplacer. Une ligne sur ce que sont ces textes.'
    },
    running: {
      title: 'journal de course',
      blurb: 'Les matins, les temps de passage, et ce que la sortie a vraiment donné.'
    },
    back: '← retour',
    empty: "Rien pour l'instant.",
    loading: 'Chargement…',
    error: "Oupsy, ce journal n'a pas pu charger. Réessayez dans un instant.",
    runningLinkLabel: 'strava',
    skills: 'compétences',
    readMore: 'lire',
    untranslated: "Pas encore traduit — affiché en anglais."
  }
}
