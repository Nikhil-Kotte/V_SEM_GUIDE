// Model answers keyed by PYQ id. Every answer lists its sources.
const U3 = 'BDA Unit-3 slides (Unit-3.pptx)'
const U4 = 'BDA Unit-4 slides (Unit-4.pptx)'
const U5 = 'BDA Unit-5 slides (Unit-5.pptx)'
const W = 'Tom White, Hadoop: The Definitive Guide'

export default {
  'bda-hive-arch': {
    blocks: [
      '**Hive** is a data-warehouse infrastructure on Hadoop for querying and analysing large datasets in HDFS using HiveQL.',
      { img: 'bda-hive-arch' },
      { h: 'Components' },
      { ul: [
        '**User interfaces / clients**: Hive CLI, Beeline, web UI; Thrift, JDBC and ODBC clients connect through **HiveServer2**.',
        '**Driver**: receives queries, creates a session, and coordinates compilation and execution.',
        '**Compiler**: parses the query, does semantic analysis using the metastore, and produces an execution plan (DAG of MapReduce/Tez stages).',
        '**Optimizer**: transforms the plan for better performance.',
        '**Metastore**: stores metadata (databases, tables, columns, partitions, HDFS locations) in an RDBMS such as Derby or MySQL.',
        '**Execution engine**: executes the plan as jobs on YARN (MapReduce/Tez/Spark).',
        '**HDFS**: stores the table data.',
      ] },
      { h: 'How HiveQL executes' },
      { steps: ['executeQuery: UI → driver.', 'getPlan: driver → compiler.', 'getMetaData: compiler → metastore; sendMetaData back.', 'sendPlan: compiler → driver.', 'executePlan: driver → execution engine.', 'executeJob: engine → YARN/JobTracker; jobs read/write HDFS (metaDataOps for DDL go to the metastore).', 'fetchResults / sendResults: engine → driver → UI.'] },
    ],
    sources: [`${U4} slides 3–10`, `${W} ch. 17`],
  },

  'bda-hive-vs-rdbms': {
    blocks: [
      { table: { head: ['Basis', 'Hive', 'Traditional RDBMS'], rows: [
        ['Schema enforcement', 'Schema on **read**', 'Schema on **write**'],
        ['Workload', 'OLAP, batch analytics', 'OLTP, transactions'],
        ['Data size', 'Petabytes, on HDFS', 'Up to a few TB'],
        ['Query latency', 'Seconds to minutes (jobs on a cluster)', 'Milliseconds'],
        ['Updates/deletes', 'Limited (ACID tables only)', 'Full row-level support'],
        ['Indexes / constraints', 'Minimal', 'Rich (keys, constraints, indexes)'],
        ['Scaling', 'Horizontal, commodity hardware', 'Mostly vertical'],
        ['Language', 'HiveQL (SQL-like)', 'Standard SQL'],
      ] } },
      'Use Hive for large-scale reporting and analysis over historical data; use an RDBMS for fast, consistent transactions on current data.',
    ],
    sources: [`${U4} slides 3–6`, `${W} ch. 17 (Comparison with traditional databases)`],
  },

  'bda-hive-ddl': {
    blocks: [
      { code: `-- databases
CREATE DATABASE IF NOT EXISTS college COMMENT 'CSE data';
SHOW DATABASES;
DESCRIBE DATABASE college;
USE college;
ALTER DATABASE college SET DBPROPERTIES ('edited-by'='cse');
DROP DATABASE IF EXISTS college CASCADE;   -- CASCADE drops its tables too

-- tables
CREATE TABLE IF NOT EXISTS student (roll INT, name STRING, dept STRING, cgpa FLOAT)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE;
LOAD DATA LOCAL INPATH '/home/cse/student.csv' INTO TABLE student;
SHOW TABLES;
DESCRIBE student;
ALTER TABLE student ADD COLUMNS (phone STRING);
ALTER TABLE student RENAME TO students;
DROP TABLE IF EXISTS students;` },
      { ul: ['**Managed table**: Hive owns the data; DROP deletes the HDFS files.', '**External table** (`CREATE EXTERNAL TABLE … LOCATION \'/path\'`): DROP removes only metadata.'] },
    ],
    sources: [`${U4} slides 11–26`],
  },

  'bda-hiveql-script': {
    blocks: [
      { code: `CREATE DATABASE IF NOT EXISTS university;
USE university;

CREATE TABLE marks (roll INT, name STRING, dept STRING, subject STRING, score INT)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE;

LOAD DATA LOCAL INPATH '/home/cse/marks.csv' INTO TABLE marks;

-- 1. average, highest and lowest per subject (difficulty)
SELECT subject, ROUND(AVG(score),2) AS avg_score, MAX(score) AS top, MIN(score) AS low
FROM marks GROUP BY subject ORDER BY avg_score;

-- 2. total and percentage per student, top 5
SELECT roll, name, SUM(score) AS total, ROUND(AVG(score),2) AS pct
FROM marks GROUP BY roll, name ORDER BY total DESC LIMIT 5;

-- 3. pass/fail count per subject
SELECT subject,
       SUM(CASE WHEN score >= 40 THEN 1 ELSE 0 END) AS passed,
       SUM(CASE WHEN score <  40 THEN 1 ELSE 0 END) AS failed
FROM marks GROUP BY subject;

-- 4. department toppers
SELECT dept, MAX(score) FROM marks GROUP BY dept;` },
      'Explain each query in one line in the exam: what it groups by and what it computes.',
    ],
    sources: [`${U4} slides 11–26`, "BDA Nov '25 paper Q"],
  },

  'bda-rdd': {
    blocks: [
      'An **RDD (Resilient Distributed Dataset)** is Spark\'s fundamental abstraction: a read-only, partitioned collection of records distributed across the cluster that can be operated on in parallel.',
      { h: 'Properties' },
      { ul: ['**Resilient**: lost partitions are rebuilt from the lineage graph.', '**Distributed**: data is split into partitions across nodes.', '**Immutable**: every transformation produces a new RDD.', '**Lazy evaluation**: computed only when an action is called.', '**In-memory** computation with optional persistence (MEMORY_ONLY, MEMORY_AND_DISK…).', '**Partitioned** and location-aware (data locality).'] },
      { h: 'Creating RDDs' },
      { code: `data  = sc.parallelize([10, 20, 30, 40])          # from an in-memory collection
lines = sc.textFile("hdfs:///user/cse/logs.txt")  # from external storage
errs  = lines.filter(lambda l: "ERROR" in l)      # from an existing RDD
rdd2  = df.rdd                                     # from a DataFrame` },
      { h: 'Operations' },
      'Transformations (map, filter, flatMap, reduceByKey, join) and actions (collect, count, take, reduce, saveAsTextFile).',
      { h: 'Significance / advantages' },
      'In-memory reuse makes iterative and interactive jobs fast; lineage-based recovery avoids replicating data; developers control partitioning and caching.',
    ],
    sources: [`${U5} slides 13–20`],
  },

  'bda-trans-actions': {
    blocks: [
      { table: { head: ['', 'Transformation', 'Action'], rows: [
        ['Returns', 'A new RDD', 'A value to the driver, or writes output'],
        ['Evaluation', 'Lazy (recorded in the DAG)', 'Triggers execution of the DAG'],
        ['Examples', 'map, filter, flatMap, union, distinct, groupByKey, reduceByKey, join, sortBy', 'collect, count, first, take, reduce, countByKey, foreach, saveAsTextFile'],
        ['Types', 'Narrow (no shuffle) / wide (shuffle)', '—'],
      ] } },
      { code: `rdd = sc.parallelize([1, 2, 3, 4, 5, 6])
sq  = rdd.map(lambda x: x * x)          # transformation → [1,4,9,16,25,36]
ev  = sq.filter(lambda x: x % 2 == 0)   # transformation → [4,16,36]
print(ev.collect())                     # action → [4, 16, 36]
print(ev.count())                       # action → 3
print(sq.reduce(lambda a, b: a + b))    # action → 91` },
      'Nothing is computed until `collect()` is called; Spark then runs the whole chain in one pass.',
    ],
    sources: [`${U5} slides 18–22`],
  },

  'bda-pyspark-program': {
    blocks: [
      { code: `from pyspark import SparkContext
sc = SparkContext("local[*]", "MarksAnalysis")

# each line: roll,name,subject,score
lines = sc.textFile("marks.csv")
recs  = lines.map(lambda l: l.split(","))                       # transformation
valid = recs.filter(lambda r: r[3].isdigit())                    # transformation
by_sub = valid.map(lambda r: (r[2], (int(r[3]), 1)))             # transformation
sums  = by_sub.reduceByKey(lambda a, b: (a[0]+b[0], a[1]+b[1]))  # transformation (wide)
avgs  = sums.mapValues(lambda s: round(s[0] / s[1], 2))          # transformation

print(avgs.collect())                                            # action
print("records:", valid.count())                                 # action
avgs.saveAsTextFile("out/subject_avg")                            # action
sc.stop()` },
      'Explain: textFile creates the RDD; map/filter/reduceByKey/mapValues are lazy transformations; collect/count/saveAsTextFile are actions that trigger the job.',
    ],
    sources: [`${U5} slides 18–22`, 'Big_Data_Analytics_PySpark.ipynb'],
  },

  'bda-spark-arch': {
    blocks: [
      { img: 'bda-spark-arch' },
      { ul: ['**Driver program**: runs the application\'s main(), creates the SparkContext, converts code into a DAG, schedules tasks and collects results.', '**SparkContext**: connection to the cluster.', '**Cluster manager**: allocates resources — standalone, YARN, Mesos or Kubernetes.', '**Worker nodes / executors**: executors run tasks on data partitions, cache data in memory, and send results to the driver.', '**Tasks**: one per partition per stage.'] },
      { h: 'Layered view' },
      'Storage (HDFS, S3…) → resource management (YARN/standalone) → Spark Core (RDDs, scheduler, memory, fault tolerance) → libraries (SQL-style, streaming, ML, graph) → APIs (Scala, Java, Python, R).',
      { h: 'Execution flow' },
      'Driver requests resources → executors launched → driver sends code and tasks → executors run tasks and return results → executors released at the end.',
    ],
    sources: [`${U5} slides 9–12`],
  },

  'bda-spark-vs-mr': {
    blocks: [
      { h: 'Benefits of Spark' },
      { ul: ['In-memory processing: up to 100× faster than MapReduce.', 'Easy APIs in Python, Scala, Java and R; interactive shells.', 'One engine for batch, interactive queries, streaming and ML.', 'Lineage-based fault tolerance.', 'Runs on YARN/Kubernetes and reads HDFS, S3, Cassandra…'] },
      { h: 'Challenges' },
      { ul: ['High memory requirements and cost.', 'No storage system of its own.', 'Tuning partitions, memory and caching is manual.', 'Streaming is micro-batch.', 'Small-files problem.'] },
      { h: 'Three performance aspects vs MapReduce' },
      { ol: ['**Speed / I/O**: MapReduce writes intermediate results to disk after every step; Spark keeps them in memory.', '**Iterative processing**: ML algorithms re-read data every iteration in MapReduce; Spark caches it.', '**Execution model**: MapReduce is a rigid map → reduce pair per job; Spark optimises a whole DAG and pipelines narrow operations.'] },
    ],
    sources: [`${U5} slides 5–8`],
  },

  'bda-pig-latin': {
    blocks: [
      'A **Pig Latin** script is a sequence of statements; each takes a relation as input and produces a new relation. Statements end with `;`, relations are named by aliases, and nothing runs until DUMP or STORE.',
      { h: 'Structure' },
      { steps: ['LOAD data into a relation (with an optional schema).', 'Transform it: FILTER, FOREACH…GENERATE, GROUP, JOIN, ORDER, DISTINCT, LIMIT.', 'Output it: DUMP to the screen or STORE into HDFS.'] },
      { h: 'Relational operators' },
      { table: { head: ['Operator', 'Example'], rows: [['LOAD', "s = LOAD 'students' USING PigStorage(',') AS (id:int, name:chararray, marks:int);"], ['FILTER', 'p = FILTER s BY marks >= 40;'], ['FOREACH', 'n = FOREACH s GENERATE name, marks;'], ['GROUP', 'g = GROUP s BY dept;'], ['JOIN', 'j = JOIN s BY id, fees BY id;'], ['ORDER', 'o = ORDER s BY marks DESC;'], ['DISTINCT / LIMIT', 'd = DISTINCT s; t = LIMIT o 5;'], ['STORE / DUMP', "STORE o INTO 'out'; DUMP t;"]] } },
      { h: 'UDFs' },
      'Extend Pig with Java (EvalFunc) or Python functions, REGISTER the JAR, and call them inside FOREACH.',
    ],
    sources: [`${U4} slides 27–66`],
  },

  'bda-pig-script': {
    blocks: [
      { h: 'Maximum temperature per year (NCDC data)' },
      { code: `-- 1. load: each line has year, temperature, quality code
records  = LOAD 'input/ncdc/sample.txt' AS (year:chararray, temperature:int, quality:int);
-- 2. remove missing readings (9999) and bad quality codes
filtered = FILTER records BY temperature != 9999 AND
           (quality == 0 OR quality == 1 OR quality == 4 OR quality == 5 OR quality == 9);
-- 3. group by year
grouped  = GROUP filtered BY year;
-- 4. highest temperature in each group
max_temp = FOREACH grouped GENERATE group, MAX(filtered.temperature);
-- 5. output
DUMP max_temp;      -- e.g. (1949,111) (1950,22)` },
      { h: 'Load, filter, group — student data' },
      { code: `s   = LOAD '/data/students.csv' USING PigStorage(',') AS (id:int, name:chararray, dept:chararray, marks:int);
p   = FILTER s BY marks >= 40;
g   = GROUP p BY dept;
r   = FOREACH g GENERATE group AS dept, COUNT(p) AS passed, AVG(p.marks) AS avg_marks;
STORE r INTO '/out/dept' USING PigStorage(',');` },
    ],
    sources: [`${U4} slides 44–66`, `${W} ch. 16 (Pig)`],
  },

  'bda-pig-what': {
    blocks: [
      '**Apache Pig** is a platform for analysing large datasets on Hadoop. It has a high-level data-flow language, **Pig Latin**, and an engine that compiles scripts into MapReduce/Tez jobs.',
      { h: 'Why Pig Latin is needed' },
      { ul: ['MapReduce in Java is long, low-level and hard to maintain; one Pig line can replace ~20 lines of Java.', 'Common operations (join, group, filter, sort) are built in.', 'Procedural style suits step-by-step ETL pipelines.', 'Works with semi-structured data and optional schemas.', 'Automatic optimisation and UDF extensibility.'] },
      { img: 'bda-pig-anatomy' },
      { h: 'Pig in practice' },
      'Log analysis, ETL before loading into Hive, data cleaning and sampling, prototyping research algorithms on big data (Yahoo ran most of its Hadoop jobs through Pig).',
    ],
    sources: [`${U4} slides 27–31`],
  },

  'bda-pig-vs-db': {
    blocks: [
      { table: { head: ['', 'Pig', 'Hive', 'RDBMS'], rows: [
        ['Language', 'Pig Latin (procedural)', 'HiveQL (declarative)', 'SQL (declarative)'],
        ['Schema', 'Optional, at load', 'Required, schema on read', 'Required, schema on write'],
        ['Data', 'Semi-/structured', 'Structured', 'Structured'],
        ['Use', 'ETL, data flows', 'Warehouse queries, reports', 'Transactions'],
        ['Indexes / transactions', 'No', 'Limited', 'Yes'],
        ['Scale', 'Petabytes (batch)', 'Petabytes (batch)', 'GB–TB, low latency'],
      ] } },
    ],
    sources: [`${U4} slides 67–70`],
  },

  'bda-pig-types': {
    blocks: [
      { img: 'bda-pig-model' },
      { ul: ['**Atom**: a single value — int, long, float, double, chararray, bytearray, boolean, datetime. e.g. `\'CSE\'`, `88`.', '**Tuple**: ordered set of fields, `(101, \'Megha\', 88)`.', '**Bag**: collection of tuples, possibly with duplicates, `{(101,\'Megha\'), (103,\'Preethi\')}`. An inner bag can be a field; the relation itself is an outer bag.', '**Map**: key#value pairs with chararray keys, `[\'dept\'#\'CSE\', \'gpa\'#8.8]`.', '**Relation**: a bag of tuples that each statement produces.'] },
    ],
    sources: [`${U4} slides 32–36`],
  },

  'bda-pig-modes': {
    blocks: [
      { compare: [
        { title: 'Local mode', items: ['`pig -x local`', 'Runs in one JVM on the local file system', 'Used for development and testing on small data'] },
        { title: 'MapReduce mode', items: ['`pig` / `pig -x mapreduce`', 'Translates scripts into MapReduce jobs on the Hadoop cluster, reading HDFS', 'Used for production on large data'] },
      ] },
      { h: 'Installing and running' },
      { steps: ['Download Pig and extract it; set `PIG_HOME`, add `$PIG_HOME/bin` to PATH.', 'Make sure Hadoop is configured (`HADOOP_HOME`, cluster running).', 'Interactive: start the Grunt shell with `pig` and type statements.', 'Batch: `pig -x mapreduce script.pig`.', 'Embedded: call Pig from Java using PigServer.'] },
    ],
    sources: [`${U4} slides 37–43`],
  },
}
