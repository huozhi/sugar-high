// @ts-check
import { onCommentEnd, onCommentStart } from './clike-base.js'
export const keywords = new Set(['as','associatedtype','break','case','catch','class','continue','convenience','default','defer','deinit','didSet','do','dynamic','else','enum','extension','fallthrough','false','fileprivate','final','for','func','get','guard','if','import','in','indirect','infix','init','inout','internal','is','lazy','let','mutating','nil','nonmutating','open','operator','override','precedencegroup','private','protocol','public','repeat','required','rethrows','return','self','set','some','static','struct','subscript','super','switch','throw','throws','true','try','typealias','unowned','var','weak','where','while','willSet'])
export const typeKeywords = new Set(['Any','Bool','Character','Double','Float','Int','Never','String','UInt','Void'])
export { onCommentEnd, onCommentStart }
