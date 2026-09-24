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

const embeddedOpeningTag = /^<\s*(script|style)\b/i
const embeddedClosingTag = (tag) => new RegExp(`</\\s*${tag}\\s*>`, 'ig')

/** Find the end of a markup tag without treating `>` inside quotes as its end. */
function findTagEnd(code, start) {
  let quote = ''
  for (let index = start; index < code.length; index++) {
    const character = code[index]
    if (quote) {
      if (character === quote) quote = ''
    } else if (character === '"' || character === "'") {
      quote = character
    } else if (character === '>') {
      return index + 1
    }
  }
  return -1
}

/** Find real script/style blocks while ignoring comments and quoted attributes. */
function findEmbeddedBlocks(code) {
  const blocks = []
  let index = 0
  while (index < code.length) {
    if (code.startsWith('<!--', index)) {
      const commentEnd = code.indexOf('-->', index + 4)
      index = commentEnd === -1 ? code.length : commentEnd + 3
      continue
    }
    if (code[index] !== '<') {
      index++
      continue
    }

    const openEnd = findTagEnd(code, index)
    if (openEnd === -1) break
    const opening = code.slice(index, openEnd)
    const match = opening.match(embeddedOpeningTag)
    if (!match) {
      index = openEnd
      continue
    }

    const tag = match[1].toLowerCase()
    const closing = embeddedClosingTag(tag)
    closing.lastIndex = openEnd
    const closeMatch = closing.exec(code)
    if (!closeMatch) {
      index = openEnd
      continue
    }
    blocks.push({ start: index, openEnd, closeStart: closeMatch.index, end: closing.lastIndex, tag })
    index = closing.lastIndex
  }
  return blocks
}

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

  for (const block of findEmbeddedBlocks(code)) {
    const { start, openEnd, closeStart, end, tag } = block

    tokens.push(...tokenizeHtml(code.slice(cursor, start)))
    tokens.push(...tokenizeHtml(code.slice(start, openEnd)))
    tokens.push(...(tag === 'style'
      ? tokenizeCss(code.slice(openEnd, closeStart))
      : tokenizeJavaScript(code.slice(openEnd, closeStart), { jsx: false })))
    tokens.push(...tokenizeHtml(code.slice(closeStart, end)))
    cursor = end
  }

  tokens.push(...tokenizeHtml(code.slice(cursor)))
  return tokens
}
