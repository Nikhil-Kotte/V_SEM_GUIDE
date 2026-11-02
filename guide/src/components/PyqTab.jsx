import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { topicIndex } from '../content/syllabus.js'
import { sortByRecent } from '../lib/rank.js'
import { useStore } from '../lib/storage.js'
import { rawUrl } from '../config.js'
import Blocks from './Blocks.jsx'
import GlideSelect from './bits/GlideSelect.jsx'

// GlideSelect colours follow the site theme through CSS variables.
const GLIDE_THEME = {
  surfaceColor: 'var(--surface)',
  highlightColor: 'var(--surface-2)',
  textColor: 'var(--text)',
  accentColor: 'var(--coral-deep)',
  size: 'md',
  radius: 14,
}

export default function PyqTab({ subject, data, focus }) {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('repeated')
  const [unit, setUnit] = useState('all')
  const [numOnly, setNumOnly] = useState(false)
  const [hidePractised, setHidePractised] = useState(false)
  const topic = params.get('topic') || 'all'
  const store = useStore()

  const setTopic = (t) => {
    const next = new URLSearchParams(params)
    if (t === 'all') next.delete('topic'); else next.set('topic', t)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const keep = (q) =>
      (unit === 'all' || topicIndex[q.syllabusId]?.unit === unit) &&
      (topic === 'all' || q.syllabusId === topic) &&
      (!numOnly || q.numerical) &&
      (!hidePractised || !store.practised(q.id))
    const past = data.ranked.filter((q) => q.kind !== 'predicted' && keep(q))
    const predicted = data.ranked.filter((q) => q.kind === 'predicted' && keep(q))
    return { past: sort === 'recent' ? sortByRecent(past) : past, predicted }
  }, [data, unit, topic, numOnly, hidePractised, sort, store])

  useEffect(() => {
    if (!focus) return
    requestAnimationFrame(() => document.getElementById(`q-${focus}`)?.scrollIntoView({ block: 'center' }))
  }, [focus])

  const topicsInUnit = data.units.filter((u) => unit === 'all' || u.unit === unit).flatMap((u) => u.topics)
  const isRelatedOnly = data.ranked.every((q) => q.kind !== 'pyq')

  return (
    <div style={{ padding: '36px 0 96px' }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <span className="label">Past questions</span>
        <div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}>{isRelatedOnly ? 'Related & likely questions' : 'Most repeated first'}</h2>
          <p>
            {isRelatedOnly
              ? 'This is a new course with no past papers yet. Below are questions from the closest related course (rewritten for Python), followed by likely questions built from your syllabus.'
              : 'Ranked by how many different papers asked the question, then by how recently it was asked. Only questions inside your Mid-2 syllabus are listed; old-syllabus topics are left out.'}
          </p>
        </div>
      </div>

      <div className="pyq-toolbar">
        <div className="seg" role="group" aria-label="Sort questions">
          <button type="button" aria-pressed={sort === 'repeated'} onClick={() => setSort('repeated')}>Most repeated</button>
          <button type="button" aria-pressed={sort === 'recent'} onClick={() => setSort('recent')}>Most recent</button>
        </div>
        <GlideSelect
          ariaLabel="Unit"
          value={unit}
          onChange={(v) => { setUnit(v); setTopic('all') }}
          options={[{ value: 'all', label: 'All units' }, ...data.units.map((u) => ({ value: u.unit, label: `Unit ${u.unit}`, tag: `${u.topics.length}` }))]}
          {...GLIDE_THEME}
          menuWidth={200}
        />
        <GlideSelect
          ariaLabel="Topic"
          value={topic}
          onChange={setTopic}
          options={[{ value: 'all', label: 'All topics' }, ...topicsInUnit.map((t) => ({ value: t.id, label: t.title }))]}
          {...GLIDE_THEME}
          menuWidth={340}
        />
        <label className="toggle"><input type="checkbox" checked={numOnly} onChange={(e) => setNumOnly(e.target.checked)} /> Numericals only</label>
        <label className="toggle"><input type="checkbox" checked={hidePractised} onChange={(e) => setHidePractised(e.target.checked)} /> Hide practised</label>
      </div>

      {filtered.past.length === 0 && filtered.predicted.length === 0 && <div className="empty">No questions match these filters.</div>}

      {filtered.past.map((q, i) => <Pyq key={q.id} q={q} rank={i + 1} subject={subject} open={focus === q.id} />)}

      {filtered.predicted.length > 0 && (
        <>
          <div className="unit-head" style={{ marginTop: 48 }}>
            <span className="label">Not asked before</span>
            <h2>Likely questions</h2>
          </div>
          <p className="muted" style={{ maxWidth: '64ch' }}>
            These topics are in your syllabus but haven't appeared in the past papers we have. They're our best guess at how they'd be asked. They have no repeat count because they were never asked.
          </p>
          {filtered.predicted.map((q) => <Pyq key={q.id} q={q} subject={subject} open={focus === q.id} />)}
        </>
      )}
    </div>
  )
}

