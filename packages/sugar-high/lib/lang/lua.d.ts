export const keywords: Set<string>;
export function onCommentStart(curr: string, next: string, index: number, code: string): number;
export function onCommentEnd(
  prev: string,
  curr: string,
  index: number,
  code: string,
  start: number,
): number;
export function onLiteral(curr: string, index: number, code: string): number;
