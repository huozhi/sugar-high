import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import * as python from 'sugar-high/lang/python'
import { Code } from './core'

describe('core Code', () => {
  it('renders an imported language configuration on the server', () => {
    const html = renderToString(
      <Code lang={python}>{'def hello(): # greeting'}</Code>
    )

    expect(html).toContain('sh__token--keyword')
    expect(html).toContain('sh__token--comment')
  })
})
