export const keywords: Set<string>;
export const typeKeywords: Set<string>;
export const caseInsensitive: true;
export function onCommentStart(currentChar: any, nextChar: any): 1 | 0 | 2;
export function onCommentEnd(prevChar: any, currChar: any): 1 | 0 | 2;
