// @ts-check
import { onCommentEnd, onCommentStart } from './hash-comment-base.js'

export const keywords = new Set([
  'case', 'coproc', 'do', 'done', 'elif', 'else', 'esac', 'export', 'fi', 'for',
  'function', 'if', 'in', 'local', 'readonly', 'return', 'select', 'then', 'time',
  'until', 'while',
])

export { onCommentEnd, onCommentStart }
