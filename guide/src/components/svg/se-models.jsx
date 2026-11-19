// Hand-drawn Software Engineering diagrams (process models, agile, estimation, testing), built from
// the shared kit. Registered in ./index.js.
import { C, Svg, T, Box, Arr, Node } from './kit.jsx'

const TINT = ['var(--violet-tint)', 'var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--coral-tint)', 'var(--surface-2)']
const FW = ['Communication', 'Planning', 'Modelling', 'Construction', 'Deployment']

// ============================ UNIT I ============================

export function SeLayers() {
  const L = [['Tools', 'CASE tools: automated support for process and methods'], ['Methods', 'technical how-to: analysis, design, coding, testing'], ['Process', 'the framework that holds the layers together'], ['A quality focus', 'the bedrock: organisational commitment to quality']]
  return (
    <Svg w={560} h={230} id="se-lay" label="Software engineering is a layered technology: a quality focus at the base, then process, methods and tools">
      {L.map(([t, s], i) => <Box key={t} x={60} y={12 + i * 52} w={440} h={44} fill={TINT[i]} label={t} sub={s} />)}
      <T x={280} y={224} size={11}>Each layer rests on the one below; everything rests on quality.</T>
    </Svg>
  )
}

export function SeProcessFramework() {
  const id = 'se-pf'
  return (
    <Svg w={620} h={300} id={id} label="Software process framework: umbrella activities run across all five framework activities, each made of actions and task sets">
      <Box x={10} y={10} w={600} h={70} fill={TINT[3]} label="" />
      <T x={310} y={30} weight={700}>Umbrella activities (throughout the project)</T>
      <T x={310} y={50} size={11}>project tracking and control · risk management · software quality assurance · technical reviews</T>
      <T x={310} y={66} size={11}>measurement · configuration management · reusability management · work product preparation</T>
      {FW.map((f, i) => (
        <g key={f}>
          <Box x={14 + i * 120} y={104} w={110} h={40} fill={TINT[i % 3]} label={f} size={11.5} />
          {i < 4 && <Arr id={id} x1={124 + i * 120} y1={124} x2={134 + i * 120} y2={124} />}
        </g>
      ))}
      <T x={310} y={168} size={11} weight={700}>Framework activities (every project)</T>
      <Box x={150} y={186} w={320} h={36} fill="var(--surface)" label="Software engineering actions (e.g. architectural design)" size={11} weight={400} />
      <Arr id={id} x1={310} y1={222} x2={310} y2={236} />
      <Box x={150} y={238} w={320} h={44} fill="var(--surface)" label="Task sets" sub="work tasks · work products · quality assurance points · milestones" size={11.5} />
      <Arr id={id} x1={310} y1={170} x2={310} y2={184} />
    </Svg>
  )
}

export function SeProcessFlows() {
  const id = 'se-flow'
  const row = (y, title) => <T x={14} y={y} anchor="start" weight={700} size={12}>{title}</T>
  const boxes = (y) => FW.map((f, i) => <Box key={f} x={130 + i * 94} y={y} w={84} h={28} fill={TINT[1]} label={f} size={10} weight={400} />)
  const links = (y) => [0, 1, 2, 3].map((i) => <Arr key={i} id={id} x1={214 + i * 94} y1={y + 14} x2={224 + i * 94} y2={y + 14} />)
  return (
    <Svg w={610} h={330} id={id} label="Process flows: linear, iterative, evolutionary and parallel">
      {row(32, '(a) Linear')}{boxes(14)}{links(14)}
      {row(102, '(b) Iterative')}{boxes(84)}{links(84)}
      <path d="M 450 84 C 440 66, 360 66, 350 84" fill="none" stroke={C.red} strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      <path d="M 262 84 C 252 66, 186 66, 176 84" fill="none" stroke={C.red} strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      {row(196, '(c) Evolutionary')}
      {[0, 1, 2].map((k) => <ellipse key={k} cx={370} cy={196} rx={60 + k * 50} ry={18 + k * 12} fill="none" stroke={C.blue} strokeWidth="1.6" opacity={0.5 + k * 0.2} />)}
      {FW.map((f, i) => { const a = (i / 5) * 2 * Math.PI - Math.PI / 2; return <T key={f} x={370 + Math.cos(a) * 190} y={200 + Math.sin(a) * 50} size={10} weight={700}>{f}</T> })}
      {row(290, '(d) Parallel')}
      <Box x={130} y={270} w={84} h={28} fill={TINT[1]} label="Communication" size={10} weight={400} />
      <Box x={224} y={270} w={84} h={28} fill={TINT[1]} label="Planning" size={10} weight={400} />
      <Box x={318} y={256} w={84} h={24} fill={TINT[2]} label="Modelling" size={10} weight={400} />
      <Box x={318} y={290} w={84} h={24} fill={TINT[2]} label="Construction" size={10} weight={400} />
      <Box x={412} y={270} w={84} h={28} fill={TINT[1]} label="Deployment" size={10} weight={400} />
      <Arr id={id} x1={214} y1={284} x2={224} y2={284} />
      <Arr id={id} x1={308} y1={280} x2={318} y2={270} /><Arr id={id} x1={308} y1={288} x2={318} y2={300} />
      <Arr id={id} x1={402} y1={268} x2={412} y2={278} /><Arr id={id} x1={402} y1={302} x2={412} y2={292} />
      <T x={555} y={288} size={10}>run at once</T>
    </Svg>
  )
}

