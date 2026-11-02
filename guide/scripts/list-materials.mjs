// Walks Material/ and PYQs/ and writes src/content/materials.json — the source of every download link.
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, extname, basename, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const OUT = fileURLToPath(new URL('../src/content/materials.json', import.meta.url))

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

// Which subject a past paper or bank belongs to, by filename.
const PAPER_RULES = [
  ['se', /software engineering|^PYQs\/SE_/i],
  ['os', /operating systems|^PYQs\/OS_/i],
  ['cn', /computer networks|^PYQs\/CN_|Data Communication/i],
  ['fds', /Data Science/i],
  ['bda', /big data|^PYQs\/BDA_/i],
  ['pdt', /design thinking|New Doc/i],
]

const items = []
for (const file of walk(join(ROOT, 'Material'))) {
  const rel = relative(ROOT, file).split(sep).join('/')
  const subject = rel.split('/')[1].toLowerCase()
  items.push({ subject, group: 'material', path: rel, name: basename(file), ext: extname(file).slice(1).toLowerCase(), size: statSync(file).size })
}
for (const file of walk(join(ROOT, 'PYQs'))) {
  const rel = relative(ROOT, file).split(sep).join('/')
  const rule = PAPER_RULES.find(([, re]) => re.test(rel))
  if (!rule) { console.warn('Unmatched paper:', rel); continue }
  const isBank = !/\/20\d\d-\d\d\//.test(rel)
  const year = rel.match(/(20\d\d-\d\d)/)?.[1]
  const name = rel.includes('New Doc') ? 'Fundamentals of Design Thinking 22MEC36 (May 2026).pdf' : basename(file)
  items.push({ subject: rule[0], group: isBank ? 'bank' : 'paper', year, path: rel, name, ext: 'pdf', size: statSync(file).size })
}
// CSV with 0 bytes is a placeholder, not a useful download.
const out = items.filter((i) => i.size > 0)
writeFileSync(OUT, JSON.stringify(out, null, 1))
console.log(`materials.json: ${out.length} files`)
