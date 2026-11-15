// @ts-check
import { doubleQuoted, strings, tripleQuoted } from '../presets/strings.js'
import { onCommentEnd, onCommentStart } from '../presets/hash-comment-base.js'
export const keywords = new Set(['false','true'])
export const keys = '='
export { onCommentEnd, onCommentStart }

// Literal strings in `'` and `'''` have no escapes.
export const string = strings(/'''[\s\S]*?(?:'''|$)/, tripleQuoted, doubleQuoted, /'[^'\n]*'?/)