export function SeFailureCurves() {
  const axis = (x, title) => (
    <g>
      <line x1={x} y1={20} x2={x} y2={190} stroke="currentColor" strokeWidth="1.4" />
      <line x1={x} y1={190} x2={x + 250} y2={190} stroke="currentColor" strokeWidth="1.4" />
      <T x={x + 125} y={210} size={11}>Time</T>
      <T x={x + 125} y={232} size={12} weight={700}>{title}</T>
    </g>
  )
  return (
    <Svg w={620} h={244} id="se-fail" label="Failure curves: the hardware bathtub curve and the software idealised versus actual curve with spikes after each change">
      <T x={14} y={14} anchor="start" size={10.5}>Failure rate</T>
      {axis(30, '(a) Hardware: the bathtub curve')}
      <path d="M 34 40 C 60 150, 80 160, 120 160 L 210 160 C 240 160, 260 120, 275 50" fill="none" stroke={C.blue} strokeWidth="2.4" />
      <T x={62} y={60} size={10} anchor="start">infant mortality</T><T x={250} y={44} size={10}>wear out</T>
      {axis(340, '(b) Software: idealised vs actual')}
      <path d="M 344 50 C 370 160, 390 165, 580 168" fill="none" stroke={C.green} strokeWidth="2" strokeDasharray="6 4" />
      <path d="M 344 50 C 370 150, 380 150, 400 150 L 410 100 L 425 140 L 460 140 L 470 85 L 485 128 L 520 128 L 530 70 L 545 115 L 585 115" fill="none" stroke={C.red} strokeWidth="2.2" />
      <T x={540} y={182} size={10} color={C.green}>idealised</T>
      <T x={470} y={70} size={10} color={C.red}>change → side effects</T>
      <T x={585} y={108} size={10} anchor="end" color={C.red}>actual</T>
    </Svg>
  )
}

export function SeWaterfall() {
  const id = 'se-wf'
  const S = [['Communication', 'project initiation, requirements gathering'], ['Planning', 'estimating, scheduling, tracking'], ['Modelling', 'analysis, design'], ['Construction', 'code, test'], ['Deployment', 'delivery, support, feedback']]
  return (
    <Svg w={620} h={290} id={id} label="Waterfall model: communication, planning, modelling, construction and deployment in sequence">
      {S.map(([t, s], i) => (
        <g key={t}>
          <Box x={10 + i * 110} y={10 + i * 52} w={170} h={44} fill={TINT[i]} label={t} sub={s} size={12} />
          {i < 4 && <path d={`M ${180 + i * 110} ${32 + i * 52} H ${200 + i * 110} V ${60 + i * 52}`} fill="none" stroke="currentColor" strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />}
        </g>
      ))}
      <T x={14} y={282} anchor="start" size={11}>Each phase is completed and signed off before the next begins; going back is expensive.</T>
    </Svg>
  )
}

export function SeVModel() {
  const id = 'se-v'
  const L = ['Requirements modelling', 'Architectural design', 'Component design', 'Code generation']
  const R = ['Acceptance testing', 'System testing', 'Integration testing', 'Unit testing']
  return (
    <Svg w={620} h={290} id={id} label="The V-model: each development phase on the left is verified by a matching test phase on the right">
      {L.map((t, i) => <Box key={t} x={20 + i * 50} y={20 + i * 60} w={180} h={36} fill={TINT[1]} label={t} size={11.5} />)}
      {R.map((t, i) => <Box key={t} x={420 - i * 50} y={20 + i * 60} w={180} h={36} fill={TINT[2]} label={t} size={11.5} />)}
      <Box x={230} y={238} w={160} h={36} fill={TINT[3]} label="Executable software" size={11.5} />
      {L.map((t, i) => <line key={t} x1={200 + i * 50} y1={38 + i * 60} x2={420 - i * 50} y2={38 + i * 60} stroke={C.red} strokeDasharray="5 4" strokeWidth="1.4" />)}
      <Arr id={id} x1={130} y1={258} x2={225} y2={258} /><Arr id={id} x1={395} y1={258} x2={490} y2={258} />
      <T x={70} y={276} size={10.5}>verification ↓</T><T x={545} y={276} size={10.5}>↑ validation</T>
    </Svg>
  )
}

