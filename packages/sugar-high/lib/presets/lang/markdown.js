// @ts-check
import { onCommentEnd, onCommentStart } from './plain-base.js'

export const keywords = new Set([])

export const lineClassName = (line) => {
  if (/^#{1,6}\s/.test(line)) return 'sh__line--heading'
  if (/^\s*>/.test(line)) return 'sh__line--quote'
  if (/^\s*(?:[-*+] |\d+[.)] )/.test(line)) return 'sh__line--list'
  if (/^\s*```/.test(line)) return 'sh__line--fence'
  return undefined
}

export { onCommentEnd, onCommentStart }
