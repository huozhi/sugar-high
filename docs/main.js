import { highlight } from '..'

const codeInput = document.getElementById('code')
const codeOutput = document.getElementById('output')

const jsxExample = `
const element = (
  <h1 className="title">
    Read{' '}
    <Link href="/posts/first-post">
      <a>this page! - {Date.now()}</a>
    </Link>
  </h1>
)
`.trim()

const fullExample = `
// hello-world.js
import { planet } from '../space'

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
  1000_000_000, 
  1.2e3, 
  0x1f,
  .14, 
  1n, 
].filter(Boolean)


// jsx
const element = (
  <>
    <Food
      season={{
        sault: <p a={[{}]} />
      }}>
    </Food>
    {/* jsx comment */}
    <h1 className="title">
      Read{' '}
      <Link href="/posts/first-post">
        <a>this page! - {Date.now()}</a>
      </Link>
    </h1>
  </>
)

/**
 * @param {string} name 
 * @return {void}
 */
function foo(name, callback) {
  for (let i = 0; i < name.length; i++) {
    callback(name[i])
  }
}

class SuperArray extends Array {
  static core = Object.create(null)

  constructor(...args) { super(...args); }

  bump() {
    return this.map(
      x => x == undefined ? x + 1 : 0
    )
  }
}

`.trim()

codeInput.addEventListener('input', () => {
  update()
})

codeInput.value = fullExample

function update() {
  const code = codeInput.value?.trim() || ''
  const output = highlight(code)
  
  codeOutput.innerHTML = output
}

update()
