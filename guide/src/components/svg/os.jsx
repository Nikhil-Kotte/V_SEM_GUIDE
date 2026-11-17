// Hand-drawn Operating Systems diagrams, built from the shared kit. Registered in ./index.js.
import { C, Svg, T, Box, Arr, Node } from './kit.jsx'

const LAYER = ['var(--violet-tint)', 'var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--coral-tint)', 'var(--surface-2)']

// ============================ UNIT I ============================

export function OsSystemLayers() {
  const id = 'os-sys'
  return (
    <Svg w={600} h={300} id={id} label="Abstract view of a computer system: users, application programs, operating system, hardware">
      {['User 1', 'User 2', 'User 3', '…', 'User n'].map((u, i) => (
        <g key={u}><circle cx={90 + i * 105} cy={30} r={18} fill="var(--surface-2)" stroke="currentColor" /><T x={90 + i * 105} y={34} size={11}>{u}</T></g>
      ))}
      <Box x={40} y={70} w={520} h={50} fill={LAYER[0]} label="Application programs" sub="compilers, assemblers, text editors, browsers, database systems" />
      <Box x={40} y={140} w={520} h={50} fill={LAYER[1]} label="Operating system" sub="manages and allocates the hardware; controls program execution" />
      <Box x={40} y={210} w={520} h={50} fill={LAYER[2]} label="Computer hardware" sub="CPU, memory, I/O devices" />
      {[90, 195, 300, 405, 510].map((x) => <Arr key={x} id={id} x1={x} y1={50} x2={x} y2={68} both />)}
      <Arr id={id} x1={300} y1={122} x2={300} y2={138} both />
      <Arr id={id} x1={300} y1={192} x2={300} y2={208} both />
      <T x={300} y={288} size={11}>The OS is the intermediary between the user and the hardware: a resource allocator and a control program.</T>
    </Svg>
  )
}

export function OsLayered() {
  const L = ['Layer N: user interface', 'Layer N − 1: user programs, utilities', '…', 'Layer 3: I/O management', 'Layer 2: device drivers, console', 'Layer 1: CPU scheduling, memory management', 'Layer 0: hardware']
  return (
    <Svg w={560} h={L.length * 38 + 30} id="os-lay" label="Layered operating system: layer 0 is the hardware, the top layer is the user interface; each layer uses only the layer below">
      {L.map((t, i) => <Box key={t} x={60 + i * 12} y={10 + i * 38} w={440 - i * 24} h={32} fill={LAYER[i % 6]} label={t} size={12} weight={i === 0 || i === L.length - 1 ? 700 : 400} />)}
      <T x={280} y={L.length * 38 + 22} size={11}>Each layer calls only the services of the layer directly below it.</T>
    </Svg>
  )
}

export function OsKernels() {
  const id = 'os-ker'
  const user = (x, w, items) => items.map((t, i) => <Box key={i} x={x + i * (w / items.length) + 2} y={40} w={w / items.length - 4} h={32} fill={LAYER[0]} label={t} size={10.5} weight={400} />)
  return (
    <Svg w={640} h={290} id={id} label="Monolithic kernel, microkernel and hybrid kernel compared">
      {[['Monolithic', 10], ['Microkernel', 222], ['Hybrid', 434]].map(([t, x]) => <T key={t} x={x + 98} y={20} weight={700}>{t}</T>)}
      <line x1={0} x2={640} y1={84} y2={84} stroke={C.red} strokeDasharray="6 4" />
      <T x={636} y={80} anchor="end" size={10.5} color={C.red} weight={700}>user mode ↑ / kernel mode ↓</T>
      {user(10, 196, ['App', 'App'])}
      <Box x={10} y={92} w={196} h={150} fill={LAYER[1]} label="" />
      {['System call interface', 'File system, IPC', 'Scheduler, memory mgmt', 'Device drivers'].map((t, i) => <T key={t} x={108} y={118 + i * 32} size={11}>{t}</T>)}
      {user(222, 196, ['App', 'File server', 'Driver'])}
      <Box x={222} y={92} w={196} h={60} fill={LAYER[1]} label="Microkernel" sub="IPC, scheduling, basic memory" />
      <Arr id={id} x1={256} y1={74} x2={256} y2={92} both color={C.blue} />
      <Arr id={id} x1={385} y1={74} x2={385} y2={92} both color={C.blue} />
      <T x={320} y={176} size={10.5}>services run as user processes</T>
      <T x={320} y={192} size={10.5}>and talk by message passing</T>
      {user(434, 196, ['App', 'Subsystem'])}
      <Box x={434} y={92} w={196} h={150} fill={LAYER[1]} label="" />
      {['Executive services', 'File system, drivers', 'Microkernel core', 'HAL'].map((t, i) => <T key={t} x={532} y={118 + i * 32} size={11}>{t}</T>)}
      {[[108, 'Linux, traditional UNIX, MS-DOS'], [320, 'Mach, QNX, MINIX 3'], [532, 'Windows NT, macOS / iOS (XNU)']].map(([x, t]) => <T key={t} x={x} y={262} size={11} weight={700}>{t}</T>)}
      <rect x={10} y={248} width={620} height={1} fill={C.line} />
    </Svg>
  )
}

