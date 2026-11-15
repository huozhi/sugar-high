export const keywords: Set<string>;
export const word: RegExp;
export function onCommentStart(currentChar: any, nextChar: any): 1 | 0;
export function onCommentEnd(prevChar: any, currChar: any): 1 | 0;
export function tokenize(code: string, options: import("../core.js").ParseOptions): [number, string][];
export const string: RegExp;
