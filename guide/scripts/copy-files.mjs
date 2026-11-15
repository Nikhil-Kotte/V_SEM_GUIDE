// Copy every PDF from Material/, PYQs/ and the exam time-table into dist/files/<same path>,
// so the site can show them in its own viewer (same origin, no trip to GitHub).
//   node scripts/copy-files.mjs        (run after `vite build`)
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const DIST = fileURLToPath(new URL('../dist/files/', import.meta.url))
const TIMETABLE = 'BE-B.Tech-V-Semester-Main-R22A-November-2026.pdf'

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const full = join(dir, name)
  return statSync(full).isDirectory() ? walk(full) : [full]
})

const pdfs = [...walk(join(ROOT, 'Material')), ...walk(join(ROOT, 'PYQs'))].filter((f) => /\.pdf$/i.test(f))
if (existsSync(join(ROOT, TIMETABLE))) pdfs.push(join(ROOT, TIMETABLE))

let bytes = 0
for (const file of pdfs) {
  const rel = relative(ROOT, file).split(sep).join('/')
  const out = join(DIST, rel)
  mkdirSync(dirname(out), { recursive: true })
  copyFileSync(file, out)
  bytes += statSync(file).size
}
console.log(`copied ${pdfs.length} PDFs (${(bytes / 1024 / 1024).toFixed(0)} MB) into dist/files`)
