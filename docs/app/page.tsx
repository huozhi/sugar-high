import Carousel from './carousel'
import LiveEditor from './live-editor'
import InstallBanner from './components/install-banner'

export default function Page() {
  return (
    <>
      <div className="max-width-container header">
        <h1>Sugar High</h1>
        <p>Super lightweight syntax highlighter for JSX, <b>1KB</b> after minified and gizpped.</p>
      </div>

      <LiveEditor />
      <InstallBanner />
      <Carousel />
    </>
  )
}
