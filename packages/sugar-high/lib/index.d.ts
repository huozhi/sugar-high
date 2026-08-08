import type {
  DisplayOptions,
  MarkLine,
  MarkToken,
  ParsedCode,
  ParsedLine,
  TokenType,
} from './core.js'

export type { DisplayOptions, MarkLine, MarkToken, ParsedCode, ParsedLine, TokenType }

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

export type HighlightOptions = DisplayOptions & {
  /** Canonical language name. Fence and extension aliases must be normalized first. */
  lang?: LanguageName
}

export function highlight(code: string, options?: HighlightOptions): string

/** Structured parsing for integrations. Most users only need highlight(). */
export function parse(code: string, options?: { lang?: LanguageName }): ParsedCode
export { generate, render } from './core.js'

/** Low-level compatibility export. */
export function tokenize(code: string, options?: { lang?: LanguageName }): Array<[number, string]>

export const SugarHigh: {
  TokenTypes: { [key: number]: string }
  TokenMap: Map<string, number>
}
