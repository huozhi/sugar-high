// @ts-check
const isBlank = (char) => char === ' ' || char === '\t'

/**
 * Highlight the `<header>` of an `#include <header>` directive as a string.
 * @param {string} curr
 * @param {number} index
 * @param {string} code
 * @returns {number} code units of the header, 0 when `<` is not an include header
 */
export function onLiteral(curr, index, code) {
  if (curr !== '<') return 0
  let i = index - 1
  while (i >= 0 && isBlank(code[i])) i--
  if (code.slice(i - 6, i + 1) !== 'include') return 0
  i -= 7
  while (i >= 0 && isBlank(code[i])) i--
  if (code[i] !== '#') return 0
  i--
  while (i >= 0 && isBlank(code[i])) i--
  if (i >= 0 && code[i] !== '\n') return 0
  const end = code.indexOf('>', index + 1)
  const lineEnd = code.indexOf('\n', index + 1)
  return end < 0 || (lineEnd >= 0 && lineEnd < end) ? 0 : end - index + 1
}
