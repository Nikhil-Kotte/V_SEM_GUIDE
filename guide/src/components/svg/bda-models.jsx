// Hand-drawn Big Data Analytics diagrams (big data, Hadoop, HDFS, ingestion, MapReduce), built from the
// shared kit. Registered in ./index.js.
import { C, Svg, T, Box, Arr } from './kit.jsx'

const TINT = ['var(--violet-tint)', 'var(--blue-tint)', 'var(--mint)', 'var(--yellow-tint)', 'var(--coral-tint)', 'var(--surface-2)']

// ============================ UNIT I ============================

export function BdaVs() {
  const V = [['Volume', 'huge size: TB → PB → ZB'], ['Velocity', 'speed of generation and processing'], ['Variety', 'structured, semi-, unstructured'], ['Veracity', 'uncertainty, noise, trustworthiness'], ['Value', 'useful insight for decisions']]
  const cx = 300, cy = 150
  return (
    <Svg w={600} h={300} id="bda-vs" label="The five Vs of big data: volume, velocity, variety, veracity and value">
      <circle cx={cx} cy={cy} r={52} fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.6" />
      <T x={cx} y={cy - 2} weight={700} size={14}>Big</T><T x={cx} y={cy + 16} weight={700} size={14}>Data</T>
      {V.map(([t, s], i) => {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2, x = cx + Math.cos(a) * 190, y = cy + Math.sin(a) * 110
        return (
          <g key={t}>
            <line x1={cx + Math.cos(a) * 54} y1={cy + Math.sin(a) * 54} x2={x - Math.cos(a) * 40} y2={y - Math.sin(a) * 22} stroke={C.line} strokeWidth="1.6" />
            <Box x={x - 90} y={y - 22} w={180} h={44} fill={TINT[i]} label={t} sub={s} size={13} />
          </g>
        )
      })}
    </Svg>
  )
}

export function BdaAnalyticArch() {
  const id = 'bda-aa'
  const L = [['Data sources', 'RDBMS, logs, sensors,', 'social media, files'], ['Ingestion', 'Sqoop, Flume, Kafka;', 'batch and streaming'], ['Storage', 'HDFS, HBase,', 'NoSQL, data lake'], ['Processing', 'MapReduce, Spark,', 'Hive, Pig (via YARN)'], ['Analysis', 'BI, statistics, machine', 'learning, ad hoc queries'], ['Consumption', 'dashboards, reports,', 'applications, alerts']]
  return (
    <Svg w={640} h={250} id={id} label="Typical analytical architecture for big data: sources, ingestion, storage, processing, analysis and consumption, with security and governance across all layers">
      {L.map(([t, a, b], i) => (
        <g key={t}>
          <Box x={6 + i * 106} y={30} w={96} h={44} fill={TINT[i]} label={t} size={11.5} />
          <T x={54 + i * 106} y={94} size={9.5}>{a}</T><T x={54 + i * 106} y={108} size={9.5}>{b}</T>
          {i < 5 && <Arr id={id} x1={102 + i * 106} y1={52} x2={110 + i * 106} y2={52} />}
        </g>
      ))}
      <Box x={6} y={130} w={626} h={34} fill="var(--surface)" label="Resource management and scheduling (YARN) · cluster of commodity machines" size={11} weight={400} dash="5 3" />
      <Box x={6} y={176} w={626} h={34} fill="var(--surface)" label="Security · governance · metadata · data quality · workflow (Oozie) · coordination (ZooKeeper)" size={11} weight={400} dash="5 3" />
      <T x={320} y={236} size={10.5}>Data flows left to right; raw data is turned into insight that people and systems act on.</T>
    </Svg>
  )
}

