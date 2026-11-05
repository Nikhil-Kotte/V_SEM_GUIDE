// Ask ChatGPT (through the Codex CLI, logged in with a ChatGPT account) to re-explain every topic in
// simpler terms, and save the replies to src/content/<subject>/simple.js.
//
//   node scripts/simplify-with-chatgpt.mjs cn fds          all topics of these subjects
//   node scripts/simplify-with-chatgpt.mjs cn --only cn.u4.udp
//   node scripts/simplify-with-chatgpt.mjs cn --missing    only topics without a reply yet
//
// Replies are stored verbatim; the topic card shows them under "In simple words".
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
const CONTENT = join(here, '../src/content')
const CONCURRENCY = 4

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'points', 'analogy', 'example'],
  properties: {
    summary: { type: 'string', description: '2-4 short sentences: what it is and why it matters' },
    points: { type: 'array', items: { type: 'string' }, description: '3-7 short bullet points covering the key ideas' },
    analogy: { type: 'string', description: 'one everyday analogy' },
    example: { type: 'string', description: 'one small concrete example' },
  },
}

// Turn the Blocks DSL into plain text for the prompt (diagrams and simulators are skipped).
function flatten(blocks = []) {
  const out = []
  for (const b of blocks) {
    if (typeof b === 'string') out.push(b)
    else if (b.h) out.push(`\n## ${b.h}`)
    else if (b.ul || b.ol || b.steps) (b.ul || b.ol || b.steps).forEach((x) => out.push(`- ${x}`))
    else if (b.table) { out.push(b.table.head.join(' | ')); b.table.rows.forEach((r) => out.push(r.join(' | '))) }
    else if (b.compare) b.compare.forEach((c) => { out.push(`${c.title}:`); c.items.forEach((x) => out.push(`- ${x}`)) })
    else if (b.formula) out.push(`Formula: ${b.formula}`)
    else if (b.code) out.push(`Code:\n${b.code}`)
    else if (b.terms) b.terms.forEach(([t, d]) => out.push(`${t}: ${d}`))
    else for (const k of ['tip', 'exam', 'warn', 'analogy', 'note', 'fix', 'gap']) if (b[k]) out.push(String(b[k]))
  }
  return out.join('\n')
}

function prompt(subjectName, title, t) {
  return `You are a friendly senior student explaining a ${subjectName} topic to a B.E. student who finds textbooks hard to follow.

Topic: ${title}

Here are the class notes for this topic:
"""
${t.oneLine ? `In one line: ${t.oneLine}\n` : ''}${flatten(t.blocks)}
${t.terms?.length ? '\nKey terms:\n' + t.terms.map(([a, b]) => `${a}: ${b}`).join('\n') : ''}
"""

Explain this topic in much simpler terms:
- Use short sentences and everyday words. Explain any jargon the first time you use it.
- Keep every fact correct and keep the exam terms (wrap the important ones in **double asterisks**).
- Do not add facts that are not standard textbook knowledge for this topic.
- No headings, no code blocks, no emojis. Plain text with **bold** only.
- Total length about 150-250 words.

Reply only with JSON matching the schema: summary, points (3-7 bullets), analogy (one everyday comparison), example (one small concrete example).`
}

function runCodex(text, schemaFile, workDir) {
  return new Promise((resolve, reject) => {
    const outFile = join(workDir, `out-${Math.random().toString(36).slice(2)}.json`)
    const args = ['exec', '--skip-git-repo-check', '--ephemeral', '-s', 'read-only', '--color', 'never', '--output-schema', schemaFile, '-o', outFile, '-']
    const p = spawn('codex', args, { cwd: workDir, shell: process.platform === 'win32' })
    let err = ''
    p.stderr.on('data', (d) => { err += d })
    p.stdout.on('data', () => {})
    p.on('close', (code) => {
      if (code !== 0 || !existsSync(outFile)) return reject(new Error(`codex exited ${code}: ${err.slice(-400)}`))
      try { resolve(JSON.parse(readFileSync(outFile, 'utf8'))) } catch (e) { reject(new Error(`bad JSON: ${readFileSync(outFile, 'utf8').slice(0, 300)}`)) }
    })
    p.stdin.end(text)
  })
}

const NAMES = { se: 'Software Engineering', os: 'Operating Systems', cn: 'Computer Networks', fds: 'Fundamentals of Data Science (Python)', bda: 'Big Data Analytics', pdt: 'Principles of Design Thinking' }

async function subject(subj, { only, missing }) {
  const topics = (await import(pathToFileURL(join(CONTENT, subj, 'topics.js')).href)).default
  const { syllabus } = await import(pathToFileURL(join(CONTENT, 'syllabus.js')).href)
  const titles = Object.fromEntries((syllabus[subj] || []).flatMap((u) => u.topics.map((t) => [t.id, t.title])))
  const file = join(CONTENT, subj, 'simple.js')
  const existing = existsSync(file) ? (await import(pathToFileURL(file).href + `?t=${Date.now()}`)).default : {}
  const result = { ...existing }

  let ids = Object.keys(topics)
  if (only) ids = ids.filter((id) => only.includes(id))
  if (missing) ids = ids.filter((id) => !existing[id])

  const work = mkdtempSync(join(tmpdir(), 'simplify-'))
  const schemaFile = join(work, 'schema.json')
  writeFileSync(schemaFile, JSON.stringify(SCHEMA))

  let next = 0, done = 0
  const failures = []
  async function worker() {
    while (next < ids.length) {
      const id = ids[next++]
      const title = titles[id] || id
      try {
        // Network errors and "model at capacity" are transient: retry with a growing pause.
        for (let attempt = 1; ; attempt++) {
          try {
            result[id] = await runCodex(prompt(NAMES[subj], title, topics[id]), schemaFile, work)
            break
          } catch (e) {
            if (attempt >= 3) throw e
            console.log(`retry ${id} (${attempt}): ${e.message.slice(-120)}`)
            await new Promise((r) => setTimeout(r, attempt * 15000))
          }
        }
        done++
        console.log(`ok   ${subj} ${done}/${ids.length} ${id}`)
        save(file, result)
      } catch (e) {
        failures.push(id)
        console.log(`FAIL ${id}: ${e.message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  save(file, result)
  console.log(`${subj}: ${done} written, ${failures.length} failed${failures.length ? ' (' + failures.join(', ') + ')' : ''}`)
}

function save(file, result) {
  const sorted = Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]))
  writeFileSync(file, `// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default ${JSON.stringify(sorted, null, 2)}
`)
}

const args = process.argv.slice(2)
const opts = { missing: args.includes('--missing') }
const oi = args.indexOf('--only')
if (oi >= 0) opts.only = args[oi + 1].split(',')
const subjects = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--only')
mkdirSync(CONTENT, { recursive: true })
for (const s of subjects) await subject(s, opts)
