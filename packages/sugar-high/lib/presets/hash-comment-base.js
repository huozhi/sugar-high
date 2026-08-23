// @ts-check

/** @param {string} currentChar */
export const onCommentStart = (currentChar) => currentChar === '#' ? 1 : 0

/** @param {string} _prevChar @param {string} currChar */
export const onCommentEnd = (_prevChar, currChar) => currChar === '\n' ? 1 : 0