export function OsMsdos() {
  const id = 'os-dos'
  const L = ['Application program', 'Resident system program', 'MS-DOS device drivers', 'ROM BIOS device drivers']
  return (
    <Svg w={520} h={240} id={id} label="MS-DOS structure: applications can bypass the layers and reach the hardware directly">
      {L.map((t, i) => <Box key={t} x={60} y={14 + i * 50} w={300} h={38} fill={LAYER[i]} label={t} size={12} />)}
      {[0, 1, 2].map((i) => <Arr key={i} id={id} x1={210} y1={52 + i * 50} x2={210} y2={64 + i * 50} />)}
      <path d="M 362 33 C 470 60, 470 150, 362 183" fill="none" stroke={C.red} strokeWidth="2.2" markerEnd={`url(#${id}-a)`} />
      <path d="M 362 83 C 440 110, 440 150, 362 183" fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="5 4" markerEnd={`url(#${id}-a)`} />
      <T x={470} y={110} size={11} color={C.red} weight={700} anchor="start">direct</T>
      <T x={470} y={125} size={11} color={C.red} weight={700} anchor="start">access</T>
      <T x={260} y={232} size={11}>No dual mode, no protection: a buggy program could crash the whole system.</T>
    </Svg>
  )
}

export function OsUnix() {
  const rings = [[150, LAYER[0], 'Users / applications'], [112, LAYER[1], 'Shell, commands, utilities'], [74, LAYER[2], 'Kernel'], [36, LAYER[3], 'Hardware']]
  return (
    <Svg w={600} h={320} id="os-unix" label="UNIX architecture as layers: hardware at the centre, then the kernel, the shell and utilities, and user applications outside">
      {rings.map(([r, f]) => <circle key={r} cx={160} cy={160} r={r} fill={f} stroke="currentColor" strokeWidth="1.4" />)}
      {rings.map(([r, , t], i) => <T key={t} x={160} y={160 - r + 22 + (i === 3 ? 18 : 0)} size={11.5} weight={700}>{t}</T>)}
      {[['Kernel', 'process, memory, file and device', 'management; provides system calls'], ['Shell', 'command interpreter (sh, bash, csh)', 'between the user and the kernel'], ['Utilities', 'ls, cp, grep, cc, editors,', 'compilers'], ['Applications', 'user programs; they use system', 'calls through libraries']].map(([h, a, b], i) => (
        <g key={h}><T x={340} y={62 + i * 64} anchor="start" weight={700}>{h}</T><T x={340} y={80 + i * 64} anchor="start" size={11}>{a}</T><T x={340} y={95 + i * 64} anchor="start" size={11}>{b}</T></g>
      ))}
    </Svg>
  )
}

// ============================ UNIT II ============================

export function OsStates() {
  const id = 'os-st'
  const N = { new: [70, 50], ready: [190, 150], running: [410, 150], waiting: [300, 260], term: [530, 50] }
  const nd = (k, label, fill) => <Box x={N[k][0] - 58} y={N[k][1] - 20} w={116} h={40} r={20} fill={fill} label={label} />
  return (
    <Svg w={600} h={300} id={id} label="Five-state process model: new, ready, running, waiting and terminated with the transitions between them">
      <Arr id={id} x1={110} y1={68} x2={160} y2={128} color={C.blue} />
      <T x={110} y={110} size={11} anchor="end">admitted</T>
      <Arr id={id} x1={250} y1={142} x2={350} y2={142} color={C.green} />
      <T x={300} y={134} size={11}>scheduler dispatch</T>
      <Arr id={id} x1={350} y1={160} x2={250} y2={160} color={C.red} />
      <T x={300} y={176} size={11}>interrupt</T>
      <Arr id={id} x1={420} y1={172} x2={340} y2={244} color={C.gold} />
      <T x={430} y={222} size={11} anchor="start">I/O or event wait</T>
      <Arr id={id} x1={260} y1={244} x2={196} y2={172} color={C.gold} />
      <T x={170} y={222} size={11} anchor="end">I/O or event completion</T>
      <Arr id={id} x1={440} y1={130} x2={500} y2={70} color={C.violet} />
      <T x={480} y={112} size={11} anchor="start">exit</T>
      {nd('new', 'New', 'var(--surface-2)')}
      {nd('ready', 'Ready', LAYER[1])}
      {nd('running', 'Running', LAYER[2])}
      {nd('waiting', 'Waiting', LAYER[3])}
      {nd('term', 'Terminated', 'var(--surface-2)')}
    </Svg>
  )
}

