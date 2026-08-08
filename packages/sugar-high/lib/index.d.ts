export type HighlightOptions = {
  /** Canonical language name. Fence and extension aliases must be normalized first. */
  lang?: LanguageName
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
  lineClassName?: (line: string, index: number) => string | null | undefined
}

export type LanguageName =
  | 'javascript'
  | 'typescript'
  | 'css'
  | 'python'
  | 'c'
  | 'go'
  | 'java'
  | 'rust'
  | 'json'
  | 'diff'
  | 'shell'
  | 'cpp'
  | 'csharp'
  | 'sql'
  | 'html'
  | 'yaml'
  | 'markdown'
  | 'kotlin'
  | 'swift'
  | 'php'
  | 'toml'
  | 'powershell'
  | 'dockerfile'
  | 'graphql'
  | 'hcl'

export function highlight(code: string, options?: HighlightOptions): string
export function tokenize(code: string, options?: HighlightOptions): Array<[number, string]>
export function generate(tokens: Array<[number, string]>, options?: Pick<HighlightOptions, 'lineClassName'>): Array<any>
export const SugarHigh: {
  TokenTypes: {
    [key: number]: string
  }
  TokenMap: Map<string, number>
}
