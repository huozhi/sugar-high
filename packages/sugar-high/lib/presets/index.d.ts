type LanguageConfig = {
  keywords: Set<string>
  typeKeywords?: Set<string>
  onCommentStart?(curr: string, next: string): 0 | 1 | 2
  onCommentEnd?(prev: string, curr: string): 0 | 1 | 2
  onQuote?(curr: string, i: number, code: string): number | null | undefined
  quotedKeys?: boolean
  jsx?: boolean
  regex?: boolean
  templateStrings?: boolean
  caseInsensitive?: boolean
  lineClassName?(line: string, index: number): string | null | undefined
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
