import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subjects, comingSoon } from '../content/subjects.js'
import { syllabus } from '../content/syllabus.js'
import { loadAll } from '../lib/useSubject.js'
import { useStore } from '../lib/storage.js'
import { useFancyMotion } from '../lib/motion.js'

const HeroBackground = lazy(() => import('../components/HeroBackground.jsx'))
const HeroTitle = lazy(() => import('../components/HeroTitle.jsx'))

const topicCount = (id) => syllabus[id].reduce((n, u) => n + u.topics.length, 0)

export default function Home() {
  const [data, setData] = useState({})
  const store = useStore()
  const fancy = useFancyMotion()

  useEffect(() => {
    loadAll().then((all) => setData(Object.fromEntries(all.map((d) => [d.subject.id, d]))))
  }, [])

  const totalTopics = subjects.reduce((n, s) => n + topicCount(s.id), 0)
  const totalPyqs = Object.values(data).reduce((n, d) => n + d.ranked.filter((q) => q.count > 0).length, 0)
  const doneTopics = subjects.reduce((n, s) => n + syllabus[s.id].flatMap((u) => u.topics).filter((t) => store.done(t.id)).length, 0)

  return (
    <>
      <section className="hero">
        {fancy ? (
          <Suspense fallback={<div className="hero-bg static" />}><HeroBackground /></Suspense>
        ) : <div className="hero-bg static" />}
        <div className="container hero-inner">
          <span className="label">01 / V Sem · Mid-2 study guide</span>
          {fancy
            ? <Suspense fallback={<h1>Mid-2, made simple.</h1>}><HeroTitle /></Suspense>
            : <h1>Mid-2, made simple.</h1>}
          <p className="hero-sub">
            Every Mid-2 topic explained in plain words, with diagrams, the questions that keep coming back, and tools to practise the numericals.
          </p>
          <div className="hero-cta">
            <a href="#subjects" className="btn btn-ink" onClick={(e) => { e.preventDefault(); document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Pick a subject <span className="arrow" aria-hidden="true">↘</span>
            </a>
            <Link to="/s/os/pyqs" className="btn btn-cream">See the most-asked questions <span className="arrow" aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-meta">
            <div><strong>{subjects.length}</strong><span>subjects</span></div>
            <div><strong>{totalTopics}</strong><span>topics, in syllabus order</span></div>
            <div><strong>{totalPyqs || '…'}</strong><span>past questions, ranked</span></div>
            <div><strong>{doneTopics}</strong><span>topics you've finished</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="subjects" style={{ scrollMarginTop: 70 }}>
        <div className="container">
          <div className="section-head">
            <span className="label">02 / Pick a subject</span>
            <div>
              <h2>Where do you want to start?</h2>
              <p>Each subject has the same five tabs: <b>Learn</b>, <b>PYQs</b>, <b>Numericals</b>, <b>Quick revision</b> and <b>Downloads</b>.</p>
            </div>
          </div>
          <div className="subject-grid">
            {subjects.map((s) => {
              const d = data[s.id]
              const ids = syllabus[s.id].flatMap((u) => u.topics.map((t) => t.id))
              const done = ids.filter((id) => store.done(id)).length
              const top = d?.ranked.find((q) => q.count > 0)
              return (
                <Link key={s.id} to={`/s/${s.id}`} className="subject-card">
                  <div className="top">
                    <span className="subject-badge" style={{ background: s.tint, color: s.accent }}>{s.short}</span>
                    <span className="label">{s.code}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.blurb}</p>
                  <div>
                    <div className="progress" aria-label={`${done} of ${ids.length} topics done`}><i style={{ width: `${(done / ids.length) * 100}%` }} /></div>
                    <span className="faint" style={{ fontSize: 13 }}>{done}/{ids.length} topics done</span>
                  </div>
                  <div className="hot">
                    {top
                      ? <>🔥 <b>Most asked ({top.count}×):</b> {top.q}</>
                      : d ? <>New course — no past papers yet, so we built <b>likely questions</b> from the syllabus.</> : 'Loading…'}
                  </div>
                </Link>
              )
            })}
            {comingSoon.map((s) => (
              <Link key={s.id} to={`/${s.id}`} className="subject-card soon">
                <div className="top">
                  <span className="subject-badge" style={{ background: 'var(--surface-2)' }}>{s.short}</span>
                  <span className="chip">Coming soon</span>
                </div>
                <h3>{s.name}</h3>
                <p>{s.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="how">
            <div><span className="label">01 / Learn</span><h3>Read it like a story</h3><p>Every topic starts with a one-line summary, then a plain explanation, a diagram and how to write it in the exam.</p></div>
            <div><span className="label">02 / PYQs</span><h3>Most repeated first</h3><p>Questions are ranked by how many papers asked them, then by how recently. Only questions inside your Mid-2 syllabus.</p></div>
            <div><span className="label">03 / Practise</span><h3>Try the numericals</h3><p>Page replacement, disk scheduling, Banker's, COCOMO, subnetting and more, with past-paper data loaded in.</p></div>
            <div><span className="label">04 / Revise</span><h3>One page per subject</h3><p>Quick revision puts every topic's one-liner on a single page for the night before.</p></div>
          </div>
        </div>
      </section>
    </>
  )
}
