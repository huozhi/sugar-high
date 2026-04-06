export * as css from './lang/css.js'
export * as rust from './lang/rust.js'
export * as python from './lang/python.js'
export * as c from './lang/c.js'
export * as go from './lang/go.js'
export * as java from './lang/java.js'

const PRESET_ALIASES = new Map([
  ['c', 'c'],
  ['go', 'go'],
  ['java', 'java'],
  ['py', 'python'],
  ['rs', 'rust'],
  ['rust', 'rust'],
  ['css', 'css'],
])

export function resolvePresetLanguage(language) {
  const key = (language || '').toLowerCase()
  return PRESET_ALIASES.get(key) || key
}
