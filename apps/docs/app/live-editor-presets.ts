/**
 * Syntax palettes for the docs live editor, aligned with
 * https://github.com/huozhi/codice/blob/main/site/app/theme.css
 */

export type LiveEditorColorPlate = {
  class: string
  identifier: string
  sign: string
  entity: string
  property: string
  jsxliterals: string
  string: string
  keyword: string
  comment: string
  break: string
  space: string
}

export type LiveEditorThemePreset = {
  id: string
  name: string
  colors: LiveEditorColorPlate
  /**
   * When set, the copy action emits Codice `data-highlight-theme` + light/dark blocks.
   * The editor preview uses `colors` (light palette on the docs site).
   */
  codiceHighlightTheme?: string
  colorsDark?: LiveEditorColorPlate
}

const breakSpace = { break: '#ffffff', space: '#ffffff' } as const

function plate(
  c: Omit<
    LiveEditorColorPlate,
    'break' | 'space'
  >
): LiveEditorColorPlate {
  return { ...c, ...breakSpace }
}

const TOKEN_KEYS: (keyof Omit<
  LiveEditorColorPlate,
  'break' | 'space'
>)[] = [
  'class',
  'identifier',
  'sign',
  'string',
  'keyword',
  'comment',
  'jsxliterals',
  'entity',
  'property',
]

export function formatPlateAsCssVars(
  colors: LiveEditorColorPlate,
  keys: typeof TOKEN_KEYS = TOKEN_KEYS,
  indent = '  '
): string {
  const pad = indent
  return keys.map((k) => `${pad}--sh-${k}: ${colors[k]};`).join('\n')
}

/** Bare `--sh-*` lines (legacy copy format for custom palettes). */
export function buildFlatVarsCopySnippet(colors: LiveEditorColorPlate): string {
  return formatPlateAsCssVars(colors, TOKEN_KEYS, '')
}

/** Snippet shown in the install banner `color.css` example (light-mode palette). */
export function buildInstallBannerColorCss(colors: LiveEditorColorPlate): string {
  return `/* styles.css */
:root {
${formatPlateAsCssVars(colors)}
}`
}

/**
 * Codice theme.css shape: light + dark blocks with data-highlight-theme and data-theme.
 * Light block uses current `light` plate (so picker tweaks copy through); dark uses preset.
 */
export function buildCodiceThemeCopySnippet(
  highlightTheme: string,
  light: LiveEditorColorPlate,
  dark: LiveEditorColorPlate
): string {
  return `:root[data-highlight-theme="${highlightTheme}"][data-theme='light'] {
${formatPlateAsCssVars(light)}
}
:root[data-highlight-theme="${highlightTheme}"][data-theme='dark'] {
${formatPlateAsCssVars(dark)}
}`
}

