// Hand-drawn Computer Networks diagrams. Colours come from theme tokens, so they read in light and dark.
// Each export is registered in ./index.js with a caption.

const C = { blue: 'var(--blue)', red: 'var(--coral-deep)', green: 'var(--green)', gold: 'var(--gold)', violet: 'var(--violet)', soft: 'var(--surface-2)', line: 'var(--line-strong)' }

function Svg({ w, h, label, id, children, max = w }) {
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

const T = ({ x, y, children, size = 12.5, weight = 400, anchor = 'middle', color = 'currentColor', mono, italic }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} fontFamily={mono ? 'var(--font-mono)' : undefined} fontStyle={italic ? 'italic' : undefined}>{children}</text>
)

const Box = ({ x, y, w, h, fill = C.soft, stroke = C.line, label, sub, size = 12.5, weight = 700, r = 8, dash, color }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
    {label != null && <T x={x + w / 2} y={y + h / 2 + (sub ? -2 : 4.5)} size={size} weight={weight} color={color}>{label}</T>}
    {sub && <T x={x + w / 2} y={y + h / 2 + 13} size={10.5}>{sub}</T>}
  </g>
)

const Arr = ({ id, x1, y1, x2, y2, color = 'currentColor', dash, width = 1.8, both }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash}
    markerEnd={`url(#${id}-a)`} markerStart={both ? `url(#${id}-a)` : undefined} />
)

const Node = ({ x, y, label, r = 15, fill = 'var(--surface)', stroke = 'currentColor', color }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="1.8" />
    <T x={x} y={y + 4.5} size={12.5} weight={700} color={color}>{label}</T>
  </g>
)

// ============================ UNIT I ============================

export function CnComponents() {
  const id = 'cn-comp'
  return (
    <Svg w={600} h={210} id={id} label="Five components of data communication: sender, receiver, message, transmission medium and protocol">
      <Box x={20} y={30} w={130} h={44} fill="var(--blue-tint)" label="Protocol" sub="Rule 1 … Rule n" />
      <Box x={450} y={30} w={130} h={44} fill="var(--blue-tint)" label="Protocol" sub="Rule 1 … Rule n" />
      <Box x={20} y={110} w={130} h={56} label="Sender" sub="PC, phone, camera" />
      <Box x={450} y={110} w={130} h={56} label="Receiver" sub="PC, printer, phone" />
      <Arr id={id} x1={85} y1={78} x2={85} y2={106} />
      <Arr id={id} x1={515} y1={78} x2={515} y2={106} />
      <path d="M152 138 C 220 110, 300 166, 380 138 S 430 130, 446 138" fill="none" stroke={C.red} strokeWidth="3" markerEnd={`url(#${id}-a)`} />
      <T x={300} y={113} weight={700} color={C.red}>Transmission medium</T>
      <T x={300} y={180} size={11}>cable, fibre or radio waves</T>
      <Box x={195} y={14} w={210} h={44} fill="var(--yellow-tint)" label="Message" sub="text, numbers, image, audio, video" size={12} />
      <Arr id={id} x1={300} y1={62} x2={300} y2={98} color={C.gold} dash="4 4" />
    </Svg>
  )
}

export function CnDataFlow() {
  const id = 'cn-flow'
  const row = (y, title, sub, arrows) => (
    <g>
      <T x={20} y={y + 5} anchor="start" weight={700}>{title}</T>
      <T x={20} y={y + 21} anchor="start" size={10.5}>{sub}</T>
      <Box x={262} y={y - 14} w={70} h={34} label="A" />
      <Box x={516} y={y - 14} w={70} h={34} label="B" />
      {arrows}
    </g>
  )
  return (
    <Svg w={600} h={240} id={id} label="Data flow: simplex, half-duplex and full-duplex">
      {row(40, 'Simplex', 'one way only (keyboard → PC)', <Arr id={id} x1={336} y1={43} x2={512} y2={43} color={C.blue} width={2.4} />)}
      {row(120, 'Half-duplex', 'both ways, one at a time (walkie-talkie)', <>
        <Arr id={id} x1={336} y1={115} x2={512} y2={115} color={C.blue} width={2.4} />
        <Arr id={id} x1={512} y1={131} x2={336} y2={131} color={C.blue} width={2.4} dash="6 5" />
        <T x={424} y={107} size={10.5}>direction 1 at time 1</T>
        <T x={424} y={147} size={10.5}>direction 2 at time 2</T>
      </>)}
      {row(200, 'Full-duplex', 'both ways at once (phone call)', <>
        <Arr id={id} x1={336} y1={195} x2={512} y2={195} color={C.green} width={2.4} />
        <Arr id={id} x1={512} y1={211} x2={336} y2={211} color={C.red} width={2.4} />
      </>)}
    </Svg>
  )
}

export function CnTopologies() {
  const id = 'cn-topo'
  const pc = (x, y, k) => <rect key={k} x={x - 13} y={y - 10} width="26" height="20" rx="4" fill="var(--blue-tint)" stroke="currentColor" strokeWidth="1.5" />
  const mesh = Array.from({ length: 5 }, (_, i) => [150 + 62 * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / 5), 95 + 62 * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / 5)])
  const ring = Array.from({ length: 6 }, (_, i) => [450 + 60 * Math.cos((i * Math.PI) / 3), 330 + 60 * Math.sin((i * Math.PI) / 3)])
  const star = [[340, 50], [560, 50], [340, 150], [560, 150]]
  return (
    <Svg w={620} h={430} id={id} label="Four basic topologies: mesh, star, bus and ring">
      <T x={150} y={18} weight={700}>Mesh: every device to every other</T>
      {mesh.flatMap((a, i) => mesh.slice(i + 1).map((b, j) => <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.line} strokeWidth="1.5" />))}
      {mesh.map(([x, y], i) => pc(x, y, i))}
      <T x={150} y={182} size={11}>5 devices → 5 × 4 / 2 = 10 links</T>

      <T x={450} y={18} weight={700}>Star: everyone to a central hub</T>
      {star.map(([x, y], i) => <line key={i} x1={x} y1={y} x2={450} y2={100} stroke={C.line} strokeWidth="1.5" />)}
      {star.map(([x, y], i) => pc(x, y, i))}
      <Box x={420} y={86} w={60} h={28} fill="var(--yellow-tint)" label="Hub" size={11.5} />
      <T x={450} y={182} size={11}>hub fails → whole network down</T>

      <T x={150} y={232} weight={700}>Bus: one shared backbone</T>
      <line x1={40} y1={330} x2={260} y2={330} stroke="currentColor" strokeWidth="3" />
      <rect x={34} y={322} width="8" height="16" fill={C.red} /><rect x={258} y={322} width="8" height="16" fill={C.red} />
      {[70, 150, 230].map((x, i) => <g key={i}><line x1={x} y1={330} x2={x} y2={290} stroke="currentColor" strokeWidth="1.5" />{pc(x, 280, i)}</g>)}
      {[110, 190].map((x, i) => <g key={i}><line x1={x} y1={330} x2={x} y2={370} stroke="currentColor" strokeWidth="1.5" />{pc(x, 380, i)}</g>)}
      <T x={150} y={410} size={11}>terminators (red) stop reflections; a break stops all</T>

      <T x={450} y={232} weight={700}>Ring: a closed loop</T>
      <circle cx={450} cy={330} r={60} fill="none" stroke={C.line} strokeWidth="1.8" />
      <path d="M 510 330 A 60 60 0 0 1 480 382" fill="none" stroke={C.blue} strokeWidth="2.4" markerEnd={`url(#${id}-a)`} />
      {ring.map(([x, y], i) => pc(x, y, i))}
      <T x={450} y={410} size={11}>signal passes device to device in one direction</T>
    </Svg>
  )
}

