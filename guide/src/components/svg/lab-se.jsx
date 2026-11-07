// Worked-example UML / DFD diagrams for the SE lab guide.
// One small case study (a Library Management System) drawn in every notation, so a student can
// see how the same requirements turn into each diagram.

const INK = 'currentColor'
const ACCENT = 'var(--coral)'
const SOFT = 'var(--surface-2)'
const FONT = 12

// ---------- geometry helpers ----------
const center = (n) => [n.x + n.w / 2, n.y + n.h / 2]

// Point where the line from a node's centre towards (tx, ty) leaves the node's outline.
function exitPoint(n, tx, ty) {
  const [cx, cy] = center(n)
  const dx = tx - cx
  const dy = ty - cy
  if (!dx && !dy) return [cx, cy]
  if (n.shape === 'ellipse' || n.shape === 'circle') {
    const s = 1 / Math.sqrt((dx / (n.w / 2)) ** 2 + (dy / (n.h / 2)) ** 2)
    return [cx + dx * s, cy + dy * s]
  }
  if (n.shape === 'diamond') {
    const s = 1 / (Math.abs(dx) / (n.w / 2) + Math.abs(dy) / (n.h / 2))
    return [cx + dx * s, cy + dy * s]
  }
  const sx = dx ? n.w / 2 / Math.abs(dx) : Infinity
  const sy = dy ? n.h / 2 / Math.abs(dy) : Infinity
  const s = Math.min(sx, sy)
  return [cx + dx * s, cy + dy * s]
}

// Straight connector between two nodes, shifted sideways by `off` (so A→B and B→A don't overlap).
function connect(a, b, off = 0) {
  const [ax, ay] = center(a)
  const [bx, by] = center(b)
  const len = Math.hypot(bx - ax, by - ay) || 1
  const px = (-(by - ay) / len) * off
  const py = ((bx - ax) / len) * off
  const p1 = exitPoint(a, bx + px, by + py)
  const p2 = exitPoint(b, ax + px, ay + py)
  return [[p1[0] + px, p1[1] + py], [p2[0] + px, p2[1] + py]]
}

function Markers({ id }) {
  return (
    <defs>
      <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={INK} />
      </marker>
      <marker id={`${id}-open`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10" fill="none" stroke={INK} strokeWidth="1.4" />
      </marker>
      <marker id={`${id}-tri`} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13" markerHeight="13" orient="auto-start-reverse">
        <path d="M0 0 L12 6 L0 12 z" fill="var(--bg)" stroke={INK} strokeWidth="1.2" />
      </marker>
    </defs>
  )
}

// Label with a background pill so it stays readable over lines.
function Label({ x, y, text, size = 11, color = INK, bold }) {
  const lines = Array.isArray(text) ? text : [text]
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.56 + 10
  const h = lines.length * (size + 3) + 4
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="6" fill="var(--bg)" opacity=".92" />
      {lines.map((l, i) => (
        <text key={i} x={x} y={y - h / 2 + 2 + (i + 1) * (size + 3) - 3} textAnchor="middle" fontSize={size} fill={color} fontWeight={bold ? 700 : 400}>{l}</text>
      ))}
    </g>
  )
}

function Lines({ x, y, lines, size = FONT, bold, anchor = 'middle', gap = 15 }) {
  const top = y - ((lines.length - 1) * gap) / 2
  return lines.map((l, i) => (
    <text key={i} x={x} y={top + i * gap + size * 0.35} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 400} fill={INK}>{l}</text>
  ))
}

// An edge: { from, to, label, off, lo (label offset), at (0..1 along the line), dash, head: arrow|open|tri|none, pts }
function Edge({ id, nodes, e }) {
  const pts = e.pts || connect(nodes[e.from], nodes[e.to], e.off || 0)
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const head = e.head ?? 'arrow'
  // label sits on the longest segment unless told otherwise
  let seg = 0
  let best = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    if (l > best) { best = l; seg = i }
  }
  if (e.seg != null) seg = e.seg
  const [p, q] = [pts[seg], pts[seg + 1]]
  const t = e.at ?? 0.5
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1
  const nx = -(q[1] - p[1]) / len
  const ny = (q[0] - p[0]) / len
  const lo = e.lo ?? 0
  const lx = p[0] + (q[0] - p[0]) * t + nx * lo + (e.dx || 0)
  const ly = p[1] + (q[1] - p[1]) * t + ny * lo + (e.dy || 0)
  // multiplicities near each end
  const end = (a, b, text, side) => {
    if (!text) return null
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const ux = (b[0] - a[0]) / L
    const uy = (b[1] - a[1]) / L
    return <text x={a[0] + ux * 16 - uy * 11 * side} y={a[1] + uy * 16 + ux * 11 * side + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={ACCENT}>{text}</text>
  }
  const last = pts.length - 1
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.3" strokeDasharray={e.dash ? '5 4' : undefined}
        markerEnd={head === 'none' ? undefined : `url(#${id}-${head})`} />
      {e.label && <Label x={lx} y={ly} text={e.label} />}
      {end(pts[0], pts[1], e.m1, e.ms ?? 1)}
      {end(pts[last], pts[last - 1], e.m2, -(e.ms ?? 1))}
    </g>
  )
}

