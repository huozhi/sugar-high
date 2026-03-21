import { GithubPlayground } from './github-playground'

const HELLO_WORLD_REACT = `export default function App() {
  return <h1>Hello, world</h1>
}
`

type EditorPageProps = {
  searchParams?: Promise<{ github?: string | string[] }>
}

export default async function Page({ searchParams }: EditorPageProps) {
  const sp = (await searchParams) ?? {}
  const raw = sp.github
  const githubFromQuery =
    typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined

  return (
    <GithubPlayground
      defaultCode={HELLO_WORLD_REACT}
      initialGithubUrl={githubFromQuery}
    />
  )
}
