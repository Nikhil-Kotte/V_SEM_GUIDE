import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { m as M } from 'motion/react'
import { subjectById } from '../content/subjects.js'
import { useSubject } from '../lib/useSubject.js'
import { setPref, useStore } from '../lib/storage.js'
import LearnTab from '../components/LearnTab.jsx'
import PyqTab from '../components/PyqTab.jsx'
import NumericalsTab from '../components/NumericalsTab.jsx'
import RevisionTab from '../components/RevisionTab.jsx'
import DownloadsTab from '../components/DownloadsTab.jsx'
import TabBar from '../components/TabBar.jsx'
import ReadProgress from '../components/ReadProgress.jsx'
import CoverArt from '../components/art/covers.jsx'
import { Underline } from '../components/ink/Ink.jsx'
import Ring from '../components/ink/Ring.jsx'
import CountUp from '../components/ink/CountUp.jsx'
import UnitBars from '../components/viz/UnitBars.jsx'

const TABS = [
  ['learn', 'Learn'],
  ['pyqs', 'PYQs'],
  ['numericals', 'Numericals'],
  ['revision', 'Quick revision'],
  ['downloads', 'Downloads'],
]

export default function Subject() {
  const { subj, tab = 'learn', item } = useParams()
  const subject = subjectById[subj]
  const data = useSubject(subj)
  const store = useStore()
  const validTab = TABS.some(([t]) => t === tab)
  // Fade between tabs, but not on the first render of the page.
  const mounted = useRef(false)
  useEffect(() => { mounted.current = true }, [])

  // Remember the last place so Home can offer "pick up where you left off".
  useEffect(() => {
    if (subject && validTab) setPref('last', { subj, tab, item: tab === 'learn' ? item : undefined })
  }, [subj, tab, item]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!subject) return <Navigate to="/" replace />
  if (!validTab) return <Navigate to={`/s/${subj}`} replace />

  const topicIds = data ? data.units.flatMap((u) => u.topics.map((t) => t.id)) : []
  const done = topicIds.filter((id) => store.done(id)).length
  const pyqCount = data ? data.ranked.filter((q) => q.kind !== 'predicted').length : 0

  return (
    <>
      <section className="page-head" style={{ '--pen': subject.accent, '--pen-tint': subject.tint }}>
        <div className="container page-head__grid">
          <div>
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{subject.short}</span></nav>
          <div className="page-head__row">
            <span className="badge badge--lg" style={{ background: subject.tint, color: subject.accent }} aria-hidden="true">{subject.short}</span>
            <div>
              <h1><span className="page-head__title">{subject.name}<Underline double delay={250} /></span></h1>
              <p className="page-head__meta">
                <span className="code">{subject.code}</span>
                <span><b>{topicIds.length ? <CountUp value={topicIds.length} /> : '...'}</b> topics</span>
                <span><b>{data ? <CountUp value={pyqCount} /> : '...'}</b> {subj === 'fds' ? 'related past questions' : 'past questions'}</span>
                <span><b className="num">{done}</b> done</span>
              </p>
            </div>
          </div>
          </div>
          <div className="page-head__art" key={subj}><CoverArt id={subj} /></div>
          {data && (
            <div className="page-head__side sheet">
              <p className="page-head__side-title">Asked per unit, and how much you have done</p>
              <Ring value={done / topicIds.length} size={84} label={`${done} of ${topicIds.length} topics done`} />
              <UnitBars subject={subject} data={data} isDone={store.done} />
            </div>
          )}
        </div>
      </section>

      <div className="subject-tabs">
        <div className="container">
          <TabBar ariaLabel={`${subject.short} sections`}
            items={TABS.map(([id, label]) => ({ to: `/s/${subj}/${id}`, label, current: tab === id }))} />
        </div>
        <ReadProgress />
      </div>

      <div className="container">
        {!data ? (
          <p className="muted loading-note" aria-busy="true">Loading {subject.name}...</p>
        ) : (
          <M.div key={tab} className="tab-panel"
            initial={mounted.current ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}>
            {tab === 'learn' ? <LearnTab subject={subject} data={data} focus={item} />
              : tab === 'pyqs' ? <PyqTab subject={subject} data={data} focus={item} />
                : tab === 'numericals' ? <NumericalsTab subject={subject} data={data} />
                  : tab === 'revision' ? <RevisionTab subject={subject} data={data} />
                    : <DownloadsTab subject={subject} />}
          </M.div>
        )}
      </div>
    </>
  )
}
