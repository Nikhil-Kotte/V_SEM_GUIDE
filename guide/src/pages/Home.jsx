import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { subjects, comingSoon, subjectById } from '../content/subjects.js'
import { syllabus, topicIndex } from '../content/syllabus.js'
import { loadAll } from '../lib/useSubject.js'
import { getPref, useStore } from '../lib/storage.js'
import { usePrefersReducedMotion } from '../lib/motion.js'
import HeroHeading from '../components/HeroHeading.jsx'
import Icon from '../components/Icon.jsx'
import Tally from '../components/Tally.jsx'
import RevealHeading from '../components/RevealHeading.jsx'
import { useReveal } from '../components/Reveal.jsx'

// Start fetching the hero animation as soon as Home's code runs.
const heroChunk = () => import('../components/HeroTitle.jsx')
const HeroTitle = lazy(heroChunk)

const TAB_NAMES = { learn: 'Learn', pyqs: 'PYQs', numericals: 'Numericals', revision: 'Quick revision', downloads: 'Downloads' }
const topicsOf = (id) => syllabus[id].flatMap((u) => u.topics)
const openSearch = () => window.dispatchEvent(new Event('open-search'))

export default function Home() {
  const [data, setData] = useState({})
  const store = useStore()
  const reduced = usePrefersReducedMotion()
  const last = getPref('last', null)
  const listRef = useReveal([Object.keys(data).length])

  useEffect(() => {
    if (!reduced) heroChunk()
    // Every subject's notes are ~450 KB: fetch them once the first paint is done.
    let live = true
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 150))
    idle(() => loadAll().then((all) => live && setData(Object.fromEntries(all.map((d) => [d.subject.id, d])))))
    return () => { live = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalTopics = subjects.reduce((n, s) => n + topicsOf(s.id).length, 0)
  const totalPyqs = Object.values(data).reduce((n, d) => n + d.ranked.filter((q) => q.count > 0).length, 0)

  // The questions asked in the most papers, across every subject.
  const mostAsked = useMemo(() => Object.values(data)
    .flatMap((d) => d.ranked.filter((q) => q.kind === 'pyq' && q.count > 0).map((q) => ({ ...q, subj: d.subject })))
    .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest))
    .slice(0, 5), [data])

  const lastSubject = last && subjectById[last.subj]
  const lastTopic = last?.item && topicIndex[last.item]

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            {reduced
              ? <HeroHeading />
              : <Suspense fallback={<HeroHeading />}><HeroTitle /></Suspense>}
            <p className="hero-sub">
              Every Mid-2 topic for V Sem CSE in plain words, with diagrams, the past questions ranked by how often they come back, and tools to practise the numericals.
            </p>
            <button type="button" className="hero-search" onClick={openSearch} aria-keyshortcuts="/">
              <Icon icon={Search01Icon} />
              <span>Search topics and past questions</span>
              <kbd>/</kbd>
            </button>
            {lastSubject && (
              <Link className="resume" to={`/s/${last.subj}/${last.tab || 'learn'}${last.item ? `/${encodeURIComponent(last.item)}` : ''}`}>
                <span className="faint">Pick up where you left off:</span>{' '}
                <b>{lastSubject.short}, {lastTopic?.title || TAB_NAMES[last.tab] || 'Learn'}</b>
                <Icon icon={ArrowRight01Icon} />
              </Link>
            )}
            <p className="hero-facts">
              <b className="num">{totalTopics}</b> topics across <b>{subjects.length}</b> subjects,
              {' '}<b className="num">{totalPyqs || '...'}</b> past questions ranked.
            </p>
          </div>

          <aside className="hero-asked" aria-labelledby="most-asked">
            <h2 id="most-asked">Asked in the most papers</h2>
            {mostAsked.length === 0
              ? <p className="faint">Loading the question papers...</p>
              : (
                <ol className="asked-list">
                  {mostAsked.map((q) => (
                    <li key={q.id}>
                      <Link to={`/s/${q.subj.id}/pyqs/${encodeURIComponent(q.id)}`}>
                        <Tally count={q.count} />
                        <span className="asked-q">{q.q}</span>
                        <span className="asked-meta">{q.subj.short}{q.maxMarks ? `, ${q.maxMarks} marks` : ''}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
          </aside>
        </div>
      </section>

      <section className="section" id="subjects" aria-labelledby="subjects-title">
        <div className="container">
          <div className="section-head">
            <RevealHeading id="subjects-title" text="Pick a subject" />
            <p>Each subject has the same five tabs: <b>Learn</b>, <b>PYQs</b>, <b>Numericals</b>, <b>Quick revision</b> and <b>Downloads</b>.</p>
          </div>

          <ul className="subject-list" ref={listRef}>
            {subjects.map((s) => {
              const d = data[s.id]
              const ids = topicsOf(s.id).map((t) => t.id)
              const done = ids.filter((id) => store.done(id)).length
              const top = d?.ranked.find((q) => q.count > 0)
              return (
                <li key={s.id} className="rv">
                  <Link to={`/s/${s.id}`} className="subject-row">
                    <span className="badge" style={{ background: s.tint, color: s.accent }}>{s.short}</span>
                    <span className="subject-row__main">
                      <span className="subject-row__name">{s.name}</span>
                      <span className="subject-row__blurb">{s.blurb}</span>
                    </span>
                    <span className="subject-row__top">
                      {top
                        ? <><Tally count={top.count} size="sm" /><span className="subject-row__q">{top.q}</span></>
                        : <span className="faint">{d ? 'New course: likely questions built from the syllabus.' : 'Loading...'}</span>}
                    </span>
                    <span className="subject-row__progress">
                      <span className="num">{done}/{ids.length} done</span>
                      <span className="progress" aria-hidden="true"><i style={{ transform: `scaleX(${done / ids.length})` }} /></span>
                    </span>
                    <Icon icon={ArrowRight01Icon} className="icon subject-row__go" />
                  </Link>
                </li>
              )
            })}
            {comingSoon.map((s) => (
              <li key={s.id} className="rv">
                <Link to={`/${s.id}`} className="subject-row is-soon">
                  <span className="badge">{s.short}</span>
                  <span className="subject-row__main">
                    <span className="subject-row__name">{s.name}</span>
                    <span className="subject-row__blurb">Notes are on the way.</span>
                  </span>
                  <span className="subject-row__top"><span className="chip chip-pred">Coming soon</span></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="labs-strip">
            <h2 className="labs-strip__title">Lab externals</h2>
            <p className="faint">Experiments, code and expected output for each lab exam.</p>
            <div className="labs-strip__links">
              {['cn', 'os', 'se'].map((id) => (
                <Link key={id} to={`/lab/${id}`} className="btn">{id.toUpperCase()} Lab</Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