export function BdaBiDs() {
  return (
    <Svg w={600} h={210} id="bda-bi" label="Business intelligence versus data science: past and present, structured data and reports versus future, all data and predictive models">
      <Box x={20} y={20} w={260} h={170} fill={TINT[1]} label="" />
      <Box x={320} y={20} w={260} h={170} fill={TINT[2]} label="" />
      <T x={150} y={44} weight={700} size={14}>Business intelligence</T>
      <T x={450} y={44} weight={700} size={14}>Data science</T>
      {['What happened? (past / present)', 'Structured data, data warehouse', 'Reports, dashboards, OLAP, KPIs', 'Descriptive analytics', 'Business users'].map((s, i) => <T key={s} x={150} y={74 + i * 24} size={11}>{s}</T>)}
      {['What will happen? (future)', 'All data, incl. unstructured', 'Statistics, ML, predictive models', 'Predictive and prescriptive', 'Data scientists'].map((s, i) => <T key={s} x={450} y={74 + i * 24} size={11}>{s}</T>)}
    </Svg>
  )
}

// ============================ UNIT II ============================

export function BdaHadoopStack() {
  const L = [['Data access and processing', ['Hive (SQL)', 'Pig (scripts)', 'Spark', 'Mahout (ML)', 'HBase (NoSQL)']], ['Data processing', ['MapReduce']], ['Resource management', ['YARN']], ['Storage', ['HDFS (distributed file system)']]]
  return (
    <Svg w={640} h={290} id="bda-stack" label="Hadoop stack: HDFS storage, YARN resource management, MapReduce processing, and ecosystem tools on top; ingestion and coordination tools alongside">
      {L.map(([t, items], i) => (
        <g key={t}>
          <rect x={10} y={10 + i * 62} width={480} height={54} rx={8} fill={TINT[i]} stroke={C.line} />
          <T x={20} y={28 + i * 62} anchor="start" size={10.5} weight={700}>{t}</T>
          {items.map((s, k) => <Box key={s} x={20 + k * (460 / items.length)} y={34 + i * 62} w={460 / items.length - 8} h={24} fill="var(--surface)" label={s} size={11} />)}
        </g>
      ))}
      <rect x={500} y={10} width={130} height={240} rx={8} fill={TINT[4]} stroke={C.line} />
      <T x={565} y={30} weight={700} size={11.5}>Around the core</T>
      {['Sqoop (RDBMS)', 'Flume (logs)', 'Kafka (streams)', 'ZooKeeper', 'Oozie (workflow)', 'Ambari (admin)'].map((s, k) => <Box key={s} x={508} y={42 + k * 34} w={114} h={28} fill="var(--surface)" label={s} size={10.5} weight={400} />)}
      <T x={320} y={278} size={10.5}>Hadoop core = HDFS + YARN + MapReduce (+ Hadoop Common); the ecosystem adds tools on top.</T>
    </Svg>
  )
}

export function BdaHdfsArch() {
  const id = 'bda-hdfs'
  const nodes = [['DataNode 1', ['B1', 'B2', 'B3']], ['DataNode 2', ['B1', 'B3', 'B4']], ['DataNode 3', ['B2', 'B4', 'B1']], ['DataNode 4', ['B2', 'B3', 'B4']]]
  const col = { B1: 'var(--blue-tint)', B2: 'var(--mint)', B3: 'var(--yellow-tint)', B4: 'var(--coral-tint)' }
  return (
    <Svg w={640} h={330} id={id} label="HDFS architecture: a NameNode holds the metadata, DataNodes store the 128 MB blocks with three replicas, clients get block locations from the NameNode and read or write data directly with DataNodes">
      <Box x={230} y={10} w={180} h={60} fill={TINT[0]} label="NameNode (master)" sub="metadata: namespace, block map" size={12.5} />
      <Box x={450} y={14} w={180} h={52} fill="var(--surface)" label="Secondary NameNode" sub="checkpoints fsimage + edits" size={11} dash="5 3" />
      <Box x={10} y={14} w={150} h={52} fill={TINT[3]} label="HDFS client" sub="read / write a file" size={12} />
      <Arr id={id} x1={160} y1={34} x2={228} y2={34} both color={C.blue} />
      <T x={194} y={26} size={9.5} color={C.blue}>metadata</T>
      <Arr id={id} x1={410} y1={40} x2={448} y2={40} />
      {nodes.map(([n, bl], i) => (
        <g key={n}>
          <rect x={10 + i * 158} y={150} width={148} height={110} rx={8} fill="var(--surface)" stroke={C.line} />
          <T x={84 + i * 158} y={170} weight={700} size={12}>{n}</T>
          {bl.map((b, k) => <Box key={k} x={22 + i * 158 + k * 42} y={186} w={38} h={30} fill={col[b]} label={b} size={11} />)}
          <T x={84 + i * 158} y={240} size={9.5}>stores blocks; heartbeat</T>
          <Arr id={id} x1={84 + i * 158} y1={148} x2={290 + i * 20} y2={72} color={C.green} dash="4 3" />
        </g>
      ))}
      <path d={`M 85 66 C 85 110, 60 120, 70 148`} fill="none" stroke={C.red} strokeWidth="2" markerEnd={`url(#${id}-a)`} />
      <T x={96} y={112} anchor="start" size={10} color={C.red}>data read/write</T>
      <T x={96} y={126} anchor="start" size={10} color={C.red}>directly with DataNodes</T>
      <T x={320} y={286} size={10.5}>Dashed green: heartbeats and block reports to the NameNode. A file is split into 128 MB blocks (B1–B4), each replicated 3 times.</T>
      <T x={320} y={304} size={10.5}>If a DataNode fails, the NameNode re-replicates its blocks from the surviving copies.</T>
    </Svg>
  )
}

