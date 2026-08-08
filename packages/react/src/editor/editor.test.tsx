import { describe, expect, it } from 'vitest'
import { Editor } from '.'
import { renderToString } from 'react-dom/server'

describe('Code', () => {
  it('default props', () => {
    expect(
      renderToString(
        <Editor>test</Editor>
      )
    ).toMatchInlineSnapshot(`
      "<div data-codice="editor" data-codice-editor="true" data-codice-title="" data-codice-controls="true" data-codice-line-numbers="true"><style data-codice-style="true">@scope {
      :scope[data-codice-editor] {
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
      :scope[data-codice-editor] textarea:not(:placeholder-shown) {
        padding: calc(var(--codice-code-padding) * 0.75) calc(var(--codice-code-padding) * 0.5);
      }
      :scope[data-codice-editor] code,
      :scope[data-codice-editor] textarea {
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
      :scope[data-codice-editor] code {
        display: inline-block;
        width: 100%;
        margin-left: calc(var(--codice-code-line-number-width) - 2.5rem); 
        padding-right: calc(var(--codice-code-padding) * 0.5);
      }
      :scope[data-codice-editor] textarea::-webkit-scrollbar,
      :scope[data-codice-editor] textarea:focus::-webkit-scrollbar,
      :scope[data-codice-editor] textarea:hover::-webkit-scrollbar {
        width: 0;
      }
      :scope[data-codice-editor] [data-codice-content] {
        position: relative;
      }
      :scope[data-codice-editor] textarea {
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
      :scope[data-codice-editor][data-codice-line-numbers="true"] textarea {
        padding-left: var(--codice-code-line-number-width);
      }
      :scope[data-codice-editor][data-codice-line-numbers="false"] textarea {
        padding-left: var(--codice-code-padding);
      }

      :scope[data-codice-editor] {
        --codice-font-size: inherit;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
        --codice-font-family: Consolas, Monaco, monospace;
      }
      }</style><div data-codice-header="true" data-codice-header-controls="true"><style data-codice-style="true">@scope {
      :scope[data-codice-header] {
        position: relative;
        display: flex;
        padding: calc(var(--codice-code-padding) * 0.25)
          var(--codice-code-padding)
          calc(var(--codice-code-padding) * 0.25);
        align-items: center;
      }
      :scope[data-codice-header] [data-codice-title] {
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
      :scope[data-codice-header] [data-codice-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
      }
      :scope[data-codice-header] [data-codice-controls] {
        width: 52px;
      }
      :scope[data-codice-header][data-codice-header-controls="true"] [data-codice-title] {
        padding-right: 52px;
      }
      :scope[data-codice-header] [data-codice-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--codice-control-color);
      }

      }</style><div data-codice-controls="true"><span data-codice-control="true"></span><span data-codice-control="true"></span><span data-codice-control="true"></span></div></div><div data-codice-content="true"><div data-codice="code" data-codice-code="true" data-codice-line-numbers="true"><style data-codice-style="true">@scope {
      :scope[data-codice-code] {
        padding: calc(var(--codice-code-padding) / 2) 0;
      }
      :scope[data-codice-code] [data-codice-code-content] {
        padding: calc(var(--codice-code-padding) * 0.25) 0;
      }
      :scope[data-codice-code] pre {
        white-space: pre-wrap;
        margin: 0;
      }
      :scope[data-codice-code] code {
        display: block;
        border: none;
      }
      :scope[data-codice-code] .sh__line {
        display: inline-block;
        width: 100%;
      }
      :scope[data-codice-code] .sh__line[data-highlight] {
        background-color: var(--codice-code-highlight-color);
      }

      :scope[data-codice-header] {
        position: relative;
        display: flex;
        padding: calc(var(--codice-code-padding) * 0.25)
          var(--codice-code-padding)
          calc(var(--codice-code-padding) * 0.25);
        align-items: center;
      }
      :scope[data-codice-header] [data-codice-title] {
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
      :scope[data-codice-header] [data-codice-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
      }
      :scope[data-codice-header] [data-codice-controls] {
        width: 52px;
      }
      :scope[data-codice-header][data-codice-header-controls="true"] [data-codice-title] {
        padding-right: 52px;
      }
      :scope[data-codice-header] [data-codice-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--codice-control-color);
      }

      :scope[data-codice-line-numbers="true"] code {
        counter-reset: codice-code-line-number;
      }
      :scope[data-codice-line-numbers="true"] .sh__line:has(> [data-codice-code-line-number]) {
        padding-left: var(--codice-code-line-number-width);
      }
      :scope[data-codice-line-numbers="true"] [data-codice-code-line-number] {
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
      :scope[data-codice-line-numbers="false"] .sh__line {
        padding-left: var(--codice-code-padding);
      }

      :scope[data-codice-code] {
        --codice-font-size: inherit;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
      }

      }</style><pre data-codice-code-content="true"><code></code></pre></div><textarea></textarea></div></div>"
    `)
  })

  it('with title', () => (
    expect(
      renderToString(
        <Editor title="file.js">test</Editor>
      )
    ).toMatchInlineSnapshot(`
      "<div data-codice="editor" data-codice-editor="true" data-codice-title="file.js" data-codice-controls="true" data-codice-line-numbers="true"><style data-codice-style="true">@scope {
      :scope[data-codice-editor] {
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
      :scope[data-codice-editor] textarea:not(:placeholder-shown) {
        padding: calc(var(--codice-code-padding) * 0.75) calc(var(--codice-code-padding) * 0.5);
      }
      :scope[data-codice-editor] code,
      :scope[data-codice-editor] textarea {
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
      :scope[data-codice-editor] code {
        display: inline-block;
        width: 100%;
        margin-left: calc(var(--codice-code-line-number-width) - 2.5rem); 
        padding-right: calc(var(--codice-code-padding) * 0.5);
      }
      :scope[data-codice-editor] textarea::-webkit-scrollbar,
      :scope[data-codice-editor] textarea:focus::-webkit-scrollbar,
      :scope[data-codice-editor] textarea:hover::-webkit-scrollbar {
        width: 0;
      }
      :scope[data-codice-editor] [data-codice-content] {
        position: relative;
      }
      :scope[data-codice-editor] textarea {
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
      :scope[data-codice-editor][data-codice-line-numbers="true"] textarea {
        padding-left: var(--codice-code-line-number-width);
      }
      :scope[data-codice-editor][data-codice-line-numbers="false"] textarea {
        padding-left: var(--codice-code-padding);
      }

      :scope[data-codice-editor] {
        --codice-font-size: inherit;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
        --codice-font-family: Consolas, Monaco, monospace;
      }
      }</style><div data-codice-header="true" data-codice-header-controls="true"><style data-codice-style="true">@scope {
      :scope[data-codice-header] {
        position: relative;
        display: flex;
        padding: calc(var(--codice-code-padding) * 0.25)
          var(--codice-code-padding)
          calc(var(--codice-code-padding) * 0.25);
        align-items: center;
      }
      :scope[data-codice-header] [data-codice-title] {
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
      :scope[data-codice-header] [data-codice-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
      }
      :scope[data-codice-header] [data-codice-controls] {
        width: 52px;
      }
      :scope[data-codice-header][data-codice-header-controls="true"] [data-codice-title] {
        padding-right: 52px;
      }
      :scope[data-codice-header] [data-codice-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--codice-control-color);
      }

      }</style><div data-codice-controls="true"><span data-codice-control="true"></span><span data-codice-control="true"></span><span data-codice-control="true"></span></div><input data-codice-title="true" value="file.js"/></div><div data-codice-content="true"><div data-codice="code" data-codice-code="true" data-codice-line-numbers="true"><style data-codice-style="true">@scope {
      :scope[data-codice-code] {
        padding: calc(var(--codice-code-padding) / 2) 0;
      }
      :scope[data-codice-code] [data-codice-code-content] {
        padding: calc(var(--codice-code-padding) * 0.25) 0;
      }
      :scope[data-codice-code] pre {
        white-space: pre-wrap;
        margin: 0;
      }
      :scope[data-codice-code] code {
        display: block;
        border: none;
      }
      :scope[data-codice-code] .sh__line {
        display: inline-block;
        width: 100%;
      }
      :scope[data-codice-code] .sh__line[data-highlight] {
        background-color: var(--codice-code-highlight-color);
      }

      :scope[data-codice-header] {
        position: relative;
        display: flex;
        padding: calc(var(--codice-code-padding) * 0.25)
          var(--codice-code-padding)
          calc(var(--codice-code-padding) * 0.25);
        align-items: center;
      }
      :scope[data-codice-header] [data-codice-title] {
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
      :scope[data-codice-header] [data-codice-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
      }
      :scope[data-codice-header] [data-codice-controls] {
        width: 52px;
      }
      :scope[data-codice-header][data-codice-header-controls="true"] [data-codice-title] {
        padding-right: 52px;
      }
      :scope[data-codice-header] [data-codice-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--codice-control-color);
      }

      :scope[data-codice-line-numbers="true"] code {
        counter-reset: codice-code-line-number;
      }
      :scope[data-codice-line-numbers="true"] .sh__line:has(> [data-codice-code-line-number]) {
        padding-left: var(--codice-code-line-number-width);
      }
      :scope[data-codice-line-numbers="true"] [data-codice-code-line-number] {
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
      :scope[data-codice-line-numbers="false"] .sh__line {
        padding-left: var(--codice-code-padding);
      }

      :scope[data-codice-code] {
        --codice-font-size: inherit;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
      }

      }</style><pre data-codice-code-content="true"><code></code></pre></div><textarea></textarea></div></div>"
    `)
  ))

  it('without controls and with className', () => (
    expect(
      renderToString(
        <Editor controls={false} className="editor">test</Editor>
      )
    ).toMatchInlineSnapshot(`
      "<div class="editor" data-codice="editor" data-codice-editor="true" data-codice-title="" data-codice-controls="false" data-codice-line-numbers="true"><style data-codice-style="true">@scope {
      :scope[data-codice-editor] {
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
      :scope[data-codice-editor] textarea:not(:placeholder-shown) {
        padding: calc(var(--codice-code-padding) * 0.75) calc(var(--codice-code-padding) * 0.5);
      }
      :scope[data-codice-editor] code,
      :scope[data-codice-editor] textarea {
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
      :scope[data-codice-editor] code {
        display: inline-block;
        width: 100%;
        margin-left: calc(var(--codice-code-line-number-width) - 2.5rem); 
        padding-right: calc(var(--codice-code-padding) * 0.5);
      }
      :scope[data-codice-editor] textarea::-webkit-scrollbar,
      :scope[data-codice-editor] textarea:focus::-webkit-scrollbar,
      :scope[data-codice-editor] textarea:hover::-webkit-scrollbar {
        width: 0;
      }
      :scope[data-codice-editor] [data-codice-content] {
        position: relative;
      }
      :scope[data-codice-editor] textarea {
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
      :scope[data-codice-editor][data-codice-line-numbers="true"] textarea {
        padding-left: var(--codice-code-line-number-width);
      }
      :scope[data-codice-editor][data-codice-line-numbers="false"] textarea {
        padding-left: var(--codice-code-padding);
      }

      :scope[data-codice-editor] {
        --codice-font-size: inherit;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
        --codice-font-family: Consolas, Monaco, monospace;
      }
      }</style><div data-codice-content="true"><div data-codice="code" data-codice-code="true" data-codice-line-numbers="true"><style data-codice-style="true">@scope {
      :scope[data-codice-code] {
        padding: calc(var(--codice-code-padding) / 2) 0;
      }
      :scope[data-codice-code] [data-codice-code-content] {
        padding: calc(var(--codice-code-padding) * 0.25) 0;
      }
      :scope[data-codice-code] pre {
        white-space: pre-wrap;
        margin: 0;
      }
      :scope[data-codice-code] code {
        display: block;
        border: none;
      }
      :scope[data-codice-code] .sh__line {
        display: inline-block;
        width: 100%;
      }
      :scope[data-codice-code] .sh__line[data-highlight] {
        background-color: var(--codice-code-highlight-color);
      }

      :scope[data-codice-header] {
        position: relative;
        display: flex;
        padding: calc(var(--codice-code-padding) * 0.25)
          var(--codice-code-padding)
          calc(var(--codice-code-padding) * 0.25);
        align-items: center;
      }
      :scope[data-codice-header] [data-codice-title] {
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
      :scope[data-codice-header] [data-codice-controls] {
        display: inline-flex;
        align-self: center;
        justify-self: start;
        align-items: center;
        justify-content: center;
      }
      :scope[data-codice-header] [data-codice-controls] {
        width: 52px;
      }
      :scope[data-codice-header][data-codice-header-controls="true"] [data-codice-title] {
        padding-right: 52px;
      }
      :scope[data-codice-header] [data-codice-control] {
        display: flex;
        width: 10px;
        height: 10px;
        margin: 3px;
        border-radius: 50%;
        background-color: var(--codice-control-color);
      }

      :scope[data-codice-line-numbers="true"] code {
        counter-reset: codice-code-line-number;
      }
      :scope[data-codice-line-numbers="true"] .sh__line:has(> [data-codice-code-line-number]) {
        padding-left: var(--codice-code-line-number-width);
      }
      :scope[data-codice-line-numbers="true"] [data-codice-code-line-number] {
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
      :scope[data-codice-line-numbers="false"] .sh__line {
        padding-left: var(--codice-code-padding);
      }

      :scope[data-codice-code] {
        --codice-font-size: inherit;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
      }

      }</style><pre data-codice-code-content="true"><code></code></pre></div><textarea></textarea></div></div>"
    `)
  ))
})
