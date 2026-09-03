// @ts-check

export const keywords = new Set([
  'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'goto', 'if', 'in',
  'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while',
])

/**
 * @param {string} curr
 * @param {string} next
 * @param {number} index
 * @param {string} code
 */
export function onCommentStart(curr, next, index, code) {
  if (curr === '#' && index === 0 && next === '!') return 1
  if (curr + next !== '--') return 0
  return /^--\[=*\[/.test(code.slice(index)) ? 2 : 1
}

/**
 * @param {string} _prev
 * @param {string} curr
 * @param {number} index
 * @param {string} code
 * @param {number} start
 */
export function onCommentEnd(_prev, curr, index, code, start) {
  if (curr === '\n') return 1
  if (curr !== ']') return 0
  const opener = code.slice(start).match(/^--\[(=*)\[/)
  if (!opener) return 0
  const closing = `]${opener[1]}]`
  if (code.slice(index - closing.length + 1, index + 1) === closing) return 2
  return 0
}

/** @param {string} curr @param {number} index @param {string} code */
export function onLiteral(curr, index, code) {
  if (curr !== '[') return 0
  const opener = code.slice(index).match(/^\[(=*)\[/)
  if (!opener) return 0
  const closing = `]${opener[1]}]`
  const end = code.indexOf(closing, index + opener[0].length)
  return end === -1 ? code.length - index : end + closing.length - index
}
