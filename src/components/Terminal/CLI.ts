import { ref } from 'vue'
import i18n from '../../i18n'
import { getLocalizedPortfolioData } from '../../data/portfolioLocalized'
import { activeHologramCard, showHologramCard, hideHologramCard, type HologramCardData } from '../Hologramme/cardState'

type Directory = 'home' | 'experience' | 'projects' | 'extracurriculars'
type HologramDirectory = Exclude<Directory, 'home'>
type CardCommand = 'open' | 'goto'

const ROOT_DIRECTORY: Directory = 'home'
const HOLOGRAM_DIRECTORIES: HologramDirectory[] = ['experience', 'projects', 'extracurriculars']
const COMMANDS = ['help', 'aboutme', 'skills', 'cd', 'ls', 'open', 'goto', 'close', 'clear', 'exit'] as const

const getCatalog = (): Record<HologramDirectory, HologramCardData[]> => {
  const locale = i18n.global.locale.value
  const localized = getLocalizedPortfolioData(locale)
  return {
    experience: localized.experienceData,
    projects: localized.projectData,
    extracurriculars: localized.extracurricularsData,
  }
}

const getFileStructure = (): Record<'home', Record<HologramDirectory, string[]>> => {
  const catalog = getCatalog()
  return {
    home: {
      experience: catalog.experience.map((item) => item.name),
      projects: catalog.projects.map((item) => item.name),
      extracurriculars: catalog.extracurriculars.map((item) => item.name),
    },
  }
}

const currentDirectory = ref<Directory>(ROOT_DIRECTORY)

const normalize = (value: string) => value.toLowerCase().replace(/[_\-\s]+/g, '')
const OPEN_URL_PREFIX = '__OPEN_URL__:'
const EXIT_SIGNAL = '__EXIT__'
const buildOpenUrlSignal = (url: string) => `${OPEN_URL_PREFIX}${url}`

const isHologramDirectory = (value: string): value is HologramDirectory => {
  return HOLOGRAM_DIRECTORIES.includes(value as HologramDirectory)
}

const directoryToSegments = (directory: Directory): string[] => {
  if (directory === ROOT_DIRECTORY) return []
  return [directory]
}

const segmentsToDirectory = (segments: string[]): Directory => {
  if (segments.length === 0) return ROOT_DIRECTORY
  return segments[0] as HologramDirectory
}

const sanitizePath = (path: string) => path.trim().replace(/\/+$/, '')

const resolveDirectoryPath = (pathInput: string, baseDirectory: Directory): Directory | null => {
  const sanitized = sanitizePath(pathInput)

  if (sanitized === '' || sanitized === '.') return baseDirectory
  if (sanitized === '~' || sanitized === '/' || sanitized === 'home') return ROOT_DIRECTORY

  let relativePath = sanitized
  let segments = directoryToSegments(baseDirectory)

  if (relativePath.startsWith('/')) {
    segments = []
    relativePath = relativePath.slice(1)
  }

  if (relativePath === 'home') return ROOT_DIRECTORY
  if (relativePath.startsWith('home/')) {
    segments = []
    relativePath = relativePath.slice('home/'.length)
  }

  if (relativePath === '') return segmentsToDirectory(segments)

  const parts = relativePath.split('/').filter(Boolean)

  for (const part of parts) {
    if (part === '.') continue

    if (part === '..') {
      if (segments.length > 0) segments.pop()
      continue
    }

    if (!isHologramDirectory(part)) return null

    if (segments.length > 0) {
      // single-level filesystem under home only
      return null
    }

    segments = [part]
  }

  return segmentsToDirectory(segments)
}

const findCardInDirectory = (directory: HologramDirectory, query: string) => {
  const cards = getCatalog()[directory]
  const trimmedQuery = query.trim()

  const numericIndex = Number(trimmedQuery)
  if (!Number.isNaN(numericIndex) && Number.isInteger(numericIndex) && numericIndex > 0 && numericIndex <= cards.length) {
    return cards[numericIndex - 1]
  }

  const normalizedQuery = normalize(trimmedQuery)
  return cards.find((card) => normalize(card.name) === normalizedQuery)
}

type ResolvedCardTarget =
  | { directory: HologramDirectory; query: string }
  | { error: string }

