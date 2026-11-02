import { Link, Navigate, useParams } from 'react-router-dom'
import { subjectById } from '../content/subjects.js'
import { useSubject } from '../lib/useSubject.js'
import { useStore } from '../lib/storage.js'
import LearnTab from '../components/LearnTab.jsx'
import PyqTab from '../components/PyqTab.jsx'
import NumericalsTab from '../components/NumericalsTab.jsx'
import RevisionTab from '../components/RevisionTab.jsx'
import DownloadsTab from '../components/DownloadsTab.jsx'
import FoldText from '../components/bits/FoldText.jsx'
import DecryptedText from '../components/bits/DecryptedText.jsx'

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

  if (!subject) return <Navigate to="/" replace />
  if (!TABS.some(([t]) => t === tab)) return <Navigate to={`/s/${subj}`} replace />

  const topicIds = data ? data.units.flatMap((u) => u.topics.map((t) => t.id)) : []
  const done = topicIds.filter((id) => store.done(id)).length
  const pyqCount = data ? data.ranked.filter((q) => q.kind !== 'predicted').length : 0

  return (
    <>
      <section className="band">
        <div className="band-bg static" />
        <div className="container band-inner">
          <div className="crumbs"><Link to="/">Home</Link> / {subject.short}</div>
          <h1 aria-label={subject.name}>
            <FoldText key={subj} text={subject.name} foldStyle="paper" splitBy="char" hinge="top" trigger="mount"
              stagger={0.03} duration={0.6} hoverRefold refoldRadius={110} refoldAngle={35}
              fontSize="inherit" fontWeight={800} color="currentColor" />
          </h1>
          <div className="code">
            <DecryptedText key={subj} text={`${subject.code} · Mid-2 syllabus`} animateOn="view" sequential
              revealDirection="start" speed={35} useOriginalCharsOnly={false} characters="0123456789ABCDEFX/#" />
          </div>
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
