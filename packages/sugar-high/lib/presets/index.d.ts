type LanguageConfig = {
  keywords: Set<string>
  onCommentStart?(curr: string, next: string): 0 | 1 | 2
  onCommentEnd?(prev: string, curr: string): 0 | 1 | 2
  onQuote?(curr: string, i: number, code: string): number | null | undefined
}

export const css: LanguageConfig
export const rust: LanguageConfig
export const python: LanguageConfig
export const c: LanguageConfig
export const go: LanguageConfig
export const java: LanguageConfig
export function resolvePresetLanguage(language?: string): string