export function OsPcb() {
  const F = ['Process state', 'Process number (PID)', 'Program counter', 'CPU registers', 'CPU-scheduling information', 'Memory-management information', 'Accounting information', 'I/O status information', 'List of open files']
  return (
    <Svg w={420} h={F.length * 30 + 20} id="os-pcb" label="Process control block fields">
      {F.map((f, i) => <Box key={f} x={60} y={10 + i * 30} w={300} h={30} r={0} fill={i % 2 ? 'var(--surface)' : LAYER[1]} label={f} size={12} weight={i < 3 ? 700 : 400} />)}
    </Svg>
  )
}

export function OsFork() {
  const id = 'os-fork'
  return (
    <Svg w={600} h={210} id={id} label="fork, exec and wait: the parent forks a child, the child calls exec to run a new program and exits, the parent waits and then resumes">
      <Box x={10} y={80} w={90} h={36} fill={LAYER[1]} label="parent" />
      <Arr id={id} x1={100} y1={98} x2={160} y2={98} />
      <Box x={160} y={80} w={80} h={36} fill={LAYER[3]} label="fork()" />
      <path d={`M 240 98 L 300 40 L 360 40`} fill="none" stroke={C.green} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      <T x={300} y={30} size={11} color={C.green} weight={700}>child (fork returns 0)</T>
      <Box x={360} y={22} w={90} h={36} fill={LAYER[2]} label="exec()" />
      <Arr id={id} x1={450} y1={40} x2={490} y2={40} color={C.green} />
      <Box x={490} y={22} w={90} h={36} fill={LAYER[2]} label="exit()" />
      <path d={`M 240 98 L 300 160 L 360 160`} fill="none" stroke={C.blue} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      <T x={300} y={186} size={11} color={C.blue} weight={700}>parent (fork returns child PID)</T>
      <Box x={360} y={142} w={90} h={36} fill={LAYER[1]} label="wait()" />
      <path d="M 535 58 C 535 120, 470 160, 452 160" fill="none" stroke={C.red} strokeDasharray="5 4" strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      <T x={528} y={110} size={10.5} anchor="end" color={C.red}>child's exit status</T>
      <Arr id={id} x1={450} y1={170} x2={560} y2={170} color={C.blue} />
      <T x={555} y={194} size={11} anchor="end">resumes</T>
    </Svg>
  )
}

export function OsSyscall() {
  const id = 'os-sc'
  return (
    <Svg w={600} h={240} id={id} label="Handling a system call: the user program calls open, a trap switches to kernel mode, the system call table finds the handler, the kernel runs it and returns">
      <Box x={20} y={20} w={170} h={70} fill={LAYER[0]} label="user application" sub="calls open()" />
      <rect x={0} y={108} width={600} height={1.5} fill={C.red} />
      <T x={596} y={102} anchor="end" size={11} color={C.red} weight={700}>user mode</T>
      <T x={596} y={124} anchor="end" size={11} color={C.red} weight={700}>kernel mode</T>
      <Box x={20} y={140} w={170} h={80} fill={LAYER[1]} label="system call interface" sub="trap; number i in a register" />
      <Arr id={id} x1={105} y1={92} x2={105} y2={138} color={C.blue} />
      <T x={115} y={122} anchor="start" size={11} color={C.blue}>trap</T>
      <Box x={230} y={140} w={130} h={80} fill="var(--surface-2)" label="system call table" sub="entry i → handler" />
      <Arr id={id} x1={192} y1={180} x2={228} y2={180} />
      <Box x={410} y={140} w={170} h={80} fill={LAYER[2]} label="implementation of open()" sub="in the kernel" />
      <Arr id={id} x1={362} y1={180} x2={408} y2={180} />
      <path d="M 495 138 C 480 70, 300 50, 194 55" fill="none" stroke={C.green} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      <T x={360} y={58} size={11} color={C.green} weight={700}>return value (file descriptor), back to user mode</T>
    </Svg>
  )
}

