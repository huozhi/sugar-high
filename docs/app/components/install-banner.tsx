'use client'

import { CopyButton } from './copy-button'
import './install-banner.css'

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
}
`

const usageCode = `\
import { highlight } from 'sugar-high'

const html = highlight(code)
`

export default function InstallBanner() {
  return (
    <div className="install-banner">
      <h1 className="install-banner__command">
        Highlight your code with{' '}
        <a href='https://github.com/huozhi/sugar-high' target='_blank' rel='noreferrer'>
          sugar-high
        </a>
      </h1>
      <div className="max-width-container">
        <div className="install-banner__code">
          <code>
            <pre>{usageCode}</pre>
          </code>
          <CopyButton codeSnippet={usageCode} />
        </div>
        <br />
        <div className="install-banner__code install-banner__code--dimmed">
          <code>
            <pre>{cssCode}</pre>
          </code>
          <CopyButton codeSnippet={cssCode} />
        </div>

        <div className="install-banner__block install-banner__code--dimmed">
          <h2>Usage with remark.js</h2>
          <p>
            <a href='https://remark.js.org/' target='_blank' rel='noreferrer'>Remark.js</a>{' '}
            is a powerful markdown processor, you can use the <a href='https://remark-sugar-high.vercel.app/' target='_blank' rel='noreferrer'>sugar-high remark plugin</a> with remark.js to highlight code blocks in markdown.
          </p>
        </div>
      </div>
    </div>
  )
}
