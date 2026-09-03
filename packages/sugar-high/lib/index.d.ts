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
  | 'plaintext'
  | 'ruby'
  | 'kotlin'
  | 'swift'
  | 'php'
  | 'toml'
  | 'powershell'
  | 'dockerfile'
  | 'graphql'
  | 'hcl'
  | 'zig'
  | 'lua'

export type HighlightOptions = DisplayOptions & {
  /** Canonical language name. Fence and extension aliases must be normalized first. */
  lang?: LanguageName
}

export function highlight(code: string, options?: HighlightOptions): string
