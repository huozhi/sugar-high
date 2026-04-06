type HighlightOptions = {
  keywords?: Set<string>
  /**
   * Highlighted as the `class` token type (e.g. built-in types). Checked before `keywords`.
   */
  typeKeywords?: Set<string>
  onCommentStart?: (curr: string, next: string) => number | boolean
  onCommentEnd?: (curr: string, prev: string) => number | boolean
  /**
   * At `code[i] === "'"`: return how many code units to consume from `i` as one token,
   * or null/undefined or a number below 1 for default JS single-quoted string rules.
   */
  onQuote?: (curr: string, i: number, code: string) => number | null | undefined
}

export function highlight(code: string, options?: HighlightOptions): string
export function tokenize(code: string, options?: HighlightOptions): Array<[number, string]>
export function generate(tokens: Array<[number, string]>): Array<any>
export const SugarHigh: {
  TokenTypes: {
    [key: number]: string
  }
  TokenMap: Map<string, number>
}
