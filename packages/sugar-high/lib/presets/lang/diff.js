// @ts-check

export const keywords = new Set([])

export const lineClassName = (line) => {
  if (line.startsWith('+') && !line.startsWith('+++')) return 'sh__line--diff-add'
  if (line.startsWith('-') && !line.startsWith('---')) return 'sh__line--diff-remove'
  if (line.startsWith('@@')) return 'sh__line--diff-hunk'
  if (/^(diff --git|index |--- |\+\+\+ )/.test(line)) return 'sh__line--diff-meta'
  return undefined
}
