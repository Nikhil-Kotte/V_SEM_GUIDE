// Hand-drawn Fundamentals of Data Science diagrams, built from the shared kit. Registered in ./index.js.
// The regression, k-means, indexing and group-by figures use the data from the FDS class tests.
import { C, Svg, T, Box, Arr } from './kit.jsx'

const TINT = ['var(--violet-tint)', 'var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--coral-tint)', 'var(--surface-2)']

// ============================ UNIT I ============================

export function FdsVenn() {
  const c = [[230, 120, C.blue, 'Statistics and', 'mathematics', 150, 85], [370, 120, C.green, 'Computer science', '(programming, ML)', 450, 85], [300, 225, C.red, 'Domain', 'knowledge', 300, 290]]
  return (
    <Svg w={600} h={320} id="fds-venn" label="Data science at the intersection of statistics, computer science and domain knowledge">
      {c.map(([x, y, col]) => <circle key={x + y} cx={x} cy={y} r={105} fill={col} fillOpacity=".12" stroke={col} strokeWidth="2" />)}
      {c.map(([, , col, a, b, tx, ty]) => <g key={a}><T x={tx} y={ty} weight={700} color={col}>{a}</T><T x={tx} y={ty + 16} weight={700} color={col}>{b}</T></g>)}
      <T x={300} y={160} weight={700} size={13}>Data</T><T x={300} y={176} weight={700} size={13}>science</T>
      <T x={300} y={70} size={10.5}>machine learning</T>
      <T x={210} y={200} size={10.5}>traditional</T><T x={210} y={213} size={10.5}>research</T>
      <T x={392} y={200} size={10.5}>software</T><T x={392} y={213} size={10.5}>development</T>
    </Svg>
  )
}

export function FdsLifecycle() {
  const id = 'fds-life'
  const S = ['Define the problem', 'Collect data', 'Prepare / clean', 'Explore (EDA)', 'Model', 'Evaluate', 'Communicate and deploy']
  const cx = 300, cy = 160, rx = 230, ry = 120
  const pts = S.map((_, i) => { const a = (i / S.length) * 2 * Math.PI - Math.PI / 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] })
  return (
    <Svg w={600} h={320} id={id} label="The data science life cycle: define, collect, prepare, explore, model, evaluate, communicate and deploy, then repeat">
      {pts.map(([x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; const k = 0.3; return <Arr key={i} id={id} x1={x + (x2 - x) * k} y1={y + (y2 - y) * k} x2={x + (x2 - x) * (1 - k)} y2={y + (y2 - y) * (1 - k)} color={C.blue} /> })}
      {pts.map(([x, y], i) => <Box key={S[i]} x={x - 68} y={y - 17} w={136} h={34} fill={TINT[i % 6]} label={S[i]} size={11} />)}
      <T x={cx} y={cy} weight={700}>iterative:</T><T x={cx} y={cy + 16} size={11}>new questions restart the cycle</T>
    </Svg>
  )
}

export function FdsDataTypes() {
  const col = [['Structured', TINT[2], ['Fixed schema: rows and columns', 'Stored in RDBMS / spreadsheets', 'Queried with SQL', 'e.g. marks, attendance,', 'hospital records, sensor readings'], 'Easy to search and analyse'], ['Semi-structured', TINT[3], ['Tags or keys, flexible schema', 'JSON, XML, CSV, e-mail headers', 'NoSQL stores (MongoDB)', 'e.g. web logs, API data,', 'sensor messages with metadata'], 'Partly self-describing'], ['Unstructured', TINT[4], ['No predefined format', 'Text, images, audio, video', 'Data lakes, Hadoop, NoSQL', 'e.g. social-media posts, feedback,', 'scanned answer scripts, CCTV'], '≈80% of all data; hard to analyse']]
  return (
    <Svg w={630} h={250} id="fds-types" label="Structured, semi-structured and unstructured data compared">
      {col.map(([t, f, items, foot], i) => (
        <g key={t}>
          <Box x={10 + i * 207} y={10} w={196} h={36} fill={f} label={t} size={13} />
          <rect x={10 + i * 207} y={52} width={196} height={150} rx={8} fill="var(--surface)" stroke={C.line} />
          {items.map((s, k) => <T key={s} x={108 + i * 207} y={78 + k * 26} size={10.5}>{s}</T>)}
          <T x={108 + i * 207} y={228} size={11} weight={700} color={[C.green, C.gold, C.red][i]}>{foot}</T>
        </g>
      ))}
    </Svg>
  )
}

