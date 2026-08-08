// @ts-check
import { onCommentEnd, onCommentStart } from './plain-base.js'

export const keywords = new Set([])

export const annotateLine = (line) => {
  let className = ''
  if (/^#{1,6}\s/.test(line.value)) className = 'sh__line--heading'
  else if (/^\s*>/.test(line.value)) className = 'sh__line--quote'
  else if (/^\s*(?:[-*+] |\d+[.)] )/.test(line.value)) className = 'sh__line--list'
  else if (/^\s*```/.test(line.value)) className = 'sh__line--fence'
  if (className) line.className += ` ${className}`
}

export { onCommentEnd, onCommentStart }