export function BdaHdfsRead() {
  const id = 'bda-rd'
  return (
    <Svg w={640} h={290} id={id} label="Anatomy of an HDFS file read: open, get block locations from the NameNode, read blocks from the closest DataNodes, close">
      <Box x={10} y={90} w={130} h={60} fill={TINT[3]} label="Client" sub="DistributedFileSystem" size={12} />
      <Box x={250} y={10} w={150} h={50} fill={TINT[0]} label="NameNode" size={12.5} />
      {[0, 1, 2].map((k) => <Box key={k} x={480} y={70 + k * 60} w={150} h={44} fill="var(--surface)" label={`DataNode ${k + 1}`} size={12} />)}
      <Arr id={id} x1={140} y1={100} x2={250} y2={44} color={C.blue} />
      <T x={150} y={62} size={10.5} color={C.blue} anchor="start">1 open()</T>
      <Arr id={id} x1={252} y1={56} x2={142} y2={110} color={C.green} />
      <T x={200} y={98} size={10.5} color={C.green} anchor="start">2 block locations</T>
      <Arr id={id} x1={140} y1={126} x2={478} y2={92} color={C.red} />
      <T x={420} y={86} size={10.5} color={C.red}>3 read() block 1</T>
      <Arr id={id} x1={140} y1={136} x2={478} y2={152} color={C.red} />
      <T x={310} y={154} size={10.5} color={C.red}>4 read() block 2 …</T>
      <T x={75} y={176} size={10.5}>5 close()</T>
      <T x={320} y={256} size={10.5}>The client reads each block from the closest DataNode holding a replica; if one fails it moves to the next replica.</T>
      <T x={320} y={274} size={10.5}>Write: create() → NameNode allocates blocks → data is pipelined DataNode 1 → 2 → 3 → acks flow back → close().</T>
    </Svg>
  )
}

export function BdaEtlElt() {
  const id = 'bda-etl'
  const row = (y, title, steps, note) => (
    <g>
      <T x={14} y={y + 26} anchor="start" weight={700} size={13}>{title}</T>
      {steps.map(([t, f], i) => (
        <g key={t}>
          <Box x={80 + i * 140} y={y} w={124} h={44} fill={f} label={t} size={11.5} />
          {i < steps.length - 1 && <Arr id={id} x1={204 + i * 140} y1={y + 22} x2={218 + i * 140} y2={y + 22} />}
        </g>
      ))}
      <T x={360} y={y + 64} size={10.5}>{note}</T>
    </g>
  )
  return (
    <Svg w={640} h={230} id={id} label="ETL extracts, transforms on a staging server, then loads into a warehouse; ELT extracts, loads raw data into the target (data lake), then transforms there">
      {row(14, 'ETL', [['Extract', TINT[1]], ['Transform', TINT[3]], ['Load', TINT[2]], ['Data warehouse', TINT[0]]], 'Transform on a separate staging/ETL server before loading; only clean, structured data is stored.')}
      {row(124, 'ELT', [['Extract', TINT[1]], ['Load', TINT[2]], ['Transform', TINT[3]], ['Data lake / Hadoop', TINT[0]]], 'Load raw data first, then transform inside the target system using its power (Hive, Spark).')}
    </Svg>
  )
}

