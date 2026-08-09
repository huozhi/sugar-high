// @ts-check

export const keywords = new Set([])

export const annotateLine = (line) => {
  let annotation = ''
  if (line.value.startsWith('+') && !line.value.startsWith('+++')) annotation = 'diff-add'
  else if (line.value.startsWith('-') && !line.value.startsWith('---')) annotation = 'diff-remove'
  else if (line.value.startsWith('@@')) annotation = 'diff-hunk'
  else if (/^(diff --git|index |--- |\+\+\+ )/.test(line.value)) {
    annotation = 'diff-meta'
    for (const token of line.tokens) {
      if (token.type === 'property') token.type = 'identifier'
    }
  }
  if (annotation) line.annotations.push(annotation)
}
