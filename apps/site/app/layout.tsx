import './global.css'
import './styles.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

const GITHUB_REPO_URL = 'https://github.com/huozhi/sugar-high'
const X_URL = 'https://x.com/huozhi'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <footer className="site-footer">
          <div className="container-960 site-footer__inner">
            <a
              className="site-footer__link"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              github
            </a>
            <span className="site-footer__sep" aria-hidden="true">
              ·
            </span>
            <a
              className="site-footer__link"
              href={X_URL}
              target="_blank"
              rel="noreferrer"
            >
              x.com — @huozhi
            </a>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Sugar High',
  authors: [{ name: '@huozhi' }],
  description: 'Super lightweight syntax highlighter solution',
  icons: {
    icon: [
      { url: '/icon-light.svg', type: 'image/svg+xml' },
      {
        url: '/icon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}
