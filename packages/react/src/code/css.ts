import { fontSizeCss } from '../style'

const C = `:scope[data-codice-code]`
const H = `:scope[data-codice-header]`
const L = `:scope[data-codice-line-numbers="true"]`
const FL = `:scope[data-codice-line-numbers="false"]`

const BASE_CSS = `\
${C} {
  padding: calc(var(--codice-code-padding) / 2) 0;
}
${C} [data-codice-code-content] {
  padding: calc(var(--codice-code-padding) * 0.25) 0;
}
${C} pre {
  white-space: pre-wrap;
  margin: 0;
}
${C} code {
  display: block;
  border: none;
}
${C} .sh__line {
  display: inline-block;
  width: 100%;
}
${C} .sh__line[data-highlight] {
  background-color: var(--codice-code-highlight-color);
}
`

export const HEADER_CSS = `\
${H} {
  position: relative;
  display: flex;
  padding: calc(var(--codice-code-padding) * 0.25)
    var(--codice-code-padding)
    calc(var(--codice-code-padding) * 0.25);
  align-items: center;
}
${H} [data-codice-title] {
  display: inline-block;
  flex: 1 0;
  text-align: center;
  line-height: 1;
  background-color: transparent;
  outline: none;
  border: none;
  caret-color: var(--codice-caret-color);
  color: var(--codice-title-color);
  font-family: var(--codice-font-family);
}
${H} [data-codice-controls] {
  display: inline-flex;
  align-self: center;
  justify-self: start;
  align-items: center;
  justify-content: center;
}
${H} [data-codice-controls] {
  width: 52px;
}
${H}[data-codice-header-controls="true"] [data-codice-title] {
  padding-right: 52px;
}
${H} [data-codice-control] {
  display: flex;
  width: 10px;
  height: 10px;
  margin: 3px;
  border-radius: 50%;
  background-color: var(--codice-control-color);
}
`

const LINE_NUMBER_CSS = `\
${L} code {
  counter-reset: codice-code-line-number;
}
${L} .sh__line:has(> [data-codice-code-line-number]) {
  padding-left: var(--codice-code-line-number-width);
}
${L} [data-codice-code-line-number] {
  counter-increment: codice-code-line-number 1;
  content: counter(codice-code-line-number);
  display: inline-block;
  min-width: calc(2rem - 6px);
  margin-left: calc(var(--codice-code-line-number-width) * -1);
  margin-right: 14px;
  text-align: right;
  user-select: none;
  color: var(--codice-code-line-number-color);
}
${FL} .sh__line {
  padding-left: var(--codice-code-padding);
}
`

const CODE_CSS = `${BASE_CSS}\n${HEADER_CSS}\n${LINE_NUMBER_CSS}`

export const css = ({
  fontSize,
  lineNumbersWidth = '2.5rem',
  padding = '1rem',
}: {
  fontSize: string | number | undefined
  lineNumbersWidth: string
  padding: string
}): string => {
  const fz = fontSizeCss(fontSize)
  return `\
${CODE_CSS}
${C} {
  --codice-font-size: ${fz};
  --codice-code-line-number-width: ${lineNumbersWidth};
  --codice-code-padding: ${padding};
}
`
}