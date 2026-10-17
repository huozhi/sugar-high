import { describe, expect, it } from 'vitest'
import { tokenize } from '../lib/core.js'
import * as javascript from '../lib/lang/javascript.js'
import { getTokensAsString } from './testing-utils'

describe('JSX fragment recovery', () => {
  it.each([
    ['<></>', []],
    ['<>hello</>', ['hello => jsxliterals']],
    ['<><><span>{value}</span></></>', ['span => entity', 'value => identifier']],
    ['<><A /><B />{result.value}</>', ['A => entity', 'B => entity', 'result => identifier', 'value => property']],
    ['<><span>inner</span> tail</>', ['inner => jsxliterals', 'tail => jsxliterals']],
    ['<div><>fragment</> tail</div>', ['fragment => jsxliterals', 'tail => jsxliterals']],
    ['<>before <><A />{value}</> after</>', ['before => jsxliterals', 'value => identifier', 'after => jsxliterals']],
    ['<>literal `backticks` and "quotes"</>', ['literal `backticks` and "quotes" => jsxliterals']],
    ['<div>{ready && <><span>hello</span></>}</div>', ['ready => identifier', 'hello => jsxliterals']],
    ['<Panel header={<><Title>{heading}</Title></>} disabled />', ['header => property', 'heading => identifier', 'disabled => property']],
    ['<div title="<> </>">{"<> </>"}</div>', ['<> </> => string']],
    ['<><div title={`hello ${user.name}`} /></>', ['hello => string', 'user => identifier', 'name => property']],
  ])('restores JavaScript after %s', (snippet, expected) => {
    const input = snippet + '\nconst after = 1;'
    const tokens = tokenize(input, javascript)
    const actual = getTokensAsString(tokens)
    expect(tokens.map(([, value]) => value).join('')).toBe(input)
    for (const token of expected) expect(actual).toContain(token)
    expect(actual.slice(-5)).toEqual([
      'const => keyword', 'after => identifier', '= => sign', '1 => class', '; => sign',
    ])
  })
})
