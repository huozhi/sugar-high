// @ts-check

/**
 * @typedef {{
 *   id: string
 *   extension: string
 *   aliases: readonly string[]
 * }} Language
 */

const definitions = Object.freeze([
  { id: 'javascript', extension: 'js', aliases: Object.freeze(['js', 'jsx', 'node']) },
  { id: 'typescript', extension: 'ts', aliases: Object.freeze(['ts', 'tsx']) },
  { id: 'css', extension: 'css', aliases: Object.freeze(['scss']) },
  { id: 'python', extension: 'py', aliases: Object.freeze(['py', 'python3']) },
  { id: 'c', extension: 'c', aliases: Object.freeze([]) },
  { id: 'go', extension: 'go', aliases: Object.freeze(['golang']) },
  { id: 'java', extension: 'java', aliases: Object.freeze([]) },
  { id: 'rust', extension: 'rs', aliases: Object.freeze(['rs']) },
  { id: 'json', extension: 'json', aliases: Object.freeze(['jsonc']) },
  { id: 'diff', extension: 'diff', aliases: Object.freeze(['patch']) },
  { id: 'shell', extension: 'sh', aliases: Object.freeze(['sh', 'bash', 'zsh']) },
  { id: 'cpp', extension: 'cpp', aliases: Object.freeze(['c++', 'cc', 'cxx']) },
  { id: 'csharp', extension: 'cs', aliases: Object.freeze(['c#', 'cs', 'dotnet']) },
  { id: 'sql', extension: 'sql', aliases: Object.freeze([]) },
  { id: 'html', extension: 'html', aliases: Object.freeze(['htm', 'xml']) },
  { id: 'yaml', extension: 'yaml', aliases: Object.freeze(['yml']) },
  { id: 'markdown', extension: 'md', aliases: Object.freeze(['md', 'mdx']) },
  { id: 'kotlin', extension: 'kt', aliases: Object.freeze(['kts']) },
  { id: 'swift', extension: 'swift', aliases: Object.freeze([]) },
  { id: 'php', extension: 'php', aliases: Object.freeze([]) },
  { id: 'toml', extension: 'toml', aliases: Object.freeze([]) },
  { id: 'powershell', extension: 'ps1', aliases: Object.freeze(['pwsh']) },
  { id: 'dockerfile', extension: 'dockerfile', aliases: Object.freeze(['docker']) },
  { id: 'graphql', extension: 'graphql', aliases: Object.freeze(['gql']) },
  { id: 'hcl', extension: 'hcl', aliases: Object.freeze(['terraform', 'tf']) },
])

/** @type {readonly Language[]} */
const languages = definitions

/** @param {string} value */
function normalizeLanguageName(value) {
  return value.trim().toLowerCase().replace(/^\./, '')
}

/** @type {Map<string, Language>} */
const languageLookup = new Map()

for (const language of definitions) {
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
