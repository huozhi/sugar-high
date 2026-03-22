import './global.css'
import './styles.css'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Sugar High',
  authors: [{ name: '@huozhi' }],
  description: 'Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}
