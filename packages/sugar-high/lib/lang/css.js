// @ts-check
import {
  T_BREAK, T_CLASS, T_COMMENT, T_IDENTIFIER, T_PROPERTY, T_SIGN, T_SPACE,
} from '../shared.js'
import { tokenize as tokenizePlain } from '../core.js'

export const keywords = new Set([
  // css keywords like @media, @import, @keyframes, etc.
  '@media', '@import', '@keyframes', '@font-face', '@supports', '@page', '@counter-style',
  '@font-feature-values', '@viewport', '@counter-style', '@font-feature-values', '@document',
])

// Hyphenated names such as `font-size`, `--color`, or `-webkit-box`, but not `-1rem`.
export const word = /-*[\p{L}_$][\p{L}\p{N}_$]*(?:-+[\p{L}\p{N}_$]+)*/uy

export const onCommentStart = (currentChar, nextChar) => {
  return '/*' === (currentChar + nextChar) ? 1 : 0
}

export const onCommentEnd = (prevChar, currChar) => {
  return '*/' === (prevChar + currChar) ? 1 : 0
}

export const onLiteral = (curr, index, code) => {
  if (curr !== '#') return 0
  return code.slice(index).match(/^#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\w-])/i)?.[0].length || 0
}

const isIgnored = (type) => type === T_SPACE || type === T_BREAK || type === T_COMMENT
/** Return true when a colon belongs to a nested selector instead of a declaration. */
const opensBlock = (tokens, start) => {
  let parentheses = 0
  let brackets = 0
  for (let index = start; index < tokens.length; index++) {
    const [type, value] = tokens[index]
    if (type !== T_SIGN) continue
    if (value === '(') parentheses++
    else if (value === ')') parentheses--
    else if (value === '[') brackets++
    else if (value === ']') brackets--
    else if (!parentheses && !brackets && value === '{') return true
    else if (!parentheses && !brackets && (value === ';' || value === '}')) return false
  }
  return false
}

/**
 * Add CSS declaration context after the shared plain lexer runs.
 * @param {string} code
 * @param {import('../core.js').ParseOptions} options
 */
export const tokenize = (code, options) => {
  const tokens = tokenizePlain(code, { ...options, tokenize: undefined })
  let blockDepth = 0
  let declarationStart = false

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const [type, value] = token

    if (type === T_SIGN && (value === '{' || value === '}' || value === ';')) {
      if (value !== ';') blockDepth += value === '{' ? 1 : -1
      declarationStart = value === '{' || value === ';' && blockDepth > 0
      continue
    }
    if (!declarationStart || isIgnored(type)) continue

    let colon = index + 1
    while (colon < tokens.length && isIgnored(tokens[colon][0])) colon++
    if (
      (type === T_IDENTIFIER || type === T_CLASS) &&
      tokens[colon]?.[1] === ':' &&
      tokens[colon][0] === T_SIGN &&
      !opensBlock(tokens, colon + 1)
    ) {
      token[0] = T_PROPERTY
    }
    declarationStart = false
  }

  return tokens
}
