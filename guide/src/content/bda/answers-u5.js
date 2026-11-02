// BDA Unit V model answers (Apache Spark). Keyed by PYQ id.
const U5 = 'BDA Unit-5 slides (Unit-5.pptx)'
const NB = 'Big_Data_Analytics_PySpark.ipynb'

const PYSPARK_PROGRAM = `from pyspark import SparkContext
sc = SparkContext("local[*]", "MarksAnalysis")

# each line: roll,name,subject,score
lines  = sc.textFile("marks.csv")                                 # create RDD
recs   = lines.map(lambda l: l.split(","))                        # transformation
valid  = recs.filter(lambda r: r[3].isdigit())                    # transformation
by_sub = valid.map(lambda r: (r[2], (int(r[3]), 1)))              # transformation
sums   = by_sub.reduceByKey(lambda a, b: (a[0]+b[0], a[1]+b[1]))  # transformation (wide)
avgs   = sums.mapValues(lambda s: round(s[0] / s[1], 2))          # transformation
names  = valid.map(lambda r: r[1]).distinct()                     # transformation

print(avgs.collect())                    # action -> [('OS', 71.5), ('CN', 64.2), ...]
print("records:", valid.count())         # action
print("students:", names.count())        # action
print(avgs.sortBy(lambda x: x[1]).first())   # action: hardest subject
avgs.saveAsTextFile("out/subject_avg")   # action
sc.stop()`

const CASE_STUDY = `from pyspark import SparkContext
sc = SparkContext("local[*]", "StudentAcademics")

# roll,name,dept,semester,subject,marks
rows = sc.textFile("students_marks.csv") \\
         .map(lambda l: l.split(",")) \\
         .filter(lambda r: r[5].isdigit()) \\
         .map(lambda r: (r[0], r[1], r[2], int(r[3]), r[4], int(r[5])))
rows.cache()                                   # reused by several analyses

# 1. subject difficulty: average and fail % per subject
subj = rows.map(lambda r: (r[4], (r[5], 1, 1 if r[5] < 40 else 0))) \\
           .reduceByKey(lambda a, b: (a[0]+b[0], a[1]+b[1], a[2]+b[2])) \\
           .mapValues(lambda t: (round(t[0]/t[1], 1), round(100*t[2]/t[1], 1)))
print(subj.sortBy(lambda x: x[1][0]).collect())    # hardest subject first

# 2. trend: average marks per semester
trend = rows.map(lambda r: (r[3], (r[5], 1))) \\
            .reduceByKey(lambda a, b: (a[0]+b[0], a[1]+b[1])) \\
            .mapValues(lambda t: round(t[0]/t[1], 1)).sortByKey()
print(trend.collect())

# 3. top performers: total marks per student, top 10
top = rows.map(lambda r: ((r[0], r[1]), r[5])) \\
          .reduceByKey(lambda a, b: a + b) \\
          .takeOrdered(10, key=lambda x: -x[1])
print(top)`

