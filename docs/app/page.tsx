import Carousel from './carousel'
import LiveEditor from './live-editor'
import InstallBanner from './components/install-banner'

export default function Page() {
  return (
    <>
      <div className="max-width-container header">
        <h1>
          <span className='hover-shadow'>Sugar High</span>
        </h1>
        <p>Super lightweight syntax highlighter</p>
      </div>

      <LiveEditor />
      <InstallBanner />
      <Carousel />
    </>
  )
}
