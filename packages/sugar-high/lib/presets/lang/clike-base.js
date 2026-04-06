// @ts-check
export const onCommentStart = (currentChar, nextChar) => {
  const pair = currentChar + nextChar
  if (pair === '//') return 1
  if (pair === '/*') return 1
  return 0
}

export const onCommentEnd = (prevChar, currChar) => {
  if (currChar === '\n') return 1
  return prevChar + currChar === '*/' ? 1 : 0
}
