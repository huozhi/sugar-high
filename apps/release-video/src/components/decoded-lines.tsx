import type { CSSProperties } from 'react'
import { random } from 'remotion'
import { highlight } from 'sugar-high'
import { DOCS_FONT_MONO_HERO } from '../docs-ui'

const RANDOM_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>+-=*/&%$#@!~?'

type Props = {
  lines: string[]
  progress: number
  frame: number
  className?: string
  /** Merged onto the code block (e.g. `--sh-keyword`). */
  style?: CSSProperties
  /** Base font size in px (scales with composition). */
  fontSize?: number
}

export function DecodedLines({
  lines,
  progress,
  frame,
  className,
  style,
  fontSize = 48,
}: Props) {
  const t = Math.min(1, Math.max(0, progress))

  return (
    <div
      className={className}
      style={{ ...codeShell, fontSize, lineHeight: 1.55, ...style }}
    >
      {lines.map((line, lineIndex) => {
        const highlighted = highlight(line)
        const len = line.length
        const revealCount = Math.floor(len * t)
        let encoded = ''
        for (let i = 0; i < len; i++) {
          const ch = line[i]
          if (ch === ' ' || i < revealCount) {
            encoded += ch
          } else {
            const r = random(`d-${frame}-${lineIndex}-${i}`)
            encoded += RANDOM_CHARS[Math.floor(r * RANDOM_CHARS.length)]
          }
        }
        const showColored = t >= 1

        return (
          <div key={lineIndex} style={lineWrap}>
            <span style={invis}>{line}</span>
            <span style={{ ...encodedLayer, color: 'var(--sh-sign)' }}>{encoded}</span>
            <span
              style={{
                ...coloredLayer,
                opacity: showColored ? 1 : 0,
              }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )
      })}
    </div>
  )
}

const codeShell: CSSProperties = {
  fontFamily: DOCS_FONT_MONO_HERO,
  textAlign: 'left',
  position: 'relative',
}

const lineWrap: CSSProperties = {
  position: 'relative',
  minHeight: '1.55em',
  whiteSpace: 'pre',
}

const invis: CSSProperties = {
  opacity: 0,
  pointerEvents: 'none',
  display: 'inline-block',
  minWidth: '100%',
}

const encodedLayer: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
}

const coloredLayer: CSSProperties = {
  width: '100%',
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'opacity 0.26s ease',
}
