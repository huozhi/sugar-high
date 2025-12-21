import './global.css'
import './styles.css'

const imgUrl = 'https://repository-images.githubusercontent.com/453236442/aa0db684-bad3-4cd3-a420-f4e53b8c6757'

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
  metadataBase: new URL('https://sugar-high.vercel.app'),
  title: 'Sugar High',
  authors: [{ name: '@huozhi' }],
  description: 'Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped',
  twitter: {
    card: 'summary_large_image',
    images: imgUrl,
    title: 'Sugar High',
    description: 'Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped',
  },
  openGraph: {
    images: imgUrl,
    title: 'Sugar High',
    description: 'Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}
