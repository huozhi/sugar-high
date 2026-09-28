import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { version as reactVersion } from 'react'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const exec = promisify(execFile)
const directory = await mkdtemp(join(tmpdir(), 'sugar-gpu-'))
const session = `sugar-gpu-${process.pid}`
const benchmark = process.argv.includes('--benchmark')
const browser = async (...args) => {
  const { stdout } = await exec('agent-browser', ['--session', session, '--json', ...args], { timeout: 120000, maxBuffer: 8 * 1024 * 1024 })
  const response = JSON.parse(stdout)
  if (!response.success) throw new Error(response.error)
  return response.data
}
const evaluate = async code => (await browser('eval', code)).result
const mount = async (text, fallback = false, props = {}) => evaluate(`gpuFixture.mount(${JSON.stringify(text)}, ${fallback}, ${JSON.stringify(props)})`)
const press = key => browser('press', key)
const check = async expected => {
  await evaluate('gpuFixture.frame()')
  assert.equal(await evaluate('gpuFixture.text'), expected)
  assert.equal(await evaluate('document.querySelector("[data-sh-edit-surface]")?.editContext.text ?? document.querySelector("textarea").value'), expected)
}
const mod = process.platform === 'darwin' ? 'Meta' : 'Control'
let server
try {
  await exec('bun', ['build', fileURLToPath(new URL('./gpu-fixture.tsx', import.meta.url)), '--target=browser', '--minify', '--define=process.env.NODE_ENV="production"', `--outfile=${join(directory, 'fixture.js')}`])
  const bundle = await readFile(join(directory, 'fixture.js'))
  server = createServer((request, response) => {
    response.setHeader('Content-Type', request.url === '/fixture.js' ? 'application/javascript' : 'text/html')
    response.end(request.url === '/fixture.js' ? bundle : '<!doctype html><html><head><meta charset="utf-8"><title>GPU editor benchmark</title></head><body style="margin:0"><div id="root"></div><script>if(location.search.includes("no-gpu")) Object.defineProperty(navigator,"gpu",{value:undefined})</script><script type="module" src="/fixture.js"></script></body></html>')
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  await browser('--webgpu', 'open', `http://127.0.0.1:${server.address().port}`)
  await browser('wait', '--fn', '!!window.gpuFixture')

  if (benchmark) {
    const warmup = await mount('const warmup = 42;')
    const rows = []
    for (const kib of [64, 256, 1024]) {
      const parseTimes = await evaluate(`gpuFixture.parse(${kib})`)
      for (const fallback of [true, false]) {
        console.log(`Measuring ${kib} KiB, ${fallback ? 'textarea overlay' : 'EditContext'}…`)
        const mounted = await evaluate(`gpuFixture.mount(gpuFixture.source(${kib}), ${fallback})`)
        const selector = fallback ? 'textarea' : '[data-sh-edit-surface]'
        await browser('focus', selector)
        await press('Home')
        await evaluate('gpuFixture.watch()')
        for (let i = 0; i < 12; i++) {
          await press('x')
          await evaluate('gpuFixture.frame()')
        }
        await evaluate('gpuFixture.ready()')
        const result = await evaluate('gpuFixture.result()')
        assert.equal(result.edits.length, 12)
        if (!fallback) { assert(result.stableNode); assert.equal(result.removals, 0) }
        const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.ceil(values.length * p) - 1]
        rows.push({ kib, mode: fallback ? 'textarea' : 'editcontext', ...mounted,
          parseP50Ms: percentile(parseTimes, .5), parseP95Ms: percentile(parseTimes, .95),
          editP50Ms: percentile(result.edits, .5), editP95Ms: percentile(result.edits, .95) })
      }
    }
    const report = { measuredAt: new Date().toISOString(), platform: process.platform, arch: process.arch, node: process.version, react: reactVersion, gpuLexer: JSON.parse(await readFile(new URL('../../sugar-high/node_modules/gpu-lexer/package.json', import.meta.url), 'utf8')).version, userAgent: await evaluate('navigator.userAgent'),
      gpu: await evaluate('(async () => { const adapter = await navigator.gpu.requestAdapter(); return adapter?.info ? { vendor: adapter.info.vendor, architecture: adapter.info.architecture, device: adapter.info.device, description: adapter.info.description } : null })()'),
      coldSmallReadyMs: warmup.readyMs, parseSamples: 5, editSamples: 12, rows }
    console.table(rows)
    const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9)
    if (output) await writeFile(output, JSON.stringify(report, null, 2) + '\n')
  } else {
    await mount('const answer = 42;')
    await browser('focus', '[data-sh-edit-surface]')
    await press(`${mod}+a`); await browser('keyboard', 'type', 'one two three')
    await check('one two three')
    await press(process.platform === 'darwin' ? 'Alt+Backspace' : 'Control+Backspace'); await check('one two ')
    if (process.platform === 'darwin') { await press('Meta+Backspace'); await check(''); await press('Meta+z'); await check('one two ') }
    await press(`${mod}+a`); await browser('keyboard', 'inserttext', 'a👩‍💻é')
    await press('Backspace'); await check('a👩‍💻')
    await press('Backspace'); await check('a')
    await press(`${mod}+a`); await browser('keyboard', 'type', 'a'); await browser('keyboard', 'type', 'b'); await check('ab')
    await press('Home'); await press('Delete'); await check('b')
    await press(`${mod}+z`); await check('ab')
    await press(`${mod}+Shift+z`); await check('b')
    await press(`${mod}+a`); await browser('keyboard', 'inserttext', 'one\ntwo')
    await press('Home'); await press('Backspace'); await check('onetwo')
    await press(`${mod}+z`); await check('one\ntwo')
    await press('Shift+End'); await press('Backspace'); await check('one\n')
    await evaluate('gpuFixture.set("const answer = 42;\\n")')
    await evaluate('gpuFixture.ready()'); await evaluate('gpuFixture.watch()')
    await press(`${mod}+End`); await browser('keyboard', 'type', '// comment')
    await evaluate('gpuFixture.ready()')
    const result = await evaluate('gpuFixture.result()')
    assert(result.stableNode); assert.equal(result.removals, 0); assert.equal(result.resets, 0)
    await evaluate('gpuFixture.reject(true)'); await browser('keyboard', 'type', 'x')
    await check('const answer = 42;\n// comment')
    await mount('first\nsecond', false, { startingLineNumber: 40, wrapLongLines: true })
    assert.equal(await evaluate('document.querySelector("[data-sh-gpu-gutter] span").textContent'), '40')
    await browser('focus', '[data-sh-edit-surface]'); await press(`${mod}+a`); await press('Tab'); await check('  first\n  second')
    await press('Shift+Tab'); await check('first\nsecond')
    await press(`${mod}+a`)
    const copied = await evaluate(`(() => {
      const data = new DataTransfer()
      document.querySelector('[data-sh-edit-surface]').dispatchEvent(new ClipboardEvent('copy', { clipboardData: data, bubbles: true, cancelable: true }))
      return data.getData('text/plain')
    })()`)
    assert.equal(copied, 'first\nsecond')
    await evaluate(`(() => {
      const data = new DataTransfer(); data.setData('text/plain', 'pasted\\r\\ntext')
      document.querySelector('[data-sh-edit-surface]').dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }))
    })()`)
    await check('pasted\ntext')
    await evaluate('gpuFixture.mount(gpuFixture.source(64), false)')
    await browser('focus', '[data-sh-edit-surface]'); await press(`${mod}+End`)
    await evaluate('gpuFixture.frame()')
    assert(await evaluate('document.querySelector("[data-sh-edit-surface]").scrollTop > 1000'))
    assert(await evaluate('document.querySelectorAll("[data-sh-gpu-gutter] span").length < 100'))
    await evaluate('gpuFixture.mount(gpuFixture.source(64).replaceAll("\\n", " "), false)')
    assert(await evaluate('[...CSS.highlights.values()].reduce((sum, ranges) => sum + ranges.size, 0) < 1000'))
    await evaluate('gpuFixture.pair()')
    await evaluate('gpuFixture.frame()')
    assert.equal(await evaluate('document.querySelectorAll("[data-sh-edit-surface]").length'), 2)
    await evaluate('gpuFixture.pair(true)')
    assert.equal(await evaluate('[...CSS.highlights.keys()].filter(key => key.startsWith("sh-gpu-")).length'), 8)
    await mount('fallback', true)
    await browser('focus', 'textarea'); await press('End'); await press('Backspace'); await check('fallbac')
    assert.equal(await evaluate('document.querySelectorAll("[data-sh-edit-surface]").length'), 0)
    assert.equal(await evaluate('[...CSS.highlights.keys()].filter(key => key.startsWith("sh-gpu-")).length'), 0)
    await evaluate('window.savedEditContext = window.EditContext; window.EditContext = undefined')
    await mount('no EditContext')
    assert.equal(await evaluate('document.querySelectorAll("[data-sh-edit-surface]").length'), 0)
    await browser('focus', 'textarea'); await press('End'); await press('Backspace'); await check('no EditContex')
    await evaluate('window.EditContext = window.savedEditContext')
    await browser('open', `http://127.0.0.1:${server.address().port}/?no-gpu`)
    await browser('wait', '--fn', '!!window.gpuFixture')
    assert.match(await evaluate('gpuFixture.mount("plain text").catch(error => error.message)'), /WebGPU unavailable/)
    await browser('focus', '[data-sh-edit-surface]'); await press('End'); await press('Backspace'); await check('plain tex')
    assert.equal(await evaluate('document.querySelector("[data-sh-gpu]").dataset.shGpu'), 'unavailable')
    console.log('GPU browser checks passed: controlled editing, deletion, Unicode, undo/redo, indentation, stable highlights, line numbers, textarea compatibility, and cleanup.')
  }
} finally {
  await browser('close').catch(() => {})
  server?.close()
  await rm(directory, { recursive: true, force: true })
}
