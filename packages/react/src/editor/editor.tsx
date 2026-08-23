'use client'

import { useState, forwardRef } from 'react'
import { CodeHeader, getExtension, getLineNumbersWidth } from '../code/code'
import { Code } from '../code/default'
import { fontSizeCss, ScopedStyle } from '../style'
import { css } from './css'
import type { HighlightOptions, LanguageName } from 'sugar-high'

export const Editor = forwardRef(function Editor(
  {
    title,
    value,
    defaultValue = '',
    controls = true,
    lineNumbers = true,
    lineNumbersWidth,
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
    style,
    ...props
  }: {
    title?: string | null
    value?: string
    defaultValue?: string
    controls?: boolean
    lineNumbers?: boolean
    lineNumbersWidth?: string
    padding?: string
    extension?: string
    lang?: LanguageName
    cx?: HighlightOptions['cx']
    mark?: HighlightOptions['mark']
    onChangeTitle?: (title: string) => void
    onChange?: (code: string) => void
    textareaRef?: React.Ref<HTMLTextAreaElement>
  } & {
    fontSize?: string | number
    fontFamily?: string
  } & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
  ref: React.Ref<HTMLDivElement>
) {
  const [uncontrolledCode, setUncontrolledCode] = useState(defaultValue)
  const code = value ?? uncontrolledCode
  const resolvedLineNumbersWidth = getLineNumbersWidth(code, lineNumbersWidth)

  function onInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const textContent = event.target.value || ''
    if (value === undefined) setUncontrolledCode(textContent)
    onChange?.(textContent)
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
          padding={padding}
          // Do not pass fontSize to Code in Editor.
          // It will control both the textarea and code font size.
        >
          {code}
        </Code>
        <textarea ref={textareaRef} value={code} onChange={onInput} />
      </div>
    </div>
  )
})
