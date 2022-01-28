import { tokenize, generate } from '../lib'

window.tokenize = tokenize
window.generate = generate

const codeInput = document.getElementById('code')
const codeOutput = document.getElementById('output')

codeInput.addEventListener('input', () => {
  update()
})

codeInput.value = `
import world from '../space'

function hello() {
  console.log('hello', world)
}

class SuperArray extends Array {
  constructor(...args) {
    super(...args)
  }

  bump() {
    return this.map(x => x + 1)
  }
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
