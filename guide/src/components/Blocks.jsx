import { lazy, Suspense } from 'react'
import Inline from './Inline.jsx'
import Diagram from './Diagram.jsx'
import Term from './Term.jsx'

const SimEmbed = lazy(() => import('../sims/SimEmbed.jsx'))

const CALLOUTS = {
  tip: 'Tip',
  exam: 'How to write it in the exam',
  warn: 'Careful',
  analogy: 'Think of it like this',
  note: 'Note',
  fix: 'Your slides vs. the standard definition',
  gap: 'Not in your notes — standard textbook coverage',
}

// Content blocks are plain objects so notes stay easy to write:
//   'text'                          paragraph
//   { h: 'Heading' }                sub-heading
//   { ul: [...] } / { ol: [...] }   lists (items may be strings or block arrays)
//   { steps: [...] }                numbered flow
//   { table: { head, rows } }       table
//   { compare: [{ title, items }] } side-by-side cards
//   { tip|exam|warn|analogy|note|fix|gap: 'text' or [blocks] }
//   { img: 'diagram-id' }           extracted or SVG diagram
//   { code: '...' }                 code sample
//   { formula: '...' }              formula line
//   { sim: 'sim-id' }               interactive simulator
//   { terms: [[term, definition]] } glossary chips
export default function Blocks({ blocks }) {
  if (!blocks) return null
  return blocks.map((b, i) => <Block key={i} b={b} />)
}

function Item({ item }) {
  if (Array.isArray(item)) return <Blocks blocks={item} />
  return <Inline text={item} />
}

function Block({ b }) {
  if (typeof b === 'string') return <p><Inline text={b} /></p>
  if (b.h) return <h4><Inline text={b.h} /></h4>
  if (b.ul) return <ul>{b.ul.map((it, i) => <li key={i}><Item item={it} /></li>)}</ul>
  if (b.ol) return <ol>{b.ol.map((it, i) => <li key={i}><Item item={it} /></li>)}</ol>
  if (b.steps) return <ol className="steps">{b.steps.map((it, i) => <li key={i}><Item item={it} /></li>)}</ol>
  if (b.table) {
    return (
      <div className="table-wrap" tabIndex={0} role="region" aria-label={b.table.caption || 'table'}>
        <table>
          {b.table.head && <thead><tr>{b.table.head.map((h, i) => <th key={i} scope="col"><Inline text={h} /></th>)}</tr></thead>}
          <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Inline text={c} /></td>)}</tr>)}</tbody>
        </table>
      </div>
    )
  }
  if (b.compare) {
    return (
      <div className="compare">
        {b.compare.map((c, i) => (
          <div key={i}>
            <h5><Inline text={c.title} /></h5>
            <ul>{c.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}</ul>
          </div>
        ))}
      </div>
    )
  }
  for (const kind of Object.keys(CALLOUTS)) {
    if (b[kind]) {
      const body = Array.isArray(b[kind]) ? <Blocks blocks={b[kind]} /> : <p><Inline text={b[kind]} /></p>
      const cls = kind === 'fix' || kind === 'gap' ? 'warn' : kind
      return (
        <aside className={`callout ${cls}`}>
          <span className="callout-title">{b.title || CALLOUTS[kind]}</span>
          {body}
        </aside>
      )
    }
  }
  if (b.img) return <Diagram id={b.img} />
  if (b.code) return <pre className="code"><code>{b.code.trim()}</code></pre>
  if (b.formula) return <span className="formula"><Inline text={b.formula} /></span>
  if (b.terms) return <div className="terms">{b.terms.map(([t, d]) => <Term key={t} term={t} def={d} />)}</div>
  if (b.sim) return <Suspense fallback={<div className="sim">Loading tool…</div>}><SimEmbed id={b.sim} /></Suspense>
  if (import.meta.env.DEV) console.warn('Unknown block', b)
  return null
}
