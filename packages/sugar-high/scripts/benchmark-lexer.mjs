// Compare two package directories: node scripts/benchmark-lexer.mjs <base> <candidate>
// Seven alternating rounds; median ops/s after warmup. No external comparison engines.
import {pathToFileURL} from 'node:url'
import {readFileSync, mkdtempSync, writeFileSync, rmSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {gzipSync} from 'node:zlib'
import {tmpdir} from 'node:os'
const [base, candidate] = process.argv.slice(2)
if (!base || !candidate) throw new Error('Pass absolute base and candidate package directories')
const roots = [base, candidate]
const modules = await Promise.all(roots.map(async root => ({
  ...(await import(pathToFileURL(root + '/lib/index.js'))),
  ...(await import(pathToFileURL(root + '/lib/presets/javascript-runtime.js'))),
})))
const cases = {
 javascript: ['javascript', 'export function greeting(user) { const label = "hello"; return user.name + label; }\n'],
 typescript: ['typescript', 'interface User { name: string; active: boolean }\nconst greet = <T extends User>(user: T): string => user.name;\n'],
 jsx: ['javascript', 'const view = <Panel title="hello" active={user.active}><span>{user.name}</span></Panel>;\n'],
 escapes: ['javascript', String.raw`const text = "a\\b\"c"; const pattern = /[\/]foo/g; const label = ` + '`hello ${name}`;\n'],
}
let sink = 0
for (const [name, [lang, block]] of Object.entries(cases)) {
 const source = block.repeat(20)
 for (const operation of ['tokenize', 'highlight']) {
  const runs = modules.map(m => () => m[operation](source, operation === 'highlight' ? {lang} : {typescript: lang === 'typescript'}))
  for (const run of runs) for(let i=0;i<300;i++) sink += run().length
  const samples = [[],[]]
  for(let round=0;round<7;round++) for(const index of round%2 ? [1,0] : [0,1]) {
   const start = performance.now()
   for(let i=0;i<1000;i++) sink += runs[index]().length
   samples[index].push(1000000/(performance.now()-start))
  }
  const medians = samples.map(s=>s.sort((a,b)=>a-b)[3])
  console.log(JSON.stringify({name,operation,bytes:Buffer.byteLength(source),base:Math.round(medians[0]),candidate:Math.round(medians[1]),change:((medians[1]/medians[0]-1)*100).toFixed(1)+'%'}))
 }
}
const temp = mkdtempSync(`${tmpdir()}/sugar-high-size-`)
try {
 for (const [index, root] of roots.entries()) {
  const jsEntry = `${temp}/js-${index}.js`
  writeFileSync(jsEntry, `import {parse,render} from '${root}/lib/core.js'; import * as javascript from '${root}/lib/lang/javascript.js'; export const run = code => render(parse(code,javascript));`)
  for (const [name,entry] of [['root',root+'/lib/index.js'],['core',root+'/lib/core.js'],['core + javascript',jsEntry]]) {
   const outfile = `${temp}/bundle.js`
   execFileSync('bun',['build',entry,'--bundle','--minify','--target=browser',`--outfile=${outfile}`],{stdio:'pipe'})
   const bytes = readFileSync(outfile)
   console.log(JSON.stringify({version:index?'candidate':'base',entry:name,minified:bytes.length,gzip:gzipSync(bytes,{level:9}).length}))
  }
 }
} finally {rmSync(temp,{recursive:true,force:true})}
console.log({sink})
