import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import * as python from 'sugar-high/lang/python'
import { Code, Highlight } from './core'

describe('core Code', () => {
  it('renders an imported language configuration on the server', () => {
    const html = renderToString(
      <Code lang={python}>{'def hello(): # greeting'}</Code>
    )

    expect(html).toContain('sh__token--keyword')
    expect(html).toContain('sh__token--comment')
  })

  it('provides generated lines and tokens to custom server markup', () => {
    const html = renderToString(
      <Highlight
        code={'def hello(): # greeting'}
        lang={python}
        mark={(token) => {
          if (token.type === 'comment') token.properties['data-note'] = 'greeting'
        }}
        markLine={(line) => {
          line.properties['data-line'] = line.index + 1
        }}
        render={({ lines }) => (
          <ol>
            {lines.map((line, index) => (
              <li key={index} {...line.properties}>
                {line.tokens.map((token, tokenIndex) => (
                  <b
                    key={tokenIndex}
                    {...token.properties}
                    data-token-type={token.tokenType}
                  >
                    {token.value}
                  </b>
                ))}
              </li>
            ))}
          </ol>
        )}
      />
    )

    expect(html).toContain('<ol>')
    expect(html).toContain('data-line="1"')
    expect(html).toContain('data-token-type="keyword"')
    expect(html).toContain('data-note="greeting"')
  })
})
