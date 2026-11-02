// Two-host message timeline (time flows downward). Used for TCP handshake/release diagrams.
// messages: [{ dir: 'r' | 'l', label, sub?, color? }], states: { left: [..], right: [..] } (one per gap, optional)
export default function Timeline({ left, right, messages, leftStates = [], rightStates = [], title }) {
  const W = 560, top = 50, step = 62, xL = 150, xR = 410
  const H = top + messages.length * step + 30
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block', margin: '0 auto' }} role="img" aria-label={title}>
      <defs>
        <marker id="tl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <text x={xL} y={22} textAnchor="middle" fontWeight="700" fontSize="15" fill="currentColor">{left}</text>
      <text x={xR} y={22} textAnchor="middle" fontWeight="700" fontSize="15" fill="currentColor">{right}</text>
      <line x1={xL} x2={xL} y1={top - 14} y2={H - 10} stroke="currentColor" strokeWidth="2" opacity=".5" />
      <line x1={xR} x2={xR} y1={top - 14} y2={H - 10} stroke="currentColor" strokeWidth="2" opacity=".5" />
      {messages.map((m, i) => {
        const y1 = top + i * step, y2 = y1 + step - 14
        const [x1, x2] = m.dir === 'r' ? [xL, xR] : [xR, xL]
        const mx = (xL + xR) / 2, my = (y1 + y2) / 2
        const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
        const rot = m.dir === 'r' ? angle : angle + 180
        return (
          <g key={i} style={{ color: m.color || 'var(--coral-deep)' }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.2" markerEnd="url(#tl-arrow)" />
            <g transform={`translate(${mx} ${my}) rotate(${rot})`}>
              <text y={-7} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="currentColor">{m.label}</text>
              {m.sub && <text y={13} textAnchor="middle" fontSize="11.5" fill="var(--text)" opacity=".8">{m.sub}</text>}
            </g>
          </g>
        )
      })}
      {leftStates.map((s, i) => s && <text key={'l' + i} x={xL - 10} y={top + i * step + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity=".7" fontFamily="var(--font-mono)">{s}</text>)}
      {rightStates.map((s, i) => s && <text key={'r' + i} x={xR + 10} y={top + i * step + 4} fontSize="11" fill="currentColor" opacity=".7" fontFamily="var(--font-mono)">{s}</text>)}
    </svg>
  )
}
