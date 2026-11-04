// SVG diagrams for Software Engineering topics the notes don't illustrate.

const W = 190, HEAD = 30, LINE = 17
const TOP = 30, ROW2 = 262

const OBJECTS = [
  { name: 'Student', x: 20, y: TOP, data: ['rollNo', 'name', 'cgpa'], ops: ['register()', 'viewResult()'] },
  { name: 'Course', x: 390, y: TOP, data: ['code', 'title', 'credits'], ops: ['addStudent()', 'getSeats()'] },
  { name: 'Enrolment', x: 20, y: ROW2, data: ['student', 'course', 'date'], ops: ['enrol()', 'cancel()'] },
  { name: 'FeePayment', x: 390, y: ROW2, data: ['amount', 'status'], ops: ['pay()', 'getStatus()'] },
]

// Vertical positions inside a box, relative to its top.
const layout = (o) => {
  const dataLabel = HEAD + 20
  const firstData = dataLabel + 17
  const divider = firstData + (o.data.length - 1) * LINE + 12
  const opsLabel = divider + 16
  const firstOp = opsLabel + 17
  const height = firstOp + (o.ops.length - 1) * LINE + 14
  return { dataLabel, firstData, divider, opsLabel, firstOp, height }
}

function ObjectBox({ o }) {
  const l = layout(o)
  return (
    <g>
      <rect x={o.x} y={o.y} width={W} height={l.height} rx="12" fill="var(--surface-2)" stroke="var(--line-strong)" />
      <path d={`M${o.x} ${o.y + HEAD} V${o.y + 12} a12 12 0 0 1 12 -12 H${o.x + W - 12} a12 12 0 0 1 12 12 V${o.y + HEAD} z`} fill="var(--ink)" />
      <text x={o.x + W / 2} y={o.y + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--cream)">{o.name}</text>
      <text x={o.x + 12} y={o.y + l.dataLabel} fontSize="10" fontWeight="700" fill="currentColor" opacity=".6">DATA (hidden)</text>
      {o.data.map((d, i) => <text key={d} x={o.x + 16} y={o.y + l.firstData + i * LINE} fontSize="12.5" fill="currentColor">− {d}</text>)}
      <line x1={o.x} x2={o.x + W} y1={o.y + l.divider} y2={o.y + l.divider} stroke="var(--line)" />
      <text x={o.x + 12} y={o.y + l.opsLabel} fontSize="10" fontWeight="700" fill="currentColor" opacity=".6">OPERATIONS (public)</text>
      {o.ops.map((d, i) => <text key={d} x={o.x + 16} y={o.y + l.firstOp + i * LINE} fontSize="12.5" fill="currentColor">+ {d}</text>)}
    </g>
  )
}

function Message({ x1, y1, x2, y2, label, lx, ly }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--coral)" strokeWidth="2" markerEnd="url(#oo-arrow)" />
      <rect x={lx - 60} y={ly - 13} width="120" height="20" rx="10" fill="var(--bg)" stroke="var(--coral)" />
      <text x={lx} y={ly + 1} textAnchor="middle" fontSize="11" fill="currentColor">{label}</text>
    </g>
  )
}

export function ObjectOrientedArchitecture() {
  const top = layout(OBJECTS[0]).height + TOP // bottom edge of the first row
  const mid = (top + ROW2) / 2
  return (
    <svg viewBox="0 0 600 480" width="100%" style={{ maxWidth: 640, minWidth: 480, display: 'block', margin: '0 auto' }} role="img"
      aria-label="Object-oriented architecture: Student, Course, Enrolment and FeePayment objects each hide their data and expose operations; they cooperate only by sending messages">
      <defs>
        <marker id="oo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--coral)" />
        </marker>
      </defs>
      <text x="300" y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Objects (components) communicate only through messages (connectors)</text>
      {OBJECTS.map((o) => <ObjectBox key={o.name} o={o} />)}
      <Message x1={212} y1={100} x2={386} y2={100} label="addStudent(roll)" lx={299} ly={89} />
      <Message x1={212} y1={330} x2={386} y2={330} label="pay(amount)" lx={299} ly={319} />
      <Message x1={115} y1={top + 2} x2={115} y2={ROW2 - 3} label="enrol(course)" lx={190} ly={mid + 4} />
      <Message x1={485} y1={ROW2 - 2} x2={485} y2={top + 3} label="getSeats()" lx={410} ly={mid + 4} />
      <text x="300" y="468" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity=".75">Encapsulation: no object reads another&apos;s data directly; it calls that object&apos;s operations.</text>
    </svg>
  )
}
