import { describe, expect, it } from 'vitest'
import { Code } from '.'
import { getLineNumbersWidth } from './code'
import { renderToString } from 'react-dom/server'

describe('Code', () => {
  it('expands the line number gutter for long files', () => {
    expect(getLineNumbersWidth('line\n'.repeat(998))).toBeUndefined()
    expect(getLineNumbersWidth('line\n'.repeat(999))).toBe('calc(4ch + 14px)')
    expect(getLineNumbersWidth('line', '5rem')).toBe('5rem')
  })

  it('exposes Sugar High markers and clamps highlighted ranges', () => {
    const html = renderToString(
      <Code highlightLines={[[1, Number.MAX_SAFE_INTEGER]]}>{'first\nsecond'}</Code>
    )

    expect(html).toContain('data-sh="code"')
    expect(html.match(/data-highlight="true"/g)).toHaveLength(2)
  })

  it('default props', () => {
    expect(renderToString(<Code>test</Code>)).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-code">[data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
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
      </style><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="false" data-sh-line-numbers="false"><pre data-codice-code-content="true" data-sh-code-content="true"><code><span class="sh__line" data-codice-code-line="true" data-sh-code-line="true"><span data-sh-token-type="identifier" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })

  it('with title', () => {
    expect(renderToString(<Code title="file.js">test</Code>)).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-code sugar-high-react-header">[data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
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
        caret-color: var(--sh-caret-color);
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
      </style><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="false" data-sh-line-numbers="false"><div data-codice-header="true" data-sh-header="true" data-codice-header-controls="false" data-sh-header-controls="false"><input data-codice-title="true" data-sh-title="true" readOnly="" value="file.js"/></div><pre data-codice-code-content="true" data-sh-code-content="true"><code><span class="sh__line" data-codice-code-line="true" data-sh-code-line="true"><span data-sh-token-type="identifier" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })

  it('with controls', () => {
    expect(renderToString(<Code controls>test</Code>)).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-code sugar-high-react-header">[data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
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
        caret-color: var(--sh-caret-color);
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
      </style><div style="--sh-font-size:inherit;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="false" data-sh-line-numbers="false"><div data-codice-header="true" data-sh-header="true" data-codice-header-controls="true" data-sh-header-controls="true"><div data-codice-controls="true" data-sh-controls="true"><span data-codice-control="true" data-sh-control="true"></span><span data-codice-control="true" data-sh-control="true"></span><span data-codice-control="true" data-sh-control="true"></span></div></div><pre data-codice-code-content="true" data-sh-code-content="true"><code><span class="sh__line" data-codice-code-line="true" data-sh-code-line="true"><span data-sh-token-type="identifier" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })

  it('with fontSize', () => {
    expect(renderToString(<Code fontSize={14}>test</Code>)).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-code">[data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
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
      </style><div style="--sh-font-size:14px;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="false" data-sh-line-numbers="false"><pre data-codice-code-content="true" data-sh-code-content="true"><code><span class="sh__line" data-codice-code-line="true" data-sh-code-line="true"><span data-sh-token-type="identifier" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)

    expect(renderToString(<Code fontSize={'1rem'}>test</Code>)).toMatchInlineSnapshot(`
      "<style data-precedence="default" data-href="sugar-high-react-code">[data-sh-code] {
        padding: calc(var(--sh-padding) / 2) 0;
      }
      [data-sh-code] [data-sh-code-content] {
        padding: calc(var(--sh-padding) * 0.25) 0;
      }
      [data-sh-code] pre {
        white-space: pre-wrap;
        margin: 0;
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
      </style><div style="--sh-font-size:1rem;--sh-line-number-width:2.5rem;--sh-padding:1rem" data-codice="code" data-codice-code="true" data-sh="code" data-sh-code="true" data-codice-line-numbers="false" data-sh-line-numbers="false"><pre data-codice-code-content="true" data-sh-code-content="true"><code><span class="sh__line" data-codice-code-line="true" data-sh-code-line="true"><span data-sh-token-type="identifier" class="sh__token--identifier" style="color:var(--sh-identifier)">test</span></span></code></pre></div>"
    `)
  })
})
