import { parse } from 'sugar-high/gpu'
import { indentCode } from './editor'
import { difference, moveSpans, tokenSpans, lineStarts, deletionRange, type Span } from './gpu-model'

type Snapshot = { text: string; anchor: number; focus: number }
type Options = { indent: string; lineNumbers: boolean; startingLineNumber: number }
interface Context extends EventTarget {
  text: string; selectionStart: number; selectionEnd: number
  updateText(start: number, end: number, text: string): void
  updateSelection(start: number, end: number): void
  updateControlBounds(bounds: DOMRect): void
  updateSelectionBounds(bounds: DOMRect): void
  updateCharacterBounds(start: number, bounds: DOMRect[]): void
}
type ContextWindow = Window & { EditContext?: new (options: { text: string }) => Context; Highlight?: new (...ranges: Range[]) => Set<Range> }
const types = ['keyword', 'string', 'class', 'property', 'entity', 'jsxliterals', 'sign', 'comment']
let sequence = 0

export function supportsEditContext() {
  return typeof window !== 'undefined' && !!(window as ContextWindow).EditContext && !!(window as ContextWindow).Highlight && 'highlights' in CSS
}

/** Imperative input/rendering layer; never replaces text nodes during highlighting. */
export class EditContextEditor {
  private text = ''
  private anchor = 0
  private focus = 0
  private node = document.createTextNode('')
  private context: Context
  private spans: Span[] = []
  private starts = [0]
  private options: Options = { indent: '  ', lineNumbers: true, startingLineNumber: 1 }
  private undoStack: Snapshot[] = []
  private redoStack: Snapshot[] = []
  private composing = false
  private timer = 0
  private frame = 0
  private revision = 0
  private busy = false
  private unavailable = false
  private disposed = false
  private abort = new AbortController()
  private observer: ResizeObserver
  private prefix = `sh-gpu-${++sequence}`
  private style = document.createElement('style')
  private highlights = (CSS as unknown as { highlights: Map<string, Set<Range>> }).highlights

