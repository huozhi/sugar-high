import type { ParseOptions } from './core.js'
import type { Language } from './lang.js'

export type RegisteredLanguage = Language & Readonly<{
  config: ParseOptions
}>

export type Registry = readonly RegisteredLanguage[]

export const registry: Registry
