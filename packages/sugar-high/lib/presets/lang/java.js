// @ts-check
import { onCommentStart, onCommentEnd } from './clike-base.js'

export const typeKeywords = new Set([
  'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'void',
])

export const keywords = new Set([
  'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'for', 'goto',
  'if', 'implements', 'import', 'instanceof', 'interface', 'native', 'new',
  'package', 'private', 'protected', 'public', 'return', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
  'try', 'volatile', 'while',
])

export { onCommentStart, onCommentEnd }
