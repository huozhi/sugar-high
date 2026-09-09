import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'

vi.mock('sugar-high/gpu', () => ({
  parse: vi.fn(),
}))

import { Code, Editor } from './gpu'

describe('GPU React components', () => {
  it('server-renders an exact plain-text fallback while WebGPU initializes', () => {
    const html = renderToString(<Code lineNumbers>{'first\nsecond'}</Code>)

    expect(html).toContain('data-sh-gpu="pending"')
    expect(html).toContain('>first</span>')
    expect(html).toContain('>second</span>')
    expect(html).toContain('>1</span>')
    expect(html).toContain('>2</span>')
  })

  it('uses the GPU code view inside the editor', () => {
    const html = renderToString(<Editor value="const ready = true" />)

    expect(html).toContain('data-sh="editor"')
    expect(html).toContain('data-sh-gpu="pending"')
    expect(html).toContain('<textarea>const ready = true</textarea>')
  })
})
