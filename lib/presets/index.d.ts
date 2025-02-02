type LanguageConfig = {
  keywords: Set<string>
  onCommentStart(curr: string, next: string): 0 | 1 | 2
  onCommentEnd(prev: string, curr: string): 0 | 1 | 2
}

export const css: LanguageConfig
export const rust: LanguageConfig
export const python: LanguageConfig
