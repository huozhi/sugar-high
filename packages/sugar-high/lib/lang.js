// @ts-check

import * as c from './presets/lang/c.js'
import * as cpp from './presets/lang/cpp.js'
import * as csharp from './presets/lang/csharp.js'
import * as css from './presets/lang/css.js'
import * as diff from './presets/lang/diff.js'
import * as dockerfile from './presets/lang/dockerfile.js'
import * as go from './presets/lang/go.js'
import * as html from './presets/lang/html.js'
import * as graphql from './presets/lang/graphql.js'
import * as hcl from './presets/lang/hcl.js'
import * as java from './presets/lang/java.js'
import * as json from './presets/lang/json.js'
import * as javascript from './presets/lang/javascript.js'
import * as kotlin from './presets/lang/kotlin.js'
import * as markdown from './presets/lang/markdown.js'
import * as php from './presets/lang/php.js'
import * as powershell from './presets/lang/powershell.js'
import * as python from './presets/lang/python.js'
import * as rust from './presets/lang/rust.js'
import * as shell from './presets/lang/shell.js'
import * as sql from './presets/lang/sql.js'
import * as swift from './presets/lang/swift.js'
import * as toml from './presets/lang/toml.js'
import * as typescript from './presets/lang/typescript.js'
import * as yaml from './presets/lang/yaml.js'

/**
 * @typedef {import('./core.js').ParseOptions} ParseOptions
 * @typedef {{
 *   id: string
 *   extension: string
 *   aliases: readonly string[]
 *   config?: ParseOptions
 * }} Language
 */

/**
 * Disable JavaScript-only scanner modes for a non-JavaScript language.
 * @param {ParseOptions} config
 * @returns {ParseOptions}
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
const languages = [
  { id: 'javascript', extension: 'js', aliases: ['js', 'jsx', 'node'], config: javascript },
  { id: 'typescript', extension: 'ts', aliases: ['ts', 'tsx'], config: typescript },
  { id: 'css', extension: 'css', aliases: ['scss'], config: nonJavaScript(css) },
  { id: 'python', extension: 'py', aliases: ['py', 'python3'], config: nonJavaScript(python) },
  { id: 'c', extension: 'c', aliases: [], config: nonJavaScript(c) },
  { id: 'go', extension: 'go', aliases: ['golang'], config: nonJavaScript(go) },
  { id: 'java', extension: 'java', aliases: [], config: nonJavaScript(java) },
  { id: 'rust', extension: 'rs', aliases: ['rs'], config: nonJavaScript(rust) },
  { id: 'json', extension: 'json', aliases: ['jsonc'], config: nonJavaScript(json) },
  { id: 'diff', extension: 'diff', aliases: ['patch'], config: nonJavaScript(diff) },
  { id: 'shell', extension: 'sh', aliases: ['sh', 'bash', 'zsh'], config: nonJavaScript(shell) },
  { id: 'cpp', extension: 'cpp', aliases: ['c++', 'cc', 'cxx'], config: nonJavaScript(cpp) },
  { id: 'csharp', extension: 'cs', aliases: ['c#', 'cs', 'dotnet'], config: nonJavaScript(csharp) },
  { id: 'sql', extension: 'sql', aliases: [], config: nonJavaScript(sql) },
  { id: 'html', extension: 'html', aliases: ['htm', 'xml'], config: html },
  { id: 'yaml', extension: 'yaml', aliases: ['yml'], config: nonJavaScript(yaml) },
  { id: 'markdown', extension: 'md', aliases: ['md', 'mdx'], config: nonJavaScript(markdown) },
  { id: 'kotlin', extension: 'kt', aliases: ['kts'], config: nonJavaScript(kotlin) },
  { id: 'swift', extension: 'swift', aliases: [], config: nonJavaScript(swift) },
  { id: 'php', extension: 'php', aliases: [], config: nonJavaScript(php) },
  { id: 'toml', extension: 'toml', aliases: [], config: nonJavaScript(toml) },
  { id: 'powershell', extension: 'ps1', aliases: ['pwsh'], config: nonJavaScript(powershell) },
  { id: 'dockerfile', extension: 'dockerfile', aliases: ['docker'], config: nonJavaScript(dockerfile) },
  { id: 'graphql', extension: 'graphql', aliases: ['gql'], config: nonJavaScript(graphql) },
  { id: 'hcl', extension: 'hcl', aliases: ['terraform', 'tf'], config: nonJavaScript(hcl) },
]

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
function findLanguage(name) {
  if (typeof name !== 'string') return undefined
  return languageLookup.get(normalizeLanguageName(name))
}

/**
 * Find metadata only when the input is already a canonical language name.
 * Direct highlighting uses this stricter lookup; integrations resolve aliases first.
 * @param {string} name
 * @returns {Language | undefined}
 */
/**
 * Resolve a name, alias, or extension to its canonical language name.
 * @param {string} name
 * @returns {string | undefined}
 */
function lang(name) {
  return findLanguage(name)?.id
}

export {
  lang,
  languages,
}
