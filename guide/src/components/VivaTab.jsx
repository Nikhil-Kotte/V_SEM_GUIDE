import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Tick02Icon, ViewIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/storage.js'
import Blocks from './Blocks.jsx'
import Icon from './Icon.jsx'
import GlideSelect from './bits/GlideSelect.jsx'
import { useReveal } from './Reveal.jsx'

const LOADERS = {
  cn: () => Promise.all([import('../content/lab/viva-cn.js'), import('../content/lab/cn.js')]),
  os: () => Promise.all([import('../content/lab/viva-os.js'), import('../content/lab/os.js')]),
  se: () => Promise.all([import('../content/lab/viva-se.js'), import('../content/lab/se.js')]),
}

const vivaKey = (subj, exp, id) => `viva.${subj}.${exp || 'theory'}.${id}`

const GLIDE_THEME = { surfaceColor: 'var(--surface)', highlightColor: 'var(--surface-2)', textColor: 'var(--text)', accentColor: 'var(--accent)', size: 'md', radius: 14 }

// Viva practice for one lab: theory questions plus questions on each experiment, like the PYQ tab.
export default function VivaTab({ subject }) {
  const [data, setData] = useState(null)
  const [params, setParams] = useSearchParams()
  const [hidePractised, setHidePractised] = useState(false)
  const [allOpen, setAllOpen] = useState(false)
  const store = useStore()
  const exp = params.get('exp') || 'all'
  const focus = params.get('q')

  useEffect(() => {
    let live = true
    setData(null)
    LOADERS[subject.id]().then(([viva, lab]) => live && setData({ viva: viva.default, lab: lab.default }))
    return () => { live = false }
  }, [subject.id])

  const setExp = (v) => {
    const next = new URLSearchParams(params)
    next.delete('q')
    if (v === 'all') next.delete('exp'); else next.set('exp', v)
    setParams(next, { replace: true })
  }

  const groups = useMemo(() => {
    if (!data) return []
    const keep = (e, q) => !hidePractised || !store.practised(vivaKey(subject.id, e, q.id))
    const out = []
    if (exp === 'all' || exp === 'theory') out.push({ key: 'theory', title: 'Theory', note: 'General questions on the subject, asked whatever experiment you did.', items: data.viva.theory.filter((q) => keep(null, q)) })
    for (const e of data.lab.experiments) {
      if (exp !== 'all' && exp !== e.id) continue
      const qs = data.viva.experiments[e.id] || []
      out.push({ key: e.id, title: `${data.lab.label || 'Experiment'} ${e.num}: ${e.short || e.title}`, items: qs.filter((q) => keep(e.id, q)) })
    }
    return out.filter((g) => g.items.length)
  }, [data, exp, hidePractised, store, subject.id])

  const listRef = useReveal([groups])

  useEffect(() => {
    if (!data || !focus) return
    requestAnimationFrame(() => document.getElementById(`viva-${focus}`)?.scrollIntoView({ block: 'center' }))
  }, [data, focus])

  if (!data) return <p className="muted loading-note" aria-busy="true">Loading viva questions...</p>

  const all = [
    ...data.viva.theory.map((q) => vivaKey(subject.id, null, q.id)),
    ...Object.entries(data.viva.experiments).flatMap(([e, qs]) => qs.map((q) => vivaKey(subject.id, e, q.id))),
  ]
  const practised = all.filter((k) => store.practised(k)).length

  return (
    <div className="tab-body viva" ref={listRef}>
      <div className="section-head">
        <h2>Viva questions</h2>
        <p>
          The examiner asks from the <b>theory</b> of the subject or about the <b>experiment you just did</b>. Say the answer out loud first, then open it to check. You have practised <b className="num">{practised}</b> of <b className="num">{all.length}</b>.
        </p>
      </div>

      <div className="pyq-toolbar">
        <GlideSelect ariaLabel="Show questions for" value={exp} onChange={setExp} menuWidth={320} {...GLIDE_THEME}
          options={[
            { value: 'all', label: 'All questions', tag: String(all.length) },
            { value: 'theory', label: 'Theory only', tag: String(data.viva.theory.length) },
            ...data.lab.experiments.map((e) => ({ value: e.id, label: `${e.num}. ${e.short || e.title}`, tag: String(data.viva.experiments[e.id]?.length || 0) })),
          ]} />
        <button type="button" className={`btn btn-sm btn-toggle${allOpen ? ' is-on' : ''}`} aria-pressed={allOpen} onClick={() => setAllOpen((o) => !o)}>
          <Icon icon={ViewIcon} /> {allOpen ? 'Hide all answers' : 'Show all answers'}
        </button>
        <label className="toggle"><input type="checkbox" checked={hidePractised} onChange={(e) => setHidePractised(e.target.checked)} /> Hide practised</label>
      </div>

      {groups.length === 0 && <div className="empty">Every question here is marked practised. Untick "Hide practised" to see them again.</div>}

      {groups.map((g) => (
        <section key={g.key} aria-labelledby={`vg-${g.key}`}>
          <div className={`unit-head${g === groups[0] ? ' is-first' : ''}`}>
            <h2 id={`vg-${g.key}`}>{g.title}</h2>
            {g.key !== 'theory' && <Link className="text-link unit-note" to={`/lab/${subject.id}/${g.key}`}>Open the experiment</Link>}
            {g.note && <span className="unit-note">{g.note}</span>}
          </div>
          <ol className="pyq-list">
            {g.items.map((q) => (
              <VivaRow key={`${g.key}.${q.id}`} q={q} storeKey={vivaKey(subject.id, g.key === 'theory' ? null : g.key, q.id)}
                anchor={`${g.key}.${q.id}`} forceOpen={allOpen} initiallyOpen={focus === `${g.key}.${q.id}`} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

function VivaRow({ q, storeKey, anchor, forceOpen, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen)
  const store = useStore()
  const practised = store.practised(storeKey)
  const shown = open || forceOpen
  const blocks = typeof q.a === 'string' ? [q.a] : q.a

  return (
    <li id={`viva-${anchor}`} className={`pyq rv${practised ? ' is-practised' : ''}`}>
      <div className="pyq-main">
        <div className="pyq-mark">
          <span className={`pyq-kind${q.level === 'deeper' ? ' is-deeper' : ''}`}>{q.level === 'deeper' ? 'Deeper' : 'Basic'}</span>
        </div>
        <div className="pyq-body">
          <p className="pyq-q">{q.q}</p>
          <div className="pyq-foot">
            <span />
            <div className="pyq-actions">
              <button type="button" className={`btn btn-sm btn-answer${shown ? ' is-on' : ''}`} aria-expanded={shown} aria-controls={`va-${anchor}`}
                onClick={() => setOpen((o) => !o)} disabled={forceOpen}>
                <Icon icon={ViewIcon} /> {shown ? 'Hide answer' : 'Answer'}
              </button>
              <button type="button" className={`btn btn-sm btn-toggle${practised ? ' is-on' : ''}`} aria-pressed={practised} onClick={() => store.togglePractised(storeKey)}>
                <Icon icon={Tick02Icon} /> {practised ? 'Practised' : 'Mark practised'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {shown && (
        <div className="pyq-answer prose" id={`va-${anchor}`}>
          <Blocks blocks={blocks} />
        </div>
      )}
    </li>
  )
}
