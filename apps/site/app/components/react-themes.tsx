'use client'

import { createContext, useContext, useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { Code } from '@sugar-high/react'
import * as themes from '@sugar-high/react/themes'
import type { Theme, ThemePalette } from '@sugar-high/react/themes'
import './react-themes.css'

const { taffy, ...otherThemes } = themes
const options = Object.entries({ taffy, ...otherThemes }).map(([id, theme]) => ({
  id,
  theme: theme as Theme,
  label: ({ vscode: 'VS Code', oneDarkPro: 'One Dark Pro', tokyoNight: 'Tokyo Night', nordLight: 'Nord Light', softMinimal: 'Soft Minimal' } as Record<string, string>)[id]
    ?? id[0].toUpperCase() + id.slice(1),
}))

const repeatedOptions = Array.from({ length: 5 }, () => options).flat()

const ThemeContext = createContext<{
  id: string
  palette: ThemePalette
  dark: boolean
  setId: (id: string) => void
  setDark: (dark: boolean) => void
} | null>(null)

export function useReactTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('React theme previews need ReactThemeProvider')
  return value
}

export function ReactThemeProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState('taffy')
  const [dark, setDark] = useState(false)
  const selected = options.find(option => option.id === id)!
  const palette = 'light' in selected.theme ? selected.theme[dark ? 'dark' : 'light'] : selected.theme
  const style = {
    '--demo-background': palette.background,
    '--demo-muted': palette.comment ?? palette.foreground,
    '--demo-highlight': palette.lineHighlight ?? `color-mix(in srgb, ${palette.foreground} 8%, transparent)`,
  } as CSSProperties

  return (
    <ThemeContext.Provider value={{ id, palette, dark, setId, setDark }}>
      <div className="react-theme-preview" style={style}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function ReactThemePicker({ label = 'Preview theme' }: { label?: string }) {
  const { id, dark, setId, setDark } = useReactTheme()
  const swatches = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(options.length * 2)
  const currentId = useRef(id)
  currentId.current = id
  useEffect(() => {
    const element = swatches.current!
    const index = Math.round(element.scrollLeft / 30)
    if (repeatedOptions[index]?.id !== id) {
      element.scrollLeft = (options.length * 2 + options.findIndex(option => option.id === id)) * 30
    }
  }, [id])
  useEffect(() => {
    const element = swatches.current!
    const center = () => {
      element.scrollLeft = (options.length * 2 + options.findIndex(option => option.id === currentId.current)) * 30
    }
    const observer = new ResizeObserver(center)
    observer.observe(element)
    center()
    return () => observer.disconnect()
  }, [])
  const selected = options.find(option => option.id === id)!
  return (
    <div className="react-theme-picker">
      <span className="react-theme-picker__name" aria-live="polite">{selected.label}</span>
      <div className="react-theme-picker__swatches" role="group" aria-label={label} ref={swatches}
        onScroll={event => {
          const element = event.currentTarget
          const cycle = options.length * 30
          let position = element.scrollLeft
          if (position < cycle || position >= cycle * 4) {
            position = cycle * 2 + ((position % cycle) + cycle) % cycle
            element.scrollLeft = position
          }
          const index = Math.round(position / 30)
          setActiveIndex(index)
          setId(repeatedOptions[index].id)
        }}
      >
        {repeatedOptions.map((option, index) => {
          const palette = 'light' in option.theme ? option.theme[dark ? 'dark' : 'light'] : option.theme
          const colors = [palette.keyword, palette.string, palette.class].map(color => color ?? palette.foreground)
          return (
            <button
              key={index}
              type="button"
              className="react-theme-picker__swatch"
              aria-label={option.label}
              aria-pressed={activeIndex === index}
              title={option.label}
              onClick={() => {
                swatches.current!.scrollLeft = index * 30
                setId(option.id)
              }}
              style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 50%, ${colors[2]})` }}
            />
          )
        })}
      </div>
      <button
        type="button"
        className="live-editor__appearance-toggle react-theme-picker__mode"
        aria-label={dark && 'light' in selected.theme ? 'Use light code theme' : 'Use dark code theme'}
        aria-pressed={dark && 'light' in selected.theme}
        title={'light' in selected.theme ? (dark ? 'Light theme' : 'Dark theme') : 'Light theme only'}
        disabled={!('light' in selected.theme)}
        onClick={() => setDark(!dark)}
      >
        <span aria-hidden="true" />
      </button>
    </div>
  )
}

export function ThemedCode(props: ComponentProps<typeof Code>) {
  const { palette } = useReactTheme()
  return <Code {...props} theme={palette} />
}

export function ThemeUsage() {
  const { id } = useReactTheme()
  const source = `import { Editor } from '@sugar-high/react'
import { ${id} } from '@sugar-high/react/themes'

<Editor theme={${id}} value={source} onChange={setSource} />`
  return (
    <ThemedCode className="react-style-example" lang="typescript" title="editor-theme.tsx">
      {source}
    </ThemedCode>
  )
}

export function ThemeNames() {
  return (
    <details className="react-theme-names">
      <summary>All themes</summary>
      <p>{options.map(option => option.label).join(', ')}.</p>
    </details>
  )
}
