// Crop the symbol / notation tables out of the SE lab record into public/lab/se/notation-<name>.webp.
//
//   node scripts/extract-lab-tables.mjs
//
// The tables are vector drawings (not embedded images), so each page is rendered with pdftoppm and
// cropped to the table: its top and bottom are the first and last long horizontal rule on the page.
// Needs pdftoppm on PATH. CN_LAB.pdf holds the SE record (the file names are swapped).
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const PDF = join(here, '../../Lab/CN_LAB.pdf')
const OUT = join(here, '../public/lab/se')
const DPI = 200
const PAGES = { class: 21, activity: 25, sequence: 31, state: 37, component: 44, deployment: 47 }

const tmp = mkdtempSync(join(tmpdir(), 'labtbl-'))
for (const [name, page] of Object.entries(PAGES)) {
  const png = join(tmp, name)
  execFileSync('pdftoppm', ['-f', String(page), '-l', String(page), '-r', String(DPI), '-png', '-singlefile', PDF, png])
  const { data, info } = await sharp(`${png}.png`).greyscale().raw().toBuffer({ resolveWithObject: true })
  const W = info.width
  // A row is a table rule when it has one unbroken dark run over half the page wide
  // (a line of justified text is dark in many places but never unbroken).
  const rules = []
  for (let y = 0; y < info.height; y++) {
    let run = 0
    let best = 0
    for (let x = 0; x < W; x++) {
      run = data[y * W + x] < 200 ? run + 1 : 0
      if (run > best) best = run
    }
    if (best > W * 0.5) rules.push(y)
  }
  if (!rules.length) throw new Error(`no table found on page ${page}`)
  const top = rules[0]
  const bottom = rules[rules.length - 1]
  // Left and right edges: the first and last dark pixel on the top rule.
  let left = 0
  let right = W - 1
  while (data[top * W + left] >= 200) left++
  while (data[top * W + right] >= 200) right--
  const pad = 6
  const file = join(OUT, `notation-${name}.webp`)
  await sharp(`${png}.png`)
    .extract({ left: left - pad, top: top - pad, width: right - left + 2 * pad, height: bottom - top + 2 * pad })
    .flatten({ background: '#ffffff' })
    .webp({ quality: 90 })
    .toFile(file)
  console.log(`ok notation-${name}.webp (page ${page}) ${(statSync(file).size / 1024).toFixed(0)} KB`)
}
rmSync(tmp, { recursive: true, force: true })
