// @ts-check
export const keywords = new Set([
  // css keywords like @media, @import, @keyframes, etc.
  '@media', '@import', '@keyframes', '@font-face', '@supports', '@page', '@counter-style',
  '@font-feature-values', '@viewport', '@counter-style', '@font-feature-values', '@document',
])

export const onCommentStart = (currentChar, nextChar) => {
  return '/*' === (currentChar + nextChar) ? 1 : 0
}

export const onCommentEnd = (prevChar, currChar) => {
  return '*/' === (prevChar + currChar) ? 1 : 0
}
