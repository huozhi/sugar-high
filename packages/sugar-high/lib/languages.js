// @ts-check

import * as c from './presets/lang/c.js'
import * as cpp from './presets/lang/cpp.js'
import * as csharp from './presets/lang/csharp.js'
import * as css from './presets/lang/css.js'
import * as diff from './presets/lang/diff.js'
import * as go from './presets/lang/go.js'
import * as java from './presets/lang/java.js'
import * as json from './presets/lang/json.js'
import * as python from './presets/lang/python.js'
import * as rust from './presets/lang/rust.js'
import * as shell from './presets/lang/shell.js'
import * as sql from './presets/lang/sql.js'

/**
 * @typedef {import('./index.js').HighlightOptions} HighlightOptions
 * @typedef {{
 *   id: string
 *   extension: string
 *   aliases: readonly string[]
 *   config?: HighlightOptions
 * }} Language
 */

/**
 * Disable JavaScript-only scanner modes for a non-JavaScript language.
 * @param {HighlightOptions} config
 * @returns {HighlightOptions}
 */
function nonJavaScript(config) {
  return {
    ...config,
    jsx: false,
    regex: false,
    templateStrings: false,
  }
}

/** @type {readonly Language[]} */
const languages = Object.freeze([
  { id: 'javascript', extension: 'js', aliases: Object.freeze(['js', 'jsx', 'node']) },
  { id: 'typescript', extension: 'ts', aliases: Object.freeze(['ts', 'tsx']) },
  { id: 'css', extension: 'css', aliases: Object.freeze(['scss']), config: nonJavaScript(css) },
  { id: 'python', extension: 'py', aliases: Object.freeze(['py', 'python3']), config: nonJavaScript(python) },
  { id: 'c', extension: 'c', aliases: Object.freeze([]), config: nonJavaScript(c) },
  { id: 'go', extension: 'go', aliases: Object.freeze(['golang']), config: nonJavaScript(go) },
  { id: 'java', extension: 'java', aliases: Object.freeze([]), config: nonJavaScript(java) },
  { id: 'rust', extension: 'rs', aliases: Object.freeze(['rs']), config: nonJavaScript(rust) },
  { id: 'json', extension: 'json', aliases: Object.freeze(['jsonc']), config: nonJavaScript(json) },
  { id: 'diff', extension: 'diff', aliases: Object.freeze(['patch']), config: nonJavaScript(diff) },
  { id: 'shell', extension: 'sh', aliases: Object.freeze(['sh', 'bash', 'zsh']), config: nonJavaScript(shell) },
  { id: 'cpp', extension: 'cpp', aliases: Object.freeze(['c++', 'cc', 'cxx']), config: nonJavaScript(cpp) },
  { id: 'csharp', extension: 'cs', aliases: Object.freeze(['c#', 'cs', 'dotnet']), config: nonJavaScript(csharp) },
  { id: 'sql', extension: 'sql', aliases: Object.freeze([]), config: nonJavaScript(sql) },
])

/** @param {string} value */
function normalizeLanguageName(value) {
  return value.trim().toLowerCase().replace(/^\./, '')
}

/** @type {Map<string, Language>} */
const languageLookup = new Map()

for (const language of languages) {
  const names = new Set([language.id, language.extension, ...language.aliases])
  for (const name of names) {
    const normalized = normalizeLanguageName(name)
    const existing = languageLookup.get(normalized)
    if (existing && existing !== language) {
      throw new Error(
        `Language name "${normalized}" is shared by "${existing.id}" and "${language.id}"`
      )
    }
    languageLookup.set(normalized, language)
  }
}

/**
 * Find canonical language metadata using a name, alias, or preferred extension.
 * @param {string} name
 * @returns {Language | undefined}
 */
function getLanguage(name) {
  if (typeof name !== 'string') return undefined
  return languageLookup.get(normalizeLanguageName(name))
}

/**
 * Find metadata only when the input is already a canonical language name.
 * Direct highlighting uses this stricter lookup; integrations resolve aliases first.
 * @param {string} name
 * @returns {Language | undefined}
 */
function getCanonicalLanguage(name) {
  if (typeof name !== 'string') return undefined
  const normalized = normalizeLanguageName(name)
  const language = languageLookup.get(normalized)
  return language?.id === normalized ? language : undefined
}

/**
 * Resolve a name, alias, or extension to its canonical language name.
 * @param {string} name
 * @returns {string | undefined}
 */
function resolveLanguage(name) {
  return getLanguage(name)?.id
}

export {
  getCanonicalLanguage,
  getLanguage,
  languages,
  normalizeLanguageName,
  resolveLanguage,
}
