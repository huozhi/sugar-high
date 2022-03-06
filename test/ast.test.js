import { describe, expect, it } from 'vitest'
import { tokenize, types } from '../lib'

function getTypeName(token) {
  return types[token[0]]
}

function getTokenValues(tokens) {
  return tokens.map((tk) => tk[1])
}

function getTokenTypes(tokens) {
  return tokens.map((tk) => getTypeName(tk))
}

function mergeSpaces(str) {  
  return str.trim().replace(/^[\s]{2,}$/g, ' ')
}

function filterSpaces(arr) {
  return arr
    .map(t => mergeSpaces(t))
    .filter(Boolean)
}

function getNonSpacesTokens(tokens) {
  return filterSpaces(getTokenValues(tokens))
}

describe('calculation expression', () => {
  it('parse basic inline calculation expression', () => {
    const tokens = tokenize(`123 - /555/ + 444;`)
    expect(getTokenTypes(tokens)).toEqual([
      'class', 'space', 'sign', 'space', 'string', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getTokenValues(tokens)).toEqual([
      '123', ' ', '-', ' ', '/555/', ' ', '+', ' ', '444', ';'
    ])
    
  })

  it('parse calculation with comments', () => {
    const tokens = tokenize(`/* evaluate */ (19) / 234 + 56 / 7;`)
    expect(getTokenTypes(tokens)).toEqual([
      'comment', 'space', 'sign', 'class', 'sign', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getNonSpacesTokens(tokens)).toEqual([
      '/* evaluate */', '(', '19', ')', '/', '234', '+', '56', '/', '7', ';',
    ])
  })
  
  it('parse calcaution with defs', () => {
    const tokens = tokenize(`const _iu = (19) / 234 + 56 / 7;`)
    expect(getTokenTypes(tokens)).toEqual([
      'keyword', 'space', 'class', 'space', 'sign', 'space', 'sign', 'class', 'sign', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getNonSpacesTokens(tokens)).toEqual([
      'const', '_iu', '=', '(', '19', ')', '/', '234', '+', '56', '/', '7', ';',
    ])
  })
})

describe('jsx', () => {
  it('parse jsx compositions', () => {
    const tokens = tokenize(`// jsx
    const element = (
      <>
        <Food
          season={{
            sault: <p a={[{}]} />
          }}>
        </Food>
        {/* jsx comment */}
        <h1 className="title" data-title="true">
          Read more{' '}
          <Link href="/posts/first-post">
            <a>this page! - {Date.now()}</a>
          </Link>
        </h1>
      </>
    )`)
    expect(getNonSpacesTokens(tokens)).toEqual([
      "// jsx", "const", "element", "=", "(", "<", ">", "<", "Food", "season", "=", "{", "{", "sault", 
      ":", "<", "p", "a", "=", "{", "[", "{", "}", "]", "}", "/>", "}", "}", ">", "</", "Food", ">", "{", 
      "/* jsx comment */", "}", "<", "h1", "className", "=", '"title"', "data", "-", "title", "=", '"true"', 
      ">", "Read more", "{", "' '", "}", "<", "Link", "href", "=", '"/posts/first-post"', ">", "<", "a", ">", 
      "this page! -", "{", "Date", ".", "now", "(", ")", "}", "</", "a", ">", "</", "Link", ">", "</", "h1", ">", 
      "</", ">", ")",
    ])

    const jsChildrenTextToken = tokens.find(tk => mergeSpaces(tk[1]) === 'Read more')
    expect(getTypeName(jsChildrenTextToken)).toBe('string')
  })
})

describe('comments', () => {
  it('basic inline comments', () => {
    const code = `// This is a inline comment / <- a slash`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      '// This is a inline comment / <- a slash',
    ])
  })

  it('multiple slashes started inline comments', () => {
    const code = `/// <reference path="..." /> // reference comment`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      '/// <reference path="..." /> // reference comment',
    ])
  })

  it('multi-line comments', () => {
    const code = `/* This is another comment */ alert('good') // <- alerts`
    const tokens = tokenize(code)
    expect(getNonSpacesTokens(tokens)).toEqual([
      "/* This is another comment */",
      "alert",
      "(",
      "'",
      "good",
      "'",
      ")",
      "// <- alerts",
    ])

  })
})
