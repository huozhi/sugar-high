// @ts-check
import { tokenizeEmbeddedHtml } from './embedded-html.js'

export const keywords = new Set([])
export const jsx = true
export const regex = false
export const templateStrings = false
export const tokenize = tokenizeEmbeddedHtml

export const onCommentStart = (_currentChar, _nextChar, index, code) =>
  code.startsWith('<!--', index) ? 2 : 0

export const onCommentEnd = (_prevChar, _currChar, index, code) =>
  code.slice(index - 2, index + 1) === '-->' ? 2 : 0
