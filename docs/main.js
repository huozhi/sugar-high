import { highlight } from '..'

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

export const test = (str) => /\.js$/g.test(str)

async function query() {
  return await db.query()
}

function* foo(index) {
  while (index < 2) {
    yield index;
    index++;
    return void 0
  }
}

`.trim()

function update() {
  const code = codeInput.value?.trim() || ''
  const output = highlight(code)
  
  codeOutput.innerHTML = output
}

update()