const resolveCardTarget = (argument: string, baseDirectory: Directory, command: CardCommand): ResolvedCardTarget => {
  const trimmed = argument.trim()
  if (!trimmed) {
    return { error: `${command}: please provide an index, name, or path` }
  }

  const hasPath = trimmed.includes('/')

  if (!hasPath) {
    if (baseDirectory === ROOT_DIRECTORY) {
      return { error: `${command}: move to a category first or use a full path (e.g. ../projects/SeekAndFind)` }
    }

    return {
      directory: baseDirectory as HologramDirectory,
      query: trimmed,
    }
  }

  const sanitized = trimmed.replace(/\/+$/, '')
  const separatorIndex = sanitized.lastIndexOf('/')
  const pathPart = sanitized.slice(0, separatorIndex)
  const query = sanitized.slice(separatorIndex + 1).trim()

  if (!query) {
    return { error: `${command}: missing item name after path` }
  }

  const resolvedDirectory = resolveDirectoryPath(pathPart || '/', baseDirectory)
  if (!resolvedDirectory || resolvedDirectory === ROOT_DIRECTORY) {
    return { error: `${command}: '${pathPart || '/'}' is not a valid category path` }
  }

  return {
    directory: resolvedDirectory,
    query,
  }
}

const longestCommonPrefix = (values: string[]) => {
  if (values.length === 0) return ''
  let prefix = values[0]
  for (let i = 1; i < values.length; i++) {
    while (!values[i].toLowerCase().startsWith(prefix.toLowerCase()) && prefix.length > 0) {
      prefix = prefix.slice(0, -1)
    }
  }
  return prefix
}

const completeFromCandidates = (partial: string, candidates: string[], appendSpaceOnExactSingle = true) => {
  const matches = candidates.filter((candidate) => candidate.toLowerCase().startsWith(partial.toLowerCase()))
  if (matches.length === 0) return partial
  if (matches.length === 1) {
    const exact = matches[0]
    if (appendSpaceOnExactSingle && exact.toLowerCase() !== partial.toLowerCase()) return `${exact} `
    if (appendSpaceOnExactSingle && exact.toLowerCase() === partial.toLowerCase()) return `${exact} `
    return exact
  }

  return longestCommonPrefix(matches)
}

const buildDirectoryAutocompleteCandidates = (baseDirectory: Directory) => {
  const candidates = new Set<string>(['.', '..', '/', '~', 'home'])

  for (const directory of HOLOGRAM_DIRECTORIES) {
    candidates.add(directory)
    candidates.add(`${directory}/`)
    candidates.add(`/${directory}`)
    candidates.add(`/${directory}/`)
    candidates.add(`home/${directory}`)
    candidates.add(`home/${directory}/`)

    if (baseDirectory !== ROOT_DIRECTORY) {
      candidates.add(`../${directory}`)
      candidates.add(`../${directory}/`)
    }
  }

  return [...candidates]
}

const autocompleteDirectoryArgument = (argument: string) => {
  const trimmed = argument.trim()
  if (!trimmed) return argument

  return completeFromCandidates(trimmed, buildDirectoryAutocompleteCandidates(currentDirectory.value), false)
}

const autocompleteCardArgument = (argument: string) => {
  const trimmed = argument.trim()
  if (!trimmed) return argument

  if (trimmed.includes('/')) {
    const separatorIndex = trimmed.lastIndexOf('/')
    const pathPartWithSlash = trimmed.slice(0, separatorIndex + 1)
    const itemPartial = trimmed.slice(separatorIndex + 1)
    const resolvedDirectory = resolveDirectoryPath(pathPartWithSlash.slice(0, -1) || '/', currentDirectory.value)

    if (resolvedDirectory && resolvedDirectory !== ROOT_DIRECTORY) {
      const completedItem = completeFromCandidates(itemPartial, getFileStructure().home[resolvedDirectory], true)
      return `${pathPartWithSlash}${completedItem}`
    }

    return completeFromCandidates(trimmed, buildDirectoryAutocompleteCandidates(currentDirectory.value), false)
  }

  if (currentDirectory.value !== ROOT_DIRECTORY) {
    return completeFromCandidates(trimmed, getFileStructure().home[currentDirectory.value], true)
  }

  return completeFromCandidates(trimmed, buildDirectoryAutocompleteCandidates(currentDirectory.value), false)
}