export function SeIncremental() {
  const id = 'se-inc'
  return (
    <Svg w={620} h={250} id={id} label="Incremental model: staggered linear sequences, each delivering an increment, with functionality growing over calendar time">
      <line x1={40} y1={220} x2={600} y2={220} stroke="currentColor" strokeWidth="1.4" markerEnd={`url(#${id}-a)`} />
      <line x1={40} y1={220} x2={40} y2={14} stroke="currentColor" strokeWidth="1.4" markerEnd={`url(#${id}-a)`} />
      <T x={320} y={242} size={11}>Project calendar time</T>
      <g transform="translate(20 120) rotate(-90)"><T x={0} y={0} size={11}>Functionality and features</T></g>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          {['C', 'P', 'M', 'Con', 'D'].map((s, i) => <Box key={s} x={60 + k * 150 + i * 40} y={170 - k * 60} w={38} h={30} fill={TINT[i]} label={s} size={10.5} />)}
          <T x={159 + k * 150} y={162 - k * 60} size={10.5} weight={700} color={C.red}>increment #{k === 2 ? 'n' : k + 1} delivered</T>
        </g>
      ))}
      <T x={400} y={230} size={10}>C communication · P planning · M modelling · Con construction · D deployment</T>
    </Svg>
  )
}

export function SeRad() {
  const id = 'se-rad'
  return (
    <Svg w={620} h={260} id={id} label="RAD model: communication and planning, then several teams model and construct in parallel, then deployment, within 60 to 90 days">
      <Box x={10} y={100} w={100} h={40} fill={TINT[0]} label="Communication" size={11} />
      <Box x={124} y={100} w={80} h={40} fill={TINT[1]} label="Planning" size={11} />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <T x={240} y={30 + k * 72} anchor="start" size={10.5} weight={700}>Team #{k === 2 ? 'n' : k + 1}</T>
          <Box x={240} y={36 + k * 72} w={150} h={30} fill={TINT[2]} label="Modelling" sub="" size={11} />
          <Box x={396} y={36 + k * 72} w={110} h={30} fill={TINT[3]} label="Construction" size={11} />
          <Arr id={id} x1={204} y1={120} x2={238} y2={51 + k * 72} />
          <Arr id={id} x1={506} y1={51 + k * 72} x2={520} y2={120} />
        </g>
      ))}
      <Box x={522} y={100} w={90} h={40} fill={TINT[4]} label="Deployment" size={11} />
      <Arr id={id} x1={110} y1={120} x2={122} y2={120} />
      <T x={315} y={236} size={10.5}>Modelling: business, data, process · Construction: component reuse, automatic code generation, testing</T>
      <T x={315} y={252} size={11} weight={700} color={C.red}>60 – 90 days</T>
    </Svg>
  )
}

export function SePrototyping() {
  const id = 'se-proto'
  const S = ['Communication', 'Quick plan', 'Modelling: quick design', 'Construction of prototype', 'Deployment, delivery and feedback']
  const cx = 300, cy = 140, rx = 210, ry = 95
  return (
    <Svg w={600} h={290} id={id} label="Prototyping paradigm: communication, quick plan, quick design, construction of a prototype, deployment and feedback, then round again">
      <ellipse cx={cx} cy={cy} rx={rx - 40} ry={ry - 30} fill="none" stroke={C.blue} strokeWidth="1.6" strokeDasharray="6 4" />
      {S.map((s, i) => {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2
        const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry
        return <Box key={s} x={x - 85} y={y - 18} w={170} h={36} fill={TINT[i]} label={s} size={11} />
      })}
      <T x={cx} y={cy - 4} size={11} weight={700}>repeat until the</T>
      <T x={cx} y={cy + 12} size={11} weight={700}>customer is satisfied</T>
      <T x={cx} y={284} size={10.5}>The prototype is usually thrown away once the requirements are clear.</T>
    </Svg>
  )
}

export function SeSpiral() {
  const id = 'se-sp'
  const cx = 300, cy = 160
  let d = `M ${cx} ${cy}`
  for (let t = 0; t <= 6.5 * Math.PI; t += 0.12) { const r = 8 + t * 6.6; d += ` L ${cx + Math.cos(t) * r} ${cy - Math.sin(t) * r * 0.82}` }
  const Q = [['Communication', 470, 40], ['Planning', 130, 40], ['(estimation, scheduling,', 130, 56], ['risk analysis)', 130, 70], ['Modelling', 120, 290], ['(analysis, design)', 120, 306], ['Construction', 480, 290], ['(code, test)', 480, 306], ['Deployment', 548, 168], ['(delivery, feedback)', 548, 184]]
  return (
    <Svg w={620} h={320} id={id} label="Spiral model: the process spirals outward through communication, planning with risk analysis, modelling, construction and deployment">
      <line x1={cx} y1={10} x2={cx} y2={310} stroke={C.line} strokeDasharray="4 4" />
      <line x1={60} y1={cy} x2={540} y2={cy} stroke={C.line} strokeDasharray="4 4" />
      <path d={d} fill="none" stroke={C.blue} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      <Node x={cx} y={cy} label="•" r={6} />
      {Q.map(([t, x, y], i) => <T key={i} x={x} y={y} size={t.startsWith('(') || t.endsWith(')') ? 10.5 : 12} weight={t.startsWith('(') || t.endsWith(')') ? 400 : 700}>{t}</T>)}
      <T x={cx} y={cy + 24} size={9.5} color={C.red}>start</T>
      <T x={520} y={250} size={10} color={C.red}>outer loops: more complete</T>
      <T x={520} y={264} size={10} color={C.red}>product, more cost</T>
    </Svg>
  )
}

