import { fileExtensionForHighlight } from './github-source'

/**
 * Extensions Codice maps to sugar-high presets (`getPresetByExt` in codice).
 * Other extensions (e.g. `tsx`, `ts`) use default JS/TS tokenizing.
 */
export const SYNTAX_PRESET_CODICE_EXTENSIONS = new Set([
  'py',
  'rs',
  'css',
  'scss',
  'sass',
  'less',
])

/** Select `value` for default JSX/TSX (Codice: no preset). */
const SYNTAX_SELECT_JSX = 'js'

export const SYNTAX_PRESET_SELECT_OPTIONS: readonly {
  value: string
  label: string
}[] = [
  { value: SYNTAX_SELECT_JSX, label: 'jsx/tsx' },
  { value: 'css', label: 'css' },
  { value: 'py', label: 'python' },
  { value: 'rs', label: 'rust' },
]

/** Map loaded repo path → Codice `extension` when a preset exists; else `undefined`. */
export function presetHighlightExtensionFromPath(
  repoRelativePath: string
): string | undefined {
  const ext = fileExtensionForHighlight(repoRelativePath)
  if (!ext || !SYNTAX_PRESET_CODICE_EXTENSIONS.has(ext)) return undefined
  return ext
}

/** Current `fileExtension` state → `<select>` value (one of four options). */
export function syntaxPresetSelectValue(
  extension: string | undefined
): string {
  if (extension === 'py') return 'py'
  if (extension === 'rs') return 'rs'
  if (
    extension &&
    (extension === 'css' ||
      extension === 'scss' ||
      extension === 'sass' ||
      extension === 'less')
  ) {
    return 'css'
  }
  return SYNTAX_SELECT_JSX
}

/** `<select>` value → `fileExtension` for Codice `Editor`. */
export function fileExtensionFromSyntaxSelect(
  selectValue: string
): string | undefined {
  switch (selectValue) {
    case 'py':
      return 'py'
    case 'rs':
      return 'rs'
    case 'css':
      return 'css'
    default:
      return undefined
  }
}
