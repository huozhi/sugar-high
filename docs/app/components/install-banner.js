import './install-banner.css'

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
            <pre>{`import { highlight } from 'sugar-high'` + '\n\n' + `const html = highlight(code)`}</pre>
          </code>
        </div>
      </div>
    </div>
  )
}
