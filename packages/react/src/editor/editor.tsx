'use client'

import { useEffect, useState, forwardRef } from 'react'
import { CodeHeader, getExtension, getLineNumbersWidth, Code } from '../code/code'
import { ScopedStyle } from '../style'
import { css } from './css'
import type { HighlightOptions, LanguageName } from 'sugar-high'

export const Editor = forwardRef(function Editor(
  {
    title,
    value = '',
    controls = true,
    lineNumbers = true,
    lineNumbersWidth,
    extension,
    lang,
    cx,
    mark,
    padding,
    onChange = () => {},
    fontSize,
    fontFamily,
    onChangeTitle = () => {},
    textareaRef,
    ...props
  }: {
    title?: string | null
    value?: string
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
  const [code, setCode] = useState(value)
  const resolvedLineNumbersWidth = getLineNumbersWidth(code, lineNumbersWidth)

  function update(textContent: string) {
    setCode(textContent)
    onChange(textContent)
  }

  useEffect(() => {
    if (value !== code) {
      update(value)
    }
  }, [value, code])

  function onInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const textContent = event.target.value || ''
    update(textContent)
  }

  return (
    <div
      ref={ref}
      {...props}
      data-codice="editor"
      data-codice-editor
      // DOM attributes for selecting the stateful editor easily.
      // e.g. [data-codice-line-numbers="true"]
      data-codice-title={title || ''}
      data-codice-controls={!!controls}
      data-codice-line-numbers={!!lineNumbers}
    >
      <ScopedStyle css={css({ fontSize, padding, lineNumbersWidth: resolvedLineNumbersWidth, fontFamily })} />
      {/* Display the header outside of the matched textarea and code, by default display controls */}
      <CodeHeader title={title} controls={controls} onChangeTitle={onChangeTitle} />
      <div data-codice-content>
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
