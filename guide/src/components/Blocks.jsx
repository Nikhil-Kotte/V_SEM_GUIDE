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
  gap: 'Not in your notes: standard textbook coverage',
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
//   { flow: [...], loop }           picture: boxes joined by arrows (loop = text for the arrow back)
//   { stack: [...] }                picture: layers, top to bottom
//   { tree: { root, kids: [...] } } picture: one idea splitting into its kinds
// `level` sets the heading tag for { h } blocks (h4 inside a topic card; h3 directly under an h2).
export default function Blocks({ blocks, level = 4 }) {
  if (!blocks) return null
  return blocks.map((b, i) => <Block key={i} b={b} level={level} />)
}

function Item({ item }) {
  if (Array.isArray(item)) return <Blocks blocks={item} />
  return <Inline text={item} />
}

function Block({ b, level }) {
  const H = `h${level}`
  if (typeof b === 'string') return <p><Inline text={b} /></p>
  if (b.h) return <H><Inline text={b.h} /></H>
  if (b.ul) return <ul>{b.ul.map((it, i) => <li key={i}><Item item={it} /></li>)}</ul>
  if (b.ol) return <ol>{b.ol.map((it, i) => <li key={i}><Item item={it} /></li>)}</ol>
  if (b.steps) return <ol className="steps">{b.steps.map((it, i) => <li key={i}><Item item={it} /></li>)}</ol>
  if (b.table) {
    // First column holds row labels when there is no header row, or its header cell is blank.
    const rowHeads = !b.table.head || b.table.head[0] === ''
    return (
      <div className="table-wrap" tabIndex={0} role="region" aria-label={b.table.caption || 'table'}>
        <table>
          {b.table.head && <thead><tr>{b.table.head.map((h, i) => (h === '' && i === 0 ? <td key={i} /> : <th key={i} scope="col"><Inline text={h} /></th>))}</tr></thead>}
          <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (rowHeads && j === 0
            ? <th key={j} scope="row"><Inline text={c} /></th>
            : <td key={j}><Inline text={c} /></td>))}</tr>)}</tbody>
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
  if (b.flow) {
    return (
      <figure className="vis vis-flow">
        <ol aria-label={b.label || 'Steps in order'}>{b.flow.map((it, i) => <li key={i}><Inline text={it} /></li>)}</ol>
        {b.loop && <figcaption className="vis-loop"><span aria-hidden="true">↺</span> <Inline text={b.loop} /></figcaption>}
      </figure>
    )
  }
  if (b.stack) {
    return (
      <figure className="vis vis-stack">
        <ol aria-label={b.label || 'Layers, top to bottom'}>{b.stack.map((it, i) => <li key={i}><Inline text={it} /></li>)}</ol>
      </figure>
    )
  }
  if (b.tree) {
    return (
      <figure className="vis vis-tree">
        <div className="vis-tree__root"><Inline text={b.tree.root} /></div>
        <ul aria-label={b.label || 'Kinds'}>{b.tree.kids.map((it, i) => <li key={i}><Inline text={it} /></li>)}</ul>
      </figure>
    )
  }
  if (b.img) return <Diagram id={b.img} />
  if (b.code) return <pre className="code"><code>{b.code.trim()}</code></pre>
  if (b.formula) return <span className="formula"><Inline text={b.formula} /></span>
  if (b.terms) return <div className="terms">{b.terms.map(([t, d]) => <Term key={t} term={t} def={d} />)}</div>
  if (b.sim) return <Suspense fallback={<div className="sim">Loading tool…</div>}><SimEmbed id={b.sim} /></Suspense>
  if (import.meta.env.DEV) console.warn('Unknown block', b)
  return null
}
