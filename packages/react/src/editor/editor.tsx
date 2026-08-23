'use client'

import { useLayoutEffect, useRef, useState, forwardRef } from 'react'
import { CodeHeader, getExtension, getLineNumbersWidth } from '../code/code'
import { Code } from '../code/default'
import { fontSizeCss, ScopedStyle } from '../style'
import { css } from './css'
import type { HighlightOptions, LanguageName } from 'sugar-high'

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children' | 'defaultValue' | 'value'
>

export function indentCode(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  indent: string,
  outdent = false
) {
  if (!outdent && selectionStart === selectionEnd) {
    return {
      value: value.slice(0, selectionStart) + indent + value.slice(selectionEnd),
      selectionStart: selectionStart + indent.length,
      selectionEnd: selectionEnd + indent.length,
    }
  }

  const firstLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const lastSelectedPosition =
    selectionEnd > selectionStart && value[selectionEnd - 1] === '\n'
      ? selectionEnd - 1
      : selectionEnd
  const edits: { position: number; remove: number; insert: string }[] = []

  for (
    let position = firstLineStart;
    position <= lastSelectedPosition;
    position = value.indexOf('\n', position) + 1
  ) {
    let remove = 0
    if (outdent) {
      if (value.startsWith(indent, position)) remove = indent.length
      else {
        const whitespace = value.slice(position).match(/^[ \t]+/)?.[0] || ''
        remove = Math.min(whitespace.length, indent.length)
      }
    }
    edits.push({ position, remove, insert: outdent ? '' : indent })
    const newline = value.indexOf('\n', position)
    if (newline < 0 || newline >= lastSelectedPosition) break
    position = newline
  }

  const mapOffset = (offset: number) => {
    let mapped = offset
    for (const edit of edits) {
      if (offset < edit.position) break
      if (offset <= edit.position + edit.remove) {
        mapped = edit.position + edit.insert.length
        break
      }
      mapped += edit.insert.length - edit.remove
    }
    return mapped
  }

  let nextValue = value
  for (const edit of edits.slice().reverse()) {
    nextValue =
      nextValue.slice(0, edit.position) +
      edit.insert +
      nextValue.slice(edit.position + edit.remove)
  }

  return {
    value: nextValue,
    selectionStart: mapOffset(selectionStart),
    selectionEnd: mapOffset(selectionEnd),
  }
}

export const Editor = forwardRef(function Editor(
  {
    title,
    value,
    defaultValue = '',
    controls = true,
    lineNumbers = true,
    lineNumbersWidth,
    startingLineNumber = 1,
    wrapLongLines = true,
    extension,
    lang,
    cx,
    mark,
    padding,
    onChange,
    fontSize,
    fontFamily,
    onChangeTitle,
    textareaRef,
    textareaProps,
    indent = '  ',
    style,
    ...props
  }: {
    title?: string | null
    value?: string
    defaultValue?: string
    controls?: boolean
    lineNumbers?: boolean
    lineNumbersWidth?: string
    startingLineNumber?: number
    wrapLongLines?: boolean
    padding?: string
    extension?: string
    lang?: LanguageName
    cx?: HighlightOptions['cx']
    mark?: HighlightOptions['mark']
    onChangeTitle?: (title: string) => void
    onChange?: (code: string) => void
    textareaRef?: React.Ref<HTMLTextAreaElement>
    textareaProps?: TextareaProps
    indent?: string
  } & {
    fontSize?: string | number
    fontFamily?: string
  } & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
  ref: React.Ref<HTMLDivElement>
) {
  const [uncontrolledCode, setUncontrolledCode] = useState(defaultValue)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)
  const composingRef = useRef(false)
  const code = value ?? uncontrolledCode
  const resolvedLineNumbersWidth = getLineNumbersWidth(
    code,
    lineNumbersWidth,
    startingLineNumber
  )

  function updateCode(textContent: string) {
    if (value === undefined) setUncontrolledCode(textContent)
    onChange?.(textContent)
  }

  function onInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const textContent = event.target.value || ''
    textareaProps?.onChange?.(event)
    updateCode(textContent)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    textareaProps?.onKeyDown?.(event)
    if (
      event.defaultPrevented ||
      event.key !== 'Tab' ||
      composingRef.current ||
      event.nativeEvent.isComposing
    )
      return

    event.preventDefault()
    const result = indentCode(
      code,
      event.currentTarget.selectionStart,
      event.currentTarget.selectionEnd,
      indent,
      event.shiftKey
    )
    selectionRef.current = {
      start: result.selectionStart,
      end: result.selectionEnd,
    }
    updateCode(result.value)
  }

  useLayoutEffect(() => {
    const selection = selectionRef.current
    if (!selection || !inputRef.current) return
    inputRef.current.setSelectionRange(selection.start, selection.end)
    selectionRef.current = null
  }, [code])

  function setTextareaRef(node: HTMLTextAreaElement | null) {
    inputRef.current = node
    if (typeof textareaRef === 'function') textareaRef(node)
    else if (textareaRef) textareaRef.current = node
  }

  return (
    <div
      ref={ref}
      {...props}
      style={{
        '--sh-font-size': fontSizeCss(fontSize),
        '--sh-line-number-width': resolvedLineNumbersWidth || '2.5rem',
        '--sh-padding': padding ?? '1rem',
        '--sh-font-family': fontFamily ?? 'Consolas, Monaco, monospace',
        ...style,
      } as React.CSSProperties}
      data-codice="editor"
      data-codice-editor
      data-sh="editor"
      data-sh-editor
      // DOM attributes for selecting the stateful editor easily.
      // e.g. [data-codice-line-numbers="true"]
      data-codice-title={title || ''}
      data-codice-controls={!!controls}
      data-codice-line-numbers={!!lineNumbers}
      data-sh-line-numbers={!!lineNumbers}
    >
      <ScopedStyle css={css} href="sugar-high-react-editor" />
      {/* Display the header outside of the matched textarea and code, by default display controls */}
      <CodeHeader title={title} controls={controls} onChangeTitle={onChangeTitle} />
      <div data-codice-content data-sh-content>
        {/* hide controls component inside Code to keep content matched with textarea */}
        <Code
          title={null}
          extension={extension || getExtension(title)}
          lang={lang}
          cx={cx}
          mark={mark}
          controls={false}
          lineNumbers={lineNumbers}
          lineNumbersWidth={resolvedLineNumbersWidth}
          startingLineNumber={startingLineNumber}
          wrapLongLines={wrapLongLines}
          padding={padding}
          // Do not pass fontSize to Code in Editor.
          // It will control both the textarea and code font size.
        >
          {code}
        </Code>
        <textarea
          {...textareaProps}
          ref={setTextareaRef}
          value={code}
          wrap={wrapLongLines ? undefined : 'off'}
          onChange={onInput}
          onKeyDown={onKeyDown}
          onCompositionStart={(event) => {
            composingRef.current = true
            textareaProps?.onCompositionStart?.(event)
          }}
          onCompositionEnd={(event) => {
            composingRef.current = false
            textareaProps?.onCompositionEnd?.(event)
          }}
          onScroll={(event) => {
            textareaProps?.onScroll?.(event)
            const codeContent = event.currentTarget.previousElementSibling?.querySelector(
              '[data-sh-code-content]'
            )
            if (codeContent) codeContent.scrollLeft = event.currentTarget.scrollLeft
          }}
        />
      </div>
    </div>
  )
})