export function CnOsiEncap() {
  const id = 'cn-osi'
  const L = [['7', 'Application', 'D7'], ['6', 'Presentation', 'D6'], ['5', 'Session', 'D5'], ['4', 'Transport', 'Segment'], ['3', 'Network', 'Packet'], ['2', 'Data link', 'Frame'], ['1', 'Physical', 'Bits']]
  const hd = ['H7', 'H6', 'H5', 'H4', 'H3', 'H2']
  const row = 44
  return (
    <Svg w={640} h={L.length * row + 70} id={id} label="OSI model: data passes down the sender's seven layers, each adding a header, and up the receiver's layers">
      <T x={110} y={18} weight={700}>Sender</T>
      <T x={530} y={18} weight={700}>Receiver</T>
      {L.map(([n, name], i) => {
        const y = 30 + i * row
        return (
          <g key={n}>
            <Box x={40} y={y} w={140} h={34} fill={i < 3 ? 'var(--violet-tint)' : i < 5 ? 'var(--blue-tint)' : 'var(--mint)'} label={`${n}  ${name}`} size={12} />
            <Box x={460} y={y} w={140} h={34} fill={i < 3 ? 'var(--violet-tint)' : i < 5 ? 'var(--blue-tint)' : 'var(--mint)'} label={`${n}  ${name}`} size={12} />
            {i < 6 && <line x1={186} y1={y + 17} x2={454} y2={y + 17} stroke={C.line} strokeDasharray="4 5" />}
            {i < 6 && (() => {
              const heads = hd.slice(0, i + 1).reverse()
              const trailer = i === 5
              const total = heads.length * 26 + 46 + (trailer ? 26 : 0)
              let x = 320 - total / 2
              const parts = [...heads.map((h) => [h, 26, 'var(--yellow-tint)']), ['DATA', 46, 'var(--blue-tint)'], ...(trailer ? [['T2', 26, 'var(--yellow-tint)']] : [])]
              return parts.map(([t, w, fill], k) => {
                const el = (
                  <g key={k}>
                    <rect x={x} y={y + 6} width={w} height={22} fill={fill} stroke="currentColor" strokeWidth="1" />
                    <T x={x + w / 2} y={y + 21} size={9.5} weight={700} mono>{t}</T>
                  </g>
                )
                x += w
                return el
              })
            })()}
          </g>
        )
      })}
      <T x={320} y={30 + 6 * row + 22} size={11.5} mono>010110101001110 …</T>
      <path d={`M 110 ${30 + 7 * row - 6} V ${30 + 7 * row + 18} H 530 V ${30 + 7 * row - 6}`} fill="none" stroke={C.red} strokeWidth="2.4" markerEnd={`url(#${id}-a)`} />
      <T x={320} y={30 + 7 * row + 34} size={11.5} color={C.red} weight={700}>transmission medium</T>
      <Arr id={id} x1={30} y1={34} x2={30} y2={30 + 7 * row - 12} color={C.blue} />
      <Arr id={id} x1={610} y1={30 + 7 * row - 12} x2={610} y2={34} color={C.blue} />
      <T x={320} y={30 + 7 * row + 52} size={10.5}>yellow boxes: the header (H) each layer adds; layer 2 also adds a trailer (T2). Dashed lines: peer-to-peer (virtual) communication.</T>
    </Svg>
  )
}

export function CnOsiVsTcpip() {
  const id = 'cn-map'
  const osi = ['Application', 'Presentation', 'Session', 'Transport', 'Network', 'Data link', 'Physical']
  const h = 36
  const tcp = [[0, 3, 'Application', 'HTTP, SMTP, FTP, DNS, TELNET, SNMP', 'var(--violet-tint)'], [3, 1, 'Transport', 'TCP, UDP, SCTP', 'var(--blue-tint)'], [4, 1, 'Internet', 'IP, ICMP, ARP, IGMP', 'var(--blue-tint)'], [5, 2, 'Host-to-network', 'Ethernet, Wi-Fi, PPP', 'var(--mint)']]
  return (
    <Svg w={620} h={7 * h + 50} id={id} label="OSI's seven layers mapped onto TCP/IP's four">
      <T x={110} y={18} weight={700}>OSI (7 layers)</T>
      <T x={430} y={18} weight={700}>TCP/IP (4 layers)</T>
      {osi.map((n, i) => <Box key={n} x={40} y={30 + i * h} w={140} h={h - 4} label={`${7 - i}  ${n}`} size={12} />)}
      {tcp.map(([s, span, name, eg, fill]) => (
        <g key={name}>
          <Box x={300} y={30 + s * h} w={260} h={span * h - 4} fill={fill} label={name} sub={eg} />
          <path d={`M 182 ${30 + s * h + 2} L 298 ${30 + s * h + 2} M 182 ${30 + (s + span) * h - 6} L 298 ${30 + (s + span) * h - 6}`} stroke={C.line} strokeDasharray="4 4" />
        </g>
      ))}
    </Svg>
  )
}

export function CnAddresses() {
  const rows = [
    ['Specific address', 'Application', 'user@cbit.ac.in, www.cbit.ac.in', 'var(--violet-tint)'],
    ['Port address', 'Transport', '16 bits, e.g. 80 (HTTP), 25 (SMTP), 753', 'var(--blue-tint)'],
    ['Logical (IP) address', 'Network', '32 bits, e.g. 192.168.10.5', 'var(--blue-tint)'],
    ['Physical (MAC) address', 'Data link', '48 bits, e.g. 07:01:02:01:2C:4B', 'var(--mint)'],
  ]
  return (
    <Svg w={600} h={rows.length * 50 + 20} id="cn-addr" label="Four levels of addresses in TCP/IP">
      {rows.map(([a, layer, eg, fill], i) => (
        <g key={a}>
          <Box x={10} y={10 + i * 50} w={180} h={40} fill={fill} label={a} size={12} />
          <Box x={200} y={10 + i * 50} w={110} h={40} label={layer} weight={400} size={12} />
          <T x={320} y={35 + i * 50} anchor="start" mono size={12}>{eg}</T>
        </g>
      ))}
    </Svg>
  )
}

export function CnSwitching() {
  const id = 'cn-sw'
  const sw = (x, y, k) => <rect key={k} x={x - 14} y={y - 14} width="28" height="28" rx="6" fill="var(--surface)" stroke="currentColor" strokeWidth="1.6" />
  const panel = (ox, title, sub, content) => (
    <g transform={`translate(${ox} 0)`}>
      <T x={95} y={18} weight={700}>{title}</T>
      <T x={95} y={34} size={10.5}>{sub}</T>
      <Box x={0} y={92} w={36} h={30} fill="var(--blue-tint)" label="A" />
      <Box x={154} y={92} w={36} h={30} fill="var(--blue-tint)" label="B" />
      {[[60, 70], [95, 140], [130, 70], [95, 60]].map(([x, y], k) => sw(x, y, k))}
      <path d="M36 107 L60 70 L95 60 L130 70 L154 107 M36 107 L95 140 L154 107 M60 70 L95 140 L130 70" fill="none" stroke={C.line} strokeWidth="1.4" />
      {content}
    </g>
  )
  return (
    <Svg w={640} h={220} id={id} label="Circuit switching, datagram packet switching and virtual-circuit switching" max={640}>
      {panel(10, 'Circuit switching', 'one dedicated path, reserved first',
        <path d="M36 102 L60 65 L95 55 L130 65 L154 102" fill="none" stroke={C.red} strokeWidth="4" />)}
      {panel(225, 'Datagram', 'each packet routed on its own',
        <g>
          <path d="M36 102 L60 65 L95 55 L130 65 L154 102" fill="none" stroke={C.blue} strokeWidth="2.4" strokeDasharray="6 4" />
          <path d="M36 112 L95 140 L154 112" fill="none" stroke={C.green} strokeWidth="2.4" strokeDasharray="6 4" />
          <path d="M36 107 L60 70 L95 140 L130 70 L154 107" fill="none" stroke={C.gold} strokeWidth="2.2" strokeDasharray="2 4" />
          <T x={95} y={180} size={11}>packets 1, 2, 3 may arrive 3, 1, 2</T>
        </g>)}
      {panel(440, 'Virtual circuit', 'path set up once, then reused',
        <g>
          <path d="M36 107 L95 140 L154 107" fill="none" stroke={C.violet} strokeWidth="4" />
          <T x={95} y={180} size={11}>same route for all, VC id 7</T>
        </g>)}
      <T x={105} y={180} size={11}>setup → data → teardown</T>
      <T x={320} y={208} size={10.5}>Squares are switches or routers.</T>
    </Svg>
  )
}

