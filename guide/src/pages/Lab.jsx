import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { m as M } from 'motion/react'
import { subjectById } from '../content/subjects.js'
import LabTab from '../components/LabTab.jsx'
import VivaTab from '../components/VivaTab.jsx'
import TabBar from '../components/TabBar.jsx'

const LAB_SUBJECTS = ['cn', 'os', 'se']

// Stand-alone page for one lab external: /lab/:subj (experiments), /lab/:subj/:experiment, /lab/:subj/viva
export default function Lab() {
  const { subj, item } = useParams()
  const subject = subjectById[subj]
  const mounted = useRef(false)
  useEffect(() => { mounted.current = true }, [])
  if (!subject || !LAB_SUBJECTS.includes(subj)) return <Navigate to="/lab/cn" replace />
  const viva = item === 'viva'

  return (
    <>
      <section className="page-head">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>Lab externals</span></nav>
          <div className="page-head__row">
            <span className="badge badge--lg" style={{ background: subject.tint, color: subject.accent }} aria-hidden="true">{subject.short}</span>
            <div>
              <h1>{subject.short} Lab external</h1>
              <p className="page-head__meta"><span>{subject.name}: experiments, code, expected output and viva questions</span></p>
            </div>
          </div>
          <nav className="lab-switch" aria-label="Other labs">
            <span className="faint">Other labs:</span>
            {LAB_SUBJECTS.filter((id) => id !== subj).map((id) => (
              <Link key={id} to={`/lab/${id}${viva ? '/viva' : ''}`} className="chip">{subjectById[id].short} Lab</Link>
            ))}
          </nav>
        </div>
      </section>
      <div className="subject-tabs">
        <div className="container">
          <TabBar ariaLabel={`${subject.short} lab sections`} items={[
            { to: `/lab/${subj}`, label: 'Experiments', current: !viva },
            { to: `/lab/${subj}/viva`, label: 'Viva questions', current: viva },
          ]} />
        </div>
      </div>
      <div className="container">
        <M.div key={`${subj}-${viva}`} initial={mounted.current ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}>
          {viva ? <VivaTab subject={subject} /> : <LabTab subject={subject} focus={item} />}
        </M.div>
      </div>
    </>
  )
}