// ---------- node shapes ----------
function Node({ n }) {
  const [cx, cy] = center(n)
  const label = Array.isArray(n.label) ? n.label : [n.label]
  switch (n.kind) {
    case 'entity': // DFD external entity (Gane–Sarson: shaded square)
      return (
        <g>
          <rect x={n.x + 4} y={n.y + 4} width={n.w} height={n.h} fill={INK} opacity=".18" />
          <rect x={n.x} y={n.y} width={n.w} height={n.h} fill={SOFT} stroke={INK} strokeWidth="1.4" />
          <Lines x={cx} y={cy} lines={label} bold />
        </g>
      )
    case 'process': // Gane–Sarson process: rounded box with a number band
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <line x1={n.x} x2={n.x + n.w} y1={n.y + 22} y2={n.y + 22} stroke={INK} strokeWidth="1" />
          <text x={cx} y={n.y + 15} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={ACCENT}>{n.num}</text>
          <Lines x={cx} y={(n.y + 22 + n.y + n.h) / 2} lines={label} />
        </g>
      )
    case 'store': // Gane–Sarson data store: open-ended box with an ID cell
      return (
        <g>
          <path d={`M${n.x + n.w} ${n.y} H${n.x} V${n.y + n.h} H${n.x + n.w}`} fill="none" stroke={INK} strokeWidth="1.4" />
          <rect x={n.x} y={n.y} width="34" height={n.h} fill={SOFT} stroke={INK} strokeWidth="1.4" />
          <text x={n.x + 17} y={cy + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK}>{n.num}</text>
          <text x={n.x + 44} y={cy + 4} fontSize={FONT} fill={INK}>{label[0]}</text>
        </g>
      )
    case 'actor': {
      const hx = cx
      const top = n.y + 6
      return (
        <g stroke={INK} strokeWidth="1.5" fill="none">
          <circle cx={hx} cy={top + 9} r="9" fill="var(--surface)" />
          <line x1={hx} y1={top + 18} x2={hx} y2={top + 44} />
          <line x1={hx - 16} y1={top + 27} x2={hx + 16} y2={top + 27} />
          <line x1={hx} y1={top + 44} x2={hx - 13} y2={top + 62} />
          <line x1={hx} y1={top + 44} x2={hx + 13} y2={top + 62} />
          <text x={hx} y={top + 80} textAnchor="middle" fontSize={FONT} fontWeight="700" fill={INK} stroke="none">{label[0]}</text>
        </g>
      )
    }
    case 'usecase':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx={n.w / 2} ry={n.h / 2} fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <Lines x={cx} y={cy} lines={label} gap={14} />
        </g>
      )
    case 'class': {
      const attrs = n.attrs || []
      const ops = n.ops || []
      const y1 = n.y + 26
      const y2 = y1 + 8 + attrs.length * 16
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <rect x={n.x} y={n.y} width={n.w} height="26" fill={SOFT} stroke={INK} strokeWidth="1.4" />
          {n.stereo && <text x={cx} y={n.y - 5} textAnchor="middle" fontSize="10.5" fill={INK} opacity=".75">{n.stereo}</text>}
          <text x={cx} y={n.y + 17} textAnchor="middle" fontSize="12.5" fontWeight="700" fontStyle={n.abstract ? 'italic' : 'normal'} fill={INK}>{label[0]}</text>
          {attrs.map((a, i) => <text key={a} x={n.x + 8} y={y1 + 16 + i * 16} fontSize="11.5" fill={INK}>{a}</text>)}
          <line x1={n.x} x2={n.x + n.w} y1={y2 + 4} y2={y2 + 4} stroke={INK} strokeWidth="1" />
          {ops.map((o, i) => <text key={o} x={n.x + 8} y={y2 + 20 + i * 16} fontSize="11.5" fill={INK}>{o}</text>)}
        </g>
      )
    }
    case 'action':
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <Lines x={cx} y={cy} lines={label} gap={14} />
        </g>
      )
    case 'state':
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="14" fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <Lines x={cx} y={cy} lines={label} bold />
        </g>
      )
    case 'decision':
      return (
        <g>
          <path d={`M${cx} ${n.y} L${n.x + n.w} ${cy} L${cx} ${n.y + n.h} L${n.x} ${cy} z`} fill={SOFT} stroke={INK} strokeWidth="1.4" />
          {n.label && <text x={n.x + n.w + 6} y={cy - 12} fontSize="11" fill={INK} opacity=".8">{label[0]}</text>}
        </g>
      )
    case 'start':
      return <circle cx={cx} cy={cy} r={n.w / 2} fill={INK} />
    case 'end':
      return (
        <g>
          <circle cx={cx} cy={cy} r={n.w / 2} fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={n.w / 2 - 4} fill={INK} />
        </g>
      )
    case 'bar':
      return <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="2" fill={INK} />
    case 'component':
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="4" fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <g transform={`translate(${n.x + n.w - 26} ${n.y + 8})`} stroke={INK} strokeWidth="1.1" fill="var(--surface)">
            <rect x="4" y="0" width="16" height="18" />
            <rect x="0" y="3" width="8" height="4" />
            <rect x="0" y="11" width="8" height="4" />
          </g>
          <text x={cx - 8} y={cy - 6} textAnchor="middle" fontSize="10.5" fill={INK} opacity=".75">«component»</text>
          <text x={cx - 8} y={cy + 11} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={INK}>{label[0]}</text>
        </g>
      )
    case 'node3d': { // deployment node: a box drawn in 3-D
      const k = 12
      return (
        <g>
          <path d={`M${n.x} ${n.y} l${k} ${-k} h${n.w} v${n.h} l${-k} ${k}`} fill={SOFT} stroke={INK} strokeWidth="1.3" />
          <line x1={n.x + n.w} y1={n.y} x2={n.x + n.w + k} y2={n.y - k} stroke={INK} strokeWidth="1.3" />
          <rect x={n.x} y={n.y} width={n.w} height={n.h} fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <text x={cx} y={n.y + 17} textAnchor="middle" fontSize="10.5" fill={INK} opacity=".75">{n.stereo}</text>
          <text x={cx} y={n.y + 33} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={INK}>{label[0]}</text>
          {n.artifact && (
            <g>
              <rect x={n.x + 14} y={n.y + 46} width={n.w - 28} height={n.h - 58} fill={SOFT} stroke={INK} strokeWidth="1" />
              <path d={`M${n.x + n.w - 28} ${n.y + 46} v8 h8`} fill="none" stroke={INK} strokeWidth="1" />
              <text x={cx} y={n.y + 46 + (n.h - 58) / 2 - 4} textAnchor="middle" fontSize="10" fill={INK} opacity=".75">«artifact»</text>
              <text x={cx} y={n.y + 46 + (n.h - 58) / 2 + 11} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={INK}>{n.artifact}</text>
            </g>
          )}
        </g>
      )
    }
    case 'lollipop': // provided interface
      return (
        <g>
          <circle cx={cx} cy={cy} r={n.w / 2} fill="var(--surface)" stroke={INK} strokeWidth="1.4" />
          <text x={cx} y={n.below ? n.y + n.h + 14 : n.y - 5} textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="700">{label[0]}</text>
        </g>
      )
    case 'boundary':
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="6" fill="none" stroke={INK} strokeWidth="1.4" />
          <text x={n.x + 12} y={n.y + 20} fontSize="12.5" fontWeight="700" fill={INK}>{label[0]}</text>
        </g>
      )
    case 'lane':
      return (
        <g>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} fill="none" stroke={INK} strokeOpacity=".35" />
          <rect x={n.x} y={n.y} width={n.w} height="26" fill={SOFT} stroke={INK} strokeOpacity=".35" />
          <text x={cx} y={n.y + 17} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={INK}>{label[0]}</text>
        </g>
      )
    default:
      return null
  }
}

