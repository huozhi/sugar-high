import { SugarHigh } from '..'

function getTypeName(token) {
  return SugarHigh.TokenTypes[token[0]]
}

function getTokenValues(tokens) {
  return tokens.map((tk) => tk[1])
}

function mergeSpaces(str) {
  return str.trim().replace(/^[\s]{2,}$/g, ' ')
}

function filterSpaces(arr) {
  return arr
    .map(t => mergeSpaces(t))
    .filter(Boolean)
}

function extractTokenValues(tokens) {
  return filterSpaces(getTokenValues(tokens))
}

function getTokenArray(tokens) {
  return tokens.map((tk) => [tk[1], getTypeName(tk)]);
}

function extractTokenArray(tokens) {
  return tokens
    .map((tk) => [mergeSpaces(tk[1]), getTypeName(tk)])
    .filter(([_, type]) => type !== 'space' && type !== 'break')
}

// Generate the string representation of the tokens
function getTokensAsString(tokens) {
  const extracted = extractTokenArray(tokens)
  return extracted.map(([value, type]) => `${value} => ${type}`)
}

export {
  extractTokenArray,
  extractTokenValues,
  getTokenValues,
  getTokensAsString,
  getTokenArray,
}