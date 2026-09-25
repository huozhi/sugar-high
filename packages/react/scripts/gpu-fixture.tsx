import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Editor } from '../dist/gpu.mjs'
import { parse } from 'sugar-high/gpu'

const root = createRoot(document.getElementById('root')!)
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const sample = `export function transform(items: Array<{ id: number; label: string }>) {\n  // Filter a batch, keeping its original order.\n  const selected = items.filter(item => item.id % 2 === 0);\n  return selected.map(({ id, label }) => ({ id, label: label.toUpperCase() }));\n}\n\n`
function source(kib: number) { return sample.repeat(Math.ceil(kib * 1024 / sample.length)).slice(0, kib * 1024) }
let current = '', change: (value: string) => void
let reject = false
let edits: number[] = []
let removals = 0, resets = 0
let node: Node | null = null
let observer: MutationObserver | undefined

function App({ text, fallback, props = {} }: { text: string; fallback: boolean; props?: Record<string, unknown> }) {
  const [code, setCode] = useState(text)
  change = setCode
  current = code
  return <Editor value={code} onChange={value => { if (!reject) setCode(value) }}
    controls={false} title={null} wrapLongLines={false} lineNumbers
    style={{ height: 480, width: 900, fontSize: 14, lineHeight: '22px', color: '#ddd', background: '#151515', '--sh-keyword': '#cba6f7' } as any}
    {...(fallback ? { textareaProps: { 'aria-label': 'Code editor' } } : {})} {...props} />
}

async function ready() {
  const deadline = performance.now() + 60000
  while (performance.now() < deadline) {
    const status = document.querySelector<HTMLElement>('[data-sh-gpu]')?.dataset.shGpu
    if (status === 'ready') return
    if (status === 'unavailable') throw new Error('WebGPU unavailable; no highlighting benchmark was measured')
    await sleep(16)
  }
  throw new Error('GPU highlight timed out after 60 seconds')
}

const api = {
  source,
  async mount(text: string, fallback = false, props: Record<string, unknown> = {}) {
    observer?.disconnect(); reject = false
    flushSync(() => root.render(null))
    const started = performance.now()
    flushSync(() => root.render(<StrictMode><App text={text} fallback={fallback} props={props} /></StrictMode>))
    await frame()
    const firstFrameMs = performance.now() - started
    await ready(); await frame()
    return { firstFrameMs, readyMs: performance.now() - started, elements: document.querySelector('[data-sh-editor]')!.querySelectorAll('*').length }
  },
  ready,
  frame,
  async pair(removeFirst = false) {
    flushSync(() => root.render(<>{!removeFirst && <Editor key="first" defaultValue="const first = 1;" controls={false} />}<Editor key="second" defaultValue="const second = 2;" controls={false} /></>))
    await ready(); await frame()
  },
  get text() { return current },
  set(text: string) { flushSync(() => change(text)) },
  reject(value: boolean) { reject = value },
  watch() {
    edits = []; removals = 0; resets = 0
    const surface = document.querySelector('[data-sh-edit-surface]')
    node = surface?.firstChild ?? null
    observer?.disconnect()
    if (surface) {
      observer = new MutationObserver(records => {
        for (const record of records) removals += record.removedNodes.length
        if (![...CSS.highlights].some(([key, ranges]) => key.endsWith('-keyword') && ranges.size)) resets++
      })
      observer.observe(surface, { subtree: true, childList: true, characterData: true })
    }
  },
  result() {
    return { edits, removals, resets, stableNode: !node || document.querySelector('[data-sh-edit-surface]')?.firstChild === node, text: current }
  },
  async parse(kib: number) {
    const text = source(kib), times: number[] = []
    for (let i = 0; i < 5; i++) { const start = performance.now(); await parse(text); times.push(performance.now() - start) }
    return times
  },
}
// Measure from actual browser keydown to the second animation frame, not CLI round-trip time.
document.addEventListener('keydown', event => {
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return
  const start = performance.now()
  void frame().then(() => edits.push(performance.now() - start))
}, true)
Object.assign(window, { gpuFixture: api })
