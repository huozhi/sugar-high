// @ts-check

/**
 * Highlight the `<header>` of an `#include <header>` directive as a string.
 * @param {string} curr
 * @param {number} index
 * @param {string} code
 * @returns {number} code units of the header, 0 when `<` is not an include header
 */
export function onLiteral(curr, index, code) {
  if (curr !== '<' || !/^[ \t]*#[ \t]*include[ \t]*$/.test(
    code.slice(code.lastIndexOf('\n', index - 1) + 1, index)
  )) return 0

  return code.slice(index).match(/^<[^>\r\n]*>/)?.[0].length || 0
}
