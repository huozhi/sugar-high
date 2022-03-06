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


describe('ast', () => {
  it('should parse calculation correctly', () => {
    const tokens1 = tokenize(`123 - /555/ + 444;`)
    const tokens2 = tokenize(`/* evaluate */ (19) / 234 + 56 / 7;`)
    const tokens3 = tokenize(`const _iu = (19) / 234 + 56 / 7;`)
    expect(getTokenTypes(tokens1)).toEqual([
      'class', 'space', 'sign', 'space', 'string', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getTokenValues(tokens1)).toEqual([
      '123', ' ', '-', ' ', '/555/', ' ', '+', ' ', '444', ';'
    ])

    // with comment
    expect(getTokenTypes(tokens2)).toEqual([
      'comment', 'space', 'sign', 'class', 'sign', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getTokenValues(tokens2)).toEqual([
      '/* evaluate */', ' ', '(', '19', ')', ' ', '/', ' ', '234', ' ', '+', ' ', '56', ' ', '/', ' ', '7', ';',
    ])

    // with identifiers
    expect(getTokenTypes(tokens3)).toEqual([
      'keyword', 'space', 'class', 'space', 'sign', 'space', 'sign', 'class', 'sign', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'space', 'sign', 'space', 'class', 'sign',
    ])
    expect(getTokenValues(tokens3)).toEqual([
      'const', ' ', '_iu', ' ', '=', ' ', '(', '19', ')', ' ', '/', ' ', '234', ' ', '+', ' ', '56', ' ', '/', ' ', '7', ';',
    ])
  })

  it('should parse jsx correctly', () => {
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
    expect(
      filterSpaces(getTokenValues(tokens))
    ).toEqual([
      "// jsx", "const", "element", "=", "(", "<", ">", "<", "Food", "season", "=", "{", "{", "sault", 
      ":", "<", "p", "a", "=", "{", "[", "{", "}", "]", "}", "/>", "}", "}", ">", "</", "Food", ">", "{", 
      "/* jsx comment */", "}", "<", "h1", "className", "=", '"title"', "data", "-", "title", "=", '"true"', 
      ">", "Read more", "{", "' '", "}", "<", "Link", "href", "=", '"/posts/first-post"', ">", "<", "a", ">", 
      "this page! -", "{", "Date", ".", "now", "(", ")", "}", "</", "a", ">", "</", "Link", ">", "</", "h1", ">", 
      "</", ">", ")",
    ])

    const jsChildrenTextToken = tokens.find(tk => mergeSpaces(tk[1]) === 'Read more')
    console.log('jsChildrenTextToken', jsChildrenTextToken)
    expect(getTypeName(jsChildrenTextToken)).toBe('string')
  })
})
