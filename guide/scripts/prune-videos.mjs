// Remove video picks that a human review found off-topic.
//
//   node scripts/prune-videos.mjs <subject> <topic id>[=<index to keep>,...] ...
//
// "fds.u2.attributes" drops every video for that topic; "fds.u4.cleaning=0" keeps only the first.
// find-videos.mjs will not re-add a topic that already has videos, so a pruned single pick stays.
// A topic pruned to nothing can be retried later with: node scripts/find-videos.mjs <subject> --only <id>
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const [subject, ...specs] = process.argv.slice(2)
const file = join(here, `../src/content/${subject}/videos.js`)
const data = { ...(await import(pathToFileURL(file).href)).default }

for (const spec of specs) {
  const [key, keep] = spec.split('=')
  if (!data[key]) { console.log(`?? ${key} has no videos`); continue }
  if (keep == null) { delete data[key]; console.log(`removed ${key}`); continue }
  const idx = keep.split(',').map(Number)
  data[key] = data[key].filter((_, i) => idx.includes(i))
  console.log(`kept ${idx.length} for ${key}`)
}

const sorted = Object.fromEntries(Object.keys(data).sort().map((k) => [k, data[k]]))
writeFileSync(file, `// YouTube videos per topic (and per Numericals tool as "sim:<id>"), found by scripts/find-videos.mjs.
// Every id came from a YouTube search result. Fix a bad pick by editing it here: the script keeps edits.
export default ${JSON.stringify(sorted, null, 2)}
`)
