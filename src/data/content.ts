export type Lang = 'en' | 'fr'

export type SectionKey =
  | 'work'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'volunteering'
  | 'cv'
  | 'coffee'
  | 'running'

export interface EntryLink {
  label: string
  href: string
}

/** Extra material shown only in the entry's detail popup. */
export interface EntryDetail {
  /** Mono line under the title. Falls back to the entry's `a`. */
  meta?: string
  /** Long-form body. Falls back to the entry's `c`. */
  body?: string
  /** Chips under the rule. Omitted entirely when absent. */
  skills?: string[]
}

export interface Entry {
  /** Left column: year, date or role marker. */
  a: string
  /** Title. */
  b: string
  /** Body. */
  c: string
  link?: EntryLink
  /**
   * Photos, in order. Feeds the index thumbnail (`images[0]`), the detail
   * popup's grid, and the log carousel. Absent falls back to blank plates.
   */
  images?: string[]
  detail?: EntryDetail
}

export interface LangContent {
  role: string
  intro: string
  back: string
  /** Shown when a section has no entries yet. */
  empty: string
  /** Dismiss control in the detail popup. */
  close: string
  /** Heading above the skill chips. */
  skills: string
  /** Caption stem on a blank plate in the detail popup. */
  photo: string
  /** Link label on a log entry that carries a maps URL. */
  map: string
  /** Shown while a log page is waiting on its sheet. */
  loading: string
  /** Shown when a log's sheet could not be reached at all. */
  error: string
  labels: Record<SectionKey, string>
  blurbs: Record<PageSection, string>
  plates: Record<PageSection, string>
  entries: Record<SectionKey, Entry[]>
}

/** Sections that open as their own page instead of expanding in place. */
export const PAGE_SECTIONS = ['coffee', 'running'] as const
export type PageSection = (typeof PAGE_SECTIONS)[number]

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

/**
 * How each index row behaves:
 *  - accordion — expands in place (hidden entirely while it has no entries)
 *  - external  — opens `href` in a new tab
 *  - page      — routes to its own log page
 */
export type SectionKind = 'accordion' | 'external' | 'page'

export interface Section {
  key: SectionKey
  kind: SectionKind
  href?: string
}

/** Index rows are numbered by their position in this list. */

export const SECTIONS: Section[] = [
  { key: 'work', kind: 'accordion' },
  { key: 'projects', kind: 'accordion' },
  { key: 'education', kind: 'accordion' },
  { key: 'certifications', kind: 'accordion' },
  { key: 'volunteering', kind: 'accordion' },
  { key: 'cv', kind: 'external', href: links.resume },
  { key: 'coffee', kind: 'page' },
  { key: 'running', kind: 'page' }
]

