import { useState } from 'react'
import { COCOMO_MODES, cocomoBasic } from './lib/se.js'

const f = (n, d = 2) => n.toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d })

export default function CocomoSim() {
  const [kloc, setKloc] = useState(200)
  const [mode, setMode] = useState('semidetached')
  const valid = kloc > 0 && kloc < 100000
  const r = valid ? cocomoBasic(kloc, mode) : null
  const m = COCOMO_MODES[mode]

  return (
    <section className="sim" aria-labelledby="sim-cocomo">
      <span className="label">Unit III · Numerical</span>
      <h3 id="sim-cocomo">Basic COCOMO calculator</h3>
      <p className="sim-note">Preloaded with May &apos;25: 200 KLOC, average-experience team, schedule not tight (semi-detached).</p>
      <div className="sim-controls">
        <label className="field">Size (KLOC)<input type="number" min="1" value={kloc} onChange={(e) => setKloc(Number(e.target.value))} style={{ width: 120 }} /></label>
        <div className="seg" role="group" aria-label="Project mode">
          {Object.entries(COCOMO_MODES).map(([k, v]) => <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)}>{v.label}</button>)}
        </div>
      </div>
      {!valid && <p className="sim-error">Enter a size in KLOC greater than 0.</p>}
      {r && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{f(r.effort)}</b><span>effort (person-months)</span></div>
            <div><b>{f(r.time)}</b><span>development time (months)</span></div>
            <div><b>{f(r.staff)}</b><span>average staff</span></div>
            <div><b>{f(r.productivity)}</b><span>productivity (LOC/pm)</span></div>
          </div>
          <ol className="steps">
            <li>E = a × KLOC<sup>b</sup> = {m.a} × {kloc}<sup>{m.b}</sup> = {m.a} × {f(kloc ** m.b)} = <b>{f(r.effort)} pm</b></li>
            <li>D = c × E<sup>d</sup> = {m.c} × {f(r.effort)}<sup>{m.d}</sup> = <b>{f(r.time)} months</b></li>
            <li>Staff = E ÷ D = {f(r.effort)} ÷ {f(r.time)} = <b>{f(r.staff)}</b> persons</li>
            <li>Productivity = {f(kloc * 1000, 0)} LOC ÷ {f(r.effort)} pm = <b>{f(r.productivity)} LOC/pm</b></li>
          </ol>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="All modes">
            <table>
              <thead><tr><th>Mode</th><th>a, b, c, d</th><th>Effort (pm)</th><th>Time (months)</th></tr></thead>
              <tbody>{Object.entries(COCOMO_MODES).map(([k, v]) => { const x = cocomoBasic(kloc, k); return <tr key={k}><td>{v.label}</td><td>{v.a}, {v.b}, {v.c}, {v.d}</td><td>{f(x.effort)}</td><td>{f(x.time)}</td></tr> })}</tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
