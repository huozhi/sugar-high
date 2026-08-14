// @ts-check
import {
  T_BREAK, T_CLASS, T_COMMENT, T_IDENTIFIER, T_PROPERTY, T_SIGN, T_SPACE,
} from '../../shared.js'
import { tokenize as tokenizePlain } from '../../core.js'

export const keywords = new Set([
  // css keywords like @media, @import, @keyframes, etc.
  '@media', '@import', '@keyframes', '@font-face', '@supports', '@page', '@counter-style',
  '@font-feature-values', '@viewport', '@counter-style', '@font-feature-values', '@document',
])

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
const isPropertyPart = ([type, value]) =>
  type === T_IDENTIFIER || type === T_CLASS || (type === T_SIGN && value === '-')

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
 * @param {import('../../core.js').ParseOptions} options
 */
export const tokenize = (code, options) => {
  const tokens = tokenizePlain(code, { ...options, tokenize: undefined })
  let blockDepth = 0
  let declarationStart = false

  for (let index = 0; index < tokens.length; index++) {
    const [type, value] = tokens[index]

    if (type === T_SIGN && value === '{') {
      blockDepth++
      declarationStart = true
      continue
    }
    if (type === T_SIGN && value === '}') {
      blockDepth--
      declarationStart = false
      continue
    }
    if (type === T_SIGN && value === ';') {
      declarationStart = blockDepth > 0
      continue
    }
    if (!declarationStart || isIgnored(type)) continue

    const propertyStart = index
    let propertyEnd = index
    while (propertyEnd < tokens.length && isPropertyPart(tokens[propertyEnd])) {
      propertyEnd++
    }
    let colon = propertyEnd
    while (colon < tokens.length && isIgnored(tokens[colon][0])) colon++

    if (
      propertyEnd > propertyStart &&
      tokens[colon]?.[0] === T_SIGN &&
      tokens[colon][1] === ':' &&
      !opensBlock(tokens, colon + 1)
    ) {
      const property = tokens
        .slice(propertyStart, propertyEnd)
        .map(([, part]) => part)
        .join('')
      tokens.splice(propertyStart, propertyEnd - propertyStart, [T_PROPERTY, property])
    }
    declarationStart = false
  }

  return tokens
}
