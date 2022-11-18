import StyledJsxRegistry from './style-registry'

const imgUrl = 'https://repository-images.githubusercontent.com/453236442/1d63a6ff-aa11-422c-a36c-ca16fc102f18'

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>sugar high</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Sugar High" />
        <meta property="og:description" content="Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped" />
        <meta property="og:image" content={imgUrl} />
        <meta name="twitter:image" content={imgUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>
        <StyledJsxRegistry>
          {children}
        </StyledJsxRegistry>
      </body>
    </html>
  )
}
