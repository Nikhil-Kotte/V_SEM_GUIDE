// SVG diagrams for Design Thinking topics the notes don't illustrate.

const HATS = [
  ['White', '#ffffff', '#182d2a', 'Facts & data', 'What do we know? What do we need to find out?'],
  ['Red', '#e5484d', '#fff', 'Feelings & intuition', 'How do I feel about this, without justifying it?'],
  ['Black', '#182d2a', '#fff', 'Caution & risks', 'What could go wrong? Why might it fail?'],
  ['Yellow', '#f9db6d', '#182d2a', 'Benefits & optimism', 'What are the advantages? Why will it work?'],
  ['Green', '#3f9f68', '#fff', 'Creativity & new ideas', 'What else could we try? Any alternatives?'],
  ['Blue', '#315bea', '#fff', 'Process & control', 'What is the agenda? What is the next step?'],
]

export function SixHats() {
  return (
    <svg viewBox="0 0 600 300" width="100%" style={{ maxWidth: 640, display: 'block', margin: '0 auto' }} role="img" aria-label="Six thinking hats: white facts, red feelings, black caution, yellow benefits, green creativity, blue process">
      {HATS.map(([name, fill, , role, q], i) => {
        const x = 10 + (i % 3) * 197, y = 10 + Math.floor(i / 3) * 145
        return (
          <g key={name}>
            <rect x={x} y={y} width="185" height="132" rx="16" fill="var(--surface-2)" stroke="var(--line)" />
            <ellipse cx={x + 36} cy={y + 46} rx="26" ry="7" fill={fill} stroke="#182d2a" strokeWidth="1.2" />
            <path d={`M${x + 20} ${y + 45} q2 -26 16 -26 q14 0 16 26 z`} fill={fill} stroke="#182d2a" strokeWidth="1.2" />
            <text x={x + 72} y={y + 32} fontSize="15" fontWeight="800" fill="currentColor">{name} hat</text>
            <text x={x + 72} y={y + 50} fontSize="12" fill="currentColor" opacity=".8">{role}</text>
            <foreignObject x={x + 12} y={y + 64} width="162" height="64">
              <div style={{ fontSize: 12, lineHeight: 1.35, color: 'var(--text-soft)' }}>{q}</div>
            </foreignObject>
            <title>{`${name} hat: ${role}`}</title>
          </g>
        )
      })}
    </svg>
  )
}

export function AffinityDiagram() {
  const groups = [
    ['Long queues', ['"Canteen line takes 20 min"', '"Lunch break too short"', '"Rush at 1 pm"'], '#fde3da'],
    ['Payment hassle', ['"No UPI at counter"', '"Need exact change"', '"Card machine down"'], '#dfe6fc'],
    ['Menu & food', ['"Same menu daily"', '"Food gets cold"', '"No healthy options"'], '#dce7ca'],
  ]
  return (
    <svg viewBox="0 0 600 270" width="100%" style={{ maxWidth: 620, display: 'block', margin: '0 auto' }} role="img" aria-label="Affinity diagram: sticky notes from interviews grouped into three themes">
      <text x="300" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Interview notes about the college canteen, grouped by theme</text>
      {groups.map(([title, notes, color], g) => {
        const x = 12 + g * 197
        return (
          <g key={title}>
            <rect x={x} y="34" width="182" height="226" rx="14" fill="none" stroke="var(--line-strong)" strokeDasharray="5 4" />
            <rect x={x + 16} y="44" width="150" height="34" rx="6" fill="var(--ink)" />
            <text x={x + 91} y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--cream)">{title}</text>
            {notes.map((n, i) => (
              <g key={n} transform={`rotate(${(i % 2 ? 1.5 : -1.5)} ${x + 91} ${110 + i * 52})`}>
                <rect x={x + 16} y={88 + i * 52} width="150" height="42" rx="3" fill={color} stroke="rgba(0,0,0,.12)" />
                <text x={x + 91} y={113 + i * 52} textAnchor="middle" fontSize="11.5" fill="#182d2a">{n}</text>
              </g>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export function ValuePropositionCanvas() {
  const L = [['Products & services', 'Smart wallet app + thin card holder'], ['Gain creators', 'Tracks spending, auto-splits bills'], ['Pain relievers', 'Slim design, no lost cards, phone alert if left behind']]
  const R = [['Customer jobs', 'Pay quickly, carry ID and cards'], ['Gains', 'Feel organised, save money'], ['Pains', 'Bulky wallet, losing cards, splitting bills']]
  const row = (items, x, colorTitle) => items.map(([t, d], i) => (
    <g key={t}>
      <text x={x} y={70 + i * 62} fontSize="13" fontWeight="800" fill={colorTitle}>{t}</text>
      <foreignObject x={x} y={76 + i * 62} width="210" height="44"><div style={{ fontSize: 12, lineHeight: 1.35, color: 'var(--text-soft)' }}>{d}</div></foreignObject>
    </g>
  ))
  return (
    <svg viewBox="0 0 600 270" width="100%" style={{ maxWidth: 620, display: 'block', margin: '0 auto' }} role="img" aria-label="Value proposition canvas with value map (products, gain creators, pain relievers) matched to customer profile (jobs, gains, pains)">
      <rect x="10" y="30" width="270" height="225" rx="14" fill="var(--blue-tint)" />
      <circle cx="455" cy="142" r="128" fill="var(--coral-tint)" />
      <text x="145" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Value map (your offer)</text>
      <text x="455" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Customer profile</text>
      {row(L, 26, 'var(--blue)')}
      {row(R, 368, 'var(--coral-deep)')}
      <text x="300" y="150" textAnchor="middle" fontSize="22" fill="currentColor">⇄</text>
      <text x="300" y="172" textAnchor="middle" fontSize="10.5" fill="currentColor" opacity=".7">fit</text>
    </svg>
  )
}
