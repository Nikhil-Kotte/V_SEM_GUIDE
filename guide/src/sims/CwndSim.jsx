import { useMemo, useState } from 'react'
import { cwndTrace } from './lib/cn.js'
import { parseNums } from './lib/os.js'

export default function CwndSim() {
  const [initial, setInitial] = useState(2)
  const [ssthresh, setSsthresh] = useState(8)
  const [rounds, setRounds] = useState(10)
  const [lossText, setLossText] = useState('5')
  const [reset, setReset] = useState('initial')
  const [mode, setMode] = useState('tahoe')
  const timeouts = parseNums(lossText).filter((n) => Number.isInteger(n) && n > 0)
  const valid = initial >= 1 && ssthresh >= 1 && rounds >= 1 && rounds <= 40
  const t = useMemo(() => (valid ? cwndTrace({ initial, ssthresh, rounds, timeouts, reset, mode }) : []), [initial, ssthresh, rounds, lossText, reset, mode, valid]) // eslint-disable-line react-hooks/exhaustive-deps

  const W = 640, H = 260, pad = 36
  const maxY = Math.max(4, ...t.map((x) => Math.max(x.cwnd, x.ssthresh))) + 1
  const x = (r) => pad + ((r - 1) / Math.max(1, rounds - 1)) * (W - 2 * pad)
  const y = (v) => H - pad - (v / maxY) * (H - 2 * pad)

  return (
    <section className="sim" aria-labelledby="sim-cwnd">
      <div className="sim-head">
        <h3 id="sim-cwnd">TCP congestion window (slow start + AIMD)</h3>
        <span className="sim-unit">Unit IV</span>
      </div>
      <p className="sim-note">Preloaded with Dec &apos;22: initial window 2 MSS, threshold 8, timeout at the 5th transmission. Window doubles below the threshold, grows by 1 above it.</p>
      <div className="sim-controls">
        <label className="field">Initial cwnd (MSS)<input type="number" min="1" value={initial} onChange={(e) => setInitial(Number(e.target.value))} style={{ width: 90 }} /></label>
        <label className="field">ssthresh (MSS)<input type="number" min="1" value={ssthresh} onChange={(e) => setSsthresh(Number(e.target.value))} style={{ width: 90 }} /></label>
        <label className="field">Transmissions<input type="number" min="1" max="40" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} style={{ width: 90 }} /></label>
        <label className="field">Loss at transmission(s)<input value={lossText} onChange={(e) => setLossText(e.target.value)} style={{ width: 130 }} /></label>
      </div>
      <div className="sim-controls" style={{ marginTop: 0 }}>
        <div className="seg" role="group" aria-label="Variant">
          <button type="button" aria-pressed={mode === 'tahoe'} onClick={() => setMode('tahoe')}>Timeout (Tahoe)</button>
          <button type="button" aria-pressed={mode === 'reno'} onClick={() => setMode('reno')}>3 dup ACKs (Reno)</button>
        </div>
        {mode === 'tahoe' && (
          <div className="seg" role="group" aria-label="Window after timeout">
            <button type="button" aria-pressed={reset === 'initial'} onClick={() => setReset('initial')}>Restart from initial window</button>
            <button type="button" aria-pressed={reset === 'one'} onClick={() => setReset('one')}>Restart from 1 MSS</button>
          </div>
        )}
      </div>
      {!valid && <p className="sim-error">Use positive values and at most 40 transmissions.</p>}
      {valid && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{t.at(-1).cwnd} MSS</b><span>window at transmission {rounds}</span></div>
            <div><b>{t.at(-1).ssthresh}</b><span>threshold then</span></div>
          </div>
          <div className="grid-scroll" style={{ background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--line)' }}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 480, display: 'block' }} role="img" aria-label={`cwnd values: ${t.map((p) => p.cwnd).join(', ')}`}>
              <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} stroke="currentColor" opacity=".4" />
              <line x1={pad} x2={pad} y1={pad / 2} y2={H - pad} stroke="currentColor" opacity=".4" />
              <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="currentColor" opacity=".7">transmission number</text>
              <polyline fill="none" stroke="var(--blue)" strokeDasharray="5 4" strokeWidth="1.5" points={t.map((p) => `${x(p.round)},${y(p.ssthresh)}`).join(' ')} />
              <polyline fill="none" stroke="var(--coral-deep)" strokeWidth="2.5" points={t.map((p) => `${x(p.round)},${y(p.cwnd)}`).join(' ')} />
              {t.map((p) => (
                <g key={p.round}>
                  <circle cx={x(p.round)} cy={y(p.cwnd)} r={p.loss ? 6 : 4} fill={p.loss ? 'var(--rose)' : 'var(--coral)'} />
                  <text x={x(p.round)} y={y(p.cwnd) - 9} textAnchor="middle" fontSize="11" fill="currentColor">{p.cwnd}</text>
                  <text x={x(p.round)} y={H - pad + 14} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".7">{p.round}</text>
                </g>
              ))}
              <text x={W - pad} y={y(t.at(-1).ssthresh) - 6} textAnchor="end" fontSize="10.5" fill="var(--blue)">ssthresh</text>
            </svg>
          </div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Window per transmission" style={{ marginTop: 12 }}>
            <table>
              <thead><tr><th>Transmission</th>{t.map((p) => <th key={p.round}>{p.round}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">cwnd</th>{t.map((p) => <td key={p.round} style={p.loss ? { color: 'var(--rose)', fontWeight: 700 } : undefined}>{p.cwnd}{p.loss ? '✗' : ''}</td>)}</tr>
                <tr><th scope="row">ssthresh</th>{t.map((p) => <td key={p.round}>{p.ssthresh}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p className="sim-note" style={{ marginTop: 8 }}>On loss: ssthresh = ⌊cwnd / 2⌋, then {mode === 'reno' ? 'cwnd = ssthresh (fast recovery).' : reset === 'one' ? 'cwnd = 1 MSS and slow start again.' : 'cwnd = the initial window and slow start again.'} Different textbooks restart from 1 MSS or the initial window, so state your convention.</p>
        </>
      )}
    </section>
  )
}