function autocompleteInput(input: string) {
  const raw = input
  const trimmed = raw.trim()
  if (!trimmed) return raw

  const firstSpaceIndex = raw.indexOf(' ')
  if (firstSpaceIndex === -1) {
    return completeFromCandidates(raw, [...COMMANDS], true)
  }

  const command = raw.slice(0, firstSpaceIndex)
  const argument = raw.slice(firstSpaceIndex + 1)

  switch (command) {
    case 'cd':
    case 'ls': {
      const completed = autocompleteDirectoryArgument(argument)
      return `${command} ${completed}`
    }

    case 'open':
    case 'goto': {
      const completed = autocompleteCardArgument(argument)
      return `${command} ${completed}`
    }

    default:
      return raw
  }
}

async function executeCommand(input: string): Promise<string> {
  const trimmedInput = input.trim()
  if (!trimmedInput) return 'true'

  const [command, ...rest] = trimmedInput.split(' ')
  const argument = rest.join(' ').trim()
  const hasArgument = argument.length > 0

  switch (command) {
    case 'clear':
      return 'clear'

    case 'help':
      if (hasArgument) return 'help takes no arguments'
      return `AVAILABLE COMMANDS:

                help      - display this help message
                aboutme   - display information about me
                skills    - display my skills
                cd        - change directory
                ls        - list files in the current directory
                open      - open a hologram card
                goto      - open the url for an item
                close     - close the active hologram card
                clear     - clear terminal output
                exit      - return to portfolio page

EXAMPLE COMMANDS: 

                cd ../projects/
                ls /experience
                open ../projects/SeekAndFind
                goto ../experience/Raven Connected

KEYBOARD SHORTCUTS:

                Tab       - autocomplete commands, paths, and names
                Ctrl+H    - return to portfolio page
                Ctrl+M    - toggle sound on/off`

    case 'aboutme':
      if (hasArgument) return 'aboutme takes no arguments'
      return 'Software Engineering student at the University of Ottawa, focused on building interactive products.'

    case 'skills':
      if (hasArgument) return 'skills takes no arguments'
      return 'Skills: TypeScript, Vue, JavaScript, Three.js, backend fundamentals, and problem solving.'

    case 'cd': {
      const resolvedDirectory = resolveDirectoryPath(argument || '.', currentDirectory.value)
      if (!resolvedDirectory) return `${argument}: is not a directory`
      currentDirectory.value = resolvedDirectory
      return 'true'
    }

    case 'ls': {
      const targetDirectory = resolveDirectoryPath(argument || '.', currentDirectory.value)
      if (!targetDirectory) return `${argument}: is not a directory`

      if (targetDirectory === ROOT_DIRECTORY) {
        return printFiles(Object.keys(getFileStructure().home))
      }

      const hologramDirectory = targetDirectory as HologramDirectory
      return printFiles(getFileStructure().home[hologramDirectory])
    }

    case 'open': {
      const target = resolveCardTarget(argument, currentDirectory.value, 'open')
      if ('error' in target) return target.error

      const card = findCardInDirectory(target.directory, target.query)
      if (!card) return `open: could not find '${target.query}' in ${target.directory}`

      showHologramCard({
        ...card,
        category: target.directory,
      })

      return `opened hologram: ${card.name}`
    }

    case 'goto': {
      if (!hasArgument) {
        const activeCard = activeHologramCard.value
        if (!activeCard?.link) return 'goto: no active hologram with a valid url'
        return buildOpenUrlSignal(activeCard.link)
      }

      const target = resolveCardTarget(argument, currentDirectory.value, 'goto')
      if ('error' in target) return target.error

      const card = findCardInDirectory(target.directory, target.query)
      if (!card) return `goto: could not find '${target.query}' in ${target.directory}`
      if (!card.link) return `goto: no url found for '${card.name}'`

      showHologramCard({
        ...card,
        category: target.directory,
      })

      return buildOpenUrlSignal(card.link)
    }

    case 'close':
      if (hasArgument) return 'close takes no arguments'
      hideHologramCard()
      return 'hologram closed'

    case 'exit':
      if (hasArgument) return 'exit takes no arguments'
      return EXIT_SIGNAL

    default:
      return `command not found: ${command}`
  }

  return 'true'
}

function printFiles(files: string[]) {
  const items = files
    .map((file) => `<span class="ls-entry" style="display:inline-block;white-space:nowrap;">${file.trim()}</span>`)
    .join('')

  return `<span class="ls-output" style="display:flex;flex-wrap:wrap;column-gap:30px;row-gap:8px;max-width:100%;align-items:flex-start;">${items}</span>`
}

export { executeCommand, autocompleteInput, currentDirectory }