export function OsQueues() {
  const id = 'os-q'
  const ev = ['I/O request → I/O queue → I/O done', 'time slice expired', 'fork a child → child executes', 'wait for an interrupt → interrupt occurs']
  return (
    <Svg w={620} h={290} id={id} label="Queueing diagram of process scheduling: ready queue to CPU; a running process leaves the CPU on an I/O request, time-slice expiry, creating a child or waiting for an interrupt, and returns to the ready queue">
      <T x={40} y={26} anchor="start" weight={700} size={12}>ready queue</T>
      <rect x={40} y={36} width={220} height={32} fill={LAYER[1]} stroke="currentColor" />
      {[1, 2, 3, 4].map((i) => <line key={i} x1={40 + i * 44} x2={40 + i * 44} y1={36} y2={68} stroke="currentColor" />)}
      <Arr id={id} x1={262} y1={52} x2={318} y2={52} />
      <Box x={320} y={32} w={80} h={40} fill={LAYER[2]} label="CPU" />
      <Arr id={id} x1={402} y1={52} x2={460} y2={52} />
      <T x={468} y={56} anchor="start" size={12}>exit</T>
      <line x1={360} y1={74} x2={360} y2={240} stroke="currentColor" />
      {ev.map((t, i) => (
        <g key={t}>
          <Arr id={id} x1={360} y1={104 + i * 44} x2={380} y2={104 + i * 44} />
          <Box x={382} y={90 + i * 44} w={226} h={28} fill="var(--surface-2)" label={t} size={11} weight={400} />
        </g>
      ))}
      <path d="M 495 252 L 495 270 L 20 270 L 20 52 L 38 52" fill="none" stroke={C.blue} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      <line x1={495} y1={252} x2={495} y2={250} stroke={C.blue} />
      <T x={250} y={262} size={11} color={C.blue} weight={700}>each path leads back to the ready queue</T>
    </Svg>
  )
}

export function OsContextSwitch() {
  const id = 'os-cs'
  const row = (y, h, label, fill) => <Box x={20} y={y} w={150} h={h} fill={fill} label={label} size={11.5} />
  return (
    <Svg w={600} h={300} id={id} label="Context switch from P0 to P1 and back: save state into PCB0, reload from PCB1, and the reverse">
      <T x={95} y={16} weight={700}>process P0</T>
      <T x={300} y={16} weight={700}>operating system</T>
      <T x={505} y={16} weight={700}>process P1</T>
      {row(26, 60, 'executing', LAYER[2])}
      <Box x={430} y={26} w={150} h={60} fill="var(--surface-2)" label="idle" weight={400} />
      <Box x={225} y={92} w={150} h={28} fill={LAYER[3]} label="save state into PCB0" size={11} />
      <Box x={225} y={124} w={150} h={28} fill={LAYER[3]} label="reload state from PCB1" size={11} />
      <Arr id={id} x1={170} y1={86} x2={225} y2={100} color={C.red} />
      <T x={196} y={84} size={10.5} color={C.red}>interrupt / syscall</T>
      <Arr id={id} x1={375} y1={146} x2={430} y2={160} color={C.green} />
      <Box x={20} y={160} w={150} h={60} fill="var(--surface-2)" label="idle" weight={400} />
      <Box x={430} y={160} w={150} h={60} fill={LAYER[2]} label="executing" />
      <Box x={225} y={226} w={150} h={28} fill={LAYER[3]} label="save state into PCB1" size={11} />
      <Box x={225} y={258} w={150} h={28} fill={LAYER[3]} label="reload state from PCB0" size={11} />
      <Arr id={id} x1={430} y1={220} x2={375} y2={234} color={C.red} />
      <Arr id={id} x1={225} y1={278} x2={170} y2={292} color={C.green} />
      <T x={300} y={74} size={10.5}>(this time is pure overhead)</T>
    </Svg>
  )
}

// A Gantt chart. segs: [[label, start, end]]; marks idle when label is null.
export function Gantt({ segs, title, label, scale }) {
  const end = segs[segs.length - 1][2]
  const W = 600, x0 = 20
  const k = scale || (W - 2 * x0) / end
  const colors = { P1: LAYER[1], P2: LAYER[2], P3: LAYER[3], P4: LAYER[4], P5: LAYER[0], T0: LAYER[1], T1: LAYER[2] }
  const ticks = [...new Set(segs.flatMap(([, s, e]) => [s, e]))]
  return (
    <Svg w={W} h={title ? 92 : 72} id="gantt" label={label || title || 'Gantt chart'}>
      {title && <T x={x0} y={14} anchor="start" weight={700} size={12}>{title}</T>}
      {segs.map(([p, s, e], i) => (
        <g key={i}>
          <rect x={x0 + s * k} y={title ? 24 : 6} width={(e - s) * k} height={36} fill={p ? (colors[p] || LAYER[i % 6]) : 'var(--surface)'} stroke="currentColor" strokeDasharray={p ? undefined : '4 3'} />
          <T x={x0 + (s + e) / 2 * k} y={(title ? 24 : 6) + 23} weight={700} size={12}>{p || 'idle'}</T>
        </g>
      ))}
      {ticks.map((t) => <T key={t} x={x0 + t * k} y={(title ? 24 : 6) + 52} size={11} mono>{t}</T>)}
    </Svg>
  )
}

export const OsGanttSjfMid = () => <Gantt title="SJF (non-preemptive)" segs={[['P1', 0, 5], ['P4', 5, 6], ['P2', 6, 9], ['P3', 9, 12]]} label="SJF Gantt chart: P1 0–5, P4 5–6, P2 6–9, P3 9–12" />
export const OsGanttSrtfMid = () => <Gantt title="SRTF (preemptive SJF)" segs={[['P1', 0, 1], ['P2', 1, 4], ['P4', 4, 5], ['P3', 5, 8], ['P1', 8, 12]]} label="SRTF Gantt chart: P1 0–1, P2 1–4, P4 4–5, P3 5–8, P1 8–12" />

