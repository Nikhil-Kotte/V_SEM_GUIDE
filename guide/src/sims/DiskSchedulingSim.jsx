import { useMemo, useState } from 'react'
import { diskSchedule, parseNums } from './lib/os.js'

const ALGOS = ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK']
const PRESETS = [
  { label: "May '25 — 0–4999, head 2150, prev 1805", min: 0, max: 4999, head: 2150, prev: 1805, queue: '2069 1212 2296 2800 544 1618 356 1523 4965 3681' },
  { label: 'Textbook — 0–199, head 53, moving down', min: 0, max: 199, head: 53, prev: 60, queue: '98 183 37 122 14 124 65 67' },
  { label: "Jan '23 — head 40", min: 0, max: 199, head: 40, prev: 30, queue: '68 78 42 32 93 35 82' },
  { label: "Jan '23 IT — SSTF, arm at 100", min: 0, max: 200, head: 100, prev: 90, queue: '30 85 90 100 105 110 135 145' },
]

export default function DiskSchedulingSim() {
  const [p, setP] = useState(PRESETS[0])
  const [queueText, setQueueText] = useState(PRESETS[0].queue)
  const [algo, setAlgo] = useState('SCAN')
  const [countJump, setCountJump] = useState(true)
  const set = (k) => (e) => setP((o) => ({ ...o, [k]: Number(e.target.value) }))

  const queue = useMemo(() => parseNums(queueText), [queueText])
  const direction = p.prev <= p.head ? 'up' : 'down'
  const error = !queue.length ? 'Enter at least one request.'
    : queue.some((c) => !Number.isFinite(c) || c < p.min || c > p.max) || p.head < p.min || p.head > p.max ? `All cylinders must be between ${p.min} and ${p.max}.` : null
  const res = useMemo(() => (error ? null : diskSchedule(algo, p.head, queue, { min: p.min, max: p.max, direction, countJump })), [algo, p, queue, direction, countJump, error])
  const all = useMemo(() => (error ? {} : Object.fromEntries(ALGOS.map((a) => [a, diskSchedule(a, p.head, queue, { min: p.min, max: p.max, direction, countJump }).total]))), [p, queue, direction, countJump, error])

  // SVG: cylinders on the x-axis, time going down.
  const W = 720, rowH = 26, pad = 28
  const x = (c) => pad + ((c - p.min) / (p.max - p.min || 1)) * (W - 2 * pad)
  const H = res ? pad + res.path.length * rowH : 0
  const ticks = res ? [...new Set([p.min, p.max, ...res.path])].sort((a, b) => a - b) : []

  return (
    <section className="sim" aria-labelledby="sim-disk">
      <span className="label">Unit III · Numerical</span>
      <h3 id="sim-disk">Disk scheduling visualiser</h3>
      <p className="sim-note">The direction comes from the previous request: previous below the head means the head is moving up (towards {p.max}).</p>

      <div className="sim-controls">
        <label className="field">Preset
          <select defaultValue="0" onChange={(e) => { const n = PRESETS[e.target.value]; setP(n); setQueueText(n.queue) }}>
            {PRESETS.map((x, i) => <option key={i} value={i}>{x.label}</option>)}
          </select>
        </label>
        <label className="field">Lowest cyl.<input type="number" value={p.min} onChange={set('min')} style={{ width: 90 }} /></label>
        <label className="field">Highest cyl.<input type="number" value={p.max} onChange={set('max')} style={{ width: 90 }} /></label>
        <label className="field">Head at<input type="number" value={p.head} onChange={set('head')} style={{ width: 90 }} /></label>
        <label className="field">Previous request<input type="number" value={p.prev} onChange={set('prev')} style={{ width: 100 }} /></label>
        <label className="field" style={{ flex: '1 1 300px' }}>Request queue<input value={queueText} onChange={(e) => setQueueText(e.target.value)} /></label>
      </div>
      <div className="sim-controls" style={{ marginTop: 0 }}>
        <div className="seg" role="group" aria-label="Algorithm" style={{ flexWrap: 'wrap' }}>
          {ALGOS.map((a) => <button key={a} type="button" aria-pressed={algo === a} onClick={() => setAlgo(a)}>{a}</button>)}
        </div>
        {(algo === 'C-SCAN' || algo === 'C-LOOK') && (
          <label className="toggle"><input type="checkbox" checked={countJump} onChange={(e) => setCountJump(e.target.checked)} /> Count the return jump in the total</label>
        )}
      </div>

      {error && <p className="sim-error">{error}</p>}
      {res && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{res.total}</b><span>total head movement (cylinders)</span></div>
            <div><b>{direction === 'up' ? '↑ up' : '↓ down'}</b><span>initial direction</span></div>
            <div><b style={{ fontSize: 15, lineHeight: 1.4 }}>{ALGOS.map((a) => `${a} ${all[a]}`).join(' · ')}</b><span>all algorithms, same input</span></div>
          </div>
          <div className="grid-scroll" style={{ background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--line)' }}>
            <svg viewBox={`0 0 ${W} ${H + 10}`} width="100%" style={{ minWidth: 560, display: 'block' }} role="img" aria-label={`Head path: ${res.path.join(' → ')}`}>
              <line x1={pad} x2={W - pad} y1={pad - 8} y2={pad - 8} stroke="currentColor" opacity=".35" />
              {ticks.map((c, i) => (
                <g key={c}>
                  <line x1={x(c)} x2={x(c)} y1={pad - 12} y2={pad - 4} stroke="currentColor" opacity=".5" />
                  <text x={x(c)} y={i % 2 ? pad - 16 : pad - 22} fontSize="10" textAnchor="middle" fill="currentColor" opacity=".7">{c}</text>
                </g>
              ))}
              {res.moves.map((m, i) => (
                <line key={i} x1={x(m.from)} y1={pad + i * rowH} x2={x(m.to)} y2={pad + (i + 1) * rowH}
                  stroke={m.jump ? 'var(--blue)' : 'var(--coral-deep)'} strokeWidth="2.2" strokeDasharray={m.jump ? '5 4' : undefined} />
              ))}
              {res.path.map((c, i) => (
                <g key={i}>
                  <circle cx={x(c)} cy={pad + i * rowH} r={i === 0 ? 6 : 4.5} fill={i === 0 ? 'var(--ink)' : 'var(--coral)'} stroke="var(--surface)" strokeWidth="1.5" />
                  <text x={x(c) + 8} y={pad + i * rowH + 4} fontSize="11" fill="currentColor">{c}</text>
                </g>
              ))}
            </svg>
          </div>
          <p className="sim-note" style={{ marginTop: 10, overflowWrap: 'anywhere' }}>
            <b>Working:</b> {res.moves.map((m) => `|${m.to} − ${m.from}|${m.jump && !countJump ? '(jump, not counted)' : ''}`).join(' + ')} = <b>{res.total}</b>
          </p>
          {(algo === 'C-SCAN' || algo === 'C-LOOK') && <p className="sim-note">Dashed blue line = the return jump. Textbooks differ on counting it, so say which convention you used in the exam.</p>}
        </>
      )}
    </section>
  )
}
