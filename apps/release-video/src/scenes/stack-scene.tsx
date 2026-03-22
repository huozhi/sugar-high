import type { CSSProperties } from 'react'
import { highlight } from 'sugar-high'
import { css, python, rust } from 'sugar-high/presets'
import { STACK_FRAMES } from '../constants'
import {
  codeCardShell,
  codeSurface,
  codeTitleBarBase,
  preHighlighted,
} from '../code-block-styles'
import { compactHighlightedHtml } from '../compact-highlight-html'
import { DOCS_FONT_SANS, DOCS_TEXT } from '../docs-ui'
import { STYLISH_LIGHT } from '../plates'
import { plateToShVars, SH_TOKEN_INLINE_CSS } from '../plate-css'
import { LIB_RS, MAIN_PY, THEME_CSS } from '../stack-examples'

const EXAMPLES: {
  title: string
  code: string
  preset?: Parameters<typeof highlight>[1]
}[] = [
  { title: 'lib.rs', code: LIB_RS, preset: rust },
  { title: 'main.py', code: MAIN_PY, preset: python },
  { title: 'theme.css', code: THEME_CSS, preset: css },
]

const N = EXAMPLES.length

type Props = {
  relFrame: number
}

export function StackScene({ relFrame }: Props) {
  const segment = STACK_FRAMES / N
  const activeIndex = Math.min(N - 1, Math.floor(relFrame / segment))

  const baseVars = plateToShVars(STYLISH_LIGHT) as CSSProperties
  const surface = codeSurface()

  return (
    <div style={root}>
      <style>{SH_TOKEN_INLINE_CSS}</style>
      <h2 style={sectionTitle}>Multi-language support</h2>
      <div style={stage}>
        {EXAMPLES.map((ex, i) => {
          const isActive = activeIndex === i
          const raw = highlight(ex.code, ex.preset)
          const html = compactHighlightedHtml(raw)

          return (
            <div
              key={ex.title}
              style={{
                ...cardSlot,
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              aria-hidden={!isActive}
            >
              <div style={{ ...codeCardShell, ...surface }}>
                <div style={{ ...codeTitleBarBase, ...surface }}>{ex.title}</div>
                <pre
                  style={{
                    ...preHighlighted,
                    ...baseVars,
                    ...surface,
                    maxHeight: 680,
                  }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const root: CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '100%',
  boxSizing: 'border-box',
  padding: '44px 48px 48px',
  background: 'transparent',
  fontFamily: DOCS_FONT_SANS,
  display: 'flex',
  flexDirection: 'column',
}

const sectionTitle: CSSProperties = {
  position: 'absolute',
  top: 40,
  left: 48,
  margin: 0,
  fontSize: 44,
  fontWeight: 700,
  color: DOCS_TEXT,
  letterSpacing: '-0.02em',
  zIndex: 3,
}

const stage: CSSProperties = {
  position: 'relative',
  width: '100%',
  flex: 1,
  minHeight: 620,
  marginTop: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const cardSlot: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '47%',
  transform: 'translate(-50%, -50%)',
  width: 'min(1200px, 94%)',
  maxWidth: 1200,
}
