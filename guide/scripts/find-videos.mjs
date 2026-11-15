// Find YouTube videos for every syllabus topic (and every Numericals tool) of a subject.
//
//   node scripts/find-videos.mjs <subject> [--refresh] [--only <topic id>]
//   node scripts/find-videos.mjs <subject> --prefer "Sudhakar Atchala"
//
// --prefer: for every topic, look for that channel's own lecture on it. When the channel has one,
// the topic links to that channel's videos only; when it has none, the existing picks stay.
//
// Searches YouTube for each topic, reads the real results (video id, title, channel, length, views)
// from the search page, and keeps the two best: long enough to teach, short enough to watch, from a
// channel known for clear lectures where possible, and from two different channels.
// Writes src/content/<subject>/videos.js. Existing entries are kept unless --refresh is given,
// so a hand-picked fix is not overwritten. Nothing here is typed by hand: every id comes from YouTube.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { syllabus } from '../src/content/syllabus.js'

const here = dirname(fileURLToPath(import.meta.url))
const [subject, ...rest] = process.argv.slice(2)
const refresh = rest.includes('--refresh')
const only = rest.includes('--only') ? rest[rest.indexOf('--only') + 1] : null
const prefer = rest.includes('--prefer') ? rest[rest.indexOf('--prefer') + 1] : null
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
  'se.u1.practice': 'software engineering practice essence general principles',
  'se.u1.process': 'software process framework activities umbrella activities',
  'se.u1.generic-model': 'generic process model framework activities',
  'se.u1.specialized': 'specialized process models component based formal methods',
  'se.u2.am': 'agile modeling principles',
  'se.u2.asd': 'adaptive software development ASD agile',
  'se.u2.fdd': 'feature driven development FDD agile',
  'se.u2.eliciting': 'requirements elicitation techniques',
  'se.u2.negotiating': 'negotiating requirements requirement engineering',
  'se.u2.validating': 'requirements validation requirement engineering',
  'se.u2.problem-analysis': 'problem analysis software requirements',
  'se.u2.groundwork': 'establishing the groundwork requirements engineering',
  'se.u3.decomposition': 'decomposition techniques software project estimation',
  'se.u3.problem-based': 'problem based estimation LOC FP',
  'se.u3.sizing': 'software sizing estimation',
  'se.u3.quality-planning': 'software quality planning project',
  'se.u3.schedule-staffing': 'project scheduling staffing software',
  'se.u4.code-inspection': 'code inspection review process',
  'se.u4.coding': 'coding principles guidelines standards',
  'se.u4.incremental-code': 'incremental development of code',
  'se.u4.component-design': 'component level design',
  'se.u5.deployment': 'software deployment planning rollback',
  'se.u5.reviews': 'formal technical review FTR',
  'se.u5.quality-models': 'McCall quality model factors',
  'se.u5.quality-concepts': 'software quality concepts',
  'se.u5.testing-process': 'software testing life cycle STLC process',
  'se.u5.auto-manual': 'manual testing vs automation testing',
  'os.u3.sharing-permissions': 'shared pages protection bits paging',
  'fds.u1.what': 'what is data science',
  'fds.u1.where': 'applications of data science real world',
  'fds.u1.related-fields': 'data science vs statistics vs computer science',
  'fds.u1.collections': 'open data social media data collection',
  'fds.u3.dtype-views': 'numpy view vs copy astype',
  'fds.u3.quandl': 'quandl python pandas',
  'fds.u5.polynomial': 'polynomial regression python',
  'bda.u2.h1-vs-h2': 'hadoop 1 vs hadoop 2 difference',
  'bda.u3.joins': 'map side join reduce side join',
  'bda.u4.pig-udf': 'pig udf user defined function piggybank',
  'pdt.u1.five-stage': 'design thinking process 5 stages explained',
  'pdt.u2.user-needs': 'understanding user needs empathy research',
  'pdt.u3.persona-perspectives': 'types of personas user experience',
  'pdt.u4.ideation': 'ideation phase ideas',
  'pdt.u4.doodling': 'doodling visual thinking sketchnotes',
  'bda.u5.spark-intro': 'apache spark introduction tutorial',
  'bda.u5.spark-arch': 'apache spark architecture driver executor',
  'bda.u5.spark-pros-cons': 'apache spark advantages disadvantages',
  'bda.u4.hive-udf': 'hive udf user defined function',
  'bda.u2.design-principles': 'hadoop design principles data locality',
  'fds.u2.attributes': 'types of attributes data mining nominal ordinal',
  'fds.u3.dates': 'pandas datetime tutorial',
  'fds.u3.pivot': 'pandas pivot table python',
  'fds.u3.stacking-splitting': 'numpy stack split arrays hstack vstack',
  'fds.u1.integration': 'data integration data preprocessing',
  'pdt.u2.empathize': 'empathize stage design thinking',
  'os.u1.distributions': 'linux distributions explained',
  'os.u1.kernel-approaches': 'monolithic kernel vs microkernel vs hybrid kernel',
  'os.u3.address-translation': 'logical to physical address translation relocation register',
  'os.u3.buffering': 'buffering in operating system single double circular buffer',
  'os.u3.mm-syscalls': 'mmap system call linux memory',
  'os.u4.thread-apis': 'pthread create join tutorial',
  'os.u5.caching': 'page cache buffer cache file system',
  'cn.u5.delivery': 'POP3 vs IMAP',
  'cn.u5.formats': 'email message format MIME',
  'se.u2.am': 'agile modeling principles Scott Ambler',
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

