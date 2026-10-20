// @ts-check
import { onCommentEnd, onCommentStart } from '../presets/hash-comment-base.js'

export const keywords = new Set([
  'false', 'False', 'FALSE', 'no', 'No', 'NO', 'null', 'Null', 'NULL',
  'off', 'Off', 'OFF', 'on', 'On', 'ON', 'true', 'True', 'TRUE', 'yes', 'Yes', 'YES',
])

export const quotedKeys = true

/**
 * @param {string} curr `code[i]` (apostrophe)
 * @param {number} i
 * @param {string} code
 * @returns {number} code units to consume from `i`, 0 when a quoted scalar starts
 */
export function onQuote(curr, i, code) {
  return /[\p{L}\p{N}]/u.test(code[i - 1] || '') ? 1 : 0
}

export { onCommentEnd, onCommentStart }
