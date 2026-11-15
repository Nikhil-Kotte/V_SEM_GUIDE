import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { subjects, comingSoon, subjectById } from '../content/subjects.js'
import { syllabus, topicIndex } from '../content/syllabus.js'
import { loadAll } from '../lib/useSubject.js'
import { getPref, useStore } from '../lib/storage.js'
import { useFancyMotion, usePrefersReducedMotion } from '../lib/motion.js'
import { tiltHandlers } from '../lib/useTilt.js'
import { examCountdown, examDay, examOver } from '../lib/exam.js'
import { TIMETABLE, viewerPath } from '../lib/files.js'
import HeroHeading from '../components/HeroHeading.jsx'
import Icon from '../components/Icon.jsx'
import Tally from '../components/Tally.jsx'
import RevealHeading from '../components/RevealHeading.jsx'
import { useReveal } from '../components/Reveal.jsx'
import CoverArt from '../components/art/covers.jsx'
import HeroDesk from '../components/art/HeroDesk.jsx'
import { Spark } from '../components/art/doodles.jsx'
import { Arrow } from '../components/ink/Ink.jsx'
import { PaperClip, Stamp, StickyNote, Staple, Tape } from '../components/ink/Desk.jsx'
import Ring from '../components/ink/Ring.jsx'
import CountUp from '../components/ink/CountUp.jsx'
import UnitHeatmap from '../components/viz/UnitHeatmap.jsx'
import StudyNext from '../components/viz/StudyNext.jsx'

// Start fetching the hero animation as soon as Home's code runs.
const heroChunk = () => import('../components/HeroTitle.jsx')
const HeroTitle = lazy(heroChunk)
const HeroInk = lazy(() => import('../components/HeroInk.jsx'))

const TAB_NAMES = { learn: 'Learn', pyqs: 'PYQs', numericals: 'Numericals', revision: 'Quick revision', downloads: 'Downloads' }
const NOTE_COLORS = ['yellow', 'green', 'rose', 'blue', 'coral', 'violet']
const topicsOf = (id) => syllabus[id].flatMap((u) => u.topics)
const openSearch = () => window.dispatchEvent(new Event('open-search'))
const tilt = tiltHandlers(6)

