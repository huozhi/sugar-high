import {
  generate,
  parse,
  type DisplayOptions,
  type GeneratedLine,
  type GeneratedToken,
  type ParseOptions,
} from 'sugar-high/core'

export type HighlightToken = Omit<GeneratedToken, 'children'> & {
  value: string
}

export type HighlightLine = Omit<GeneratedLine, 'children'> & {
  tokens: HighlightToken[]
}

export type HighlightResult = {
  lines: HighlightLine[]
}

export type HighlightProps = DisplayOptions & {
  code: string
  /** Language configuration imported from `sugar-high/lang/<language>`. */
  lang?: ParseOptions
  render: (result: HighlightResult) => React.ReactNode
}

/** Parse and generate highlighted tokens while leaving all React markup to the consumer. */
export function Highlight({ code, lang, cx, mark, markLine, render }: HighlightProps) {
  const lines = generate(parse(code, lang), { cx, mark, markLine }).map(
    ({ children: generatedTokens, ...line }): HighlightLine => ({
      ...line,
      tokens: generatedTokens.map(({ children: text, ...token }) => ({
        ...token,
        value: text[0].value,
      })),
    })
  )

  return render({ lines })
}