function Graph({ id, w, h, label, nodes, edges, minWidth = 520, children }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w + 40, minWidth, display: 'block', margin: '0 auto' }} role="img" aria-label={label}>
      <Markers id={id} />
      {Object.values(nodes).filter((n) => n.kind === 'lane' || n.kind === 'boundary').map((n, i) => <Node key={`b${i}`} n={n} />)}
      {edges.map((e, i) => <Edge key={i} id={id} nodes={nodes} e={e} />)}
      {Object.values(nodes).filter((n) => n.kind !== 'lane' && n.kind !== 'boundary').map((n, i) => <Node key={i} n={n} />)}
      {children}
    </svg>
  )
}

// ---------- 1. DFD level 0 (context diagram) ----------
const dfd0 = {
  member: { kind: 'entity', x: 20, y: 92, w: 120, h: 56, label: 'Member' },
  lib: { kind: 'entity', x: 560, y: 92, w: 120, h: 56, label: 'Librarian' },
  sys: { kind: 'process', x: 270, y: 48, w: 160, h: 144, num: '0', label: ['Library', 'Management', 'System'] },
}
export function LibDfd0() {
  return (
    <Graph id="ld0" w={700} h={240} nodes={dfd0} label="Level 0 DFD: Member and Librarian exchange data with the single process 0, Library Management System"
      edges={[
        { from: 'member', to: 'sys', off: -16, label: 'book request', lo: -12 },
        { from: 'sys', to: 'member', off: -16, label: 'issue slip / fine', lo: -12 },
        { from: 'lib', to: 'sys', off: -16, label: 'new book details', lo: -12 },
        { from: 'sys', to: 'lib', off: -16, label: 'reports', lo: -12 },
      ]} />
  )
}