export function CnCables() {
  return (
    <Svg w={620} h={220} id="cn-cable" label="Twisted-pair cable and coaxial cable">
      <T x={150} y={18} weight={700}>Twisted pair (UTP / STP)</T>
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <path d={`M ${30 + i * 40} 70 C ${45 + i * 40} 50, ${55 + i * 40} 50, ${70 + i * 40} 70`} fill="none" stroke={C.blue} strokeWidth="5" />
          <path d={`M ${30 + i * 40} 70 C ${45 + i * 40} 90, ${55 + i * 40} 90, ${70 + i * 40} 70`} fill="none" stroke={C.red} strokeWidth="5" />
        </g>
      ))}
      <rect x={22} y={40} width={256} height={60} rx="12" fill="none" stroke={C.line} strokeDasharray="6 4" strokeWidth="2" />
      <T x={150} y={120} size={11}>two insulated copper wires twisted together;</T>
      <T x={150} y={136} size={11}>twists cancel noise and crosstalk.</T>
      <T x={150} y={152} size={11}>dashed: the metal foil/braid shield of STP</T>

      <T x={470} y={18} weight={700}>Coaxial cable (cross-section)</T>
      {[[70, 'var(--surface-2)', 'Plastic jacket'], [56, 'var(--gold)', 'Outer conductor (braid)'], [44, 'var(--blue-tint)', 'Insulator'], [12, C.red, 'Inner copper conductor']].map(([r, fill], i) => (
        <circle key={i} cx={420} cy={110} r={r} fill={fill} stroke="currentColor" strokeWidth="1.2" />
      ))}
      {[[70, 'Plastic jacket', 40], [56, 'Outer conductor (braid)', 78], [44, 'Insulator', 116], [12, 'Inner conductor', 154]].map(([r, label, y]) => (
        <g key={label}>
          <line x1={420 + r * 0.7} y1={110 - r * 0.7 + (y - 40) * 0.6} x2={500} y2={y} stroke={C.line} />
          <T x={505} y={y + 4} anchor="start" size={11}>{label}</T>
        </g>
      ))}
    </Svg>
  )
}

export function CnFiber() {
  const id = 'cn-fib'
  const zig = 'M 30 80 L 110 46 L 190 114 L 270 46 L 350 114 L 430 46 L 510 114 L 570 89'
  return (
    <Svg w={600} h={300} id={id} label="Optical fibre: light stays in the core by total internal reflection; multimode and single-mode fibre">
      <rect x={20} y={20} width={560} height={120} rx="14" fill="var(--blue-tint)" stroke="currentColor" />
      <rect x={20} y={40} width={560} height={80} fill="var(--yellow-tint)" stroke="currentColor" />
      <T x={540} y={34} size={11} anchor="end">cladding (lower refractive index)</T>
      <T x={540} y={134} size={11} anchor="end">cladding</T>
      <T x={270} y={110} size={10.5} weight={700}>core (glass, higher index)</T>
      <path d={zig} fill="none" stroke={C.red} strokeWidth="2.4" markerEnd={`url(#${id}-a)`} />
      <T x={300} y={162} size={11.5}>Light hits the core–cladding boundary above the critical angle, so it is reflected back in (total internal reflection).</T>
      {[['Multimode, step-index', 'many paths, modal dispersion', 'M 30 230 L 80 206 L 130 254 L 180 206 L 230 254 L 270 236'],
        ['Multimode, graded-index', 'curved paths, less dispersion', 'M 330 230 C 360 200, 380 200, 410 230 S 460 260, 490 230 S 540 200, 570 230'],
      ].map(([t, s, d], i) => (
        <g key={t}>
          <rect x={20 + i * 300} y={200} width={260} height={60} fill="var(--yellow-tint)" stroke="currentColor" />
          <path d={d} fill="none" stroke={C.red} strokeWidth="2" />
          <T x={150 + i * 300} y={192} size={11.5} weight={700}>{t}</T>
          <T x={150 + i * 300} y={278} size={10.5}>{s}</T>
        </g>
      ))}
      <T x={300} y={296} size={10.5}>Single-mode fibre has a very thin core (≈ 8–10 µm): one straight path, so it carries data the farthest.</T>
    </Svg>
  )
}

export function CnSpectrum() {
  const bands = [
    ['Radio waves', '3 kHz – 1 GHz', 'omnidirectional, pass through walls', 'AM/FM radio, TV, paging', 'var(--mint)'],
    ['Microwaves', '1 – 300 GHz', 'unidirectional, line of sight', 'cellular, satellite, Wi-Fi links', 'var(--blue-tint)'],
    ['Infrared', '300 GHz – 400 THz', 'short range, blocked by walls', 'TV remotes, IrDA', 'var(--coral-tint)'],
  ]
  return (
    <Svg w={600} h={170} id="cn-spec" label="Wireless spectrum: radio waves, microwaves and infrared">
      {bands.map(([n, f, p, u, fill], i) => (
        <g key={n}>
          <Box x={10 + i * 196} y={20} w={186} h={44} fill={fill} label={n} sub={f} />
          <T x={103 + i * 196} y={88} size={11}>{p}</T>
          <T x={103 + i * 196} y={106} size={11} weight={700}>{u}</T>
        </g>
      ))}
      <line x1={10} y1={130} x2={590} y2={130} stroke="currentColor" strokeWidth="1.6" markerEnd="url(#cn-spec-a)" />
      <T x={300} y={152} size={11}>frequency rises → wavelength falls → signals become more directional and more easily blocked</T>
    </Svg>
  )
}

// ============================ UNIT II ============================

export function CnFrame() {
  return (
    <Svg w={600} h={170} id="cn-frame" label="The data link layer puts each packet from the network layer into a frame with a header and a trailer">
      <Box x={200} y={14} w={200} h={36} fill="var(--blue-tint)" label="Packet" sub="from the network layer" />
      <line x1={200} y1={50} x2={150} y2={90} stroke={C.line} strokeDasharray="4 4" />
      <line x1={400} y1={50} x2={450} y2={90} stroke={C.line} strokeDasharray="4 4" />
      <Box x={40} y={90} w={110} h={44} fill="var(--yellow-tint)" label="Header" sub="address, seq, ack" r={2} />
      <Box x={150} y={90} w={300} h={44} fill="var(--blue-tint)" label="Payload field (the packet)" r={2} />
      <Box x={450} y={90} w={110} h={44} fill="var(--yellow-tint)" label="Trailer" sub="checksum (CRC)" r={2} />
      <T x={300} y={158} size={11}>Frame = header + payload + trailer. Frame management is the heart of the data link layer.</T>
    </Svg>
  )
}

