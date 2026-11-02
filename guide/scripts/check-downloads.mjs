// Run after pushing to GitHub: checks that every download link in materials.json resolves to the real file.
// Follows redirects, expects HTTP 200, and checks the first bytes (%PDF for PDFs, PK for Office/zip files).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const REPO_RAW = 'https://github.com/Nikhil-Kotte/V_SEM_GUIDE/raw/main/'
const rawUrl = (path) => REPO_RAW + path.split('/').map(encodeURIComponent).join('/')
const items = JSON.parse(readFileSync(fileURLToPath(new URL('../src/content/materials.json', import.meta.url)), 'utf8'))

const SIGNATURES = { pdf: '%PDF', pptx: 'PK', docx: 'PK', ppt: '\xD0\xCF', ipynb: '{' }
let failed = 0

for (const item of items) {
  const url = rawUrl(item.path)
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { Range: 'bytes=0-15' } })
    const buf = Buffer.from(await res.arrayBuffer())
    const head = buf.toString('latin1', 0, 4)
    const want = SIGNATURES[item.ext]
    const ok = (res.status === 200 || res.status === 206) && (!want || head.startsWith(want))
    if (!ok) { failed++; console.error(`FAIL ${res.status} ${JSON.stringify(head)} ${item.path}`) }
    else console.log(`ok   ${item.path}`)
  } catch (e) {
    failed++
    console.error(`FAIL ${e.message} ${item.path}`)
  }
}
console.log(failed ? `\n${failed} of ${items.length} downloads failed` : `\nAll ${items.length} downloads verified`)
process.exit(failed ? 1 : 0)
