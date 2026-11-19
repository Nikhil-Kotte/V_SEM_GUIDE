// Hand-drawn Principles of Design Thinking diagrams, built from the shared kit. Registered in ./index.js.
import { C, Svg, T, Box, Arr } from './kit.jsx'

const TINT = ['var(--violet-tint)', 'var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--coral-tint)', 'var(--surface-2)']

export function PdtStages() {
  const id = 'pdt-st'
  const S = [['Empathize', 'understand users'], ['Define', 'frame the problem'], ['Ideate', 'generate ideas'], ['Prototype', 'build to think'], ['Test', 'learn from users']]
  return (
    <Svg w={640} h={220} id={id} label="The five stages of design thinking: empathize, define, ideate, prototype, test, with iteration loops back to earlier stages">
      {S.map(([t, s], i) => (
        <g key={t}>
          <Box x={10 + i * 126} y={70} w={112} h={56} fill={TINT[i]} label={t} sub={s} size={13} r={28} />
          {i < 4 && <Arr id={id} x1={122 + i * 126} y1={98} x2={134 + i * 126} y2={98} />}
        </g>
      ))}
      <path d="M 570 70 C 540 10, 330 10, 318 66" fill="none" stroke={C.red} strokeWidth="1.8" markerEnd={`url(#${id}-a)`} />
      <T x={445} y={22} size={10.5} color={C.red}>tests produce new ideas</T>
      <path d="M 570 126 C 520 196, 120 196, 66 130" fill="none" stroke={C.red} strokeWidth="1.8" strokeDasharray="6 4" markerEnd={`url(#${id}-a)`} />
      <T x={320} y={200} size={10.5} color={C.red}>tests reveal insights about users → redefine the problem</T>
      <path d="M 444 70 C 430 40, 200 40, 192 66" fill="none" stroke={C.blue} strokeWidth="1.6" strokeDasharray="4 3" markerEnd={`url(#${id}-a)`} />
      <T x={250} y={38} size={10} color={C.blue}>prototypes clarify the problem</T>
    </Svg>
  )
}

export function PdtLinearLateral() {
  const id = 'pdt-ll'
  return (
    <Svg w={640} h={220} id={id} label="Linear (vertical) thinking moves step by step along one logical path; lateral thinking jumps sideways to new perspectives and alternatives">
      <T x={150} y={20} weight={700} size={13}>Linear (vertical) thinking</T>
      {[0, 1, 2, 3].map((i) => <g key={i}><Box x={95} y={34 + i * 42} w={110} h={30} fill={TINT[1]} label={['Problem', 'Step 1', 'Step 2', 'One answer'][i]} size={11.5} />{i < 3 && <Arr id={id} x1={150} y1={64 + i * 42} x2={150} y2={74 + i * 42} />}</g>)}
      <T x={150} y={212} size={10.5}>logical, sequential, convergent</T>
      <line x1={320} y1={20} x2={320} y2={200} stroke={C.line} strokeDasharray="4 4" />
      <T x={480} y={20} weight={700} size={13}>Lateral thinking</T>
      <Box x={425} y={90} w={110} h={34} fill={TINT[3]} label="Problem" size={12} />
      {[[350, 40], [560, 40], [345, 160], [565, 160], [480, 168]].map(([x, y], i) => (
        <g key={i}><Arr id={id} x1={480} y1={i < 2 ? 90 : 124} x2={x + (x < 480 ? 50 : -10)} y2={y + (y < 90 ? 22 : 0)} color={C.red} dash="4 3" /><Box x={x - 30} y={y} w={80} h={24} fill={TINT[2]} label={['idea A', 'idea B', 'idea C', 'idea D', 'idea E'][i]} size={10.5} weight={400} /></g>
      ))}
      <T x={480} y={212} size={10.5}>creative, indirect, divergent</T>
    </Svg>
  )
}

