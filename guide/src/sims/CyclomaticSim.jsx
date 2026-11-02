import { useMemo, useState } from 'react'
import { cyclomatic } from './lib/se.js'

const PRESET = 'a->bc\nbc->f\nbc->de\nf->g\nf->h\ng->i\nh->i\ni->j\nde->j\nj->a\na->k'

export default function CyclomaticSim() {
  const [text, setText] = useState(PRESET)
  const res = useMemo(() => { try { return { r: cyclomatic(text) } } catch (e) { return { error: e.message } } }, [text])

  return (
    <section className="sim" aria-labelledby="sim-cc">
      <span className="label">Unit V · Numerical</span>
      <h3 id="sim-cc">Cyclomatic complexity from a flow graph</h3>
      <p className="sim-note">Write one edge per line as <code>from-&gt;to</code>. Preloaded with the Jun &apos;23 flow graph.</p>
      <div className="sim-controls">
        <label className="field" style={{ flex: '1 1 260px' }}>Edges<textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} /></label>
      </div>
      {res.error && <p className="sim-error">{res.error}</p>}
      {res.r && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{res.r.byEdges}</b><span>V(G) = E − N + 2 = {res.r.E} − {res.r.N} + 2</span></div>
            <div><b>{res.r.byPredicates}</b><span>V(G) = P + 1 (decision nodes: {res.r.decisions.join(', ') || 'none'})</span></div>
          </div>
          <p className="sim-note">
            {res.r.byEdges === res.r.byPredicates
              ? `Both formulas agree: you need ${res.r.byEdges} independent paths (and at least that many test cases).`
              : 'The two formulas disagree. Check for a node with more than two exits or a graph that is not one connected piece.'}
            {' '}Nodes: {res.r.nodes.join(', ')}.
          </p>
        </>
      )}
    </section>
  )
}
