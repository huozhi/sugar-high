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
const isNamePart = ([type]) =>
  type === T_IDENTIFIER || type === T_CLASS || type === T_PROPERTY
const isNameStart = (token) => isNamePart(token) && !/^\d/.test(token[1])
const isHyphen = ([type, value]) => type === T_SIGN && value === '-'

/**
 * Rejoin CSS dashed identifiers split by the shared punctuation lexer.
 * @param {Array<[number, string]>} tokens
 */
const mergeDashedNames = (tokens) => {
  /** @type {Array<[number, string]>} */
  const merged = []
  for (let index = 0; index < tokens.length; index++) {
    let firstWord = index
    let end = index

    if (isHyphen(tokens[end])) {
      while (tokens[end] && isHyphen(tokens[end])) end++
      if (!tokens[end] || !isNameStart(tokens[end])) {
        merged.push(tokens[index])
        continue
      }
      firstWord = end++
    } else if (isNameStart(tokens[end])) {
      end++
    } else {
      merged.push(tokens[index])
      continue
    }

    let dashed = firstWord > index
    while (tokens[end] && isHyphen(tokens[end])) {
      const hyphenStart = end
      while (tokens[end] && isHyphen(tokens[end])) end++
      if (!tokens[end] || !isNamePart(tokens[end])) {
        end = hyphenStart
        break
      }
      dashed = true
      end++
    }

    if (!dashed) {
      merged.push(tokens[index])
      continue
    }
    const name = tokens.slice(index, end).map(([, value]) => value).join('')
    merged.push([tokens[firstWord][0], name])
    index = end - 1
  }
  return merged
}

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
  const tokens = mergeDashedNames(tokenizePlain(code, { ...options, tokenize: undefined }))
  /** @type {Array<[number, string]>} */
  const output = []
  let blockDepth = 0
  let declarationStart = false

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const [type, value] = token

    if (type === T_SIGN && value === '{') {
      blockDepth++
      declarationStart = true
      output.push(token)
      continue
    }
    if (type === T_SIGN && value === '}') {
      blockDepth--
      declarationStart = false
      output.push(token)
      continue
    }
    if (type === T_SIGN && value === ';') {
      declarationStart = blockDepth > 0
      output.push(token)
      continue
    }
    if (!declarationStart || isIgnored(type)) {
      output.push(token)
      continue
    }

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
      output.push([T_PROPERTY, property])
      index = propertyEnd - 1
    } else {
      output.push(token)
    }
    declarationStart = false
  }

  return output
}
