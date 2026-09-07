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
  /** Noted on a post shown in English to a reader who chose French. */
  untranslated: string
}

export const content: Record<Lang, LangContent> = {
  en: {
    nav: { home: 'home', resume: 'résumé', blog: 'blog', running: 'running' },
    bio: [
      "Hi, I'm Mehdi Semmar, a Software Engineering student at the University of Ottawa. Across five co-op terms I've worked in government, as a full-stack developer in [public safety](/blog/versaterm), an AI/ML engineer in [automotive R&D](/blog/raven), and an AI software engineer in [fintech](/blog/vertex). Moving between them taught me to adapt fast to new environments and new tech.",
      "When I'm not on a co-op, I'm building something of my own. I co-founded and incorporated [RZO Sports](/blog/rzo), a marketplace connecting athletes with sports venues that placed second of 40 teams in a pitch competition. I also like showing up for my community, on the dev team for uOttaHack 8, leading events for [SESA](/blog/sesa), and TAing software engineering courses.",
      "Lately I've been drawn to AI and machine learning, and I'm starting as a research assistant working on reinforcement learning for autonomous drones. I also love math enough to take extra courses on the side. Outside of work, I'm discovering the world or out running (I finished a marathon).",
      'Always happy to connect and chat. Enjoy the site :)'
    ],
    portraitAlt: 'Mehdi Semmar',
    blog: {
      title: 'blog',
      blurb: 'Ideas, experiences, and thoughts, written down before I forget them.'
    },
    running: {
      title: 'running log',
      blurb: 'Mornings, splits, and little reflections, one run at a time.'
    },
    back: '← back',
    empty: 'Nothing here yet.',
    loading: 'Loading…',
    error: 'Oupsy, this log would not load. Try again in a moment.',
    runningLinkLabel: 'strava',
    skills: 'skills',
    untranslated: 'Not translated yet — shown in English.'
  },
  fr: {
    nav: { home: 'accueil', resume: 'cv', blog: 'blogue', running: 'course' },
    bio: [
      "Bonjour, je suis Mehdi Semmar, étudiant en génie logiciel à l'Université d'Ottawa. En cinq stages coop, j'ai travaillé dans le gouvernement, comme développeur full-stack en [sécurité publique](/blog/versaterm), ingénieur en apprentissage automatique en [R-D automobile](/blog/raven), et ingénieur logiciel en IA dans la [fintech](/blog/vertex). Passer de l'un à l'autre m'a appris à m'adapter vite à de nouveaux milieux et à de nouvelles technologies.",
      "Quand je ne suis pas en stage, je construis quelque chose à moi. J'ai cofondé et incorporé [RZO Sports](/blog/rzo), une place de marché reliant les athlètes aux terrains de sport, arrivée deuxième sur 40 équipes dans un concours de pitch. J'aime aussi m'impliquer dans ma communauté : équipe de développement d'uOttaHack 8, direction des événements de [SESA](/blog/sesa), et assistant d'enseignement pour des cours de génie logiciel.",
      "Depuis quelque temps, l'IA et l'apprentissage automatique m'attirent, et je commence comme assistant de recherche sur l'apprentissage par renforcement appliqué aux drones autonomes. J'aime aussi les mathématiques, assez pour suivre des cours supplémentaires à côté. En dehors du travail, je découvre le monde ou je cours (j'ai terminé un marathon).",
      'Toujours partant pour échanger. Bonne visite :)'
    ],
    portraitAlt: 'Mehdi Semmar',
    blog: {
      title: 'blogue',
      blurb: 'Des idées, des expériences et des pensées, notées avant que je les oublie.'
    },
    running: {
      title: 'journal de course',
      blurb: 'Les matins, les temps de passage et de petites réflexions, une sortie à la fois.'
    },
    back: '← retour',
    empty: "Rien pour l'instant.",
    loading: 'Chargement…',
    error: "Oupsy, ce journal n'a pas pu charger. Réessayez dans un instant.",
    runningLinkLabel: 'strava',
    skills: 'compétences',
    untranslated: 'Pas encore traduit — affiché en anglais.'
  }
}
