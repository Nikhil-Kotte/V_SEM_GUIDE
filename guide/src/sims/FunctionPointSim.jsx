import { useState } from 'react'
import { FP_WEIGHTS, GSC, functionPoints } from './lib/se.js'

const LEVELS = ['Simple', 'Average', 'Complex']

export default function FunctionPointSim() {
  const [counts, setCounts] = useState({ ei: 50, eo: 40, eq: 35, ilf: 6, eif: 4 })
  const [levels, setLevels] = useState({ ei: 1, eo: 1, eq: 1, ilf: 1, eif: 1 })
  const [fi, setFi] = useState(Array(14).fill(3))
  const [showGsc, setShowGsc] = useState(false)
  const r = functionPoints(counts, levels, fi)

  return (
    <section className="sim" aria-labelledby="sim-fp">
      <span className="label">Unit III · Numerical</span>
      <h3 id="sim-fp">Function point calculator</h3>
      <p className="sim-note">Preloaded with May &apos;25 (50 / 40 / 35 / 6 / 4, average weights). The paper gives no ratings for the 14 factors, so all are set to 3 (average). Say so in your answer.</p>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Domain values">
        <table>
          <thead><tr><th>Domain value</th><th>Count</th><th>Complexity</th><th>Weight</th><th>Count × weight</th></tr></thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.key}>
                <td>{FP_WEIGHTS[row.key].label}</td>
                <td><input type="number" min="0" aria-label={`${FP_WEIGHTS[row.key].label} count`} value={counts[row.key]} onChange={(e) => setCounts({ ...counts, [row.key]: Math.max(0, Number(e.target.value)) })} style={{ width: 80 }} className="select" /></td>
                <td>
                  <select className="select" aria-label={`${FP_WEIGHTS[row.key].label} complexity`} value={levels[row.key]} onChange={(e) => setLevels({ ...levels, [row.key]: Number(e.target.value) })}>
                    {LEVELS.map((l, i) => <option key={l} value={i}>{l}</option>)}
                  </select>
                </td>
                <td>{row.weight}</td>
                <td><b>{row.total}</b></td>
              </tr>
            ))}
            <tr><td colSpan={4}><b>Unadjusted function points (UFP)</b></td><td><b>{r.ufp}</b></td></tr>
          </tbody>
        </table>
      </div>
      <div className="sim-controls">
        <button type="button" className="btn btn-sm" aria-expanded={showGsc} onClick={() => setShowGsc((s) => !s)}>{showGsc ? 'Hide' : 'Edit'} the 14 adjustment factors (ΣFi = {r.sumFi})</button>
        <button type="button" className="btn btn-sm" onClick={() => setFi(Array(14).fill(3))}>All average (3)</button>
      </div>
      {showGsc && (
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', marginBottom: 12 }}>
          {GSC.map((g, i) => (
            <label key={g} className="field" style={{ fontWeight: 500 }}>{i + 1}. {g}
              <select value={fi[i]} onChange={(e) => setFi(fi.map((x, j) => (j === i ? Number(e.target.value) : x)))}>
                {[0, 1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v} — {['none', 'incidental', 'moderate', 'average', 'significant', 'essential'][v]}</option>)}
              </select>
            </label>
          ))}
        </div>
      )}
      <div className="sim-result" aria-live="polite">
        <div><b>{r.ufp}</b><span>UFP</span></div>
        <div><b>{r.caf.toFixed(2)}</b><span>CAF = 0.65 + 0.01 × {r.sumFi}</span></div>
        <div><b>{r.fp.toFixed(2)}</b><span>FP = UFP × CAF</span></div>
      </div>
    </section>
  )
}
