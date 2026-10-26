export const keywords: Set<string>;
export const typeKeywords: Set<string>;
import { onCommentEnd } from '../presets/clike-base.js';
import { onCommentStart } from '../presets/clike-base.js';
import { onLiteral } from '../presets/c-preprocessor.js';
export { onCommentEnd, onCommentStart, onLiteral };
