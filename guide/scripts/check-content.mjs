// Release gate for content. Fails (exit 1) on anything that would mislead a student:
// out-of-syllabus ids, predicted questions with counts, unknown papers, answers without sources,
// missing diagrams/sims. Run with --strict to also fail on topics that have no notes yet.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { syllabus } from '../src/content/syllabus.js'
import { paperById } from '../src/content/papers.js'

const strict = process.argv.includes('--strict')
const src = (p) => fileURLToPath(new URL(`../src/${p}`, import.meta.url))
const errors = []
const warnings = []

const diagrams = JSON.parse(readFileSync(src('content/diagrams.json'), 'utf8'))
const svgKeys = [...readFileSync(src('components/svg/index.js'), 'utf8').matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1])
const simKeys = [...readFileSync(src('sims/registry.js'), 'utf8').matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1])

// Topics the user's syllabus does NOT include. Old papers asked these; they must not sneak back in.
// (Access matrix and deadlock detection were allowed back in: they are asked under "basic security
// mechanisms" and "deadlock recovery" in the user's portion.)
const EXCLUDED = [/\bRAID\b/, /\bSCTP\b/, /spark sql/i, /\bMLlib\b/, /\bGraphX\b/, /\bKafka\b/, /\bICMP\b/, /secondary sort/i]

for (const [subject, units] of Object.entries(syllabus)) {
  const ids = new Set(units.flatMap((u) => u.topics.map((t) => t.id)))
  const { default: mod } = await import(`../src/content/${subject}/index.js`)
  const pyqIds = new Set()

  for (const q of mod.pyqs) {
    const where = `${subject} pyq ${q.id}`
    if (pyqIds.has(q.id)) errors.push(`${where}: duplicate id`)
    pyqIds.add(q.id)
    if (!ids.has(q.syllabusId)) errors.push(`${where}: syllabusId "${q.syllabusId}" is not in the Mid-2 syllabus`)
    if ((q.kind === 'predicted' || q.kind === 'model') && q.asks.length) errors.push(`${where}: ${q.kind} question must not cite papers`)
    if (q.kind !== 'predicted' && q.kind !== 'model' && !q.asks.length) errors.push(`${where}: past question cites no papers`)
    const seen = new Set()
    for (const a of q.asks) {
      const p = paperById[a.paperId]
      if (!p) errors.push(`${where}: unknown paper ${a.paperId}`)
      else if (p.subject !== subject) errors.push(`${where}: paper ${a.paperId} belongs to ${p.subject}`)
      if (seen.has(a.paperId)) warnings.push(`${where}: paper ${a.paperId} listed twice (counted once)`)
      seen.add(a.paperId)
    }
    for (const re of EXCLUDED) if (re.test(q.q)) errors.push(`${where}: mentions excluded topic ${re}`)
  }

  for (const [id, a] of Object.entries(mod.answers)) {
    if (!pyqIds.has(id)) errors.push(`${subject} answer ${id}: no such question`)
    if (!a.sources?.length) errors.push(`${subject} answer ${id}: model answer has no sources`)
    checkRefs(`${subject} answer ${id}`, a.blocks)
  }

  const missing = []
  for (const id of ids) if (!mod.topics[id]) missing.push(id)
  for (const [id, t] of Object.entries(mod.topics)) {
    if (!ids.has(id)) errors.push(`${subject} topic ${id}: not in syllabus`)
    if (!t.oneLine) errors.push(`${subject} topic ${id}: missing oneLine`)
    checkRefs(`${subject} topic ${id}`, t.blocks)
    // ChatGPT's simpler explanation must be complete and stay inside the syllabus too.
    if (t.simple) {
      const s = t.simple
      if (!s.summary || !s.points?.length || !s.analogy || !s.example) errors.push(`${subject} topic ${id}: incomplete simple explanation`)
      const text = [s.summary, ...(s.points || []), s.analogy, s.example].join(' ')
      for (const re of EXCLUDED) if (re.test(text)) errors.push(`${subject} topic ${id}: simple explanation mentions excluded topic ${re}`)
    }
  }
  const line = `${subject}: ${ids.size - missing.length}/${ids.size} topics written, ${mod.pyqs.length} questions, ${Object.keys(mod.answers).length} model answers`
  console.log(line)
  if (missing.length) (strict ? errors : warnings).push(`${subject}: no notes yet for ${missing.join(', ')}`)
}

function checkRefs(where, blocks) {
  const text = JSON.stringify(blocks || [])
  for (const m of text.matchAll(/"img":"([^"]+)"/g)) {
    if (!diagrams[m[1]] && !svgKeys.includes(m[1])) errors.push(`${where}: diagram "${m[1]}" does not exist`)
  }
  for (const m of text.matchAll(/"sim":"([^"]+)"/g)) {
    if (!simKeys.includes(m[1])) errors.push(`${where}: sim "${m[1]}" does not exist`)
  }
}

for (const id of Object.keys(diagrams)) {
  if (!diagrams[id].verified) errors.push(`diagram ${id}: not marked verified (view it before using it)`)
}

warnings.forEach((w) => console.warn('warn:', w))
errors.forEach((e) => console.error('ERROR:', e))
console.log(errors.length ? `\n${errors.length} error(s)` : '\nContent check passed')
process.exit(errors.length ? 1 : 0)