// Words that say nothing about the topic itself, so they do not count as a title match.
const FILLER = new Set(['and', 'the', 'with', 'for', 'its', 'their', 'from', 'into', 'using', 'what', 'how', 'why', 'are',
  'example', 'examples', 'explained', 'introduction', 'basics', 'part', 'lecture', 'lec', 'hindi', 'english', 'tutorial'])
const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w)

function coreWords(query) {
  const subjectWords = new Set(words(SUBJECT_WORDS[subject]))
  const core = [...new Set(words(query).filter((w) => !subjectWords.has(w) && !FILLER.has(w)).map(stem))]
  // A query made only of subject words ("what is data science") must still match its own words.
  return core.length ? core : [...new Set(words(query).filter((w) => !FILLER.has(w)).map(stem))]
}

// Relevance first: at least half of the topic's own words must be in the title. Then popularity
// and a known lecture channel break ties. No video is better than a wrong one.
function pick(results, query) {
  const want = coreWords(query)
  const scored = results
    .filter((v) => v.id && secs(v.length) >= 150 && secs(v.length) <= 60 * 60 && !/#shorts/i.test(v.title))
    .slice(0, 15)
    .map((v) => {
      const have = new Set(words(v.title).map(stem))
      const match = want.filter((w) => have.has(w)).length / Math.max(1, want.length)
      const score = match * 4 + Math.log10(v.views + 10) * 0.6 + (TRUSTED.includes(v.channel) ? 0.7 : 0)
      return { ...v, match, score }
    })
    .filter((v) => v.match >= 0.5)
    .sort((a, b) => b.score - a.score)
  const chosen = []
  for (const v of scored) {
    if (chosen.some((c) => c.channel === v.channel)) continue
    chosen.push({ id: v.id, title: v.title, channel: v.channel, length: v.length, views: v.views })
    if (chosen.length === 2) break
  }
  return chosen
}

// The preferred channel teaches many courses, so its videos must clearly be about this topic:
// the title names the subject, and most of the topic's own words are in it (whole words, plural or not).
const SUBJECT_MARK = {
  os: /operating system|os/i,
  cn: /computer network|cn|data link|network layer|transport layer|application layer/i,
  se: /software engineering|se|software/i,
  fds: /data science|python|pandas|numpy|machine learning/i,
  bda: /big data|hadoop|spark|hive|pig|map ?reduce|hdfs|yarn/i,
  pdt: /design thinking/i,
}
const plain = (w) => w.replace(/(ies)$/, 'y').replace(/(?<!s)s$/, '')
function pickFrom(results, query, channel) {
  const want = [...new Set(coreWords(query).length ? words(query).filter((w) => !FILLER.has(w) && !words(SUBJECT_WORDS[subject]).includes(w)).map(plain) : [])]
  const need = want.length <= 2 ? want.length : Math.ceil(want.length * 0.67)
  return results
    .filter((v) => v.channel === channel && v.id && secs(v.length) >= 120 && secs(v.length) <= 90 * 60 && !/#shorts/i.test(v.title))
    .filter((v) => SUBJECT_MARK[subject].test(v.title))
    .map((v) => {
      const have = new Set(words(v.title).map(plain))
      return { ...v, hits: want.filter((w) => have.has(w)).length }
    })
    .filter((v) => want.length > 0 && v.hits >= need)
    .sort((a, b) => b.hits - a.hits || b.views - a.views)
    .slice(0, 2)
    .map(({ id, title, channel: c, length, views }) => ({ id, title, channel: c, length, views }))
}

// Search pages cached per run of --prefer, so tuning the rules does not search YouTube again.
const CACHE = join(tmpdir(), 'v-sem-video-search.json')
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}
async function cachedSearch(q) {
  if (!cache[q]?.length) { cache[q] = await search(q); writeFileSync(CACHE, JSON.stringify(cache)) }
  return cache[q]
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
  if (prefer) {
    try {
      let vids = []
      for (let attempt = 0; attempt < 3 && !vids.length; attempt++) {
        if (attempt) await sleep(4000 * attempt)
        const res = await cachedSearch(`${query} ${prefer}`)
        if (!res.length) continue
        vids = pickFrom(res, query, prefer)
        break
      }
      // Already linked to the channel but the search missed it: keep those, drop the others.
      if (!vids.length) vids = (data[key] || []).filter((v) => v.channel === prefer)
      if (vids.length) { data[key] = vids; found++ }
      console.log(`${vids.length ? 'ok ' : '-- '}${key}  ${vids.map((v) => v.title).join(' | ')}`)
    } catch (e) {
      console.log(`!! ${key}  ${e.message}`)
    }
    await sleep(1500)
    continue
  }
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