function Pyq({ q, rank, subject, open: openInitially }) {
  const [open, setOpen] = useState(openInitially)
  const store = useStore()
  const practised = store.practised(q.id)
  const topic = topicIndex[q.syllabusId]
  const hot = q.count >= 3

  return (
    <article id={`q-${q.id}`} className={`pyq${practised ? ' practised' : ''}`} style={{ scrollMarginTop: 120 }}>
      <div className="pyq-main">
        <div className="pyq-rank" aria-hidden="true">{rank ? String(rank).padStart(2, '0') : '—'}</div>
        <div>
          <p className="pyq-q">{q.q}</p>
          <div className="pyq-meta">
            {q.kind === 'predicted' && <span className="chip chip-pred">Likely question · never asked</span>}
            {q.kind === 'related-course' && <span className="chip chip-related">Related course (22ADC09)</span>}
            {q.kind === 'pyq' && (
              <span className={`chip ${hot ? 'chip-hot' : 'chip-warm'}`}>
                {hot ? '🔥 ' : ''}Asked {q.count}× · last {q.latestLabel}
              </span>
            )}
            {q.maxMarks > 0 && <span className="chip">{q.maxMarks} marks</span>}
            {q.numerical && <span className="chip chip-num">Numerical</span>}
            {topic && <Link to={`/s/${subject.id}/learn/${encodeURIComponent(topic.id)}`} className="chip" style={{ textDecoration: 'none' }}>Topic: {topic.title} →</Link>}
          </div>
          {q.asks.length > 0 && (
            <div className="papers" style={{ marginTop: 8 }} aria-label="Papers">
              {q.asks.map((a) => (
                <a key={a.paperId} className="chip" href={rawUrl(a.paper.source)} target="_blank" rel="noreferrer"
                  title={`${a.paper.course}${a.paper.relation === 'related' ? ' (related course)' : ''} — open the paper`}
                  style={{ textDecoration: 'none', ...(a.paper.relation === 'related' ? { background: 'var(--violet-tint)' } : null) }}>
                  {a.paper.label}{a.marks ? ` · ${a.marks}M` : ''}
                </a>
              ))}
            </div>
          )}
          {q.note && <p className="faint" style={{ fontSize: 14, margin: '8px 0 0' }}>{q.note}</p>}
          <div className="pyq-actions">
            {q.answer && (
              <button type="button" className="btn btn-sm btn-ink" aria-expanded={open} aria-controls={`a-${q.id}`} onClick={() => setOpen((o) => !o)}>
                {open ? 'Hide answer' : 'Show model answer'}
              </button>
            )}
            <button type="button" className="btn btn-sm" aria-pressed={practised} onClick={() => store.togglePractised(q.id)}>
              {practised ? '✓ Practised' : 'Mark practised'}
            </button>
          </div>
        </div>
      </div>
      {q.answer && open && (
        <div className="pyq-answer prose" id={`a-${q.id}`} style={{ maxWidth: 'none' }}>
          <Blocks blocks={q.answer.blocks} />
          {q.answer.sources && <p className="src">Sources: {q.answer.sources.join(' · ')}</p>}
        </div>
      )}
    </article>
  )
}
