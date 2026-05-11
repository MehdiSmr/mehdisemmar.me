const MIN_TERMINAL_WIDTH = 1100

const hasWindow = () => typeof window !== 'undefined'

const isTouchDevice = () => {
  if (!hasWindow()) return false

  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const noHover = window.matchMedia?.('(hover: none)').matches ?? false
  const touchPoints = navigator.maxTouchPoints > 0
  const touchEvent = 'ontouchstart' in window

  return coarsePointer || noHover || touchPoints || touchEvent
}

const isScreenTooSmallForTerminal = () => {
  if (!hasWindow()) return false
  return window.innerWidth < MIN_TERMINAL_WIDTH
}

const isTerminalExperienceAllowed = () => {
  return !isTouchDevice() && !isScreenTooSmallForTerminal()
}

export {
  MIN_TERMINAL_WIDTH,
  isTouchDevice,
  isScreenTooSmallForTerminal,
  isTerminalExperienceAllowed,
}
