// @ts-check

export const keywords = new Set([])

export const markLine = (line) => {
  let className = ''
  if (line.value.startsWith('+') && !line.value.startsWith('+++')) className = 'sh__line--diff-add'
  else if (line.value.startsWith('-') && !line.value.startsWith('---')) className = 'sh__line--diff-remove'
  else if (line.value.startsWith('@@')) className = 'sh__line--diff-hunk'
  else if (/^(diff --git|index |--- |\+\+\+ )/.test(line.value)) className = 'sh__line--diff-meta'
  if (className) line.className += ` ${className}`
}
