const R = `[data-sh-editor]`
// 2.5rem is the default line-number width.

export const EDITOR_CSS = `\
${R} {
  --sh-editor-text-color: transparent;
  --sh-editor-background-color: transparent;
  --sh-caret-color: inherit;

  position: relative;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  scrollbar-width: none;
}
${R} textarea:not(:placeholder-shown) {
  padding: calc(var(--sh-padding) * 0.75) calc(var(--sh-padding) * 0.5);
}
${R} code,
${R} textarea {
  font-family: var(--sh-font-family);
  line-break: anywhere;
  overflow-wrap: break-word;
  scrollbar-width: none;
  line-height: 1.5;
  font-size: var(--sh-font-size);
  caret-color: var(--sh-caret-color);
  border: none;
  outline: none;
  width: 100%;
}
${R} code {
  display: inline-block;
  width: 100%;
  margin-left: calc(var(--sh-line-number-width) - 2.5rem);
  padding-right: calc(var(--sh-padding) * 0.5);
}
${R} textarea::-webkit-scrollbar,
${R} textarea:focus::-webkit-scrollbar,
${R} textarea:hover::-webkit-scrollbar {
  width: 0;
}
${R} [data-sh-content] {
  position: relative;
}
${R} textarea {
  resize: none;
  display: block;
  color: var(--sh-editor-text-color);
  background-color: var(--sh-editor-background-color);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
}
${R}[data-sh-line-numbers="true"] textarea {
  padding-left: var(--sh-line-number-width);
}
${R}[data-sh-line-numbers="false"] textarea {
  padding-left: var(--sh-padding);
}
`
// line number padding-left is [[width 24px] margin-right 16px] + 15px

export const css = EDITOR_CSS