const CLASSIC = [['P1', 0, 24], ['P2', 24, 27], ['P3', 27, 30]]
export const OsGanttFcfs = () => <Gantt title="FCFS: P1 (24), P2 (3), P3 (3), all arrive at 0" segs={CLASSIC} label="FCFS Gantt chart: P1 0–24, P2 24–27, P3 27–30; average waiting time 17" />
export const OsGanttRr = () => <Gantt title="Round robin, quantum 4: same processes" segs={[['P1', 0, 4], ['P2', 4, 7], ['P3', 7, 10], ['P1', 10, 14], ['P1', 14, 18], ['P1', 18, 22], ['P1', 22, 26], ['P1', 26, 30]]} label="Round robin Gantt chart with quantum 4: P1 0–4, P2 4–7, P3 7–10, then P1 until 30; average waiting time 5.66" />

export function OsMultilevel() {
  const Q = [['highest priority', 'system processes', LAYER[4]], ['', 'interactive processes', LAYER[3]], ['', 'interactive editing processes', LAYER[2]], ['', 'batch processes', LAYER[1]], ['lowest priority', 'student processes', LAYER[0]]]
  return (
    <Svg w={560} h={Q.length * 40 + 20} id="os-mlq" label="Multilevel queue scheduling: five fixed-priority queues from system processes down to student processes">
      {Q.map(([p, t, f], i) => (
        <g key={t}><T x={10} y={34 + i * 40} anchor="start" size={11} color={C.red} weight={700}>{p}</T><Box x={130} y={14 + i * 40} w={320} h={32} fill={f} label={t} size={12} /></g>
      ))}
      <T x={510} y={20} size={11} anchor="middle">→ CPU</T>
    </Svg>
  )
}

export function OsIpc() {
  const id = 'os-ipc'
  return (
    <Svg w={600} h={262} id={id} label="Two models of IPC: shared memory and message passing">
      <T x={150} y={18} weight={700}>(a) Shared memory</T>
      <Box x={60} y={30} w={180} h={36} fill={LAYER[1]} label="process A" />
      <Box x={60} y={84} w={180} h={50} fill={LAYER[3]} label="shared memory region" />
      <Box x={60} y={152} w={180} h={36} fill={LAYER[1]} label="process B" />
      <Box x={60} y={200} w={180} h={30} fill="var(--surface-2)" label="kernel (only to set up)" size={11} weight={400} />
      <Arr id={id} x1={150} y1={68} x2={150} y2={82} color={C.blue} />
      <Arr id={id} x1={150} y1={150} x2={150} y2={136} color={C.blue} />
      <T x={450} y={18} weight={700}>(b) Message passing</T>
      <Box x={360} y={30} w={180} h={36} fill={LAYER[1]} label="process A" />
      <Box x={360} y={152} w={180} h={36} fill={LAYER[1]} label="process B" />
      <Box x={360} y={84} w={180} h={50} fill={LAYER[2]} label="kernel: message queue" sub="send(), receive()" />
      <Arr id={id} x1={450} y1={68} x2={450} y2={82} color={C.green} />
      <Arr id={id} x1={450} y1={136} x2={450} y2={150} color={C.green} />
      <T x={300} y={252} size={11}>Shared memory: fast after setup. Message passing: simpler, no conflicts, works across machines.</T>
    </Svg>
  )
}

export function OsRpc() {
  const id = 'os-rpc'
  const S = [['client program', 30], ['client stub', 110], ['RPC runtime', 190]]
  const R = [['server program', 30], ['server stub', 110], ['RPC runtime', 190]]
  return (
    <Svg w={600} h={250} id={id} label="Execution of RPC: the client stub marshals parameters, the runtime sends the message, the server stub unmarshals and calls the procedure; the result returns the same way">
      <T x={130} y={16} weight={700}>Client machine</T>
      <T x={470} y={16} weight={700}>Server machine</T>
      {S.map(([t, y], i) => <Box key={t} x={40} y={y} w={180} h={50} fill={LAYER[i]} label={t} size={12} />)}
      {R.map(([t, y], i) => <Box key={t + 's'} x={380} y={y} w={180} h={50} fill={LAYER[i]} label={t} size={12} />)}
      <Arr id={id} x1={110} y1={82} x2={110} y2={108} color={C.blue} /><T x={104} y={98} anchor="end" size={10.5}>call</T>
      <Arr id={id} x1={110} y1={162} x2={110} y2={188} color={C.blue} /><T x={104} y={178} anchor="end" size={10.5}>marshal, pack</T>
      <Arr id={id} x1={222} y1={208} x2={378} y2={208} color={C.red} width={2.4} /><T x={300} y={200} size={11} color={C.red} weight={700}>request message</T>
      <Arr id={id} x1={378} y1={226} x2={222} y2={226} color={C.green} width={2.4} /><T x={300} y={244} size={11} color={C.green} weight={700}>reply (result)</T>
      <Arr id={id} x1={490} y1={188} x2={490} y2={162} color={C.blue} /><T x={496} y={178} anchor="start" size={10.5}>unpack, unmarshal</T>
      <Arr id={id} x1={490} y1={108} x2={490} y2={82} color={C.blue} /><T x={496} y={98} anchor="start" size={10.5}>call procedure</T>
    </Svg>
  )
}

