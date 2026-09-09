'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { parse as parseWithGpu } from 'sugar-high/gpu'
import type { DisplayOptions, ParsedCode } from 'sugar-high/core'
import { CodeView } from './code/code'
import { createEditor, type EditorProps } from './editor/editor'
import type { Theme } from './theme'
import type { LanguageName } from 'sugar-high'

export type { EditorProps }

export type GpuStatus = 'pending' | 'ready' | 'unavailable'

export type CodeProps = {
  children: string
  /** Accepted for API compatibility; GPU highlighting is language-agnostic. */
  lang?: LanguageName
  /** Accepted for API compatibility; GPU highlighting is language-agnostic. */
  extension?: string
  preformatted?: boolean
  fontSize?: string | number
  highlightLines?: ([number, number] | number)[]
  title?: string | null
  controls?: boolean
  lineNumbers?: boolean
  lineNumbersWidth?: string
  startingLineNumber?: number
  wrapLongLines?: boolean
  padding?: string
  cx?: DisplayOptions['cx']
  mark?: DisplayOptions['mark']
  markLine?: DisplayOptions['markLine']
  theme?: Theme
} & React.HTMLAttributes<HTMLDivElement>

function plainText(code: string): ParsedCode {
  if (!code) return { value: code, lines: [] }

  return {
    value: code,
    lines: code.split(/\r\n|\r|\n/).map((value, index) => ({
      index,
      value,
      tokens: value ? [{ type: 'identifier', value }] : [],
      annotations: [],
    })),
  }
}

function useGpuParse(code: string) {
  const fallback = useMemo(() => plainText(code), [code])
  const disabledRef = useRef(false)
  const [unavailable, setUnavailable] = useState(false)
  const [resolved, setResolved] = useState<{
    code: string
    parsed: ParsedCode
  } | null>(null)

  useEffect(() => {
    if (disabledRef.current) return
    let current = true

    parseWithGpu(code).then(
      (parsed) => {
        if (current) setResolved({ code, parsed })
      },
      () => {
        if (!current) return
        disabledRef.current = true
        setUnavailable(true)
      }
    )

    return () => {
      current = false
    }
  }, [code])

  if (unavailable) return { parsed: fallback, status: 'unavailable' as const }
  if (resolved?.code === code) return { parsed: resolved.parsed, status: 'ready' as const }
  return { parsed: fallback, status: 'pending' as const }
}

/** A client-side code block highlighted asynchronously with WebGPU. */
export function Code({ children, extension: _extension, lang: _lang, ...props }: CodeProps) {
  const { parsed, status } = useGpuParse(children)

  return (
    <CodeView {...props} data-sh-gpu={status} parsed={parsed}>
      {children}
    </CodeView>
  )
}

/** A textarea-overlay editor highlighted asynchronously with WebGPU. */
export const Editor: React.ForwardRefExoticComponent<
  EditorProps & React.RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ createEditor(Code)
