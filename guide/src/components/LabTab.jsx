import { useEffect, useState } from 'react'
import Blocks from './Blocks.jsx'
import Inline from './Inline.jsx'
import { useReveal } from './Reveal.jsx'

const LOADERS = {
  cn: () => import('../content/lab/cn.js'),
  os: () => import('../content/lab/os.js'),
  se: () => import('../content/lab/se.js'),
}

const jump = (id) => (ev) => {
  ev.preventDefault()
  document.getElementById(`lab-${id}`)?.scrollIntoView({ block: 'start' })
}

// Lab external guide: an intro, a list of experiments, then one card per experiment.
// An experiment is { id, num, title, aim, blocks, parts: [{ title, blocks }] }.
export default function LabTab({ subject, focus }) {
  const [lab, setLab] = useState(null)
  const listRef = useReveal([lab])
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

  if (!lab) return <p className="muted loading-note" aria-busy="true">Loading the lab guide...</p>

  const index = (
    <ol className="lab-index__list">
      {lab.experiments.map((e) => (
        <li key={e.id}>
          <a href={`#lab-${e.id}`} onClick={jump(e.id)}>
            <span className="lab-index__num">{e.num}</span>
            <span>{e.short || e.title}</span>
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="layout lab">
      <aside className="outline lab-index" aria-label="Experiments">
        <p className="lab-index__title">Experiments</p>
        {index}
      </aside>
      <main ref={listRef}>
        <div className="lab-intro prose"><Blocks blocks={lab.intro} /></div>
        <nav className="lab-toc" aria-label="Experiments">
          {lab.experiments.map((e) => (
            <a key={e.id} href={`#lab-${e.id}`} className="chip" onClick={jump(e.id)}>{e.num}. {e.short || e.title}</a>
          ))}
        </nav>
        {lab.experiments.map((e) => (
          <article key={e.id} id={`lab-${e.id}`} className="lab-exp rv">
            <header>
              <span className="lab-exp__num">{lab.label || 'Experiment'} {e.num}</span>
              <h2><Inline text={e.title} /></h2>
              {e.aim && <p className="aim"><Inline text={e.aim} /></p>}
            </header>
            <div className="lab-body prose">
              <Blocks blocks={e.blocks} />
              {e.parts?.map((p, i) => (
                <section key={i} className="lab-part">
                  <h3><Inline text={p.title} /></h3>
                  <Blocks blocks={p.blocks} />
                </section>
              ))}
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}
