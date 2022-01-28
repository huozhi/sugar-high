import { tokenize, generate } from '../lib'

// console interactive API
window.tokenize = tokenize
window.generate = generate

const codeInput = document.getElementById('code')
const codeOutput = document.getElementById('output')

codeInput.addEventListener('input', () => {
  update()
})

codeInput.value = `
// hello-world.js
import { planet } from '../space'

class SuperArray extends Array {
  static core = planet

  constructor(...args) {
    super(...args)
  }

  bump() {
    return this.map(x => x + 1)
  }
}

/**
 * @param {string} name 
 * @return {void}
 */
function hello(name) {
  console.log('hello', name)
}

`.trim()

function update() {
  const code = codeInput.value?.trim() || ''
  const tokens = tokenize(code)
  const output = generate(tokens).join('')
  
  console.log(tokens)
  
  codeOutput.innerHTML = output
}

update()
