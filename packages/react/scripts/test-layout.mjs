import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'

const detected = spawnSync('agent-browser', ['--version'], { encoding: 'utf8', timeout: 10000 })
if (detected.error?.code === 'ENOENT') {
  console.log('Skipped layout verification: agent-browser is not installed.')
  process.exit(0)
}
if (detected.error || detected.status !== 0) {
  throw detected.error ?? new Error(detected.stderr || 'agent-browser failed to start')
}

// Use the built package, so verification also exercises its emitted styles.
const { createElement: h } = await import('react')
const { renderToString } = await import('react-dom/server')
const { Code, Editor } = await import('../dist/index.js')
const session = `sugar-layout-${process.pid}`
const source = "import { Button } from './components/button'\n\nexport default Button\n"

function browser(args, input) {
  const output = execFileSync('agent-browser', ['--session', session, '--json', ...args], {
    input, encoding: 'utf8', timeout: 30000,
  })
  const response = JSON.parse(output)
  if (!response.success) throw new Error(response.error)
  return response.data
}

function render(style, codeProps, editorProps, css) {
  const html = renderToString(h('div', { style },
    h(Code, codeProps, source),
    h(Editor, { fontFamily: 'monospace', value: source, ...editorProps }),
  ))
  browser(['eval', '--stdin'], `(() => {
    document.open(); document.write(${JSON.stringify(html)}); document.close();
    const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.append(style);
  })()`)
}

function read(fn) {
  return browser(['eval', '--stdin'], `(${fn.toString()})()`).result
}

try {
  browser(['open', 'about:blank'], undefined)
  render({ fontFamily: 'monospace', fontSize: 18 },
    { title: 'index.tsx', fontSize: 13 }, { title: 'index.tsx', fontSize: 13 }, '')
  const sizes = read(() => [...document.querySelectorAll('code, textarea, [data-sh-title]')]
    .map(element => getComputedStyle(element).fontSize))
  assert(sizes.length > 0 && sizes.every(size => size === '13px'), 'Source and filenames must respect fontSize')

  for (const lineNumbers of [true, false]) {
    render({ fontFamily: 'monospace', fontSize: 13, lineHeight: '22px' },
      { lineNumbers }, { lineNumbers },
      '.sh__line { display: block; min-height: 1em } [data-sh-code-line-number] { position: absolute }')
    const rows = read(() => [...document.querySelectorAll('code')].map(block =>
      [...block.querySelectorAll('.sh__line')].map(element => ({
        height: element.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(element).lineHeight),
      }))))
    for (const block of rows) {
      assert(block.length >= 3)
      assert(block.every(row => row.height >= row.lineHeight), `Empty rows must retain line height (lineNumbers=${lineNumbers})`)
    }

    for (const width of [240, 390, 600]) {
      render({ width, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 },
        { lineNumbers }, { lineNumbers }, '* { box-sizing: border-box }')
      const positions = read(() => [...document.querySelectorAll('code > .sh__line:first-child')].map(line => {
        const origin = line.getBoundingClientRect()
        const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT)
        const positions = []
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
      assert.equal(positions.length, 2)
      assert.deepEqual(positions[0], positions[1], `Wrapping must match at width=${width}, lineNumbers=${lineNumbers}`)
    }
  }

  render({ width: 180, fontFamily: 'monospace', fontSize: 13 },
    { wrapLongLines: false }, { wrapLongLines: false }, '')
  const frames = read(() => [...document.querySelectorAll('pre')].map(element => ({
    whiteSpace: getComputedStyle(element).whiteSpace,
    overflow: element.scrollWidth > element.clientWidth,
  })))
  assert.deepEqual(frames, [{ whiteSpace: 'pre', overflow: true }, { whiteSpace: 'pre', overflow: true }])
  console.log('Passed 6 layout checks: font sizing, empty rows and matching wrapping with/without line numbers, and horizontal scrolling.')
} finally {
  browser(['close'], undefined)
}
