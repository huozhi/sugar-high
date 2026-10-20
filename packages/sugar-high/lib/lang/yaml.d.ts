export const keywords: Set<string>;
export const quotedKeys: true;
/**
 * @param {string} curr `code[i]` (apostrophe)
 * @param {number} i
 * @param {string} code
 * @returns {number} code units to consume from `i`, 0 when a quoted scalar starts
 */
export function onQuote(curr: string, i: number, code: string): number;
import { onCommentEnd } from '../presets/hash-comment-base.js';
import { onCommentStart } from '../presets/hash-comment-base.js';
export { onCommentEnd, onCommentStart };
