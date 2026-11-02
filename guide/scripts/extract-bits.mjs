// Copies React Bits components verbatim out of ../frontend_prompts.md into src/components/bits/.
//   node scripts/extract-bits.mjs PillNav BranchedMenu ...
// Each section has "### Full Component Source" and (usually) "### Component CSS" code blocks.
// The component name comes from the usage example's import line, because two headings say "<undefined />".
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const md = readFileSync(fileURLToPath(new URL('../../frontend_prompts.md', import.meta.url)), 'utf8')
const outDir = fileURLToPath(new URL('../src/components/bits/', import.meta.url))
mkdirSync(outDir, { recursive: true })

const firstBlockAfter = (text, heading) => {
  const i = text.indexOf(heading)
  if (i === -1) return null
  const m = text.slice(i).match(/```[a-z]*\r?\n([\s\S]*?)\r?\n```/) // the file uses CRLF
  return m ? m[1] : null
}

const wanted = new Set(process.argv.slice(2))
for (const section of md.split(/^## Integrate the /m).slice(1)) {
  const name = section.match(/import (\w+)(?:, \{[^}]*\})? from '\.\/(\w+)'/)?.[1]
  if (!name || (wanted.size && !wanted.has(name))) continue
  const src = firstBlockAfter(section, '### Full Component Source')
  const css = firstBlockAfter(section, '### Component CSS')
  writeFileSync(outDir + name + '.jsx', src + '\n')
  if (css) writeFileSync(outDir + name + '.css', css + '\n')
  console.log('extracted', name, css ? '(+css)' : '')
}
