// @ts-check
import { tokenize as tokenizeCss } from './css.js'
import { tokenize as tokenizeJavaScript } from './javascript.js'

const htmlOptions = {
  keywords: new Set(),
  jsx: true,
  regex: false,
  templateStrings: false,
  onCommentStart: (_currentChar, _nextChar, index, code) => code.startsWith('<!--', index) ? 2 : 0,
  onCommentEnd: (_prevChar, _currChar, index, code) => code.slice(index - 2, index + 1) === '-->' ? 2 : 0,
}

const tokenizeHtml = (code) => tokenizeJavaScript(code, htmlOptions)

const embeddedBlock = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi

/**
 * Tokenize HTML-like files while delegating script and style bodies to their
 * existing language presets. Framework-specific template syntax remains HTML-like.
 * @param {string} code
 * @returns {Array<[number, string]>}
 */
export function tokenizeEmbeddedHtml(code) {
  /** @type {Array<[number, string]>} */
  const tokens = []
  let cursor = 0

  for (const match of code.matchAll(embeddedBlock)) {
    const start = match.index ?? 0
    const block = match[0]
    const tag = match[1].toLowerCase()
    const openEnd = block.indexOf('>') + 1
    const closeStart = block.lastIndexOf('</')

    tokens.push(...tokenizeHtml(code.slice(cursor, start)))
    tokens.push(...tokenizeHtml(block.slice(0, openEnd)))
    tokens.push(...(tag === 'style'
      ? tokenizeCss(block.slice(openEnd, closeStart))
      : tokenizeJavaScript(block.slice(openEnd, closeStart), { jsx: false })))
    tokens.push(...tokenizeHtml(block.slice(closeStart)))
    cursor = start + block.length
  }

  tokens.push(...tokenizeHtml(code.slice(cursor)))
  return tokens
}