const Cells = ({ x, y, cells, w = 34 }) => cells.map(([t, kind], i) => (
  <g key={i}>
    <rect x={x + i * w} y={y} width={w - 2} height={28} rx="3"
      fill={kind === 'flag' ? 'var(--coral-tint)' : kind === 'esc' ? 'var(--yellow-tint)' : kind === 'new' ? 'var(--mint)' : 'var(--surface)'} stroke={C.line} />
    <T x={x + i * w + (w - 2) / 2} y={y + 18} size={11} weight={kind ? 700 : 400} mono>{t}</T>
  </g>
))

export function CnByteStuffing() {
  const ex = [
    [[['A'], ['FLAG', 'flag'], ['B']], [['A'], ['ESC', 'new'], ['FLAG', 'flag'], ['B']]],
    [[['A'], ['ESC', 'esc'], ['B']], [['A'], ['ESC', 'new'], ['ESC', 'esc'], ['B']]],
    [[['A'], ['ESC', 'esc'], ['FLAG', 'flag'], ['B']], [['A'], ['ESC', 'new'], ['ESC', 'esc'], ['ESC', 'new'], ['FLAG', 'flag'], ['B']]],
  ]
  return (
    <Svg w={620} h={250} id="cn-bs" label="Byte stuffing: an ESC byte is inserted before every accidental FLAG or ESC byte in the data">
      <Cells x={10} y={10} w={62} cells={[['FLAG', 'flag'], ['Header'], ['Payload …'], [''], ['Trailer'], ['FLAG', 'flag']]} />
      <T x={400} y={28} anchor="start" size={11}>a frame delimited by flag bytes</T>
      <T x={120} y={70} weight={700}>Original bytes</T>
      <T x={430} y={70} weight={700}>After stuffing</T>
      {ex.map(([a, b], i) => (
        <g key={i}>
          <Cells x={30} y={84 + i * 48} w={46} cells={a} />
          <line x1={230} y1={98 + i * 48} x2={300} y2={98 + i * 48} stroke="currentColor" markerEnd="url(#cn-bs-a)" />
          <Cells x={310} y={84 + i * 48} w={46} cells={b} />
        </g>
      ))}
      <T x={310} y={240} size={11}>green = the ESC byte the sender adds; the receiver removes it again</T>
    </Svg>
  )
}

export function CnBitStuffing() {
  const orig = '011011111111111111110010'
  const stuffed = '011011111011111011111010010'
  const added = new Set([9, 15, 21])
  const row = (y, label, bits, mark) => (
    <g>
      <T x={10} y={y + 18} anchor="start" size={11.5} weight={700}>{label}</T>
      {bits.split('').map((b, i) => (
        <g key={i}>
          <rect x={150 + i * 16} y={y} width={15} height={26} fill={mark && mark.has(i) ? 'var(--mint)' : 'var(--surface)'} stroke={C.line} />
          <T x={157.5 + i * 16} y={y + 18} size={12} mono weight={mark && mark.has(i) ? 700 : 400}>{b}</T>
        </g>
      ))}
    </g>
  )
  return (
    <Svg w={600} h={150} id="cn-bits" label="Bit stuffing: after five consecutive 1s the sender inserts a 0">
      {row(10, '(a) Original data', orig)}
      {row(52, '(b) On the line', stuffed, added)}
      {row(94, '(c) After destuffing', orig)}
      <T x={300} y={142} size={11}>Flag = 01111110. After every five 1s in the data a 0 is stuffed (green), so the flag can never appear inside a frame.</T>
    </Svg>
  )
}

export function CnCharCount() {
  const frames = [[5, 1, 2, 3, 4], [5, 6, 7, 8, 9], [8, 0, 1, 2, 3, 4, 5, 6], [8, 7, 8, 9, 0, 1, 2, 3]]
  const fill = ['var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--violet-tint)']
  let i = 0
  const cells = frames.flatMap((f, k) => f.map((v, j) => ({ v, k, count: j === 0, idx: i++ })))
  return (
    <Svg w={620} h={150} id="cn-cc" label="Character count framing: the first byte of each frame gives its length; one garbled count breaks every frame after it">
      <T x={10} y={18} anchor="start" weight={700}>(a) Without errors: frames of 5, 5, 8 and 8 characters</T>
      {cells.map((c) => (
        <g key={c.idx}>
          <rect x={10 + c.idx * 23} y={28} width={22} height={26} fill={fill[c.k]} stroke={C.line} />
          <T x={21 + c.idx * 23} y={46} size={11.5} mono weight={c.count ? 700 : 400} color={c.count ? C.red : 'currentColor'}>{c.v}</T>
        </g>
      ))}
      <T x={10} y={88} anchor="start" weight={700}>(b) With one error: the second count 5 arrives as 7</T>
      {cells.map((c) => (
        <g key={c.idx}>
          <rect x={10 + c.idx * 23} y={98} width={22} height={26} fill={c.idx < 5 ? fill[0] : c.idx < 12 ? 'var(--coral-tint)' : 'var(--surface-2)'} stroke={C.line} />
          <T x={21 + c.idx * 23} y={116} size={11.5} mono color={c.idx === 5 ? C.red : 'currentColor'} weight={c.idx === 5 ? 700 : 400}>{c.idx === 5 ? 7 : c.v}</T>
        </g>
      ))}
      <T x={310} y={143} size={11}>the receiver loses its place: it reads frame 2 as 7 characters, and every frame after that is wrong</T>
    </Svg>
  )
}

export function CnHamming() {
  const pos = Array.from({ length: 11 }, (_, i) => i + 1)
  const parity = new Set([1, 2, 4, 8])
  const covers = (p) => pos.filter((n) => n & p)
  return (
    <Svg w={600} h={250} id="cn-ham" label="Hamming code positions: check bits sit at positions 1, 2, 4 and 8; each checks the positions whose number has that bit set">
      <T x={10} y={18} anchor="start" weight={700}>Bit positions of an (11, 7) Hamming codeword</T>
      {pos.map((p, i) => (
        <g key={p}>
          <rect x={60 + i * 48} y={28} width={46} height={34} rx="4" fill={parity.has(p) ? 'var(--coral-tint)' : 'var(--blue-tint)'} stroke={C.line} />
          <T x={83 + i * 48} y={50} size={12} weight={700} mono>{parity.has(p) ? `P${p}` : 'D'}</T>
          <T x={83 + i * 48} y={78} size={11} mono>{p}</T>
        </g>
      ))}
      <T x={10} y={78} anchor="start" size={11}>pos</T>
      {[1, 2, 4, 8].map((p, r) => (
        <g key={p}>
          <T x={10} y={112 + r * 32} anchor="start" size={11.5} weight={700} color={C.red}>{`P${p}`}</T>
          {covers(p).map((n) => <circle key={n} cx={83 + (n - 1) * 48} cy={108 + r * 32} r={9} fill={n === p ? C.red : 'var(--surface-2)'} stroke={C.red} />)}
        </g>
      ))}
      <T x={300} y={242} size={11}>A dot means "this check bit covers that position" (position 5 = 4 + 1 is checked by P1 and P4).</T>
    </Svg>
  )
}