export function SeCmmi() {
  const L = [['1 Initial', 'ad hoc, chaotic; success depends on individuals'], ['2 Managed', 'basic project management: requirements, planning, tracking'], ['3 Defined', 'standard documented process for the organisation'], ['4 Quantitatively managed', 'process and product controlled with measurements'], ['5 Optimizing', 'continuous process improvement']]
  return (
    <Svg w={620} h={280} id="se-cmmi" label="CMMI staged maturity levels as a staircase from 1 Initial to 5 Optimizing">
      {L.map(([t], i) => {
        const [a, ...b] = t.split(' ')
        const words = b.join(' ').split(' ')
        const lines = words.length > 1 ? [`${a} ${words[0]}`, words.slice(1).join(' ')] : [t]
        return (
          <g key={t}>
            <rect x={20 + i * 116} y={230 - i * 40} width={116} height={40 + i * 40} fill={TINT[i]} stroke={C.line} />
            {lines.map((ln, k) => <T key={ln} x={78 + i * 116} y={250 - i * 40 + k * 15 - (lines.length - 1) * 7} size={11.5} weight={700}>{ln}</T>)}
          </g>
        )
      })}
      {L.slice().reverse().map(([t, s], i) => <T key={s} x={14} y={18 + i * 15} anchor="start" size={10.5}>{`${t.split(' ')[0]}: ${s}`}</T>)}
    </Svg>
  )
}

export function SeCbd() {
  const id = 'se-cbd'
  const S = ['Research and evaluate available components', 'Consider component integration issues', 'Design an architecture to hold the components', 'Integrate components into the architecture', 'Comprehensive testing']
  return (
    <Svg w={600} h={250} id={id} label="Component-based development steps, from evaluating COTS components to comprehensive testing">
      {S.map((s, i) => (
        <g key={s}>
          <Box x={120} y={8 + i * 48} w={360} h={36} fill={TINT[i]} label={`${i + 1}. ${s}`} size={11.5} />
          {i < 4 && <Arr id={id} x1={300} y1={44 + i * 48} x2={300} y2={56 + i * 48} />}
        </g>
      ))}
      <Box x={10} y={90} w={96} h={60} fill="var(--surface)" label="COTS" sub="component library" size={12} dash="5 3" />
      <Arr id={id} x1={106} y1={110} x2={118} y2={30} color={C.blue} />
    </Svg>
  )
}

export function SeUp() {
  const id = 'se-up'
  const P = [['Inception', 'business case, scope'], ['Elaboration', 'architecture, plan'], ['Construction', 'build and test'], ['Transition', 'deliver to users']]
  return (
    <Svg w={620} h={150} id={id} label="Unified Process phases: inception, elaboration, construction, transition, plus production">
      {P.map(([t, s], i) => (
        <g key={t}>
          <Box x={6 + i * 152} y={20} w={140} h={56} fill={TINT[i]} label={t} sub={s} size={12.5} />
          {i < 3 && <Arr id={id} x1={146 + i * 152} y1={48} x2={156 + i * 152} y2={48} />}
        </g>
      ))}
      <T x={310} y={104} size={11}>Use-case driven · architecture-centric · iterative and incremental (UML)</T>
      <T x={310} y={124} size={11}>A production phase follows: monitor use, support, defect reports and change requests.</T>
    </Svg>
  )
}

// ============================ UNIT II ============================

export function SeCostOfChange() {
  return (
    <Svg w={560} h={240} id="se-coc" label="Cost of change against development progress: rises sharply for conventional processes, stays flatter for agile">
      <line x1={50} y1={20} x2={50} y2={200} stroke="currentColor" strokeWidth="1.4" />
      <line x1={50} y1={200} x2={540} y2={200} stroke="currentColor" strokeWidth="1.4" />
      <T x={295} y={222} size={11}>Development schedule progress</T>
      <g transform="translate(30 110) rotate(-90)"><T x={0} y={0} size={11}>Cost of change</T></g>
      <path d="M 54 195 C 250 190, 400 140, 520 30" fill="none" stroke={C.red} strokeWidth="2.4" />
      <path d="M 54 195 C 200 170, 350 160, 520 145" fill="none" stroke={C.green} strokeWidth="2.4" />
      <T x={470} y={40} size={11} weight={700} color={C.red} anchor="end">conventional process</T>
      <T x={520} y={135} size={11} weight={700} color={C.green} anchor="end">idealised agile process</T>
    </Svg>
  )
}

