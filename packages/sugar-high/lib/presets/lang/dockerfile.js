// @ts-check
import { onCommentEnd, onCommentStart } from './hash-comment-base.js'
export const caseInsensitive = true
export const keywords = new Set(['add','arg','cmd','copy','entrypoint','env','expose','from','healthcheck','label','maintainer','onbuild','run','shell','stopsignal','user','volume','workdir'])
export { onCommentEnd, onCommentStart }