// ============================ UNIT III ============================

export function OsMemLayout() {
  const id = 'os-mem'
  const S = [['kernel space', 'not accessible to the user process', 'var(--surface-2)', 34], ['stack', 'local variables, return addresses; grows down ↓', LAYER[4], 46], ['', 'free (unused) space', 'var(--surface)', 54], ['heap', 'malloc/new; grows up ↑ (brk / sbrk)', LAYER[3], 46], ['bss', 'uninitialised globals (set to 0)', LAYER[2], 30], ['data', 'initialised globals and statics', LAYER[1], 30], ['text', 'program code (read-only)', LAYER[0], 34]]
  let y = 20
  return (
    <Svg w={560} h={300} id={id} label="Memory view of a process: text, data, bss, heap growing up, stack growing down, kernel space at the top">
      <T x={40} y={14} anchor="start" size={11} mono>high address</T>
      {S.map(([n, d, f, h]) => {
        const el = (
          <g key={d}>
            <rect x={40} y={y} width={180} height={h} fill={f} stroke="currentColor" strokeDasharray={n ? undefined : '5 4'} />
            <T x={130} y={y + h / 2 + 4} weight={700} size={12}>{n}</T>
            <T x={236} y={y + h / 2 + 4} anchor="start" size={11.5}>{d}</T>
          </g>
        )
        y += h
        return el
      })}
      <T x={40} y={y + 16} anchor="start" size={11} mono>address 0</T>
      <Arr id={id} x1={130} y1={112} x2={130} y2={128} color={C.red} />
      <Arr id={id} x1={130} y1={170} x2={130} y2={150} color={C.red} />
    </Svg>
  )
}

export function OsBinding() {
  const id = 'os-bind'
  const steps = [['source program', 'var(--surface-2)'], ['compiler / assembler', LAYER[1]], ['object module', 'var(--surface-2)'], ['linkage editor', LAYER[1]], ['load module', 'var(--surface-2)'], ['loader', LAYER[1]], ['in-memory binary image', LAYER[2]]]
  const when = [['compile time', 1], ['load time', 5], ['execution time', 6]]
  return (
    <Svg w={560} h={steps.length * 38 + 10} id={id} label="Multistep processing of a user program and the three times at which addresses can be bound">
      {steps.map(([t, f], i) => <Box key={t} x={60} y={6 + i * 38} w={200} h={28} fill={f} label={t} size={11.5} />)}
      {steps.slice(0, -1).map((_, i) => <Arr key={i} id={id} x1={160} y1={34 + i * 38} x2={160} y2={44 + i * 38} />)}
      {when.map(([t, i]) => <g key={t}><line x1={262} x2={330} y1={20 + i * 38} y2={20 + i * 38} stroke={C.red} strokeDasharray="4 4" /><T x={336} y={24 + i * 38} anchor="start" size={12} weight={700} color={C.red}>{t} binding</T></g>)}
    </Svg>
  )
}

export function OsFragmentation() {
  return (
    <Svg w={600} h={210} id="os-frag" label="Internal fragmentation (unused space inside an allocated block) and external fragmentation (free holes scattered between allocations)">
      <T x={150} y={18} weight={700}>Internal fragmentation</T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 82} y={30} width={76} height={120} fill="var(--surface)" stroke="currentColor" />
          <rect x={30 + i * 82} y={30 + [40, 70, 20][i]} width={76} height={120 - [40, 70, 20][i]} fill={LAYER[1]} stroke="currentColor" />
          <rect x={30 + i * 82} y={30} width={76} height={[40, 70, 20][i]} fill="var(--coral-tint)" stroke="currentColor" strokeDasharray="4 3" />
        </g>
      ))}
      <T x={150} y={172} size={11}>fixed 4 KB blocks; a process needs less,</T>
      <T x={150} y={188} size={11}>so the red part inside each block is wasted</T>
      <T x={450} y={18} weight={700}>External fragmentation</T>
      {[[30, LAYER[1], 'P1'], [26, 'var(--coral-tint)', '3 KB free'], [30, LAYER[2], 'P2'], [24, 'var(--coral-tint)', '2 KB free'], [30, LAYER[3], 'P3'], [26, 'var(--coral-tint)', '3 KB free']].reduce((acc, [h, f, t]) => {
        acc.items.push(<g key={t + acc.y}><rect x={370} y={acc.y} width={160} height={h * 0.73} fill={f} stroke="currentColor" /><T x={450} y={acc.y + h * 0.73 / 2 + 4} size={11}>{t}</T></g>)
        acc.y += h * 0.73
        return acc
      }, { y: 30, items: [] }).items}
      <T x={450} y={172} size={11}>8 KB free in total, but no single hole</T>
      <T x={450} y={188} size={11}>fits a 5 KB process; compaction fixes it</T>
    </Svg>
  )
}

