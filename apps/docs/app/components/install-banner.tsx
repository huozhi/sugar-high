'use client'

import { CopyButton } from './copy-button'
import { Code } from 'codice'
import './install-banner.css'
import Link from 'next/link'

const cssCode = `\
/* styles.css */
:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-property: #0550ae;
  --sh-entity: #249a97;
  --sh-jsxliterals: #6266d1;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
}`

const usageCode = `\
import { highlight } from 'sugar-high'

const html = highlight(code)`

export default function InstallBanner() {
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
