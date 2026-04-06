import { describe, expect, it } from 'vitest'
import { resolvePresetLanguage } from 'sugar-high/presets'

describe('preset language aliases', () => {
  it('resolves C-like aliases', () => {
    expect(resolvePresetLanguage('c')).toBe('c')
    expect(resolvePresetLanguage('c89')).toBe('c')
    expect(resolvePresetLanguage('c99')).toBe('c')
    expect(resolvePresetLanguage('h')).toBe('c')
    expect(resolvePresetLanguage('go')).toBe('go')
    expect(resolvePresetLanguage('golang')).toBe('go')
    expect(resolvePresetLanguage('java')).toBe('java')
  })

  it('keeps existing preset aliases stable', () => {
    expect(resolvePresetLanguage('py')).toBe('python')
    expect(resolvePresetLanguage('rs')).toBe('rust')
    expect(resolvePresetLanguage('scss')).toBe('css')
    expect(resolvePresetLanguage('less')).toBe('css')
  })
})
