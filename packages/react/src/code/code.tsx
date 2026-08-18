'use client'

import { type HighlightOptions, type LanguageName } from 'sugar-high'
import { parse, generate } from 'sugar-high/core'
import { css, HEADER_CSS } from './css'
import { lang as canonicalLang, languages } from 'sugar-high/lang'
import { useMemo } from 'react'
import { fontSizeCss, ScopedStyle } from '../style'

/** utils */
export function getExtension(title: string | undefined) {
  return (title || '').split('.').pop() || ''
}

export function getLineNumbersWidth(code: string, width?: string) {
  if (width) return width
  let lines = 1
  for (let i = 0; i < code.length; i++) {
    if (code.charCodeAt(i) === 10) lines++
  }
  const digits = String(lines).length
  return digits > 3 ? `calc(${digits}ch + 14px)` : undefined
}

function generateHighlightedLines(
  parsed: ReturnType<typeof parse>,
  highlightLines: ([number, number] | number)[],
  lineNumbers: boolean,
  cx: HighlightOptions['cx'],
  mark: HighlightOptions['mark'],
  markLine: HighlightOptions['markLine']
) {
  const childrenLines = generate(parsed, { cx, mark, markLine })

  // each line will contain class name 'sh__line',
  // if it's highlighted, it will contain [data-highlight]
  const highlightedLines = highlightLines?.length ? new Set<number>() : undefined
  if (highlightLines) {
    for (const line of highlightLines) {
      if (Array.isArray(line)) {
        // Add range of lines
        const start = Math.max(1, line[0])
        const end = Math.min(childrenLines.length, line[1])
        for (let i = start; i <= end; i++) {
          highlightedLines?.add(i)
        }
      } else {
        // Add single line
        highlightedLines?.add(line)
      }
    }
  }

  const lines = (
    childrenLines.map((line, index) => {
      const isHighlighted = highlightedLines?.has(index + 1)
      const { tagName: Line, properties: lineProperties } = line
      const tokens = line.children
        .map((child, childIndex) => {
          const { tagName: Token, tokenType, children, properties } = child
          return (
            <Token
              data-sh-token-type={tokenType}
              key={childIndex}
              {...properties}
            >
              {(children[0].value)}
            </Token>
          )
        })


      return (
        <Line
          {...lineProperties}
          // Add data-highlight attribute if line is highlighted
          {...(isHighlighted ? {'data-highlight': true} : {})}
          data-codice-code-line
          data-sh-code-line
          key={index}
        >
          {lineNumbers ? <span key='ln' data-codice-code-line-number data-sh-code-line-number>{index + 1}</span> : null}
          {tokens}
        </Line>
      )
    })
  )
  return lines
}

function TitleInput({
  title,
  onChange,
}: {
  title?: string
  onChange?: (title: string) => void
}) {
  return (
    <input
      data-codice-title
      data-sh-title
      value={title}
      readOnly={!onChange}
      {...(onChange && {
        onChange: (e) => {
          onChange(e.target.value)
        }
      })}
    />
  )
}

export function CodeHeader({
  title,
  controls = false,
  onChangeTitle,
}: {
  title?: string | null
  controls: boolean
  onChangeTitle?: (title: string) => void
}) {
  if (!title && !controls) return null
  return (
    <div
      data-codice-header
      data-sh-header
      data-codice-header-controls={controls}
      data-sh-header-controls={controls}
    >
      <ScopedStyle css={HEADER_CSS} href="sugar-high-react-header" />
      {controls ? (
        <div data-codice-controls data-sh-controls>
          <span data-codice-control data-sh-control />
          <span data-codice-control data-sh-control />
          <span data-codice-control data-sh-control />
        </div>
      ) : null}
      {title ? <TitleInput title={title} onChange={onChangeTitle} /> : null}
    </div>
  )
}

function CodeFrame({
  children,
  preformatted,
  asMarkup,
}: {
  children: React.ReactNode
  preformatted: boolean
  asMarkup: boolean
}) {
  const props = asMarkup ? { dangerouslySetInnerHTML: { __html: children } } : { children }
  return preformatted ? (
    <pre data-codice-code-content data-sh-code-content>
      <code {...props} />
    </pre>
  ) : (
    <div {...props} data-codice-code-content data-sh-code-content />
  )
}

export function Code({
  children: code,
  title,
  controls,
  fontSize,
  highlightLines,
  preformatted = true,
  lineNumbers = false,
  lineNumbersWidth,
  padding,
  asMarkup = false,
  extension,
  lang,
  cx,
  mark,
  markLine,
  style,
  ...props
}: {
  children: string
  /** Whether to use a preformatted block <pre><code> */
  preformatted?: boolean
  fontSize?: string | number
  highlightLines?: ([number, number] | number)[]
  title?: string
  controls?: boolean
  lineNumbers?: boolean
  lineNumbersWidth?: string
  padding?: string
  asMarkup?: boolean
  extension?: string
  lang?: LanguageName
  cx?: HighlightOptions['cx']
  mark?: HighlightOptions['mark']
  markLine?: HighlightOptions['markLine']
} & React.HTMLAttributes<HTMLDivElement>) {
  const resolvedLineNumbersWidth = getLineNumbersWidth(code, lineNumbersWidth)
  const config = useMemo(() => {
    const resolvedLang = lang || canonicalLang(extension || getExtension(title)) || 'javascript'
    return languages.find(({ id }) => id === resolvedLang)?.config
  }, [extension, lang, title])
  const parsed = useMemo(() => asMarkup ? null : parse(code, config), [asMarkup, code, config])
  const lineElements = useMemo(() =>
    asMarkup
      ? code
      : generateHighlightedLines(parsed!, highlightLines, lineNumbers, cx, mark, markLine),
    [code, highlightLines, lineNumbers, cx, mark, markLine, asMarkup, parsed]
  )

  return (
    // Add both attribute because it's both root component and child component (of editor)
    <div
      {...props}
      style={{
        '--sh-font-size': fontSizeCss(fontSize),
        '--sh-line-number-width': resolvedLineNumbersWidth || '2.5rem',
        '--sh-padding': padding ?? '1rem',
        ...style,
      } as React.CSSProperties}
      data-codice="code"
      data-codice-code
      data-sh="code"
      data-sh-code
      data-codice-line-numbers={lineNumbers}
      data-sh-line-numbers={lineNumbers}
    >
      <ScopedStyle css={css} href="sugar-high-react-code" />
      <CodeHeader title={title} controls={controls} />
      <CodeFrame preformatted={preformatted} asMarkup={asMarkup}>
        {lineElements}
      </CodeFrame>
    </div>
  )
}
