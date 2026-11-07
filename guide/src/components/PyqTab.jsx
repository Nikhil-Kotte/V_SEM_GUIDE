import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { topicIndex } from '../content/syllabus.js'
import { sortByRecent } from '../lib/rank.js'
import { useStore } from '../lib/storage.js'
import { rawUrl } from '../config.js'
import Blocks from './Blocks.jsx'
import GlideSelect from './bits/GlideSelect.jsx'
import Icon from './Icon.jsx'
import Tally from './Tally.jsx'
import { useReveal } from './Reveal.jsx'
import { ArrowDown01Icon, Tick02Icon, ViewIcon } from '@hugeicons/core-free-icons'

// GlideSelect colours follow the site theme through CSS variables.
const GLIDE_THEME = {
  surfaceColor: 'var(--surface)',
  highlightColor: 'var(--surface-2)',
  textColor: 'var(--text)',
  accentColor: 'var(--accent)',
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
    const past = data.ranked.filter((q) => q.kind !== 'predicted' && q.kind !== 'model' && keep(q))
    const predicted = data.ranked.filter((q) => q.kind === 'predicted' && keep(q))
    const model = data.ranked.filter((q) => q.kind === 'model' && keep(q))
    return { past: sort === 'recent' ? sortByRecent(past) : past, predicted, model }
  }, [data, unit, topic, numOnly, hidePractised, sort, store])

  useEffect(() => {
    if (!focus) return
    requestAnimationFrame(() => document.getElementById(`q-${focus}`)?.scrollIntoView({ block: 'center' }))
  }, [focus])

  const listRef = useReveal([filtered])
  const topicsInUnit = data.units.filter((u) => unit === 'all' || u.unit === unit).flatMap((u) => u.topics)
  const isRelatedOnly = data.ranked.every((q) => q.kind !== 'pyq' && q.kind !== 'model')

  return (
    <div className="tab-body" ref={listRef}>
      <div className="section-head">
        <h2>{isRelatedOnly ? 'Related and likely questions' : 'Most repeated first'}</h2>
        <p>
            {isRelatedOnly
              ? 'This is a new course with no past papers yet. Below are questions from the closest related course (rewritten for Python), followed by likely questions built from your syllabus.'
              : 'The circled number is how many different papers asked the question. Ties go to the one asked most recently. Only questions inside your Mid-2 syllabus are listed.'}
        </p>
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

      {filtered.past.length === 0 && filtered.predicted.length === 0 && filtered.model.length === 0 && <div className="empty">No questions match these filters.</div>}

      {filtered.model.length > 0 && (
        <>
          <div className="unit-head is-first">
            <h2>Mid-2 model questions</h2>
          </div>
          <p className="muted tab-intro">
            The model question list given for Mid-2, in its original wording, each with a simple answer. Past-paper questions follow below.
          </p>
          <ol className="pyq-list">{filtered.model.map((q) => <Pyq key={q.id} q={q} subject={subject} open={focus === q.id} />)}</ol>
          {filtered.past.length > 0 && (
            <div className="unit-head">
              <h2>From past papers</h2>
            </div>
          )}
        </>
      )}

      {filtered.past.length > 0 && <ol className="pyq-list">{filtered.past.map((q) => <Pyq key={q.id} q={q} subject={subject} open={focus === q.id} />)}</ol>}

      {filtered.predicted.length > 0 && (
        <>
          <div className="unit-head">
            <h2>Likely questions</h2>
            <span className="unit-note">Not asked before</span>
          </div>
          <p className="muted tab-intro">
            These topics are in your syllabus but haven't appeared in the past papers we have. They're our best guess at how they'd be asked. They have no repeat count because they were never asked.
          </p>
          <ol className="pyq-list">{filtered.predicted.map((q) => <Pyq key={q.id} q={q} subject={subject} open={focus === q.id} />)}</ol>
        </>
      )}
    </div>
  )
}

function Pyq({ q, subject, open: openInitially }) {
  const [open, setOpen] = useState(openInitially)
  const [showPapers, setShowPapers] = useState(false)
  const store = useStore()
  const practised = store.practised(q.id)
  const topic = topicIndex[q.syllabusId]

  return (
    <li id={`q-${q.id}`} className={`pyq rv${practised ? ' is-practised' : ''}${open ? ' is-open' : ''}`}>
      <div className="pyq-main">
        <div className="pyq-mark">
          {q.kind === 'pyq' || q.kind === 'related-course'
            ? <Tally count={q.count} />
            : <span className={`pyq-kind${q.kind === 'model' ? ' is-model' : ''}`}>{q.kind === 'model' ? 'Model' : 'Likely'}</span>}
        </div>
        <div className="pyq-body">
          <p className="pyq-q">{q.q}</p>
          <div className="pyq-foot">
            <p className="pyq-meta">
              {q.maxMarks > 0 && <span>{q.maxMarks} marks</span>}
              {q.kind === 'pyq' && q.latestLabel && <span>Last asked {q.latestLabel}</span>}
              {q.kind === 'related-course' && <span className="chip chip-related">Related course (22ADC09)</span>}
              {q.numerical && <span className="chip chip-num">Numerical</span>}
              {topic && <Link to={`/s/${subject.id}/learn/${encodeURIComponent(topic.id)}`} className="text-link">{topic.title}</Link>}
              {q.asks.length > 0 && (
                <button type="button" className="link-btn" aria-expanded={showPapers} aria-controls={`p-${q.id}`} onClick={() => setShowPapers((s) => !s)}>
                  {q.asks.length} paper{q.asks.length > 1 ? 's' : ''}
                  <Icon icon={ArrowDown01Icon} className="icon link-btn__chev" />
                </button>
              )}
            </p>
            <div className="pyq-actions">
              {q.answer && (
                <button type="button" className={`btn btn-sm btn-answer${open ? ' is-on' : ''}`} aria-expanded={open} aria-controls={`a-${q.id}`} onClick={() => setOpen((o) => !o)}>
                  <Icon icon={ViewIcon} /> {open ? 'Hide answer' : 'Answer'}
                </button>
              )}
              <button type="button" className={`btn btn-sm btn-toggle${practised ? ' is-on' : ''}`} aria-pressed={practised} onClick={() => store.togglePractised(q.id)}>
                <Icon icon={Tick02Icon} /> {practised ? 'Practised' : 'Mark practised'}
              </button>
            </div>
          </div>
          {showPapers && (
            <ul className="papers" id={`p-${q.id}`} aria-label="Papers that asked this">
              {q.asks.map((a) => (
                <li key={a.paperId}>
                  <a className={`chip${a.paper.relation === 'related' ? ' chip-related' : ''}`} href={rawUrl(a.paper.source)} target="_blank" rel="noreferrer"
                    title={`${a.paper.course}${a.paper.relation === 'related' ? ' (related course)' : ''}: open the paper`}>
                    {a.paper.label}{a.marks ? `, ${a.marks} marks` : ''}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {q.note && <p className="faint pyq-note">{q.note}</p>}
        </div>
      </div>
      {q.answer && open && (
        <div className="pyq-answer prose" id={`a-${q.id}`}>
          <Blocks blocks={q.answer.blocks} />
          {q.answer.sources && <p className="src">Sources: {q.answer.sources.join(', ')}</p>}
        </div>
      )}
    </li>
  )
}
