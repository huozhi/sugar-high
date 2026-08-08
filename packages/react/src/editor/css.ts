import { fontSizeCss } from '../style'

const R = `:scope[data-codice-editor]`

export const EDITOR_CSS = `\
${R} {
  --codice-text-color: transparent;
  --codice-background-color: transparent;
  --codice-caret-color: inherit;

  position: relative;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  scrollbar-width: none;
}
${R} textarea:not(:placeholder-shown) {
  padding: calc(var(--codice-code-padding) * 0.75) calc(var(--codice-code-padding) * 0.5);
}
${R} code,
${R} textarea {
  font-family: var(--codice-font-family);
  line-break: anywhere;
  overflow-wrap: break-word;
  scrollbar-width: none;
  line-height: 1.5;
  font-size: var(--codice-font-size);
  caret-color: var(--codice-caret-color);
  border: none;
  outline: none;
  width: 100%;
}
${R} code {
  display: inline-block;
  width: 100%;
  margin-left: calc(var(--codice-code-line-number-width) - 2.5rem); ${/* 2.5rem is the default line number width */''}
  padding-right: calc(var(--codice-code-padding) * 0.5);
}
${R} textarea::-webkit-scrollbar,
${R} textarea:focus::-webkit-scrollbar,
${R} textarea:hover::-webkit-scrollbar {
  width: 0;
}
${R} [data-codice-content] {
  position: relative;
}
${R} textarea {
  resize: none;
  display: block;
  color: var(--codice-text-color);
  background-color: var(--codice-background-color);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
}
${R}[data-codice-line-numbers="true"] textarea {
  padding-left: var(--codice-code-line-number-width);
}
${R}[data-codice-line-numbers="false"] textarea {
  padding-left: var(--codice-code-padding);
}
`
// line number padding-left is [[width 24px] margin-right 16px] + 15px

export const css = ({
  fontSize,
  lineNumbersWidth = '2.5rem',
  padding = '1rem',
  fontFamily = 'Consolas, Monaco, monospace',
}: {
  fontSize?: string | number
  lineNumbersWidth: string
  padding: string
  fontFamily: string
}) => {
  return `\
${EDITOR_CSS}
${R} {
  --codice-font-size: ${fontSizeCss(fontSize)};
  --codice-code-line-number-width: ${lineNumbersWidth};
  --codice-code-padding: ${padding};
  --codice-font-family: ${fontFamily};
}`
}