export function BdaIngestion() {
  const id = 'bda-ing'
  const S = [['Relational DBs', 'MySQL, Oracle'], ['Log files', 'web/server logs'], ['Event streams', 'clickstreams, IoT'], ['Files / APIs', 'CSV, JSON']]
  const T2 = [['Sqoop', 'bulk import/export RDBMS ↔ HDFS'], ['Flume', 'collects and moves log data'], ['Kafka', 'distributed publish–subscribe streaming'], ['NiFi', 'data-flow automation (GUI)']]
  return (
    <Svg w={640} h={250} id={id} label="Data ingestion tools in the Hadoop ecosystem: Sqoop for databases, Flume for logs, Kafka for streams, NiFi for data flows, into HDFS, HBase and Hive">
      {S.map(([t, s], i) => <Box key={t} x={10} y={14 + i * 56} w={150} h={46} fill={TINT[i]} label={t} sub={s} size={12} />)}
      {T2.map(([t, s], i) => (
        <g key={t}>
          <Box x={220} y={14 + i * 56} w={220} h={46} fill="var(--surface)" label={t} sub={s} size={12.5} />
          <Arr id={id} x1={160} y1={37 + i * 56} x2={218} y2={37 + i * 56} />
          <Arr id={id} x1={440} y1={37 + i * 56} x2={496} y2={120} />
        </g>
      ))}
      <Box x={498} y={90} w={132} h={60} fill={TINT[2]} label="HDFS / HBase / Hive" sub="storage layer" size={11.5} />
      <T x={320} y={244} size={10.5}>Batch ingestion (Sqoop) vs real-time streaming ingestion (Flume, Kafka)</T>
    </Svg>
  )
}

// ============================ UNIT III ============================

export function BdaMapReduce() {
  const id = 'bda-mr'
  const inp = ['Deer Bear River', 'Car Car River', 'Deer Car Bear']
  const maps = [['Deer,1', 'Bear,1', 'River,1'], ['Car,1', 'Car,1', 'River,1'], ['Deer,1', 'Car,1', 'Bear,1']]
  const sh = [['Bear', '[1,1]'], ['Car', '[1,1,1]'], ['Deer', '[1,1]'], ['River', '[1,1]']]
  const red = ['Bear, 2', 'Car, 3', 'Deer, 2', 'River, 2']
  const col = (x, title) => <T x={x} y={16} weight={700} size={11.5}>{title}</T>
  return (
    <Svg w={660} h={290} id={id} label="MapReduce word count: input splits, map emits word-1 pairs, shuffle and sort groups by key, reduce sums the counts, output">
      {col(60, 'Input splits')}{col(195, 'Map')}{col(345, 'Shuffle & sort')}{col(480, 'Reduce')}{col(600, 'Output')}
      {inp.map((s, i) => <Box key={s} x={6} y={34 + i * 78} w={108} h={56} fill={TINT[1]} label={s} size={10.5} weight={400} />)}
      {maps.map((m, i) => (
        <g key={i}>
          <rect x={138} y={30 + i * 78} width={114} height={64} rx={6} fill={TINT[2]} stroke={C.line} />
          {m.map((p, k) => <T key={k} x={195} y={48 + i * 78 + k * 17} size={10.5} mono>{p}</T>)}
          <Arr id={id} x1={114} y1={62 + i * 78} x2={136} y2={62 + i * 78} />
        </g>
      ))}
      {sh.map(([k, v], i) => (
        <g key={k}>
          <Box x={282} y={30 + i * 58} w={126} h={42} fill={TINT[3]} label={`${k} → ${v}`} size={10.5} />
          <Arr id={id} x1={408} y1={51 + i * 58} x2={428} y2={51 + i * 58} />
          <Box x={430} y={30 + i * 58} w={100} h={42} fill={TINT[4]} label="sum()" size={10.5} weight={400} />
          <Arr id={id} x1={530} y1={51 + i * 58} x2={548} y2={51 + i * 58} />
          <Box x={550} y={30 + i * 58} w={102} h={42} fill={TINT[0]} label={red[i]} size={11} />
        </g>
      ))}
      <T x={330} y={274} size={10.5}>map(k, v) → list(k′, v′) · shuffle groups all values of a key on one reducer · reduce(k′, list(v′)) → (k′, v″)</T>
    </Svg>
  )
}

