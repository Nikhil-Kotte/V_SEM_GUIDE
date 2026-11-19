// Model answers for the BDA class-test (mid-term) questions, written for the marks given.
// The 2-mark class-test questions take their answers from bank-2m.js.
const N = 'BDA unit slides'
const TW = 'Tom White, Hadoop: The Definitive Guide'
const MID = 'BDA class tests (PYQs/BDA MIDS.pdf)'

export default {
  'bda-mid-analytic-arch': {
    blocks: [
      'A **big data analytical architecture** is a set of layers that take raw data from many sources and turn it into insight:',
      { img: 'bda-analytic-arch' },
      { table: { head: ['Layer', 'Role', 'Example tools'], rows: [
        ['**Data sources**', 'Where data originates: structured, semi-structured and unstructured', 'RDBMS, ERP/CRM, logs, sensors/IoT, social media, files'],
        ['**Ingestion**', 'Collects and imports data, in batch or real time', 'Sqoop, Flume, Kafka, NiFi'],
        ['**Storage**', 'Distributed, fault-tolerant, scalable storage of raw and processed data', 'HDFS, HBase, NoSQL, data lake, cloud storage'],
        ['**Processing**', 'Cleans, transforms, aggregates data in parallel (batch and stream)', 'MapReduce, Spark, Hive, Pig, Storm; scheduled by YARN'],
        ['**Analysis**', 'Extracts insight: queries, statistics, data mining, machine learning', 'Hive/Spark SQL, MLlib, R/Python, BI engines'],
        ['**Consumption / visualisation**', 'Presents results to users and applications', 'Dashboards (Tableau, Power BI), reports, alerts, APIs'],
      ] } },
      'Cross-cutting: **resource management** (YARN), **workflow** (Oozie), **coordination** (ZooKeeper), **security, governance and metadata** across every layer.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'bda-mid-chars-challenges': {
    blocks: [
      '**Big data** is data whose volume, velocity and variety exceed what conventional tools can store and process in a reasonable time.',
      { img: 'bda-vs' },
      { table: { head: ['Characteristic', 'Meaning', 'Example'], rows: [['**Volume**', 'Enormous amount of data (TB, PB, ZB)', 'Facebook stores petabytes of photos'], ['**Velocity**', 'Speed at which data is generated and must be processed', 'Millions of card transactions per minute; IoT streams'], ['**Variety**', 'Different forms: structured, semi-structured, unstructured', 'Tables, JSON logs, images, videos, tweets'], ['**Veracity**', 'Uncertainty, noise and inconsistency; trustworthiness', 'Fake reviews, faulty sensor readings'], ['**Value**', 'Useful insight that can be extracted', 'Recommendations that raise sales']] } },
      { h: 'Challenges of managing big data' },
      { ul: ['**Storage and scalability**: data grows faster than storage; needs distributed storage (HDFS).', '**Processing speed**: traditional batch systems cannot keep up with velocity.', '**Integration of varied data** from many sources and formats.', '**Data quality**: cleaning noisy, duplicate, incomplete data.', '**Security and privacy** of sensitive data across clusters; regulatory compliance.', '**Skills shortage and cost** of infrastructure.', '**Analysis and visualisation**: extracting value quickly from huge data.'] },
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'bda-mid-bi': {
    blocks: [
      '**Business intelligence (BI)** is the set of technologies and practices that collect, integrate, analyse and present business data as reports, dashboards and KPIs to support decisions.',
      { img: 'bda-bi-ds' },
      { h: 'Importance in big data analytics' },
      { ul: ['Turns big data into **fact-based decisions** through dashboards and KPIs.', 'Provides a **single integrated view** of data from many systems (warehouse/lake).', 'Enables **self-service** analysis for business users on top of Hive/Spark.', '**Early detection** of trends, problems and opportunities.', 'Improves **efficiency and competitiveness**: better planning, lower costs, targeted marketing.'] },
      { h: 'Applications' },
      { table: { head: ['Domain', 'Application'], rows: [['Retail', 'Sales by store/product, inventory optimisation, market-basket insights'], ['Banking', 'Branch performance, loan default and fraud monitoring'], ['Healthcare', 'Bed occupancy, patient outcomes, cost analysis'], ['Telecom', 'Customer churn, network usage'], ['Education', 'Results and attendance analysis, admissions trends']] } },
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'bda-mid-etl-elt': {
    blocks: [
      { img: 'bda-etl-elt' },
      { h: 'ETL: Extract, Transform, Load' },
      { steps: ['**Extract** data from source systems (databases, files, APIs) into a staging area.', '**Transform** it on a separate ETL server: clean, validate, deduplicate, convert types, join, aggregate, apply business rules.', '**Load** the transformed, structured data into the target data warehouse.'] },
      'Suits structured data, smaller volumes and strict quality/compliance; tools: Informatica, Talend, SSIS.',
      { h: 'ELT: Extract, Load, Transform' },
      { steps: ['**Extract** data from sources.', '**Load** the raw data immediately into the target (data lake, HDFS, cloud warehouse).', '**Transform** it inside the target when needed, using its processing power (Hive, Spark, SQL).'] },
      'Suits big data and varied data; loading is fast, raw data is kept, and transformations can be redone (schema-on-read).',
      { table: { head: ['Basis', 'ETL', 'ELT'], rows: [['Transformation location', 'Staging/ETL server', 'Target system'], ['Data stored', 'Processed, structured', 'Raw, any type'], ['Load speed', 'Slower', 'Faster'], ['Target', 'Data warehouse', 'Data lake / Hadoop / cloud DW'], ['Flexibility', 'Low (schema-on-write)', 'High (schema-on-read)']] } },
    ],
    sources: [`${N} (Unit 2)`, MID],
  },

  'bda-types': {
    blocks: [
      { table: { head: ['Type', 'Characteristics', 'Examples'], rows: [['**Structured**', 'Fixed schema, rows and columns, easily queried with SQL', 'Student database, bank transactions, sales tables'], ['**Semi-structured**', 'No rigid schema, but tags or keys give structure (self-describing)', 'XML, JSON, CSV, e-mail, web server logs'], ['**Unstructured**', 'No predefined format; needs special processing', 'Text documents, images, audio, video, social-media posts']] } },
      'About **80% of enterprise data is unstructured**, which is why big data tools (HDFS, NoSQL, Spark, NLP) are needed in addition to relational databases.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'bda-stack-arch': {
    blocks: [
      'Hadoop has a **master–slave architecture** with storage (HDFS), resource management (YARN) and processing (MapReduce) layers, plus ecosystem tools on top.',
      { img: 'bda-hadoop-stack' },
      { img: 'bda-hdfs-arch' },
      { ul: ['**HDFS**: the **NameNode** (master) stores metadata (namespace, file-to-block mapping); **DataNodes** (slaves) store the 128 MB blocks, replicated three times, and send heartbeats and block reports; the **Secondary NameNode** checkpoints the metadata.', '**YARN**: the **ResourceManager** allocates cluster resources; a **NodeManager** on each node launches and monitors containers; an **ApplicationMaster** per job negotiates resources and tracks its tasks.', '**MapReduce**: map tasks run where the data is, shuffle/sort groups intermediate data, reduce tasks aggregate it.', '**Hadoop Common**: shared libraries and utilities.', '**Ecosystem**: Hive, Pig, HBase, Spark, Sqoop, Flume, ZooKeeper, Oozie.'] },
    ],
    sources: [`${N} (Unit 2)`, TW, MID],
  },

  'bda-hdfs-commands': {
    blocks: [
      'HDFS files are managed with the **hdfs dfs** (or hadoop fs) shell:',
      { table: { head: ['Command', 'Syntax', 'Purpose'], rows: [['mkdir', 'hdfs dfs -mkdir /user/data', 'Create a directory'], ['ls', 'hdfs dfs -ls /user/data', 'List contents'], ['put', 'hdfs dfs -put marks.csv /user/data', 'Copy from local to HDFS'], ['get', 'hdfs dfs -get /user/data/marks.csv .', 'Copy from HDFS to local'], ['cat', 'hdfs dfs -cat /user/data/marks.csv', 'Display a file'], ['cp / mv', 'hdfs dfs -cp src dst ; hdfs dfs -mv src dst', 'Copy / move inside HDFS'], ['rm', 'hdfs dfs -rm -r /user/data/old', 'Delete files or directories'], ['touchz', 'hdfs dfs -touchz /user/data/a.txt', 'Create an empty file'], ['du', 'hdfs dfs -du -h /user/data', 'Show space used'], ['setrep', 'hdfs dfs -setrep 2 /user/data/marks.csv', 'Change replication factor']] } },
    ],
    sources: [`${N} (Unit 2)`, TW, MID],
  },

  'bda-mr-working': {
    blocks: [
      'MapReduce processes data in parallel in three phases: **map → shuffle and sort → reduce**.',
      { img: 'bda-mapreduce' },
      { steps: ['**Input splits**: the HDFS input is split (≈ one split per block); a RecordReader turns each split into (key, value) records.', '**Map**: one mapper per split, run on the node holding the data; it emits intermediate (key, value) pairs, e.g. (word, 1).', '**Combiner (optional)**: aggregates map output locally to reduce network traffic.', '**Partitioner**: assigns each key to a reducer (hash(key) mod R).', '**Shuffle and sort**: map outputs are copied to reducers and merged/sorted by key, giving (key, list of values).', '**Reduce**: aggregates each key\'s values, e.g. sums counts, and writes the output to HDFS.'] },
      'Example (word count): "Deer Bear River", "Car Car River", "Deer Car Bear" → (Bear 2), (Car 3), (Deer 2), (River 2). YARN schedules the tasks and re-executes failed ones.',
    ],
    sources: [`${N} (Unit 3)`, TW, MID],
  },

  'bda-mid-secondary-sort': {
    blocks: [
      'MapReduce sorts **keys** before the reduce phase, but the **values** of a key arrive in arbitrary order. **Secondary sorting** makes the values arrive sorted too, without sorting them in the reducer\'s memory.',
      { img: 'bda-secondary-sort' },
      { steps: ['Make a **composite key** = (natural key, value to sort on), e.g. (year, temperature).', 'Write a **partitioner** that partitions on the natural key only, so all records of a year reach the same reducer.', 'Write a **sort comparator** that orders by natural key, then by value (temperature descending).', 'Write a **grouping comparator** on the natural key only, so one reduce() call receives all values of a year, already sorted.'] },
      { example: 'Weather data: (1950, 0), (1950, 22), (1950, 42), (1949, 111), (1949, 78). The reducer for 1950 receives [42, 22, 0] and simply outputs the first value as the maximum temperature: (1949, 111), (1950, 42).' },
    ],
    sources: [`${N} (Unit 3)`, TW, MID],
  },

  'bda-mid-hive-table': {
    blocks: [
      { code: `CREATE DATABASE IF NOT EXISTS company;
USE company;

CREATE TABLE IF NOT EXISTS employee (
  emp_id      INT            COMMENT 'Employee ID',
  name        STRING         COMMENT 'Employee name',
  salary      DECIMAL(10,2)  COMMENT 'Monthly salary',
  joining_dt  DATE           COMMENT 'Date of joining (yyyy-MM-dd)',
  department  STRING         COMMENT 'Department name'
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE;

LOAD DATA LOCAL INPATH '/home/user/employees.csv' INTO TABLE employee;
SELECT department, COUNT(*), AVG(salary) FROM employee GROUP BY department;` },
      { table: { head: ['Column', 'Hive type', 'Why'], rows: [['emp_id', 'INT', 'Whole-number identifier (BIGINT if very large)'], ['name', 'STRING (or VARCHAR(50))', 'Variable-length text'], ['salary', 'DECIMAL(10,2) (or DOUBLE/FLOAT)', 'Exact money values with two decimals'], ['joining_dt', 'DATE (or TIMESTAMP)', 'Allows date functions: YEAR(), DATEDIFF()'], ['department', 'STRING', 'Category text; could be a partition column']] } },
      'Variations: partition the table by department (PARTITIONED BY (department STRING)) for faster queries, or store as ORC for compression.',
    ],
    sources: [`${N} (Unit 4)`, MID],
  },

  'bda-mid-yarn-arch': {
    blocks: [
      '**YARN** (Yet Another Resource Negotiator) separates resource management from data processing in Hadoop 2+.',
      { img: 'bda-yarn-arch' },
      { table: { head: ['Component', 'Role'], rows: [['**ResourceManager** (master, one per cluster)', 'Arbitrates all cluster resources. **Scheduler**: allocates containers to applications (FIFO, Capacity, Fair). **ApplicationsManager**: accepts jobs, starts and restarts ApplicationMasters'], ['**NodeManager** (one per node)', 'Launches and monitors containers, reports resource usage and node health to the ResourceManager via heartbeats'], ['**ApplicationMaster** (one per application)', 'Negotiates containers from the ResourceManager, works with NodeManagers to run and monitor the tasks, handles task failures'], ['**Container**', 'A bundle of resources (memory, CPU) on a node in which a task runs']] } },
      { img: 'bda-yarn-flow' },
      { steps: ['Client submits an application to the ResourceManager.', 'RM allocates a container and starts the ApplicationMaster on a NodeManager.', 'AM registers with the RM and requests containers.', 'RM grants containers; AM asks the NodeManagers to launch tasks in them.', 'Tasks report progress to the AM; on completion the AM unregisters.'] },
    ],
    sources: [`${N} (Unit 3)`, TW, MID],
  },

  'bda-mid-pig-avg': {
    blocks: [
      'Input file **students.csv** in HDFS with fields roll, name, dept, marks:',
      { code: `-- 1. load the data with a schema
students = LOAD '/user/data/students.csv' USING PigStorage(',')
           AS (roll:int, name:chararray, dept:chararray, marks:float);

-- 2. group the students by department
by_dept  = GROUP students BY dept;

-- 3. average the marks in each group
avg_dept = FOREACH by_dept GENERATE group AS dept,
                                   AVG(students.marks) AS avg_marks;

-- 4. sort and output
sorted   = ORDER avg_dept BY avg_marks DESC;
DUMP sorted;
STORE sorted INTO '/user/output/avg_marks' USING PigStorage(',');` },
      { ul: ['**LOAD** reads the CSV into a relation with named, typed fields.', '**GROUP … BY dept** gives one tuple per department: (dept, bag of student tuples).', '**FOREACH … GENERATE** applies the built-in **AVG** to the marks field of each bag (group is the grouping key).', '**ORDER**, **DUMP** (display) and **STORE** (write to HDFS).', 'Run with pig avg_marks.pig (MapReduce mode) or pig -x local avg_marks.pig.'] },
    ],
    sources: [`${N} (Unit 4)`, MID],
  },

  'bda-mid-spark-layers': {
    blocks: [
      { stack: ['**APIs**: Scala, Java, Python (PySpark), R', '**Libraries**: Spark SQL & DataFrames · Spark Streaming · MLlib (machine learning) · GraphX (graphs)', '**Spark Core**: RDDs, DAG scheduler, task scheduler, memory management, fault recovery, I/O', '**Cluster manager**: Standalone · Hadoop YARN · Mesos · Kubernetes', '**Storage**: HDFS · S3 · HBase · Cassandra · local files'], label: 'Spark layered architecture, top to bottom' },
      { img: 'bda-spark-arch' },
      { ul: ['**Storage layer**: Spark has no storage of its own; it reads and writes HDFS, S3, HBase, Cassandra, etc.', '**Cluster manager layer**: allocates CPU and memory on worker nodes to Spark applications.', '**Spark Core**: the execution engine: RDD abstraction, lazy DAG construction, DAG and task scheduling, in-memory caching and lineage-based fault tolerance.', '**Library layer**: higher-level components built on Core for SQL, streaming, ML and graph processing.', '**API layer**: programming interfaces in several languages.'] },
      'At run time the **driver** (SparkContext) builds the DAG and sends tasks through the cluster manager to **executors** on worker nodes, which run them and cache data in memory.',
    ],
    sources: [`${N} (Unit 5)`, MID],
  },

  'bda-mid-rdd-failed': {
    blocks: [
      'Input **marks.csv**: roll, name, subject, marks. A student fails a subject if marks < 40.',
      { code: `from pyspark import SparkContext
sc = SparkContext("local[*]", "FailedStudents")

lines   = sc.textFile("hdfs:///user/data/marks.csv")        # RDD of lines
header  = lines.first()
rows    = lines.filter(lambda l: l != header)                # drop header
fields  = rows.map(lambda l: l.split(","))                   # map: split columns
records = fields.map(lambda f: (f[0], f[1], f[2], int(f[3])))

subject = "BDA"
failed  = records.filter(lambda r: r[2] == subject and r[3] < 40)   # filter

for roll, name, subj, marks in failed.collect():             # action
    print(roll, name, subj, marks)
print("Number failed:", failed.count())
sc.stop()` },
      { ul: ['**map()** transforms each line into a tuple (one-to-one).', '**filter()** keeps only the tuples satisfying the condition (subject matches and marks below the pass mark).', 'Both are **lazy transformations**; **collect()** and **count()** are actions that trigger execution.'] },
    ],
    sources: [`${N} (Unit 5)`, MID],
  },

  'bda-mid-spark-avg': {
    blocks: [
      { code: `from pyspark import SparkContext
sc = SparkContext("local[*]", "AvgMarks")

records = (sc.textFile("marks.csv")                      # roll,name,subject,marks
             .filter(lambda l: not l.startswith("roll"))
             .map(lambda l: l.split(","))
             .map(lambda f: (f[2], (int(f[3]), 1))))     # (subject, (marks, 1))

totals  = records.reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1]))
average = totals.mapValues(lambda s: round(s[0] / s[1], 2))

for subject, avg in average.collect():
    print(subject, avg)` },
      'reduceByKey combines (sum, count) pairs for each subject (first locally on each partition, then across partitions), and mapValues divides sum by count.',
      { code: `# Same with a DataFrame (Spark SQL)
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("AvgMarks").getOrCreate()
df = spark.read.csv("marks.csv", header=True, inferSchema=True)
df.groupBy("subject").avg("marks").show()` },
    ],
    sources: [`${N} (Unit 5)`, MID],
  },

  'bda-mid-spark-trends': {
    blocks: [
      'Spark processes large volumes of academic data (marks, attendance, courses, semesters) in memory, fast enough to explore it interactively and at scale:',
      { steps: ['**Ingest**: read marks, attendance and student data from CSV/HDFS/databases into DataFrames (spark.read.csv, JDBC).', '**Clean and integrate**: handle missing or invalid marks, standardise subject names, join tables on roll number with Spark SQL.', '**Aggregate**: average marks and pass percentage by subject, semester, section and year (groupBy/agg, pivot).', '**Find trends**: compare averages over semesters/years to see improving or declining subjects; window functions for each student\'s change across semesters; correlation between attendance and marks (df.stat.corr).', '**Predict and segment**: MLlib linear regression to predict final marks; k-means to cluster students into high performers, average and at-risk.', '**Present and act**: save results to Hive/Parquet, visualise in dashboards, alert mentors about at-risk students.'] },
      { code: `from pyspark.sql.functions import avg, count, sum as _sum, when, col
trend = (df.groupBy("year", "semester", "subject")
           .agg(avg("marks").alias("avg_marks"),
                (_sum(when(col("marks") >= 40, 1).otherwise(0)) / count("*")).alias("pass_rate"))
           .orderBy("subject", "year", "semester"))
trend.show()
print(df.stat.corr("attendance", "marks"))` },
      'Benefits: in-memory speed for iterative analysis, one engine for SQL, ML and streaming (live results as marks are entered), and scalability to every student across years.',
    ],
    sources: [`${N} (Unit 5)`, MID],
  },
}
