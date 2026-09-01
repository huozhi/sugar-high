export const keywords: Set<string>;
export function onCommentStart(
  curr: string,
  next: string,
  index: number,
  code: string,
): 0 | 1 | 2;
export function onCommentEnd(
  prev: string,
  curr: string,
  index: number,
  code: string,
): 0 | 1 | 2;
