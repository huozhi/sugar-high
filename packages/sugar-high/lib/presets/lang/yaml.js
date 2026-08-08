// @ts-check
import { onCommentEnd, onCommentStart } from './hash-comment-base.js'

export const keywords = new Set([
  'false', 'False', 'FALSE', 'no', 'No', 'NO', 'null', 'Null', 'NULL',
  'off', 'Off', 'OFF', 'on', 'On', 'ON', 'true', 'True', 'TRUE', 'yes', 'Yes', 'YES',
])

export const quotedKeys = true
export { onCommentEnd, onCommentStart }
