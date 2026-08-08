'use client'

import { tokenize, generate, type LanguageName } from 'sugar-high'
import { css, HEADER_CSS } from './css'
import { lang as canonicalLang } from 'sugar-high/languages'
import { useMemo } from 'react'
import { ScopedStyle } from '../style'

/** utils */
export function getExtension(title: string | undefined) {
  return (title || '').split('.').pop() || ''
}

function generateHighlightedLines(
  codeText: string,
  highlightLines: ([number, number] | number)[],
  lineNumbers: boolean,
  title: string | undefined,
  extension: string | undefined,
  language: LanguageName | undefined
) {
  const ext = extension || getExtension(title)
  const resolvedLang = language || canonicalLang(ext)
  const options = resolvedLang ? { lang: resolvedLang } : undefined
  const childrenLines = generate(tokenize(codeText, options), options)

  // each line will contain class name 'sh__line',
  // if it's highlighted, it will contain [data-highlight]
  const highlightedLines = new Set<number>()
  if (highlightLines) {
    for (const line of highlightLines) {
      if (Array.isArray(line)) {
        // Add range of lines
        for (let i = line[0]; i <= line[1]; i++) {
          highlightedLines.add(i)
        }
      } else {
        // Add single line
        highlightedLines.add(line)
      }
    }
  }

  const lines = (
    childrenLines.map((line, index) => {
      const isHighlighted = highlightedLines.has(index + 1)
      const { tagName: Line, properties: lineProperties } = line
      const tokens = line.children
        .map((child, childIndex) => {
          const { tagName: Token, type, children, properties } = child
          return (
            <Token
              data-sh-token-type={type}
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
          key={index}
        >
          {lineNumbers ? <span key='ln' data-codice-code-line-number>{index + 1}</span> : null}
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
      data-codice-header-controls={controls}
    >
      <ScopedStyle css={HEADER_CSS} />
      {controls ? (
        <div data-codice-controls>
          <span data-codice-control />
          <span data-codice-control />
          <span data-codice-control />
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
    <pre data-codice-code-content>
      <code {...props} />
    </pre>
  ) : (
    <div {...props} data-codice-code-content  />
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
} & React.HTMLAttributes<HTMLDivElement>) {
  const lineElements = useMemo(() =>
    asMarkup
      ? code
      : generateHighlightedLines(code, highlightLines, lineNumbers, title, extension, lang),
    [code, highlightLines, lineNumbers, title, extension, lang, asMarkup]
  )

  return (
    // Add both attribute because it's both root component and child component (of editor)
    <div
      {...props}
      data-codice="code"
      data-codice-code
      data-codice-line-numbers={lineNumbers}
    >
      <ScopedStyle css={css({ fontSize, lineNumbersWidth, padding })} />
      <CodeHeader title={title} controls={controls} />
      <CodeFrame preformatted={preformatted} asMarkup={asMarkup}>
        {lineElements}
      </CodeFrame>
    </div>
  )
}
