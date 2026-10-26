// @ts-check
import { T_CLASS, T_IDENTIFIER, T_KEYWORD, T_PROPERTY, T_SIGN, T_SPACE } from '../shared.js'
import { tokenize as tokenizePlain } from '../core.js'

export const keywords = new Set([
  'check', 'data', 'ephemeral', 'false', 'for', 'if', 'import', 'in', 'locals', 'moved', 'module',
  'null', 'output', 'provider', 'removed', 'resource', 'terraform', 'true', 'variable',
])
export const onCommentStart = (curr, next) => curr === '#' ? 1 : curr + next === '//' ? 1 : curr + next === '/*' ? 2 : 0
export const onCommentEnd = (prev, curr) => curr === '\n' ? 1 : prev + curr === '*/' ? 2 : 0

/**
 * Highlight attribute names before `=` as properties, leaving `==` and `=>` alone.
 * @param {string} code
 * @param {import('../core.js').ParseOptions} options
 * @returns {Array<[number, string]>}
 */
export function tokenize(code, options) {
  const tokens = tokenizePlain(code, { ...options, tokenize: undefined })
  let name = -1
  for (let index = 0; index < tokens.length; index++) {
    const [type, value] = tokens[index]
    if (type === T_SPACE) continue
    if (name >= 0 && type === T_SIGN && value === '=') {
      let next = index + 1
      while (tokens[next]?.[0] === T_SPACE) next++
      const following = tokens[next]?.[1]
      if (following !== '=' && following !== '>') tokens[name][0] = T_PROPERTY
    }
    name = type === T_IDENTIFIER || type === T_CLASS || type === T_KEYWORD ? index : -1
  }
  return tokens
}
