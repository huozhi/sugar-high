import { describe, expect, it } from 'vitest'
import { difference, moveSpans, tokenSpans, lineStarts, deletionRange } from './gpu-model'

describe('GPU editor offsets', () => {
  it('preserves existing token colors across an edit and shifts following tokens', () => {
    const before = 'const x = 42', after = 'const answer = 42'
    const edit = difference(before, after)
    expect(before.slice(0, edit.start) + edit.text + before.slice(edit.end)).toBe(after)
    const spans = moveSpans([{ type: 'keyword', start: 0, end: 5 }, { type: 'class', start: 10, end: 12 }], edit)
    expect(spans.map(s => after.slice(s.start, s.end))).toEqual(['const', '42'])
  })
  it('removes deleted spans without overlapping or out-of-bounds ranges', () => {
    const spans = [{ type: 'keyword' as const, start: 0, end: 5 }, { type: 'class' as const, start: 6, end: 8 }]
    expect(moveSpans(spans, { start: 0, end: 8, text: '' })).toEqual([])
    expect(moveSpans(spans, { start: 2, end: 7, text: 'x' })).toEqual([{ type: 'keyword', start: 0, end: 3 }, { type: 'class', start: 3, end: 4 }])
  })
  it('maps CRLF and Unicode token offsets exactly', () => {
    const parsed = { value: '😀\r\nconst x\n', lines: [
      { index: 0, value: '😀', tokens: [{ type: 'string' as const, value: '😀' }], annotations: [] },
      { index: 1, value: 'const x', tokens: [{ type: 'keyword' as const, value: 'const' }, { type: 'space' as const, value: ' ' }, { type: 'identifier' as const, value: 'x' }], annotations: [] },
    ] }
    expect(tokenSpans(parsed)).toEqual([{ type: 'string', start: 0, end: 2 }, { type: 'keyword', start: 4, end: 9 }])
    expect(lineStarts(parsed.value)).toEqual([0, 4, 12])
  })
  it.each([
    ['a👩‍💻', 6, true, 'character', [1, 6]],
    ['aé', 3, true, 'character', [1, 3]],
    ['👩‍💻a', 0, false, 'character', [0, 5]],
    ['one two', 7, true, 'word', [4, 7]],
    ['one two', 0, false, 'word', [0, 3]],
    ['one\ntwo', 7, true, 'line', [4, 7]],
    ['one\ntwo', 4, true, 'line', [3, 4]],
    ['', 0, true, 'character', [0, 0]],
  ] as const)('deletes %s at %i using %s/%s', (text, position, backward, unit, expected) => {
    expect(deletionRange(text, position, backward, unit)).toEqual(expected)
  })
})
