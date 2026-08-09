import type { LanguageName } from './index.js'
export type Language = Readonly<{
  id: LanguageName
  /** Preferred file extension without a leading dot. */
  extension: string
  aliases: readonly string[]
}>

export const languages: readonly Language[]
/** Normalize a language name, fence alias, or extension to its canonical name. */
export function lang(name: string): LanguageName | undefined
