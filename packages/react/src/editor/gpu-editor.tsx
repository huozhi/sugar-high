'use client'

import { forwardRef, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { CodeHeader, getLineNumbersWidth } from '../code/code'
import { fontSizeCss, ScopedStyle } from '../style'
import { themeStyle } from '../theme'
import type { EditorProps } from './editor'
import { EditContextEditor } from './edit-context'

const css = `
[data-sh-input="editcontext"] {
  display: flex; flex-direction: column; min-width: 0; overflow: hidden;
  font-family: var(--sh-font-family); font-size: var(--sh-font-size); line-height: 1.5;
}
[data-sh-input="editcontext"] [data-sh-content] { position: relative; flex: 1; min-height: 0; }
[data-sh-edit-surface] {
  box-sizing: border-box; height: 100%; overflow: auto; outline: none;
  white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 2;
  font: inherit; letter-spacing: inherit; color: inherit;
  padding: calc(var(--sh-padding) * .75) calc(var(--sh-padding) * .5) calc(var(--sh-padding) * .75) var(--sh-padding);
  caret-color: var(--sh-caret-color, currentColor);
}
[data-sh-input="editcontext"][data-sh-line-numbers="true"] [data-sh-edit-surface] { padding-left: var(--sh-line-number-width); }
[data-sh-input="editcontext"][data-sh-wrap-long-lines="false"] [data-sh-edit-surface] { white-space: pre; overflow-wrap: normal; }
[data-sh-gpu-gutter] {
  position: absolute; inset: 0 auto 0 0; width: var(--sh-line-number-width);
  pointer-events: none; overflow: hidden; user-select: none; background: inherit;
  color: var(--sh-line-number-color, currentColor); font: inherit;
}
[data-sh-gpu-gutter] > span { position: absolute; right: 14px; line-height: 1; font: inherit; }
`

// React owns the frame; EditContext owns the text node, selection, and highlight ranges.
export const ContextEditor = forwardRef<HTMLDivElement, EditorProps>(function ContextEditor({
  value, defaultValue = '', onChange, title, controls = true, onChangeTitle,
  lineNumbers = true, startingLineNumber = 1, lineNumbersWidth, wrapLongLines = true,
  indent = '  ', theme, fontSize, fontFamily, padding, style,
  extension: _extension, lang: _lang, cx: _cx, mark: _mark,
  textareaProps: _textareaProps, textareaRef: _textareaRef, children: _children, ...props
}, ref) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const code = value ?? uncontrolled
  const host = useRef<HTMLDivElement>(null)
  const gutter = useRef<HTMLDivElement>(null)
  const engine = useRef<EditContextEditor | null>(null)
  const options = useRef({ code, value, onChange, indent, lineNumbers, startingLineNumber })
  options.current = { code, value, onChange, indent, lineNumbers, startingLineNumber }

  useLayoutEffect(() => {
    const editor = new EditContextEditor(host.current!, gutter.current!, text => {
      // Schedule a render even for controlled consumers that reject the edit.
      setUncontrolled(text)
      options.current.onChange?.(text)
    })
    engine.current = editor
    editor.configure(options.current)
    editor.setValue(options.current.code)
    return () => { engine.current = null; editor.destroy() }
  }, [])

  useLayoutEffect(() => {
    engine.current?.configure({ indent, lineNumbers, startingLineNumber })
    engine.current?.layout()
  }, [indent, lineNumbers, startingLineNumber, wrapLongLines])

  useLayoutEffect(() => { engine.current?.setValue(code) }, [code, uncontrolled])

  return <div {...props} ref={ref}
    data-sh="editor" data-sh-editor data-codice="editor" data-codice-editor
    data-sh-input="editcontext" data-sh-line-numbers={lineNumbers}
    data-codice-title={title || ''} data-codice-controls={!!controls} data-codice-line-numbers={lineNumbers}
    data-sh-wrap-long-lines={wrapLongLines}
    style={{
      height: '24rem', '--sh-font-size': fontSizeCss(fontSize),
      '--sh-font-family': fontFamily ?? 'Consolas, Monaco, monospace',
      '--sh-padding': padding ?? '1rem',
      '--sh-line-number-width': getLineNumbersWidth(code, lineNumbersWidth, startingLineNumber) || '2.5rem',
      ...themeStyle(theme), ...style,
    } as CSSProperties}>
    <ScopedStyle css={css} href="sugar-high-react-gpu-editor" />
    <CodeHeader title={title} controls={controls} onChangeTitle={onChangeTitle} />
    <div data-sh-content data-codice-content style={{ background: 'inherit' }}>
      <div ref={host} data-sh-edit-surface data-sh-gpu="pending" role="textbox"
        aria-label={props['aria-label'] ?? title ?? 'Code editor'} aria-multiline="true" tabIndex={0} spellCheck={false} />
      <div ref={gutter} data-sh-gpu-gutter aria-hidden="true" hidden={!lineNumbers} />
    </div>
  </div>
})
