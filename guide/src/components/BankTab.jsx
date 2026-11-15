import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown01Icon, Tick02Icon, ViewIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/storage.js'
import { viewerPath } from '../lib/files.js'
import Blocks from './Blocks.jsx'
import Icon from './Icon.jsx'
import Tally from './Tally.jsx'
import { Stamp } from './ink/Desk.jsx'
import { useReveal } from './Reveal.jsx'

const key = (subj, id) => `bank.${subj}.${id}`

// A 2-mark question bank per unit. Class-test questions come first, then the ones asked in the most
// papers, then likely ones. Try each question before opening the answer; mark it practised when done.
export default function BankTab({ subject, data, focus }) {
  const store = useStore()
  const [unit, setUnit] = useState(() => (focus && data.bank2m.find((u) => u.items.some((i) => i.id === focus))?.unit) || data.bank2m[0].unit)
  const [allOpen, setAllOpen] = useState(false)
  const byId = useMemo(() => Object.fromEntries(data.ranked.map((q) => [q.id, q])), [data])

  // Order inside each unit: class tests, then repeat count, then the order they were written in.
  const units = useMemo(() => data.bank2m.map((u) => ({
    ...u,
    items: u.items.map((it, i) => ({ ...it, pyq: it.from ? byId[it.from] : null, i }))
      .sort((a, b) => ((b.pyq?.mid ? 1 : 0) - (a.pyq?.mid ? 1 : 0)) || ((b.pyq?.count || 0) - (a.pyq?.count || 0)) || (a.i - b.i)),
  })), [data, byId])

  const current = units.find((u) => u.unit === unit) || units[0]
  const listRef = useReveal([unit])
  const done = current.items.filter((it) => store.practised(key(subject.id, it.id))).length

  useEffect(() => {
    if (!focus) return
    requestAnimationFrame(() => document.getElementById(`bank-${focus}`)?.scrollIntoView({ block: 'center' }))
  }, [focus])

  return (
    <div className="tab-body bank" ref={listRef}>
      <div className="section-head">
        <h2>2-mark question bank</h2>
        <p>Short questions for each unit with full-mark answers. Questions from your class tests come first, then the ones asked in the most papers. Say the answer to yourself before you open it.</p>
      </div>

      <div className="bank-units" role="tablist" aria-label="Unit">
        {units.map((u) => {
          const n = u.items.filter((it) => store.practised(key(subject.id, it.id))).length
          return (
            <button key={u.unit} type="button" role="tab" aria-selected={u.unit === current.unit} className="bank-unit" onClick={() => setUnit(u.unit)}>
              <span className="bank-unit__name">Unit {u.unit}</span>
              <span className="bank-unit__count num">{n}/{u.items.length}</span>
            </button>
          )
        })}
      </div>

      <div className="pyq-toolbar">
        <button type="button" className={`btn btn-sm btn-toggle${allOpen ? ' is-on' : ''}`} aria-pressed={allOpen} onClick={() => setAllOpen((o) => !o)}>
          <Icon icon={ViewIcon} /> {allOpen ? 'Hide all answers' : 'Show all answers'}
        </button>
        <span className="faint">{done} of {current.items.length} practised in Unit {current.unit}</span>
      </div>

      <ol className="bank-list">
        {current.items.map((it, n) => <BankItem key={it.id} it={it} n={n + 1} subject={subject} forceOpen={allOpen} initiallyOpen={focus === it.id} />)}
      </ol>
    </div>
  )
}

function BankItem({ it, n, subject, forceOpen, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen)
  const store = useStore()
  const practised = store.practised(key(subject.id, it.id))
  const shown = open || forceOpen
  const asks = it.pyq?.asks || []
  return (
    <li id={`bank-${it.id}`} className={`bank-item sheet rv${practised ? ' is-practised' : ''}${it.pyq?.mid ? ' is-mid' : ''}`}>
      <div className="bank-item__head">
        <span className="bank-item__n hand" aria-hidden="true">{n}.</span>
        <div className="bank-item__main">
          <p className="bank-item__q">{it.q}{it.pyq?.mid && <Stamp tone="ink" className="pyq__stamp">Class test</Stamp>}</p>
          <div className="bank-item__meta">
            {it.pyq?.count > 0 && <Tally count={it.pyq.count} size="sm" />}
            {asks.map((a) => (
              <Link key={a.paperId} to={viewerPath(a.paper.source, `${a.paper.course} ${a.paper.label}`)}
                className={`chip${a.paper.relation === 'mid' ? ' chip-mid' : a.paper.relation === 'related' ? ' chip-related' : ''}`}>
                {a.paper.label}{a.marks ? `, ${a.marks}M` : ''}
              </Link>
            ))}
            {!it.pyq && <span className="chip chip-pred">Likely</span>}
          </div>
        </div>
        <div className="pyq-actions">
          <button type="button" className={`btn btn-sm btn-answer${shown ? ' is-on' : ''}`} aria-expanded={shown} aria-controls={`ba-${it.id}`} onClick={() => setOpen((o) => !o)} disabled={forceOpen}>
            <Icon icon={ArrowDown01Icon} className="icon link-btn__chev" /> {shown ? 'Hide' : 'Answer'}
          </button>
          <button type="button" className={`btn btn-sm btn-toggle${practised ? ' is-on' : ''}`} aria-pressed={practised} onClick={() => store.togglePractised(key(subject.id, it.id))}>
            <Icon icon={Tick02Icon} /> {practised ? 'Practised' : 'Mark practised'}
          </button>
        </div>
      </div>
      {shown && <div className="bank-item__a prose" id={`ba-${it.id}`}><Blocks blocks={it.a} /></div>}
    </li>
  )
}
