import { lang, languages } from 'sugar-high/lang'
import { fileExtensionForHighlight } from './github-source'

/**
 * Extensions Codice maps to sugar-high presets (`getPresetByExt` in codice).
 * Other extensions (e.g. `tsx`, `ts`) use default JS/TS tokenizing.
 */
export const SYNTAX_PRESET_CODICE_EXTENSIONS = new Set([
  'py',
  'rs',
  'c',
  'go',
  'java',
  'json',
  'css',
  'scss',
  'sass',
  'less',
])

export const SYNTAX_PRESET_SELECT_OPTIONS: readonly {
  value: string
  label: string
}[] = languages.map(({ id, extension }) => ({
  value: extension,
  label: id,
}))

/** Map loaded repo path → Codice `extension` when a preset exists; else `undefined`. */
export function presetHighlightExtensionFromPath(
  repoRelativePath: string
): string | undefined {
  const ext = fileExtensionForHighlight(repoRelativePath)
  if (!ext || !SYNTAX_PRESET_CODICE_EXTENSIONS.has(ext)) return undefined
  return ext
}

/** Current `fileExtension` state → the preferred extension used by `<select>`. */
export function syntaxPresetSelectValue(
  extension: string | undefined
): string {
  const language = languages.find(({ id }) => id === lang(extension || ''))
  return language?.extension || 'js'
}

/** `<select>` value → `fileExtension` for Codice `Editor`. */
export function fileExtensionFromSyntaxSelect(
  selectValue: string
): string | undefined {
  return lang(selectValue) === 'javascript' ? undefined : selectValue
}
