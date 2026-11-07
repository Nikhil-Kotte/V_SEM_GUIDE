import { Link, Navigate, useParams } from 'react-router-dom'
import { subjectById } from '../content/subjects.js'
import LabTab, { LAB_SUBJECTS } from '../components/LabTab.jsx'

// Stand-alone page for one lab external: /lab/:subj/:item?
export default function Lab() {
  const { subj, item } = useParams()
  const subject = subjectById[subj]
  if (!subject || !LAB_SUBJECTS.includes(subj)) return <Navigate to="/lab/cn" replace />

  return (
    <>
      <section className="band">
        <div className="band-bg static" />
        <div className="container band-inner">
          <div className="crumbs"><Link to="/">Home</Link> / Lab externals / {subject.short}</div>
          <h1>{subject.short} Lab external</h1>
          <div className="code">{subject.name} · experiments, code and expected output</div>
          <nav className="tabs" aria-label="Lab externals">
            {LAB_SUBJECTS.map((id) => (
              <Link key={id} to={`/lab/${id}`} className="tab" aria-current={id === subj ? 'page' : undefined}>{subjectById[id].short} Lab</Link>
            ))}
          </nav>
        </div>
      </section>
      <div className="container">
        <LabTab key={subj} subject={subject} focus={item} />
      </div>
    </>
  )
}