export function FdsPreprocess() {
  const id = 'fds-pre'
  const S = [['Data cleaning', 'missing values, noise,', 'duplicates, errors'], ['Data integration', 'merge sources; resolve', 'schema and value conflicts'], ['Data transformation', 'normalise, scale,', 'encode, aggregate'], ['Data reduction', 'fewer attributes (PCA,', 'feature selection) or rows'], ['Data discretization', 'continuous values', 'into intervals / labels']]
  return (
    <Svg w={640} h={190} id={id} label="Data preprocessing pipeline: cleaning, integration, transformation, reduction, discretization">
      <Box x={4} y={60} w={70} h={50} fill="var(--surface)" label="Raw" sub="data" size={12} dash="5 3" />
      {S.map(([t, a, b], i) => (
        <g key={t}>
          <Box x={88 + i * 108} y={50} w={100} h={70} fill={TINT[i]} label="" />
          <T x={138 + i * 108} y={74} size={11} weight={700}>{t.split(' ')[0]}</T>
          <T x={138 + i * 108} y={90} size={11} weight={700}>{t.split(' ')[1]}</T>
          <T x={138 + i * 108} y={145} size={9.5}>{a}</T><T x={138 + i * 108} y={158} size={9.5}>{b}</T>
          <Arr id={id} x1={i === 0 ? 74 : 80 + i * 108} y1={85} x2={86 + i * 108} y2={85} />
        </g>
      ))}
      <T x={320} y={26} size={11} weight={700}>Each step improves data quality: accuracy, completeness, consistency</T>
    </Svg>
  )
}

export function FdsDikw() {
  const L = [['Wisdom', 'what to do: decisions'], ['Knowledge', 'how: patterns and rules'], ['Information', 'what: data with meaning'], ['Data', 'raw facts and numbers']]
  return (
    <Svg w={560} h={240} id="fds-dikw" label="The DIKW pyramid: data, information, knowledge, wisdom">
      {L.map(([t, s], i) => {
        const top = 20 + i * 52, w0 = 60 + i * 90, w1 = 60 + (i + 1) * 90
        return (
          <g key={t}>
            <path d={`M ${200 - w0 / 2} ${top} L ${200 + w0 / 2} ${top} L ${200 + w1 / 2} ${top + 50} L ${200 - w1 / 2} ${top + 50} Z`} fill={TINT[i]} stroke={C.line} />
            <T x={200} y={top + 30} weight={700}>{t}</T>
            <T x={400} y={top + 30} anchor="start" size={11}>{s}</T>
          </g>
        )
      })}
    </Svg>
  )
}

// ============================ UNIT II ============================

export function FdsAnalytics() {
  const S = [['Descriptive', 'What happened?', 'reports, dashboards, totals'], ['Diagnostic', 'Why did it happen?', 'drill-down, correlation'], ['Predictive', 'What will happen?', 'regression, forecasting'], ['Prescriptive', 'What should we do?', 'optimisation']]
  return (
    <Svg w={620} h={270} id="fds-anl" label="The four types of analytics: descriptive, diagnostic, predictive and prescriptive, rising in value and difficulty">
      <line x1={40} y1={240} x2={600} y2={240} stroke="currentColor" strokeWidth="1.4" />
      <line x1={40} y1={240} x2={40} y2={14} stroke="currentColor" strokeWidth="1.4" />
      <T x={320} y={262} size={11}>Difficulty / complexity →</T>
      <g transform="translate(24 130) rotate(-90)"><T x={0} y={0} size={11}>Value →</T></g>
      {S.map(([t, q, e], i) => (
        <g key={t}>
          <rect x={60 + i * 135} y={180 - i * 50} width={125} height={56 + i * 50} rx={6} fill={TINT[i]} stroke={C.line} />
          <T x={122 + i * 135} y={200 - i * 50} weight={700}>{t}</T>
          <T x={122 + i * 135} y={216 - i * 50} size={10.5} color={C.red}>{q}</T>
          <T x={122 + i * 135} y={230 - i * 50} size={9.5}>{e}</T>
        </g>
      ))}
    </Svg>
  )
}

