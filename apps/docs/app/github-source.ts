/** Max characters to load (approximate safeguard for editor + tokenize). */
export const GITHUB_SOURCE_MAX_CHARS = 750_000

const BLOB_RE =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+?)(?:\?.*)?(?:#.*)?$/i

/**
 * GitHub blob UI URL → raw file URL, e.g.
 * https://github.com/vercel/swr/blob/main/src/index/use-swr.ts
 * → https://raw.githubusercontent.com/vercel/swr/main/src/index/use-swr.ts
 */
export function githubUrlToRawUrl(input: string): string | null {
  const trimmed = input.trim()
  const blob = trimmed.match(BLOB_RE)
  if (blob) {
    const [, owner, repo, ref, filePath] = blob
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`
  }
  if (
    /^https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/.+/i.test(
      trimmed
    )
  ) {
    return trimmed.replace(/[?#].*$/, '')
  }
  return null
}

/** Repo-relative path for extension → preset (e.g. `src/index/use-swr.ts`). */
export function filePathFromRawGithubUrl(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl)
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts.length < 4) return null
    return parts.slice(3).join('/')
  } catch {
    return null
  }
}

export async function fetchGithubSource(
  input: string
): Promise<{ text: string; path: string }> {
  const rawUrl = githubUrlToRawUrl(input)
  if (!rawUrl) {
    throw new Error(
      'Use a github.com/…/blob/… link or a raw.githubusercontent.com URL.'
    )
  }
  const path = filePathFromRawGithubUrl(rawUrl)
  if (!path) {
    throw new Error('Could not parse file path from URL.')
  }

  const res = await fetch(rawUrl)
  if (!res.ok) {
    throw new Error(`Could not fetch file (HTTP ${res.status}).`)
  }
  const text = await res.text()
  if (text.length > GITHUB_SOURCE_MAX_CHARS) {
    throw new Error(
      `File is too large (max ${GITHUB_SOURCE_MAX_CHARS.toLocaleString()} characters).`
    )
  }
  return { text, path }
}
