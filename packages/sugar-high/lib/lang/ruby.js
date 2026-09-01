// @ts-check

export const keywords = new Set([
  'BEGIN', 'END', '__ENCODING__', '__FILE__', '__LINE__', 'alias', 'and', 'begin', 'break',
  'case', 'class', 'def', 'defined', 'do', 'else', 'elsif', 'end', 'ensure', 'false', 'for', 'if',
  'in', 'module', 'next', 'nil', 'not', 'or', 'redo', 'rescue', 'retry', 'return', 'self', 'super',
  'then', 'true', 'undef', 'unless', 'until', 'when', 'while', 'yield',
])

/** @param {number} index @param {string} code */
function isBlockCommentStart(index, code) {
  if (index > 0 && code[index - 1] !== '\n') return false
  return /^=begin(?:\s|$)/.test(code.slice(index))
}

/**
 * @param {string} curr
 * @param {string} _next
 * @param {number} index
 * @param {string} code
 */
export function onCommentStart(curr, _next, index, code) {
  if (curr === '#') return 1
  if (curr === '=' && isBlockCommentStart(index, code)) return 2
  return 0
}

/**
 * @param {string} _prev
 * @param {string} curr
 * @param {number} index
 * @param {string} code
 */
export function onCommentEnd(_prev, curr, index, code) {
  if (curr !== '\n') return 0

  const lineStart = code.lastIndexOf('\n', index - 1) + 1
  const line = code.slice(lineStart, index)
  if (/^=end(?:\s|$)/.test(line)) return 2
  return 1
}