export function BdaJoins() {
  const id = 'bda-jn'
  return (
    <Svg w={640} h={250} id={id} label="Map-side join: the small table is loaded into every mapper's memory and joined in the map phase; reduce-side join: mappers tag records by source, the shuffle brings records with the same key together and the reducer joins them">
      <T x={160} y={18} weight={700} size={13}>Map-side join</T>
      <T x={480} y={18} weight={700} size={13}>Reduce-side join</T>
      <Box x={20} y={34} w={130} h={40} fill={TINT[1]} label="Large table split" size={11} />
      <Box x={170} y={34} w={130} h={40} fill={TINT[3]} label="Small table" sub="distributed cache" size={11} />
      <Arr id={id} x1={85} y1={74} x2={140} y2={110} /><Arr id={id} x1={235} y1={74} x2={180} y2={110} />
      <Box x={70} y={112} w={180} h={44} fill={TINT[2]} label="Mapper joins in memory" size={11.5} />
      <Arr id={id} x1={160} y1={156} x2={160} y2={180} />
      <Box x={90} y={182} w={140} h={34} fill={TINT[0]} label="Joined output" size={11} />
      <line x1={320} y1={30} x2={320} y2={230} stroke={C.line} strokeDasharray="4 4" />
      <Box x={340} y={34} w={130} h={40} fill={TINT[1]} label="Table A" sub="mapper tags 'A'" size={11} />
      <Box x={490} y={34} w={130} h={40} fill={TINT[3]} label="Table B" sub="mapper tags 'B'" size={11} />
      <Arr id={id} x1={405} y1={74} x2={460} y2={110} /><Arr id={id} x1={555} y1={74} x2={500} y2={110} />
      <Box x={390} y={112} w={180} h={44} fill={TINT[4]} label="Shuffle and sort by join key" size={11} />
      <Arr id={id} x1={480} y1={156} x2={480} y2={180} />
      <Box x={400} y={182} w={160} h={34} fill={TINT[2]} label="Reducer joins A × B" size={11} />
      <T x={160} y={240} size={10}>fast, no shuffle; needs one small table</T>
      <T x={480} y={240} size={10}>works for any sizes; costly shuffle</T>
    </Svg>
  )
}

export function BdaSecondarySort() {
  const id = 'bda-ss'
  return (
    <Svg w={640} h={250} id={id} label="Secondary sort: a composite key of natural key and value, a partitioner and grouping comparator on the natural key, and a sort comparator on both so reducer values arrive sorted">
      <Box x={10} y={20} w={170} h={64} fill={TINT[1]} label="Map output" sub="(year, temp) as composite key" size={12} />
      <Arr id={id} x1={180} y1={52} x2={214} y2={52} />
      <Box x={216} y={20} w={190} h={64} fill={TINT[3]} label="Partitioner" sub="hash of year only" size={12} />
      <Arr id={id} x1={406} y1={52} x2={440} y2={52} />
      <Box x={442} y={20} w={188} h={64} fill={TINT[2]} label="Sort comparator" sub="year asc, temp desc" size={12} />
      <Arr id={id} x1={536} y1={84} x2={536} y2={112} />
      <Box x={442} y={114} w={188} h={58} fill={TINT[4]} label="Grouping comparator" sub="groups by year only" size={12} />
      <Arr id={id} x1={442} y1={143} x2={300} y2={143} />
      <Box x={60} y={114} w={238} h={58} fill={TINT[0]} label="reduce(1950, [42, 35, 22, 0])" sub="values arrive already sorted" size={12} />
      <T x={320} y={204} size={10.5}>Goal: sort the values for each key (not just the keys) without sorting in the reducer's memory.</T>
      <T x={320} y={222} size={10.5}>Example: maximum temperature per year = the first value of each group.</T>
    </Svg>
  )
}