export default {
  'bda-spark-what': {
    blocks: [
      '**Apache Spark** is an open-source, **distributed, general-purpose cluster-computing framework** for fast processing of large-scale data. It was developed at UC Berkeley\'s AMPLab (2009) and is now maintained by the Apache Software Foundation.',
      'Its key idea is **in-memory computation**: intermediate data is kept in RAM across the cluster instead of being written to disk after every step (as in MapReduce), which makes it 10–100× faster for iterative and interactive work.',
      { h: 'Features' },
      { ul: ['High-speed, **in-memory** processing.', '**Fault tolerance** through RDD lineage.', '**Distributed** processing across hundreds or thousands of nodes.', '**Polyglot**: APIs in Scala, Java, Python (PySpark) and R.', 'One engine for **batch, streaming, SQL-style queries, machine learning and graph processing** (built-in libraries).', 'Easy integration with Hadoop: reads HDFS, runs on YARN.', 'Lazy evaluation with DAG-based optimisation.'] },
      'Applications: big data analytics, machine learning, real-time data processing, financial and healthcare analytics, social-media analytics.',
    ],
    sources: [`${U5} slides 3–6`],
  },

  'bda-spark-vs-mr': {
    blocks: [
      'Apache Spark is a fast, in-memory, general-purpose cluster computing engine (see "What is Apache Spark"). It differs from Hadoop MapReduce as follows:',
      { table: { head: ['Basis', 'MapReduce', 'Spark'], rows: [
        ['Processing', 'Disk-based: writes intermediate results to HDFS after each map and reduce', 'In-memory: keeps intermediate data in RAM'],
        ['Speed', 'Slower', 'Up to 100× faster in memory, ~10× on disk'],
        ['Programming model', 'Only map and reduce; complex jobs need chains of jobs', 'Rich operators (map, filter, join, groupByKey…) in one program'],
        ['Execution', 'Each job is a fixed map → shuffle → reduce', 'Optimised DAG of stages; narrow operations pipelined'],
        ['Iterative algorithms', 'Re-read data from disk every iteration', 'Cache data and reuse it'],
        ['Interactive use', 'No', 'Yes (spark-shell, pyspark)'],
        ['Workloads', 'Batch only', 'Batch, streaming, interactive, ML, graph'],
        ['Ease of use', 'Verbose Java', 'Concise Scala/Python/Java/R'],
        ['Fault tolerance', 'Replication on disk, task re-execution', 'RDD lineage recomputation'],
        ['Hardware', 'Cheap: works with less RAM', 'Needs more memory'],
      ] } },
      { h: 'Three key performance aspects' },
      { ol: ['**Disk I/O**: MapReduce writes intermediate output to disk between every step; Spark keeps it in memory, removing most I/O.', '**Iterative and interactive processing**: ML algorithms and repeated queries read the same data many times; MapReduce reloads it each iteration, Spark **caches** it.', '**Execution planning**: MapReduce launches a separate job per map–reduce pair (with JVM start-up costs); Spark builds one **DAG**, pipelines narrow transformations within a stage, and reuses executors.'] },
    ],
    sources: [`${U5} slides 3–10`],
  },

  'bda-spark-future': {
    blocks: [
      { h: 'Present' },
      { ul: ['Spark is the **most widely used big-data processing engine**: used by companies like Netflix, Uber, Amazon, Alibaba and most banks, and offered as a managed service by all major clouds (AWS EMR, Azure, Google Dataproc, Databricks).', 'It is a **unified engine** for batch ETL, interactive queries, streaming, machine learning and graph processing.', 'Modern Spark (3.x) centres on **DataFrames/Datasets** with the Catalyst optimiser and Tungsten execution engine, while **RDDs** remain the core abstraction underneath.', 'Runs on YARN, Kubernetes, Mesos or standalone, and reads HDFS, S3, Cassandra, HBase and many formats (Parquet, ORC, JSON).', 'Python (PySpark) is now its most popular API.'] },
      { h: 'Future' },
      { ul: ['**Cloud-native and Kubernetes** deployment, serverless Spark.', '**Lakehouse** architectures (Delta Lake, Iceberg) combining data lakes and warehouses with ACID tables.', 'Deeper **AI/ML integration**: GPU acceleration, distributed deep learning, feature engineering for large models.', '**Real-time** structured streaming with lower latency.', 'Better performance: adaptive query execution, vectorised and native execution engines.', 'Simpler APIs (pandas API on Spark, Spark Connect for remote clients).'] },
    ],
    sources: [`${U5} slides 3–9`, 'Standard textbook coverage, not in your notes'],
  },

  'bda-spark-benefits': {
    blocks: [
      { h: 'Benefits' },
      { ol: ['**High processing speed**: in-memory computation, 10–100× faster than MapReduce.', '**Easy programming**: high-level APIs in Scala, Java, Python and R; interactive shells.', '**Unified engine**: batch, interactive queries, streaming, machine learning and graph processing in one framework.', '**Fault tolerance**: lost partitions are recomputed from lineage, without replicating data.', '**Iterative algorithms** run efficiently because data can be cached.', '**Scalability**: from a laptop to thousands of nodes.', '**Hadoop compatibility**: reads HDFS, runs on YARN, works with Hive tables.', '**Lazy evaluation + DAG optimisation** reduce unnecessary work.'] },
      { h: 'Challenges' },
      { ol: ['**Requires a lot of RAM** → higher hardware cost; memory pressure causes spills and garbage-collection pauses.', '**No storage system of its own**: depends on HDFS, S3 etc.', '**Complex tuning**: partitions, memory, executors, caching and shuffles must be configured by hand for good performance.', '**Not efficient for small datasets**: cluster overhead outweighs the benefit.', '**Complex cluster management**.', '**Streaming is micro-batch** by default (some latency).', '**Small-files problem** and expensive shuffles for wide operations.'] },
    ],
    sources: [`${U5} slides 9–10`],
  },

  'bda-spark-components': {
    blocks: [
      'The **Spark framework** (ecosystem) has a core engine with libraries built on top, and runtime components that execute applications.',
      { h: 'Framework components (stack)' },
      { ul: ['**Spark Core**: the base engine: RDDs, task scheduling, memory management, fault recovery, interaction with storage. Everything else is built on it.', '**Structured data / SQL-style queries**: DataFrames and SQL queries over structured data, with the Catalyst optimiser.', '**Streaming**: processing live data streams in small batches (structured streaming).', '**Machine learning library**: scalable algorithms for classification, regression, clustering, recommendation.', '**Graph processing library**: graph computations such as PageRank.', '**Cluster managers**: standalone, YARN, Mesos, Kubernetes.', '**Storage**: HDFS, S3, Cassandra, HBase, local files.'] },
      { h: 'Runtime components' },
      { img: 'bda-spark-arch' },
      { ul: ['**Driver program** with **SparkContext**: runs main(), builds the DAG, schedules tasks.', '**Cluster manager**: allocates resources.', '**Worker nodes** running **executors**: run tasks, cache data, return results.', '**Tasks**: units of work on one partition.'] },
    ],
    sources: [`${U5} slides 5, 11–17`],
  },

  'bda-spark-arch': {
    blocks: [
      'Apache Spark uses a **master–worker architecture**: a **driver program** manages the execution of tasks across a cluster of **worker nodes**. It relies on two main abstractions: **RDDs** (data) and **DAGs** (computation).',
      { img: 'bda-spark-arch' },
      { h: 'Components' },
      { ul: [
        '**Driver program**: the central coordinator. Contains the **SparkContext** (entry point to Spark), translates the application\'s logical plan into a physical execution plan (DAG → stages → tasks), coordinates with the cluster manager, schedules tasks on executors and monitors the job.',
        '**Cluster manager**: allocates resources (CPU, memory) across the cluster. Spark can use its **standalone** manager, **YARN**, **Mesos** or **Kubernetes**.',
        '**Worker nodes**: machines in the cluster where executors run; each can host several executors.',
        '**Executors**: worker processes that **run the tasks** assigned by the driver, **store cached data** in memory or on disk, handle shuffles and **report results** back to the driver. They live for the whole application.',
        '**Tasks**: the smallest unit of work: one task per partition per stage.',
      ] },
      { h: 'Layered view' },
      'Storage (HDFS, S3…) → resource management (YARN, standalone, Kubernetes) → **Spark Core** (RDDs, DAG scheduler, task scheduler, memory, fault tolerance) → libraries (structured queries, streaming, ML, graph) → APIs (Scala, Java, Python, R).',
      { h: 'Execution flow' },
      { steps: ['The user submits an application; the driver starts and creates the SparkContext.', 'The driver asks the cluster manager for resources; executors are launched on worker nodes.', 'The driver turns the code into a DAG; when an action is called, the DAG scheduler divides it into **stages** (at shuffle boundaries) and the task scheduler sends **tasks** to executors.', 'Executors run the tasks on their partitions and send results/status back.', 'At the end, the driver stops and the executors are released.'] },
    ],
    sources: [`${U5} slides 11–17`],
  },

  'bda-spark-scala': {
    blocks: [
      { h: 'Architecture of Apache Spark (summary)' },
      { img: 'bda-spark-arch' },
      'Master–worker: the **driver** (SparkContext) builds a DAG of the program and schedules tasks; the **cluster manager** (standalone/YARN/Kubernetes) allocates resources; **executors** on worker nodes run tasks on RDD partitions and cache data. Data = **RDDs**, computation = **DAG** of transformations, triggered by actions.',
      { h: 'Fundamentals of Scala' },
      'Spark itself is written in **Scala**, a JVM language that combines object-oriented and functional programming.',
      { ul: ['**val vs var**: `val x = 10` is immutable (preferred), `var y = 5` is mutable.', '**Type inference**: types are usually inferred: `val name = "CBIT"` is a String.', '**Functions are first-class values**: `val square = (x: Int) => x * x`.', '**Higher-order functions**: functions that take or return functions: `List(1,2,3).map(square)`.', '**Immutable collections**: List, Map, Set; operations return new collections.', '**Case classes** and **pattern matching** for data modelling.', '**Objects and classes**; `object Main { def main(args: Array[String]) … }` as the entry point.', 'Runs on the JVM and can use Java libraries.'] },
      { h: 'Functional programming fundamentals' },
      { ul: ['**Pure functions**: output depends only on input, no side effects.', '**Immutability**: data is not changed in place; new values are created.', '**Higher-order functions** and **anonymous functions (lambdas)**.', '**Function composition** and chaining.', '**Lazy evaluation**: values are computed only when needed.'] },
      { h: 'Why it matters for Spark' },
      'Spark\'s RDD API *is* functional programming: RDDs are **immutable**, transformations like `map`, `filter`, `reduceByKey` take **functions as arguments**, and evaluation is **lazy**. Pure functions can be shipped to many executors and safely re-run on failure.',
      { code: 'val lines  = sc.textFile("hdfs:///data/words.txt")\nval counts = lines.flatMap(l => l.split(" "))\n                  .map(w => (w, 1))\n                  .reduceByKey(_ + _)          // functions passed as arguments\ncounts.collect().foreach(println)            // action triggers execution' },
    ],
    sources: [`${U5} slides 7, 11–21`, 'Standard textbook coverage (Scala fundamentals)'],
  },

  'bda-driver': {
    blocks: [
      'The **driver program** is the **central coordinator** of a Spark application: the process that runs the application\'s `main()` function and creates the **SparkContext** (or SparkSession), the entry point to Spark.',
      { img: 'bda-spark-arch' },
      { h: 'Roles' },
      { ol: ['**Creates the SparkContext**, which connects to the cluster manager and requests executors.', '**Builds the logical plan**: records the transformations on RDDs as a lineage graph (DAG).', '**Converts it into a physical plan**: when an action is called, the **DAG scheduler** splits the job into **stages** at shuffle boundaries, and the **task scheduler** creates tasks (one per partition).', '**Schedules tasks on executors**, preferring nodes that hold the data (data locality).', '**Monitors execution**: tracks task progress, retries failed tasks, recomputes lost partitions from lineage.', '**Collects results** of actions (e.g. collect, count) and returns them to the user program.', '**Hosts the web UI** (port 4040) showing jobs, stages and storage.', '**Releases resources** when the application ends (sc.stop()).'] },
      'If the driver fails, the whole application fails, so for production it often runs in **cluster mode** (inside the cluster, e.g. in a YARN container) rather than client mode.',
    ],
    sources: [`${U5} slide 15`],
  },

  'bda-rdd': {
    blocks: [
      { h: 'Spark concepts' },
      { ul: ['**SparkContext / SparkSession**: entry point to a Spark application.', '**RDD**: the distributed dataset.', '**Transformations** (lazy) and **actions** (trigger execution).', '**DAG**: the plan of transformations; split into **jobs, stages and tasks**.', '**Partitions**: chunks of an RDD processed in parallel.', '**Driver, cluster manager, executors**.', '**Caching/persistence**: keep an RDD in memory for reuse.'] },
      { h: 'Resilient Distributed Dataset (RDD)' },
      'An **RDD** is Spark\'s fundamental data structure: an **immutable, fault-tolerant, partitioned collection of records** distributed across the cluster that can be processed **in parallel**.',
      { ul: ['**Resilient**: if a partition is lost, Spark rebuilds it using the **lineage** (the record of transformations that created it).', '**Distributed**: data is divided into partitions across nodes.', '**Dataset**: a collection of objects (numbers, strings, tuples, records).'] },
      { h: 'Creating RDDs' },
      { code: `from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("Example").getOrCreate()
sc = spark.sparkContext

rdd   = sc.parallelize([10, 20, 30, 40])           # 1. from a collection
lines = sc.textFile("hdfs:///user/cse/students.txt")  # 2. from external storage
high  = rdd.filter(lambda x: x > 15)               # 3. from an existing RDD
print(high.collect())                              # [20, 30, 40]` },
      { h: 'Example' },
      { code: 'words  = lines.flatMap(lambda l: l.split())\npairs  = words.map(lambda w: (w, 1))\ncounts = pairs.reduceByKey(lambda a, b: a + b)\nprint(counts.take(5))' },
    ],
    sources: [`${U5} slides 12–21`],
  },

  'bda-rdd-significance': {
    blocks: [
      { h: 'Significance of RDDs' },
      'RDDs are the **core abstraction** of Spark: all higher-level APIs (DataFrames, streaming, ML) are built on them. They let Spark keep data **in memory across operations** while still being **fault tolerant**, which MapReduce could not do.',
      { h: 'Advantages' },
      { ol: [
        '**In-memory computation**: intermediate results stay in RAM → much faster than disk-based MapReduce.',
        '**Fault tolerance without replication**: lost partitions are recomputed from **lineage**, so no costly copies of intermediate data.',
        '**Immutability**: safe sharing across parallel tasks; no consistency problems.',
        '**Lazy evaluation**: Spark sees the whole chain of transformations and optimises it (pipelining, fewer passes).',
        '**Partitioning and data locality**: computation is sent to where the data lives; users can control partitioning to reduce shuffles.',
        '**Persistence/caching**: `cache()`/`persist()` reuse data across many operations.',
        '**Rich operations**: map, filter, join, groupByKey, reduceByKey… on any type of data, structured or unstructured.',
        '**Coarse-grained operations** make lineage small and recovery cheap.',
      ] },
      { h: 'How they improve big data processing' },
      { ul: ['**Iterative algorithms** (k-means, PageRank, logistic regression) read the cached RDD each iteration instead of HDFS: often 10–100× speed-up.', '**Interactive analysis**: load once, query many times from memory.', '**Pipelines** with many steps run as one optimised DAG.', '**Scales** to thousands of nodes and recovers quickly from failures.'] },
    ],
    sources: [`${U5} slides 12–19`],
  },

  'bda-rdd-props': {
    blocks: [
      { h: 'Properties of RDDs' },
      { table: { head: ['Property', 'Meaning'], rows: [
        ['**Immutable**', 'Once created, an RDD cannot be changed; transformations create new RDDs'],
        ['**Distributed / partitioned**', 'Data is split into partitions spread across nodes; each partition is processed by one task'],
        ['**Resilient (fault tolerant)**', 'Lineage graph lets Spark recompute lost partitions'],
        ['**Lazy evaluation**', 'Transformations are only recorded; computation happens when an action is called'],
        ['**In-memory**', 'Data can be kept in RAM (persist/cache) with storage levels MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY'],
        ['**Location-aware**', 'Tasks are scheduled near their data (data locality)'],
        ['**Typed / any data**', 'Can hold any Python/Java/Scala objects'],
        ['**Coarse-grained operations**', 'Operations apply to the whole dataset, not individual records'],
      ] } },
      'Internally an RDD is described by five things: a list of **partitions**, a **function** to compute each partition, a list of **dependencies** on parent RDDs, optionally a **partitioner** (for key–value RDDs) and **preferred locations**.',
      { h: 'Operations on RDDs' },
      { compare: [
        { title: 'Transformations (lazy, return a new RDD)', items: ['map, flatMap, filter', 'distinct, union, intersection', 'groupByKey, reduceByKey, sortByKey, join', 'Narrow (no shuffle) vs wide (shuffle)'] },
        { title: 'Actions (trigger execution, return a value)', items: ['collect, count, first, take(n)', 'reduce, countByKey', 'foreach', 'saveAsTextFile'] },
      ] },
      { code: 'rdd = sc.parallelize([1, 2, 3, 4, 5, 6], 3)    # 3 partitions\nev  = rdd.filter(lambda x: x % 2 == 0).map(lambda x: x * 10)\nev.cache()\nprint(ev.collect(), ev.count(), rdd.getNumPartitions())   # [20, 40, 60] 3 3' },
    ],
    sources: [`${U5} slides 13, 18–21`],
  },

  'bda-rdd-create': {
    blocks: [
      'RDDs can be created in three main ways:',
      { h: '1. Parallelising an existing collection (in the driver)' },
      { code: 'from pyspark import SparkContext\nsc = SparkContext("local[*]", "Create")\nnums = sc.parallelize([10, 20, 30, 40], 2)     # list split into 2 partitions\nprint(nums.collect())                          # [10, 20, 30, 40]' },
      'Useful for testing and small data; the second argument sets the number of partitions.',
      { h: '2. Referencing an external dataset' },
      { code: 'local = sc.textFile("file:///home/cse/students.txt")      # local file\nhdfs  = sc.textFile("hdfs://namenode:9000/data/marks.csv")  # HDFS\ns3    = sc.textFile("s3a://bucket/logs/*.log")              # cloud storage\nwhole = sc.wholeTextFiles("hdfs:///data/docs/")             # (filename, content) pairs\nseq   = sc.sequenceFile("hdfs:///data/seq")                  # Hadoop SequenceFile' },
      'textFile creates one record per line; each HDFS block becomes a partition. Any Hadoop InputFormat can be used (`newAPIHadoopFile`).',
      { h: '3. Transforming an existing RDD' },
      { code: 'words = local.flatMap(lambda l: l.split())\nlong_words = words.filter(lambda w: len(w) > 5)' },
      { h: 'From other structures' },
      { code: 'df  = spark.read.csv("marks.csv", header=True)   # DataFrame\nrdd = df.rdd                                       # DataFrame -> RDD of Row objects\nkv  = sc.parallelize([("OS", 78), ("CN", 65)])     # key-value (pair) RDD' },
    ],
    sources: [`${U5} slide 19`, NB],
  },

  'bda-trans-actions': {
    blocks: [
      'Spark operations on RDDs are of two types:',
      { table: { head: ['Basis', 'Transformation', 'Action'], rows: [
        ['Definition', 'Creates a **new RDD** from an existing one without modifying it', 'Computes a **result** and returns it to the driver or writes it to storage'],
        ['Returns', 'An RDD', 'A value (number, list) or nothing (saves output)'],
        ['Evaluation', '**Lazy**: only recorded in the lineage/DAG', '**Eager**: triggers execution of all pending transformations'],
        ['Examples', 'map, flatMap, filter, distinct, union, groupByKey, reduceByKey, sortBy, join', 'collect, count, first, take, reduce, countByKey, foreach, saveAsTextFile'],
        ['Types', '**Narrow** (each output partition depends on one input partition: map, filter) and **wide** (needs a shuffle: groupByKey, reduceByKey, join)', '—'],
      ] } },
      { code: `rdd = sc.parallelize([1, 2, 3, 4, 5, 6])
sq  = rdd.map(lambda x: x * x)          # transformation -> [1,4,9,16,25,36]
ev  = sq.filter(lambda x: x % 2 == 0)   # transformation -> [4,16,36]
print(ev.collect())                     # action -> [4, 16, 36]
print(ev.count())                       # action -> 3
print(sq.reduce(lambda a, b: a + b))    # action -> 91` },
      'Nothing is computed until `collect()` is called; Spark then runs the whole chain in one optimised pass. "Operations" is the general name; transformations are the lazy subset.',
    ],
    sources: [`${U5} slides 20–21`],
  },

  'bda-transformation': {
    blocks: [
      'A **Spark transformation** is an operation on an RDD that **produces a new RDD** without changing the original (RDDs are immutable). Transformations are **lazy**: Spark only records them in the lineage (DAG) and computes them when an action needs the result.',
      { h: 'Narrow vs wide transformations' },
      { compare: [
        { title: 'Narrow', items: ['Each output partition depends on a single input partition', 'No data movement between nodes', 'Pipelined together within one stage', 'map, flatMap, filter, mapValues, union'] },
        { title: 'Wide', items: ['Output partitions depend on many input partitions', 'Require a **shuffle** across the network', 'Create a stage boundary', 'groupByKey, reduceByKey, sortByKey, join, distinct'] },
      ] },
      { h: 'Common transformations' },
      { table: { head: ['Transformation', 'Example', 'Result'], rows: [['map(f)', 'rdd.map(lambda x: x*2)', 'each element doubled'], ['filter(f)', 'rdd.filter(lambda x: x%2==0)', 'even elements'], ['flatMap(f)', 'lines.flatMap(lambda l: l.split(" "))', 'all words'], ['distinct()', 'rdd.distinct()', 'unique elements'], ['union(other)', 'rdd1.union(rdd2)', 'elements of both'], ['reduceByKey(f)', 'marks.reduceByKey(lambda a,b: a+b)', 'total per key'], ['groupByKey()', 'pairs.groupByKey()', 'values grouped per key'], ['sortBy(f)', 'rdd.sortBy(lambda x: -x)', 'sorted'], ['join(other)', 'a.join(b)', '(k, (va, vb))']] } },
    ],
    sources: [`${U5} slide 20`],
  },

  'bda-trans-demo': {
    blocks: [
      'Example: word frequency in a text file, showing transformations building a plan and actions executing it.',
      { code: `from pyspark import SparkContext
sc = SparkContext("local[*]", "WordFreq")

lines  = sc.textFile("notes.txt")                       # create RDD
words  = lines.flatMap(lambda l: l.lower().split())     # T: lines -> words
clean  = words.filter(lambda w: w.isalpha())            # T: drop numbers/symbols
pairs  = clean.map(lambda w: (w, 1))                    # T: (word, 1)
counts = pairs.reduceByKey(lambda a, b: a + b)          # T (wide): sum per word
top    = counts.sortBy(lambda kv: kv[1], ascending=False)  # T: sort by count

print(top.take(5))            # A: [('spark', 42), ('data', 37), ...]
print(counts.count())         # A: number of distinct words
top.saveAsTextFile("out/wc")  # A: write results` },
      { h: 'What happens' },
      { steps: ['The five transformations only build the **lineage**: no data is read yet.', '`take(5)` is the first **action**: the driver builds a DAG, splits it into two **stages** at the reduceByKey shuffle (flatMap → filter → map pipelined in stage 1; reduce + sort in stage 2) and runs tasks on the partitions.', '`count()` and `saveAsTextFile()` are further actions; each launches a job (calling `counts.cache()` first would avoid recomputing from the file).'] },
    ],
    sources: [`${U5} slides 20–22`],
  },

  'bda-pyspark-program': {
    blocks: [
      'An **RDD** (Resilient Distributed Dataset) is Spark\'s immutable, partitioned, fault-tolerant collection of data processed in parallel. The program below analyses a marks file using various transformations and actions.',
      { code: PYSPARK_PROGRAM },
      { ul: ['`textFile` creates the RDD.', '`map`, `filter`, `reduceByKey`, `mapValues`, `distinct`, `sortBy` are **lazy transformations**.', '`collect`, `count`, `first`, `saveAsTextFile` are **actions** that trigger the job.', '`reduceByKey` is a wide transformation (shuffle); the rest are narrow.'] },
    ],
    sources: [`${U5} slides 18–22`, NB],
  },

  'bda-pred-dag': {
    blocks: [
      'A **DAG (Directed Acyclic Graph)** in Spark is the graph of RDDs (vertices) and the operations between them (edges) that represents a computation. It is **directed** (data flows one way, from parent RDD to child) and **acyclic** (no loops).',
      { img: 'bda-spark-dag' },
      { h: 'How Spark uses the DAG' },
      { steps: ['**Lazy evaluation**: as transformations are called, Spark only adds nodes to the lineage graph.', 'When an **action** is called, the driver submits a **job** for that action.', 'The **DAG scheduler** divides the job\'s graph into **stages** at **shuffle boundaries** (wide dependencies like reduceByKey, join). Narrow transformations (map, filter) are **pipelined** inside a stage.', 'Each stage becomes a set of **tasks**, one per partition, which the **task scheduler** sends to executors.', 'Stages run in dependency order; shuffle output of one stage feeds the next.'] },
      { h: 'Job → stages → tasks example' },
      { code: 'sc.textFile("logs") -> flatMap -> map      # Stage 1 (narrow, pipelined)\n          -> reduceByKey                   # shuffle -> Stage 2\n          -> collect()                     # action = 1 job\n# 4 input partitions -> 4 tasks in stage 1; reduce partitions -> tasks in stage 2' },
      { h: 'Advantages' },
      { ul: ['**Optimisation**: Spark sees the whole plan, pipelines operations and avoids unnecessary passes over data.', '**Fault tolerance**: lineage in the DAG lets lost partitions be recomputed.', '**Fewer disk writes** than MapReduce\'s fixed two-stage model.', 'Visible in the Spark UI as a DAG visualisation for debugging.'] },
    ],
    sources: [`${U5} slides 14, 22–24`],
  },

  'bda-pred-case': {
    blocks: [
      '**Case study: analyse student academic data** to find subject difficulty levels, performance trends and top performers using Spark.',
      { h: 'Data' },
      'A CSV file with one row per student per subject: roll, name, dept, semester, subject, marks (thousands of students over several years, stored in HDFS).',
      { h: 'Approach' },
      { steps: ['**Load** the file into an RDD (or DataFrame) and **clean** it: split fields, drop malformed rows, convert marks to integers.', '**Cache** the cleaned RDD because several analyses reuse it.', '**Subject difficulty**: per subject, compute average marks and fail percentage; the lowest average / highest fail % = most difficult.', '**Trends**: average marks per semester (or per year/department) to see if performance improves or declines.', '**Top performers**: total or average marks per student; take the top N overall and per department.', '**Output**: save results to HDFS or show them in a dashboard.'] },
      { code: CASE_STUDY },
      { h: 'Typical findings' },
      { ul: ['Subjects with low averages and high fail rates (e.g. a maths-heavy course) are flagged for extra tutorials.', 'Semester trends show whether a curriculum change helped.', 'Top performers per department are identified for awards and mentoring.'] },
      'Spark suits this because the data can be large, the same cleaned data is reused (in-memory caching), and the computations (group, aggregate, sort) parallelise well.',
    ],
    sources: [`${U5} slides 25–27`, 'Student_Big_Data_Analytics.ipynb'],
  },
}
