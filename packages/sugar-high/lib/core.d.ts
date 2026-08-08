export type TokenType =
  | 'identifier'
  | 'keyword'
  | 'string'
  | 'class'
  | 'property'
  | 'entity'
  | 'jsxliterals'
  | 'sign'
  | 'comment'
  | 'break'
  | 'space'

export type MarkToken = {
  type: TokenType
  value: string
  className: string
  style: Record<string, string | number>
  properties: Record<string, string | number | boolean>
}

export type HighlightOptions = {
  keywords?: Set<string>
  /**
   * Highlighted as the `class` token type (e.g. built-in types). Checked before `keywords`.
   */
  typeKeywords?: Set<string>
  onCommentStart?: (curr: string, next: string, index: number, code: string) => number | boolean
  onCommentEnd?: (prev: string, curr: string, index: number, code: string) => number | boolean
  /**
   * At `code[i] === "'"`: return how many code units to consume from `i` as one token,
   * or null/undefined or a number below 1 for default JS single-quoted string rules.
   */
  onQuote?: (curr: string, i: number, code: string) => number | null | undefined
  /** Highlight quoted object keys followed by `:` as `property` tokens. */
  quotedKeys?: boolean
  /** Enable JavaScript-style JSX tag parsing. */
  jsx?: boolean
  /** Enable JavaScript-style regular expression literals. */
  regex?: boolean
  /** Enable JavaScript template strings. */
  templateStrings?: boolean
  /** Match keywords and type keywords without regard to case. */
  caseInsensitive?: boolean
  /** Override heuristic TypeScript detection. */
  typescript?: boolean
  /** Replace the general lexer for a complex language family. */
  tokenize?: (code: string, options: HighlightOptions) => Array<[number, string]>
  lineClassName?: (line: string, index: number) => string | null | undefined
  /** Additional classes keyed by token type. */
  cx?: Partial<Record<TokenType, string>>
  /** Mutate a token before it is rendered. */
  mark?: (token: MarkToken) => void
}

export function highlight(code: string, options?: HighlightOptions): string
export function tokenize(code: string, options?: HighlightOptions): Array<[number, string]>
export function generate(tokens: Array<[number, string]>, options?: Pick<HighlightOptions, 'lineClassName' | 'cx' | 'mark'>): Array<any>
export const SugarHigh: {
  TokenTypes: {
    [key: number]: string
  }
  TokenMap: Map<string, number>
}
