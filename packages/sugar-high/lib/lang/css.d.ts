export const keywords: Set<string>;
export function onCommentStart(currentChar: any, nextChar: any): 1 | 0;
export function onCommentEnd(prevChar: any, currChar: any): 1 | 0;
export function onLiteral(curr: any, index: any, code: any): any;
export function tokenize(code: string, options: import("../core.js").ParseOptions): [number, string][];
