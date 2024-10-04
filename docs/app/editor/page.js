import LiveEditor from '../live-editor'

const code = `\
<svg>
  <path 
    d='M12'/></svg>
`

export default function Page() {
  return (
    <LiveEditor
      defaultCode={code}
      enableTypingAnimation={false}
    />
  )
}
