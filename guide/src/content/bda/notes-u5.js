// Big Data Analytics, Unit V: Apache Spark.
// Follows the BDA unit slides.
export default {
  'bda.u5.spark-intro': {
    oneLine: 'Apache Spark is a fast, general-purpose cluster computing engine that keeps data in memory between steps, making it far quicker than disk-based MapReduce for iterative and interactive work.',
    blocks: [
      { def: "Apache Spark", text: "A **fast, general-purpose, in-memory cluster computing engine for large-scale data processing**, with APIs in Scala, Java, Python and R and libraries for SQL (Spark SQL), streaming, machine learning (MLlib) and graphs (GraphX). It keeps intermediate data in memory, making it up to 100× faster than MapReduce for iterative work." },
      'Started at UC Berkeley\'s AMPLab (2009), open-sourced and donated to Apache. Programs are written in Scala, Java, Python (PySpark) or R.',
      { h: 'Design principles' },
      { ul: [
        '**In-memory computing**: intermediate results stay in RAM instead of being written to HDFS after every step.',
        '**Lazy evaluation**: transformations only build a plan; work starts when an action needs a result, so Spark can optimise the whole plan.',
        '**Fault tolerance through lineage**: each RDD remembers how it was built; lost partitions are recomputed, not replicated.',
        '**Unified engine**: the same core runs batch jobs, SQL-style queries, streaming, machine learning and graph processing libraries.',
        '**Immutability and parallelism**: data is split into partitions processed in parallel; datasets are never modified in place.',
        '**Runs anywhere**: standalone, on YARN, Mesos or Kubernetes; reads HDFS, S3, Cassandra, HBase…',
      ] },
      { h: 'Present and future' },
      'Spark is now the most widely used big-data processing engine, the default engine behind many cloud platforms (e.g. Databricks, EMR, Dataproc). It is moving towards higher-level DataFrame APIs, better streaming, and integration with AI/ML workloads.',
    ],
    terms: [['In-memory computing', 'Keeping working data in RAM across steps.'], ['Lineage', 'The recorded chain of operations that produced an RDD.']],
    exam: 'Definition + history line + the design principles as a list.',
    revise: ['In-memory, lazy, lineage-based fault tolerance, unified, runs anywhere'],
  },
  'bda.u5.spark-pros-cons': {
    oneLine: 'Spark is fast, easy and general, but it needs lots of memory, has no storage of its own, and needs tuning.',
    blocks: [
      { def: "Spark vs MapReduce", text: "Spark processes data **in memory** with a DAG execution engine and rich APIs (batch, streaming, interactive, ML), while MapReduce writes intermediate results to **disk** between a fixed map and reduce stage; Spark is faster and easier, MapReduce is cheaper on memory and very mature for huge batch jobs." },
      { compare: [
        { title: 'Advantages', items: ['**Speed**: up to 100× faster than MapReduce in memory, ~10× on disk', '**Ease of use**: high-level APIs in Python, Scala, Java, R; 80+ operators', '**Generality**: batch, interactive, streaming, ML, graphs in one engine', '**Fault tolerant** via lineage', '**Runs everywhere** and reads many data sources', 'Interactive shell for exploration'] },
        { title: 'Disadvantages / challenges', items: ['**Memory hungry**: RAM is expensive; spills to disk slow it down', '**No file system** of its own (depends on HDFS/S3)', 'Problems with many **small files**', 'Needs **manual tuning** (partitions, memory, caching)', 'Streaming is micro-batch → not truly real-time', 'Fewer built-in algorithms than specialist tools'] },
      ] },
      { h: 'Spark vs MapReduce' },
      { table: { head: ['', 'MapReduce', 'Spark'], rows: [
        ['Processing', 'Disk-based: writes to HDFS after every map/reduce', 'In-memory between stages'],
        ['Speed', 'Slower', 'Up to 100× faster'],
        ['Iterative jobs (ML)', 'Very slow (re-reads data each pass)', 'Fast (data cached)'],
        ['Programming', 'Verbose Java map/reduce', 'Concise high-level APIs'],
        ['Workloads', 'Batch only', 'Batch, interactive, streaming'],
        ['Fault tolerance', 'Replication on disk', 'Lineage recomputation'],
        ['Execution model', 'Fixed map → reduce', 'General DAG of stages'],
      ] } },
    ],
    terms: [['Iterative algorithm', 'An algorithm that passes over the same data many times (e.g. k-means).']],
    exam: 'Two lists (advantages, disadvantages) and the Spark vs MapReduce table — "three aspects" questions want speed, iterative processing and ease of programming.',
    revise: ['Fast, easy, general, fault tolerant', 'Memory-hungry, no storage, tuning, micro-batch', 'Spark beats MR on iterative jobs'],
  },
  'bda.u5.spark-arch': {
    oneLine: 'A Spark application has a driver (with SparkContext) that plans the work, a cluster manager that allots machines, and executors on worker nodes that run tasks and cache data.',
    blocks: [
      { def: "Spark architecture", text: "A **master–worker** architecture: the **driver program** (SparkContext/SparkSession) converts the application into a DAG of stages and tasks; a **cluster manager** (Standalone, YARN, Mesos, Kubernetes) allocates resources; **executors** on worker nodes run the tasks and cache data." },
      { def: "Layered architecture of Spark", text: "Spark is organised in layers: **storage** (HDFS, S3, HBase, Cassandra, local files) → **cluster manager** (Standalone, YARN, Mesos, Kubernetes) → **Spark Core** (RDDs, DAG scheduler, task scheduler, memory management, fault tolerance) → **libraries** (Spark SQL/DataFrames, Spark Streaming, MLlib, GraphX) → **APIs** (Scala, Java, Python, R)." },
      { img: 'bda-spark-arch' },
      { table: { head: ['Component', 'Role'], rows: [
        ['**Driver program**', 'Runs main(), creates the **SparkContext/SparkSession**, builds the DAG, splits it into stages and tasks, schedules them and collects results'],
        ['**Cluster manager**', 'Allocates resources: Spark standalone, YARN, Mesos or Kubernetes'],
        ['**Worker node**', 'Machine that hosts executors'],
        ['**Executor**', 'JVM process per application on a worker: runs tasks, keeps cached partitions in memory, reports to the driver'],
        ['**Task**', 'Unit of work on one partition'],
      ] } },
      { h: 'Layered architecture' },
      { steps: ['**Storage layer**: HDFS, S3, HBase, Cassandra, local files.', '**Resource management layer**: standalone / YARN / Mesos / Kubernetes.', '**Spark Core**: RDDs, scheduling, memory management, fault recovery, I/O.', '**Libraries layer**: modules for SQL-style queries, streaming, machine learning and graphs on top of the core.', '**API layer**: Scala, Java, Python, R.'] },
      { h: 'How a job runs' },
      'The driver connects to the cluster manager → executors start on workers → the driver sends application code and tasks → executors run tasks and return results → when the app ends, executors are released.',
      {"stack": ["**APIs**: Scala, Java, Python (PySpark), R", "**Libraries**: Spark SQL & DataFrames · Spark Streaming · MLlib · GraphX", "**Spark Core**: RDDs, DAG scheduler, task scheduler, memory and fault management", "**Cluster manager**: Standalone · YARN · Mesos · Kubernetes", "**Storage**: HDFS · S3 · HBase · Cassandra · local files"], "label": "Spark layered architecture, top to bottom"},
      {"tip": "Class Test II question 6(a) (3 marks): draw the layer stack above and the driver–cluster manager–executor diagram, and give one line per layer."},
    ],
    terms: [['SparkContext', 'Entry point that connects the driver to the cluster.'], ['Executor', 'Worker process that runs tasks and caches data.']],
    exam: 'Draw driver ↔ cluster manager ↔ executors, explain each, then the layered stack. The "role of the driver" is a common 5-marker.',
    revise: ['Driver (SparkContext) → cluster manager → executors → tasks', 'Layers: storage, resource mgmt, core, libraries, APIs'],
  },
  'bda.u5.rdd': {
    oneLine: 'An RDD (Resilient Distributed Dataset) is Spark\'s core data structure: an immutable collection split into partitions across the cluster, rebuilt from its lineage if a partition is lost.',
    blocks: [
      { def: "Resilient Distributed Dataset (RDD)", text: "Spark's fundamental data abstraction: an **immutable, partitioned collection of records distributed across the cluster that can be operated on in parallel**. \"Resilient\" because lost partitions are **recomputed from the lineage** of transformations; created from storage (textFile) or collections (parallelize), and evaluated lazily." },
      { h: 'Properties' },
      { ul: ['**Resilient**: fault tolerant through lineage (no replication needed).', '**Distributed**: partitions spread over many nodes and processed in parallel.', '**Immutable**: transformations create new RDDs.', '**Lazily evaluated**.', '**In-memory** and **persistable** (`cache()`, `persist()` with storage levels).', 'Typed and partitioned; can be any Python/Java/Scala objects.'] },
      { h: 'Ways to create an RDD' },
      { code: `from pyspark import SparkContext
sc = SparkContext("local[*]", "rdd-demo")

nums  = sc.parallelize([1, 2, 3, 4, 5], 2)        # 1. from a collection
lines = sc.textFile("hdfs:///data/students.csv")  # 2. from a file (HDFS, local, S3)
words = lines.flatMap(lambda l: l.split(","))     # 3. from another RDD (transformation)
rdd   = spark_df.rdd                               # 4. from a DataFrame` },
      { h: 'Why RDDs matter (advantages)' },
      { ul: ['Speed through in-memory reuse — great for iterative algorithms.', 'Fault tolerance without the cost of copying data.', 'Fine control over partitioning and caching.', 'Works on unstructured data.'] },
      { h: 'Limitations' },
      'No built-in optimiser or schema (DataFrames add those), and Python RDDs are slower than JVM ones.',
    ],
    terms: [['Partition', 'A chunk of an RDD processed by one task.'], ['persist()', 'Keep an RDD in memory/disk for reuse.']],
    exam: 'Expand the acronym, list the properties, then the creation methods with code.',
    revise: ['Resilient, distributed, immutable, lazy, in-memory', 'Create: parallelize, textFile, transform, from DataFrame'],
  },
  'bda.u5.ops': {
    oneLine: 'Spark operations are either transformations, which lazily build a new RDD (map, filter, reduceByKey…), or actions, which trigger execution and return a result (collect, count, saveAsTextFile…).',
    blocks: [
      { def: "Transformations and actions", text: "**Transformations** (map, filter, flatMap, reduceByKey, groupByKey, join) create a **new RDD** from an existing one and are **lazy**: they only record lineage. **Actions** (collect, count, take, reduce, saveAsTextFile) **trigger execution** of the DAG and return a result to the driver or write output." },
      { compare: [
        { title: 'Transformations', items: ['Return a **new RDD**', '**Lazy**: only recorded in the lineage/DAG', '**Narrow**: each output partition needs one input partition (map, filter, flatMap, union, mapPartitions)', '**Wide**: need a **shuffle** across partitions (groupByKey, reduceByKey, join, distinct, sortByKey, repartition)'] },
        { title: 'Actions', items: ['Return a **value** to the driver or write to storage', '**Trigger** the whole computation', 'collect, count, first, take(n), reduce, countByKey, foreach, saveAsTextFile'] },
      ] },
      { h: 'Program: word count (transformations + actions)' },
      { code: `from pyspark import SparkContext
sc = SparkContext("local[*]", "wordcount")

lines  = sc.textFile("input.txt")                         # RDD
words  = lines.flatMap(lambda line: line.split())          # transformation (narrow)
pairs  = words.map(lambda w: (w.lower(), 1))               # transformation (narrow)
counts = pairs.reduceByKey(lambda a, b: a + b)             # transformation (wide → shuffle)
top    = counts.sortBy(lambda kv: -kv[1])                  # transformation (wide)

print(top.take(5))                                         # ACTION → job runs now
print("distinct words:", counts.count())                   # action
counts.saveAsTextFile("out/wordcount")                     # action` },
      { h: 'Numbers example' },
      { code: `nums = sc.parallelize(range(1, 11))
evens = nums.filter(lambda x: x % 2 == 0)     # [2,4,6,8,10]
squares = evens.map(lambda x: x * x)          # [4,16,36,64,100]
print(squares.collect())                       # action → [4, 16, 36, 64, 100]
print(squares.reduce(lambda a, b: a + b))      # action → 220` },
      { tip: 'Nothing runs until the first action. Calling two actions on an un-cached RDD recomputes it twice — `cache()` it if you\'ll reuse it.' },
      {"h": "map() and filter(): students who failed a subject (Class Test II, question 6b)"},
      {"code": "from pyspark import SparkContext\nsc = SparkContext('local', 'FailedStudents')\n# records: roll,name,subject,marks\nlines = sc.textFile('marks.csv')\nrecords = lines.map(lambda l: l.split(','))\nparsed  = records.map(lambda r: (r[0], r[1], r[2], int(r[3])))\nfailed  = parsed.filter(lambda r: r[2] == 'BDA' and r[3] < 40)   # pass mark 40\nfor roll, name, subj, m in failed.collect():\n    print(roll, name, m)"},
      {"h": "Average marks in each subject (Class Test II, question 7a)"},
      {"code": "pairs  = parsed.map(lambda r: (r[2], (r[3], 1)))                 # (subject, (marks, 1))\ntotals = pairs.reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1]))\navg    = totals.mapValues(lambda s: s[0] / s[1])\nprint(avg.collect())          # [('BDA', 67.5), ('OS', 72.0), ...]\n\n# DataFrame version\ndf = spark.read.csv('marks.csv', header=True, inferSchema=True)\ndf.groupBy('subject').avg('marks').show()"},
    ],
    terms: [['Shuffle', 'Redistributing data across partitions by key (expensive).'], ['Narrow dependency', 'Each child partition depends on one parent partition.']],
    exam: 'Comparison table (transformation vs action, narrow vs wide) and a short PySpark program with comments marking each as transformation or action.',
    revise: ['Transformations lazy → new RDD; actions trigger → value', 'Narrow: map, filter, flatMap; wide: groupByKey, reduceByKey, join'],
  },
  'bda.u5.dag': {
    oneLine: 'Spark turns your chain of transformations into a DAG (directed acyclic graph); when an action runs, the DAG scheduler splits it into stages at shuffle boundaries and each stage into parallel tasks.',
    blocks: [
      { def: "DAG in Spark", text: "A **directed acyclic graph** of RDDs and the transformations between them, built lazily from the program. When an action is called, the **DAG scheduler** splits the graph into **stages** at shuffle (wide-dependency) boundaries, each stage into **tasks** (one per partition), and hands them to the task scheduler." },
      { def: "DAG scheduler", text: "The Spark component in the driver that **converts the logical DAG of an action into a physical plan of stages**: it divides the graph at shuffle boundaries, pipelines narrow transformations within a stage, determines **preferred locations** (data locality), submits stages as **TaskSets** to the task scheduler in dependency order, and **resubmits stages** when shuffle output is lost." },
      { img: 'bda-spark-dag' },
      { steps: [
        'Your code builds the RDD **lineage**: each transformation adds a node and an edge.',
        'An **action** submits a **job** for that DAG.',
        'The **DAG scheduler** cuts the graph into **stages** wherever a wide dependency (shuffle) occurs; narrow transformations are **pipelined** together in one stage.',
        'Each stage becomes a **task set** — one task per partition.',
        'The **task scheduler** sends tasks to executors through the cluster manager.',
        'If a task or partition is lost, only the needed part of the DAG is recomputed.',
      ] },
      { h: 'Why a DAG?' },
      { ul: ['Global view → optimisations like pipelining map + filter in one pass.', 'Fewer disk writes than MapReduce\'s fixed two-step model.', 'Fault recovery via lineage.', 'Visible in the Spark UI for debugging.'] },
      'Example: `textFile → flatMap → map → reduceByKey → saveAsTextFile` = **1 job, 2 stages** (stage 1: textFile, flatMap, map; shuffle; stage 2: reduceByKey, save).',
      {"tip": "Class Test II question 3 (2 marks): \"the role of the DAG scheduler\": stages at shuffle boundaries, TaskSets to the task scheduler, data locality, recovery of failed stages."},
    ],
    terms: [['Job', 'All work triggered by one action.'], ['Stage', 'Set of tasks with no shuffle between them.'], ['Task', 'Work on one partition in one stage.']],
    exam: 'Define DAG, draw job → stages → tasks, explain stage boundaries at shuffles and lazy evaluation, and give the word-count example.',
    revise: ['Action → job → stages (split at shuffles) → tasks', 'Narrow ops pipelined in one stage'],
  },
  'bda.u5.case-study': {
    oneLine: 'Case study: load student records into Spark, clean them, then group and sort to find department trends, how hard each department/subject is, and the top performers.',
    blocks: [
      { def: "Spark case study: student academic performance", text: "Using Spark to **ingest student marks, attendance and course data, clean and join them, aggregate and model them** (averages by subject and semester, pass rates, correlations, trend lines, clustering of at-risk students) and present the results, at a scale and speed beyond spreadsheets." },
      'This follows the course notebook `Student_Big_Data_Analytics.ipynb` (10 students: id, name, department, marks, GPA, attendance).',
      { h: '1. Load' },
      { code: `from pyspark.sql import SparkSession, functions as F
spark = SparkSession.builder.appName("StudentBigDataAnalytics").getOrCreate()
df = spark.read.option("header", True).option("inferSchema", True).csv("students.csv")` },
      { h: '2. Clean and derive' },
      { code: `clean = (df.dropDuplicates(["student_id"])
           .filter(F.col("marks").between(0, 100) & F.col("attendance").between(0, 100))
           .withColumn("result", F.when(F.col("marks") >= 40, "PASS").otherwise("FAIL")))` },
      { h: '3. Trends by department (difficulty)' },
      { code: `dept = (clean.groupBy("department")
          .agg(F.count("*").alias("students"), F.round(F.avg("marks"), 2).alias("avg_marks"),
               F.round(F.avg("attendance"), 2).alias("avg_attendance"))
          .orderBy("avg_marks"))      # lowest average first = hardest` },
      { table: { head: ['Department', 'Students', 'Average marks'], rows: [['MECH', '2', '**61.50** (hardest)'], ['CSE', '3', '75.67'], ['ECE', '3', '79.33'], ['IT', '2', '84.50 (easiest)']] } },
      { h: '4. Top performers' },
      { code: `top5 = clean.orderBy(F.desc("marks"), F.desc("gpa")).limit(5)` },
      'Result: Preethi (94), Rohith (91), Megha (88), Ganesh (85), Sneha (81).',
      { h: '5. At-risk students' },
      { code: `low = clean.filter(F.col("attendance") < 75).orderBy("attendance")` },
      'Result: Lokesh (60% attendance, 45 marks) and Anil (68%, 56 marks) — low attendance lines up with low marks, a trend worth reporting.',
      { h: 'Same idea with plain RDDs' },
      { code: `rows = sc.textFile("students.csv").filter(lambda l: not l.startswith("student_id"))
recs = rows.map(lambda l: l.split(","))                 # [id, name, dept, marks, gpa, att]
dept_avg = (recs.map(lambda r: (r[2], (int(r[3]), 1)))
               .reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1]))
               .mapValues(lambda s: s[0] / s[1]))
print(dept_avg.collect())` },
      'With real university data (millions of rows across subjects and semesters) the same code scales out across the cluster unchanged. That is the point of using Spark rather than a spreadsheet.',
      {"h": "Identifying trends in student academic performance (Class Test II, question 7b)"},
      {"steps": ["**Ingest**: load marks, attendance and course data from CSV/HDFS/databases into Spark DataFrames (spark.read.csv, JDBC).", "**Clean and join**: handle missing marks, fix types, join on roll number and subject (Spark SQL).", "**Aggregate**: average and pass percentage per subject, semester and section with groupBy/agg; window functions for each student's semester-to-semester change.", "**Find trends**: compare averages across years and semesters (improving/declining subjects); correlate attendance with marks (df.stat.corr); identify toppers and weak students.", "**Model**: MLlib regression to predict final marks, or k-means clustering to group students (at-risk, average, high performers).", "**Present**: save results to Hive/Parquet and visualise in dashboards; act early on at-risk students."]},
      {"code": "df.groupBy('semester', 'subject').agg(avg('marks').alias('avg'), \\\n    (sum(when(col('marks') >= 40, 1).otherwise(0)) / count('*')).alias('pass_rate')) \\\n  .orderBy('subject', 'semester').show()\ndf.stat.corr('attendance', 'marks')"},
    ],
    terms: [['groupBy + agg', 'Group rows and compute aggregates per group.']],
    exam: 'Describe the pipeline (load → clean → aggregate → rank → report) and write the key Spark lines for each step with sample results.',
    revise: ['Difficulty = lowest average per subject/department', 'Top performers = orderBy(desc).limit(n)', 'Pipeline: load, clean, aggregate, rank, report'],
  },
}