export function CnCrcFlow() {
  const id = 'cn-crc'
  return (
    <Svg w={620} h={200} id={id} label="CRC: the sender divides the data with r zeros by the generator and appends the remainder; the receiver divides the whole frame and accepts it if the remainder is zero">
      <T x={150} y={18} weight={700}>Sender</T>
      <Box x={20} y={30} w={260} h={34} fill="var(--blue-tint)" label="M(x): data  +  r zeros" />
      <Arr id={id} x1={150} y1={66} x2={150} y2={86} />
      <Box x={20} y={88} w={260} h={34} fill="var(--yellow-tint)" label="÷ G(x)  (modulo-2)  →  remainder R" />
      <Arr id={id} x1={150} y1={124} x2={150} y2={144} />
      <Box x={20} y={146} w={260} h={34} fill="var(--mint)" label="send T(x) = data followed by R" />
      <Arr id={id} x1={284} y1={163} x2={336} y2={163} color={C.red} width={2.4} />
      <T x={470} y={18} weight={700}>Receiver</T>
      <Box x={340} y={30} w={260} h={34} fill="var(--blue-tint)" label="received frame ÷ G(x)" />
      <Arr id={id} x1={470} y1={66} x2={470} y2={86} />
      <Box x={340} y={88} w={120} h={60} fill="var(--mint)" label="remainder 0" sub="accept" />
      <Box x={480} y={88} w={120} h={60} fill="var(--coral-tint)" label="remainder ≠ 0" sub="error: discard" />
    </Svg>
  )
}

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

export const CnStopWait = () => (
  <Exchange id="cn-sw1" label="Stop-and-wait on an error-free channel: send one frame, wait for the acknowledgement, then send the next"
    msgs={[{ from: 'l', t: 0, label: 'Frame 0' }, { from: 'r', t: 1.3, label: 'ACK' }, { from: 'l', t: 2.6, label: 'Frame 1' }, { from: 'r', t: 3.9, label: 'ACK' }, { from: 'l', t: 5.2, label: 'Frame 2' }]}
    notes={[{ side: 'l', t: 0, text: 'send' }, { side: 'l', t: 1.3, text: 'wait …' }, { side: 'l', t: 2.3, text: 'ACK in → send next' }, { side: 'r', t: 1, text: 'deliver to NL' }, { side: 'r', t: 3.6, text: 'deliver to NL' }]} />
)

export const CnPar = () => (
  <Exchange id="cn-par" label="Stop-and-wait for a noisy channel (PAR / ARQ): a lost frame is resent after a timeout; a lost ACK causes a duplicate that the receiver discards using the sequence number"
    msgs={[
      { from: 'l', t: 0, label: 'Frame 0' }, { from: 'r', t: 1.2, label: 'ACK 0' },
      { from: 'l', t: 2.4, label: 'Frame 1', lost: true }, { from: 'l', t: 4.6, label: 'Frame 1 (again)' }, { from: 'r', t: 5.8, label: 'ACK 1', lost: true },
      { from: 'l', t: 8, label: 'Frame 1 (again)' }, { from: 'r', t: 9.2, label: 'ACK 1' },
    ]}
    notes={[
      { side: 'l', t: 2.4, text: 'start timer' }, { side: 'l', t: 4.5, text: 'timeout!', color: C.red }, { side: 'r', t: 5.6, text: 'new frame 1 → deliver' },
      { side: 'l', t: 7.9, text: 'timeout!', color: C.red }, { side: 'r', t: 9.1, text: 'duplicate → discard', color: C.red },
    ]} />
)

export const CnGbn = () => (
  <Exchange id="cn-gbn" left="Sender (window 7)" right="Receiver (window 1)" unit={30} travel={2}
    label="Go-Back-N: frame 2 is lost, the receiver discards frames 3 to 5, and after a timeout the sender resends from frame 2"
    msgs={[
      { from: 'l', t: 0, label: '0' }, { from: 'l', t: 0.7, label: '1' }, { from: 'l', t: 1.4, label: '2', lost: true }, { from: 'l', t: 2.1, label: '3' }, { from: 'l', t: 2.8, label: '4' }, { from: 'l', t: 3.5, label: '5' },
      { from: 'r', t: 2.1, label: '' }, { from: 'r', t: 2.8, label: '' },
      { from: 'l', t: 6.4, label: '2', color: C.red }, { from: 'l', t: 7.1, label: '3', color: C.red }, { from: 'l', t: 7.8, label: '4', color: C.red }, { from: 'l', t: 8.5, label: '5', color: C.red },
    ]}
    notes={[{ side: 'l', t: 4.1, text: 'ACK 0 in', color: C.green }, { side: 'l', t: 4.8, text: 'ACK 1 in', color: C.green }, { side: 'r', t: 4.1, text: '3 out of order → discard', color: C.red }, { side: 'r', t: 4.8, text: '4 → discard', color: C.red }, { side: 'r', t: 5.5, text: '5 → discard', color: C.red }, { side: 'l', t: 6.3, text: 'timeout on 2: go back', color: C.red }, { side: 'r', t: 8.4, text: '2, 3, 4, 5 accepted in order' }]} />
)

export const CnSr = () => (
  <Exchange id="cn-sr" left="Sender" right="Receiver (window 4)" unit={30} travel={2}
    label="Selective repeat: frame 2 is lost, the receiver buffers frames 3 to 5 and sends a NAK, and only frame 2 is resent"
    msgs={[
      { from: 'l', t: 0, label: '0' }, { from: 'l', t: 0.7, label: '1' }, { from: 'l', t: 1.4, label: '2', lost: true }, { from: 'l', t: 2.1, label: '3' }, { from: 'l', t: 2.8, label: '4' }, { from: 'l', t: 3.5, label: '5' },
      { from: 'r', t: 2.1, label: '' }, { from: 'r', t: 2.8, label: '' }, { from: 'r', t: 4.2, label: '', color: C.red },
      { from: 'l', t: 6.4, label: '2 only', color: C.red }, { from: 'r', t: 8.5, label: 'ACK 5' },
    ]}
    notes={[{ side: 'l', t: 4.1, text: 'ACK 0 in', color: C.green }, { side: 'l', t: 4.8, text: 'ACK 1 in', color: C.green }, { side: 'l', t: 6.2, text: 'NAK 2 in → resend 2', color: C.red }, { side: 'r', t: 4.1, text: '3 → buffer, NAK 2' }, { side: 'r', t: 4.8, text: '4 → buffer' }, { side: 'r', t: 5.5, text: '5 → buffer' }, { side: 'r', t: 8.4, text: '2 arrives → deliver 2, 3, 4, 5' }]} />
)

export function CnWindow() {
  const seq = [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3]
  const kind = (i) => (i < 2 ? 'acked' : i < 5 ? 'sent' : i < 9 ? 'can' : 'no')
  const fill = { acked: 'var(--mint)', sent: 'var(--yellow-tint)', can: 'var(--blue-tint)', no: 'var(--surface-2)' }
  return (
    <Svg w={600} h={160} id="cn-win" label="Sender's sliding window over 3-bit sequence numbers">
      {seq.map((n, i) => (
        <g key={i}>
          <rect x={20 + i * 46} y={44} width={44} height={36} rx="5" fill={fill[kind(i)]} stroke={C.line} />
          <T x={42 + i * 46} y={67} size={13} weight={700} mono>{n}</T>
        </g>
      ))}
      <rect x={20 + 2 * 46 - 4} y={36} width={7 * 46 + 6} height={52} rx="9" fill="none" stroke={C.red} strokeWidth="2.6" />
      <T x={20 + 2 * 46 + (7 * 46) / 2} y={28} size={12} weight={700} color={C.red}>sending window (size 7 with 3-bit numbers)</T>
      {[['acked', 'sent and acknowledged', 20], ['sent', 'sent, waiting for ACK', 175], ['can', 'may send now', 330], ['no', 'outside the window', 450]].map(([k, l, x]) => (
        <g key={k}><rect x={x} y={104} width={14} height={14} rx="3" fill={fill[k]} stroke={C.line} /><T x={x + 20} y={115} anchor="start" size={11}>{l}</T></g>
      ))}
      <T x={300} y={148} size={11}>An ACK moves the lower edge right; sending a new frame moves the upper edge right. Numbers wrap after 2ⁿ − 1.</T>
    </Svg>
  )
}

