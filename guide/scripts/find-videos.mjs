// Find YouTube videos for every syllabus topic (and every Numericals tool) of a subject.
//
//   node scripts/find-videos.mjs <subject> [--refresh] [--only <topic id>]
//
// Searches YouTube for each topic, reads the real results (video id, title, channel, length, views)
// from the search page, and keeps the two best: long enough to teach, short enough to watch, from a
// channel known for clear lectures where possible, and from two different channels.
// Writes src/content/<subject>/videos.js. Existing entries are kept unless --refresh is given,
// so a hand-picked fix is not overwritten. Nothing here is typed by hand: every id comes from YouTube.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { syllabus } from '../src/content/syllabus.js'

const here = dirname(fileURLToPath(import.meta.url))
const [subject, ...rest] = process.argv.slice(2)
const refresh = rest.includes('--refresh')
const only = rest.includes('--only') ? rest[rest.indexOf('--only') + 1] : null
if (!syllabus[subject]) {
  console.error(`Usage: node scripts/find-videos.mjs <${Object.keys(syllabus).join('|')}> [--refresh] [--only <id>]`)
  process.exit(1)
}

const SUBJECT_WORDS = {
  se: 'software engineering',
  os: 'operating system',
  cn: 'computer networks',
  fds: 'data science',
  bda: 'big data hadoop',
  pdt: 'design thinking',
}

// Better search words where the syllabus title alone is vague. Keyed by topic id or "sim:<id>".
const QUERY = {
  'sim:os-page-replacement': 'page replacement algorithms FIFO LRU optimal numerical',
  'sim:os-disk-scheduling': 'disk scheduling algorithms FCFS SSTF SCAN C-SCAN numerical',
  'sim:os-bankers': 'bankers algorithm numerical example',
  'sim:se-cocomo': 'COCOMO model numerical example software engineering',
  'sim:se-fp': 'function point analysis numerical example',
  'sim:se-cyclomatic': 'cyclomatic complexity numerical example',
  'sim:cn-cidr': 'subnetting CIDR numerical example',
  'sim:cn-cwnd': 'TCP congestion control slow start numerical',
  'sim:fds-metrics': 'regression metrics MAE MSE RMSE R squared explained',
  'sim:fds-kmeans': 'k means clustering numerical example',
}

// Channels known for clear exam-style lectures. A video from one of these wins a close call.
const TRUSTED = [
  'Neso Academy', 'Gate Smashers', 'Sudhakar Atchala', "Jenny's Lectures CS IT", 'KnowledgeGATE by Sanchit Sir',
  '5 Minutes Engineering', 'Education 4u', 'Easy Engineering Classes', 'Abdul Bari', 'StatQuest with Josh Starmer',
  'Corey Schafer', 'freeCodeCamp.org', 'Simplilearn', 'edureka!', 'Great Learning', 'Telusko', 'Krish Naik',
  'codebasics', 'Data School', 'TutorialsPoint', 'Ravindrababu Ravula', 'IBM Technology', 'Computerphile',
  'PowerCert Animated Videos', 'Practical Networking', 'NNgroup', 'IDEO U', 'AJ&Smart', 'Interaction Design Foundation',
  'Scaler', 'Apna College', 'CodeWithHarry', 'Learn Coding', 'Lectures by Varun Singla', 'Chanchal Bhagat',
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const secs = (t) => (t || '').split(':').reduce((a, b) => a * 60 + Number(b), 0)
const words = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2)

async function search(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9' } })
  const html = await res.text()
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s)
  if (!m) return []
  const out = []
  ;(function walk(o) {
    if (!o || typeof o !== 'object') return
    if (o.videoRenderer) {
      const v = o.videoRenderer
      out.push({
        id: v.videoId,
        title: v.title?.runs?.map((r) => r.text).join('') || '',
        channel: v.ownerText?.runs?.[0]?.text || '',
        length: v.lengthText?.simpleText || '',
        views: Number((v.viewCountText?.simpleText || '0').replace(/[^0-9]/g, '')) || 0,
      })
      return
    }
    for (const k in o) walk(o[k])
  })(JSON.parse(m[1]))
  return out
}

function pick(results, query) {
  const want = words(query)
  const scored = results
    .filter((v) => v.id && secs(v.length) >= 150 && secs(v.length) <= 60 * 60)
    .slice(0, 12)
    .map((v) => {
      const have = new Set(words(v.title))
      const match = want.filter((w) => have.has(w)).length / Math.max(1, want.length)
      const score = Math.log10(v.views + 10) + (TRUSTED.includes(v.channel) ? 1.5 : 0) + match * 3
      return { ...v, score }
    })
    .sort((a, b) => b.score - a.score)
  const chosen = []
  for (const v of scored) {
    if (chosen.some((c) => c.channel === v.channel)) continue
    chosen.push({ id: v.id, title: v.title, channel: v.channel, length: v.length, views: v.views })
    if (chosen.length === 2) break
  }
  return chosen
}

const file = join(here, `../src/content/${subject}/videos.js`)
const data = existsSync(file) ? { ...(await import(pathToFileURL(file).href)).default } : {}

const jobs = []
for (const u of syllabus[subject]) for (const t of u.topics) jobs.push([t.id, QUERY[t.id] || `${t.title.replace(/\(.*?\)/g, '')} ${SUBJECT_WORDS[subject]}`])
const reg = readFileSync(join(here, '../src/sims/registry.js'), 'utf8')
for (const m of reg.matchAll(/'([a-z]+-[a-z-]+)': \{ subject: '([a-z]+)'/g)) {
  if (m[2] === subject) jobs.push([`sim:${m[1]}`, QUERY[`sim:${m[1]}`] || m[1].replace(/-/g, ' ')])
}

let found = 0
for (const [key, query] of jobs) {
  if (only && key !== only) continue
  if (data[key]?.length && !refresh && !only) continue
  try {
    // YouTube sometimes answers a burst of searches with an empty page; back off and retry.
    let vids = []
    for (let attempt = 0; attempt < 4 && !vids.length; attempt++) {
      if (attempt) await sleep(4000 * attempt)
      vids = pick(await search(query), query)
    }
    if (vids.length) { data[key] = vids; found++ }
    console.log(`${vids.length ? 'ok ' : '-- '}${key}  ${vids.map((v) => `${v.channel} (${v.length})`).join(', ')}`)
  } catch (e) {
    console.log(`!! ${key}  ${e.message}`)
  }
  await sleep(1500)
}

const sorted = Object.fromEntries(Object.keys(data).sort().map((k) => [k, data[k]]))
writeFileSync(file, `// YouTube videos per topic (and per Numericals tool as "sim:<id>"), found by scripts/find-videos.mjs.
// Every id came from a YouTube search result. Fix a bad pick by editing it here: the script keeps edits.
export default ${JSON.stringify(sorted, null, 2)}
`)
console.log(`\n${found} updated, ${Object.keys(sorted).length} entries in ${file}`)
