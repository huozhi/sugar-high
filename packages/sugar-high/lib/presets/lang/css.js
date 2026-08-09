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

export const onLiteral = (curr, index, code) => {
  if (curr !== '#') return 0
  return code.slice(index).match(/^#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\w-])/i)?.[0].length || 0
}
