import { describe, expect, it } from 'vitest'
import { treeItems, visibleItems } from './model'

describe('file navigation', () => {
  it('deduplicates paths and sorts nested folders before files while preserving file identities', () => {
    const paths = ['z.ts', 'src/z.ts', 'src/ui/button.tsx', 'src/a.ts', 'z.ts']
    const items = treeItems(paths)
    expect(items.map(item => item.path)).toEqual(['src/', 'src/ui/', 'src/ui/button.tsx', 'src/a.ts', 'src/z.ts', 'z.ts'])
    expect(items[2]).toMatchObject({ name: 'button.tsx', parent: 'src/ui/', depth: 2, directory: false })
    expect(treeItems([...paths].reverse())).toEqual(items)
  })
  it('hides all descendants of collapsed folders and retains nested expansion state', () => {
    const items = treeItems(['src/ui/button.tsx', 'src/index.ts', 'readme.md'])
    expect(visibleItems(items, new Set(['src/'])).map(item => item.path)).toEqual(['src/', 'readme.md'])
    expect(visibleItems(items, new Set(['src/ui/'])).map(item => item.path)).toEqual(['src/', 'src/ui/', 'src/index.ts', 'readme.md'])
    expect(visibleItems(treeItems(['other.ts']), new Set(['src/']))).toHaveLength(1)
  })
  it('handles empty inputs and ignores non-relative or ambiguous paths', () => {
    expect(treeItems([])).toEqual([])
    expect(treeItems(['', '/root.ts', './a.ts', '../a.ts', 'a//b.ts', 'a/', 'valid.ts']).map(item => item.path)).toEqual(['valid.ts'])
  })
})
