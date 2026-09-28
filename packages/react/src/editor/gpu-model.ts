import type { ParsedCode, TokenType } from 'sugar-high/core'

export type Span = { type: TokenType; start: number; end: number }
export type Edit = { start: number; end: number; text: string }

export function difference(before: string, after: string): Edit {
  let start = 0, end = before.length, nextEnd = after.length
  while (start < end && start < nextEnd && before[start] === after[start]) start++
  while (end > start && nextEnd > start && before[end - 1] === after[nextEnd - 1]) { end--; nextEnd-- }
  return { start, end, text: after.slice(start, nextEnd) }
}

export function moveSpans(spans: Span[], edit: Edit): Span[] {
  const nextEnd = edit.start + edit.text.length
  const delta = nextEnd - edit.end
  return spans.flatMap(span => {
    if (span.end <= edit.start) return [span]
    if (span.start >= edit.end) return [{ ...span, start: span.start + delta, end: span.end + delta }]
    const mapped = { ...span, start: span.start <= edit.start ? span.start : nextEnd, end: span.end >= edit.end ? span.end + delta : nextEnd }
    return mapped.end > mapped.start ? [mapped] : []
  })
}

export function tokenSpans(parsed: ParsedCode): Span[] {
  const spans: Span[] = []
  let offset = 0
  for (const line of parsed.lines) {
    for (const token of line.tokens) {
      const end = offset + token.value.length
      if (token.type !== 'space' && token.type !== 'break' && token.type !== 'identifier') {
        spans.push({ type: token.type, start: offset, end })
      }
      offset = end
    }
    if (parsed.value[offset] === '\r') offset++
    if (parsed.value[offset] === '\n') offset++
  }
  return spans
}

export function lineStarts(text: string): number[] {
  const starts = [0]
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\r') { if (text[i + 1] === '\n') i++; starts.push(i + 1) }
    else if (text[i] === '\n') starts.push(i + 1)
  }
  return starts
}

export function deletionRange(text: string, position: number, backward: boolean, unit: 'character' | 'word' | 'line') {
  let target = position
  if ((backward && position === 0) || (!backward && position === text.length)) return [position, position]
  if (unit === 'line') {
    target = backward ? text.lastIndexOf('\n', position - 1) + 1 : text.indexOf('\n', position)
    if (target < 0) target = text.length
    if (target === position) target += backward ? -1 : 1
  } else if (unit === 'word') {
    const words = new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text)
    let probe = backward ? position - 1 : position
    while (probe >= 0 && probe < text.length) {
      const part = words.containing(probe)!
      target = backward ? part.index : part.index + part.segment.length
      if (part.segment.trim()) break
      probe = backward ? target - 1 : target
    }
  } else {
    const part = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text).containing(backward ? position - 1 : position)
    if (part) target = backward ? part.index : part.index + part.segment.length
  }
  return [Math.max(0, Math.min(position, target)), Math.min(text.length, Math.max(position, target))]
}
