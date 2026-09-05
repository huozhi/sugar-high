import { afterAll, beforeAll, expect, it } from 'vitest'
import { chromium, type Browser } from 'playwright'
import { renderToString } from 'react-dom/server'
import { Code, Editor } from '../index'

let browser: Browser
beforeAll(async () => { browser = await chromium.launch() })
afterAll(async () => { await browser?.close() })

const source = "import { Button } from './components/button'\n\nexport default Button\n"

it('applies fontSize to code and filenames without changing the host font', async () => {
  const page = await browser.newPage()
  try {
    await page.setContent(renderToString(
      <div style={{ fontFamily: 'monospace', fontSize: 18 }}>
        <Code title="index.tsx" fontSize={13}>{source}</Code>
        <Editor title="index.tsx" fontSize={13} fontFamily="monospace" value={source} />
      </div>
    ))
    const sizes = await page.locator('code, textarea, [data-sh-title]').evaluateAll(elements =>
      elements.map(element => getComputedStyle(element).fontSize)
    )
    expect(sizes.every(size => size === '13px')).toBe(true)
  } finally { await page.close() }
})

it.each([true, false])('keeps empty lines full-height with lineNumbers=%s', async lineNumbers => {
  const page = await browser.newPage()
  try {
    await page.setContent(renderToString(
      <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: '22px' }}>
        <Code lineNumbers={lineNumbers}>{source}</Code>
        <Editor lineNumbers={lineNumbers} fontFamily="monospace" value={source} />
      </div>
    ))
    // A common host layout uses block rows and absolutely positioned gutters.
    await page.addStyleTag({ content: '.sh__line { display: block; min-height: 1em } [data-sh-code-line-number] { position: absolute }' })
    for (const block of await page.locator('code').all()) {
      const rows = await block.locator('.sh__line').evaluateAll(elements => elements.map(element => ({
        height: element.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(element).lineHeight),
      })))
      expect(rows.length).toBeGreaterThanOrEqual(3)
      expect(rows.every(row => row.height >= row.lineHeight)).toBe(true)
    }
  } finally { await page.close() }
})

it.each([true, false])('preserves character wrapping between Code and Editor with lineNumbers=%s', async lineNumbers => {
  const page = await browser.newPage()
  try {
    for (const width of [240, 390, 600]) {
      await page.setContent(renderToString(
        <div style={{ width, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 }}>
          <Code lineNumbers={lineNumbers}>{source}</Code>
          <Editor lineNumbers={lineNumbers} fontFamily="monospace" value={source} />
        </div>
      ))
      await page.addStyleTag({ content: '* { box-sizing: border-box }' })
      const positions = await page.locator('code > .sh__line:first-child').evaluateAll(lines => lines.map(line => {
        const origin = line.getBoundingClientRect()
        const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT)
        const positions: number[][] = []
        while (walker.nextNode()) {
          const node = walker.currentNode
          if (node.parentElement?.closest('[data-sh-code-line-number]')) continue
          for (let index = 0; index < (node.textContent?.length ?? 0); index++) {
            const range = document.createRange()
            range.setStart(node, index)
            range.setEnd(node, index + 1)
            const rect = range.getBoundingClientRect()
            positions.push([rect.x - origin.x, rect.y - origin.y])
          }
        }
        return positions
      }))
      expect(positions[0]).toEqual(positions[1])
    }
  } finally { await page.close() }
})

it('keeps wrapLongLines=false horizontally scrollable', async () => {
  const page = await browser.newPage()
  try {
    await page.setContent(renderToString(
      <div style={{ width: 180, fontFamily: 'monospace', fontSize: 13 }}>
        <Code wrapLongLines={false}>{source}</Code>
        <Editor wrapLongLines={false} fontFamily="monospace" value={source} />
      </div>
    ))
    const frames = await page.locator('pre').evaluateAll(elements => elements.map(element => ({
      whiteSpace: getComputedStyle(element).whiteSpace,
      overflow: element.scrollWidth > element.clientWidth,
    })))
    expect(frames).toEqual([{ whiteSpace: 'pre', overflow: true }, { whiteSpace: 'pre', overflow: true }])
  } finally { await page.close() }
})
