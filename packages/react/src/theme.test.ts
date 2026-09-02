import { describe, expect, it } from 'vitest'
import { themeStyle, type Theme } from './theme'

describe('themeStyle', () => {
  it('keeps a single palette consistent across color schemes', () => {
    const style = themeStyle({
      background: '#ffffff',
      foreground: '#111111',
      keyword: '#ff0000',
      comment: '#777777',
    })

    expect(style).toMatchObject({
      backgroundColor: '#ffffff',
      color: '#111111',
      '--sh-keyword': '#ff0000',
      '--sh-string': '#111111',
      '--sh-control-color': '#777777',
      '--sh-line-number-color': '#777777',
    })
  })

  it('uses the inherited color scheme for a paired theme', () => {
    const theme = {
      light: {
        background: '#ffffff',
        foreground: '#111111',
        keyword: '#aa0000',
      },
      dark: {
        background: '#111111',
        foreground: '#eeeeee',
        keyword: '#ff7777',
      },
    } satisfies Theme

    expect(themeStyle(theme)).toMatchObject({
      backgroundColor: 'light-dark(#ffffff, #111111)',
      color: 'light-dark(#111111, #eeeeee)',
      '--sh-keyword': 'light-dark(#aa0000, #ff7777)',
      '--sh-string': 'light-dark(#111111, #eeeeee)',
    })
    expect(themeStyle(theme)).not.toHaveProperty('colorScheme')
  })
})