export function OsRaid() {
  const disks = (x, label, cells, n) => (
    <g>
      <T x={x + n * 33} y={16} weight={700} size={12}>{label}</T>
      {Array.from({ length: n }, (_, d) => (
        <g key={d}>
          <rect x={x + d * 66} y={26} width={58} height={130} rx={10} fill="var(--surface-2)" stroke="currentColor" />
          {cells[d].map((c, j) => <g key={j}><rect x={x + d * 66 + 6} y={36 + j * 28} width={46} height={22} rx={4} fill={c.startsWith('P') ? 'var(--coral-tint)' : LAYER[1]} stroke="currentColor" /><T x={x + d * 66 + 29} y={51 + j * 28} size={10.5} mono>{c}</T></g>)}
        </g>
      ))}
    </g>
  )
  return (
    <Svg w={640} h={200} id="os-raid" label="RAID 0 stripes blocks across disks, RAID 1 mirrors them, RAID 5 stripes blocks with distributed parity">
      {disks(10, 'RAID 0: striping', [['A1', 'A3', 'A5', 'A7'], ['A2', 'A4', 'A6', 'A8']], 2)}
      {disks(170, 'RAID 1: mirroring', [['A1', 'A2', 'A3', 'A4'], ['A1', 'A2', 'A3', 'A4']], 2)}
      {disks(340, 'RAID 5: striping + distributed parity', [['A1', 'B1', 'C1', 'Dp'], ['A2', 'B2', 'Cp', 'D1'], ['A3', 'Bp', 'C2', 'D2'], ['Ap', 'B3', 'C3', 'D3']], 4)}
      <T x={320} y={190} size={11}>p = parity block (red). RAID 0: speed, no redundancy. RAID 1: full copy. RAID 5: survives one disk failure.</T>
    </Svg>
  )
}

// ============================ UNIT IV ============================

export function OsThreads() {
  const proc = (x, title, n) => (
    <g>
      <T x={x + 120} y={16} weight={700}>{title}</T>
      <rect x={x} y={24} width={240} height={190} rx={10} fill="var(--surface)" stroke="currentColor" />
      {['code', 'data', 'files'].map((t, i) => <Box key={t} x={x + 10 + i * 76} y={34} w={68} h={30} fill={LAYER[3]} label={t} size={11.5} />)}
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <Box x={x + 10 + i * (220 / n)} y={76} w={220 / n - 8} h={26} fill={LAYER[1]} label="registers" size={10} weight={400} />
          <Box x={x + 10 + i * (220 / n)} y={106} w={220 / n - 8} h={26} fill={LAYER[1]} label="stack" size={10} weight={400} />
          <path d={`M ${x + 6 + i * (220 / n) + 110 / n} 140 q 8 12 0 24 t 0 24`} fill="none" stroke={C.red} strokeWidth="2.4" />
        </g>
      ))}
      <T x={x + 120} y={206} size={11} color={C.red} weight={700}>{n === 1 ? 'one thread' : `${n} threads`}</T>
    </g>
  )
  return (
    <Svg w={560} h={230} id="os-thr" label="Single-threaded and multithreaded processes: threads share code, data and files but each has its own registers and stack">
      {proc(10, 'Single-threaded process', 1)}
      {proc(300, 'Multithreaded process', 3)}
    </Svg>
  )
}

export function OsCriticalSection() {
  const R = [['entry section', 'ask permission to enter', LAYER[3]], ['critical section', 'access the shared data', 'var(--coral-tint)'], ['exit section', 'announce that we have left', LAYER[3]], ['remainder section', 'everything else', 'var(--surface-2)']]
  const id = 'os-csec'
  return (
    <Svg w={540} h={230} id={id} label="General structure of a process in the critical section problem: entry section, critical section, exit section, remainder section, in a loop">
      <T x={40} y={18} anchor="start" mono size={12}>do {'{'}</T>
      {R.map(([t, s, f], i) => <g key={t}><Box x={70} y={28 + i * 44} w={180} h={34} fill={f} label={t} size={12} /><T x={262} y={49 + i * 44} anchor="start" size={11.5}>{s}</T></g>)}
      <T x={40} y={218} anchor="start" mono size={12}>{'}'} while (true);</T>
      <path d="M 66 196 C 30 196, 30 45, 66 45" fill="none" stroke={C.blue} strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
    </Svg>
  )
}

