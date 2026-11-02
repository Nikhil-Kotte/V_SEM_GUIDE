// SVG diagrams for data-science topics.

export function ElbowChart() {
  const wcss = [1000, 520, 260, 200, 170, 150, 138, 130]
  const W = 520, H = 260, pad = 44
  const x = (k) => pad + ((k - 1) / (wcss.length - 1)) * (W - 2 * pad)
  const y = (v) => H - pad - (v / 1000) * (H - 2 * pad)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block', margin: '0 auto' }} role="img" aria-label="Elbow method: WCSS falls steeply until k = 3, then flattens">
      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} stroke="currentColor" opacity=".5" />
      <line x1={pad} x2={pad} y1={14} y2={H - pad} stroke="currentColor" opacity=".5" />
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="currentColor">number of clusters k</text>
      <text x={14} y={H / 2} textAnchor="middle" fontSize="12" fill="currentColor" transform={`rotate(-90 14 ${H / 2})`}>WCSS (inertia)</text>
      <polyline fill="none" stroke="var(--coral-deep)" strokeWidth="2.5" points={wcss.map((v, i) => `${x(i + 1)},${y(v)}`).join(' ')} />
      {wcss.map((v, i) => (
        <g key={i}>
          <circle cx={x(i + 1)} cy={y(v)} r={i === 2 ? 7 : 4} fill={i === 2 ? 'var(--blue)' : 'var(--coral)'} />
          <text x={x(i + 1)} y={H - pad + 16} textAnchor="middle" fontSize="11" fill="currentColor">{i + 1}</text>
        </g>
      ))}
      <text x={x(3) + 12} y={y(260) - 10} fontSize="12.5" fontWeight="700" fill="var(--blue)">elbow → k = 3</text>
    </svg>
  )
}
