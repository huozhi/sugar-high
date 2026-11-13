export type HighlightOptions = {
    keywords?: Set<string> | undefined;
    typeKeywords?: Set<string> | undefined;
    onCommentStart?: ((curr: string, next: string, index: number, code: string) => number | boolean) | undefined;
    onCommentEnd?: ((prev: string, curr: string, index: number, code: string) => number | boolean) | undefined;
    /**
     * Separator after a quoted key.
     */
    keys?: ":" | "=" | undefined;
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
 * @return {Array<[number, string]>}
 */
export function tokenize(code: string, options: HighlightOptions | undefined): Array<[number, string]>;
