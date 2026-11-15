// @ts-check
import { doubleQuoted, strings, tripleQuoted } from '../presets/strings.js'
import { onCommentEnd, onCommentStart } from '../presets/hash-comment-base.js'
export const keywords = new Set(['directive','enum','extend','fragment','implements','input','interface','mutation','on','query','repeatable','scalar','schema','subscription','type','union'])
export const typeKeywords = new Set(['Boolean','Float','ID','Int','String'])
export { onCommentEnd, onCommentStart }

export const string = strings(tripleQuoted, doubleQuoted)