export function PdtDivergeConverge() {
  return (
    <Svg w={640} h={200} id="pdt-dc" label="Divergent thinking opens up many options; convergent thinking narrows them to the best solution; design thinking alternates the two">
      <path d="M 40 100 L 300 20 L 300 180 Z" fill="var(--blue-tint)" stroke={C.blue} strokeWidth="1.6" />
      <path d="M 340 20 L 600 100 L 340 180 Z" fill="var(--mint)" stroke={C.green} strokeWidth="1.6" />
      <T x={200} y={96} weight={700} size={13}>Divergent thinking</T>
      <T x={200} y={114} size={10.5}>many ideas, options,</T><T x={200} y={128} size={10.5}>possibilities (brainstorm)</T>
      <T x={430} y={96} weight={700} size={13}>Convergent thinking</T>
      <T x={430} y={114} size={10.5}>evaluate, select, decide</T><T x={430} y={128} size={10.5}>the best solution</T>
      <T x={30} y={196} anchor="start" size={10.5}>Problem</T><T x={610} y={196} anchor="end" size={10.5}>Solution</T>
    </Svg>
  )
}

export function PdtEmpathySympathy() {
  return (
    <Svg w={600} h={200} id="pdt-es" label="Empathy is feeling with people: understanding their situation from their perspective; sympathy is feeling for people from your own perspective">
      <Box x={20} y={14} w={270} h={170} fill={TINT[2]} label="" />
      <Box x={310} y={14} w={270} h={170} fill={TINT[4]} label="" />
      <T x={155} y={40} weight={700} size={14}>Empathy</T>
      <T x={445} y={40} weight={700} size={14}>Sympathy</T>
      {['"Feeling WITH" the person', 'Steps into their shoes;', 'their perspective', 'Connects and understands', 'Leads to action and design', '"I know what it feels like"'].map((s, i) => <T key={s} x={155} y={66 + i * 20} size={11}>{s}</T>)}
      {['"Feeling FOR" the person', 'Stays in your own shoes;', 'your perspective', 'Pity or sorrow; distance', 'Often no deeper understanding', '"I feel sorry for you"'].map((s, i) => <T key={s} x={445} y={66 + i * 20} size={11}>{s}</T>)}
    </Svg>
  )
}

export function PdtImmersion() {
  const id = 'pdt-im'
  const S = [['1 Plan', 'goal, users, place'], ['2 Prepare', 'open mind; kit'], ['3 Immerse', 'live their routine'], ['4 Observe', 'actions, pains'], ['5 Engage', 'talk, ask why'], ['6 Record', 'notes, photos'], ['7 Reflect', 'insights, needs']]
  return (
    <Svg w={660} h={160} id={id} label="Steps of an immersion activity: plan, prepare, immerse, observe, engage, record, reflect and share">
      {S.map(([t, s], i) => (
        <g key={t}>
          <Box x={4 + i * 94} y={20} w={84} h={46} fill={TINT[i % 6]} label={t} size={11.5} />
          <T x={46 + i * 94} y={86} size={9.5}>{s.split(';')[0]}</T>
          {s.includes(';') && <T x={46 + i * 94} y={99} size={9.5}>{s.split(';')[1]}</T>}
          {i < 6 && <Arr id={id} x1={88 + i * 94} y1={43} x2={96 + i * 94} y2={43} />}
        </g>
      ))}
      <T x={330} y={140} size={10.5}>Immersion = experiencing the user's world first-hand instead of only asking about it.</T>
    </Svg>
  )
}

export function PdtDfv() {
  const c = [[250, 110, C.red, 'Desirability', 'Do people want it?', 160, 60], [370, 110, C.blue, 'Feasibility', 'Can we build it?', 470, 60], [310, 205, C.green, 'Viability', 'Is it sustainable for business?', 310, 290]]
  return (
    <Svg w={620} h={310} id="pdt-dfv" label="Desirability, feasibility and viability overlap; innovation sits where all three meet">
      {c.map(([x, y, col]) => <circle key={x + y} cx={x} cy={y} r={95} fill={col} fillOpacity=".12" stroke={col} strokeWidth="2" />)}
      {c.map(([, , col, a, b, tx, ty]) => <g key={a}><T x={tx} y={ty} weight={700} color={col}>{a}</T><T x={tx} y={ty + 15} size={10.5} color={col}>{b}</T></g>)}
      <T x={310} y={140} weight={700}>Innovation</T>
      <T x={310} y={156} size={10}>(sweet spot)</T>
    </Svg>
  )
}