export default function Home() {
  const [data, setData] = useState({})
  const store = useStore()
  const reduced = usePrefersReducedMotion()
  const fancy = useFancyMotion()
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

  const allIds = useMemo(() => subjects.flatMap((s) => topicsOf(s.id).map((t) => t.id)), [])
  const totalTopics = allIds.length
  const totalDone = allIds.filter((id) => store.done(id)).length
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
        {fancy && <Suspense fallback={null}><HeroInk /></Suspense>}
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker hand"><Spark /> V Sem CSE, exam week</p>
            {reduced
              ? <HeroHeading />
              : <Suspense fallback={<HeroHeading />}><HeroTitle /></Suspense>}
            <p className="hero-sub">
              Every topic of all five units for the V Sem CSE externals, in plain words, with pictures, videos, the past questions ranked by how often they come back, and tools to practise the numericals.
            </p>
            <div className="hero-search-row">
              <button type="button" className="hero-search" onClick={openSearch} aria-keyshortcuts="/">
                <Icon icon={Search01Icon} />
                <span>Search topics and past questions</span>
                <kbd>/</kbd>
              </button>
              <span className="hero-note hand" aria-hidden="true"><Arrow delay={900} /> start here</span>
            </div>
            {lastSubject && (
              <Link className="resume" to={`/s/${last.subj}/${last.tab || 'learn'}${last.item ? `/${encodeURIComponent(last.item)}` : ''}`}>
                <span className="faint">Pick up where you left off:</span>{' '}
                <b>{lastSubject.short}, {lastTopic?.title || TAB_NAMES[last.tab] || 'Learn'}</b>
                <Icon icon={ArrowRight01Icon} />
              </Link>
            )}
            <dl className="hero-stats">
              <div><dt>topics</dt><dd><CountUp value={totalTopics} /></dd></div>
              <div><dt>subjects</dt><dd><CountUp value={subjects.length} duration={500} /></dd></div>
              <div><dt>past questions ranked</dt><dd>{totalPyqs ? <CountUp value={totalPyqs} /> : <span className="num">...</span>}</dd></div>
            </dl>
          </div>

          <div className="hero-stage">
            <HeroDesk />
            <aside className="hero-asked sheet sheet--ruled" aria-labelledby="most-asked">
              <PaperClip />
              <div className="hero-asked__head">
                <h2 id="most-asked">Asked in the most papers</h2>
                <Stamp>Most asked</Stamp>
              </div>
              {mostAsked.length === 0
                ? <p className="faint">Loading the question papers...</p>
                : (
                  <ol className="asked-list">
                    {mostAsked.map((q, i) => (
                      <li key={q.id}>
                        <Link to={`/s/${q.subj.id}/pyqs/${encodeURIComponent(q.id)}`}>
                          <Tally count={q.count} delay={300 + i * 160} />
                          <span className="asked-q">{q.q}</span>
                          <span className="asked-meta">{q.subj.short}{q.maxMarks ? `, ${q.maxMarks} marks` : ''}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
            </aside>
          </div>
        </div>
      </section>

      <section className="section" id="subjects" aria-labelledby="subjects-title">
        <div className="container" ref={listRef}>
          <div className="section-head">
            <RevealHeading id="subjects-title" text="Pick a booklet" />
            <p>In the order of the exams, 10 AM to 1 PM (<Link to={viewerPath(TIMETABLE, 'Exam time-table, November 2026')} className="text-link">see the official time-table</Link>). Each subject has the same five tabs: <b>Learn</b>, <b>PYQs</b>, <b>Numericals</b>, <b>Quick revision</b> and <b>Downloads</b>.</p>
          </div>

          <ul className="booklets">
            {subjects.map((s, i) => {
              const d = data[s.id]
              const ids = topicsOf(s.id).map((t) => t.id)
              const done = ids.filter((id) => store.done(id)).length
              const top = d?.ranked.find((q) => q.count > 0)
              const over = examOver(s.exam)
              return (
                <li key={s.id} className="rv" data-rv="deal" style={{ '--deal': i % 2 ? 1 : -1 }}>
                  <Link to={`/s/${s.id}`} className={`booklet${over ? ' is-over' : ''}`} style={{ '--pen': s.accent, '--pen-tint': s.tint, '--art-tint': 'var(--surface)' }} {...tilt}>
                    <span className="booklet__cover">
                      <Staple style={{ left: 8, top: '22%' }} /><Staple style={{ left: 8, top: '74%' }} />
                      <span className="booklet__top">
                        <span className="booklet__code">{s.code}</span>
                        <Ring value={done / ids.length} size={54} color="var(--pen)" label={`${done} of ${ids.length} topics done`} />
                      </span>
                      <span className="booklet__exam">
                        <span className="booklet__date">{examDay(s.exam)}</span>
                        <span className="hand booklet__when">{examCountdown(s.exam)}</span>
                      </span>
                      <span className="booklet__art"><CoverArt id={s.id} /></span>
                      {over && <Stamp size="lg" className="booklet__over">Exam over</Stamp>}
                      <span className="booklet__label">
                        <span className="booklet__name">{s.name}</span>
                        <span className="booklet__blurb">{s.blurb}</span>
                      </span>
                      <span className="booklet__foot">
                        <span className="num">{done}/{ids.length} topics done</span>
                        <span className="booklet__open">Open <Icon icon={ArrowRight01Icon} /></span>
                      </span>
                    </span>
                    <StickyNote as="span" className="booklet__note" color={NOTE_COLORS[i % NOTE_COLORS.length]} tilt={i % 2 ? -3 : 3}>
                      {top
                        ? <><span className="booklet__note-head"><Tally count={top.count} size="sm" /><span className="hand">asked most</span></span><span className="booklet__q">{top.q}</span></>
                        : <span className="booklet__q faint">{d ? 'New course: likely questions built from the syllabus.' : 'Reading the papers...'}</span>}
                    </StickyNote>
                  </Link>
                </li>
              )
            })}
            {comingSoon.map((s) => (
              <li key={s.id} className="rv" data-rv="deal">
                <Link to={`/${s.id}`} className={`booklet is-soon${examOver(s.exam) ? ' is-over' : ''}`}>
                  <span className="booklet__cover">
                    <span className="booklet__top"><span className="booklet__code">{s.short}</span></span>
                    <span className="booklet__exam">
                      <span className="booklet__date">{examDay(s.exam)}</span>
                      <span className="hand booklet__when">{examCountdown(s.exam)}</span>
                    </span>
                    <span className="booklet__art booklet__art--blank"><Stamp tone="ink" size="lg">Coming soon</Stamp></span>
                    <span className="booklet__label">
                      <span className="booklet__name">{s.name}</span>
                      <span className="booklet__blurb">Notes are on the way.</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section desk" aria-labelledby="desk-title">
        <div className="container">
          <div className="section-head">
            <RevealHeading id="desk-title" text="Your desk" />
            <p>What the papers keep asking, and how far you have got.</p>
          </div>
          <div className="desk-grid">
            <div className="desk-overall sheet">
              <Tape side="l" />
              <Ring value={totalDone / totalTopics} size={132} label={`${totalDone} of ${totalTopics} topics done`} />
              <p className="desk-overall__n"><b className="num">{totalDone}</b> of <span className="num">{totalTopics}</span> topics ticked off</p>
              <ul className="desk-rings">
                {subjects.map((s) => {
                  const ids = topicsOf(s.id)
                  const done = ids.filter((t) => store.done(t.id)).length
                  return (
                    <li key={s.id}>
                      <Link to={`/s/${s.id}`} aria-label={`${s.name}: ${done} of ${ids.length} done`}>
                        <Ring value={done / ids.length} size={44} color={s.accent}><span style={{ fontSize: 11 }}>{s.short}</span></Ring>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="desk-heat sheet sheet--grid"><UnitHeatmap data={data} isDone={store.done} /></div>
            <StudyNext data={data} isDone={store.done} />
          </div>

        </div>
      </section>
    </>
  )
}
