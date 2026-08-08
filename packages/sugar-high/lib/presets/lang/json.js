// @ts-check

import { onCommentEnd, onCommentStart } from './clike-base.js'

export const keywords = new Set(['true', 'false', 'null'])
export const quotedKeys = true
// JSONC is treated as the comment-tolerant JSON dialect rather than a separate language.
export { onCommentEnd, onCommentStart }
