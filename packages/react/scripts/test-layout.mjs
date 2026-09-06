import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'

const detected = spawnSync('agent-browser', ['--version'], { encoding: 'utf8', timeout: 10000 })
const missingBrowser = detected.error?.code === 'ENOENT'
if (missingBrowser && process.env.CI) throw new Error('agent-browser must be installed in CI')
if (!missingBrowser && (detected.error || detected.status !== 0)) {
  throw detected.error ?? new Error(detected.stderr || 'agent-browser failed to start')
}

// Use the built package, so verification also exercises its emitted styles.
const { createElement: h } = await import('react')
const { renderToString } = await import('react-dom/server')
let Code, Editor, FileTree
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
    document.open(); document.write(${JSON.stringify('<!doctype html>' + html)}); document.close();
    const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.append(style);
  })()`)
}

function read(fn) {
  return browser(['eval', '--stdin'], `(${fn.toString()})()`).result
}

function renderTree(props = {}, style = { width: 180 }, css = '') {
  const html = renderToString(h('div', { style }, h(FileTree, {
    paths: ['src/components/deeply/nested/a-very-long-component-filename.tsx', 'readme.md'],
    activeFile: 'src/components/deeply/nested/a-very-long-component-filename.tsx',
    onActiveFileChange() {},
    ...props,
  })))
  browser(['eval', '--stdin'], `document.open(); document.write(${JSON.stringify('<!doctype html>' + html + `<style>${css}</style>`)}); document.close();`)
}

test('built React components preserve layout', { skip: missingBrowser && 'agent-browser is not installed' }, async t => {
  const components = await import('../dist/index.js')
  Code = components.Code
  Editor = components.Editor
  FileTree = components.FileTree
  try {
    browser(['open', 'about:blank'], undefined)
    await t.test('file tree rows cover overflowing names and share a full-width hit area', () => {
      renderTree()
      const layout = read(() => {
        const tree = document.querySelector('[data-sh-file-tree]')
        const rows = [...tree.querySelectorAll('[role=treeitem]')]
        tree.scrollLeft = tree.scrollWidth
        return {
          scrolled: tree.scrollLeft > 0,
          rows: rows.map(row => {
            const rect = row.getBoundingClientRect()
            const label = row.querySelector('span').getBoundingClientRect()
            return {
              width: rect.width,
              containsLabel: rect.right >= label.right,
              hit: document.elementFromPoint(rect.right - 4, rect.y + rect.height / 2)?.closest('[role=treeitem]') === row,
            }
          }),
        }
      })
      assert(layout.scrolled)
      assert(layout.rows.every(row => row.containsLabel && row.hit), JSON.stringify(layout))
      assert(layout.rows.every(row => row.width === layout.rows[0].width))
    })
    await t.test('React page editor stays aligned regardless of stylesheet order', () => {
      const siteCss = ['global.css', 'styles.css', 'react/page.css']
        .map(file => readFileSync(new URL(`../../../apps/site/app/${file}`, import.meta.url), 'utf8'))
        .join('\n')
      for (const lineNumbers of [true, false]) {
        for (const siteFirst of [true, false]) {
          const html = renderToString(h('div', { className: 'react-product' },
            h(Editor, { className: 'react-demo__editor', value: source, lineNumbers })))
          const style = `<style>${siteCss}</style>`
          const documentHtml = '<!doctype html>' + (siteFirst ? style + html : html + style)
          browser(['eval', '--stdin'], `document.open(); document.write(${JSON.stringify(documentHtml)}); document.close();`)
          const rows = read(() => [...document.querySelectorAll('[data-sh-editor] .sh__line')]
            .map(element => ({ top: element.getBoundingClientRect().top, height: element.getBoundingClientRect().height })))
          assert(rows.length >= 3)
          for (let index = 1; index < rows.length; index++) {
            assert.equal(rows[index].top, rows[index - 1].top + rows[index - 1].height,
              `Page editor has a baseline gap (lineNumbers=${lineNumbers}, siteFirst=${siteFirst})`)
          }
        }
      }
    })

    await t.test('fontSize applies to source and headers', () => {
      render({ fontFamily: 'monospace', fontSize: 18 },
        { title: 'index.tsx', fontSize: 13 }, { title: 'index.tsx', fontSize: 13 }, '')
      const sizes = read(() => [...document.querySelectorAll('code, textarea, [data-sh-title]')]
        .map(element => getComputedStyle(element).fontSize))
      assert(sizes.length > 0 && sizes.every(size => size === '13px'), 'Source and filenames must respect fontSize')
    })

    await t.test('editor layers inherit root typography', () => {
      for (const editorProps of [
        { style: { fontSize: 17, lineHeight: '31px', letterSpacing: '0.5px' } },
        { fontSize: '1.25em', style: { lineHeight: 1.8 } },
      ]) {
        render({ fontSize: 16 }, {}, editorProps,
          'code { font-size: .95em; letter-spacing: 0 } textarea { font: inherit }')
        const typography = read(() => {
          const editor = document.querySelector('[data-sh-editor]')
          return [editor, ...editor.querySelectorAll('[data-sh-code], pre, code, textarea, .sh__line')]
            .map(element => {
              const style = getComputedStyle(element)
              return [style.fontSize, style.lineHeight, style.letterSpacing]
            })
        })
        for (const layer of typography.slice(1)) {
          assert.deepEqual(layer, typography[0], 'Editor layers must inherit root typography without scaling it again')
        }
      }
    })

    await t.test('empty lines and wrapped text retain matching geometry', () => {
      for (const lineNumbers of [true, false]) {
        render({ fontFamily: 'monospace', fontSize: 15, lineHeight: '22.5px' },
          { lineNumbers }, { lineNumbers },
          '* { box-sizing: border-box } .sh__line { min-height: 1em } [data-sh-code-line-number] { position: absolute }')
        const rows = read(() => [...document.querySelectorAll('code')].map(block =>
          [...block.querySelectorAll('.sh__line')].map(element => ({
            top: element.getBoundingClientRect().top,
            height: element.getBoundingClientRect().height,
            lineHeight: parseFloat(getComputedStyle(element).lineHeight),
          }))))
        for (const block of rows) {
          assert(block.length >= 3)
          assert(block.every(row => row.height >= row.lineHeight), `Empty rows must retain line height (lineNumbers=${lineNumbers})`)
          for (let index = 1; index < block.length; index++) {
            assert.equal(block[index].top, block[index - 1].top + block[index - 1].height,
              `Blank lines must not add baseline gaps (lineNumbers=${lineNumbers}, line=${index + 1})`)
          }
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

          const overlayPositions = read(() => {
            // Site styles can load after component styles in a deployed page.
            const siteStyle = document.createElement('style')
            siteStyle.textContent = '[data-codice-code] code { font-family: serif; font-size: 12px; line-height: 2; letter-spacing: 1px } [data-sh-code-line-number] { position: absolute }'
            document.head.append(siteStyle)
            const editor = document.querySelector('[data-sh-editor]')
            const textarea = editor.querySelector('textarea')
            // Textarea text has no DOM ranges. Mirror its computed styles in a plain
            // text box so ranges expose wrapping and glyph positions for comparison.
            const mirror = document.createElement('div')
            const style = getComputedStyle(textarea)
            for (const property of style) mirror.style.setProperty(property, style.getPropertyValue(property))
            const rect = textarea.getBoundingClientRect()
            Object.assign(mirror.style, {
              position: 'absolute', left: `${rect.x + scrollX}px`, top: `${rect.y + scrollY}px`,
              right: 'auto', bottom: 'auto', visibility: 'hidden',
            })
            mirror.textContent = textarea.value
            document.body.append(mirror)
            const positions = [editor.querySelector('code'), mirror].map(element => {
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
              const result = []
              while (walker.nextNode()) {
                const node = walker.currentNode
                if (node.parentElement.closest('[data-sh-code-line-number]')) continue
                for (let index = 0; index < node.length; index++) {
                  if (node.textContent[index] === '\n') continue
                  const range = document.createRange()
                  range.setStart(node, index)
                  range.setEnd(node, index + 1)
                  const rect = range.getBoundingClientRect()
                  result.push([rect.x, rect.y])
                }
              }
              return result
            })
            mirror.remove()
            return positions
          })
          assert.equal(overlayPositions[0].length, overlayPositions[1].length)
          for (let index = 0; index < overlayPositions[0].length; index++) {
            for (const axis of [0, 1]) {
              assert(Math.abs(overlayPositions[0][index][axis] - overlayPositions[1][index][axis]) < 0.5,
                `Textarea and highlight differ at character ${index}, axis=${axis}, width=${width}, lineNumbers=${lineNumbers}`)
            }
          }
        }
      }
    })

    await t.test('non-wrapping code scrolls horizontally', () => {
      render({ width: 180, fontFamily: 'monospace', fontSize: 13 },
        { wrapLongLines: false }, { wrapLongLines: false }, '')
      const frames = read(() => [...document.querySelectorAll('pre')].map(element => ({
        whiteSpace: getComputedStyle(element).whiteSpace,
        overflow: element.scrollWidth > element.clientWidth,
      })))
      assert.deepEqual(frames, [{ whiteSpace: 'pre', overflow: true }, { whiteSpace: 'pre', overflow: true }])
    })
  } finally {
    browser(['close'], undefined)
  }

})
