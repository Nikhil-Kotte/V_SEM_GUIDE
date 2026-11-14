// Big Data Analytics, Unit II (Hadoop ecosystem) and the MapReduce half of Unit III. Keys are syllabus ids.
export default {
  'bda.u2.need-hadoop': {
    oneLine: 'Hadoop is needed because one machine cannot store or process big data; Hadoop spreads both storage and processing across many cheap machines and survives their failures.',
    blocks: [
      { compare: [
        { title: 'Problem with one big server', items: ['Disk too small, too slow to read terabytes', 'Very expensive to scale up', 'One failure stops everything'] },
        { title: 'What Hadoop does', items: ['Splits data across many machines (HDFS)', 'Runs processing where the data is (MapReduce)', 'Copies data so failures do not lose it'] },
      ] },
      'Reading 1 TB from one disk at 100 MB/s takes about 3 hours; spread over 100 disks reading in parallel, it takes under 2 minutes.',
      { h: 'The Hadoop stack' },
      { stack: ['Tools: Hive, Pig, HBase, Sqoop, Flume, Oozie, ZooKeeper', 'Processing: MapReduce (and Spark)', 'Resource management: YARN', 'Storage: HDFS'], label: 'Hadoop ecosystem, top to bottom' },
    ],
    terms: [['Hadoop', 'An open-source framework for distributed storage and processing of big data on clusters.'], ['Commodity hardware', 'Cheap, standard computers rather than specialised servers.']],
    exam: 'Explain why one server is not enough, how Hadoop solves it, and draw the Hadoop stack with its main tools.',
    revise: ['Distribute storage and processing', 'HDFS, YARN, MapReduce + tools'],
  },

  'bda.u2.design-principles': {
    oneLine: 'Hadoop is built on a few principles: move computation to the data, scale out with cheap machines, expect failures and replicate, write once and read many times.',
    blocks: [
      { ul: [
        '**Data locality**: send the small program to where the big data is, not the data to the program.',
        '**Scale out**: add more commodity machines instead of buying a bigger one.',
        '**Fault tolerance**: hardware fails often at scale, so data is replicated (default 3 copies) and failed tasks are re-run elsewhere.',
        '**Write once, read many**: files are written once and then read many times; no random updates.',
        '**Simple programming model**: developers write map and reduce functions; the framework handles distribution.',
        '**Large blocks**: files are split into big blocks (128 MB) to reduce overhead.',
      ] },
    ],
    terms: [['Data locality', 'Running computation on the node where the data is stored.'], ['Replication factor', 'How many copies of each block HDFS keeps (default 3).']],
    exam: 'List and explain the design principles with one line each.',
    revise: ['Data locality, scale out, fault tolerance, write once read many'],
  },

  'bda.u2.vs-rdbms': {
    oneLine: 'An RDBMS suits structured data with frequent updates and fast queries; Hadoop suits huge volumes of any data, written once and analysed in large batches.',
    blocks: [
      { table: { head: ['', 'RDBMS / SQL', 'Hadoop'], rows: [
        ['Data', 'Structured', 'Structured, semi-structured, unstructured'],
        ['Schema', 'On write (fixed before loading)', 'On read'],
        ['Size', 'Gigabytes to a few terabytes', 'Terabytes to petabytes'],
        ['Scaling', 'Vertical', 'Horizontal'],
        ['Updates', 'Read and write many times', 'Write once, read many'],
        ['Speed', 'Fast interactive queries', 'High throughput batch'],
        ['Cost', 'Licensed, special hardware', 'Open source, commodity hardware'],
      ] } },
      { h: 'HDFS vs a traditional file system' },
      { table: { head: ['', 'Traditional FS', 'HDFS'], rows: [['Location', 'One machine', 'Spread over a cluster'], ['Block size', 'About 4 KB', '128 MB'], ['Failure', 'Disk failure loses data', 'Replicas survive failures'], ['Access', 'Random read and write', 'Sequential, streaming reads']] } },
    ],
    terms: [['Schema on write', 'Data must match a fixed structure before it is stored.'], ['Throughput', 'Amount of data processed per unit time.']],
    exam: 'Give the RDBMS vs Hadoop table, and the HDFS vs traditional file system table if asked.',
    revise: ['RDBMS: structured, updates, fast queries', 'Hadoop: any data, batch, scale out'],
  },

  'bda.u2.core-components': {
    oneLine: 'Hadoop\'s core is HDFS for storage, YARN for resource management, MapReduce for processing and Hadoop Common for shared libraries.',
    blocks: [
      { tree: { root: 'Hadoop core', kids: ['HDFS: distributed storage', 'YARN: resource management and scheduling', 'MapReduce: distributed processing', 'Hadoop Common: shared utilities'] } },
      { h: 'HDFS components' },
      { table: { head: ['Component', 'Role'], rows: [
        ['NameNode (master)', 'Keeps the namespace and metadata: which blocks make up each file and where they are'],
        ['DataNode (worker)', 'Stores the actual blocks, sends heartbeats and block reports'],
        ['Secondary NameNode', 'Merges the edit log into the fsimage periodically (a checkpoint, not a hot backup)'],
      ] } },
      { h: 'HDFS federation' },
      'One NameNode limits how many files a cluster can hold. **Federation** uses several independent NameNodes, each managing part of the namespace, sharing the same DataNodes.',
    ],
    terms: [['NameNode', 'The master that stores HDFS metadata.'], ['DataNode', 'A worker that stores HDFS blocks.'], ['fsimage', 'A snapshot of the HDFS namespace.']],
    exam: 'List the four core components with one line each, then explain NameNode, DataNode and Secondary NameNode.',
    revise: ['HDFS, YARN, MapReduce, Common', 'NameNode = metadata; DataNode = blocks'],
  },

  'bda.u2.architecture': {
    oneLine: 'Hadoop uses a master-worker architecture: the NameNode and ResourceManager are masters, while each worker node runs a DataNode (storage) and a NodeManager (processing).',
    blocks: [
      { stack: ['Master: NameNode (HDFS) + ResourceManager (YARN)', 'Worker 1: DataNode + NodeManager', 'Worker 2: DataNode + NodeManager', 'Worker n: DataNode + NodeManager'], label: 'Hadoop cluster' },
      { h: 'HDFS architecture' },
      { ul: ['Files are split into **128 MB blocks**.', 'Each block is **replicated** (default 3) on different DataNodes, ideally on different racks (**rack awareness**).', 'Clients ask the NameNode **where** blocks are, then read and write data **directly** with DataNodes.', 'DataNodes send heartbeats every 3 seconds; if one goes silent, its blocks are re-replicated.'] },
      { h: 'Block replication (fault tolerance)' },
      'Default placement: first replica on the writer\'s node, second on a node in a different rack, third on another node in that second rack. A rack failure then cannot destroy all copies.',
    ],
    terms: [['Rack awareness', 'Placing replicas on different racks to survive a rack failure.'], ['Heartbeat', 'A periodic "I am alive" message from a DataNode to the NameNode.']],
    exam: 'Draw the master-worker cluster and the HDFS architecture (client, NameNode, DataNodes, replicated blocks), and explain replica placement.',
    revise: ['128 MB blocks, 3 replicas', 'Rack-aware placement', 'Client gets locations from NameNode, data from DataNodes'],
  },

  'bda.u2.h1-vs-h2': {
    oneLine: 'Hadoop 2 split Hadoop 1\'s overloaded JobTracker into YARN (ResourceManager plus per-application ApplicationMaster), removing the bottleneck and letting engines other than MapReduce run.',
    blocks: [
      { table: { head: ['', 'Hadoop 1', 'Hadoop 2'], rows: [
        ['Components', 'HDFS + MapReduce', 'HDFS + YARN + MapReduce'],
        ['Resource management', 'JobTracker (also schedules tasks)', 'ResourceManager + ApplicationMaster'],
        ['Workers', 'TaskTracker with fixed map/reduce slots', 'NodeManager with flexible containers'],
        ['Engines', 'MapReduce only', 'MapReduce, Spark, Tez, others'],
        ['Scalability', 'About 4,000 nodes', '10,000+ nodes'],
        ['NameNode', 'Single point of failure', 'High availability (standby NameNode), federation'],
      ] } },
    ],
    terms: [['JobTracker', 'The Hadoop 1 master that managed resources and tracked jobs.'], ['Container', 'A YARN bundle of CPU and memory on a node.']],
    exam: 'Give the Hadoop 1 vs Hadoop 2 table and explain why YARN was introduced.',
    revise: ['H1: JobTracker, slots, MR only', 'H2: YARN, containers, many engines, HA'],
  },

  'bda.u2.hdfs-ops': {
    oneLine: 'HDFS operations are file read and write (the client talks to the NameNode for locations and to DataNodes for data) and shell commands such as hdfs dfs -put, -get, -ls and -cat.',
    blocks: [
      { h: 'Anatomy of a file write' },
      { flow: ['Client asks NameNode to create the file', 'NameNode checks permissions, picks DataNodes', 'Client streams the block to DataNode 1', 'DN1 forwards to DN2, DN2 to DN3 (pipeline)', 'ACKs flow back', 'Client tells NameNode the file is complete'] },
      { h: 'Anatomy of a file read' },
      { flow: ['Client asks NameNode for block locations', 'NameNode returns DataNodes, nearest first', 'Client reads each block directly from the nearest DataNode', 'If a DataNode fails, read from another replica'] },
      { h: 'Common commands' },
      { table: { head: ['Command', 'Does'], rows: [
        ['hdfs dfs -ls /data', 'List files'],
        ['hdfs dfs -mkdir /data/in', 'Make a directory'],
        ['hdfs dfs -put local.txt /data/in', 'Copy from local to HDFS'],
        ['hdfs dfs -get /data/out/part-r-00000 .', 'Copy from HDFS to local'],
        ['hdfs dfs -cat /data/in/local.txt', 'Print a file'],
        ['hdfs dfs -rm /data/in/local.txt', 'Delete a file'],
        ['hdfs dfs -touchz /data/empty.txt', 'Create an empty (zero-length) file'],
        ['hdfs dfs -setrep 2 /data/in/local.txt', 'Change the replication factor'],
      ] } },
    ],
    terms: [['Write pipeline', 'DataNodes forward a block to each other to make the replicas.'], ['touchz', 'HDFS command that creates a zero-length file.']],
    exam: 'Draw the read and write data flows step by step, then list five HDFS commands with syntax and purpose.',
    revise: ['Write: NameNode picks nodes, pipeline of DataNodes', 'Read: locations from NameNode, data from nearest DataNode', '-put, -get, -ls, -cat, -rm, -touchz'],
  },

  'bda.u2.ingestion-layer': {
    oneLine: 'The data ingestion layer brings data from source systems into the big data platform, handling different formats, speeds and volumes reliably.',
    blocks: [
      { flow: ['Sources (DBs, logs, sensors, APIs)', 'Ingestion layer (collect, validate, route)', 'Storage (HDFS, HBase, data lake)', 'Processing'] },
      { ul: ['**Collects** data from many sources.', '**Validates** and lightly cleans it.', '**Buffers** bursts so the storage is not overwhelmed.', '**Routes** each stream to the right destination.', 'Must be scalable, fault tolerant and secure.'] },
    ],
    terms: [['Data ingestion', 'Importing data from sources into a storage or processing system.']],
    exam: 'Define the ingestion layer, draw where it sits, and list its responsibilities.',
    revise: ['Collect, validate, buffer, route'],
  },

  'bda.u2.etl-elt': {
    oneLine: 'ETL transforms data before loading it into the warehouse; ELT loads raw data first and transforms it inside the big data platform, which suits huge, varied data.',
    blocks: [
      { compare: [
        { title: 'ETL', items: ['Extract → Transform → Load', 'Transform on a separate server', 'Only clean, structured data stored', 'Classic data warehouses'] },
        { title: 'ELT', items: ['Extract → Load → Transform', 'Transform inside the target (Hadoop, cloud)', 'Raw data kept for later use', 'Data lakes, big data'] },
      ] },
      { flow: ['Extract from sources', 'Load raw into HDFS / data lake', 'Transform with Hive, Spark when needed'], label: 'ELT' },
    ],
    terms: [['ETL', 'Extract, transform, load.'], ['ELT', 'Extract, load, transform.']],
    exam: 'Explain ETL and ELT with a flow each and a comparison table, and say why ELT suits big data.',
    revise: ['ETL: transform first', 'ELT: load first, transform later'],
  },

  'bda.u2.ingestion-tools': {
    oneLine: 'Hadoop ingestion tools: Sqoop moves data between relational databases and HDFS, Flume collects log and event streams, and Kafka is a distributed message queue for real-time streams.',
    blocks: [
      { table: { head: ['Tool', 'Moves', 'Example'], rows: [
        ['Sqoop', 'Bulk data between RDBMS and HDFS/Hive (both ways)', 'sqoop import --connect jdbc:mysql://db/shop --table orders --target-dir /data/orders'],
        ['Flume', 'Streaming logs and events into HDFS (source → channel → sink)', 'Web server logs into HDFS every minute'],
        ['Kafka', 'High-throughput publish-subscribe streams (topics, producers, consumers)', 'Clickstream events to Spark Streaming'],
        ['NiFi', 'Visual data-flow automation between systems', 'Route sensor data to different stores'],
      ] } },
      { flow: ['Flume source (log)', 'Channel (memory / file)', 'Sink (HDFS)'], label: 'Flume agent' },
    ],
    terms: [['Sqoop', 'Tool for bulk transfer between relational databases and Hadoop.'], ['Flume', 'Tool for collecting and moving large volumes of log data.'], ['Kafka', 'A distributed publish-subscribe messaging system.']],
    exam: 'Explain Sqoop, Flume and Kafka with what each moves and a one-line example, and draw a Flume agent.',
    revise: ['Sqoop: RDBMS ↔ HDFS', 'Flume: logs', 'Kafka: real-time streams'],
  },

  'bda.u2.ingestion-types': {
    oneLine: 'Data is ingested in batches (periodically, in bulk), in real time (continuously as it arrives), or with a lambda architecture that combines both.',
    blocks: [
      { table: { head: ['Type', 'How', 'Use', 'Tools'], rows: [
        ['Batch', 'Large chunks at set intervals', 'Daily sales reports', 'Sqoop, scheduled jobs'],
        ['Real-time (streaming)', 'Each event as it happens', 'Fraud alerts, live dashboards', 'Kafka, Flume, Spark Streaming'],
        ['Micro-batch', 'Very small batches every few seconds', 'Near-real-time metrics', 'Spark Streaming'],
        ['Lambda', 'Batch layer + speed layer, merged in a serving layer', 'Accurate history plus fresh data', 'Hadoop + Kafka/Storm'],
      ] } },
    ],
    terms: [['Batch ingestion', 'Loading data in large groups at intervals.'], ['Streaming ingestion', 'Loading each record as soon as it is produced.'], ['Lambda architecture', 'Combining a batch layer and a real-time layer.']],
    exam: 'Explain batch, real-time and lambda ingestion with uses and tools.',
    revise: ['Batch, streaming, micro-batch, lambda'],
  },

  'bda.u3.mapreduce-intro': {
    oneLine: 'MapReduce is Hadoop\'s programming model: map turns input records into key-value pairs, the framework shuffles and sorts them by key, and reduce combines the values for each key.',
    blocks: [
      { flow: ['Input splits', 'Map: (k1, v1) → list(k2, v2)', 'Shuffle and sort: group by key', 'Reduce: (k2, list(v2)) → (k3, v3)', 'Output'] },
      { h: 'Architecture (Hadoop 2)' },
      { ul: ['The client submits a job to the **ResourceManager**.', 'An **ApplicationMaster** is started for the job; it asks for containers.', 'Map tasks run on NodeManagers near their data (data locality); reduce tasks pull map outputs.', 'An optional **combiner** does a mini-reduce on each mapper\'s output to cut network traffic.', 'A **partitioner** decides which reducer each key goes to (default: hash of key mod number of reducers).'] },
      { tip: 'The cat command (asked): a map-only job with an identity mapper just copies input to output, like cat; adding a reducer that groups by key is like SQL\'s GROUP BY, and joining two inputs on a key is like SQL\'s JOIN.' },
    ],
    terms: [['Map', 'The function that turns each input record into key-value pairs.'], ['Reduce', 'The function that combines all values for a key.'], ['Shuffle', 'Moving and grouping map outputs by key for the reducers.'], ['Partitioner', 'Decides which reducer receives each key.']],
    exam: 'Define MapReduce, draw the map, shuffle and sort, reduce flow, and explain the roles of combiner and partitioner.',
    revise: ['Map → shuffle/sort → reduce', 'Combiner = local reduce', 'Partitioner = hash(key) mod R'],
  },

  'bda.u3.mapreduce-processing': {
    oneLine: 'Processing data with MapReduce means writing a mapper, a reducer and a driver, packaging them as a JAR and running the job on HDFS input; word count is the standard example.',
    blocks: [
      { h: 'Word count' },
      { flow: ['Input: "deer bear river" / "car car river"', 'Map: (deer,1) (bear,1) (river,1) (car,1) (car,1) (river,1)', 'Shuffle: bear [1], car [1,1], deer [1], river [1,1]', 'Reduce: bear 1, car 2, deer 1, river 2'] },
      { code: "public void map(LongWritable key, Text value, Context ctx) {\n  for (String w : value.toString().split(\"\\\\s+\"))\n    ctx.write(new Text(w), new IntWritable(1));\n}\npublic void reduce(Text key, Iterable<IntWritable> vals, Context ctx) {\n  int sum = 0;\n  for (IntWritable v : vals) sum += v.get();\n  ctx.write(key, new IntWritable(sum));\n}" },
      { h: 'Steps to develop and run a MapReduce application' },
      { steps: ['Write the Mapper, Reducer and Driver classes.', 'Test locally on small data (local mode).', 'Package into a JAR.', 'Put the input in HDFS: hdfs dfs -put input.txt /in', 'Run: hadoop jar wc.jar WordCount /in /out', 'Check the output: hdfs dfs -cat /out/part-r-00000', 'Tune (combiner, number of reducers) and monitor with the web UI.'] },
      'A job is the whole program; it is split into **tasks** (map tasks and reduce tasks) that run in parallel. Streaming lets mappers and reducers be scripts (Python) instead of Java.',
      { h: 'Failures in MapReduce' },
      { ul: ['**Task failure**: a task crashes or hangs; it is retried (up to 4 times) on another node.', '**Node (NodeManager) failure**: its tasks are rescheduled elsewhere.', '**ApplicationMaster failure**: restarted by the ResourceManager.', '**ResourceManager failure**: high availability with a standby.'] },
    ],
    terms: [['Driver', 'The class that configures and submits the MapReduce job.'], ['Job', 'A complete MapReduce program run.'], ['Task', 'One map or reduce unit of work within a job.']],
    exam: 'Trace word count through map, shuffle and reduce with a small input, show the mapper and reducer code, list the development steps, and list the failure types.',
    revise: ['Mapper, reducer, driver, JAR, hadoop jar', 'Job → map and reduce tasks', 'Failures: task, node, AM, RM'],
  },

  'bda.u3.io-formats': {
    oneLine: 'Input formats decide how files are split and read into key-value records (TextInputFormat, KeyValueTextInputFormat, SequenceFileInputFormat); output formats decide how results are written.',
    blocks: [
      { table: { head: ['Input format', 'Key', 'Value'], rows: [
        ['TextInputFormat (default)', 'Byte offset of the line', 'The line'],
        ['KeyValueTextInputFormat', 'Text before the tab', 'Text after the tab'],
        ['NLineInputFormat', 'Byte offset', 'Line; each split has N lines'],
        ['SequenceFileInputFormat', 'Stored key', 'Stored value (binary)'],
        ['DBInputFormat', 'Record id', 'Row from a database'],
      ] } },
      { ul: ['Output formats: TextOutputFormat (default, key TAB value), SequenceFileOutputFormat, MultipleOutputs, DBOutputFormat.', 'MapReduce **types**: keys and values use Writable classes (Text, IntWritable, LongWritable).'] },
      { h: 'Input splits' },
      'An **input split** is the chunk of input one map task processes (usually one HDFS block, 128 MB). The **RecordReader** turns a split into records; a line that crosses a block boundary is read completely by the split where it starts.',
    ],
    terms: [['InputFormat', 'Defines how input is split and read into records.'], ['Input split', 'The logical chunk of data for one mapper.'], ['RecordReader', 'Turns a split into key-value records.']],
    exam: 'List the input formats with their key and value, the output formats, and explain input splits and RecordReader.',
    revise: ['TextInputFormat: (offset, line)', 'Split ≈ block; one mapper per split'],
  },

  'bda.u3.joins': {
    oneLine: 'A map-side join joins datasets inside the mappers (fast, but needs sorted, partitioned inputs or one small table in memory); a reduce-side join tags records in the mappers and joins them in the reducers (general but slower).',
    blocks: [
      { compare: [
        { title: 'Map-side join', items: ['Join happens in the mapper', 'One table small enough to cache in memory (distributed cache), or both sorted and partitioned the same way', 'No shuffle needed, so fast'] },
        { title: 'Reduce-side join', items: ['Mappers emit (join key, tagged record)', 'Shuffle brings matching keys to the same reducer', 'Reducer combines records from both sources', 'Works for any size, but shuffles a lot of data'] },
      ] },
      { flow: ['Customers: (101, Ravi)', 'Orders: (101, Book)', 'Map: emit key 101 with tag', 'Reduce: 101 → Ravi, Book'], label: 'Reduce-side join' },
    ],
    terms: [['Map-side join', 'Joining in the map phase without a shuffle.'], ['Reduce-side join', 'Joining in the reducers after the shuffle groups matching keys.'], ['Distributed cache', 'A way to copy small files to every node for tasks to use.']],
    exam: 'Explain both joins with a customers and orders example, and compare their requirements and speed.',
    revise: ['Map-side: small table cached, fast', 'Reduce-side: tag, shuffle, join; general'],
  },

  'bda.u3.secondary-sort': {
    oneLine: 'Secondary sorting makes the values for each key reach the reducer in a chosen order, by putting part of the value into a composite key and using a custom partitioner and grouping comparator.',
    blocks: [
      'MapReduce sorts by key, but the **values** for a key arrive in no particular order. To get them sorted (e.g. temperatures per year in order):',
      { steps: ['Make a **composite key** (natural key + the value to sort on), e.g. (year, temperature).', 'Use a **custom partitioner** on the natural key only, so all records of a year go to one reducer.', 'Use a **sort comparator** that orders by year, then temperature.', 'Use a **grouping comparator** on the natural key, so one reduce call sees the whole year with values in order.'] },
      'Example: finding the maximum temperature per year becomes trivial: the first value each reducer call sees is the highest.',
    ],
    terms: [['Secondary sort', 'Sorting the values for each key, not just the keys.'], ['Composite key', 'A key made of the natural key plus a sort field.'], ['Grouping comparator', 'Decides which keys are grouped into one reduce call.']],
    exam: 'Explain why values are unsorted, then the four steps (composite key, partitioner, sort comparator, grouping comparator) with the temperature example.',
    revise: ['Composite key + partitioner + sort comparator + grouping comparator'],
  },

  'bda.u3.pipelining': {
    oneLine: 'Complex processing is split into a chain of MapReduce jobs, where each job\'s output in HDFS is the next job\'s input; tools like JobControl and Oozie manage the chain.',
    blocks: [
      { flow: ['Job 1: clean the logs', 'HDFS', 'Job 2: count visits per page', 'HDFS', 'Job 3: find the top 10 pages'] },
      { ul: ['**ChainMapper / ChainReducer**: several mappers run one after another inside one job (map+ / reduce / map*).', '**JobControl**: runs jobs in order of their dependencies.', '**Apache Oozie**: a workflow scheduler for Hadoop jobs defined as a DAG.', 'Drawback: every job writes to and reads from disk, which is slow; Spark keeps intermediate data in memory instead.'] },
    ],
    terms: [['Job chaining', 'Running several MapReduce jobs in sequence.'], ['Oozie', 'A workflow scheduler for Hadoop jobs.'], ['ChainMapper', 'Runs several mapper classes in one map task.']],
    exam: 'Explain why jobs are pipelined, draw a three-job chain, and name ChainMapper, JobControl and Oozie.',
    revise: ['Output of one job = input of the next', 'ChainMapper, JobControl, Oozie'],
  },
}
