// @ts-check

import {
  assemble, generate, SugarHigh, toHtml, T_BREAK, T_CLASS, T_COMMENT, T_IDENTIFIER,
  T_KEYWORD, T_PROPERTY, T_SIGN, T_SPACE, T_STRING,
} from './shared.js'

const signs = new Set('+-*/%=!&|^~?:.,;()[]{}<>#@\\'.split(''))
const noComment = () => 0

/** @param {string} value */
const isWord = (value) => value === '_' || value === '$' || /[\p{L}\p{N}]/u.test(value)

/** @param {string} code @param {number} index */
function isQuotedKey(code, index) {
  while (index < code.length && /\s/.test(code[index])) index++
  return code[index] === ':'
}

/**
 * General-purpose lexer for keyword, string, comment, and punctuation based languages.
 * Complex language presets may supply `tokenize` to replace this stage.
 * @param {string} code
 * @param {HighlightOptions | undefined} options
 * @returns {Array<[number, string]>}
 */
function tokenize(code, options) {
  if (typeof options?.tokenize === 'function') return options.tokenize(code, options)

  const keywords = options?.keywords || new Set()
  const typeKeywords = options?.typeKeywords || new Set()
  const onCommentStart = options?.onCommentStart || noComment
  const onCommentEnd = options?.onCommentEnd || noComment
  const normalize = options?.caseInsensitive
    ? (value) => value.toLowerCase()
    : (value) => value
  /** @type {Array<[number, string]>} */
  const tokens = []
  let lastSignificant = ''

  /** @param {number} type @param {string} value */
  function append(type, value) {
    if (!value) return
    tokens.push([type, value])
    if (type !== T_SPACE && type !== T_BREAK) lastSignificant = value
  }

  for (let i = 0; i < code.length;) {
    const curr = code[i]
    const next = code[i + 1]

    const commentType = onCommentStart(curr, next, i, code)
    if (commentType) {
      const start = i++
      while (i < code.length) {
        if (onCommentEnd(code[i - 1], code[i], i, code) == commentType) {
          i++
          break
        }
        i++
      }
      append(T_COMMENT, code.slice(start, i))
      continue
    }

    const literalLength = options?.onLiteral?.(curr, i, code)
    if (literalLength) {
      append(T_STRING, code.slice(i, i + literalLength))
      i += literalLength
      continue
    }

    if (typeof options?.onQuote === 'function' && curr === "'") {
      const length = options.onQuote(curr, i, code)
      if (typeof length === 'number' && length >= 1) {
        append(T_IDENTIFIER, code.slice(i, i + length))
        i += length
        continue
      }
    }

    if (curr === '"' || curr === "'" || (options?.templateStrings && curr === '`')) {
      const quote = curr
      const start = i++
      while (i < code.length) {
        if (code[i] === quote && code[i - 1] !== '\\') {
          i++
          break
        }
        i++
      }
      const value = code.slice(start, i)
      append(options?.quotedKeys && isQuotedKey(code, i) ? T_PROPERTY : T_STRING, value)
      continue
    }

    if (curr === '\n') {
      append(T_BREAK, curr)
      i++
      continue
    }

    if (/[^\S\r\n]/.test(curr)) {
      const start = i++
      while (i < code.length && /[^\S\r\n]/.test(code[i])) i++
      append(T_SPACE, code.slice(start, i))
      continue
    }

    if (isWord(curr)) {
      const start = i++
      while (i < code.length && isWord(code[i])) i++
      const value = code.slice(start, i)
      const normalized = normalize(value)
      const type = typeKeywords.has(normalized)
        ? T_CLASS
        : keywords.has(normalized)
          ? T_KEYWORD
          : lastSignificant === '.'
            ? T_PROPERTY
            : (/^\d/.test(value) || value === 'null' || /^\p{Lu}/u.test(value))
              ? T_CLASS
              : T_IDENTIFIER
      append(type, value)
      continue
    }

    if (signs.has(curr)) {
      append(T_SIGN, curr)
      i++
      continue
    }

    append(T_STRING, curr)
    i++
  }

  return tokens
}

/** @param {string} code @param {ParseOptions | undefined} options */
function parse(code, options) {
  const parsed = assemble(code, tokenize(code, options))
  if (options?.annotateLine) {
    for (const line of parsed.lines) options.annotateLine(line)
  }
  return parsed
}

/** @param {ParsedCode} parsed @param {DisplayOptions | undefined} options */
function render(parsed, options) {
  return toHtml(generate(parsed, options))
}

export { generate, parse, render, SugarHigh, tokenize }

/**
 * @typedef {Object} ParseOptions
 * @property {Set<string>} [keywords]
 * @property {Set<string>} [typeKeywords]
 * @property {(curr: string, next: string, index: number, code: string) => number | boolean} [onCommentStart]
 * @property {(prev: string, curr: string, index: number, code: string) => number | boolean} [onCommentEnd]
 * @property {(curr: string, index: number, code: string) => number | null | undefined} [onLiteral]
 * @property {(curr: string, index: number, code: string) => number | null | undefined} [onQuote]
 * @property {boolean} [quotedKeys]
 * @property {boolean} [caseInsensitive]
 * @property {boolean} [templateStrings]
 * @property {(code: string, options: ParseOptions) => Array<[number, string]>} [tokenize]
 * @property {(line: AnnotateLine) => void} [annotateLine]
 */

/**
 * @typedef {Object} DisplayOptions
 * @property {Partial<Record<TokenType, string>>} [cx]
 * @property {(token: MarkToken) => void} [mark]
 * @property {(line: MarkLine) => void} [markLine]
 */

/**
 * @typedef {'identifier' | 'keyword' | 'string' | 'class' | 'property' | 'entity' | 'jsxliterals' | 'sign' | 'comment' | 'break' | 'space'} TokenType
 * @typedef {{
 *   type: TokenType
 *   value: string
 *   className: string
 *   style: Record<string, string | number>
 *   properties: Record<string, string | number | boolean>
 * }} MarkToken
 * @typedef {{ type: TokenType, value: string }} ParsedToken
 * @typedef {{
 *   index: number
 *   value: string
 *   tokens: ParsedToken[]
 *   annotations: string[]
 * }} ParsedLine
 * @typedef {ParsedLine} AnnotateLine
 * @typedef {ParsedLine & {
 *   className: string
 *   style: Record<string, string | number>
 *   properties: Record<string, string | number | boolean>
 * }} MarkLine
 * @typedef {{ value: string, lines: ParsedLine[] }} ParsedCode
 */
