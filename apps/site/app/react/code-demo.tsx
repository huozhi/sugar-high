'use client'

import { useState } from 'react'
import type { LanguageName } from 'sugar-high'
import { LanguageScroller } from '../components/language-scroller'
import { languages } from 'sugar-high/lang'
import { LANGUAGE_EXAMPLES } from '../language-examples'
import { ThemedCode } from '../components/react-themes'

export function CodeDemo({ examples }: { examples: Record<'javascript' | 'typescript', string> }) {
  const [language, setLanguage] = useState<LanguageName>('typescript')
  const selected = languages.find(item => item.id === language)!
  const isJavaScript = language === 'javascript' || language === 'typescript'
  const source = isJavaScript ? examples[language] : LANGUAGE_EXAMPLES[language]
  const filename = language === 'dockerfile' ? 'Dockerfile' : `example.${selected.extension}`

  return (
    <div className="react-code-demo">
      <LanguageScroller initialLanguage="typescript" onChange={setLanguage} />
      <div className="product-card">
        <div className="product-card__bar">
          <span className="product-card__title">{filename}</span>
        </div>
        <div className="react-code-scroll" key={language} tabIndex={0} role="region" aria-label={`${language} code example`}>
          <ThemedCode
            className="react-code-preview"
            lang={language}
            lineNumbers
            padding="0"
            highlightLines={isJavaScript ? [[7, 16]] : language === 'diff' ? [] : [1]}
          >
            {source}
          </ThemedCode>
        </div>
      </div>
    </div>
  )
}
