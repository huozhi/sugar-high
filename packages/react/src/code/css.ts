const C = `[data-sh-code]`
const H = `[data-sh-header]`
const L = `[data-sh-line-numbers="true"]`
const FL = `[data-sh-line-numbers="false"]`

const BASE_CSS = `\
${C} {
  padding: calc(var(--sh-padding) / 2) 0;
}
${C} [data-sh-code-content] {
  padding: calc(var(--sh-padding) * 0.25) 0;
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
  background-color: var(--sh-line-highlight-color);
}
`

export const HEADER_CSS = `\
${H} {
  position: relative;
  display: flex;
  padding: calc(var(--sh-padding) * 0.25)
    var(--sh-padding)
    calc(var(--sh-padding) * 0.25);
  align-items: center;
}
${H} [data-sh-title] {
  display: inline-block;
  flex: 1 0;
  text-align: center;
  line-height: 1;
  background-color: transparent;
  outline: none;
  border: none;
  caret-color: var(--sh-caret-color);
  color: var(--sh-title-color);
  font-family: var(--sh-font-family);
}
${H} [data-sh-controls] {
  display: inline-flex;
  align-self: center;
  justify-self: start;
  align-items: center;
  justify-content: center;
  width: 52px;
}
${H}[data-sh-header-controls="true"] [data-sh-title] {
  padding-right: 52px;
}
${H} [data-sh-control] {
  display: flex;
  width: 10px;
  height: 10px;
  margin: 3px;
  border-radius: 50%;
  background-color: var(--sh-control-color);
}
`

const LINE_NUMBER_CSS = `\
${L} code {
  counter-reset: codice-code-line-number;
}
${L} .sh__line:has(> [data-sh-code-line-number]) {
  padding-left: var(--sh-line-number-width);
}
${L} [data-sh-code-line-number] {
  counter-increment: codice-code-line-number 1;
  content: counter(codice-code-line-number);
  display: inline-block;
  min-width: calc(var(--sh-line-number-width) - 14px);
  margin-left: calc(var(--sh-line-number-width) * -1);
  margin-right: 14px;
  text-align: right;
  user-select: none;
  color: var(--sh-line-number-color);
}
${FL} .sh__line {
  padding-left: var(--sh-padding);
}
`

export const css = `${BASE_CSS}\n${LINE_NUMBER_CSS}`