  constructor(private host: HTMLDivElement, private gutter: HTMLDivElement, private onChange: (text: string) => void) {
    host.replaceChildren(this.node, document.createElement('br'))
    const Constructor = (window as ContextWindow).EditContext!
    this.context = new Constructor({ text: '' })
    ;(host as HTMLDivElement & { editContext: Context | null }).editContext = this.context
    this.style.textContent = types.map(type => `::highlight(${this.prefix}-${type}) { color: var(--sh-${type}, inherit); }`).join('\n')
      + `\n::highlight(${this.prefix}-composition) { text-decoration: underline; }`
    document.head.append(this.style)
    const listen = (target: EventTarget, name: string, fn: (event: any) => void, capture = false) => target.addEventListener(name, fn, { signal: this.abort.signal, capture })
    listen(this.context, 'textupdate', () => {
      if (!this.composing) this.remember()
      this.anchor = this.context.selectionStart; this.focus = this.context.selectionEnd
      this.change(this.context.text)
    })
    listen(this.context, 'compositionstart', () => { this.remember(); this.composing = true })
    listen(this.context, 'compositionend', () => {
      this.composing = false; this.highlights.delete(`${this.prefix}-composition`)
    })
    listen(this.context, 'characterboundsupdate', (event: { rangeStart: number; rangeEnd: number }) => {
      const bounds: DOMRect[] = []
      for (let i = event.rangeStart; i < event.rangeEnd; i++) bounds.push(this.rect(i, i + 1))
      this.context.updateCharacterBounds(event.rangeStart, bounds)
    })
    listen(this.context, 'textformatupdate', (event: { getTextFormats(): { rangeStart: number; rangeEnd: number }[] }) => {
      const Highlight = (window as ContextWindow).Highlight!
      this.highlights.set(`${this.prefix}-composition`, new Highlight(...event.getTextFormats().map(f => this.range(f.rangeStart, f.rangeEnd))))
    })
    listen(document, 'selectionchange', () => this.readSelection())
    listen(host, 'focus', () => this.restoreSelection())
    listen(host, 'keydown', (event: KeyboardEvent) => this.keydown(event))
    for (const name of ['copy', 'cut']) listen(host, name, (event: ClipboardEvent) => {
      if (!event.clipboardData || this.composing) return
      this.readSelection(); event.preventDefault()
      event.clipboardData.setData('text/plain', this.text.slice(Math.min(this.anchor, this.focus), Math.max(this.anchor, this.focus)))
      if (name === 'cut' && this.anchor !== this.focus) this.insert('')
    })
    listen(host, 'paste', (event: ClipboardEvent) => {
      if (!event.clipboardData || this.composing) return
      event.preventDefault(); this.readSelection()
      this.insert(event.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n'))
    })
    listen(host, 'scroll', () => this.scheduleLayout())
    listen(window, 'scroll', () => this.scheduleLayout(), true)
    this.observer = new ResizeObserver(() => this.scheduleLayout())
    this.observer.observe(host)
    this.scheduleParse()
  }

  configure(options: Options) { this.options = options }

  setValue(text: string) {
    if (this.disposed || text === this.text) return
    this.undoStack = []; this.redoStack = []; this.spans = []
    this.anchor = Math.min(this.anchor, text.length); this.focus = Math.min(this.focus, text.length)
    this.context.updateText(0, this.text.length, text)
    this.context.updateSelection(Math.min(this.anchor, this.focus), Math.max(this.anchor, this.focus))
    this.change(text, false)
  }

  destroy() {
    this.disposed = true; this.abort.abort(); this.observer.disconnect()
    clearTimeout(this.timer); cancelAnimationFrame(this.frame)
    ;(this.host as HTMLDivElement & { editContext: Context | null }).editContext = null
    this.style.remove()
    for (const type of [...types, 'composition']) this.highlights.delete(`${this.prefix}-${type}`)
  }

  private snapshot(): Snapshot { return { text: this.text, anchor: this.anchor, focus: this.focus } }
  private remember() {
    this.undoStack.push(this.snapshot()); this.redoStack = []
    // Bound retained source memory, while preserving at least the latest edit.
    let size = 0
    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      size += this.undoStack[i].text.length * 2
      if (i < this.undoStack.length - 1 && (size > 8 * 1024 * 1024 || this.undoStack.length - i > 200)) {
        this.undoStack.splice(0, i + 1); break
      }
    }
  }
  private undo(redo: boolean) {
    const from = redo ? this.redoStack : this.undoStack, to = redo ? this.undoStack : this.redoStack
    const saved = from.pop()
    if (!saved) return
    to.push(this.snapshot()); this.anchor = saved.anchor; this.focus = saved.focus
    this.apply(saved.text)
  }
  private insert(value: string) {
    this.remember()
    const start = Math.min(this.anchor, this.focus), end = Math.max(this.anchor, this.focus)
    this.anchor = this.focus = start + value.length
    this.apply(this.text.slice(0, start) + value + this.text.slice(end))
  }
  private apply(text: string) {
    this.context.updateText(0, this.text.length, text)
    this.context.updateSelection(Math.min(this.anchor, this.focus), Math.max(this.anchor, this.focus))
    this.change(text)
  }
  private change(text: string, input = true) {
    const edit = difference(this.text, text)
    this.spans = moveSpans(this.spans, edit)
    this.node.replaceData(edit.start, edit.end - edit.start, edit.text)
    this.text = text; this.starts = lineStarts(text); this.revision++
    this.restoreSelection()
    if (input) this.revealCaret()
    this.layout(); this.scheduleParse()
    if (input) this.onChange(text)
  }
  private revealCaret() {
    if (document.activeElement !== this.host) return
    const caret = this.rect(this.focus), viewport = this.host.getBoundingClientRect()
    if (caret.bottom > viewport.bottom - 24) this.host.scrollTop += caret.bottom - viewport.bottom + 24
    if (caret.top < viewport.top) this.host.scrollTop -= viewport.top - caret.top
    if (caret.right > viewport.right - 24) this.host.scrollLeft += caret.right - viewport.right + 24
    if (caret.left < viewport.left) this.host.scrollLeft -= viewport.left - caret.left
  }
  private scheduleParse() {
    clearTimeout(this.timer)
    if (this.unavailable) return
    this.host.dataset.shGpu = 'pending'
    this.timer = window.setTimeout(() => void this.highlight(), 80)
  }
  private async highlight() {
    if (this.busy || this.disposed || this.unavailable) return
    this.busy = true
    const revision = this.revision
    try {
      const parsed = await parse(this.text)
      if (!this.disposed && revision === this.revision) {
        this.spans = tokenSpans(parsed); this.layout(); this.host.dataset.shGpu = 'ready'
      }
    } catch {
      if (!this.disposed) { this.unavailable = true; this.host.dataset.shGpu = 'unavailable' }
    } finally {
      this.busy = false
      if (!this.disposed && revision !== this.revision) this.scheduleParse()
    }
  }
  private range(start: number, end = start) {
    const range = document.createRange()
    range.setStart(this.node, Math.max(0, Math.min(start, this.node.length)))
    range.setEnd(this.node, Math.max(0, Math.min(end, this.node.length)))
    return range
  }
  private rect(start: number, end = start): DOMRect {
    const rect = this.range(start, end).getBoundingClientRect()
    if (rect.height) return rect
    const style = getComputedStyle(this.host), height = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5
    if (start > 0) {
      const previous = this.range(start - 1, start).getBoundingClientRect()
      return new DOMRect(previous.x, previous.y + height, 0, height)
    }
    const bounds = this.host.getBoundingClientRect()
    return new DOMRect(bounds.x + parseFloat(style.paddingLeft), bounds.y + parseFloat(style.paddingTop) - this.host.scrollTop, 0, height)
  }
  private restoreSelection() {
    if (document.activeElement !== this.host) return
    document.getSelection()?.setBaseAndExtent(this.node, this.anchor, this.node, this.focus)
  }
  private readSelection() {
    if (document.activeElement !== this.host) return
    const selection = document.getSelection()
    if (!selection?.anchorNode || !selection.focusNode || !this.host.contains(selection.anchorNode) || !this.host.contains(selection.focusNode)) return
    const offset = (node: Node, position: number) => {
      if (node === this.node) return position
      const range = document.createRange(); range.selectNodeContents(this.host); range.setEnd(node, position)
      return Math.min(this.text.length, range.toString().length)
    }
    this.anchor = offset(selection.anchorNode, selection.anchorOffset); this.focus = offset(selection.focusNode, selection.focusOffset)
    this.context.updateSelection(Math.min(this.anchor, this.focus), Math.max(this.anchor, this.focus))
    this.context.updateSelectionBounds(this.rect(this.focus))
  }
  private scheduleLayout() {
    cancelAnimationFrame(this.frame)
    this.frame = requestAnimationFrame(() => this.layout())
  }
  layout() {
    if (this.disposed) return
    const viewport = this.host.getBoundingClientRect()
    this.context.updateControlBounds(viewport)
    this.context.updateSelectionBounds(this.rect(this.focus))
    if (viewport.bottom <= 0 || viewport.top >= innerHeight || !viewport.height) return
    // Binary-search actual line geometry, including wrapping, instead of mounting every line.
    const atY = (y: number) => {
      let low = 0, high = this.starts.length
      while (low < high) {
        const mid = (low + high) >>> 1
        if (this.rect(this.starts[mid]).top < y) low = mid + 1
        else high = mid
      }
      return low
    }
    const first = Math.max(0, atY(viewport.top) - 2), last = Math.min(this.starts.length, atY(viewport.bottom) + 1)
    let start = this.starts[first], end = this.starts[last] ?? this.text.length
    // Clip within long/minified logical lines, too. A whole line may span megabytes.
    const point = (x: number, y: number) => {
      const caret = document.caretPositionFromPoint(x, y)
      return caret?.offsetNode === this.node ? caret.offset : undefined
    }
    const contentLeft = viewport.left + parseFloat(getComputedStyle(this.host).paddingLeft)
    const firstRect = this.rect(start), lastRect = this.rect(Math.max(start, end - 1))
    const firstY = Math.max(1, viewport.top + 1, Math.min(viewport.bottom - 1, firstRect.top + firstRect.height / 2))
    const lastY = Math.min(innerHeight - 1, viewport.bottom - 1, Math.max(viewport.top + 1, lastRect.top + lastRect.height / 2))
    const firstOffset = point(contentLeft + 1, firstY)
    const lastOffset = point(Math.min(innerWidth, viewport.right) - 18, lastY)
    if (firstOffset !== undefined) start = Math.max(start, firstOffset - 256)
    if (lastOffset !== undefined) end = Math.min(end, lastOffset + 256)
    if (end < start) end = start
    const numbers: HTMLSpanElement[] = []
    if (this.options.lineNumbers) {
      const lineHeight = parseFloat(getComputedStyle(this.host).lineHeight)
      for (let i = first; i < last; i++) {
        const rect = this.rect(this.starts[i]), span = document.createElement('span')
        span.textContent = String(this.options.startingLineNumber + i)
        span.style.top = `${rect.top - viewport.top - Math.max(0, (lineHeight - rect.height) / 2)}px`
        numbers.push(span)
      }
    }
    this.gutter.replaceChildren(...numbers)
    const groups = new Map<string, Range[]>()
    let low = 0, high = this.spans.length
    while (low < high) { const mid = (low + high) >>> 1; if (this.spans[mid].end <= start) low = mid + 1; else high = mid }
    for (let i = low; i < this.spans.length && this.spans[i].start <= end; i++) {
      const span = this.spans[i], ranges = groups.get(span.type) ?? []
      ranges.push(this.range(Math.max(start, span.start), Math.min(end, span.end))); groups.set(span.type, ranges)
    }
    const Highlight = (window as ContextWindow).Highlight!
    for (const type of types) this.highlights.set(`${this.prefix}-${type}`, new Highlight(...(groups.get(type) ?? [])))
  }
  private keydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.isComposing || this.composing) return
    this.readSelection()
    const mod = event.metaKey || event.ctrlKey, key = event.key.toLowerCase()
    if (mod && (key === 'z' || key === 'y')) { event.preventDefault(); this.undo(key === 'y' || event.shiftKey); return }
    if (mod && key === 'a') {
      event.preventDefault(); this.anchor = 0; this.focus = this.text.length
      this.context.updateSelection(0, this.focus); this.restoreSelection(); return
    }
    if (key === 'home' || key === 'end' || (event.metaKey && ['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key))) {
      event.preventDefault()
      const backward = key === 'home' || key === 'arrowleft' || key === 'arrowup'
      const documentEdge = ((key === 'home' || key === 'end') && mod) || key === 'arrowup' || key === 'arrowdown'
      let next = documentEdge ? (backward ? 0 : this.text.length)
        : backward ? (this.focus ? this.text.lastIndexOf('\n', this.focus - 1) + 1 : 0) : this.text.indexOf('\n', this.focus)
      if (next < 0) next = this.text.length
      this.focus = next
      if (!event.shiftKey) this.anchor = next
      this.context.updateSelection(Math.min(this.anchor, this.focus), Math.max(this.anchor, this.focus))
      this.restoreSelection(); this.revealCaret(); this.scheduleLayout()
      return
    }
    if (key === 'backspace' || key === 'delete') {
      event.preventDefault()
      if (this.anchor !== this.focus) { this.insert(''); return }
      const [start, end] = deletionRange(this.text, this.focus, key === 'backspace', event.metaKey ? 'line' : event.altKey || event.ctrlKey ? 'word' : 'character')
      if (start === end) return
      this.remember(); this.anchor = this.focus = start
      this.apply(this.text.slice(0, start) + this.text.slice(end)); return
    }
    if (key === 'tab') {
      event.preventDefault()
      const result = indentCode(this.text, Math.min(this.anchor, this.focus), Math.max(this.anchor, this.focus), this.options.indent, event.shiftKey)
      this.remember(); this.anchor = result.selectionStart; this.focus = result.selectionEnd
      this.apply(result.value); return
    }
    if (key === 'enter') {
      event.preventDefault()
      const before = this.text.slice(0, Math.min(this.anchor, this.focus))
      const line = before.slice(before.lastIndexOf('\n') + 1)
      this.insert('\n' + (line.match(/^[ \t]*/)?.[0] ?? '') + (/[{[(]\s*$/.test(line) ? this.options.indent : ''))
    }
  }
}
