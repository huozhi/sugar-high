/**
 * First docs palette (Stylish) — mirrors apps/docs live-editor-presets light/dark.
 */
export type ColorPlate = {
  class: string
  identifier: string
  sign: string
  entity: string
  property: string
  jsxliterals: string
  string: string
  keyword: string
  comment: string
  /** Newline / whitespace tokens — match panel so rows don’t flash wrong. */
  break: string
  space: string
}

export const STYLISH_LIGHT: ColorPlate = {
  class: '#8d85ff',
  identifier: '#354150',
  sign: '#8996a3',
  entity: '#6eafad',
  property: '#4e8fdf',
  jsxliterals: '#bf7db6',
  string: '#00a99a',
  keyword: '#f47067',
  comment: '#a19595',
  break: '#f8f9fa',
  space: '#f8f9fa',
}

/** Dark preview: keep identifiers & punctuation readable on #1e1e1e–#252526. */
export const STYLISH_DARK: ColorPlate = {
  class: '#7eb5ff',
  identifier: '#e6edf3',
  sign: '#a8b4c0',
  entity: '#5eead4',
  property: '#8cc8ff',
  jsxliterals: '#d2a8ff',
  string: '#9dd4cf',
  keyword: '#ffada8',
  comment: '#9aa7b4',
  break: '#0f1419',
  space: '#0f1419',
}
