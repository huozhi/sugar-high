'use client'

import { forwardRef, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { parse } from 'sugar-high/gpu'
import type { ParsedCode } from 'sugar-high/core'
import { CodeView } from './code/code'
import type { CodeProps as DefaultCodeProps } from './code'
import { createEditor, type EditorProps } from './editor/editor'
import { ContextEditor } from './editor/gpu-editor'
import { supportsEditContext } from './editor/edit-context'

export type { EditorProps }

export type CodeProps = Omit<DefaultCodeProps, 'asMarkup'>

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
  const [unavailable, setUnavailable] = useState(false)
  const [resolved, setResolved] = useState<{
    code: string
    parsed: ParsedCode
  } | null>(null)

  useEffect(() => {
    if (unavailable) return
    let current = true

    parse(code).then(
      (parsed) => {
        if (current) setResolved({ code, parsed })
      },
      () => {
        if (!current) return
        setUnavailable(true)
      }
    )

    return () => {
      current = false
    }
  }, [code, unavailable])

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

const TextareaEditor = /* @__PURE__ */ createEditor(Code)

const subscribe = () => () => {}
const serverSupport = () => false

/** An EditContext editor with persistent GPU highlight ranges and a textarea fallback. */
export const Editor: React.ForwardRefExoticComponent<EditorProps & React.RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, EditorProps>(function Editor(props, ref) {
  const supported = useSyncExternalStore(subscribe, supportsEditContext, serverSupport)
  // Preserve textarea refs/events and token DOM hooks rather than silently ignoring them.
  const compatible = !props.textareaRef && !props.textareaProps && !props.cx && !props.mark
  return supported && compatible
    ? <ContextEditor {...props} ref={ref} />
    : <TextareaEditor {...props} ref={ref} />
})
