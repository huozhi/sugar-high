import type {
  DisplayOptions,
  MarkLine,
  MarkToken,
  TokenType,
} from './core.js'

export type { DisplayOptions, MarkLine, MarkToken, TokenType }

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