export function SeXp() {
  const id = 'se-xp'
  const S = [['Planning', 'user stories, values, acceptance tests'], ['Design', 'simple design, CRC cards, spike solutions'], ['Coding', 'pair programming, tests first, integration'], ['Test', 'unit tests daily, customer acceptance tests']]
  return (
    <Svg w={620} h={270} id={id} label="Extreme Programming process: planning, design, coding and test, repeated; each release adds tested software increments">
      {S.map(([t, s], i) => {
        const x = [40, 330, 330, 40][i], y = [20, 20, 140, 140][i]
        return <Box key={t} x={x} y={y} w={250} h={70} fill={TINT[i]} label={t} sub={s} size={13} />
      })}
      <Arr id={id} x1={290} y1={55} x2={328} y2={55} />
      <Arr id={id} x1={455} y1={90} x2={455} y2={138} />
      <Arr id={id} x1={330} y1={175} x2={292} y2={175} />
      <Arr id={id} x1={165} y1={138} x2={165} y2={92} />
      <T x={310} y={240} size={11}>Release → software increment; project velocity computed → next iteration planned</T>
      <T x={310} y={258} size={10.5} color={C.red}>Refactoring and keeping the design simple run throughout</T>
    </Svg>
  )
}

export function SeAsd() {
  const id = 'se-asd'
  const S = [['Speculation', 'adaptive cycle planning:', 'mission, constraints, release cycles'], ['Collaboration', 'requirements gathering (JAD),', 'mini-specs, teamwork'], ['Learning', 'components tested; focus groups,', 'technical reviews, postmortems']]
  return (
    <Svg w={620} h={250} id={id} label="Adaptive Software Development life cycle: speculation, collaboration and learning">
      {S.map(([t, a, b], i) => {
        const x = [210, 400, 20][i], y = [10, 120, 120][i]
        return (
          <g key={t}>
            <Box x={x} y={y} w={200} h={46} fill={TINT[i]} label={t} size={13} />
            <T x={x + 100} y={y + 62} size={10}>{a}</T>
            <T x={x + 100} y={y + 76} size={10}>{b}</T>
          </g>
        )
      })}
      <Arr id={id} x1={412} y1={40} x2={490} y2={116} />
      <Arr id={id} x1={398} y1={143} x2={224} y2={143} />
      <Arr id={id} x1={110} y1={116} x2={206} y2={40} />
      <T x={310} y={236} size={11}>Release → software increment; adjustments feed the next cycle</T>
    </Svg>
  )
}

export function SeScrum() {
  const id = 'se-scrum'
  return (
    <Svg w={640} h={260} id={id} label="Scrum: product backlog, sprint planning into a sprint backlog, a 30-day sprint with daily 15-minute scrum meetings, and a potentially shippable increment">
      <Box x={10} y={90} w={120} h={70} fill={TINT[0]} label="Product backlog" sub="prioritised features" size={12} />
      <Box x={164} y={90} w={120} h={70} fill={TINT[1]} label="Sprint backlog" sub="items for this sprint" size={12} />
      <Arr id={id} x1={130} y1={125} x2={162} y2={125} />
      <T x={146} y={80} size={10}>sprint planning</T>
      <circle cx={400} cy={125} r={70} fill="var(--mint)" stroke="currentColor" strokeWidth="1.6" />
      <T x={400} y={118} weight={700}>Sprint</T><T x={400} y={136} size={11}>2–4 weeks (≈30 days)</T>
      <circle cx={400} cy={36} r={24} fill={TINT[3]} stroke="currentColor" strokeWidth="1.4" />
      <T x={400} y={34} size={10} weight={700}>Daily</T><T x={400} y={46} size={9.5}>15 min</T>
      <path d="M 420 50 C 460 70, 460 70, 452 80" fill="none" stroke={C.red} strokeWidth="1.6" markerEnd={`url(#${id}-a)`} />
      <Arr id={id} x1={284} y1={125} x2={328} y2={125} />
      <Box x={505} y={90} w={125} h={70} fill={TINT[4]} label="Shippable increment" sub="demo to customer" size={11.5} />
      <Arr id={id} x1={470} y1={125} x2={503} y2={125} />
      <T x={320} y={220} size={10.5}>Daily scrum: What did you do yesterday? What will you do today? Any obstacles?</T>
      <T x={320} y={240} size={10.5}>Roles: product owner (backlog), Scrum master (removes impediments), team</T>
    </Svg>
  )
}

