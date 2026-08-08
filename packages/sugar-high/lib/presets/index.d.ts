type LanguageConfig = {
  keywords: Set<string>
  typeKeywords?: Set<string>
  onCommentStart?(curr: string, next: string, index: number, code: string): number | boolean
  onCommentEnd?(prev: string, curr: string, index: number, code: string): number | boolean
  onQuote?(curr: string, i: number, code: string): number | null | undefined
  quotedKeys?: boolean
  jsx?: boolean
  regex?: boolean
  templateStrings?: boolean
  caseInsensitive?: boolean
  tokenize?(code: string, options: LanguageConfig): Array<[number, string]>
  markLine?(line: import('../core.js').MarkLine): void
}

export const css: LanguageConfig
export const rust: LanguageConfig
export const python: LanguageConfig
export const c: LanguageConfig
export const go: LanguageConfig
export const java: LanguageConfig
export const diff: LanguageConfig
export const json: LanguageConfig
export const shell: LanguageConfig
export const cpp: LanguageConfig
export const csharp: LanguageConfig
export const sql: LanguageConfig
export const html: LanguageConfig
export const yaml: LanguageConfig
export const markdown: LanguageConfig
export const kotlin: LanguageConfig
export const swift: LanguageConfig
export const php: LanguageConfig
export const toml: LanguageConfig
export const powershell: LanguageConfig
export const dockerfile: LanguageConfig
export const graphql: LanguageConfig
export const hcl: LanguageConfig
export const javascript: LanguageConfig
export const typescript: LanguageConfig
