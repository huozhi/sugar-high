'use client'

import { useContext, useMemo } from 'react'
import { CopyButton } from './copy-button'
import { Code } from 'codice'
import './install-banner.css'
import Link from 'next/link'
import {
  LIVE_EDITOR_THEME_PRESETS,
  buildInstallBannerColorCss,
} from '../live-editor-presets'
import { SyntaxThemeContext } from '../syntax-theme-context'

const usageCode = `\
import { highlight } from 'sugar-high'

const html = highlight(code)`

export default function InstallBanner() {
  const syntaxThemeCtx = useContext(SyntaxThemeContext)
  const cssCode = useMemo(() => {
    const colors =
      syntaxThemeCtx?.colorPlateColors ?? LIVE_EDITOR_THEME_PRESETS[0].colors
    return buildInstallBannerColorCss(colors)
  }, [syntaxThemeCtx?.colorPlateColors])

  return (
    <div className="install-banner">
      <style>
        {`
        .install-banner [data-codice-header] {
          display: none;
        }
        `}
      </style>
      <div className="container-960">
        <div className="install-banner__head">
          <h1 className="install-banner__command">Highlight your code</h1>
          <a
            className="install-banner__repo"
            href="https://github.com/huozhi/sugar-high"
            target="_blank"
            rel="noreferrer"
          >
            repo
          </a>
        </div>
        <div className="install-banner__code">
          <Code title='install.sh'>
            {usageCode}
          </Code>
          <CopyButton codeSnippet={usageCode} />
        </div>
        <br />
        <div className="install-banner__code">
          <Code title='color.css'>
            {cssCode}
          </Code>
          <CopyButton codeSnippet={cssCode} />
        </div>

        <div className="install-banner__block">
          <h2>Usage with remark.js</h2>
          <p>
            <a href='https://remark.js.org/' target='_blank' rel='noreferrer'>Remark.js</a>{' '}
            is a powerful markdown processor, you can use the <Link href='/remark'>sugar-high remark plugin</Link> with remark.js to highlight code blocks in markdown.
          </p>
        </div>
      </div>
    </div>
  )
}