export function SeDsdm() {
  const id = 'se-dsdm'
  const S = [['Feasibility study', 'business requirements, constraints; is DSDM suitable?'], ['Business study', 'functional and information requirements; architecture'], ['Functional model iteration', 'incremental prototypes shown to users'], ['Design and build iteration', 'revisit prototypes so they deliver business value'], ['Implementation', 'latest increment put into operation']]
  return (
    <Svg w={620} h={290} id={id} label="DSDM life cycle: feasibility study, business study, functional model iteration, design and build iteration, implementation">
      {S.map(([t, s], i) => (
        <g key={t}>
          <Box x={30 + i * 50} y={10 + i * 54} w={360} h={44} fill={TINT[i]} label={t} sub={s} size={12} />
          {i < 4 && <Arr id={id} x1={210 + i * 50} y1={54 + i * 54} x2={210 + i * 50} y2={64 + i * 54} />}
        </g>
      ))}
      <path d="M 520 240 C 600 180, 600 120, 500 128" fill="none" stroke={C.red} strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      <T x={540} y={118} size={10} color={C.red} anchor="start">iterate</T>
      <T x={14} y={286} anchor="start" size={10.5}>80% of the value in 20% of the time (Pareto principle); time-boxes; MoSCoW prioritisation.</T>
    </Svg>
  )
}

export function SeFdd() {
  const id = 'se-fdd'
  const S = ['Develop an overall model', 'Build a features list', 'Plan by feature', 'Design by feature', 'Build by feature']
  return (
    <Svg w={620} h={150} id={id} label="Feature Driven Development: develop an overall model, build a features list, plan by feature, then design and build by feature">
      {S.map((s, i) => (
        <g key={s}>
          <Box x={4 + i * 124} y={20} w={112} h={56} fill={TINT[i]} label={s.split(' ').slice(0, 2).join(' ')} sub={s.split(' ').slice(2).join(' ')} size={11.5} />
          {i < 4 && <Arr id={id} x1={116 + i * 124} y1={48} x2={126 + i * 124} y2={48} />}
        </g>
      ))}
      <path d="M 560 80 C 560 116, 440 116, 440 80" fill="none" stroke={C.red} strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      <T x={500} y={130} size={10} color={C.red}>iterate per feature (≤ 2 weeks)</T>
      <T x={180} y={122} size={10.5}>Feature: &lt;action&gt; the &lt;result&gt; &lt;by|for|of|to&gt; a(n) &lt;object&gt;</T>
    </Svg>
  )
}

export function SeReqTasks() {
  const id = 'se-req'
  const S = [['Inception', 'understand problem'], ['Elicitation', 'gather'], ['Elaboration', 'refine model'], ['Negotiation', 'resolve conflicts'], ['Specification', 'write the SRS'], ['Validation', 'review it'], ['Management', 'track changes']]
  return (
    <Svg w={640} h={200} id={id} label="Requirements engineering tasks: inception, elicitation, elaboration, negotiation, specification, validation, requirements management">
      {S.slice(0, 6).map(([t, s], i) => (
        <g key={t}>
          <Box x={4 + i * 106} y={20} w={96} h={56} fill={TINT[i]} label={t} sub="" size={11.5} />
          <T x={52 + i * 106} y={94} size={9.5}>{s}</T>
          {i < 5 && <Arr id={id} x1={100 + i * 106} y1={48} x2={108 + i * 106} y2={48} />}
        </g>
      ))}
      <Box x={110} y={130} w={420} h={44} fill={TINT[5]} label="Requirements management (throughout)" sub="identify, trace and control changes to requirements" size={12} />
    </Svg>
  )
}

// ============================ UNIT III ============================

export function SeRayleigh() {
  let d = 'M 50 200'
  for (let t = 0; t <= 1; t += 0.02) { const x = 50 + t * 480, y = 200 - 170 * (t * 3.2) * Math.exp(-((t * 3.2) ** 2) / 2) * 1.65; d += ` L ${x} ${y}` }
  return (
    <Svg w={580} h={240} id="se-ray" label="Rayleigh–Norden curve: staffing rises, peaks around delivery, then falls during maintenance">
      <line x1={50} y1={20} x2={50} y2={200} stroke="currentColor" strokeWidth="1.4" />
      <line x1={50} y1={200} x2={550} y2={200} stroke="currentColor" strokeWidth="1.4" />
      <path d={d} fill="none" stroke={C.blue} strokeWidth="2.4" />
      <line x1={200} y1={30} x2={200} y2={200} stroke={C.red} strokeDasharray="5 4" />
      <T x={200} y={22} size={10.5} color={C.red}>peak staffing ≈ delivery (t_d)</T>
      <T x={300} y={222} size={11}>Time</T>
      <g transform="translate(30 110) rotate(-90)"><T x={0} y={0} size={11}>Effort / staff</T></g>
      <T x={110} y={180} size={10}>design</T><T x={300} y={140} size={10}>build and test</T><T x={470} y={160} size={10}>maintenance</T>
    </Svg>
  )
}

