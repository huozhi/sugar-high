import { describe, expect, it } from 'vitest'
import { Editor } from '.'
import { indentCode } from './editor'
import { renderToString } from 'react-dom/server'

describe('Code', () => {
  it('indents at the caret and preserves it', () => {
    expect(indentCode('const value = 1', 6, 6, '  ')).toEqual({
      value: 'const   value = 1',
      selectionStart: 8,
      selectionEnd: 8,
    })
  })

  it('indents and outdents selected lines', () => {
    const indented = indentCode('one\ntwo\nthree', 1, 7, '  ')
    expect(indented).toEqual({
      value: '  one\n  two\nthree',
      selectionStart: 3,
      selectionEnd: 11,
    })
    expect(
      indentCode(
        indented.value,
        indented.selectionStart,
        indented.selectionEnd,
        '  ',
        true
      )
    ).toEqual({
      value: 'one\ntwo\nthree',
      selectionStart: 1,
      selectionEnd: 7,
    })
  })

  it('passes textarea attributes without exposing value control', () => {
    const html = renderToString(
      <Editor
        value="code"
        textareaProps={{
          'aria-label': 'Source code',
          autoCapitalize: 'off',
          spellCheck: true,
        }}
      />
    )

    expect(html).toContain('aria-label="Source code"')
    expect(html).toContain('autoCapitalize="off"')
    expect(html).toContain('spellCheck="true"')
    expect(html).toContain('<textarea')
    expect(html).toContain('>code</textarea>')
  })

  it('supports starting line numbers and non-wrapping input', () => {
    const html = renderToString(
      <Editor value={'first\nsecond'} startingLineNumber={40} wrapLongLines={false} />
    )

    expect(html).toContain('>40</span>')
    expect(html).toContain('>41</span>')
    expect(html).toContain('data-sh-wrap-long-lines="false"')
    expect(html).toContain('<textarea wrap="off">')
  })

  it('supports controlled and uncontrolled initial values', () => {
    const controlled = renderToString(<Editor value="controlled" defaultValue="ignored" />)
    const uncontrolled = renderToString(<Editor defaultValue="initial" />)

    expect(controlled).toContain('data-sh="editor"')
    expect(controlled).toContain('<textarea>controlled</textarea>')
    expect(controlled).not.toContain('ignored')
    expect(uncontrolled).toContain('<textarea>initial</textarea>')
  })

  it('default props', () => {
    expect(
      renderToString(
        <Editor>test</Editor>
      )
    ).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-editor sugar-high-react-header sugar-high-react-code">[data-sh-editor] {
        --sh-editor-text-color: transparent;
        --sh-editor-background-color: transparent;

        position: relative;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        scrollbar-width: none;
      }
      [data-sh-editor] textarea:not(:placeholder-shown) {
        padding: calc(var(--sh-padding) * 0.75) calc(var(--sh-padding) * 0.5);
      }
      [data-sh-editor] code,
      [data-sh-editor] textarea {
        font-family: var(--sh-font-family);
        line-break: anywhere;
        overflow-wrap: break-word;
        scrollbar-width: none;
        line-height: 1.5;
        font-size: var(--sh-font-size);
        caret-color: var(--sh-caret-color, CanvasText);
        border: none;
        outline: none;
        width: 100%;
      }
      [data-sh-editor] code {
        display: inline-block;
        width: 100%;
        margin-left: calc(var(--sh-line-number-width) - 2.5rem);
        padding-right: calc(var(--sh-padding) * 0.5);
      }
      [data-sh-editor] textarea::-webkit-scrollbar,
      [data-sh-editor] textarea:focus::-webkit-scrollbar,
      [data-sh-editor] textarea:hover::-webkit-scrollbar {
        width: 0;
      }
      [data-sh-editor] [data-sh-content] {
        position: relative;
      }
      [data-sh-editor] textarea {
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
      [data-sh-editor][data-sh-line-numbers="true"] textarea {
        padding-left: var(--sh-line-number-width);
      }
      [data-sh-editor][data-sh-line-numbers="false"] textarea {
        padding-left: var(--sh-padding);
      }
      [data-sh-header] {
        position: relative;
        display: flex;
        padding: calc(var(--sh-padding) * 0.25)
          var(--sh-padding)
          calc(var(--sh-padding) * 0.25);
        align-items: center;
      }
      [data-sh-header] [data-sh-title] {
        display: inline-block;
        flex: 1 0;
        text-align: center;
        line-height: 1;
        background-color: transparent;
        outline: none;
        border: none;
        caret-color: var(--sh-caret-color, CanvasText);
        color: var(--sh-title-color);
        font-family: var(--sh-font-family);
      }
      [data-sh-header] [data-sh-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
        width: 52px;
      }
      [data-sh-header][data-sh-header-controls="true"] [data-sh-title] {
        padding-right: 52px;
      }
      [data-sh-header] [data-sh-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--sh-control-color);
      }
      [data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
      }
      [data-sh-code][data-sh-wrap-long-lines="false"] pre {
        overflow-x: auto;
        white-space: pre;
      }
      [data-sh-code][data-sh-wrap-long-lines="false"] .sh__line {
        width: max-content;
        min-width: 100%;
      }
      [data-sh-code] code {
        display: block;
        border: none;
      }
      [data-sh-code] .sh__line {
        display: inline-block;
        width: 100%;
      }
      [data-sh-code] .sh__line[data-highlight] {
        background-color: var(--sh-line-highlight-color);
      }

      [data-sh-line-numbers="true"] code {
        counter-reset: codice-code-line-number;
      }
      [data-sh-line-numbers="true"] .sh__line:has(> [data-sh-code-line-number]) {
        padding-left: var(--sh-line-number-width);
      }
      [data-sh-line-numbers="true"] [data-sh-code-line-number] {
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
      [data-sh-line-numbers="false"] .sh__line {
        padding-left: var(--sh-padding);
      }
      </style><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem;--sh-font-family:Consolas, Monaco, monospace" data-codice="editor" data-codice-editor="true" data-sh="editor" data-sh-editor="true" data-codice-title="" data-codice-controls="true" data-codice-line-numbers="true" data-sh-line-numbers="true"><div data-codice-header="true" data-sh-header="true" data-codice-header-controls="true" data-sh-header-controls="true"><div data-codice-controls="true" data-sh-controls="true"><span data-codice-control="true" data-sh-control="true"></span><span data-codice-control="true" data-sh-control="true"></span><span data-codice-control="true" data-sh-control="true"></span></div></div><div data-codice-content="true" data-sh-content="true"><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="true" data-sh-line-numbers="true"><pre data-codice-code-content="true" data-sh-code-content="true"><code></code></pre></div><textarea></textarea></div></div>"
    `)
  })

  it('with title', () => (
    expect(
      renderToString(
        <Editor title="file.js">test</Editor>
      )
    ).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-editor sugar-high-react-header sugar-high-react-code">[data-sh-editor] {
        --sh-editor-text-color: transparent;
        --sh-editor-background-color: transparent;

        position: relative;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        scrollbar-width: none;
      }
      [data-sh-editor] textarea:not(:placeholder-shown) {
        padding: calc(var(--sh-padding) * 0.75) calc(var(--sh-padding) * 0.5);
      }
      [data-sh-editor] code,
      [data-sh-editor] textarea {
        font-family: var(--sh-font-family);
        line-break: anywhere;
        overflow-wrap: break-word;
        scrollbar-width: none;
        line-height: 1.5;
        font-size: var(--sh-font-size);
        caret-color: var(--sh-caret-color, CanvasText);
        border: none;
        outline: none;
        width: 100%;
      }
      [data-sh-editor] code {
        display: inline-block;
        width: 100%;
        margin-left: calc(var(--sh-line-number-width) - 2.5rem);
        padding-right: calc(var(--sh-padding) * 0.5);
      }
      [data-sh-editor] textarea::-webkit-scrollbar,
      [data-sh-editor] textarea:focus::-webkit-scrollbar,
      [data-sh-editor] textarea:hover::-webkit-scrollbar {
        width: 0;
      }
      [data-sh-editor] [data-sh-content] {
        position: relative;
      }
      [data-sh-editor] textarea {
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
      [data-sh-editor][data-sh-line-numbers="true"] textarea {
        padding-left: var(--sh-line-number-width);
      }
      [data-sh-editor][data-sh-line-numbers="false"] textarea {
        padding-left: var(--sh-padding);
      }
      [data-sh-header] {
        position: relative;
        display: flex;
        padding: calc(var(--sh-padding) * 0.25)
          var(--sh-padding)
          calc(var(--sh-padding) * 0.25);
        align-items: center;
      }
      [data-sh-header] [data-sh-title] {
        display: inline-block;
        flex: 1 0;
        text-align: center;
        line-height: 1;
        background-color: transparent;
        outline: none;
        border: none;
        caret-color: var(--sh-caret-color, CanvasText);
        color: var(--sh-title-color);
        font-family: var(--sh-font-family);
      }
      [data-sh-header] [data-sh-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
        width: 52px;
      }
      [data-sh-header][data-sh-header-controls="true"] [data-sh-title] {
        padding-right: 52px;
      }
      [data-sh-header] [data-sh-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--sh-control-color);
      }
      [data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
      }
      [data-sh-code][data-sh-wrap-long-lines="false"] pre {
        overflow-x: auto;
        white-space: pre;
      }
      [data-sh-code][data-sh-wrap-long-lines="false"] .sh__line {
        width: max-content;
        min-width: 100%;
      }
      [data-sh-code] code {
        display: block;
        border: none;
      }
      [data-sh-code] .sh__line {
        display: inline-block;
        width: 100%;
      }
      [data-sh-code] .sh__line[data-highlight] {
        background-color: var(--sh-line-highlight-color);
      }

      [data-sh-line-numbers="true"] code {
        counter-reset: codice-code-line-number;
      }
      [data-sh-line-numbers="true"] .sh__line:has(> [data-sh-code-line-number]) {
        padding-left: var(--sh-line-number-width);
      }
      [data-sh-line-numbers="true"] [data-sh-code-line-number] {
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
      [data-sh-line-numbers="false"] .sh__line {
        padding-left: var(--sh-padding);
      }
      </style><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem;--sh-font-family:Consolas, Monaco, monospace" data-codice="editor" data-codice-editor="true" data-sh="editor" data-sh-editor="true" data-codice-title="file.js" data-codice-controls="true" data-codice-line-numbers="true" data-sh-line-numbers="true"><div data-codice-header="true" data-sh-header="true" data-codice-header-controls="true" data-sh-header-controls="true"><div data-codice-controls="true" data-sh-controls="true"><span data-codice-control="true" data-sh-control="true"></span><span data-codice-control="true" data-sh-control="true"></span><span data-codice-control="true" data-sh-control="true"></span></div><input data-codice-title="true" data-sh-title="true" readOnly="" value="file.js"/></div><div data-codice-content="true" data-sh-content="true"><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="true" data-sh-line-numbers="true"><pre data-codice-code-content="true" data-sh-code-content="true"><code></code></pre></div><textarea></textarea></div></div>"
    `)
  ))

  it('without controls and with className', () => (
    expect(
      renderToString(
        <Editor controls={false} className="editor">test</Editor>
      )
    ).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-editor sugar-high-react-code">[data-sh-editor] {
        --sh-editor-text-color: transparent;
        --sh-editor-background-color: transparent;

        position: relative;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        scrollbar-width: none;
      }
      [data-sh-editor] textarea:not(:placeholder-shown) {
        padding: calc(var(--sh-padding) * 0.75) calc(var(--sh-padding) * 0.5);
      }
      [data-sh-editor] code,
      [data-sh-editor] textarea {
        font-family: var(--sh-font-family);
        line-break: anywhere;
        overflow-wrap: break-word;
        scrollbar-width: none;
        line-height: 1.5;
        font-size: var(--sh-font-size);
        caret-color: var(--sh-caret-color, CanvasText);
        border: none;
        outline: none;
        width: 100%;
      }
      [data-sh-editor] code {
        display: inline-block;
        width: 100%;
        margin-left: calc(var(--sh-line-number-width) - 2.5rem);
        padding-right: calc(var(--sh-padding) * 0.5);
      }
      [data-sh-editor] textarea::-webkit-scrollbar,
      [data-sh-editor] textarea:focus::-webkit-scrollbar,
      [data-sh-editor] textarea:hover::-webkit-scrollbar {
        width: 0;
      }
      [data-sh-editor] [data-sh-content] {
        position: relative;
      }
      [data-sh-editor] textarea {
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
      [data-sh-editor][data-sh-line-numbers="true"] textarea {
        padding-left: var(--sh-line-number-width);
      }
      [data-sh-editor][data-sh-line-numbers="false"] textarea {
        padding-left: var(--sh-padding);
      }
      [data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
      }
      [data-sh-code][data-sh-wrap-long-lines="false"] pre {
        overflow-x: auto;
        white-space: pre;
      }
      [data-sh-code][data-sh-wrap-long-lines="false"] .sh__line {
        width: max-content;
        min-width: 100%;
      }
      [data-sh-code] code {
        display: block;
        border: none;
      }
      [data-sh-code] .sh__line {
        display: inline-block;
        width: 100%;
      }
      [data-sh-code] .sh__line[data-highlight] {
        background-color: var(--sh-line-highlight-color);
      }

      [data-sh-line-numbers="true"] code {
        counter-reset: codice-code-line-number;
      }
      [data-sh-line-numbers="true"] .sh__line:has(> [data-sh-code-line-number]) {
        padding-left: var(--sh-line-number-width);
      }
      [data-sh-line-numbers="true"] [data-sh-code-line-number] {
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
      [data-sh-line-numbers="false"] .sh__line {
        padding-left: var(--sh-padding);
      }
      </style><div class="editor" style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem;--sh-font-family:Consolas, Monaco, monospace" data-codice="editor" data-codice-editor="true" data-sh="editor" data-sh-editor="true" data-codice-title="" data-codice-controls="false" data-codice-line-numbers="true" data-sh-line-numbers="true"><div data-codice-content="true" data-sh-content="true"><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="true" data-sh-line-numbers="true"><pre data-codice-code-content="true" data-sh-code-content="true"><code></code></pre></div><textarea></textarea></div></div>"
    `)
  ))
})
