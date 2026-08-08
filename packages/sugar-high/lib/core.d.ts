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

export type ParsedToken = {
  type: TokenType
  value: string
}

export type MarkToken = ParsedToken & {
  className: string
  style: Record<string, string | number>
  properties: Record<string, string | number | boolean>
}

export type ParsedLine = {
  index: number
  value: string
  tokens: ParsedToken[]
  className: string
  style: Record<string, string | number>
  properties: Record<string, string | number | boolean>
}

export type MarkLine = ParsedLine

export type ParsedCode = {
  value: string
  lines: ParsedLine[]
}

export type DisplayOptions = {
  cx?: Partial<Record<TokenType, string>>
  mark?: (token: MarkToken) => void
  markLine?: (line: MarkLine) => void
}

export type ParseOptions = {
  keywords?: Set<string>
  typeKeywords?: Set<string>
  onCommentStart?: (curr: string, next: string, index: number, code: string) => number | boolean
  onCommentEnd?: (prev: string, curr: string, index: number, code: string) => number | boolean
  onQuote?: (curr: string, index: number, code: string) => number | null | undefined
  quotedKeys?: boolean
  jsx?: boolean
  regex?: boolean
  templateStrings?: boolean
  caseInsensitive?: boolean
  typescript?: boolean
  tokenize?: (code: string, options: ParseOptions) => Array<[number, string]>
  /** Apply syntax-specific line metadata while parsing. */
  markLine?: (line: MarkLine) => void
}

export function parse(code: string, options?: ParseOptions): ParsedCode
export function render(parsed: ParsedCode, options?: DisplayOptions): string

/** Low-level token API used by language presets and integrations. */
export function tokenize(code: string, options?: ParseOptions): Array<[number, string]>
/** Build renderable nodes from parsed code. */
export function generate(parsed: ParsedCode, options?: DisplayOptions): Array<any>

export const SugarHigh: {
  TokenTypes: { [key: number]: string }
  TokenMap: Map<string, number>
}