const curve = (f, x0, x1, y0, sc) => { let d = ''; for (let i = 0; i <= 60; i++) { const t = i / 60; const x = x0 + (x1 - x0) * t; d += `${i ? 'L' : 'M'} ${x} ${y0 - f(t) * sc} ` } return d }

export function FdsSkew() {
  const P = [['Negative (left) skew', (t) => Math.pow(t, 3) * Math.pow(1 - t, 0.8) * 9, 'mean < median < mode'], ['Symmetric (normal)', (t) => Math.exp(-((t - 0.5) ** 2) / 0.03), 'mean = median = mode'], ['Positive (right) skew', (t) => Math.pow(1 - t, 3) * Math.pow(t, 0.8) * 9, 'mode < median < mean']]
  return (
    <Svg w={630} h={200} id="fds-skew" label="Negative skew, symmetric and positive skew distributions with the order of mean, median and mode">
      {P.map(([t, f, s], i) => (
        <g key={t}>
          <line x1={20 + i * 210} y1={150} x2={200 + i * 210} y2={150} stroke="currentColor" />
          <path d={curve(f, 25 + i * 210, 195 + i * 210, 150, 110)} fill={TINT[i + 1]} fillOpacity=".7" stroke={C.blue} strokeWidth="2" />
          <T x={110 + i * 210} y={172} weight={700} size={12}>{t}</T>
          <T x={110 + i * 210} y={190} size={10.5} color={C.red}>{s}</T>
        </g>
      ))}
    </Svg>
  )
}

export function FdsCorrelation() {
  const sets = [['Strong positive (r ≈ +0.9)', (x) => x * 0.9 + 0.05], ['No correlation (r ≈ 0)', () => null], ['Strong negative (r ≈ −0.9)', (x) => 0.95 - x * 0.9]]
  const rnd = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1
  return (
    <Svg w={630} h={210} id="fds-corr" label="Scatter plots of strong positive, zero and strong negative correlation">
      {sets.map(([t, f], k) => (
        <g key={t}>
          <rect x={15 + k * 210} y={10} width={180} height={150} fill="var(--surface)" stroke={C.line} />
          {Array.from({ length: 22 }, (_, i) => { const x = rnd(i + k * 7); const yv = f(x); const y = yv == null ? rnd(i * 3 + 1) : Math.min(1, Math.max(0, yv + (rnd(i + 50) - 0.5) * 0.18)); return <circle key={i} cx={25 + k * 210 + x * 160} cy={150 - y * 130} r={3.2} fill={C.blue} /> })}
          <T x={105 + k * 210} y={182} weight={700} size={11.5}>{t}</T>
        </g>
      ))}
      <T x={315} y={204} size={10.5}>r ranges from −1 (perfect negative) through 0 (no linear relation) to +1 (perfect positive)</T>
    </Svg>
  )
}

