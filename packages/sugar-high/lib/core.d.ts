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

export type MarkToken = {
  type: TokenType
  value: string
  className: string
  style: Record<string, string | number>
  properties: Record<string, string | number | boolean>
}

export type ParsedLine = {
  readonly index: number
  readonly value: string
  readonly tokens: readonly ParsedToken[]
  readonly annotations: readonly string[]
}

export type AnnotateLine = {
  readonly index: number
  readonly value: string
  readonly tokens: readonly ParsedToken[]
  annotations: string[]
}

export type MarkLine = {
  readonly index: number
  readonly value: string
  readonly tokens: readonly ParsedToken[]
  readonly annotations: readonly string[]
  className: string
  style: Record<string, string | number>
  properties: Record<string, string | number | boolean>
}

export type ParsedCode = {
  readonly value: string
  readonly lines: readonly ParsedLine[]
}

export type GeneratedProperties = {
  className: string
  style: Record<string, string | number>
  [name: string]: unknown
}

export type GeneratedText = {
  type: 'text'
  value: string
}

export type GeneratedToken = {
  type: 'element'
  tokenType: TokenType
  tagName: 'span'
  children: GeneratedText[]
  properties: GeneratedProperties
}

export type GeneratedLine = {
  type: 'element'
  tagName: 'span'
  children: GeneratedToken[]
  properties: GeneratedProperties
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
  onLiteral?: (curr: string, index: number, code: string) => number | null | undefined
  onQuote?: (curr: string, index: number, code: string) => number | null | undefined
  quotedKeys?: boolean
  jsx?: boolean
  regex?: boolean
  templateStrings?: boolean
  caseInsensitive?: boolean
  typescript?: boolean
  tokenize?: (code: string, options: ParseOptions) => Array<[number, string]>
  /** Apply syntax-specific semantic annotations while parsing. */
  annotateLine?: (line: AnnotateLine) => void
}

export function parse(code: string, options?: ParseOptions): ParsedCode
export function render(parsed: ParsedCode, options?: DisplayOptions): string

/** Low-level token API used by language presets and integrations. */
export function tokenize(code: string, options?: ParseOptions): Array<[number, string]>
/** Build renderable line nodes for HTML, React, and syntax-tree integrations. */
export function generate(parsed: ParsedCode, options?: DisplayOptions): GeneratedLine[]

export const SugarHigh: {
  TokenTypes: { [key: number]: string }
  TokenMap: Map<string, number>
}
