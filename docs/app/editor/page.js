import LiveEditor from '../live-editor'

const code = ``

export default function Page() {
  return (
    <LiveEditor
      defaultCode={code}
      enableTypingAnimation={false}
    />
  )
}
