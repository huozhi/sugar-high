// @ts-check
export const caseInsensitive = true
export const keywords = new Set(['begin','break','catch','class','continue','data','define','do','dynamicparam','else','elseif','end','enum','exit','filter','finally','for','foreach','from','function','if','in','param','process','return','switch','throw','trap','try','until','using','while'])
export const onCommentStart = (curr, next) => curr === '#' ? 1 : curr + next === '<#' ? 2 : 0
export const onCommentEnd = (prev, curr) => curr === '\n' ? 1 : prev + curr === '#>' ? 2 : 0
