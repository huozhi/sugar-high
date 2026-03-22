'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import LiveEditor from '../live-editor'
import { fetchGithubSource } from '../github-source'
import { presetHighlightExtensionFromPath } from '../syntax-highlight-presets'

/** Notable OSS files for one-click preview (TS/TSX, CSS, Python, Rust). */
const GITHUB_QUICK_EXAMPLES = [
  {
    label: 'swr',
    file: 'use-swr.ts',
    url: 'https://github.com/vercel/swr/blob/main/src/index/use-swr.ts',
  },
  {
    label: 'zustand',
    file: 'vanilla.ts',
    url: 'https://github.com/pmndrs/zustand/blob/main/src/vanilla.ts',
  },
  {
    label: 'normalize',
    file: 'normalize.css',
    url: 'https://github.com/necolas/normalize.css/blob/master/normalize.css',
  },
  {
    label: 'bytes',
    file: 'lib.rs',
    url: 'https://github.com/tokio-rs/bytes/blob/master/src/lib.rs',
  },
  {
    label: 'requests',
    file: '__init__.py',
    url: 'https://github.com/psf/requests/blob/main/src/requests/__init__.py',
  },
  {
    label: 'anyhow',
    file: 'lib.rs',
    url: 'https://github.com/dtolnay/anyhow/blob/master/src/lib.rs',
  },
] as const

const ISSUES_URL = 'https://github.com/huozhi/sugar-high/issues'

/** Syncs `?github=` with the browser and loads from the URL when it changes (shareable links). */
function GithubPreviewUrlSync({
  registerSync,
  lastLoadedRef,
  loadRef,
  setGithubUrlInput,
}: {
  registerSync: (fn: ((url: string) => void) | null) => void
  lastLoadedRef: React.MutableRefObject<string | null>
  loadRef: React.MutableRefObject<(url: string) => Promise<void>>
  setGithubUrlInput: React.Dispatch<React.SetStateAction<string>>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const githubParam = searchParams.get('github')?.trim() || ''

  useEffect(() => {
    const sync = (url: string) => {
      const q = new URLSearchParams()
      q.set('github', url)
      router.replace(`${pathname}?${q.toString()}`, { scroll: false })
    }
    registerSync(sync)
    return () => registerSync(null)
  }, [pathname, router, registerSync])

  useEffect(() => {
    if (!githubParam) {
      lastLoadedRef.current = null
      return
    }
    if (lastLoadedRef.current === githubParam) return
    setGithubUrlInput(githubParam)
    void loadRef.current(githubParam)
  }, [githubParam, lastLoadedRef, loadRef, setGithubUrlInput])

  return null
}

type GithubPlaygroundProps = {
  defaultCode: string
  initialGithubUrl?: string
}

export function GithubPlayground({
  defaultCode,
  initialGithubUrl = '',
}: GithubPlaygroundProps) {
  const [code, setCode] = useState(defaultCode)
  const [githubUrlInput, setGithubUrlInput] = useState(
    () => initialGithubUrl?.trim() || ''
  )
  const [githubLoadError, setGithubLoadError] = useState<string | null>(null)
  const [githubLoading, setGithubLoading] = useState(false)
  const [fileExtension, setFileExtension] = useState<string | undefined>(
    undefined
  )

  const lastGithubLoadedUrlRef = useRef<string | null>(null)
  const githubUrlSyncFnRef = useRef<((url: string) => void) | null>(null)
  const registerGithubUrlSync = useCallback(
    (fn: ((url: string) => void) | null) => {
      githubUrlSyncFnRef.current = fn
    },
    []
  )

  const loadFromGithub = useCallback(async (url: string) => {
    const trimmed = url.trim()
    if (!trimmed) {
      setGithubLoadError('Paste a GitHub file URL.')
      return
    }
    setGithubLoadError(null)
    setGithubLoading(true)
    try {
      const { text, path } = await fetchGithubSource(trimmed)
      setCode(text)
      setFileExtension(presetHighlightExtensionFromPath(path))
      lastGithubLoadedUrlRef.current = trimmed
      githubUrlSyncFnRef.current?.(trimmed)
    } catch (e) {
      setGithubLoadError(e instanceof Error ? e.message : 'Failed to load.')
    } finally {
      setGithubLoading(false)
    }
  }, [])

  const loadFromGithubRef = useRef(loadFromGithub)
  loadFromGithubRef.current = loadFromGithub

  return (
    <>
      <div className="live-editor-section live-editor-section--github-preview">
        <div className="p-page-issue-link-wrap">
          <a
            className="p-page-issue-link"
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub issues
          </a>
        </div>
        <Suspense fallback={null}>
          <GithubPreviewUrlSync
            registerSync={registerGithubUrlSync}
            lastLoadedRef={lastGithubLoadedUrlRef}
            loadRef={loadFromGithubRef}
            setGithubUrlInput={setGithubUrlInput}
          />
        </Suspense>
        <div className="container-720 github-source-loader github-source-loader--minimal">
          <div className="github-source-loader__row">
            <div className="github-source-loader__input-wrap">
              <input
                id="github-file-url"
                type="url"
                className="github-source-loader__input github-source-loader__input--underline"
                placeholder="https://github.com/…/blob/…/file"
                value={githubUrlInput}
                disabled={githubLoading}
                onChange={(e) => setGithubUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loadFromGithub(githubUrlInput)
                }}
              />
            </div>
            <button
              type="button"
              className="github-source-loader__button github-source-loader__button--minimal"
              disabled={githubLoading}
              onClick={() => loadFromGithub(githubUrlInput)}
            >
              {githubLoading ? '…' : 'Load'}
            </button>
          </div>
          {githubLoadError && (
            <p className="github-source-loader__error" role="alert">
              {githubLoadError}
            </p>
          )}
          <div
            className="github-source-loader__hint github-source-loader__hint--compact github-source-loader__examples"
            role="group"
            aria-labelledby="github-quick-examples-heading"
          >
            <p
              id="github-quick-examples-heading"
              className="github-source-loader__examples-label"
            >
              Examples
            </p>
            <ul className="github-source-loader__examples-list">
              {GITHUB_QUICK_EXAMPLES.map((ex) => (
                <li key={ex.url} className="github-source-loader__examples-item">
                  <button
                    type="button"
                    className="github-source-loader__example-load"
                    disabled={githubLoading}
                    aria-label={`Load example: ${ex.url}`}
                    onClick={() => {
                      setGithubUrlInput(ex.url)
                      void loadFromGithub(ex.url)
                    }}
                  >
                    {ex.label}
                    {' - '}
                    <span className="github-source-loader__example-file">
                      {ex.file}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <LiveEditor
        className="live-editor-section--github-preview"
        value={code}
        onChange={setCode}
        defaultCode={defaultCode}
        persistEditorDraft={false}
        colorPlate={false}
        enableTypingAnimation={false}
        fileExtension={fileExtension}
        onFileExtensionChange={setFileExtension}
      />
    </>
  )
}
