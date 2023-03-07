import StyledJsxRegistry from './style-registry'
import './styles.css'

const imgUrl = 'https://repository-images.githubusercontent.com/453236442/1d63a6ff-aa11-422c-a36c-ca16fc102f18'

export default function Layout({ children }) {
  return (
    <html>
      <head></head>
      <body>
        <StyledJsxRegistry>
          {children}
        </StyledJsxRegistry>
      </body>
    </html>
  )
}

export const metadata = {
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
