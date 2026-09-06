'use client'

import { useId, useMemo, useRef, useState, type HTMLAttributes } from 'react'
import { ScopedStyle } from '../style'
import { themeStyle, type Theme } from '../theme'
import { treeItems, visibleItems, type TreeItem } from './model'

export type FileTreeProps = {
  paths: readonly string[]
  activeFile: string | null
  onActiveFileChange: (path: string) => void
  theme?: Theme
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>

const css = `[data-sh-file-tree]{display:grid;grid-template-columns:minmax(max-content,1fr);align-content:start;padding:8px;overflow:auto;font-family:var(--sh-font-family,ui-monospace,monospace);font-size:var(--sh-font-size,13px)}
[data-sh-file-tree] [role=treeitem]{display:flex;align-items:center;gap:6px;min-height:30px;padding-right:8px;border-radius:4px;cursor:pointer;white-space:nowrap;outline:none;user-select:none}
[data-sh-file-tree] [role=treeitem]:not([aria-selected=true]):hover{background:color-mix(in srgb,#888 7%,transparent)}
[data-sh-file-tree] [aria-selected=true]{background:color-mix(in srgb,#888 13%,transparent)}
[data-sh-file-tree] [role=treeitem]:focus-visible{outline:1px solid color-mix(in srgb,currentColor 45%,transparent);outline-offset:-1px}
[data-sh-file-tree] svg{width:16px;height:16px;flex:none}
[data-sh-file-tree] [data-sh-chevron]{width:10px}`

export function FileTree({ paths, activeFile, onActiveFileChange, theme, style, ...props }: FileTreeProps) {
  const items = useMemo(() => treeItems(paths), [paths])
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set())
  const [focused, setFocused] = useState<string | null>(null)
  const visible = visibleItems(items, collapsed)
  const current = visible.find(item => item.path === focused)
    ?? visible.find(item => item.path === activeFile) ?? visible[0]
  const refs = useRef(new Map<string, HTMLDivElement>())
  const search = useRef({ value: '', time: 0 })
  const id = useId()

  function focus(item: TreeItem | undefined) {
    if (!item) return
    setFocused(item.path)
    refs.current.get(item.path)?.focus()
  }
  function toggle(path: string) {
    setCollapsed(previous => {
      const next = new Set(previous)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }
  function activate(item: TreeItem) {
    if (item.directory) toggle(item.path)
    else onActiveFileChange(item.path)
  }

  return (
    <div {...props} role="tree" aria-label={props['aria-label'] ?? 'Files'}
      style={{ ...themeStyle(theme), ...style }} data-sh-file-tree>
      <ScopedStyle css={css} href="sugar-high-file-tree" />
      {visible.map((item, index) => {
        const siblings = items.filter(other => other.parent === item.parent)
        const expanded = !collapsed.has(item.path)
        return (
          <div key={item.path} id={`${id}-${items.indexOf(item)}`} role="treeitem"
            aria-label={item.name} aria-level={item.depth + 1}
            aria-setsize={siblings.length} aria-posinset={siblings.indexOf(item) + 1}
            aria-expanded={item.directory ? expanded : undefined}
            aria-selected={!item.directory && item.path === activeFile}
            tabIndex={current === item ? 0 : -1}
            style={{ paddingLeft: 6 + item.depth * 16 }}
            ref={node => { if (node) refs.current.set(item.path, node); else refs.current.delete(item.path) }}
            onFocus={() => setFocused(item.path)}
            onClick={() => { focus(item); activate(item) }}
            onKeyDown={event => {
              if (event.altKey || event.ctrlKey || event.metaKey) return
              const key = event.key
              if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(key)) event.preventDefault()
              if (key === 'ArrowDown') focus(visible[index + 1])
              else if (key === 'ArrowUp') focus(visible[index - 1])
              else if (key === 'Home') focus(visible[0])
              else if (key === 'End') focus(visible[visible.length - 1])
              else if (key === 'ArrowRight' && item.directory) {
                if (!expanded) toggle(item.path)
                else if (visible[index + 1]?.parent === item.path) focus(visible[index + 1])
              } else if (key === 'ArrowLeft') {
                if (item.directory && expanded) toggle(item.path)
                else focus(visible.find(other => other.path === item.parent))
              } else if (key === 'Enter' || key === ' ') activate(item)
              else if (key.length === 1) {
                const now = Date.now()
                const value = (now - search.current.time < 500 ? search.current.value : '') + key.toLowerCase()
                search.current = { value, time: now }
                const ordered = [...visible.slice(index + 1), ...visible.slice(0, index + 1)]
                focus(ordered.find(other => other.name.toLowerCase().startsWith(value)))
              }
            }}>
            <svg data-sh-chevron aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              {item.directory && <path d={expanded ? 'm4 6 4 4 4-4' : 'm6 4 4 4-4 4'} />}
            </svg>
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinejoin="round">
              <path d={item.directory ? 'M2 4h4l2 2h6v7H2Z' : 'M4 2h5l3 3v9H4Z M9 2v4h3'} />
            </svg>
            <span>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}
