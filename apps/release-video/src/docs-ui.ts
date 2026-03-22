/**
 * Typography aligned with apps/docs/app/styles.css (`html` + codice code).
 */
export const DOCS_FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"

/**
 * Highlighted `<pre>` (stack + theme) — matches docs codice / file tabs.
 * Not used for the hero decode lines — see {@link DOCS_FONT_MONO_HERO}.
 */
export const DOCS_FONT_MONO = 'Consolas, Monaco, monospace'

/** Hero opening decode — system UI monospace; keep separate from stack `<pre>`. */
export const DOCS_FONT_MONO_HERO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

/** Headline / body text on the marketing page. */
export const DOCS_TEXT = '#354150'
export const DOCS_MUTED = '#808c97'

/** Page background — docs-style light canvas. */
export const LIGHT_PAGE_BG = '#f8f9fa'

/** Full composition background when theme section is in dark mode (matches theme ramp end). */
export const DARK_PAGE_BG = '#0f1419'

/** Codice-style file tab (install banner / showcase). */
export const DOCS_CODICE_TAB_BG = '#d6e1eb'
export const DOCS_CODICE_TAB_TEXT = '#507a99'
