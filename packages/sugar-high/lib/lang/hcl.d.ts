export const keywords: Set<string>;
export function onCommentStart(curr: any, next: any): 1 | 0 | 2;
export function onCommentEnd(prev: any, curr: any): 1 | 0 | 2;
/**
 * Highlight attribute names before `=` as properties, leaving `==` and `=>` alone.
 * @param {string} code
 * @param {import('../core.js').ParseOptions} options
 * @returns {Array<[number, string]>}
 */
export function tokenize(code: string, options: import("../core.js").ParseOptions): Array<[number, string]>;
