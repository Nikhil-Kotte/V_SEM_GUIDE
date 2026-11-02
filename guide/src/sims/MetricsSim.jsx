import { useState } from 'react'
import { regressionMetrics } from './lib/fds.js'
import { parseNums } from './lib/os.js'

const f = (n) => (n == null ? '—' : Number(n.toFixed(4)).toString())

export default function MetricsSim() {
  const [yText, setY] = useState('3 5 7')
  const [pText, setP] = useState('2 5 9')
  const y = parseNums(yText), p = parseNums(pText)
  const bad = [...y, ...p].some((v) => !Number.isFinite(v))
  const r = bad ? { error: 'Use numbers only.' } : regressionMetrics(y, p)

  return (
    <section className="sim" aria-labelledby="sim-metrics">
      <span className="label">Unit V · Numerical</span>
      <h3 id="sim-metrics">Regression metrics calculator</h3>
      <p className="sim-note">Enter actual and predicted values. Preloaded with the worked example.</p>
      <div className="sim-controls">
        <label className="field" style={{ flex: '1 1 220px' }}>Actual y<input value={yText} onChange={(e) => setY(e.target.value)} /></label>
        <label className="field" style={{ flex: '1 1 220px' }}>Predicted ŷ<input value={pText} onChange={(e) => setP(e.target.value)} /></label>
      </div>
      {r.error && <p className="sim-error">{r.error}</p>}
      {!r.error && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{f(r.mae)}</b><span>MAE</span></div>
            <div><b>{f(r.mse)}</b><span>MSE</span></div>
            <div><b>{f(r.rmse)}</b><span>RMSE</span></div>
            <div><b>{r.r2 == null ? 'undefined' : f(r.r2)}</b><span>R²</span></div>
          </div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Working">
            <table>
              <thead><tr><th>i</th><th>y</th><th>ŷ</th><th>e = y − ŷ</th><th>|e|</th><th>e²</th><th>(y − ȳ)²</th></tr></thead>
              <tbody>
                {y.map((v, i) => <tr key={i}><td>{i + 1}</td><td>{v}</td><td>{p[i]}</td><td>{f(r.err[i])}</td><td>{f(Math.abs(r.err[i]))}</td><td>{f(r.err[i] ** 2)}</td><td>{f((v - r.mean) ** 2)}</td></tr>)}
                <tr><td colSpan={4}><b>Sums</b> (ȳ = {f(r.mean)})</td><td>{f(r.mae * r.n)}</td><td>SS_res = {f(r.ssRes)}</td><td>SS_tot = {f(r.ssTot)}</td></tr>
              </tbody>
            </table>
          </div>
          {r.r2 == null && <p className="sim-note">All actual values are equal, so SS_tot = 0 and R² can&apos;t be computed.</p>}
        </>
      )}
    </section>
  )
}