export function CnAlohaVulnerable() {
  return (
    <Svg w={620} h={200} id="cn-alo" label="ALOHA vulnerable period: 2t for pure ALOHA, t for slotted ALOHA">
      <T x={10} y={20} anchor="start" weight={700}>Pure ALOHA: vulnerable for 2t</T>
      <line x1={20} y1={80} x2={600} y2={80} stroke="currentColor" />
      <rect x={250} y={50} width={120} height={30} fill="var(--blue-tint)" stroke="currentColor" />
      <T x={310} y={70} size={11.5} weight={700}>our frame (t)</T>
      <rect x={130} y={84} width={240} height={14} fill="var(--coral-tint)" stroke={C.red} />
      <T x={250} y={95} size={10.5} weight={700} color={C.red}>any other start here collides: t0 − t … t0 + t</T>
      <T x={250} y={42} size={11} mono>t0</T><line x1={250} y1={46} x2={250} y2={50} stroke="currentColor" />
      <T x={10} y={130} anchor="start" weight={700}>Slotted ALOHA: vulnerable for t (one slot)</T>
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={20 + i * 80} y1={150} x2={20 + i * 80} y2={186} stroke={C.line} />)}
      <line x1={20} y1={180} x2={600} y2={180} stroke="currentColor" />
      <rect x={260} y={150} width={80} height={30} fill="var(--blue-tint)" stroke="currentColor" />
      <rect x={260} y={182} width={80} height={12} fill="var(--coral-tint)" stroke={C.red} />
      <T x={300} y={170} size={11.5} weight={700}>frame</T>
      <T x={470} y={170} size={10.5}>frames start only at slot edges</T>
    </Svg>
  )
}

export function CnAlohaThroughput() {
  const G = Array.from({ length: 61 }, (_, i) => i * 0.05)
  const X = (g) => 50 + g * 170, Y = (s) => 210 - s * 480
  const pts = (f) => G.map((g) => `${X(g).toFixed(1)},${Y(f(g)).toFixed(1)}`).join(' ')
  return (
    <Svg w={600} h={250} id="cn-thr" label="Throughput S against offered load G: pure ALOHA peaks at 0.184 when G is 0.5, slotted ALOHA at 0.368 when G is 1">
      <line x1={50} y1={210} x2={570} y2={210} stroke="currentColor" />
      <line x1={50} y1={210} x2={50} y2={20} stroke="currentColor" />
      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((g) => <T key={g} x={X(g)} y={226} size={10.5}>{g}</T>)}
      {[0.1, 0.2, 0.3, 0.4].map((s) => <g key={s}><line x1={46} x2={570} y1={Y(s)} y2={Y(s)} stroke={C.line} strokeDasharray="2 5" /><T x={40} y={Y(s) + 4} size={10.5} anchor="end">{s}</T></g>)}
      <polyline points={pts((g) => g * Math.exp(-g))} fill="none" stroke={C.blue} strokeWidth="2.6" />
      <polyline points={pts((g) => g * Math.exp(-2 * g))} fill="none" stroke={C.red} strokeWidth="2.6" />
      <circle cx={X(1)} cy={Y(0.368)} r="4.5" fill={C.blue} /><T x={X(1.15)} y={Y(0.395)} anchor="start" size={11.5} weight={700} color={C.blue}>slotted: S = Ge⁻ᴳ, max 0.368 at G = 1</T>
      <circle cx={X(0.5)} cy={Y(0.184)} r="4.5" fill={C.red} /><T x={X(0.62)} y={Y(0.232)} anchor="start" size={11.5} weight={700} color={C.red}>pure: S = Ge⁻²ᴳ, max 0.184 at G = 0.5</T>
      <T x={310} y={246} size={11}>G = attempts per frame time (offered load)</T>
      <T x={14} y={14} anchor="start" size={11}>S (throughput)</T>
    </Svg>
  )
}

export function CnCsmaCd() {
  const id = 'cn-cd'
  return (
    <Svg w={620} h={150} id={id} label="CSMA/CD states: a frame is transmitted, then contention slots, then idle">
      {[['Frame', 20, 160, 'var(--blue-tint)'], ['', 180, 20, 'var(--surface-2)'], ['', 200, 20, 'var(--surface-2)'], ['', 220, 20, 'var(--surface-2)'], ['Frame', 240, 160, 'var(--mint)'], ['Idle', 400, 180, 'var(--surface)']].map(([t, x, w, fill], i) => (
        <g key={i}><rect x={x} y={40} width={w} height={40} fill={fill} stroke="currentColor" /><T x={x + w / 2} y={65} size={12} weight={700}>{t}</T></g>
      ))}
      <T x={200} y={30} size={11} weight={700} color={C.red}>contention slots (2τ each)</T>
      <T x={100} y={100} size={11}>transmission period</T>
      <T x={320} y={100} size={11}>transmission period</T>
      <T x={490} y={100} size={11}>idle period</T>
      <T x={310} y={132} size={11}>A collision is detected within 2τ (τ = end-to-end propagation time); the colliding stations stop at once and back off.</T>
    </Svg>
  )
}

// ============================ UNIT III ============================

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

const DIJ = { A: [50, 130], B: [170, 50], C: [330, 50], D: [470, 90], E: [170, 210], F: [330, 210], G: [470, 210], H: [560, 150] }
const DIJ_E = [['A', 'B', 2], ['A', 'E', 6], ['B', 'C', 7], ['B', 'F', 2], ['E', 'F', 1], ['C', 'D', 3], ['C', 'G', 3], ['F', 'G', 2], ['D', 'H', 2], ['G', 'H', 2], ['E', 'B', 2]]
export const CnDijkstra = () => (
  <Graph id="cn-dij" nodes={DIJ} edges={DIJ_E} hi={['A-B', 'B-F', 'F-G', 'G-H']} h={250}
    label="Shortest path from A to H: A, B, F, G, H with total cost 8"
    notes={{ A: '0', B: '2', F: '4', G: '6', H: '8' }} />
)

export const CnFlooding = () => (
  <Graph id="cn-fld" nodes={{ S: [60, 130], A: [200, 50], B: [200, 210], C: [350, 50], D: [350, 210], E: [500, 130] }}
    edges={[['S', 'A'], ['S', 'B'], ['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E'], ['D', 'E']]}
    hi={['S-A', 'S-B', 'A-C', 'B-D', 'A-B', 'C-E', 'D-E', 'C-D']} highlight={C.gold}
    notes={{ S: 'hop 0', A: 'hop 1', B: 'hop 1', C: 'hop 2', D: 'hop 2', E: 'hop 3' }}
    label="Flooding: the source sends a copy on every line; each router forwards on every line except the one it arrived on" />
)

export const CnSinkTree = () => (
  <Graph id="cn-sink" nodes={{ B: [300, 40], A: [150, 120], C: [450, 120], D: [80, 220], E: [230, 220], F: [370, 220], G: [520, 220] }}
    edges={[['B', 'A'], ['B', 'C'], ['A', 'D'], ['A', 'E'], ['C', 'F'], ['C', 'G'], ['E', 'F', null], ['D', 'E', null]]}
    hi={['B-A', 'B-C', 'A-D', 'A-E', 'C-F', 'C-G']} highlight={C.green}
    label="Sink tree for router B: the optimal routes from every router to B form a tree rooted at B" h={250} />
)

export const CnDvNet = () => (
  <Graph id="cn-dv" nodes={{ A: [80, 60], B: [300, 60], C: [520, 60], D: [190, 200], E: [410, 200] }}
    edges={[['A', 'B', 2], ['B', 'C', 3], ['A', 'D', 1], ['D', 'E', 2], ['B', 'E', 4], ['C', 'E', 1]]}
    label="Small network for the distance vector example" h={240} />
)