export function OsDining() {
  const n = 5, cx = 200, cy = 150, r = 95
  return (
    <Svg w={560} h={300} id="os-din" label="Dining philosophers: five philosophers around a table with one chopstick between each pair">
      <circle cx={cx} cy={cy} r={70} fill={LAYER[3]} stroke="currentColor" />
      <T x={cx} y={cy + 4} weight={700}>rice</T>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
        const b = a + Math.PI / n
        return (
          <g key={i}>
            <Node x={cx + r * 1.2 * Math.cos(a)} y={cy + r * 1.2 * Math.sin(a)} label={`P${i}`} r={20} fill={LAYER[1]} />
            <line x1={cx + 52 * Math.cos(b)} y1={cy + 52 * Math.sin(b)} x2={cx + 92 * Math.cos(b)} y2={cy + 92 * Math.sin(b)} stroke={C.red} strokeWidth="4" strokeLinecap="round" />
          </g>
        )
      })}
      {['A philosopher needs both the left', 'and the right chopstick (red) to eat.', '', 'Deadlock: all five pick up their left', 'chopstick at once and wait forever', 'for the right one.', '', 'Starvation: one philosopher keeps', 'losing the chopsticks to its', 'neighbours and never eats.'].map((t, i) => <T key={i} x={340} y={50 + i * 20} anchor="start" size={11.5}>{t}</T>)}
    </Svg>
  )
}

// ============================ UNIT V ============================

export function OsInode() {
  const id = 'os-inode'
  return (
    <Svg w={600} h={300} id={id} label="UNIX inode: mode, owners, timestamps, size, twelve direct block pointers and single, double and triple indirect pointers">
      <rect x={20} y={14} width={170} height={272} fill="var(--surface)" stroke="currentColor" />
      {['mode', 'owners (UID, GID)', 'timestamps', 'size, link count', 'direct blocks (12)', 'single indirect', 'double indirect', 'triple indirect'].map((t, i) => (
        <g key={t}><rect x={20} y={14 + i * 34} width={170} height={34} fill={i < 4 ? LAYER[1] : i === 4 ? LAYER[2] : LAYER[3]} stroke="currentColor" /><T x={105} y={35 + i * 34} size={11.5} weight={i >= 4 ? 700 : 400}>{t}</T></g>
      ))}
      <Box x={300} y={150} w={90} h={28} fill={LAYER[2]} label="data blocks" size={11} />
      <Arr id={id} x1={192} y1={164} x2={298} y2={164} color={C.green} />
      <Box x={260} y={196} w={70} h={26} fill="var(--surface-2)" label="index" size={10.5} />
      <Arr id={id} x1={192} y1={198} x2={258} y2={208} />
      <Box x={420} y={196} w={70} h={26} fill={LAYER[2]} label="data" size={10.5} />
      <Arr id={id} x1={332} y1={209} x2={418} y2={209} />
      <Box x={260} y={232} w={60} h={24} fill="var(--surface-2)" label="index" size={10} />
      <Box x={350} y={232} w={60} h={24} fill="var(--surface-2)" label="index" size={10} />
      <Box x={440} y={232} w={60} h={24} fill={LAYER[2]} label="data" size={10} />
      <Arr id={id} x1={192} y1={232} x2={258} y2={244} />
      <Arr id={id} x1={322} y1={244} x2={348} y2={244} />
      <Arr id={id} x1={412} y1={244} x2={438} y2={244} />
      <T x={430} y={282} size={11}>triple indirect: three levels of index blocks</T>
      <T x={420} y={40} size={11.5}>Small files use only the direct pointers;</T>
      <T x={420} y={58} size={11.5}>large files add more levels of index blocks.</T>
    </Svg>
  )
}

export function OsSecurityLevels() {
  const L = [['Physical', 'secure the machine rooms and terminals', LAYER[0]], ['Human', 'authorise users carefully; train against phishing and social engineering', LAYER[1]], ['Operating system', 'protect against crashes, stack overflows, denial of service, malware', LAYER[2]], ['Network', 'protect data in transit; firewalls, encryption', LAYER[3]]]
  return (
    <Svg w={600} h={L.length * 46 + 20} id="os-sec" label="Four levels of security measures: physical, human, operating system and network">
      {L.map(([t, s, f], i) => <g key={t}><Box x={20} y={10 + i * 46} w={150} h={38} fill={f} label={t} /><T x={186} y={34 + i * 46} anchor="start" size={11.5}>{s}</T></g>)}
      <T x={300} y={L.length * 46 + 14} size={11}>Security is only as strong as the weakest level.</T>
    </Svg>
  )
}
