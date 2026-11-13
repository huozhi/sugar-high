// @ts-check

import {
  c, cpp, csharp, css, diff, dockerfile, go, glsl, graphql, hcl, html, java, javascript, json,
  kotlin, lua, markdown, php, plaintext, powershell, python, ruby, rust, shell, sql,
  svelte, swift, toml, typescript, vue, yaml, zig,
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
  { id: 'css', extension: 'css', aliases: ['scss'], config: css },
  { id: 'python', extension: 'py', aliases: ['py', 'python3'], config: python },
  { id: 'c', extension: 'c', aliases: [], config: c },
  { id: 'go', extension: 'go', aliases: ['golang'], config: go },
  { id: 'glsl', extension: 'glsl', aliases: ['vert', 'frag', 'geom', 'tesc', 'tese', 'comp'], config: glsl },
  { id: 'java', extension: 'java', aliases: [], config: java },
  { id: 'rust', extension: 'rs', aliases: ['rs'], config: rust },
  { id: 'json', extension: 'json', aliases: ['jsonc'], config: json },
  { id: 'diff', extension: 'diff', aliases: ['patch'], config: diff },
  { id: 'shell', extension: 'sh', aliases: ['sh', 'bash', 'zsh'], config: shell },
  { id: 'cpp', extension: 'cpp', aliases: ['c++', 'cc', 'cxx'], config: cpp },
  { id: 'csharp', extension: 'cs', aliases: ['c#', 'cs', 'dotnet'], config: csharp },
  { id: 'sql', extension: 'sql', aliases: [], config: sql },
  { id: 'html', extension: 'html', aliases: ['htm', 'xml'], config: html },
  { id: 'vue', extension: 'vue', aliases: [], config: vue },
  { id: 'svelte', extension: 'svelte', aliases: [], config: svelte },
  { id: 'yaml', extension: 'yaml', aliases: ['yml'], config: yaml },
  { id: 'markdown', extension: 'md', aliases: ['md', 'mdx'], config: markdown },
  { id: 'plaintext', extension: 'txt', aliases: ['text', 'plain'], config: plaintext },
  { id: 'ruby', extension: 'rb', aliases: [], config: ruby },
  { id: 'kotlin', extension: 'kt', aliases: ['kts'], config: kotlin },
  { id: 'swift', extension: 'swift', aliases: [], config: swift },
  { id: 'php', extension: 'php', aliases: [], config: php },
  { id: 'toml', extension: 'toml', aliases: [], config: toml },
  { id: 'powershell', extension: 'ps1', aliases: ['pwsh'], config: powershell },
  { id: 'dockerfile', extension: 'dockerfile', aliases: ['docker'], config: dockerfile },
  { id: 'graphql', extension: 'graphql', aliases: ['gql'], config: graphql },
  { id: 'hcl', extension: 'hcl', aliases: ['terraform', 'tf'], config: hcl },
  { id: 'zig', extension: 'zig', aliases: [], config: zig },
  { id: 'lua', extension: 'lua', aliases: [], config: lua },
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
