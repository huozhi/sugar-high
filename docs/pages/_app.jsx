import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>sugar high</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:image" content="https://user-images.githubusercontent.com/4800338/157557111-76c6592c-61a0-4325-bebc-cc5c27f3053b.png" />
        <meta property="og:title" content="Sugar High" />
        <meta property="og:description" content="Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped" />
        <meta name="twitter:image:src" content="https://user-images.githubusercontent.com/4800338/157557111-76c6592c-61a0-4325-bebc-cc5c27f3053b.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}