export function FdsBoxplot() {
  const X = (v) => 40 + (v - 10) * 30
  const q = { min: 12, q1: 15, med: 15, q3: 20, max: 25 }
  return (
    <Svg w={620} h={190} id="fds-box" label="Box plot of the complaint data: minimum 12, Q1 15, median 15, Q3 20, maximum 25">
      <line x1={X(10)} y1={140} x2={X(28)} y2={140} stroke="currentColor" />
      {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28].map((v) => <g key={v}><line x1={X(v)} y1={140} x2={X(v)} y2={146} stroke="currentColor" /><T x={X(v)} y={160} size={10}>{v}</T></g>)}
      <line x1={X(q.min)} y1={80} x2={X(q.q1)} y2={80} stroke="currentColor" strokeWidth="1.6" />
      <line x1={X(q.q3)} y1={80} x2={X(q.max)} y2={80} stroke="currentColor" strokeWidth="1.6" />
      <rect x={X(q.q1)} y={55} width={X(q.q3) - X(q.q1)} height={50} fill="var(--blue-tint)" stroke="currentColor" strokeWidth="1.6" />
      <line x1={X(q.med)} y1={55} x2={X(q.med)} y2={105} stroke={C.red} strokeWidth="3" />
      {[[q.min, 'min 12'], [q.q1, 'Q1 = median = 15'], [q.q3, 'Q3 20'], [q.max, 'max 25']].map(([v, t]) => <T key={t} x={X(v)} y={45} size={10.5} weight={700}>{t}</T>)}
      <line x1={X(q.min)} y1={70} x2={X(q.min)} y2={90} stroke="currentColor" strokeWidth="1.6" />
      <line x1={X(q.max)} y1={70} x2={X(q.max)} y2={90} stroke="currentColor" strokeWidth="1.6" />
      <T x={310} y={182} size={10.5}>Complaints 12, 15, 15, 15, 18, 20, 25: long right whisker → positive skew; IQR = 20 − 15 = 5</T>
    </Svg>
  )
}

export function FdsNormal() {
  const f = (z) => Math.exp(-z * z / 2)
  const X = (z) => 310 + z * 80
  let d = ''; for (let i = 0; i <= 120; i++) { const z = -3.5 + i * 7 / 120; d += `${i ? 'L' : 'M'} ${X(z)} ${170 - f(z) * 140} ` }
  const band = (a, b, col) => { let p = `M ${X(a)} 170 `; for (let i = 0; i <= 40; i++) { const z = a + (b - a) * i / 40; p += `L ${X(z)} ${170 - f(z) * 140} ` } return <path d={p + `L ${X(b)} 170 Z`} fill={col} fillOpacity=".35" /> }
  return (
    <Svg w={620} h={230} id="fds-norm" label="Normal distribution with 68, 95 and 99.7 percent of values within one, two and three standard deviations">
      {band(-3, 3, 'var(--yellow-tint)')}{band(-2, 2, 'var(--mint)')}{band(-1, 1, 'var(--blue-tint)')}
      <path d={d} fill="none" stroke={C.blue} strokeWidth="2.4" />
      <line x1={40} y1={170} x2={580} y2={170} stroke="currentColor" />
      {[-3, -2, -1, 0, 1, 2, 3].map((z) => <T key={z} x={X(z)} y={186} size={10.5}>{z === 0 ? 'μ' : `μ${z > 0 ? '+' : '−'}${Math.abs(z)}σ`}</T>)}
      <T x={310} y={120} weight={700} size={12}>68%</T>
      <T x={310} y={206} size={11}>μ ± σ: 68%   ·   μ ± 2σ: 95%   ·   μ ± 3σ: 99.7%   (empirical rule)</T>
    </Svg>
  )
}

// ============================ UNIT III ============================