export function CnCountToInfinity() {
  return (
    <Svg w={600} h={196} id="cn-cti" label="Count to infinity: after A goes down, B and C keep raising their distance to A by one each exchange">
      {['A', 'B', 'C', 'D', 'E'].map((n, i) => <Node key={n} x={60 + i * 120} y={36} label={n} fill={i === 0 ? 'var(--coral-tint)' : 'var(--surface)'} />)}
      {[0, 1, 2, 3].map((i) => <line key={i} x1={75 + i * 120} y1={36} x2={165 + i * 120} y2={36} stroke={C.line} strokeWidth="1.8" />)}
      <T x={60} y={70} size={11} weight={700} color={C.red}>A goes down</T>
      {[['before', '1', '2', '3', '4'], ['exchange 1', '3', '2', '3', '4'], ['exchange 2', '3', '4', '3', '4'], ['exchange 3', '5', '4', '5', '4']].map((r, k) => (
        <g key={k}>
          <T x={10} y={96 + k * 20} anchor="start" size={11}>{r[0]}</T>
          {r.slice(1).map((v, j) => <T key={j} x={180 + j * 120} y={96 + k * 20} mono size={12} weight={700}>{v}</T>)}
        </g>
      ))}
      <T x={300} y={188} size={11}>… distances to A crawl upward until they reach "infinity" (e.g. 16 in RIP).</T>
    </Svg>
  )
}

export function CnClassful() {
  const rows = [
    ['A', '0', 8, '0.0.0.0 – 127.255.255.255', 'net 7 bits · host 24 bits', 'var(--blue-tint)'],
    ['B', '10', 16, '128.0.0.0 – 191.255.255.255', 'net 14 bits · host 16 bits', 'var(--mint)'],
    ['C', '110', 24, '192.0.0.0 – 223.255.255.255', 'net 21 bits · host 8 bits', 'var(--yellow-tint)'],
    ['D', '1110', 32, '224.0.0.0 – 239.255.255.255', 'multicast address', 'var(--violet-tint)'],
    ['E', '1111', 32, '240.0.0.0 – 255.255.255.255', 'reserved for future use', 'var(--coral-tint)'],
  ]
  const px = 12
  return (
    <Svg w={620} h={rows.length * 44 + 30} id="cn-cls" label="Classful IPv4 address formats: classes A to E with their leading bits and ranges">
      {rows.map(([c, lead, net, range, split, fill], i) => (
        <g key={c}>
          <T x={16} y={30 + i * 44} weight={700} size={14}>{c}</T>
          <rect x={36} y={12 + i * 44} width={lead.length * px} height={28} fill="var(--coral-tint)" stroke="currentColor" />
          <T x={36 + (lead.length * px) / 2} y={31 + i * 44} mono size={11} weight={700}>{lead}</T>
          <rect x={36 + lead.length * px} y={12 + i * 44} width={(net - lead.length) * px} height={28} fill={fill} stroke="currentColor" />
          {net < 32 && <rect x={36 + net * px} y={12 + i * 44} width={(32 - net) * px} height={28} fill="var(--surface)" stroke="currentColor" />}
          <T x={36 + (net * px) / 2 + 8} y={31 + i * 44} size={11}>{net < 32 ? 'network' : split}</T>
          {net < 32 && <T x={36 + net * px + ((32 - net) * px) / 2} y={31 + i * 44} size={11}>host</T>}
          <T x={36} y={52 + i * 44 - 2} anchor="start" size={10.5} mono>{range}{net < 32 ? `   (${split})` : ''}</T>
        </g>
      ))}
    </Svg>
  )
}

// ============================ UNIT IV ============================

export function CnSockets() {
  const id = 'cn-sock'
  const S = ['socket()', 'bind()', 'listen()', 'accept()', 'receive()', 'send()', 'close()']
  const Cl = ['socket()', 'connect()', 'send()', 'receive()', 'close()']
  const sy = (i) => 34 + i * 40
  const cy = { 'socket()': sy(0), 'connect()': sy(3), 'send()': sy(4), 'receive()': sy(5), 'close()': sy(6) }
  return (
    <Svg w={560} h={330} id={id} label="Berkeley socket calls for a TCP server and client">
      <T x={140} y={18} weight={700}>Server</T>
      <T x={420} y={18} weight={700}>Client</T>
      {S.map((s, i) => <Box key={s} x={80} y={sy(i)} w={120} h={30} fill={i < 4 ? 'var(--blue-tint)' : 'var(--surface-2)'} label={s} size={12} weight={700} />)}
      {Cl.map((s) => <Box key={s} x={360} y={cy[s]} w={120} h={30} fill={s === 'connect()' ? 'var(--mint)' : 'var(--surface-2)'} label={s} size={12} weight={700} />)}
      {S.slice(0, -1).map((_, i) => <Arr key={i} id={id} x1={140} y1={sy(i) + 31} x2={140} y2={sy(i + 1) - 1} />)}
      <Arr id={id} x1={420} y1={cy['socket()'] + 31} x2={420} y2={cy['connect()'] - 1} />
      <Arr id={id} x1={420} y1={cy['connect()'] + 31} x2={420} y2={cy['send()'] - 1} />
      <Arr id={id} x1={420} y1={cy['send()'] + 31} x2={420} y2={cy['receive()'] - 1} />
      <Arr id={id} x1={420} y1={cy['receive()'] + 31} x2={420} y2={cy['close()'] - 1} />
      <Arr id={id} x1={356} y1={cy['connect()'] + 15} x2={204} y2={sy(3) + 15} color={C.red} dash="5 4" />
      <T x={280} y={sy(3) + 8} size={10.5} weight={700} color={C.red}>connection (3-way handshake)</T>
      <Arr id={id} x1={356} y1={cy['send()'] + 15} x2={204} y2={sy(4) + 15} color={C.blue} />
      <T x={280} y={sy(4) + 8} size={10.5}>request</T>
      <Arr id={id} x1={204} y1={sy(5) + 15} x2={356} y2={cy['receive()'] + 15} color={C.green} />
      <T x={280} y={sy(5) + 8} size={10.5}>reply</T>
    </Svg>
  )
}

export function CnCwnd() {
  // Tanenbaum's example: threshold 32 KB, timeout at 40 KB, new threshold 20 KB.
  const seq = [1, 2, 4, 8, 16, 32, 33, 34, 35, 36, 37, 38, 39, 40, 1, 2, 4, 8, 16, 20, 21, 22, 23, 24, 25]
  const X = (i) => 50 + i * 21, Y = (v) => 220 - v * 4.4
  return (
    <Svg w={600} h={262} id="cn-cw" label="TCP congestion window: slow start doubles it each round trip up to the threshold, then it grows by one; after a timeout the threshold halves and slow start begins again">
      <line x1={50} y1={220} x2={580} y2={220} stroke="currentColor" />
      <line x1={50} y1={220} x2={50} y2={20} stroke="currentColor" />
      {[0, 10, 20, 30, 40].map((v) => <g key={v}><T x={44} y={Y(v) + 4} anchor="end" size={10.5}>{v}</T><line x1={50} x2={580} y1={Y(v)} y2={Y(v)} stroke={C.line} strokeDasharray="2 5" /></g>)}
      <line x1={X(0)} x2={X(13)} y1={Y(32)} y2={Y(32)} stroke={C.gold} strokeWidth="2" strokeDasharray="6 4" />
      <T x={X(2)} y={Y(32) - 6} size={11} weight={700} color={C.gold} anchor="start">threshold 32</T>
      <line x1={X(14)} x2={X(24)} y1={Y(20)} y2={Y(20)} stroke={C.gold} strokeWidth="2" strokeDasharray="6 4" />
      <T x={X(15)} y={Y(20) - 8} size={11} weight={700} color={C.gold} anchor="start">threshold 20</T>
      <polyline points={seq.slice(0, 14).map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke={C.blue} strokeWidth="2.6" />
      <polyline points={seq.slice(14).map((v, i) => `${X(i + 14)},${Y(v)}`).join(' ')} fill="none" stroke={C.blue} strokeWidth="2.6" />
      {seq.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r="3" fill={C.blue} />)}
      <T x={X(13) + 30} y={Y(40) + 4} size={11.5} weight={700} color={C.red}>timeout</T>
      <T x={X(4.4)} y={Y(9)} size={11} anchor="start">slow start (doubling)</T>
      <T x={X(6.4)} y={Y(44.5)} size={11} anchor="start">congestion avoidance (+1 per RTT)</T>
      <T x={315} y={244} size={11}>transmission number (round trips)</T>
      <T x={12} y={14} anchor="start" size={11}>congestion window (KB)</T>
    </Svg>
  )
}

