import Carousel from './carousel'
import LiveEditor from './live-editor'
import InstallBanner from './components/install-banner'
import HeroAnimation from './components/code-animation'
import Benchmarks from './components/benchmarks'
import { SyntaxThemeProvider } from './syntax-theme-context'
import { ProductNav } from './product-nav'
import { Code } from '@sugar-high/react'
import Link from 'next/link'
import './product-page.css'

const gpuExample = `import { highlight } from 'sugar-high/gpu'

const html = await highlight(source)`

export default function Page() {
  return (
    <>
      <div className="product-shell home-product-nav">
        <ProductNav
          showBrand={false}
          source="https://github.com/huozhi/sugar-high"
        />
      </div>
      <div className="container-960 header">
        <h1>
          <span className='big-title'>Sugar High</span>
        </h1>
        <p>Super lightweight syntax highlighter solution</p>
        <HeroAnimation />
      </div>

      <SyntaxThemeProvider>
        <Carousel />
        <LiveEditor languageSwitcher />
        <InstallBanner />
      </SyntaxThemeProvider>
      <section className="gpu-callout" aria-labelledby="gpu-callout-title">
        <h2 id="gpu-callout-title">WebGPU <small>experimental</small></h2>
        <p>
          Async, language-agnostic highlighting with{' '}
          <a href="https://gpu-lexer.vercel.app">gpu-lexer</a> and <code>sugar-high/gpu</code>. See the{' '}
          <Link href="/react#webgpu">React integration</Link> for components.
        </p>
        <div className="product-install gpu-callout__install">
          <code>npm install sugar-high gpu-lexer</code>
        </div>
        <div className="product-card gpu-callout__code">
          <div className="product-card__bar">
            <span className="product-card__title">gpu-highlight.js</span>
          </div>
          <Code className="product-code" title={null} lang="javascript">
            {gpuExample}
          </Code>
        </div>
      </section>
      <Benchmarks />
    </>
  )
}
