import { useState } from 'react'
import { cidr, parseCidr } from './lib/cn.js'

const PRESETS = ['205.16.37.39/28', '203.197.2.53/17', '203.197.75.201/18', '192.168.10.77/26', '10.0.0.1/31']

export default function CidrSim() {
  const [text, setText] = useState(PRESETS[0])
  const parsed = parseCidr(text)
  const r = parsed.error ? null : cidr(parsed.ip, parsed.n)

  return (
    <section className="sim" aria-labelledby="sim-cidr">
      <div className="sim-head">
        <h3 id="sim-cidr">CIDR block calculator</h3>
        <span className="sim-unit">Unit III</span>
      </div>
      <p className="sim-note">Type any address with a prefix length. Preloaded with Nov &apos;25. The /17 and /18 presets are the two hosts from the Dec &apos;22 &quot;same network?&quot; question.</p>
      <div className="sim-controls">
        <label className="field">Address / prefix<input value={text} onChange={(e) => setText(e.target.value)} style={{ width: 220 }} spellCheck={false} /></label>
        <label className="field">Examples
          <select value="" onChange={(e) => e.target.value && setText(e.target.value)}>
            <option value="">Pick one…</option>
            {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>
      {parsed.error && <p className="sim-error">{parsed.error}</p>}
      {r && (
        <>
          <div className="sim-result" aria-live="polite">
            <div><b>{r.first}</b><span>first address (network)</span></div>
            <div><b>{r.last}</b><span>last address{parsed.n < 31 ? ' (broadcast)' : ''}</span></div>
            <div><b>{r.count.toLocaleString()}</b><span>addresses = 2^(32 − {parsed.n})</span></div>
            <div><b>{r.mask}</b><span>mask</span></div>
          </div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Binary working">
            <table style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5 }}>
              <tbody>
                <tr><th scope="row">Address</th><td>{r.binary}</td><td>{r.address}</td></tr>
                <tr><th scope="row">Mask /{parsed.n}</th><td>{r.maskBinary}</td><td>{r.mask}</td></tr>
                <tr><th scope="row">AND → first</th><td>{r.firstBinary}</td><td><b>{r.first}</b></td></tr>
                <tr><th scope="row">OR ¬mask → last</th><td>{r.lastBinary}</td><td><b>{r.last}</b></td></tr>
              </tbody>
            </table>
          </div>
          <p className="sim-note" style={{ marginTop: 10 }}>
            Usable host range: {r.hostRange} ({r.usable.toLocaleString()} hosts). Classful view: class {r.cls}. {r.special}
          </p>
        </>
      )}
    </section>
  )
}
