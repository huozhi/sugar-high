export const typeKeywords: Set<string>;
export const keywords: Set<string>;
import { onCommentStart } from '../presets/clike-base.js';
import { onCommentEnd } from '../presets/clike-base.js';
import { onLiteral } from '../presets/c-preprocessor.js';
export { onCommentStart, onCommentEnd, onLiteral };