export function SeEstimationDecomposition() {
  const id = 'se-dec'
  return (
    <Svg w={620} h={230} id={id} label="Decomposition techniques: problem-based estimation (LOC or FP) and process-based estimation, both after software sizing">
      <Box x={210} y={10} w={200} h={40} fill={TINT[3]} label="Software sizing" sub="fuzzy logic, function points, standard components, change" size={12} />
      <Arr id={id} x1={260} y1={50} x2={150} y2={80} /><Arr id={id} x1={360} y1={50} x2={470} y2={80} />
      <Box x={20} y={82} w={260} h={52} fill={TINT[1]} label="Problem-based estimation" sub="decompose functions; estimate LOC or FP each" size={12} />
      <Box x={340} y={82} w={260} h={52} fill={TINT[2]} label="Process-based estimation" sub="estimate effort per framework activity" size={12} />
      <Box x={20} y={150} w={125} h={40} fill="var(--surface)" label="LOC-based" size={11.5} />
      <Box x={155} y={150} w={125} h={40} fill="var(--surface)" label="FP-based" size={11.5} />
      <Arr id={id} x1={110} y1={134} x2={90} y2={148} /><Arr id={id} x1={190} y1={134} x2={215} y2={148} />
      <Box x={340} y={150} w={260} h={40} fill="var(--surface)" label="Use-case based, empirical (COCOMO)" size={11.5} />
      <T x={310} y={216} size={10.5}>Expected value (three-point): S = (s_opt + 4 s_m + s_pess) / 6</T>
    </Svg>
  )
}

// ============================ UNIT V ============================

export function SeTestSpiral() {
  const cx = 300, cy = 150
  const R = [['Unit testing', 'Code'], ['Integration testing', 'Design'], ['Validation testing', 'Requirements'], ['System testing', 'System engineering']]
  return (
    <Svg w={600} h={310} id="se-tsp" label="Testing strategy spiral: unit testing at the vortex (code), then integration (design), validation (requirements) and system testing (system engineering)">
      {R.slice().reverse().map(([, d], j) => { const i = 3 - j; return <circle key={d} cx={cx} cy={cy} r={34 + i * 34} fill={TINT[i]} stroke="currentColor" strokeWidth="1.2" /> })}
      {R.map(([t, d], i) => (
        <g key={t}>
          <T x={cx} y={cy - 18 - i * 34 + (i === 0 ? 22 : 0)} size={10.5} weight={700}>{i === 0 ? 'Unit (code)' : d}</T>
          <T x={cx + 148} y={cy + 30 + i * 30} size={10.5} anchor="start">{`${['U', 'I', 'V', 'S'][i]}: ${t}`}</T>
        </g>
      ))}
      <T x={cx + 148} y={cy + 6} size={10.5} weight={700} anchor="start">testing moves outward →</T>
      <T x={cx} y={300} size={10.5}>Development spirals inward (system → requirements → design → code); testing spirals outward.</T>
    </Svg>
  )
}

export function SeFlowGraph() {
  const id = 'se-fg'
  const N = { 1: [120, 30], 2: [120, 90], 3: [120, 150], 4: [190, 205], 5: [120, 260], 6: [230, 90] }
  const E = [[1, 2], [2, 3], [2, 6], [3, 4], [3, 5], [4, 5], [5, 2]]
  const P = (a, b) => { const [x1, y1] = N[a], [x2, y2] = N[b]; const L = Math.hypot(x2 - x1, y2 - y1); const k = 17 / L; return [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, x2 - (x2 - x1) * k, y2 - (y2 - y1) * k] }
  return (
    <Svg w={620} h={300} id={id} label="Flow graph for basis path testing with six nodes; cyclomatic complexity 3 and three independent paths">
      {E.filter(([a, b]) => !(a === 5 && b === 2)).map(([a, b]) => { const [x1, y1, x2, y2] = P(a, b); return <Arr key={`${a}${b}`} id={id} x1={x1} y1={y1} x2={x2} y2={y2} /> })}
      <path d="M 104 266 C 20 250, 20 110, 104 94" fill="none" stroke="currentColor" strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      {Object.entries(N).map(([n, [x, y]]) => <Node key={n} x={x} y={y} label={n} />)}
      <T x={62} y={180} size={10} color={C.red}>R1</T><T x={146} y={210} size={10} color={C.red}>R2</T><T x={240} y={250} size={10} color={C.red}>R3 (outside)</T>
      <g>
        {[[0, 'max = a[0]; i = 0;'], [0, 'while (i < n) {'], [1, 'if (a[i] > max)'], [2, 'max = a[i];'], [1, 'i++;'], [0, '} return max;']].map(([ind, code], k) => (
          <g key={code}>
            <T x={300 + ind * 16} y={28 + k * 18} anchor="start" mono size={11.5}>{code}</T>
            <T x={500} y={28 + k * 18} anchor="start" mono size={11.5} color={C.red}>{`// ${k + 1}`}</T>
          </g>
        ))}
        <T x={300} y={150} anchor="start" weight={700}>V(G) = E − N + 2 = 7 − 6 + 2 = 3</T>
        <T x={300} y={170} anchor="start">= P + 1 = 2 decisions + 1 = 3 = regions 3</T>
        <T x={300} y={204} anchor="start" weight={700}>Independent paths</T>
        <T x={300} y={224} anchor="start" mono size={11.5}>1-2-6</T>
        <T x={300} y={244} anchor="start" mono size={11.5}>1-2-3-4-5-2-6</T>
        <T x={300} y={264} anchor="start" mono size={11.5}>1-2-3-5-2-6</T>
      </g>
    </Svg>
  )
}