export function FdsBroadcast() {
  const cell = (x, y, v, f) => <g key={`${x}${y}`}><rect x={x} y={y} width={44} height={34} fill={f} stroke={C.line} /><T x={x + 22} y={y + 22} weight={700}>{v}</T></g>
  return (
    <Svg w={620} h={200} id="fds-bc" label="Element-wise addition A + B = [11, 22, 33] and broadcasting a scalar across an array">
      <T x={14} y={22} anchor="start" weight={700}>Element-wise (vectorised): same shape (3,)</T>
      {[10, 20, 30].map((v, i) => cell(20 + i * 44, 34, v, TINT[1]))}
      <T x={170} y={56} size={18} weight={700}>+</T>
      {[1, 2, 3].map((v, i) => cell(190 + i * 44, 34, v, TINT[2]))}
      <T x={340} y={56} size={18} weight={700}>=</T>
      {[11, 22, 33].map((v, i) => cell(360 + i * 44, 34, v, TINT[3]))}
      <T x={14} y={112} anchor="start" weight={700}>Broadcasting: a scalar (or smaller array) is stretched to match</T>
      {[10, 20, 30].map((v, i) => cell(20 + i * 44, 124, v, TINT[1]))}
      <T x={170} y={146} size={18} weight={700}>+</T>
      {cell(190, 124, 5, TINT[2])}
      {[5, 5].map((v, i) => <g key={i}><rect x={234 + i * 44} y={124} width={44} height={34} fill="none" stroke={C.red} strokeDasharray="4 3" /><T x={256 + i * 44} y={146} color={C.red}>{v}</T></g>)}
      <T x={340} y={146} size={18} weight={700}>=</T>
      {[15, 25, 35].map((v, i) => cell(360 + i * 44, 124, v, TINT[3]))}
      <T x={310} y={190} size={10.5}>Rule: compare shapes from the right; dimensions must be equal or one of them must be 1.</T>
    </Svg>
  )
}

export function FdsIndexing() {
  const A = [[10, 20, 30], [40, 50, 60], [70, 80, 90]]
  const grid = (ox, title, code, on) => (
    <g key={title}>
      <T x={ox + 66} y={18} weight={700} size={11.5}>{title}</T>
      {A.map((r, i) => r.map((v, j) => <g key={`${i}${j}`}><rect x={ox + j * 44} y={28 + i * 34} width={44} height={34} fill={on(i, j, v) ? 'var(--coral-tint)' : 'var(--surface)'} stroke={C.line} /><T x={ox + 22 + j * 44} y={50 + i * 34} weight={on(i, j, v) ? 700 : 400}>{v}</T></g>))}
      <T x={ox + 66} y={152} mono size={11}>{code}</T>
    </g>
  )
  return (
    <Svg w={620} h={170} id="fds-idx" label="NumPy indexing on A: second row, third column, sub-array [[50,60],[80,90]] and elements greater than 50">
      {grid(10, 'Second row', 'A[1]', (i) => i === 1)}
      {grid(165, 'Third column', 'A[:, 2]', (i, j) => j === 2)}
      {grid(320, 'Sub-array', 'A[1:, 1:]', (i, j) => i >= 1 && j >= 1)}
      {grid(475, 'Elements > 50', 'A[A > 50]', (i, j, v) => v > 50)}
    </Svg>
  )
}

export function FdsGroupby() {
  const id = 'fds-gb'
  const rows = [['Accounts', 30000], ['Sales', 40000], ['Accounts', 35000], ['Sales', 45000], ['HR', 46000]]
  const G = [['Accounts', [30000, 35000], 32500, TINT[1]], ['HR', [46000], 46000, TINT[2]], ['Sales', [40000, 45000], 42500, TINT[3]]]
  return (
    <Svg w={640} h={230} id={id} label="Split-apply-combine: group DataFrame A by Dept, take the mean salary, combine the results">
      <T x={80} y={18} weight={700} size={11.5}>DataFrame A</T>
      {rows.map(([d, s], i) => <g key={i}><rect x={10} y={28 + i * 30} width={140} height={30} fill={G.find((g) => g[0] === d)[3]} stroke={C.line} /><T x={50} y={48 + i * 30} size={11}>{d}</T><T x={118} y={48 + i * 30} size={11}>{s}</T></g>)}
      <T x={200} y={18} size={10.5} weight={700} color={C.red}>split</T>
      <Arr id={id} x1={155} y1={110} x2={205} y2={110} />
      {G.map(([d, v], i) => <g key={d}><rect x={215} y={28 + i * 60} width={150} height={48} rx={6} fill={G[i][3]} stroke={C.line} /><T x={290} y={48 + i * 60} size={11} weight={700}>{d}</T><T x={290} y={64 + i * 60} size={10.5}>{v.join(', ')}</T></g>)}
      <T x={420} y={18} size={10.5} weight={700} color={C.red}>apply mean()</T>
      {G.map(([d], i) => <Arr key={d} id={id} x1={368} y1={52 + i * 60} x2={420} y2={52 + i * 60} />)}
      <T x={530} y={18} size={10.5} weight={700} color={C.red}>combine</T>
      {G.map(([d, , m], i) => <g key={d}><rect x={425} y={32 + i * 60} width={200} height={40} fill={G[i][3]} stroke={C.line} /><T x={475} y={57 + i * 60} size={11}>{d}</T><T x={575} y={57 + i * 60} size={11} weight={700}>{m}</T></g>)}
      <T x={320} y={222} mono size={11}>A.groupby('Dept')['Salary'].mean()</T>
    </Svg>
  )
}

