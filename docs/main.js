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

  constructor(...args) { super(...args); }

  bump() {
    return this.map(
      x => x == null ? x + 1 : 0
    )
  }
}

export const test = (str) => /^\\/[0-5]\\/$/g.test(str)

async function query() {
  return await db.query()
}

function* foo(index) {
  do {
    yield index;
    index++;
    return void 0
  } while (index < 2)
}

const nums = [
  undefined
  1000_000_000, 
  .14, 1.2e3, 0x1f, 1n, 
].filter(Boolean)


/**
 * @param {string} name 
 * @return {void}
 */
function foo(name, callback) {
  for (let i = 0; i < name.length; i++) {
    callback(name[i])
  }
}
`.trim()

function update() {
  const code = codeInput.value?.trim() || ''
  const output = highlight(code)
  
  codeOutput.innerHTML = output
}

update()
