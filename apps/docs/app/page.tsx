import Carousel from './carousel'
import LiveEditor from './live-editor'
import InstallBanner from './components/install-banner'
import HeroAnimation from './components/code-animation'
import { SyntaxThemeProvider } from './syntax-theme-context'

const REPO_URL = 'https://github.com/huozhi/sugar-high'

export default function Page() {
  return (
    <>
      <a
        className="home-repo-link"
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
      >
        GITHUB
      </a>
      <div className="container-960 header">
        <h1>
          <span className='big-title'>Sugar High</span>
        </h1>
        <p>Super lightweight syntax highlighter</p>
        <HeroAnimation />
      </div>

      <SyntaxThemeProvider>
        <LiveEditor />
        <Carousel />
        <InstallBanner />
      </SyntaxThemeProvider>
    </>
  )
}
