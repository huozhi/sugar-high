import type { HighlightOptions, LanguageName } from './index.js'

export type Language = Readonly<{
  id: LanguageName
  /** Preferred file extension without a leading dot. */
  extension: string
  aliases: readonly string[]
  config?: HighlightOptions
}>

export const languages: readonly Language[]
export function normalizeLanguageName(value: string): string
export function getCanonicalLanguage(name: string): Language | undefined
export function getLanguage(name: string): Language | undefined
export function resolveLanguage(name: string): string | undefined