// ---------- 2. DFD level 1 ----------
const P = (k, y, num, label) => ({ kind: 'process', x: 210, y, w: 160, h: 66, num, label })
const D = (y, num, label) => ({ kind: 'store', x: 470, y, w: 170, h: 34, num, label })
const dfd1 = {
  member: { kind: 'entity', x: 20, y: 150, w: 110, h: 56, label: 'Member' },
  lib: { kind: 'entity', x: 20, y: 370, w: 110, h: 56, label: 'Librarian' },
  p1: P('p1', 20, '1.0', ['Register', 'member']),
  p2: P('p2', 135, '2.0', ['Issue', 'book']),
  p3: P('p3', 250, '3.0', ['Return', 'book']),
  p4: P('p4', 365, '4.0', ['Manage', 'catalogue']),
  d1: D(36, 'D1', 'Members'),
  d3: D(190, 'D3', 'Loans'),
  d2: D(330, 'D2', 'Books'),
}
export function LibDfd1() {
  return (
    <Graph id="ld1" w={660} h={450} nodes={dfd1} label="Level 1 DFD of the library system: four processes, three data stores, two external entities"
      edges={[
        { from: 'member', to: 'p1', label: 'member details', at: 0.45 },
        { from: 'member', to: 'p2', off: -7, label: 'book request', lo: -11, at: 0.5 },
        { from: 'p2', to: 'member', off: -7, label: 'issue slip', lo: -11, at: 0.5 },
        { from: 'member', to: 'p3', label: 'returned book', at: 0.55 },
        { from: 'lib', to: 'p4', label: 'book details', lo: -11 },
        { from: 'p1', to: 'd1', label: 'member record', lo: -11 },
        { from: 'd1', to: 'p2', label: 'member status', at: 0.45 },
        { from: 'p2', to: 'd3', label: 'loan record', at: 0.5, lo: -10 },
        { from: 'd2', to: 'p2', label: 'availability', at: 0.3 },
        { from: 'p3', to: 'd3', label: 'close loan', at: 0.6, lo: 10 },
        { from: 'p3', to: 'd2', label: 'mark available', at: 0.62 },
        { from: 'p4', to: 'd2', label: 'book record', lo: 11 },
      ]} />
  )
}

// ---------- 3. DFD level 2 (process 2.0 Issue book) ----------
const dfd2 = {
  member: { kind: 'entity', x: 20, y: 160, w: 110, h: 56, label: 'Member' },
  p21: { kind: 'process', x: 210, y: 20, w: 160, h: 66, num: '2.1', label: ['Verify', 'member'] },
  p22: { kind: 'process', x: 210, y: 155, w: 160, h: 66, num: '2.2', label: ['Check', 'availability'] },
  p23: { kind: 'process', x: 210, y: 290, w: 160, h: 66, num: '2.3', label: ['Record loan &', 'print slip'] },
  d1: { kind: 'store', x: 470, y: 36, w: 170, h: 34, num: 'D1', label: 'Members' },
  d2: { kind: 'store', x: 470, y: 171, w: 170, h: 34, num: 'D2', label: 'Books' },
  d3: { kind: 'store', x: 470, y: 306, w: 170, h: 34, num: 'D3', label: 'Loans' },
}
export function LibDfd2() {
  return (
    <Graph id="ld2" w={660} h={380} nodes={dfd2} label="Level 2 DFD expanding process 2.0 Issue book into 2.1 Verify member, 2.2 Check availability and 2.3 Record loan"
      edges={[
        { from: 'member', to: 'p21', label: 'member id, book id', at: 0.42 },
        { from: 'd1', to: 'p21', label: 'member status', lo: -11 },
        { from: 'p21', to: 'p22', label: 'valid request', lo: 0, dx: 0 },
        { from: 'd2', to: 'p22', label: 'copies available', lo: -11 },
        { from: 'p22', to: 'p23', label: 'available book', dx: 26 },
        { from: 'p23', to: 'd3', label: 'loan record', lo: -11 },
        { from: 'p23', to: 'd2', label: 'status = issued', at: 0.55 },
        { from: 'p23', to: 'member', label: 'issue slip, due date', at: 0.62, dx: -18 },
      ]} />
  )
}