// ============================ UNIT IV ============================

export function FdsHypothesis() {
  const f = (z) => Math.exp(-z * z / 2)
  const X = (z) => 310 + z * 75
  let d = ''; for (let i = 0; i <= 120; i++) { const z = -3.6 + i * 7.2 / 120; d += `${i ? 'L' : 'M'} ${X(z)} ${160 - f(z) * 125} ` }
  const tail = (a, b) => { let p = `M ${X(a)} 160 `; for (let i = 0; i <= 30; i++) { const z = a + (b - a) * i / 30; p += `L ${X(z)} ${160 - f(z) * 125} ` } return <path d={p + `L ${X(b)} 160 Z`} fill="var(--coral)" fillOpacity=".55" /> }
  return (
    <Svg w={620} h={230} id="fds-hyp" label="Two-tailed hypothesis test: the null distribution with rejection regions of total area alpha in both tails">
      {tail(-3.6, -1.96)}{tail(1.96, 3.6)}
      <path d={d} fill="none" stroke={C.blue} strokeWidth="2.4" />
      <line x1={30} y1={160} x2={590} y2={160} stroke="currentColor" />
      {[-1.96, 0, 1.96].map((z) => <g key={z}><line x1={X(z)} y1={160} x2={X(z)} y2={166} stroke="currentColor" /><T x={X(z)} y={180} size={10.5}>{z === 0 ? 'H₀ value' : z > 0 ? '+1.96' : '−1.96'}</T></g>)}
      <T x={310} y={100} weight={700} size={12}>fail to reject H₀</T><T x={310} y={116} size={10.5}>(1 − α = 95%)</T>
      <T x={95} y={135} size={10.5} weight={700} color={C.red}>reject H₀</T><T x={95} y={149} size={10} color={C.red}>α/2 = 2.5%</T>
      <T x={525} y={135} size={10.5} weight={700} color={C.red}>reject H₀</T><T x={525} y={149} size={10} color={C.red}>α/2 = 2.5%</T>
      <T x={310} y={204} size={11}>Decision: if p-value ≤ α (0.05), reject H₀ in favour of H₁; otherwise fail to reject H₀.</T>
      <T x={310} y={222} size={10.5}>Type I error = rejecting a true H₀ (probability α); Type II error = failing to reject a false H₀ (β).</T>
    </Svg>
  )
}

