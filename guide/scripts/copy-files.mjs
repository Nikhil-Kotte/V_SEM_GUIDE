// Copy every PDF the site lists (src/content/materials.json) and the exam time-table into
// dist/files/<same path>, so the site can show them in its own viewer (same origin, no trip to GitHub).
//   node scripts/copy-files.mjs        (run after `vite build`)
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const DIST = fileURLToPath(new URL('../dist/files/', import.meta.url))
const TIMETABLE = 'BE-B.Tech-V-Semester-Main-R22A-November-2026.pdf'
const materials = JSON.parse(readFileSync(fileURLToPath(new URL('../src/content/materials.json', import.meta.url)), 'utf8'))

const paths = materials.map((m) => m.path).filter((p) => /\.pdf$/i.test(p))
if (existsSync(join(ROOT, TIMETABLE))) paths.push(TIMETABLE)

let bytes = 0
for (const rel of paths) {
  const out = join(DIST, rel)
  mkdirSync(dirname(out), { recursive: true })
  copyFileSync(join(ROOT, rel), out)
  bytes += statSync(join(ROOT, rel)).size
}
console.log(`copied ${paths.length} PDFs (${(bytes / 1024 / 1024).toFixed(0)} MB) into dist/files`)
