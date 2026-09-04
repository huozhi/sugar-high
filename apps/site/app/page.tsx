import Carousel from './carousel'
import LiveEditor from './live-editor'
import InstallBanner from './components/install-banner'
import HeroAnimation from './components/code-animation'
import Benchmarks from './components/benchmarks'
import { SyntaxThemeProvider } from './syntax-theme-context'
import { ProductNav } from './product-nav'
import './product-page.css'

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
      <Benchmarks />
    </>
  )
}