export function SeBlackBox() {
  return (
    <Svg w={620} h={190} id="se-bb" label="Equivalence partitioning and boundary value analysis for an input that must be between 18 and 60">
      <T x={310} y={18} weight={700}>Input: age must be 18 – 60</T>
      <rect x={30} y={50} width={160} height={40} fill="var(--coral-tint)" stroke={C.line} />
      <rect x={190} y={50} width={240} height={40} fill="var(--mint)" stroke={C.line} />
      <rect x={430} y={50} width={160} height={40} fill="var(--coral-tint)" stroke={C.line} />
      <T x={110} y={75} size={11.5} weight={700}>invalid: &lt; 18</T><T x={310} y={75} size={11.5} weight={700}>valid: 18 – 60</T><T x={510} y={75} size={11.5} weight={700}>invalid: &gt; 60</T>
      <T x={310} y={116} size={11}>Equivalence partitioning: one test per class, e.g. 10, 35, 70</T>
      {[[176, '17'], [190, '18'], [204, '19'], [416, '59'], [430, '60'], [444, '61']].map(([x, t]) => (
        <g key={t}><line x1={x} y1={90} x2={x} y2={136} stroke={C.red} strokeWidth="1.6" /><T x={x} y={152} size={11} weight={700} color={C.red}>{t}</T></g>
      ))}
      <T x={310} y={178} size={11}>Boundary value analysis: test at, just below and just above each boundary</T>
    </Svg>
  )
}

export function SeRollback() {
  const id = 'se-rb'
  return (
    <Svg w={620} h={240} id={id} label="Deployment rollback: version 2 is deployed, monitoring detects a failure, and the system is rolled back to the last stable version 1">
      <Box x={10} y={40} w={130} h={50} fill={TINT[2]} label="Version 1.0" sub="stable, in production" size={12} />
      <Arr id={id} x1={140} y1={65} x2={178} y2={65} />
      <T x={159} y={55} size={10}>deploy</T>
      <Box x={180} y={40} w={130} h={50} fill={TINT[3]} label="Version 2.0" sub="new release" size={12} />
      <Arr id={id} x1={310} y1={65} x2={348} y2={65} />
      <Box x={350} y={40} w={120} h={50} fill={TINT[1]} label="Monitor" sub="errors, health checks" size={12} />
      <Arr id={id} x1={470} y1={65} x2={498} y2={65} />
      <Box x={500} y={40} w={110} h={50} fill={TINT[4]} label="Failure!" sub="crash, data errors" size={12} color={C.red} />
      <path d="M 555 90 C 555 150, 75 150, 75 92" fill="none" stroke={C.red} strokeWidth="2.2" markerEnd={`url(#${id}-a)`} />
      <T x={315} y={170} size={11.5} weight={700} color={C.red}>Rollback: restore the last known good version (code, config, database)</T>
      <T x={315} y={206} size={10.5}>Strategies: keep the previous build, blue-green switch, canary release, feature flags,</T>
      <T x={315} y={222} size={10.5}>database backups and reversible migrations.</T>
    </Svg>
  )
}

export function SeFtr() {
  const id = 'se-ftr'
  const S = [['Planning', 'work ready;leader picks team'], ['Preparation', 'reviewers study;the work product'], ['Review meeting', '3–5 people;≤ 2 hours'], ['Record and report', 'issues list;summary report'], ['Rework', 'producer fixes;leader checks']]
  return (
    <Svg w={620} h={150} id={id} label="Formal technical review: planning, preparation, review meeting, record and report, rework and follow-up">
      {S.map(([t, s], i) => (
        <g key={t}>
          <Box x={4 + i * 124} y={14} w={112} h={50} fill={TINT[i]} label={t} size={11.5} />
          <T x={60 + i * 124} y={84} size={9.5}>{s.split(';')[0]}</T>
          {s.includes(';') && <T x={60 + i * 124} y={98} size={9.5}>{s.split(';')[1]}</T>}
          {i < 4 && <Arr id={id} x1={116 + i * 124} y1={39} x2={126 + i * 124} y2={39} />}
        </g>
      ))}
      <T x={310} y={132} size={10.5}>Decision: accept, reject, or accept provisionally (minor fixes)</T>
    </Svg>
  )
}
