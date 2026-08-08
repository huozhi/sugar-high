import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Code } from './code'
import { Editor } from './editor'

describe('language selection', () => {
  it('accepts a canonical lang explicitly', () => {
    const html = renderToString(<Code lang="python">{'def hello(): # greeting'}</Code>)
    expect(html).toContain('sh__token--keyword')
    expect(html).toContain('sh__token--comment')
  })

  it('resolves a language alias from the title extension', () => {
    const html = renderToString(<Code title="settings.jsonc">{'// note\n{"ok": true}'}</Code>)
    expect(html).toContain('sh__token--comment')
    expect(html).toContain('sh__token--property')
  })

  it('passes lang through the editor overlay', () => {
    const html = renderToString(<Editor lang="rust" value="fn main() {}" />)
    expect(html).toContain('sh__token--keyword')
  })

  it('marks tokens with custom classes', () => {
    const html = renderToString(
      <Code lang="javascript" cx={{ keyword: 'font-bold' }}>{'const value = true'}</Code>
    )
    expect(html).toContain('sh__token--keyword font-bold')
  })
})
