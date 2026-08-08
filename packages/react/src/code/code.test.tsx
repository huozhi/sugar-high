import { describe, expect, it } from 'vitest'
import { Code } from '.'
import { renderToString } from 'react-dom/server'

describe('Code', () => {
  it('default props', () => {
    expect(renderToString(<Code>test</Code>)).toMatchInlineSnapshot(`
      "<div data-codice="code" data-codice-code="true" data-codice-line-numbers="false"><style data-codice-style="true">@scope {
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

      }</style><pre data-codice-code-content="true"><code><span class="sh__line" data-codice-code-line="true"><span data-sh-token-type="element" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })

  it('with title', () => {
    expect(renderToString(<Code title="file.js">test</Code>)).toMatchInlineSnapshot(`
      "<div data-codice="code" data-codice-code="true" data-codice-line-numbers="false"><style data-codice-style="true">@scope {
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

      }</style><div data-codice-header="true" data-codice-header-controls="false"><style data-codice-style="true">@scope {
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

      }</style><input data-codice-title="true" readOnly="" value="file.js"/></div><pre data-codice-code-content="true"><code><span class="sh__line" data-codice-code-line="true"><span data-sh-token-type="element" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })

  it('with controls', () => {
    expect(renderToString(<Code controls>test</Code>)).toMatchInlineSnapshot(`
      "<div data-codice="code" data-codice-code="true" data-codice-line-numbers="false"><style data-codice-style="true">@scope {
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

      }</style><div data-codice-controls="true"><span data-codice-control="true"></span><span data-codice-control="true"></span><span data-codice-control="true"></span></div></div><pre data-codice-code-content="true"><code><span class="sh__line" data-codice-code-line="true"><span data-sh-token-type="element" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })

  it('with fontSize', () => {
    expect(renderToString(<Code fontSize={14}>test</Code>)).toMatchInlineSnapshot(`
      "<div data-codice="code" data-codice-code="true" data-codice-line-numbers="false"><style data-codice-style="true">@scope {
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
        --codice-font-size: 14px;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
      }

      }</style><pre data-codice-code-content="true"><code><span class="sh__line" data-codice-code-line="true"><span data-sh-token-type="element" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)

    expect(renderToString(<Code fontSize={'1rem'}>test</Code>)).toMatchInlineSnapshot(`
      "<div data-codice="code" data-codice-code="true" data-codice-line-numbers="false"><style data-codice-style="true">@scope {
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
        --codice-font-size: 1rem;
        --codice-code-line-number-width: 2.5rem;
        --codice-code-padding: 1rem;
      }

      }</style><pre data-codice-code-content="true"><code><span class="sh__line" data-codice-code-line="true"><span data-sh-token-type="element" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })
})