// ---------- 4. Use case diagram ----------
const uc = {
  box: { kind: 'boundary', x: 150, y: 14, w: 370, h: 372, label: 'Library Management System' },
  member: { kind: 'actor', x: 40, y: 130, w: 50, h: 90, label: 'Member' },
  lib: { kind: 'actor', x: 580, y: 150, w: 60, h: 90, label: 'Librarian' },
  search: { kind: 'usecase', shape: 'ellipse', x: 260, y: 42, w: 150, h: 44, label: 'Search catalogue' },
  borrow: { kind: 'usecase', shape: 'ellipse', x: 175, y: 120, w: 140, h: 44, label: 'Borrow book' },
  ret: { kind: 'usecase', shape: 'ellipse', x: 175, y: 210, w: 140, h: 44, label: 'Return book' },
  fine: { kind: 'usecase', shape: 'ellipse', x: 175, y: 316, w: 140, h: 44, label: 'Pay fine' },
  login: { kind: 'usecase', shape: 'ellipse', x: 360, y: 168, w: 130, h: 44, label: 'Log in' },
  add: { kind: 'usecase', shape: 'ellipse', x: 355, y: 300, w: 140, h: 44, label: 'Add new book' },
}
export function LibUseCase() {
  return (
    <Graph id="luc" w={660} h={400} nodes={uc} label="Use case diagram: Member searches, borrows, returns books and pays fines; Librarian adds books and searches; borrow, return and add include Log in; Pay fine extends Return book"
      edges={[
        { from: 'member', to: 'search', head: 'none' },
        { from: 'member', to: 'borrow', head: 'none' },
        { from: 'member', to: 'ret', head: 'none' },
        { from: 'member', to: 'fine', head: 'none' },
        { from: 'lib', to: 'search', head: 'none' },
        { from: 'lib', to: 'add', head: 'none' },
        { from: 'borrow', to: 'login', dash: true, head: 'open', label: '«include»', lo: -10, at: 0.5 },
        { from: 'ret', to: 'login', dash: true, head: 'open', label: '«include»', lo: 10, at: 0.5 },
        { from: 'add', to: 'login', dash: true, head: 'open', label: '«include»', at: 0.5 },
        { from: 'fine', to: 'ret', dash: true, head: 'open', label: '«extend»', dx: 34 },
      ]} />
  )
}

// ---------- 5. Class diagram ----------
const cls = (x, y, w, label, attrs, ops, extra = {}) => ({ kind: 'class', x, y, w, h: 26 + 8 + attrs.length * 16 + 12 + ops.length * 16 + 6, label, attrs, ops, ...extra })
const classes = {
  person: cls(150, 20, 200, 'Person', ['- name : String', '- phone : String'], ['+ login() : boolean'], { abstract: true }),
  lib: cls(20, 210, 190, 'Librarian', ['- staffId : int'], ['+ addBook(b : Book)', '+ issueBook(m, b) : Loan']),
  member: cls(260, 210, 190, 'Member', ['- memberId : int', '- maxBooks : int = 3'], ['+ borrow(b : Book)', '+ returnBook(b : Book)']),
  loan: cls(510, 210, 190, 'Loan', ['- issueDate : Date', '- dueDate : Date'], ['+ isOverdue() : boolean', '+ fine() : double']),
  book: cls(510, 20, 190, 'Book', ['- isbn : String', '- title : String', '- available : boolean'], ['+ isAvailable() : boolean']),
}
export function LibClass() {
  const p = classes.person
  const pb = p.y + p.h
  const childTop = 210
  const midY = (pb + childTop) / 2
  const lx = classes.lib.x + classes.lib.w / 2
  const mx = classes.member.x + classes.member.w / 2
  const px = p.x + p.w / 2
  return (
    <Graph id="lcl" w={720} h={340} nodes={classes} label="Class diagram: Librarian and Member inherit from Person; a Member has 0 to 3 Loans; each Loan is for exactly one Book; a Librarian manages many Books"
      edges={[
        { pts: [[lx, childTop], [lx, midY], [px, midY], [px, pb]], head: 'tri' },
        { pts: [[mx, childTop], [mx, midY], [px, midY]], head: 'none' },
        { from: 'member', to: 'loan', head: 'none', label: 'borrows', lo: -12, m1: '1', m2: '0..3' },
        { from: 'loan', to: 'book', head: 'none', label: 'is for', lo: 0, dx: 26, m1: '0..*', m2: '1', ms: -1 },
        { pts: [[20, 250], [8, 250], [8, 8], [605, 8], [605, 20]], head: 'none', label: 'manages', seg: 2, at: 0.75, m1: '1', m2: '*' },
      ]} />
  )
}