// ============================ UNIT V ============================

export const CnSmtp = () => (
  <Exchange id="cn-smtp" left="SMTP client (sender's MTA)" right="SMTP server (receiver's MTA)" unit={24} travel={0.9}
    label="SMTP dialogue: connection greeting, HELO, MAIL FROM, RCPT TO, DATA, the message, a dot, and QUIT, each answered with a reply code"
    msgs={[
      { from: 'r', t: 0, label: '220 service ready' }, { from: 'l', t: 1, label: 'HELO cbit.ac.in' }, { from: 'r', t: 2, label: '250 OK' },
      { from: 'l', t: 3, label: 'MAIL FROM:<a@cbit.ac.in>' }, { from: 'r', t: 4, label: '250 OK' },
      { from: 'l', t: 5, label: 'RCPT TO:<b@gmail.com>' }, { from: 'r', t: 6, label: '250 OK' },
      { from: 'l', t: 7, label: 'DATA' }, { from: 'r', t: 8, label: '354 start mail input' },
      { from: 'l', t: 9, label: 'headers, blank line, body' }, { from: 'l', t: 10, label: '.  (end of message)' }, { from: 'r', t: 11, label: '250 OK' },
      { from: 'l', t: 12, label: 'QUIT' }, { from: 'r', t: 13, label: '221 closing' },
    ]}
    notes={[{ side: 'l', t: 0, text: 'TCP connect to port 25' }]} />
)

export function CnTelnet() {
  const id = 'cn-tel'
  const col = (x, items) => items.map(([t, fill], i) => <Box key={t} x={x} y={40 + i * 46} w={150} h={34} fill={fill} label={t} size={12} />)
  return (
    <Svg w={600} h={270} id={id} label="TELNET remote login: keystrokes go from the local terminal through the TELNET client, over the Internet in NVT form, to the TELNET server and the remote operating system">
      <T x={110} y={22} weight={700}>Local computer</T>
      <T x={490} y={22} weight={700}>Remote server</T>
      {col(35, [['Terminal', 'var(--surface-2)'], ['Terminal driver', 'var(--surface-2)'], ['TELNET client', 'var(--blue-tint)'], ['TCP/IP', 'var(--mint)']])}
      {col(415, [['Application', 'var(--surface-2)'], ['Pseudo-terminal driver', 'var(--surface-2)'], ['TELNET server', 'var(--blue-tint)'], ['TCP/IP', 'var(--mint)']])}
      {[0, 1, 2].map((i) => <Arr key={i} id={id} x1={110} y1={74 + i * 46} x2={110} y2={86 + i * 46} />)}
      {[0, 1, 2].map((i) => <Arr key={'r' + i} id={id} x1={490} y1={86 + i * 46} x2={490} y2={74 + i * 46} />)}
      <path d="M 186 195 C 260 228, 340 228, 414 195" fill="none" stroke={C.red} strokeWidth="2.6" markerEnd={`url(#${id}-a)`} />
      <T x={300} y={258} size={11.5} weight={700} color={C.red}>Internet: characters in NVT form, TCP port 23</T>
    </Svg>
  )
}

// ============================ additions ============================

export const CnUtopia = () => (
  <Exchange id="cn-uto" label="Protocol 1 (utopia): the sender streams frames as fast as it can; no acknowledgements, no sequence numbers, no timers" unit={26} travel={1.2}
    msgs={[0, 1, 2, 3, 4].map((i) => ({ from: 'l', t: i * 0.8, label: `frame ${i}` }))}
    notes={[{ side: 'l', t: 0, text: 'send at once' }, { side: 'l', t: 3.2, text: 'never waits' }, { side: 'r', t: 1.2, text: 'to network layer' }, { side: 'r', t: 4.4, text: 'to network layer' }]} />
)

export function CnMux() {
  const users = ['var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--violet-tint)']
  return (
    <Svg w={600} h={220} id="cn-mux" label="Static channel allocation: FDM gives each user its own frequency band all the time; TDM gives each user every Nth time slot">
      <T x={150} y={18} weight={700}>FDM: split the frequency</T>
      {users.map((f, i) => <g key={i}><rect x={30} y={34 + i * 38} width={240} height={32} fill={f} stroke="currentColor" /><T x={150} y={55 + i * 38} size={12}>{`user ${i + 1}: band ${i + 1}, all the time`}</T></g>)}
      <T x={14} y={110} size={11} anchor="middle">freq</T>
      <T x={150} y={204} size={11}>time →</T>
      <T x={450} y={18} weight={700}>TDM: split the time</T>
      {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={330 + i * 30} y={34} width={30} height={150} fill={users[i % 4]} stroke="currentColor" /><T x={345 + i * 30} y={114} size={12} weight={700}>{(i % 4) + 1}</T></g>)}
      <T x={450} y={204} size={11}>time → (an unused slot is simply wasted)</T>
    </Svg>
  )
}

export function CnNesting() {
  return (
    <Svg w={600} h={150} id="cn-nest" label="Nesting of segments, packets and frames: a segment travels inside a packet, which travels inside a frame">
      <rect x={10} y={20} width={580} height={80} rx="6" fill="var(--mint)" stroke="currentColor" />
      <T x={60} y={64} size={12} weight={700}>Frame header</T>
      <rect x={120} y={32} width={420} height={56} rx="6" fill="var(--blue-tint)" stroke="currentColor" />
      <T x={175} y={64} size={12} weight={700}>Packet header</T>
      <rect x={230} y={44} width={300} height={32} rx="6" fill="var(--violet-tint)" stroke="currentColor" />
      <T x={290} y={64} size={12} weight={700}>Segment header</T>
      <T x={440} y={64} size={12}>segment payload (data)</T>
      <T x={565} y={64} size={11}>trailer</T>
      <T x={300} y={124} size={11.5}>data link frame ⊃ network packet ⊃ transport segment (TPDU)</T>
    </Svg>
  )
}

export const CnRto = () => (
  <Exchange id="cn-rto" left="Sender" right="Receiver" unit={30} travel={1.4}
    label="TCP retransmission timer: a segment is lost, the timer expires after RTO, and the segment is sent again"
    msgs={[{ from: 'l', t: 0, label: 'seq 1000' }, { from: 'r', t: 1.4, label: 'ACK 1500' }, { from: 'l', t: 2.8, label: 'seq 1500', lost: true }, { from: 'l', t: 6, label: 'seq 1500 (again)', color: C.red }, { from: 'r', t: 7.4, label: 'ACK 2000' }]}
    notes={[{ side: 'l', t: 0, text: 'start timer' }, { side: 'l', t: 2.8, text: 'start timer' }, { side: 'l', t: 4.4, text: '… RTO …', color: C.gold }, { side: 'l', t: 6, text: 'timeout → resend', color: C.red }]} />
)
