// @ts-check

import {
  c, cpp, csharp, css, diff, dockerfile, go, graphql, hcl, html, java, javascript, json,
  kotlin, lua, markdown, nonJavaScript, php, plaintext, powershell, python, ruby, rust, shell, sql,
  swift, toml, typescript, yaml, zig,
} from './presets/configs.js'

/**
 * @typedef {import('./core.js').ParseOptions} ParseOptions
 * @typedef {{
 *   id: string
 *   extension: string
 *   aliases: readonly string[]
 *   config?: ParseOptions
 * }} Language
 */

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
  { id: 'plaintext', extension: 'txt', aliases: ['text', 'plain'], config: nonJavaScript(plaintext) },
  { id: 'ruby', extension: 'rb', aliases: [], config: nonJavaScript(ruby) },
  { id: 'kotlin', extension: 'kt', aliases: ['kts'], config: nonJavaScript(kotlin) },
  { id: 'swift', extension: 'swift', aliases: [], config: nonJavaScript(swift) },
  { id: 'php', extension: 'php', aliases: [], config: nonJavaScript(php) },
  { id: 'toml', extension: 'toml', aliases: [], config: nonJavaScript(toml) },
  { id: 'powershell', extension: 'ps1', aliases: ['pwsh'], config: nonJavaScript(powershell) },
  { id: 'dockerfile', extension: 'dockerfile', aliases: ['docker'], config: nonJavaScript(dockerfile) },
  { id: 'graphql', extension: 'graphql', aliases: ['gql'], config: nonJavaScript(graphql) },
  { id: 'hcl', extension: 'hcl', aliases: ['terraform', 'tf'], config: nonJavaScript(hcl) },
  { id: 'zig', extension: 'zig', aliases: [], config: nonJavaScript(zig) },
  { id: 'lua', extension: 'lua', aliases: [], config: nonJavaScript(lua) },
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
