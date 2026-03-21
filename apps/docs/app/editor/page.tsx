import LiveEditor from '../live-editor'

type EditorPageProps = {
  searchParams?: Promise<{ github?: string | string[] }>
}

export default async function Page({ searchParams }: EditorPageProps) {
  const sp = (await searchParams) ?? {}
  const raw = sp.github
  const githubFromQuery =
    typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined

  return (
    <LiveEditor
      defaultCode=""
      enableTypingAnimation={false}
      showGithubLoader
      initialGithubUrl={githubFromQuery}
      persistEditorDraft={false}
    />
  )
}