// ---------- 6. Activity diagram ----------
const act = {
  l1: { kind: 'lane', x: 10, y: 10, w: 250, h: 600, label: 'Member' },
  l2: { kind: 'lane', x: 260, y: 10, w: 420, h: 600, label: 'Library system' },
  s: { kind: 'start', shape: 'circle', x: 125, y: 50, w: 20, h: 20 },
  a1: { kind: 'action', x: 55, y: 90, w: 160, h: 40, label: 'Search for a book' },
  a2: { kind: 'action', x: 365, y: 150, w: 210, h: 44, label: ['Check availability and', 'member\'s loan limit'] },
  d: { kind: 'decision', shape: 'diamond', x: 450, y: 230, w: 40, h: 40 },
  a3: { kind: 'action', x: 45, y: 230, w: 180, h: 40, label: 'See "cannot issue" reason' },
  e1: { kind: 'end', shape: 'circle', x: 122, y: 300, w: 26, h: 26 },
  fork: { kind: 'bar', x: 340, y: 318, w: 260, h: 6 },
  a4: { kind: 'action', x: 290, y: 360, w: 150, h: 40, label: 'Record the loan' },
  a5: { kind: 'action', x: 500, y: 360, w: 160, h: 40, label: 'Mark book "issued"' },
  join: { kind: 'bar', x: 340, y: 432, w: 260, h: 6 },
  a6: { kind: 'action', x: 380, y: 470, w: 180, h: 40, label: 'Print issue slip' },
  a7: { kind: 'action', x: 45, y: 470, w: 180, h: 40, label: 'Collect book and slip' },
  e2: { kind: 'end', shape: 'circle', x: 122, y: 560, w: 26, h: 26 },
}
export function LibActivity() {
  const A = (from, to, extra) => ({ from, to, ...extra })
  return (
    <Graph id="lac" w={690} h={620} nodes={act} label="Activity diagram for borrowing a book with Member and Library system swimlanes, a decision, and a fork/join for recording the loan and marking the book issued"
      edges={[
        A('s', 'a1'),
        { pts: [[215, 110], [470, 110], [470, 150]] },
        A('a2', 'd'),
        { from: 'd', to: 'a3', label: '[not available or limit reached]', lo: -12, at: 0.55 },
        A('a3', 'e1'),
        { pts: [[470, 270], [470, 318]], label: '[ok]', lo: -18 },
        { pts: [[365, 324], [365, 360]] },
        { pts: [[580, 324], [580, 360]] },
        { pts: [[365, 400], [365, 432]] },
        { pts: [[580, 400], [580, 432]] },
        { pts: [[470, 438], [470, 470]] },
        A('a6', 'a7'),
        A('a7', 'e2'),
      ]} />
  )
}

