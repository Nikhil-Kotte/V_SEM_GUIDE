// Building blocks for the hand-drawn diagrams: an SVG frame with an arrow marker, text, boxes,
// arrows, nodes, a two-party message timeline (Exchange) and a weighted graph (Graph).
// Colours come from theme tokens, so diagrams read in light and dark.

// eslint-disable-next-line react-refresh/only-export-components
export const C = { blue: 'var(--blue)', red: 'var(--coral-deep)', green: 'var(--green)', gold: 'var(--gold)', violet: 'var(--violet)', soft: 'var(--surface-2)', line: 'var(--line-strong)' }

export function Svg({ w, h, label, id, children, max = w }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: max, display: 'block', margin: '0 auto', color: 'var(--text)' }} role="img" aria-label={label}>
      <defs>
        <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

export const T = ({ x, y, children, size = 12.5, weight = 400, anchor = 'middle', color = 'currentColor', mono, italic }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} fontFamily={mono ? 'var(--font-mono)' : undefined} fontStyle={italic ? 'italic' : undefined}>{children}</text>
)

export const Box = ({ x, y, w, h, fill = C.soft, stroke = C.line, label, sub, size = 12.5, weight = 700, r = 8, dash, color }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
    {label != null && <T x={x + w / 2} y={y + h / 2 + (sub ? -2 : 4.5)} size={size} weight={weight} color={color}>{label}</T>}
    {sub && <T x={x + w / 2} y={y + h / 2 + 13} size={10.5}>{sub}</T>}
  </g>
)

export const Arr = ({ id, x1, y1, x2, y2, color = 'currentColor', dash, width = 1.8, both }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash}
    markerEnd={`url(#${id}-a)`} markerStart={both ? `url(#${id}-a)` : undefined} />
)

export const Node = ({ x, y, label, r = 15, fill = 'var(--surface)', stroke = 'currentColor', color }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="1.8" />
    <T x={x} y={y + 4.5} size={12.5} weight={700} color={color}>{label}</T>
  </g>
)

// Two-party exchange over time. Each message leaves at t and arrives at t + travel (slanted line).
// msgs: [{ from: 'l' | 'r', t, label, lost, color }]; notes: [{ side: 'l' | 'r', t, text, color }]
export function Exchange({ id, left = 'Sender', right = 'Receiver', msgs, notes = [], travel = 1, span, label, unit = 34 }) {
  const end = span ?? Math.max(...msgs.map((m) => m.t + travel), ...notes.map((n) => n.t)) + 0.8
  const W = 600, xL = 170, xR = 430, top = 42
  const Y = (t) => top + t * unit
  return (
    <Svg w={W} h={Y(end) + 10} id={id} label={label}>
      <T x={xL} y={20} weight={700}>{left}</T>
      <T x={xR} y={20} weight={700}>{right}</T>
      <line x1={xL} x2={xL} y1={top - 8} y2={Y(end)} stroke="currentColor" strokeWidth="2" opacity=".45" />
      <line x1={xR} x2={xR} y1={top - 8} y2={Y(end)} stroke="currentColor" strokeWidth="2" opacity=".45" />
      {msgs.map((m, i) => {
        const [x1, x2] = m.from === 'l' ? [xL, xR] : [xR, xL]
        const y1 = Y(m.t), y2 = Y(m.t + travel)
        const color = m.color || (m.from === 'l' ? C.blue : C.green)
        const xe = m.lost ? x1 + (x2 - x1) * 0.55 : x2
        const ye = m.lost ? y1 + (y2 - y1) * 0.55 : y2
        const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
        const at = m.at ?? (m.lost ? 0.27 : 0.5)
        const lx = x1 + (x2 - x1) * at, ly = y1 + (y2 - y1) * at
        return (
          <g key={i} style={{ color }}>
            <line x1={x1} y1={y1} x2={xe} y2={ye} stroke="currentColor" strokeWidth="2" markerEnd={m.lost ? undefined : `url(#${id}-a)`} strokeDasharray={m.lost ? '5 3' : undefined} />
            {m.lost && <T x={xe} y={ye + 6} size={18} weight={700} color={C.red}>✕</T>}
            <g transform={`translate(${lx} ${ly}) rotate(${m.from === 'l' ? ang : ang + 180})`}>
              <text y={-5} textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{m.label}</text>
            </g>
          </g>
        )
      })}
      {notes.map((n, i) => (
        <T key={i} x={n.side === 'l' ? xL - 10 : xR + 10} y={Y(n.t) + 4} anchor={n.side === 'l' ? 'end' : 'start'} size={11} weight={700} color={n.color || 'currentColor'}>{n.text}</T>
      ))}
    </Svg>
  )
}

// Weighted graph. nodes: { A: [x, y] }, edges: [['A', 'B', 2]], hi: set of 'A-B' to highlight.
export function Graph({ id, nodes, edges, hi = [], label, w = 600, h = 260, notes = {}, highlight = C.red }) {
  const on = new Set(hi.flatMap((e) => [e, e.split('-').reverse().join('-')]))
  return (
    <Svg w={w} h={h} id={id} label={label}>
      {edges.map(([a, b, wt]) => {
        const [x1, y1] = nodes[a], [x2, y2] = nodes[b]
        const lit = on.has(`${a}-${b}`)
        return (
          <g key={`${a}${b}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={lit ? highlight : C.line} strokeWidth={lit ? 3.5 : 1.8} />
            {wt != null && (
              <g>
                <rect x={(x1 + x2) / 2 - 11} y={(y1 + y2) / 2 - 10} width="22" height="18" rx="4" fill="var(--surface)" />
                <T x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} size={11.5} weight={700}>{wt}</T>
              </g>
            )}
          </g>
        )
      })}
      {Object.entries(nodes).map(([n, [x, y]]) => <Node key={n} x={x} y={y} label={n} fill={notes[n] ? 'var(--yellow-tint)' : 'var(--surface)'} />)}
      {Object.entries(notes).map(([n, text]) => <T key={n} x={nodes[n][0]} y={nodes[n][1] > h / 2 ? nodes[n][1] + 32 : nodes[n][1] - 22} size={11} weight={700} color={C.red}>{text}</T>)}
    </Svg>
  )
}

