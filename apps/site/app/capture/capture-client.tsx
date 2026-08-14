'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Code } from '@sugar-high/react'
import type { LanguageName } from 'sugar-high'
import { lang } from 'sugar-high/lang'
import {
  LIVE_EDITOR_THEME_PRESETS,
  plateToShVarMap,
} from '../live-editor-presets'

const fallbackCode = `export default function App() {
  return <h1>Hello, agent!</h1>
}`

type CaptureState = {
  code: string
  filename: string
  language: LanguageName
  theme: 'light' | 'dark'
  width: number
}

const initialState: CaptureState = {
  code: fallbackCode,
  filename: 'app.jsx',
  language: 'javascript',
  theme: 'light',
  width: 640,
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function readCaptureState(): CaptureState {
  const params = new URLSearchParams(window.location.hash.slice(1))
  let code = fallbackCode

  try {
    if (params.get('code')) code = decodeBase64Url(params.get('code')!)
  } catch {
    // Keep the readable example when a URL contains malformed source data.
  }

  const requestedWidth = Number(params.get('width') ?? params.get('w'))

  return {
    code,
    filename: params.get('filename') || 'app.jsx',
    language: lang(params.get('lang') || 'javascript') || 'javascript',
    theme: params.get('theme') === 'dark' ? 'dark' : 'light',
    width: Number.isFinite(requestedWidth)
      ? Math.min(1200, Math.max(320, requestedWidth))
      : 640,
  }
}

export default function CaptureClient() {
  const [capture, setCapture] = useState(initialState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const update = () => {
      setReady(false)
      setCapture(readCaptureState())
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    }

    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const preset = LIVE_EDITOR_THEME_PRESETS[0]
  const colors = capture.theme === 'dark' ? preset.colorsDark! : preset.colors
  const style = useMemo(
    () =>
      ({
        ...plateToShVarMap(colors),
        '--capture-surface': capture.theme === 'dark' ? '#242629' : '#ffffff',
        width: capture.width,
      }) as CSSProperties,
    [capture.theme, capture.width, colors]
  )

  return (
    <main className="capture-page">
      <div
        className="capture-window"
        data-sugar-high-capture={ready ? 'ready' : 'loading'}
        style={style}
      >
        <div className="capture-window__header">
          <div className="capture-window__buttons" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="capture-window__filename">{capture.filename}</span>
          <span aria-hidden="true" />
        </div>
        <Code
          className="capture-window__code"
          controls={false}
          lineNumbers={false}
          lang={capture.language}
          padding="1rem"
        >
          {capture.code}
        </Code>
      </div>
    </main>
  )
}
