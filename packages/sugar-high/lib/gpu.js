// @ts-check

import { parse as parseWithGpu } from 'gpu-lexer'
import {
  assemble,
  render,
  T_CLASS,
  T_COMMENT,
  T_ENTITY,
  T_IDENTIFIER,
  T_KEYWORD,
  T_SIGN,
  T_SPACE,
  T_STRING,
  T_BREAK,
} from './shared.js'

const tokenTypes = Object.freeze({
  plain: T_IDENTIFIER,
  comment: T_COMMENT,
  string: T_STRING,
  number: T_CLASS,
  keyword: T_KEYWORD,
  type: T_CLASS,
  function: T_ENTITY,
  constant: T_CLASS,
  operator: T_SIGN,
})

/**
 * Preserve plain whitespace as Sugar High space and break tokens while mapping
 * the GPU lexer's semantic labels onto the existing theme vocabulary.
 * @param {Array<[number, string]>} tokens
 * @param {string} value
 */
function appendPlain(tokens, value) {
  for (const part of value.match(/\r\n|\r|\n|[^\S\r\n]+|[^\s\r\n]+/g) || []) {
    const type = part === '\n' || part === '\r' || part === '\r\n'
      ? T_BREAK
      : /^\s/.test(part)
        ? T_SPACE
        : T_IDENTIFIER
    tokens.push([type, part])
  }
}

/**
 * Parse source code with gpu-lexer and return Sugar High's structured format.
 * GPU labels are adapted to the existing token and theme types.
 * @param {string} code
 * @returns {Promise<import('./core.js').ParsedCode>}
 */
async function parse(code) {
  const spans = await parseWithGpu(code)
  /** @type {Array<[number, string]>} */
  const tokens = []
  let cursor = 0

  for (const span of spans) {
    const start = Math.max(cursor, Math.min(code.length, span.start))
    const end = Math.max(start, Math.min(code.length, span.end))
    if (start > cursor) appendPlain(tokens, code.slice(cursor, start))
    cursor = start
    if (end === start) continue

    const value = code.slice(start, end)
    if (span.type === 'plain') appendPlain(tokens, value)
    else tokens.push([tokenTypes[span.type] ?? T_IDENTIFIER, value])
    cursor = end
  }

  if (cursor < code.length) appendPlain(tokens, code.slice(cursor))
  return assemble(code, tokens)
}

/**
 * Highlight source code asynchronously with WebGPU.
 * @param {string} code
 * @param {import('./core.js').DisplayOptions | undefined} options
 */
async function highlight(code, options) {
  return render(await parse(code), options)
}

export { highlight, parse }