export const LIVE_EDITOR_THEME_PRESETS: LiveEditorThemePreset[] = [
  {
    id: 'stylish',
    name: 'Stylish',
    colors: plate({
      class: '#8d85ff',
      identifier: '#354150',
      sign: '#8996a3',
      entity: '#6eafad',
      property: '#4e8fdf',
      jsxliterals: '#bf7db6',
      string: '#00a99a',
      keyword: '#f47067',
      comment: '#a19595',
    }),
  },
  {
    id: 'minimal-gray',
    name: 'Minimal',
    colors: plate({
      class: '#2d2d2d',
      identifier: '#6b6b6b',
      sign: '#9a9a9a',
      entity: '#6b6b6b',
      property: '#6b6b6b',
      jsxliterals: '#2d2d2d',
      string: '#6b6b6b',
      keyword: '#2d2d2d',
      comment: '#9a9a9a',
    }),
  },
  {
    id: 'vscode-github',
    name: 'VS Code',
    codiceHighlightTheme: 'vscode',
    colors: plate({
      class: '#6f42c1',
      identifier: '#24292f',
      sign: '#24292f',
      string: '#032f62',
      keyword: '#cf222e',
      comment: '#6e7781',
      jsxliterals: '#8250df',
      entity: '#953800',
      property: '#0550ae',
    }),
    colorsDark: plate({
      class: '#4ec9b0',
      identifier: '#9cdcfe',
      sign: '#d4d4d4',
      string: '#ce9178',
      keyword: '#569cd6',
      comment: '#6a9955',
      jsxliterals: '#ff8c42',
      entity: '#dcdcaa',
      property: '#9cdcfe',
    }),
  },
  {
    id: 'solarized-one-dark',
    name: 'One Dark Pro',
    codiceHighlightTheme: 'solarized',
    colors: plate({
      class: '#a626a4',
      identifier: '#383a42',
      sign: '#383a42',
      string: '#50a14f',
      keyword: '#a626a4',
      comment: '#a0a1a7',
      jsxliterals: '#c18401',
      entity: '#4078f2',
      property: '#0184bc',
    }),
    colorsDark: plate({
      class: '#e06c75',
      identifier: '#abb2bf',
      sign: '#abb2bf',
      string: '#98c379',
      keyword: '#c678dd',
      comment: '#5c6370',
      jsxliterals: '#e5c07b',
      entity: '#61afef',
      property: '#56b6c2',
    }),
  },
  {
    id: 'monokai',
    name: 'Monokai',
    codiceHighlightTheme: 'monokai',
    colors: plate({
      class: '#c72565',
      identifier: '#6b8e23',
      sign: '#3a7ca5',
      string: '#a68e39',
      keyword: '#c72565',
      comment: '#99998e',
      jsxliterals: '#7b5fc9',
      entity: '#cc7b18',
      property: '#6b8e23',
    }),
    colorsDark: plate({
      class: '#f92672',
      identifier: '#a6e22e',
      sign: '#66d9ef',
      string: '#e6db74',
      keyword: '#f92672',
      comment: '#75715e',
      jsxliterals: '#ae81ff',
      entity: '#fd971f',
      property: '#a6e22e',
    }),
  },
  {
    id: 'codice-minimal',
    name: 'Soft Minimal',
    codiceHighlightTheme: 'minimal',
    colors: plate({
      class: '#404040',
      identifier: '#404040',
      sign: '#404040',
      string: '#808080',
      keyword: '#606060',
      comment: '#999999',
      jsxliterals: '#404040',
      entity: '#404040',
      property: '#404040',
    }),
    colorsDark: plate({
      class: '#909090',
      identifier: '#909090',
      sign: '#909090',
      string: '#808080',
      keyword: '#b0b0b0',
      comment: '#a0a0a0',
      jsxliterals: '#909090',
      entity: '#909090',
      property: '#909090',
    }),
  },
  {
    id: 'nord-gruvbox',
    name: 'Gruvbox',
    codiceHighlightTheme: 'nord',
    colors: plate({
      class: '#b57614',
      identifier: '#3c3836',
      sign: '#3c3836',
      string: '#79740e',
      keyword: '#9d0006',
      comment: '#928374',
      jsxliterals: '#af3a03',
      entity: '#427b58',
      property: '#076678',
    }),
    colorsDark: plate({
      class: '#fabd2f',
      identifier: '#ebdbb2',
      sign: '#ebdbb2',
      string: '#b8bb26',
      keyword: '#fb4934',
      comment: '#928374',
      jsxliterals: '#fe8019',
      entity: '#8ec07c',
      property: '#83a598',
    }),
  },
  {
    id: 'base16-tokyo',
    name: 'Tokyo Night',
    codiceHighlightTheme: 'base16',
    colors: plate({
      class: '#5a4a78',
      identifier: '#565a6e',
      sign: '#565a6e',
      string: '#485e30',
      keyword: '#8c4351',
      comment: '#848cb5',
      jsxliterals: '#8f5e15',
      entity: '#0f4b6e',
      property: '#166775',
    }),
    colorsDark: plate({
      class: '#bb9af7',
      identifier: '#c0caf5',
      sign: '#c0caf5',
      string: '#9ece6a',
      keyword: '#f7768e',
      comment: '#565f89',
      jsxliterals: '#e0af68',
      entity: '#7dcfff',
      property: '#73daca',
    }),
  },
]
