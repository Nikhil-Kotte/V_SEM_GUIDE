import { lazy, Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { subjectById } from '../content/subjects.js'
import { useSubject } from '../lib/useSubject.js'
import { useStore } from '../lib/storage.js'
import { useFancyMotion } from '../lib/motion.js'
import LearnTab from '../components/LearnTab.jsx'
import PyqTab from '../components/PyqTab.jsx'
import NumericalsTab from '../components/NumericalsTab.jsx'
import RevisionTab from '../components/RevisionTab.jsx'
import DownloadsTab from '../components/DownloadsTab.jsx'

const BandBackground = lazy(() => import('../components/BandBackground.jsx'))

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
  const fancy = useFancyMotion()

  if (!subject) return <Navigate to="/" replace />
  if (!TABS.some(([t]) => t === tab)) return <Navigate to={`/s/${subj}`} replace />

  const topicIds = data ? data.units.flatMap((u) => u.topics.map((t) => t.id)) : []
  const done = topicIds.filter((id) => store.done(id)).length
  const pyqCount = data ? data.ranked.filter((q) => q.kind !== 'predicted').length : 0

  return (
    <>
      <section className="band">
        {fancy ? <Suspense fallback={<div className="band-bg static" />}><BandBackground /></Suspense> : <div className="band-bg static" />}
        <div className="container band-inner">
          <div className="crumbs"><Link to="/">Home</Link> / {subject.short}</div>
          <h1>{subject.name}</h1>
          <div className="code">{subject.code} · Mid-2 syllabus</div>
          <div className="band-stats">
            <span><b>{topicIds.length || '…'}</b>topics</span>
            <span><b>{data ? pyqCount : '…'}</b>{subj === 'fds' ? 'related past questions' : 'past questions'}</span>
            <span><b>{done}</b>done</span>
          </div>
          {topicIds.length > 0 && (
            <div className="progress" aria-label={`${done} of ${topicIds.length} topics done`}><i style={{ width: `${(done / topicIds.length) * 100}%` }} /></div>
          )}
          <nav className="tabs" aria-label={`${subject.short} sections`}>
            {TABS.map(([id, label]) => (
              <Link key={id} to={`/s/${subj}/${id}`} className="tab" aria-current={tab === id ? 'page' : undefined}>{label}</Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="container">
        {!data ? (
          <p className="muted" style={{ padding: '60px 0' }}>Loading {subject.name}…</p>
        ) : tab === 'learn' ? <LearnTab subject={subject} data={data} focus={item} />
          : tab === 'pyqs' ? <PyqTab subject={subject} data={data} focus={item} />
            : tab === 'numericals' ? <NumericalsTab subject={subject} data={data} />
              : tab === 'revision' ? <RevisionTab subject={subject} data={data} />
                : <DownloadsTab subject={subject} />}
      </div>
    </>
  )
}