export function FdsAnalysisTypes() {
  const p = (cx, cy, k) => Array.from({ length: 14 }, (_, i) => { const a = Math.sin(i * 7.3 + k) * 0.5 + 0.5, b = Math.cos(i * 3.1 + k) * 0.5 + 0.5; return [cx + a * 120, cy + b * 90] })
  return (
    <Svg w={630} h={210} id="fds-uni" label="Univariate (one variable, histogram), bivariate (two variables, scatter plot) and multivariate (many variables, colour-coded scatter) analysis">
      {[[18, 22, 34, 50, 40, 26, 14]].map((h) => h.map((v, i) => <rect key={i} x={25 + i * 24} y={130 - v * 2} width={22} height={v * 2} fill="var(--blue-tint)" stroke={C.blue} />))}
      <line x1={20} y1={130} x2={200} y2={130} stroke="currentColor" />
      {p(235, 35, 1).map(([x, y], i) => <circle key={i} cx={x} cy={130 - (y - 35) * 0.3 - (x - 235) * 0.6} r={3.2} fill={C.blue} />)}
      <line x1={225} y1={130} x2={395} y2={130} stroke="currentColor" />
      {p(440, 35, 2).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.2 + (i % 3)} fill={[C.blue, C.red, C.green][i % 3]} fillOpacity=".8" />)}
      <line x1={430} y1={130} x2={600} y2={130} stroke="currentColor" />
      {[['Univariate', 'one variable: distribution', 'histogram, box plot'], ['Bivariate', 'two variables: relationship', 'scatter plot, correlation'], ['Multivariate', 'three or more variables', 'colour/size, pair plot, heat map']].map(([t, a, b], i) => (
        <g key={t}><T x={110 + i * 205} y={156} weight={700}>{t}</T><T x={110 + i * 205} y={174} size={10.5}>{a}</T><T x={110 + i * 205} y={190} size={10.5} color={C.red}>{b}</T></g>
      ))}
    </Svg>
  )
}

// ============================ UNIT V ============================

export function FdsRegressionCt() {
  const X = (h) => 60 + (h - 0.5) * 100, Y = (m) => 210 - (m - 30) * 5
  const D = [[1, 35], [2, 40], [3, 50], [4, 55], [5, 65]]
  const yhat = (h) => 26.5 + 7.5 * h
  return (
    <Svg w={620} h={250} id="fds-lr" label="Class-test regression: marks against study hours with fitted line y = 26.5 + 7.5x and residuals">
      <line x1={50} y1={215} x2={600} y2={215} stroke="currentColor" />
      <line x1={50} y1={215} x2={50} y2={20} stroke="currentColor" />
      {[1, 2, 3, 4, 5].map((h) => <T key={h} x={X(h)} y={232} size={10.5}>{h}</T>)}
      {[30, 40, 50, 60, 70].map((m) => <T key={m} x={40} y={Y(m) + 4} size={10.5} anchor="end">{m}</T>)}
      <T x={330} y={248} size={11}>Study hours (x)</T>
      <line x1={X(0.7)} y1={Y(yhat(0.7))} x2={X(5.4)} y2={Y(yhat(5.4))} stroke={C.red} strokeWidth="2.2" />
      {D.map(([h, m]) => <g key={h}><line x1={X(h)} y1={Y(m)} x2={X(h)} y2={Y(yhat(h))} stroke={C.green} strokeWidth="1.6" strokeDasharray="3 2" /><circle cx={X(h)} cy={Y(m)} r={5} fill={C.blue} /></g>)}
      <T x={70} y={34} anchor="start" weight={700} color={C.red}>ŷ = 26.5 + 7.5x</T>
      <T x={70} y={54} anchor="start" size={11}>MAE 1.2 · MSE 1.5 · RMSE ≈ 1.22 · R² ≈ 0.987</T>
      <T x={70} y={74} anchor="start" size={10.5} color={C.green}>dashed: residuals y − ŷ</T>
    </Svg>
  )
}

