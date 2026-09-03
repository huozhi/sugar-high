export const keywords: Set<string>;
export const typeKeywords: Set<string>;
export function onCommentStart(curr: string, next: string): number;
export function onCommentEnd(prev: string, curr: string): number;
export function onLiteral(curr: string, index: number, code: string): number;
