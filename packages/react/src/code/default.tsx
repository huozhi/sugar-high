import { type HighlightOptions, type LanguageName } from 'sugar-high'
import { lang as canonicalLang, languages } from 'sugar-high/lang'
import {
  Code as CoreCode,
  getExtension,
  type CodeProps as CoreCodeProps,
} from './code'

export type CodeProps = Omit<CoreCodeProps, 'lang'> & {
  extension?: string
  lang?: LanguageName
  cx?: HighlightOptions['cx']
  mark?: HighlightOptions['mark']
  markLine?: HighlightOptions['markLine']
}

export function Code({ extension, lang, title, ...props }: CodeProps) {
  const resolvedLang = lang || canonicalLang(extension || getExtension(title)) || 'javascript'
  const config = languages.find(({ id }) => id === resolvedLang)?.config

  return <CoreCode {...props} title={title} lang={config} />
}
