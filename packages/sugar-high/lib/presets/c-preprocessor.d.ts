/**
 * Highlight the `<header>` of an `#include <header>` directive as a string.
 * @param {string} curr
 * @param {number} index
 * @param {string} code
 * @returns {number} code units of the header, 0 when `<` is not an include header
 */
export function onLiteral(curr: string, index: number, code: string): number;
