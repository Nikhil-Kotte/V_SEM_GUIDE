import { useMemo, useState } from 'react'
import { kmeans, rng } from './lib/fds.js'

const COLORS = ['var(--coral)', 'var(--blue)', 'var(--green)', 'var(--gold)', 'var(--violet)', 'var(--rose)']

function makeBlobs(seed) {
  const r = rng(seed)
  const centres = [[25, 30], [70, 25], [50, 72]]
  return centres.flatMap(([cx, cy]) => Array.from({ length: 18 }, () => [cx + (r() + r() + r() - 1.5) * 18, cy + (r() + r() + r() - 1.5) * 18]))
}

export default function KMeansSim() {
  const [seed, setSeed] = useState(3)
  const [k, setK] = useState(3)
  const [points, setPoints] = useState(() => makeBlobs(3))
  const [step, setStep] = useState(Infinity)
  const res = useMemo(() => kmeans(points, k, { seed }), [points, k, seed])
  const elbow = useMemo(() => [1, 2, 3, 4, 5, 6].map((kk) => kmeans(points, kk, { seed }).wcss), [points, seed])
  const shown = Math.min(step, res.history.length - 1)
  const frame = res.history[shown]

  const S = 320
  const sx = (v) => (v / 100) * S

  const addPoint = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    setPoints((ps) => [...ps, [((e.clientX - box.left) / box.width) * 100, ((e.clientY - box.top) / box.height) * 100]])
    setStep(Infinity)
  }

  return (
    <section className="sim" aria-labelledby="sim-km">
      <span className="label">Unit V · Playground</span>
      <h3 id="sim-km">K-means playground</h3>
      <p className="sim-note">Click inside the box to add points. Step through to watch points get assigned to the nearest centre (×) and the centres move.</p>
      <div className="sim-controls">
        <label className="field">k<input type="number" min="1" max="6" value={k} onChange={(e) => { setK(Math.max(1, Math.min(6, Number(e.target.value)))); setStep(Infinity) }} style={{ width: 70 }} /></label>
        <button type="button" className="btn btn-sm" onClick={() => { const s = seed + 1; setSeed(s); setPoints(makeBlobs(s)); setStep(Infinity) }}>New random data</button>
        <button type="button" className="btn btn-sm" onClick={() => { setSeed((s) => s + 7); setStep(0) }}>New starting centres</button>
        <button type="button" className="btn btn-sm" onClick={() => setPoints([])}>Clear</button>
        <button type="button" className="btn btn-sm" onClick={() => setStep(0)}>Restart</button>
        <button type="button" className="btn btn-sm btn-ink" onClick={() => setStep((s) => Math.min(Math.min(s, res.history.length - 1) + 1, res.history.length - 1))}>Next iteration →</button>
      </div>
      {points.length < k ? <p className="sim-error">Add at least {k} points.</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 360, background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--line)', cursor: 'crosshair' }}
            onClick={addPoint} role="img" aria-label={`${points.length} points in ${k} clusters`}>
            {points.map((p, i) => <circle key={i} cx={sx(p[0])} cy={sx(p[1])} r="4.5" fill={COLORS[frame.labels[i] % COLORS.length]} opacity=".85" />)}
            {frame.centroids.map((c, j) => (
              <g key={j} transform={`translate(${sx(c[0])} ${sx(c[1])})`}>
                <path d="M-8 -8 L8 8 M-8 8 L8 -8" stroke="var(--ink)" strokeWidth="5" />
                <path d="M-8 -8 L8 8 M-8 8 L8 -8" stroke={COLORS[j % COLORS.length]} strokeWidth="2.5" />
              </g>
            ))}
          </svg>
          <div style={{ flex: '1 1 220px' }}>
            <div className="sim-result" style={{ marginTop: 0 }}>
              <div><b>{shown + 1} / {res.history.length}</b><span>iteration</span></div>
              <div><b>{Math.round(res.wcss)}</b><span>final WCSS</span></div>
            </div>
            <div className="label" style={{ marginBottom: 6 }}>Elbow plot (WCSS vs k)</div>
            <svg viewBox="0 0 220 120" width="100%" style={{ maxWidth: 260 }} role="img" aria-label="Elbow plot">
              {(() => {
                const max = Math.max(...elbow) || 1
                const px = (i) => 20 + i * 38, py = (v) => 100 - (v / max) * 85
                return (
                  <>
                    <polyline fill="none" stroke="var(--coral-deep)" strokeWidth="2" points={elbow.map((v, i) => `${px(i)},${py(v)}`).join(' ')} />
                    {elbow.map((v, i) => (
                      <g key={i}>
                        <circle cx={px(i)} cy={py(v)} r={i + 1 === k ? 5 : 3} fill={i + 1 === k ? 'var(--blue)' : 'var(--coral)'} />
                        <text x={px(i)} y={115} fontSize="10" textAnchor="middle" fill="currentColor">{i + 1}</text>
                      </g>
                    ))}
                  </>
                )
              })()}
            </svg>
          </div>
        </div>
      )}
    </section>
  )
}
