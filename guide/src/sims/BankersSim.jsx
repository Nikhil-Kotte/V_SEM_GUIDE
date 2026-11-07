import { useMemo, useState } from 'react'
import { bankersRequest, bankersSafety, parseNums, validateBankers } from './lib/os.js'

const PRESETS = [
  { label: "Dec '21 (CSE): 5 processes, 4 types", avail: '3 3 2 1', alloc: '2 0 0 1\n3 1 2 1\n2 1 0 3\n1 3 1 2\n1 4 3 2', max: '4 2 1 2\n5 2 5 2\n2 3 1 6\n1 4 2 4\n3 6 6 5' },
  { label: "Jan '23 (IT): Available 0 3 0 1", avail: '0 3 0 1', alloc: '3 0 1 4\n2 2 1 0\n3 1 2 1\n0 5 1 0\n4 2 1 2', max: '5 1 1 7\n3 2 1 1\n3 3 2 1\n4 6 1 2\n6 3 2 5' },
  { label: 'Same, with Available 1 0 0 2', avail: '1 0 0 2', alloc: '3 0 1 4\n2 2 1 0\n3 1 2 1\n0 5 1 0\n4 2 1 2', max: '5 1 1 7\n3 2 1 1\n3 3 2 1\n4 6 1 2\n6 3 2 5' },
  { label: 'Textbook: Available 3 3 2', avail: '3 3 2', alloc: '0 1 0\n2 0 0\n3 0 2\n2 1 1\n0 0 2', max: '7 5 3\n3 2 2\n9 0 2\n2 2 2\n4 3 3' },
]
const rows = (t) => t.trim().split('\n').filter((l) => l.trim()).map(parseNums)
const v = (a) => `(${a.join(', ')})`

export default function BankersSim() {
  const [s, setS] = useState(PRESETS[0])
  const [reqPid, setReqPid] = useState(1)
  const [reqText, setReqText] = useState('')
  const avail = parseNums(s.avail), alloc = rows(s.alloc), max = rows(s.max)
  const error = validateBankers(avail, max, alloc)
  const res = useMemo(() => (error ? null : bankersSafety(avail, max, alloc)), [s, error]) // eslint-disable-line react-hooks/exhaustive-deps
  const req = parseNums(reqText)
  const reqResult = !error && reqText.trim() && req.length === avail.length && max[reqPid] ? bankersRequest(avail, max, alloc, reqPid, req) : null
  const runKey = res ? `${res.safe}|${res.sequence.join(',')}|${s.avail}|${s.alloc}|${s.max}` : ''
  const types = avail.map((_, i) => String.fromCharCode(65 + i))

  return (
    <section className="sim" aria-labelledby="sim-bank">
      <div className="sim-head">
        <h3 id="sim-bank">Banker&apos;s algorithm checker</h3>
        <span className="sim-unit">Unit IV</span>
      </div>
      <p className="sim-note">One process per line, numbers separated by spaces. The tool computes Need, runs the safety algorithm and shows Work after every step, exactly how you should write it.</p>

      <div className="sim-controls">
        <label className="field">Preset
          <select defaultValue="0" onChange={(e) => setS(PRESETS[e.target.value])}>
            {PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
          </select>
        </label>
        <label className="field">Available<input value={s.avail} onChange={(e) => setS({ ...s, avail: e.target.value })} style={{ width: 140 }} /></label>
      </div>
      <div className="sim-controls" style={{ marginTop: 0 }}>
        <label className="field" style={{ flex: '1 1 200px' }}>Allocation<textarea rows={6} value={s.alloc} onChange={(e) => setS({ ...s, alloc: e.target.value })} /></label>
        <label className="field" style={{ flex: '1 1 200px' }}>Max<textarea rows={6} value={s.max} onChange={(e) => setS({ ...s, max: e.target.value })} /></label>
      </div>

      {error && <p className="sim-error">{error}</p>}
      {res && (
        <>
          <div className="sim-result bank-verdict" aria-live="polite" key={`v-${runKey}`} style={{ background: res.safe ? 'var(--ok-soft)' : 'var(--hot-soft)' }}>
            <div><b>{res.safe ? 'SAFE' : 'UNSAFE'}</b><span>system state</span></div>
            <div><b>{res.safe ? `< ${res.sequence.map((i) => 'P' + i).join(', ')} >` : `P${res.stuck.join(', P')} can never finish`}</b><span>{res.safe ? 'one safe sequence (other orders may also be valid)' : 'stuck processes'}</span></div>
          </div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Need matrix">
            <table>
              <thead><tr><th>Process</th><th>Allocation {types.join(' ')}</th><th>Max {types.join(' ')}</th><th>Need = Max − Alloc</th><th>Finishes</th></tr></thead>
              <tbody key={runKey}>{max.map((_, i) => {
                const order = res.sequence.indexOf(i)
                return (
                  <tr key={i} className={order >= 0 ? 'bank-row is-safe' : 'bank-row is-stuck'} style={{ '--k': order >= 0 ? order + 1 : 0 }}>
                    <td>P{i}</td><td>{alloc[i].join(' ')}</td><td>{max[i].join(' ')}</td><td><b>{res.need[i].join(' ')}</b></td>
                    <td><span className="bank-order">{order >= 0 ? `${order + 1}${['st', 'nd', 'rd'][order] || 'th'}` : 'Never'}</span></td>
                  </tr>
                )
              })}</tbody>
            </table>
          </div>
          <ol className="steps bank-steps" style={{ marginTop: 16 }} key={runKey}>
            <li>Work = Available = {v(avail)}</li>
            {res.steps.map((st, k) => (
              <li key={k} style={{ '--k': k + 1 }}>P{st.pid}: Need {v(st.need)} ≤ Work {v(st.before)} ✓ → finishes, Work = {v(st.before)} + {v(alloc[st.pid])} = <b>{v(st.after)}</b></li>
            ))}
            {!res.safe && <li style={{ '--k': res.steps.length + 1 }}>No remaining process has Need ≤ Work {v(res.steps.at(-1)?.after || avail)} → <b>unsafe</b>.</li>}
          </ol>

          <h4 style={{ fontSize: 18, margin: '18px 0 4px' }}>Resource request</h4>
          <div className="sim-controls" style={{ marginTop: 6 }}>
            <label className="field">Process
              <select value={reqPid} onChange={(e) => setReqPid(Number(e.target.value))}>{max.map((_, i) => <option key={i} value={i}>P{i}</option>)}</select>
            </label>
            <label className="field">Request ({types.join(' ')})<input value={reqText} onChange={(e) => setReqText(e.target.value)} placeholder={avail.map(() => '0').join(' ')} style={{ width: 160 }} /></label>
          </div>
          {reqResult && (
            <p className="sim-note" style={{ fontWeight: 600, color: reqResult.granted ? 'var(--ok)' : 'var(--hot)' }}>
              {reqResult.granted ? '✓ Granted. ' : '✗ Not granted. '}{reqResult.reason}
              {reqResult.result?.safe && ` Safe sequence afterwards: <${reqResult.result.sequence.map((i) => 'P' + i).join(', ')}>.`}
            </p>
          )}
        </>
      )}
    </section>
  )
}
