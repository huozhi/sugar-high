// @ts-check
import { onCommentEnd, onCommentStart } from './plain-base.js'

export const keywords = new Set([])

export const annotateLine = (line) => {
  let annotation = ''
  if (/^#{1,6}\s/.test(line.value)) annotation = 'markdown-heading'
  else if (/^\s*>/.test(line.value)) annotation = 'markdown-quote'
  else if (/^\s*(?:[-*+] |\d+[.)] )/.test(line.value)) annotation = 'markdown-list'
  else if (/^\s*```/.test(line.value)) annotation = 'markdown-fence'
  if (annotation) line.annotations.push(annotation)
}

export { onCommentEnd, onCommentStart }
