// @ts-check
import { onCommentStart, onCommentEnd } from './clike-base.js'

export const typeKeywords = new Set([
  'void', 'char', 'short', 'int', 'long', 'float', 'double', 'signed', 'unsigned',
  '_Bool', '_Complex', '_Imaginary',
])

export const keywords = new Set([
  'auto', 'break', 'case', 'const', 'continue', 'default', 'do', 'else', 'enum',
  'extern', 'for', 'goto', 'if', 'inline', 'register', 'restrict', 'return',
  'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'volatile', 'while',
  '_Alignas', '_Alignof', '_Atomic', '_Generic', '_Noreturn', '_Static_assert',
  '_Thread_local',
])

export { onCommentStart, onCommentEnd }
