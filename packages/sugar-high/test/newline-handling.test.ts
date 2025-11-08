import { describe, it, expect } from 'vitest'
import { tokenize, generate, highlight } from '../lib/index.js'

describe('newline handling', () => {
  it('should create new line in HTML when switching to new line in editor', () => {
    const codeWithNewlines = `function test() {
  console.log('hello');
  return true;
}`
    
    const tokens = tokenize(codeWithNewlines)
    const lines = generate(tokens)
    const html = highlight(codeWithNewlines)
    
    // Should generate 4 lines for 4 input lines
    expect(lines).toHaveLength(4)
    expect(html.split('\n')).toHaveLength(4)
    
    // Verify line contents
    const lineContents = lines.map(line => 
      line.children.map(child => child.children[0].value).join('')
    )
    
    expect(lineContents[0]).toBe('function test() {')
    expect(lineContents[1]).toBe('  console.log(\'hello\');')
    expect(lineContents[2]).toBe('  return true;')
    expect(lineContents[3]).toBe('}')
  })

  it('should preserve empty lines in HTML output', () => {
    const codeWithEmptyLines = `function test() {
  console.log('first');

  console.log('after empty');


  console.log('after two empty');
}`
    
    const lines = generate(tokenize(codeWithEmptyLines))
    const html = highlight(codeWithEmptyLines)
    
    // Should generate 8 lines (including empty lines)
    expect(lines).toHaveLength(8)
    expect(html.split('\n')).toHaveLength(8)
    
    // Verify empty lines are preserved
    const lineContents = lines.map(line => 
      line.children.map(child => child.children[0].value).join('')
    )
    
    expect(lineContents[2]).toBe('') // First empty line
    expect(lineContents[4]).toBe('') // Second empty line  
    expect(lineContents[5]).toBe('') // Third empty line
  })

  it('should create empty line when code ends with newline', () => {
    const codeEndingWithNewline = 'const x = 1;\n'
    
    const tokens = tokenize(codeEndingWithNewline)
    const lines = generate(tokens)
    const html = highlight(codeEndingWithNewline)
    
    // Should generate 2 lines: one with code, one empty
    expect(lines).toHaveLength(2)
    expect(html.split('\n')).toHaveLength(2)
    
    const lineContents = lines.map(line => 
      line.children.map(child => child.children[0].value).join('')
    )
    
    expect(lineContents[0]).toBe('const x = 1;')
    expect(lineContents[1]).toBe('') // Empty line from trailing newline
  })

  it('should handle multiple trailing newlines', () => {
    const codeWithMultipleTrailingNewlines = 'const x = 1;\n\n\n'
    
    const lines = generate(tokenize(codeWithMultipleTrailingNewlines))
    const html = highlight(codeWithMultipleTrailingNewlines)
    
    // Should generate 4 lines: one with code, three empty
    expect(lines).toHaveLength(4)
    expect(html.split('\n')).toHaveLength(4)
    
    const lineContents = lines.map(line => 
      line.children.map(child => child.children[0].value).join('')
    )
    
    expect(lineContents[0]).toBe('const x = 1;')
    expect(lineContents[1]).toBe('') // First empty line
    expect(lineContents[2]).toBe('') // Second empty line
    expect(lineContents[3]).toBe('') // Third empty line
  })

  it('should handle code with only newlines', () => {
    const onlyNewlines = '\n\n'
    
    const lines = generate(tokenize(onlyNewlines))
    const html = highlight(onlyNewlines)
    
    // Should generate 3 empty lines
    expect(lines).toHaveLength(3)
    expect(html.split('\n')).toHaveLength(3)
    
    const lineContents = lines.map(line => 
      line.children.map(child => child.children[0].value).join('')
    )
    
    expect(lineContents.every(content => content === '')).toBe(true)
  })
})
