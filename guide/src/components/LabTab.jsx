import { useEffect, useState } from 'react'
import Blocks from './Blocks.jsx'
import Inline from './Inline.jsx'

const LOADERS = {
  cn: () => import('../content/lab/cn.js'),
  os: () => import('../content/lab/os.js'),
  se: () => import('../content/lab/se.js'),
}

export const LAB_SUBJECTS = ['cn', 'os', 'se']

// Lab external guide: an intro, a list of experiments, then one card per experiment.
// An experiment is { id, num, title, aim, blocks, parts: [{ title, blocks }] }.
export default function LabTab({ subject, focus }) {
  const [lab, setLab] = useState(null)
  useEffect(() => {
    let live = true
    setLab(null)
    LOADERS[subject.id]().then((m) => live && setLab(m.default))
    return () => { live = false }
  }, [subject.id])

  useEffect(() => {
    if (!lab || !focus) return
    document.getElementById(`lab-${focus}`)?.scrollIntoView({ block: 'start' })
  }, [lab, focus])

  if (!lab) return <p className="muted" style={{ padding: '60px 0' }}>Loading the lab guide…</p>

  return (
    <div className="lab">
      <div className="lab-intro prose"><Blocks blocks={lab.intro} /></div>
      <nav aria-label="Experiments">
        <ol className="lab-toc">
          {lab.experiments.map((e) => (
            <li key={e.id}><a href={`#lab-${e.id}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(`lab-${e.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{e.num}. {e.short || e.title}</a></li>
          ))}
        </ol>
      </nav>
      {lab.experiments.map((e) => (
        <article key={e.id} id={`lab-${e.id}`} className="lab-exp">
          <header>
            <span className="num">{lab.label || 'Experiment'} {e.num}</span>
            <h3><Inline text={e.title} /></h3>
            {e.aim && <p className="aim"><Inline text={e.aim} /></p>}
          </header>
          <div className="lab-body prose">
            <Blocks blocks={e.blocks} />
            {e.parts?.map((p, i) => (
              <section key={i} className="lab-part">
                <h4><Inline text={p.title} /></h4>
                <Blocks blocks={p.blocks} />
              </section>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
