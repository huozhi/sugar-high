import Carousel from './carousel'
import LiveEditor from './live-editor'
import InstallBanner from './components/install-banner'
import HeroAnimation from './components/code-animation'

export default function Page() {
  return (
    <>
      <div className="container-960 header">
        <h1>
          <span className='big-title'>Sugar High</span>
        </h1>
        <p>Super lightweight syntax highlighter</p>
        <HeroAnimation />
      </div>

      <LiveEditor />
      <InstallBanner />
      <Carousel />
    </>
  )
}
