export type HighlightOptions = {
    keywords?: Set<string> | undefined;
    typeKeywords?: Set<string> | undefined;
    onCommentStart?: ((curr: string, next: string, index: number, code: string) => number | boolean) | undefined;
    onCommentEnd?: ((prev: string, curr: string, index: number, code: string) => number | boolean) | undefined;
    onQuote?: ((curr: string, i: number, code: string) => number | null | undefined) | undefined;
    quotedKeys?: boolean | undefined;
    /**
     * Whether JSX tag parsing is enabled.
     */
    jsx?: boolean | undefined;
    /**
     * Whether JavaScript-style regular expressions are enabled.
     */
    regex?: boolean | undefined;
    /**
     * Whether JavaScript template strings are enabled.
     */
    templateStrings?: boolean | undefined;
    /**
     * Whether keyword matching ignores case.
     */
    caseInsensitive?: boolean | undefined;
    /**
     * Override heuristic TypeScript detection.
     */
    typescript?: boolean | undefined;
    annotateLine?: ((line: import("../core.js").AnnotateLine) => void) | undefined;
};
/**
 * @param {string} code
 * @param {HighlightOptions | undefined} options
 * Optional `onQuote(curr, i, code)` at `code[i] === "'"`: return length to consume from `i` (>= 1),
 * or null/undefined/below 1 for default JS single-quoted strings. No substring allocation.
 * @return {Array<[number, string]>}
 */
export function tokenize(code: string, options: HighlightOptions | undefined): Array<[number, string]>;
