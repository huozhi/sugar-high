// @ts-check
import { onCommentEnd, onCommentStart } from './clike-base.js'
export const keywords = new Set(['as','break','by','catch','class','companion','const','constructor','continue','data','do','else','enum','false','finally','for','fun','get','if','import','in','infix','init','interface','internal','is','lateinit','noinline','null','object','open','operator','out','override','package','private','protected','public','reified','return','sealed','set','suspend','tailrec','this','throw','true','try','typealias','val','var','vararg','when','where','while'])
export const typeKeywords = new Set(['Any','Boolean','Byte','Char','Double','Float','Int','Long','Nothing','Short','String','Unit'])
export { onCommentEnd, onCommentStart }
