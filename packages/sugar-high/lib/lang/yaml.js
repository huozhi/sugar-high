// @ts-check
import { onCommentEnd, onCommentStart } from '../presets/hash-comment-base.js'

export const keywords = new Set([
  'false', 'False', 'FALSE', 'no', 'No', 'NO', 'null', 'Null', 'NULL',
  'off', 'Off', 'OFF', 'on', 'On', 'ON', 'true', 'True', 'TRUE', 'yes', 'Yes', 'YES',
])

export const keys = ':'

// Plain scalars keep apostrophes inside the word, such as `don't` or `users'`.
export const word = /[\p{L}\p{N}_$]+(?:'[\p{L}\p{N}_$]*)*/uy

export { onCommentEnd, onCommentStart }
