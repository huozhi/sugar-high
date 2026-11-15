// @ts-check
import { doubleQuoted, strings, tripleQuoted } from '../presets/strings.js'
import { onCommentEnd, onCommentStart } from '../presets/clike-base.js'
export const keywords = new Set(['as','associatedtype','break','case','catch','class','continue','convenience','default','defer','deinit','didSet','do','dynamic','else','enum','extension','fallthrough','false','fileprivate','final','for','func','get','guard','if','import','in','indirect','infix','init','inout','internal','is','lazy','let','mutating','nil','nonmutating','open','operator','override','precedencegroup','private','protocol','public','repeat','required','rethrows','return','self','set','some','static','struct','subscript','super','switch','throw','throws','true','try','typealias','unowned','var','weak','where','while','willSet'])
export const typeKeywords = new Set(['Any','Bool','Character','Double','Float','Int','Never','String','UInt','Void'])
export { onCommentEnd, onCommentStart }

// Extended delimiters `#"..."#` close at a matching run of `#`; the bound keeps runs of `#` linear.
export const string = strings(/(#{1,8})("""|")[\s\S]*?(?:\2\1|$)/, tripleQuoted, doubleQuoted)