// ---------- 7. Sequence diagram ----------
export function LibSequence() {
  const lanes = [
    { x: 70, name: 'm : Member', actor: true },
    { x: 220, name: ': LibraryUI' },
    { x: 390, name: ': LoanController' },
    { x: 560, name: 'b : Book' },
  ]
  const top = 92
  const bottom = 560
  const loanX = 660
  const loanY = 300
  const msgs = [
    { y: 130, a: 0, b: 1, t: '1: requestBook(bookId)' },
    { y: 170, a: 1, b: 2, t: '2: issueBook(memberId, bookId)' },
    { y: 210, a: 2, b: 3, t: '3: isAvailable()' },
    { y: 245, a: 3, b: 2, t: '4: true', ret: true },
    { y: 360, a: 2, b: 3, t: '6: setAvailable(false)' },
    { y: 400, a: 2, b: 1, t: '7: loan details', ret: true },
    { y: 470, a: 2, b: 1, t: '7\': "not available"', ret: true },
    { y: 525, a: 1, b: 0, t: '8: show issue slip / message', ret: true },
  ]
  return (
    <svg viewBox="0 0 740 580" width="100%" style={{ maxWidth: 780, minWidth: 560, display: 'block', margin: '0 auto' }} role="img"
      aria-label="Sequence diagram for borrowing a book: Member, LibraryUI, LoanController, Book and a newly created Loan exchange numbered messages, with an alt fragment for available and not available">
      <Markers id="lsq" />
      {/* alt fragment */}
      <rect x="150" y="268" width="575" height="225" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M150 268 h46 v14 l-8 8 h-38 z" fill={SOFT} stroke={INK} strokeWidth="1.2" />
      <text x="160" y="284" fontSize="12" fontWeight="700" fill={INK}>alt</text>
      <text x="236" y="284" fontSize="11.5" fill={INK}>[available]</text>
      <line x1="150" x2="725" y1="435" y2="435" stroke={INK} strokeWidth="1.1" strokeDasharray="6 4" />
      <text x="160" y="452" fontSize="11.5" fill={INK}>[else]</text>
      {lanes.map((l) => (
        <g key={l.name}>
          {l.actor ? (
            <g stroke={INK} strokeWidth="1.5" fill="none">
              <circle cx={l.x} cy={24} r="8" fill="var(--surface)" />
              <line x1={l.x} y1={32} x2={l.x} y2={52} />
              <line x1={l.x - 13} y1={40} x2={l.x + 13} y2={40} />
              <line x1={l.x} y1={52} x2={l.x - 11} y2={66} />
              <line x1={l.x} y1={52} x2={l.x + 11} y2={66} />
              <text x={l.x} y={84} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} stroke="none" textDecoration="underline">{l.name}</text>
            </g>
          ) : (
            <g>
              <rect x={l.x - 72} y={44} width="144" height="34" rx="4" fill={SOFT} stroke={INK} strokeWidth="1.3" />
              <text x={l.x} y={66} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} textDecoration="underline">{l.name}</text>
            </g>
          )}
          <line x1={l.x} x2={l.x} y1={top} y2={bottom} stroke={INK} strokeWidth="1.1" strokeDasharray="5 4" />
        </g>
      ))}
      {/* activation bars */}
      <rect x={lanes[1].x - 6} y={124} width="12" height={410} fill="var(--surface)" stroke={INK} />
      <rect x={lanes[2].x - 6} y={164} width="12" height={312} fill="var(--surface)" stroke={INK} />
      <rect x={lanes[3].x - 6} y={204} width="12" height={45} fill="var(--surface)" stroke={INK} />
      <rect x={lanes[3].x - 6} y={354} width="12" height={24} fill="var(--surface)" stroke={INK} />
      {/* created object */}
      <line x1={lanes[2].x + 6} x2={loanX - 46} y1={loanY + 17} y2={loanY + 17} stroke={INK} strokeWidth="1.3" strokeDasharray="5 4" markerEnd="url(#lsq-open)" />
      <Label x={(lanes[2].x + loanX - 46) / 2 + 30} y={loanY + 5} text="5: «create» Loan(m, b)" />
      <rect x={loanX - 46} y={loanY} width="92" height="34" rx="4" fill={SOFT} stroke={INK} strokeWidth="1.3" />
      <text x={loanX} y={loanY + 22} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} textDecoration="underline">: Loan</text>
      <line x1={loanX} x2={loanX} y1={loanY + 34} y2={bottom} stroke={INK} strokeWidth="1.1" strokeDasharray="5 4" />
      {msgs.map((m) => {
        const x1 = lanes[m.a].x + (m.b > m.a ? 6 : -6)
        const x2 = lanes[m.b].x + (m.b > m.a ? -6 : 6)
        return (
          <g key={m.t}>
            <line x1={x1} x2={x2} y1={m.y} y2={m.y} stroke={INK} strokeWidth="1.3" strokeDasharray={m.ret ? '5 4' : undefined}
              markerEnd={`url(#lsq-${m.ret ? 'open' : 'arrow'})`} />
            <Label x={(x1 + x2) / 2} y={m.y - 11} text={m.t} />
          </g>
        )
      })}
      <text x="370" y="576" textAnchor="middle" fontSize="11" fill={INK} opacity=".75">Solid arrow = call · dashed open arrow = return / reply · time runs downwards</text>
    </svg>
  )
}

