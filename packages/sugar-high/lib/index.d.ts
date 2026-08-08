import type { HighlightOptions as CoreHighlightOptions } from './core.js'

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

export type HighlightOptions = CoreHighlightOptions & {
  /** Canonical language name. Fence and extension aliases must be normalized first. */
  lang?: LanguageName
}

export function highlight(code: string, options?: HighlightOptions): string
export function tokenize(code: string, options?: HighlightOptions): Array<[number, string]>
export function generate(tokens: Array<[number, string]>, options?: HighlightOptions): Array<any>
export const SugarHigh: {
  TokenTypes: { [key: number]: string }
  TokenMap: Map<string, number>
}