// The coffee and running entries below are seed content from the design — placeholders
// meant to be replaced with real ones. Running entries have no `link` yet; add
// `link: { label: 'strava', href: '…' }` once the Strava URLs are in hand.
//
// `certifications` is empty in both languages: fill it in and the row appears in the
// index on its own. Empty accordion sections are not rendered.
export const content: Record<Lang, LangContent> = {
  en: {
    role: 'Software Engineer',
    intro:
      'I build systems that hold engineering teams to their contracts. Currently in software engineering at uOttawa, between internships. I run in the mornings and take coffee seriously.',
    back: '← index',
    empty: 'Nothing here yet.',
    close: 'close',
    skills: 'skills',
    photo: 'photo',
    map: 'map',
    loading: 'Loading…',
    error: 'Oupsy, this log would not load. Try again in a moment.',
    labels: {
      work: 'work',
      projects: 'projects',
      education: 'education',
      certifications: 'certifications',
      volunteering: 'volunteering',
      cv: 'résumé',
      coffee: 'coffee log',
      running: 'running log'
    },
    blurbs: {
      coffee: 'Every cup worth writing down, where I found it, and whether I would go back.',
      running: 'Mornings, splits, and what the run actually felt like.'
    },
    plates: {
      coffee: 'photo of the cup',
      running: 'photo from the run'
    },
    entries: {
      work: [
        {
          a: '2026',
          b: 'University of Ottawa',
          c: 'Research assistant on reinforcement learning for autonomous drones, with Dr. Bellinger.',
          detail: { skills: ['Reinforcement Learning', 'Autonomous Drones', 'Python'] }
        },
        {
          a: '2026',
          b: 'Vertex Inc.',
          c: 'Built an OpenAPI governance platform of four repositories: a Go engine on PostgreSQL, Terraform infrastructure, a developer portal, and an audit agent. It enforces API compatibility across every engineering team. Won an internal hackathon among 30 engineers.',
          detail: { skills: ['Go', 'PostgreSQL', 'Terraform', 'OpenAPI'] }
        },
        {
          a: '2025',
          b: 'Raven Connected',
          c: 'Forecasted leaf-pile volumes from images with SAM3/SAM3D, closing a four-figure client contract. Built the pipeline: segmentation, VGGT 3D generation, Gaussian splatting, Depth Pro height estimation.',
          detail: { skills: ['SAM3 / SAM3D', 'VGGT', 'Gaussian Splatting', 'Depth Pro'] }
        },
        {
          a: '2025',
          b: 'Versaterm',
          c: 'Electron desktop app for VMobile that turned JSON form configuration into an interface customer success teams could actually use. A parser GUI cut rule-writing time in half.',
          detail: { skills: ['Electron', 'JSON', 'Desktop UI'] }
        }
      ],
      projects: [
        {
          a: 'ongoing',
          b: 'RZO Sports',
          c: 'Co-founded a two-sided marketplace connecting athletes with venues. Top 2 of 40+ teams at a pitch competition. Spring Boot, React, MySQL, Docker on EC2.',
          link: { label: 'rzosports.com', href: 'https://rzo-sports.com/' },
          detail: { skills: ['Spring Boot', 'React', 'MySQL', 'Docker', 'EC2'] }
        }
      ],
      education: [
        {
          a: '2023–27',
          b: 'BASc Software Engineering, uOttawa',
          c: "Engineering Management & Entrepreneurship, co-op. GPA 4.0/4.0, six-time Dean's List, TD Green and J-D Hearnshaw scholarships.",
          link: { label: 'uottawa', href: 'https://www.uottawa.ca/en' }
        }
      ],
      certifications: [],
      volunteering: [
        {
          a: '2025',
          b: 'SESA, Events team lead',
          c: 'Led a team of six delivering technical workshops with Amazon, Ciena, Deloitte and National Bank.',
          link: { label: 'sesa', href: 'https://www.sesa-aegl.ca/en' }
        },
        {
          a: '2025',
          b: 'uOttaHack 8',
          c: 'Admin tool for on-site operations, covering check-in and meal tracking for 3,000+ users, plus the official event site.',
          link: { label: 'github', href: 'https://github.com/MehdiSmr' }
        },
        {
          a: '2022–23',
          b: 'École des grands, math mentor',
          c: 'Weekly calculus and linear algebra sessions for high school students, with interactive material I built for the group.',
          link: { label: 'école des grands', href: 'https://ecoleddesgrandsuottawa.ca' }
        }
      ],
      cv: [],
      // Both logs are fetched from their Google Sheet at runtime — see
      // useSheetLog. Nothing renders from here, so nothing is kept here.
      coffee: [],
      running: []
    }
  },
  fr: {
    role: 'Ingénieur logiciel',
    intro:
      "Je construis des systèmes qui tiennent les équipes à leurs contrats d'API. Génie logiciel à l'Université d'Ottawa, entre deux stages. Je cours le matin et je prends le café au sérieux.",
    back: '← index',
    empty: "Rien pour l'instant.",
    close: 'fermer',
    skills: 'compétences',
    photo: 'photo',
    map: 'carte',
    loading: 'Chargement…',
    error: "Oupsy, ce journal n'a pas pu charger. Réessayez dans un instant.",
    labels: {
      work: 'expérience',
      projects: 'projets',
      education: 'formation',
      certifications: 'certifications',
      volunteering: 'bénévolat',
      cv: 'cv',
      coffee: 'journal de café',
      running: 'journal de course'
    },
    blurbs: {
      coffee: "Chaque tasse qui mérite une note, où je l'ai trouvée, et si j'y retourne.",
      running: 'Les matins, les temps de passage, et ce que la sortie a vraiment donné.'
    },
    plates: {
      coffee: 'photo de la tasse',
      running: 'photo de la sortie'
    },
    entries: {
      work: [
        {
          a: '2026',
          b: "Université d'Ottawa",
          c: 'Assistant de recherche en apprentissage par renforcement appliqué aux drones autonomes, avec le Dr Bellinger.',
          detail: { skills: ['Apprentissage par renforcement', 'Drones autonomes', 'Python'] }
        },
        {
          a: '2026',
          b: 'Vertex Inc.',
          c: "Plateforme de gouvernance OpenAPI en quatre dépôts : moteur Go sur PostgreSQL, infrastructure Terraform, portail développeur et agent d'audit. Elle impose la compatibilité des API à toutes les équipes. Gagnant d'un hackathon interne parmi 30 ingénieurs.",
          detail: { skills: ['Go', 'PostgreSQL', 'Terraform', 'OpenAPI'] }
        },
        {
          a: '2025',
          b: 'Raven Connected',
          c: 'Estimation du volume de tas de feuilles à partir d’images avec SAM3/SAM3D, un contrat client à quatre chiffres à la clé. Pipeline complet : segmentation, génération 3D VGGT, splatting gaussien.',
          detail: { skills: ['SAM3 / SAM3D', 'VGGT', 'Splatting gaussien', 'Depth Pro'] }
        },
        {
          a: '2025',
          b: 'Versaterm',
          c: "Application Electron pour VMobile transformant la configuration JSON en interface utilisable. Un GUI de parseur a réduit de moitié le temps d'écriture des règles.",
          detail: { skills: ['Electron', 'JSON', 'Interface bureau'] }
        }
      ],
      projects: [
        {
          a: 'en cours',
          b: 'RZO Sports',
          c: "Cofondateur d'une place de marché reliant athlètes et terrains. Top 2 sur plus de 40 équipes en concours de pitch. Spring Boot, React, MySQL, Docker sur EC2.",
          link: { label: 'rzosports.com', href: 'https://rzo-sports.com/' },
          detail: { skills: ['Spring Boot', 'React', 'MySQL', 'Docker', 'EC2'] }
        }
      ],
      education: [
        {
          a: '2023–27',
          b: 'BASc génie logiciel, uOttawa',
          c: "Gestion de l'ingénierie et entrepreneuriat, coop. Moyenne 4,0/4,0, six fois au tableau d'honneur, bourses TD Green et J-D Hearnshaw.",
          link: { label: 'uottawa', href: 'https://www.uottawa.ca/fr' }
        }
      ],
      certifications: [],
      volunteering: [
        {
          a: '2025',
          b: 'SESA, responsable des événements',
          c: 'Équipe de six, ateliers techniques avec Amazon, Ciena, Deloitte et la Banque Nationale.',
          link: { label: 'sesa', href: 'https://www.sesa-aegl.ca/en' }
        },
        {
          a: '2025',
          b: 'uOttaHack 8',
          c: "Outil d'administration pour les opérations sur place, arrivées et repas pour plus de 3 000 personnes, ainsi que le site officiel de l'événement.",
          link: { label: 'github', href: 'https://github.com/MehdiSmr' }
        },
        {
          a: '2022–23',
          b: 'École des grands, mentor en mathématiques',
          c: "Séances hebdomadaires de calcul différentiel et d'algèbre linéaire pour des élèves du secondaire, avec du matériel interactif conçu pour le groupe.",
          link: { label: 'école des grands', href: 'https://ecoleddesgrandsuottawa.ca' }
        }
      ],
      cv: [],
      // Same as the English side: the sheet is the only source.
      coffee: [],
      running: []
    }
  }
}
