import { useEffect, useMemo, useState } from 'react'
import { pageReplacement, parseNums } from './lib/os.js'

const PRESETS = [
  { label: "Nov '25 — Optimal, 3 frames", refs: '7 2 3 1 2 5 3 4 6 7 7 1 0 5 4 6 2 3 0 1', frames: 3, algo: 'OPT' },
  { label: 'Textbook string, 3 frames', refs: '7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1', frames: 3, algo: 'LRU' },
  { label: "Jun '24 AIML — LRU, 3 frames", refs: '5 0 2 1 0 3 0 2 4 3 0 3 2 1 3 0 1 5', frames: 3, algo: 'LRU' },
  { label: "Jan '23 — FIFO vs OPT, 3 frames", refs: '1 2 3 4 1 2 3 4 2 1 3 4', frames: 3, algo: 'FIFO' },
  { label: "Belady's anomaly (try 3, then 4 frames)", refs: '1 2 3 4 1 2 5 1 2 3 4 5', frames: 3, algo: 'FIFO' },
]
const ALGOS = [['FIFO', 'FIFO'], ['LRU', 'LRU'], ['OPT', 'Optimal']]

export default function PageReplacementSim() {
  const [refsText, setRefsText] = useState(PRESETS[0].refs)
  const [frames, setFrames] = useState(3)
  const [algo, setAlgo] = useState('OPT')
  const [step, setStep] = useState(Infinity)
  const [playing, setPlaying] = useState(false)

  const refs = useMemo(() => parseNums(refsText).filter((n) => Number.isFinite(n)), [refsText])
  const valid = refs.length > 0 && refs.length <= 60 && frames >= 1 && frames <= 8
  const result = useMemo(() => (valid ? pageReplacement(refs, frames, algo) : null), [refs, frames, algo, valid])
  const all = useMemo(() => (valid ? Object.fromEntries(ALGOS.map(([a]) => [a, pageReplacement(refs, frames, a).faults])) : {}), [refs, frames, valid])
  const shown = Math.min(step, refs.length)

  useEffect(() => {
    if (!playing) return
    if (shown >= refs.length) { setPlaying(false); return }
    const t = setTimeout(() => setStep((s) => Math.min(s, refs.length) + 1), 550)
    return () => clearTimeout(t)
  }, [playing, shown, refs.length])

  const faultsSoFar = result ? result.steps.slice(0, shown).filter((s) => !s.hit).length : 0

  return (
    <section className="sim" aria-labelledby="sim-pr">
      <span className="label">Unit III · Numerical</span>
      <h3 id="sim-pr">Page replacement, step by step</h3>
      <p className="sim-note">Type any reference string. Orange = page loaded on a fault, green = hit. Step through to see exactly which page gets replaced.</p>

      <div className="sim-controls">
        <label className="field" style={{ flex: '1 1 320px' }}>Reference string
          <input value={refsText} onChange={(e) => { setRefsText(e.target.value); setStep(Infinity) }} inputMode="numeric" />
        </label>
        <label className="field">Frames
          <input type="number" min="1" max="8" value={frames} onChange={(e) => { setFrames(Number(e.target.value)); setStep(Infinity) }} style={{ width: 80 }} />
        </label>
        <label className="field">Past-paper preset
          <select onChange={(e) => { const p = PRESETS[e.target.value]; setRefsText(p.refs); setFrames(p.frames); setAlgo(p.algo); setStep(Infinity) }} defaultValue="0">
            {PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
          </select>
        </label>
      </div>

      <div className="sim-controls" style={{ marginTop: 0 }}>
        <div className="seg" role="group" aria-label="Algorithm">
          {ALGOS.map(([a, label]) => <button key={a} type="button" aria-pressed={algo === a} onClick={() => setAlgo(a)}>{label}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="btn btn-sm" onClick={() => { setPlaying(false); setStep(0) }}>Reset</button>
          <button type="button" className="btn btn-sm" onClick={() => setStep((s) => Math.max(0, Math.min(s, refs.length) - 1))} disabled={shown === 0}>← Step</button>
          <button type="button" className="btn btn-sm" onClick={() => setStep((s) => Math.min(s, refs.length) + 1)} disabled={shown >= refs.length}>Step →</button>
          <button type="button" className="btn btn-sm btn-ink" onClick={() => { if (shown >= refs.length) setStep(0); setPlaying((p) => !p) }}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" className="btn btn-sm" onClick={() => { setPlaying(false); setStep(Infinity) }}>Show all</button>
        </div>
      </div>

      {!valid && <p className="sim-error">Enter 1–60 page numbers and 1–8 frames.</p>}
      {result && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{faultsSoFar}</b><span>page faults{shown < refs.length ? ` (after ${shown} of ${refs.length})` : ''}</span></div>
            <div><b>{shown - faultsSoFar}</b><span>hits</span></div>
            <div><b>{shown ? Math.round(((shown - faultsSoFar) / shown) * 100) : 0}%</b><span>hit ratio</span></div>
            <div><b>{ALGOS.map(([a]) => `${a} ${all[a]}`).join(' · ')}</b><span>total faults, all three algorithms</span></div>
          </div>
          <div className="grid-scroll" tabIndex={0} role="region" aria-label="Frame table">
            <table className="frame-grid">
              <thead><tr><th scope="col" aria-label="frame" />{refs.map((r, i) => <th key={i} scope="col" className={i === shown - 1 ? 'current' : undefined}>{r}</th>)}</tr></thead>
              <tbody>
                {Array.from({ length: frames }, (_, f) => (
                  <tr key={f}>
                    <th scope="row">F{f + 1}</th>
                    {result.steps.map((s, i) => {
                      if (i >= shown) return <td key={i} />
                      const v = s.frames[f]
                      const cls = !s.hit && s.slot === f ? 'new' : s.hit && s.slot === f ? 'hitcell' : ''
                      return <td key={i} className={cls}>{v ?? ''}</td>
                    })}
                  </tr>
                ))}
                <tr className="status">
                  <th scope="row" />
                  {result.steps.map((s, i) => <td key={i} className={i < shown ? (s.hit ? 'h' : 'f') : ''}>{i < shown ? (s.hit ? 'H' : 'F') : ''}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="sim-note" style={{ marginTop: 8 }}>
            {algo === 'FIFO' && 'FIFO replaces the page that has been in memory the longest.'}
            {algo === 'LRU' && 'LRU replaces the page whose last use is furthest in the past.'}
            {algo === 'OPT' && 'Optimal replaces the page whose next use is furthest in the future (or never). Ties go to the page loaded first.'}
          </p>
        </>
      )}
    </section>
  )
}