// ---------- 8. State chart (Book) ----------
const st = {
  s: { kind: 'start', shape: 'circle', x: 20, y: 54, w: 20, h: 20 },
  avail: { kind: 'state', x: 90, y: 40, w: 150, h: 48, label: 'Available' },
  res: { kind: 'state', x: 430, y: 40, w: 150, h: 48, label: 'Reserved' },
  issued: { kind: 'state', x: 90, y: 200, w: 150, h: 48, label: 'Issued' },
  over: { kind: 'state', x: 430, y: 200, w: 150, h: 48, label: 'Overdue' },
  lost: { kind: 'state', x: 430, y: 320, w: 150, h: 48, label: 'Lost' },
  e: { kind: 'end', shape: 'circle', x: 152, y: 331, w: 26, h: 26 },
}
export function LibState() {
  return (
    <Graph id="lst" w={660} h={390} nodes={st} label="State chart of a Book: Available, Reserved, Issued, Overdue and Lost with the events that move it between them"
      edges={[
        { from: 's', to: 'avail' },
        { from: 'avail', to: 'issued', off: -22, label: 'issue', lo: -2 },
        { from: 'issued', to: 'avail', off: -22, label: ['return', '[on time]'] },
        { from: 'avail', to: 'res', off: -10, label: 'reserve', lo: -12 },
        { from: 'res', to: 'avail', off: -10, label: 'reservation expires', lo: -12 },
        { from: 'res', to: 'issued', label: 'issue to reserver', at: 0.35 },
        { from: 'issued', to: 'over', label: 'due date passed', lo: -12 },
        { pts: [[580, 224], [630, 224], [630, 14], [165, 14], [165, 40]], label: 'return / pay fine', seg: 2 },
        { from: 'over', to: 'lost', label: 'not returned in 30 days', dx: 82 },
        { from: 'lost', to: 'e', label: 'written off', lo: -12 },
      ]} />
  )
}

// ---------- 9. Component diagram ----------
const comp = {
  ui: { kind: 'component', x: 20, y: 130, w: 150, h: 64, label: 'Web UI' },
  loan: { kind: 'component', x: 290, y: 30, w: 170, h: 64, label: 'Loan Service' },
  cat: { kind: 'component', x: 290, y: 130, w: 170, h: 64, label: 'Catalogue Service' },
  mem: { kind: 'component', x: 290, y: 230, w: 170, h: 64, label: 'Member Service' },
  db: { kind: 'component', x: 560, y: 130, w: 130, h: 64, label: 'Database' },
  iLoan: { kind: 'lollipop', shape: 'circle', x: 236, y: 54, w: 16, h: 16, label: 'ILoan' },
  iCat: { kind: 'lollipop', shape: 'circle', x: 236, y: 154, w: 16, h: 16, label: 'ISearch' },
  iMem: { kind: 'lollipop', shape: 'circle', x: 236, y: 254, w: 16, h: 16, label: 'IMember', below: true },
  iDb: { kind: 'lollipop', shape: 'circle', x: 510, y: 154, w: 16, h: 16, label: 'SQL' },
}
export function LibComponent() {
  return (
    <Graph id="lco" w={710} h={310} nodes={comp} label="Component diagram: the Web UI uses the ILoan, ISearch and IMember interfaces of three services; each service uses the SQL interface of the Database component"
      edges={[
        { pts: [[252, 62], [290, 62]], head: 'none' },
        { pts: [[252, 162], [290, 162]], head: 'none' },
        { pts: [[252, 262], [290, 262]], head: 'none' },
        { pts: [[526, 162], [560, 162]], head: 'none' },
        { from: 'ui', to: 'iLoan', dash: true, head: 'open' },
        { from: 'ui', to: 'iCat', dash: true, head: 'open' },
        { from: 'ui', to: 'iMem', dash: true, head: 'open' },
        { from: 'loan', to: 'iDb', dash: true, head: 'open' },
        { from: 'cat', to: 'iDb', dash: true, head: 'open' },
        { from: 'mem', to: 'iDb', dash: true, head: 'open' },
      ]}>
      <text x="355" y="306" textAnchor="middle" fontSize="11" fill={INK} opacity=".75">○ = provided interface · dashed arrow = «use» dependency on that interface</text>
    </Graph>
  )
}

// ---------- 10. Deployment diagram ----------
const dep = {
  pc: { kind: 'node3d', x: 20, y: 50, w: 180, h: 130, stereo: '«device»', label: 'Client PC', artifact: 'Web browser' },
  app: { kind: 'node3d', x: 270, y: 50, w: 200, h: 130, stereo: '«device» App Server', label: 'Tomcat 10', artifact: 'library.war' },
  db: { kind: 'node3d', x: 540, y: 50, w: 160, h: 130, stereo: '«device» DB Server', label: 'MySQL 8', artifact: 'library_db' },
  scan: { kind: 'node3d', x: 35, y: 250, w: 150, h: 46, stereo: '«device»', label: 'Barcode scanner' },
}
export function LibDeployment() {
  return (
    <Graph id="ldp" w={720} h={320} nodes={dep} label="Deployment diagram: Client PC with a browser connects over HTTPS to an application server running library.war on Tomcat, which connects over JDBC to a MySQL database server; a barcode scanner is attached to the client by USB"
      edges={[
        { from: 'pc', to: 'app', head: 'none', label: '«HTTPS»', lo: -12 },
        { from: 'app', to: 'db', head: 'none', label: '«JDBC»', lo: -12 },
        { from: 'pc', to: 'scan', head: 'none', label: '«USB»', dx: 26 },
      ]} />
  )
}
