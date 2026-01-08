'use client'

import { useState, useEffect, useMemo } from 'react'
import { highlight } from 'sugar-high'
import './code-animation.css'

interface CodeAnimationProps {
  codeLines: string[]
  isExpanded: boolean
  isCollapsing: boolean
  isLive: boolean
  onReady?: () => void
}

const RANDOM_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>+-=*/&%$#@!~?'

function encodeLine(line: string): string {
  return line
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]))
    .join('')
}

function CodeAnimation({
  codeLines,
  isExpanded,
  isCollapsing,
  isLive,
  onReady,
}: CodeAnimationProps) {
  // Initialize without using Math.random() during render to satisfy
  // https://nextjs.org/docs/messages/next-prerender-random-client
  const [displayLines, setDisplayLines] = useState<string[]>(codeLines)
  const [hasDecoded, setHasDecoded] = useState(false)

  // Cache highlighted code for all lines
  const highlightedLines = useMemo(() => {
    return codeLines.map((line) => highlight(line))
  }, [codeLines])

  useEffect(() => {
    if (!isExpanded || isCollapsing) {
      // Reset when fully collapsed
      setDisplayLines([])
      setHasDecoded(false)
      return
    }

    if (!isLive) {
      // If not live, show encoded lines initially
      setDisplayLines(codeLines.map((line) => encodeLine(line)))
      setHasDecoded(false)
    }
  }, [isExpanded, isCollapsing, isLive, codeLines])

  // Decode animation: random characters gradually reveal real code
  useEffect(() => {
    // Start animation if we are expanded, not collapsing, live, and haven't finished decoding yet
    if (!isExpanded || isCollapsing || !isLive || hasDecoded) return

    let frameId: number
    const start = performance.now()
    const duration = 700 // ms

    const step = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)

      setDisplayLines(
        codeLines.map((line) => {
          const len = line.length
          const revealCount = Math.floor(len * t)
          let result = ''

          for (let i = 0; i < len; i++) {
            const ch = line[i]
            if (ch === ' ' || i < revealCount) {
              result += ch
            } else {
              result += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]
            }
          }

          return result
        })
      )

      if (t < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setHasDecoded(true)
        onReady?.()
      }
    }

    frameId = requestAnimationFrame(step)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [isExpanded, isCollapsing, isLive, hasDecoded, codeLines, onReady])

  // Render code with syntax highlighting using sugar-high
  const renderCodeLine = (line: string, lineIndex: number) => {
    const highlightedCode = highlightedLines[lineIndex]
    const encodedText = displayLines[lineIndex] !== undefined ? displayLines[lineIndex] : line

    return (
      <div key={lineIndex} className="code-line">
        {/* Invisible original text to reserve layout space */}
        <span className="code-line-invisible">{line}</span>
        {/* Encoded gray text (absolute overlay) */}
        <span className="code-line-encoded">{encodedText}</span>
        {/* Colored code fades in on decode (absolute overlay) */}
        <span
          className={`code-line-colored ${
            hasDecoded ? 'code-line-colored-visible' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    )
  }

  return (
    <div
      className={`code-block code-block-colored ${
        isLive ? 'code-block-live' : ''
      }`}
    >
      {codeLines.map((line, index) => renderCodeLine(line, index))}
    </div>
  )
}

export default function HeroAnimation() {
  const [isLive, setIsLive] = useState(false)
  const codeLines = [
    '/* super tiny syntax highlighter */',
    "import { highlight } from 'sugar-high'",
    "const code = highlight('const text = 1')",
  ]

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setIsLive(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="code-animation-container">
      <CodeAnimation
        codeLines={codeLines}
        isExpanded={true}
        isCollapsing={false}
        isLive={isLive}
      />
    </div>
  )
}
