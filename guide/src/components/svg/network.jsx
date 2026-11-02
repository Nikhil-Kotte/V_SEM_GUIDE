import Timeline from './Timeline.jsx'

export function TcpHandshake() {
  return (
    <Timeline title="TCP three-way handshake" left="Client" right="Server"
      leftStates={['SYN_SENT', '', 'ESTABLISHED', '']} rightStates={['LISTEN', 'SYN_RCVD', '', 'ESTABLISHED']}
      messages={[
        { dir: 'r', label: 'SYN', sub: 'seq = x' },
        { dir: 'l', label: 'SYN + ACK', sub: 'seq = y, ack = x + 1', color: 'var(--blue)' },
        { dir: 'r', label: 'ACK', sub: 'seq = x + 1, ack = y + 1', color: 'var(--green)' },
      ]} />
  )
}

export function TcpRelease() {
  return (
    <Timeline title="TCP connection release" left="Client (closes first)" right="Server"
      leftStates={['FIN_WAIT_1', 'FIN_WAIT_2', '', 'TIME_WAIT (2·MSL)', '']} rightStates={['ESTABLISHED', 'CLOSE_WAIT', 'LAST_ACK', '', 'CLOSED']}
      messages={[
        { dir: 'r', label: 'FIN', sub: 'seq = u' },
        { dir: 'l', label: 'ACK', sub: 'ack = u + 1  (half-closed)', color: 'var(--green)' },
        { dir: 'l', label: 'FIN', sub: 'seq = w', color: 'var(--blue)' },
        { dir: 'r', label: 'ACK', sub: 'ack = w + 1', color: 'var(--green)' },
      ]} />
  )
}

export function SlidingWindow() {
  const cells = Array.from({ length: 14 }, (_, i) => i + 1)
  const group = (n) => (n <= 4 ? 'acked' : n <= 7 ? 'sent' : n <= 11 ? 'can' : 'cannot')
  const fill = { acked: 'var(--mint)', sent: 'var(--yellow-tint)', can: 'var(--blue-tint)', cannot: 'var(--surface-2)' }
  const w = 36
  return (
    <svg viewBox="0 0 560 150" width="100%" style={{ maxWidth: 560, display: 'block', margin: '0 auto' }} role="img" aria-label="TCP sliding window over a byte stream">
      {cells.map((n, i) => (
        <g key={n}>
          <rect x={20 + i * w} y={40} width={w - 2} height={34} rx="5" fill={fill[group(n)]} stroke="var(--line-strong)" />
          <text x={20 + i * w + (w - 2) / 2} y={62} textAnchor="middle" fontSize="12" fill="currentColor">{n}</text>
        </g>
      ))}
      <rect x={20 + 4 * w - 3} y={32} width={7 * w + 4} height={50} rx="8" fill="none" stroke="var(--coral-deep)" strokeWidth="2.5" />
      <text x={20 + 4 * w + (7 * w) / 2} y={24} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--coral-deep)">window (advertised by receiver) = 7 bytes</text>
      {[['acked', 'Sent & ACKed', 20], ['sent', 'Sent, not ACKed', 155], ['can', 'Can send now', 300], ['cannot', 'Can\'t send yet', 430]].map(([k, label, x]) => (
        <g key={k}>
          <rect x={x} y={100} width="14" height="14" rx="3" fill={fill[k]} stroke="var(--line-strong)" />
          <text x={x + 20} y={112} fontSize="12" fill="currentColor">{label}</text>
        </g>
      ))}
      <text x={20} y={140} fontSize="11.5" fill="currentColor" opacity=".75">ACK for byte 5 → left edge slides right · receiver frees buffer → right edge moves right</text>
    </svg>
  )
}

export function DnsResolution() {
  const box = (x, y, label, sub) => (
    <g>
      <rect x={x} y={y} width="118" height="46" rx="10" fill="var(--surface-2)" stroke="var(--line-strong)" />
      <text x={x + 59} y={y + 20} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="currentColor">{label}</text>
      {sub && <text x={x + 59} y={y + 36} textAnchor="middle" fontSize="10.5" fill="currentColor" opacity=".7">{sub}</text>}
    </g>
  )
  const arrow = (x1, y1, x2, y2, n, color = 'var(--coral-deep)') => (
    <g style={{ color }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" markerEnd="url(#dns-a)" />
      <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="9" fill="var(--surface)" stroke="currentColor" />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor">{n}</text>
    </g>
  )
  return (
    <svg viewBox="0 0 600 250" width="100%" style={{ maxWidth: 600, display: 'block', margin: '0 auto' }} role="img" aria-label="DNS resolution: host asks local server recursively; local server asks root, TLD and authoritative servers iteratively">
      <defs><marker id="dns-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" /></marker></defs>
      {box(10, 180, 'Your PC', 'resolver')}
      {box(200, 180, 'Local DNS server', 'ISP / campus')}
      {box(440, 10, 'Root server', '"ask .in TLD"')}
      {box(440, 100, 'TLD server (.in)', '"ask cbit.ac.in"')}
      {box(440, 190, 'Authoritative', 'cbit.ac.in')}
      {arrow(128, 196, 200, 196, 1, 'var(--blue)')}
      {arrow(200, 214, 128, 214, 8, 'var(--blue)')}
      {arrow(318, 186, 440, 40, 2)}
      {arrow(440, 52, 318, 196, 3)}
      {arrow(318, 200, 440, 120, 4)}
      {arrow(440, 134, 318, 206, 5)}
      {arrow(318, 210, 440, 206, 6)}
      {arrow(440, 222, 318, 222, 7)}
      <text x="10" y="150" fontSize="11.5" fill="var(--blue)" fontWeight="700">1, 8: recursive (PC ↔ local server)</text>
      <text x="10" y="166" fontSize="11.5" fill="var(--coral-deep)" fontWeight="700">2–7: iterative (referrals)</text>
    </svg>
  )
}