export function FdsKmeansCt() {
  const P = { P1: [2, 3], P2: [3, 3], P3: [3, 4], P4: [8, 7], P5: [9, 8], P6: [8, 9] }
  const cl = { P1: 0, P2: 0, P3: 0, P4: 1, P5: 2, P6: 2 }
  const cents = [[2.67, 3.33], [8, 7], [8.5, 8.5]]
  const X = (x) => 40 + x * 36, Y = (y) => 230 - y * 22
  const col = [C.blue, C.green, C.red]
  return (
    <Svg w={620} h={250} id="fds-km" label="Class-test k-means with K = 3: clusters {P1, P2, P3}, {P4}, {P5, P6} and their centroids">
      <line x1={X(0)} y1={Y(0)} x2={X(10.5)} y2={Y(0)} stroke="currentColor" />
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(10)} stroke="currentColor" />
      {[2, 4, 6, 8, 10].map((v) => <g key={v}><T x={X(v)} y={Y(0) + 15} size={10}>{v}</T><T x={X(0) - 8} y={Y(v) + 4} size={10} anchor="end">{v}</T></g>)}
      {Object.entries(P).map(([n, [x, y]]) => <g key={n}><circle cx={X(x)} cy={Y(y)} r={6} fill={col[cl[n]]} /><T x={n === 'P1' ? X(x) - 10 : X(x) + 10} y={n === 'P1' ? Y(y) + 4 : Y(y) - 6} size={10.5} anchor={n === 'P1' ? 'end' : 'start'}>{n}</T></g>)}
      {cents.map(([x, y], i) => <g key={i}><path d={`M ${X(x) - 6} ${Y(y) - 6} L ${X(x) + 6} ${Y(y) + 6} M ${X(x) + 6} ${Y(y) - 6} L ${X(x) - 6} ${Y(y) + 6}`} stroke={col[i]} strokeWidth="3" /></g>)}
      <T x={430} y={40} anchor="start" weight={700}>Final clusters (× = centroid)</T>
      <T x={430} y={62} anchor="start" size={11} color={C.blue}>C1 = {'{P1, P2, P3}'}  (2.67, 3.33)</T>
      <T x={430} y={82} anchor="start" size={11} color={C.green}>C2 = {'{P4}'}  (8, 7)</T>
      <T x={430} y={102} anchor="start" size={11} color={C.red}>C3 = {'{P5, P6}'}  (8.5, 8.5)</T>
      <T x={430} y={130} anchor="start" size={10.5}>Initial centroids: P1, P4, P5</T>
      <T x={430} y={146} anchor="start" size={10.5}>Converged after iteration 2</T>
    </Svg>
  )
}

export function FdsPca() {
  const id = 'fds-pca'
  const pts = Array.from({ length: 24 }, (_, i) => { const t = Math.sin(i * 2.7) * 1.2; const n = Math.cos(i * 5.1) * 0.25; return [t, n] })
  const ang = -0.6, cs = Math.cos(ang), sn = Math.sin(ang)
  const X = (u, v) => 170 + (u * cs - v * sn) * 90, Y = (u, v) => 130 + (u * sn + v * cs) * 90
  return (
    <Svg w={620} h={260} id={id} label="PCA: data points, the first principal component along the direction of maximum variance, and the second at right angles">
      <line x1={X(-1.8, 0)} y1={Y(-1.8, 0)} x2={X(1.8, 0)} y2={Y(1.8, 0)} stroke={C.red} strokeWidth="2.4" markerEnd={`url(#${id}-a)`} />
      <line x1={X(0, -0.7)} y1={Y(0, -0.7)} x2={X(0, 0.7)} y2={Y(0, 0.7)} stroke={C.green} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      {pts.map(([u, v], i) => <g key={i}><line x1={X(u, v)} y1={Y(u, v)} x2={X(u, 0)} y2={Y(u, 0)} stroke={C.line} strokeDasharray="2 2" /><circle cx={X(u, v)} cy={Y(u, v)} r={3.5} fill={C.blue} /></g>)}
      <T x={X(1.8, 0) + 10} y={Y(1.8, 0) - 4} anchor="start" weight={700} color={C.red}>PC1</T>
      <T x={X(0, -0.7) - 8} y={Y(0, -0.7) - 4} anchor="end" weight={700} color={C.green}>PC2</T>
      <T x={360} y={40} anchor="start" weight={700}>Principal component analysis</T>
      {['1. Standardise the features', '2. Covariance matrix', '3. Eigenvectors / eigenvalues', '4. Sort by eigenvalue (variance)', '5. Keep top k components', '6. Project the data onto them'].map((s, i) => <T key={s} x={360} y={64 + i * 20} anchor="start" size={11}>{s}</T>)}
      <T x={360} y={196} anchor="start" size={10.5} color={C.red}>PC1 = direction of maximum variance;</T>
      <T x={360} y={212} anchor="start" size={10.5} color={C.red}>dropping PC2 loses little information.</T>
    </Svg>
  )
}
