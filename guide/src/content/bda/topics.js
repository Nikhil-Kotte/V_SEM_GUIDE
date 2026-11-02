// Big Data Analytics — Mid-2 notes. Keys are syllabus ids from content/syllabus.js.
export default {
  // ======================= UNIT III (rest) =======================
  'bda.u3.yarn-intro': {
    oneLine: 'YARN (Yet Another Resource Negotiator) is Hadoop 2\'s cluster manager: it separates "who gets which machines" from "how the job runs", so many kinds of apps can share one Hadoop cluster.',
    blocks: [
      { h: 'Why YARN was needed' },
      'In Hadoop 1, the single **JobTracker** did everything: resource management, scheduling *and* monitoring every MapReduce task. It became a bottleneck (scaled to ~4,000 nodes), was a single point of failure, used fixed map/reduce slots that wasted capacity, and could only run MapReduce.',
      { analogy: 'Hadoop 1 is a restaurant where the owner also cooks every dish. YARN hires a manager who only assigns kitchens (ResourceManager) and lets each order have its own chef (ApplicationMaster).' },
      { table: { head: ['', 'MapReduce v1 (Hadoop 1)', 'YARN (Hadoop 2)'], rows: [
        ['Role', 'Processing framework that also managed resources', 'Resource-management framework only'],
        ['Master', 'JobTracker (one for everything)', 'ResourceManager + one ApplicationMaster per app'],
        ['Workers', 'TaskTrackers with fixed map/reduce slots', 'NodeManagers with flexible containers'],
        ['Workloads', 'MapReduce only', 'MapReduce, Spark, Tez, streaming…'],
        ['Scale', '~4,000 nodes', '10,000+ nodes'],
      ] } },
      { h: 'Benefits' },
      { ul: ['**Scalability**', '**Multi-tenancy**: many engines share one cluster', '**Better utilisation**: containers instead of fixed slots', '**Compatibility**: old MapReduce jobs still run'] },
    ],
    terms: [['JobTracker', 'Hadoop 1 master that managed both resources and jobs.'], ['Container', 'A bundle of CPU and memory on one node, granted by YARN.']],
    exam: 'Limitations of Hadoop 1 → what YARN changes → MapReduce vs YARN table → benefits.',
    revise: ['YARN = resource management split from processing', 'Hadoop 1 JobTracker was a bottleneck'],
  },

  'bda.u3.yarn-arch': {
    oneLine: 'YARN has one ResourceManager for the cluster, a NodeManager on every machine, an ApplicationMaster per application, and containers where the work actually runs.',
    blocks: [
      { img: 'bda-yarn-arch' },
      { table: { head: ['Component', 'What it does'], rows: [
        ['**ResourceManager (RM)**', 'Master daemon, one per cluster. Its **Scheduler** hands out resources (it doesn\'t monitor tasks); its **ApplicationsManager** accepts jobs and starts each job\'s ApplicationMaster.'],
        ['**NodeManager (NM)**', 'Runs on every worker. Launches containers, watches their CPU/memory use, and reports node health to the RM through heartbeats.'],
        ['**ApplicationMaster (AM)**', 'One per application. Negotiates containers from the RM, works with NMs to run tasks, tracks progress, and restarts failed tasks.'],
        ['**Container**', 'A slice of resources (memory, CPU cores) on one node where a task runs.'],
      ] } },
      { h: 'Schedulers' },
      { ul: ['**FIFO**: first come, first served.', '**Capacity scheduler**: queues with guaranteed shares per team.', '**Fair scheduler**: all running apps get an equal share over time.'] },
    ],
    terms: [['ResourceManager', 'Cluster-wide master that allocates resources.'], ['ApplicationMaster', 'Per-application coordinator.'], ['NodeManager', 'Per-node agent that runs containers.']],
    exam: 'Draw the architecture (client → RM ↔ NMs with containers and AMs) and describe the four components.',
    revise: ['RM (Scheduler + ApplicationsManager), NM, AM, Container', 'Schedulers: FIFO, Capacity, Fair'],
  },

  'bda.u3.yarn-manage': {
    oneLine: 'YARN runs an application in a fixed sequence: submit to the ResourceManager, start an ApplicationMaster in a container, the AM asks for more containers, NodeManagers run the tasks, and the AM reports back.',
    blocks: [
      { img: 'bda-yarn-flow' },
      { steps: [
        'The **client submits** the application to the ResourceManager.',
        'The RM allocates a container and asks a NodeManager to **launch the ApplicationMaster** in it.',
        'The AM **registers** with the RM.',
        'The AM **requests containers** (resource requests: memory, cores, preferred nodes for data locality).',
        'The RM\'s scheduler **grants** containers.',
        'The AM tells the NodeManagers to **launch tasks** in those containers.',
        'Tasks report **progress** to the AM; the client can poll the RM/AM for status.',
        'When finished, the AM **unregisters** and its containers are released.',
      ] },
      { h: 'Managing resources' },
      { ul: ['Resources are memory + vcores; limits are set in `yarn-site.xml`.', 'Queues (capacity/fair scheduler) divide the cluster between teams.', '**Data locality**: the AM asks for containers on nodes that hold the HDFS blocks.', 'Fault tolerance: failed tasks are re-run by the AM; a failed AM is restarted by the RM.'] },
      { h: 'Useful commands' },
      { code: `yarn application -list          # running apps
yarn application -kill <appId>   # stop an app
yarn node -list                  # NodeManagers and their state
yarn logs -applicationId <appId> # collected logs` },
    ],
    terms: [['Resource request', 'AM\'s ask for containers with given memory/cores/locality.'], ['Heartbeat', 'Periodic status message from NM or AM to the RM.']],
    exam: 'The 8 numbered steps alongside the workflow figure, then 3 points on resource management.',
    revise: ['Submit → launch AM → AM requests containers → NMs run tasks → AM unregisters'],
  },

  // ======================= UNIT IV — Hive =======================
  'bda.u4.hive-intro': {
    oneLine: 'Hive is a data-warehouse layer on Hadoop that lets you query huge files in HDFS with an SQL-like language (HiveQL) instead of writing MapReduce code.',
    blocks: [
      'Built at Facebook, now Apache. You define tables over files already in HDFS; Hive converts your HiveQL query into MapReduce/Tez/Spark jobs.',
      { h: 'Features' },
      { ul: ['SQL-like **HiveQL**; easy for analysts.', '**Schema on read**: the schema is applied when you read, not when data is loaded.', 'Metadata kept in a **metastore**.', 'Partitions and buckets for faster queries.', 'Many file formats; user-defined functions.', 'Designed for **batch analytics (OLAP)**, not real-time transactions.'] },
      { h: 'Hive vs traditional RDBMS' },
      { table: { head: ['', 'Hive', 'RDBMS'], rows: [
        ['Schema', 'Schema on read', 'Schema on write'],
        ['Use', 'OLAP, analytics on huge data', 'OLTP, transactions'],
        ['Data size', 'Petabytes', 'Gigabytes–terabytes'],
        ['Latency', 'High (batch jobs)', 'Low (milliseconds)'],
        ['Updates/deletes', 'Limited (ACID only on special tables)', 'Full support'],
        ['Scaling', 'Horizontal (add nodes)', 'Mostly vertical'],
        ['Storage', 'HDFS files', 'Own storage engine'],
      ] } },
    ],
    terms: [['Schema on read', 'Structure is applied when data is queried.'], ['OLAP', 'Online analytical processing.']],
    exam: 'Definition + features + the Hive vs RDBMS table. Very frequently asked.',
    revise: ['Hive = SQL on Hadoop, batch, schema on read', 'Not for OLTP'],
  },

  'bda.u4.hive-arch': {
    oneLine: 'A Hive query flows from a client to the driver, which compiles and optimises it using table info from the metastore, then runs it as jobs on Hadoop (YARN + HDFS).',
    blocks: [
      { img: 'bda-hive-arch' },
      { table: { head: ['Component', 'Role'], rows: [
        ['**Clients / UI**', 'Hive CLI, Beeline, web UI; Thrift, JDBC and ODBC clients for applications'],
        ['**HiveServer2**', 'Server that accepts queries from remote clients (multi-user, secure)'],
        ['**Driver**', 'Receives the query, manages the session, coordinates compile and execute'],
        ['**Compiler**', 'Parses the query, checks it against the metastore, builds an execution plan (DAG of stages)'],
        ['**Optimizer**', 'Rewrites the plan for efficiency (predicate pushdown, joins)'],
        ['**Metastore**', 'Stores table schemas, partitions and HDFS locations in a relational DB (Derby/MySQL)'],
        ['**Execution engine**', 'Runs the plan as MapReduce/Tez/Spark jobs on YARN'],
        ['**HDFS**', 'Holds the actual table data'],
      ] } },
      { h: 'How a query is executed' },
      { steps: ['**executeQuery**: UI sends the query to the driver.', '**getPlan**: driver asks the compiler for a plan.', '**getMetaData / sendMetaData**: compiler fetches table info from the metastore.', '**sendPlan**: compiler returns the plan to the driver.', '**executePlan**: driver hands it to the execution engine.', '**executeJob**: engine submits jobs to YARN; tasks read HDFS.', '**fetchResults / sendResults**: results come back to the driver and the UI.'] },
    ],
    terms: [['Metastore', 'Catalog of Hive tables, partitions and their HDFS locations.'], ['HiveServer2', 'Service for remote, concurrent Hive clients.']],
    exam: 'Draw the layered architecture (clients → services → processing → storage), describe each component, then the 7-step query flow.',
    revise: ['Client → driver → compiler (+metastore) → optimizer → execution engine → YARN/HDFS'],
  },

  'bda.u4.hive-types': {
    oneLine: 'Hive has primitive types like numbers, strings, booleans and dates, plus complex types — ARRAY, MAP, STRUCT and UNIONTYPE — for nested data.',
    blocks: [
      { table: { head: ['Category', 'Types'], rows: [
        ['Integers', 'TINYINT (1 byte), SMALLINT (2), INT (4), BIGINT (8)'],
        ['Decimals', 'FLOAT, DOUBLE, DECIMAL(p, s)'],
        ['Text', 'STRING, VARCHAR(n), CHAR(n)'],
        ['Others', 'BOOLEAN, BINARY'],
        ['Date/time', 'DATE, TIMESTAMP, INTERVAL'],
      ] } },
      { h: 'Complex types' },
      { table: { head: ['Type', 'Example', 'Access'], rows: [['ARRAY<T>', "array('CSE','IT')", 'subjects[0]'], ['MAP<K,V>', "map('maths', 90)", "marks['maths']"], ['STRUCT<…>', 'struct(city:string, pin:int)', 'address.city'], ['UNIONTYPE<…>', 'one of several types', '—']] } },
      { code: `CREATE TABLE student (
  id INT, name STRING,
  subjects ARRAY<STRING>,
  marks MAP<STRING, INT>,
  address STRUCT<city:STRING, pin:INT>)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
COLLECTION ITEMS TERMINATED BY '|'
MAP KEYS TERMINATED BY ':';` },
    ],
    terms: [['STRUCT', 'Group of named fields, like a record.'], ['MAP', 'Key–value pairs.']],
    exam: 'Two tables (primitive and complex) and a CREATE TABLE using all three complex types.',
    revise: ['Primitive: TINYINT…BIGINT, FLOAT, DOUBLE, DECIMAL, STRING, BOOLEAN, DATE, TIMESTAMP', 'Complex: ARRAY, MAP, STRUCT, UNIONTYPE'],
  },

  'bda.u4.hive-formats': {
    oneLine: 'Hive can store tables as plain text, SequenceFiles, or column-oriented formats like RCFile, ORC and Parquet; columnar formats read only the columns a query needs.',
    blocks: [
      { table: { head: ['Format', 'Layout', 'Good for'], rows: [
        ['TEXTFILE', 'Plain delimited text (default)', 'Simple loading, human-readable; slow and big'],
        ['SEQUENCEFILE', 'Binary key–value records, splittable, compressible', 'Intermediate data'],
        ['**RCFILE**', 'Row groups stored column-wise', 'Analytical queries on few columns'],
        ['ORC', 'Optimized RC: stripes + indexes + statistics', 'Fast Hive queries, ACID tables'],
        ['PARQUET', 'Columnar, nested data, cross-tool', 'Spark/Hive/Impala sharing'],
        ['AVRO', 'Row-based with embedded schema', 'Schema evolution, data exchange'],
      ] } },
      { h: 'RCFile (Record Columnar File)' },
      { steps: ['The table is split **horizontally** into **row groups** (e.g. 4 MB each).', 'Inside a row group, data is stored **column by column** (all values of column 1, then column 2…).', 'Each row group has a **sync marker**, a **metadata header** (number of rows, column lengths) and the **column data**, each column compressed separately.'] },
      { ul: ['Fast loading (still row groups).', 'Fast queries: only needed columns are read and decompressed (**column pruning**).', 'Good compression: similar values are stored together.', 'Rows of one group stay on one HDFS block, so a full row can be rebuilt locally.'] },
      { code: `CREATE TABLE marks_rc (id INT, subject STRING, score INT)
STORED AS RCFILE;
INSERT OVERWRITE TABLE marks_rc SELECT * FROM marks_text;` },
    ],
    terms: [['Row group', 'Horizontal slice of an RCFile table.'], ['Columnar storage', 'Storing each column\'s values together.']],
    exam: 'List the file formats in a table, then explain RCFile with a row-group diagram and its advantages.',
    revise: ['TEXTFILE, SEQUENCEFILE, RCFILE, ORC, PARQUET, AVRO', 'RCFile = row groups stored column-wise'],
  },

  'bda.u4.hiveql': {
    oneLine: 'HiveQL is Hive\'s SQL dialect: DDL to create databases and tables over HDFS data, LOAD to bring files in, and SELECT with GROUP BY, JOIN and aggregates to analyse them.',
    blocks: [
      { h: 'Database commands' },
      { code: `CREATE DATABASE IF NOT EXISTS college;
SHOW DATABASES;
USE college;
ALTER DATABASE college SET DBPROPERTIES ('owner'='cse');
DROP DATABASE IF EXISTS college CASCADE;` },
      { h: 'Table commands' },
      { code: `CREATE TABLE IF NOT EXISTS marks (
  roll INT, name STRING, subject STRING, score INT)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE;

LOAD DATA LOCAL INPATH '/home/cse/marks.csv' INTO TABLE marks;

ALTER TABLE marks ADD COLUMNS (semester INT);
ALTER TABLE marks RENAME TO student_marks;
DESCRIBE student_marks;
DROP TABLE IF EXISTS student_marks;` },
      { h: 'Querying' },
      { code: `-- average per subject
SELECT subject, AVG(score) AS avg_score, MAX(score), MIN(score)
FROM marks GROUP BY subject ORDER BY avg_score;

-- top 5 students by total
SELECT roll, name, SUM(score) AS total
FROM marks GROUP BY roll, name
ORDER BY total DESC LIMIT 5;

-- students who failed any subject
SELECT DISTINCT name FROM marks WHERE score < 40;` },
      { h: 'Partitions and buckets' },
      { ul: ['**Partitioning** splits a table into folders by a column (e.g. `PARTITIONED BY (year INT)`), so queries on one year read only that folder.', '**Bucketing** hashes a column into a fixed number of files (`CLUSTERED BY (roll) INTO 4 BUCKETS`) for sampling and faster joins.'] },
      { h: 'Aggregate functions' },
      'COUNT, SUM, AVG, MIN, MAX, plus string (CONCAT, UPPER), date (YEAR, DATEDIFF) and conditional (IF, CASE) functions.',
    ],
    terms: [['Managed vs external table', 'Dropping a managed table deletes the data; dropping an EXTERNAL table keeps the HDFS files.'], ['Partition', 'Sub-directory per value of a column.']],
    exam: 'Write runnable HiveQL: CREATE DATABASE/TABLE (with ROW FORMAT), LOAD DATA, then 2-3 SELECT queries with GROUP BY and ORDER BY. Script questions are worth 5–7 marks.',
    revise: ['CREATE / USE / ALTER / DROP DATABASE', 'CREATE TABLE … ROW FORMAT DELIMITED … STORED AS', 'LOAD DATA [LOCAL] INPATH'],
  },

  'bda.u4.hive-udf': {
    oneLine: 'When HiveQL\'s built-in functions aren\'t enough, you write a UDF in Java, package it as a JAR, register it, and call it like any other function.',
    blocks: [
      { table: { head: ['Kind', 'Input → output', 'Example'], rows: [['**UDF**', 'One row → one value', 'UPPER(name), grade(score)'], ['**UDAF**', 'Many rows → one value (aggregate)', 'SUM, custom median'], ['**UDTF**', 'One row → many rows', 'explode(array)']] } },
      { h: 'Steps' },
      { steps: ['Write a Java class that extends `org.apache.hadoop.hive.ql.exec.UDF` (or `GenericUDF`) with an `evaluate()` method.', 'Compile and package it as a JAR.', 'In Hive: `ADD JAR /path/grade-udf.jar;`', '`CREATE TEMPORARY FUNCTION grade AS \'edu.cbit.GradeUDF\';`', 'Use it: `SELECT name, grade(score) FROM marks;`'] },
      { code: `public class GradeUDF extends UDF {
    public Text evaluate(IntWritable score) {
        if (score == null) return null;
        int s = score.get();
        return new Text(s >= 90 ? "O" : s >= 75 ? "A" : s >= 60 ? "B" : s >= 40 ? "C" : "F");
    }
}` },
    ],
    terms: [['UDF', 'User-defined function: one row in, one value out.'], ['UDTF', 'Table-generating function: one row in, many out.']],
    exam: 'UDF vs UDAF vs UDTF table, the 5 steps and a short Java evaluate() example.',
    revise: ['Extend UDF → evaluate()', 'ADD JAR → CREATE TEMPORARY FUNCTION → use'],
  },

  // ======================= UNIT IV — Pig =======================
  'bda.u4.pig-intro': {
    oneLine: 'Apache Pig is a high-level platform for processing big data with Pig Latin, a step-by-step data-flow language that Pig turns into MapReduce jobs on Hadoop.',
    blocks: [
      'Developed at Yahoo so programmers could write data pipelines in a few lines instead of long Java MapReduce programs (≈1/20th of the code).',
      { h: 'Why Pig Latin is needed' },
      { ul: ['Writing joins, grouping and filtering in raw MapReduce is long and error-prone.', 'Pig Latin is **procedural**: you describe the data flow step by step (load → filter → group → store).', 'Handles structured and semi-structured data; schema is optional.', 'Built-in optimisation and extensibility through UDFs.'] },
      { h: 'Anatomy of Pig' },
      { img: 'bda-pig-anatomy' },
      { steps: ['**Grunt shell / Pig server**: where scripts are entered.', '**Parser**: checks syntax and types, produces a logical plan (a DAG).', '**Optimizer**: applies rules like pushing filters early and merging projections.', '**Compiler**: converts the plan into a series of MapReduce jobs.', '**Execution engine**: submits the jobs to Hadoop in order; results go to HDFS.'] },
      { h: 'Pig on Hadoop' },
      'Pig itself runs on the client machine; it needs no installation on the cluster. It launches ordinary MapReduce (or Tez/Spark) jobs on YARN that read and write HDFS.',
      { h: 'Pig in practice / vs databases' },
      'Used for ETL pipelines, log processing, cleaning raw data before loading into Hive, and research on large datasets. Unlike a database, Pig has no indexes, transactions or random writes; it processes whole datasets in batch and doesn\'t need data loaded into tables first.',
    ],
    terms: [['Pig Latin', 'Pig\'s data-flow scripting language.'], ['Grunt', 'Pig\'s interactive shell.']],
    exam: 'Definition + need for Pig Latin + anatomy figure with the 5 stages + Pig vs databases in 3 lines.',
    revise: ['Pig = data-flow scripts → MapReduce', 'Grunt → parser → optimizer → compiler → execution engine'],
  },

  'bda.u4.pig-types': {
    oneLine: 'Pig\'s data model nests four levels: an atom (single value) inside a tuple (row) inside a bag (collection of tuples), with maps for key–value data; a relation is just an outer bag.',
    blocks: [
      { img: 'bda-pig-model' },
      { table: { head: ['Type', 'Meaning', 'Example'], rows: [
        ['**Atom** (scalar)', 'A single value: int, long, float, double, chararray, bytearray, boolean, datetime, biginteger, bigdecimal', "'Megha', 88"],
        ['**Tuple**', 'Ordered set of fields (a row)', "(101, 'Megha', 88)"],
        ['**Bag**', 'Unordered collection of tuples; duplicates allowed', "{(101,'Megha'), (103,'Preethi')}"],
        ['**Map**', 'Set of key#value pairs; keys are chararrays', "['dept'#'CSE', 'gpa'#8.8]"],
        ['**Relation**', 'An outer bag — what LOAD and every operator produce', 'students'],
      ] } },
      '`bytearray` is the default type when no schema is given. Fields are referred to by name or position ($0, $1…).',
      { code: `students = LOAD 'students.csv' USING PigStorage(',')
           AS (id:int, name:chararray, dept:chararray, marks:int);
DESCRIBE students;
-- students: {id: int, name: chararray, dept: chararray, marks: int}` },
    ],
    terms: [['Bag', 'Collection of tuples, written in { }.'], ['Tuple', 'Ordered fields, written in ( ).'], ['Map', 'Key–value pairs, written in [ ].']],
    exam: 'Explain atom, tuple, bag, map and relation with the brackets notation and an example each.',
    revise: ['Atom < tuple ( ) < bag { } ; map [ ]', 'Relation = outer bag'],
  },

  'bda.u4.pig-run': {
    oneLine: 'Pig runs in local mode (one machine, local files) or MapReduce mode (on the Hadoop cluster, HDFS files), either interactively in the Grunt shell or as a script file.',
    blocks: [
      { compare: [
        { title: 'Local mode', items: ['`pig -x local`', 'Single JVM, local file system', 'For testing on small data'] },
        { title: 'MapReduce (HDFS) mode', items: ['`pig` or `pig -x mapreduce`', 'Runs MapReduce jobs on the cluster, reads HDFS', 'For real, large data'] },
      ] },
      'Newer versions also support `-x tez` and `-x spark`.',
      { h: 'Ways to run' },
      { ul: ['**Interactive**: type statements in the Grunt shell.', '**Batch**: put statements in a file and run `pig script.pig`.', '**Embedded**: call Pig from Java/Python programs (PigServer).'] },
      { h: 'Installing' },
      'Download and unpack Pig, set `PIG_HOME` and add `$PIG_HOME/bin` to PATH, point it to Hadoop (`HADOOP_HOME`), then run `pig -version` to check.',
      { h: 'HDFS commands from Grunt' },
      { code: `grunt> fs -ls /user/cse
grunt> fs -mkdir /user/cse/input
grunt> fs -put students.csv /user/cse/input
grunt> fs -cat /user/cse/output/part-r-00000
grunt> fs -copyToLocal /user/cse/output ./out
grunt> sh ls          -- run a local shell command
grunt> exec script.pig -- run a script` },
    ],
    terms: [['Local mode', 'Pig runs on one machine against local files.'], ['Grunt', 'Interactive Pig shell.']],
    exam: 'Two execution modes with commands, three ways to run, and a few `fs` commands.',
    revise: ['pig -x local vs pig -x mapreduce', 'Grunt (interactive), script (batch), embedded', 'fs -ls / -put / -cat'],
  },

  'bda.u4.pig-operators': {
    oneLine: 'Pig Latin scripts are chains of relational operators — LOAD, FILTER, FOREACH…GENERATE, GROUP, JOIN, ORDER, STORE — with eval functions like COUNT, SUM, AVG and MAX doing the maths.',
    blocks: [
      { table: { head: ['Operator', 'Purpose'], rows: [
        ['LOAD / STORE / DUMP', 'Read data / write to HDFS / print to screen'],
        ['FILTER … BY', 'Keep tuples matching a condition'],
        ['FOREACH … GENERATE', 'Transform each tuple (select/compute columns)'],
        ['GROUP … BY', 'Group tuples by key → (group, bag)'],
        ['COGROUP', 'Group two relations together'],
        ['JOIN … BY', 'Inner/outer join'],
        ['ORDER … BY', 'Sort'],
        ['DISTINCT, LIMIT, UNION, SPLIT', 'Remove duplicates, take n, combine, split into several'],
        ['DESCRIBE, EXPLAIN, ILLUSTRATE', 'Show schema, plans, sample run'],
      ] } },
      { h: 'Eval (built-in) functions' },
      'AVG, COUNT, COUNT_STAR, SUM, MIN, MAX, CONCAT, SIZE, TOKENIZE, IsEmpty, DIFF, BagToString.',
      { h: 'Script: load, filter, group (May \'26 style)' },
      { code: `students = LOAD '/data/students.csv' USING PigStorage(',')
           AS (id:int, name:chararray, dept:chararray, marks:int);
passed   = FILTER students BY marks >= 40;
by_dept  = GROUP passed BY dept;
report   = FOREACH by_dept GENERATE group AS dept,
             COUNT(passed) AS n, AVG(passed.marks) AS avg_marks;
sorted   = ORDER report BY avg_marks DESC;
STORE sorted INTO '/out/dept_report' USING PigStorage(',');` },
      { h: 'Max temperature per year (NCDC, Jun \'24)' },
      { code: `records  = LOAD 'input/ncdc/sample.txt'
           AS (year:chararray, temperature:int, quality:int);
filtered = FILTER records BY temperature != 9999 AND
           (quality == 0 OR quality == 1 OR quality == 4 OR quality == 5 OR quality == 9);
grouped  = GROUP filtered BY year;
max_temp = FOREACH grouped GENERATE group, MAX(filtered.temperature);
DUMP max_temp;` },
      { h: 'Word count' },
      { code: `lines  = LOAD 'shivneri.txt' AS (line:chararray);
words  = FOREACH lines GENERATE FLATTEN(TOKENIZE(line)) AS word;
grp    = GROUP words BY word;
counts = FOREACH grp GENERATE group, COUNT(words);
DUMP counts;` },
    ],
    terms: [['FLATTEN', 'Un-nests a bag or tuple into separate rows/fields.'], ['PigStorage', 'Default load/store function for delimited text.']],
    exam: 'Operator table, then a complete script with LOAD → FILTER → GROUP → FOREACH → STORE. Annotate each line.',
    revise: ['LOAD, FILTER, FOREACH…GENERATE, GROUP, JOIN, ORDER, STORE/DUMP', 'COUNT, SUM, AVG, MAX, TOKENIZE'],
  },

  'bda.u4.pig-udf': {
    oneLine: 'Pig can be extended with your own functions (UDFs) in Java or Python, and Piggy Bank is a shared library of ready-made UDFs you can register and reuse.',
    blocks: [
      { h: 'Writing a Java UDF' },
      { code: `public class UPPER extends EvalFunc<String> {
    public String exec(Tuple input) throws IOException {
        if (input == null || input.size() == 0) return null;
        return ((String) input.get(0)).toUpperCase();
    }
}` },
      { code: `REGISTER myudfs.jar;
students = LOAD 'students.csv' USING PigStorage(',') AS (id:int, name:chararray);
upper    = FOREACH students GENERATE myudfs.UPPER(name);` },
      'Types of UDFs: **eval** functions (most common), **filter** functions (return boolean, extend FilterFunc), **load/store** functions (custom formats).',
      'Python (Jython) UDFs: decorate with `@outputSchema("name:chararray")`, then `REGISTER \'udf.py\' USING jython AS myfuncs;`.',
      { h: 'Piggy Bank' },
      'A community repository of Java UDFs contributed by users (string, math, date and loader functions such as CSVExcelStorage). Use it with `REGISTER piggybank.jar;` and optionally `DEFINE` a short alias: `DEFINE CSV org.apache.pig.piggybank.storage.CSVExcelStorage();`.',
    ],
    terms: [['EvalFunc', 'Base Java class for Pig eval UDFs.'], ['REGISTER', 'Adds a JAR/script so its UDFs can be used.'], ['DEFINE', 'Gives a UDF a short alias.']],
    exam: 'Types of UDFs, a small Java EvalFunc, the REGISTER/use lines, and what Piggy Bank is.',
    revise: ['Extend EvalFunc → exec(Tuple)', 'REGISTER jar → use', 'Piggy Bank = shared UDF library'],
  },

  'bda.u4.pig-vs-hive': {
    oneLine: 'Pig and Hive both turn high-level code into Hadoop jobs: Pig is a procedural data-flow language for programmers doing ETL, Hive is declarative SQL for analysts doing reporting.',
    blocks: [
      { table: { head: ['Feature', 'Pig', 'Hive'], rows: [
        ['Language', 'Pig Latin (procedural data flow)', 'HiveQL (declarative, SQL-like)'],
        ['Users', 'Programmers, data engineers, researchers', 'Analysts, SQL developers'],
        ['Main use', 'ETL, data pipelines, cleaning raw data', 'Data warehousing, reporting, ad-hoc queries'],
        ['Data', 'Structured and semi-structured', 'Mostly structured'],
        ['Schema', 'Optional', 'Required (metastore)'],
        ['Metadata store', 'None', 'Metastore'],
        ['Runs on', 'Client side; launches MapReduce/Tez', 'HiveServer2 service; MapReduce/Tez/Spark'],
        ['Partitions', 'No native concept', 'Yes'],
        ['JDBC/ODBC', 'No', 'Yes'],
      ] } },
      { h: 'Pig vs MapReduce' },
      { ul: ['Pig: high-level, ~20× less code, joins are one line, no compilation step.', 'MapReduce: low-level Java, verbose, joins are hard, needs compiling and packaging.'] },
    ],
    terms: [['Procedural', 'You say how, step by step.'], ['Declarative', 'You say what result you want.']],
    exam: 'A 6–8 row comparison table and one line on when to choose each.',
    revise: ['Pig: procedural ETL for programmers', 'Hive: declarative SQL for analysts'],
  },

  // ======================= UNIT V — Spark =======================
  'bda.u5.spark-intro': {
    oneLine: 'Apache Spark is a fast, general-purpose cluster computing engine that keeps data in memory between steps, making it far quicker than disk-based MapReduce for iterative and interactive work.',
    blocks: [
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
    ],
    terms: [['SparkContext', 'Entry point that connects the driver to the cluster.'], ['Executor', 'Worker process that runs tasks and caches data.']],
    exam: 'Draw driver ↔ cluster manager ↔ executors, explain each, then the layered stack. The "role of the driver" is a common 5-marker.',
    revise: ['Driver (SparkContext) → cluster manager → executors → tasks', 'Layers: storage, resource mgmt, core, libraries, APIs'],
  },

  'bda.u5.rdd': {
    oneLine: 'An RDD (Resilient Distributed Dataset) is Spark\'s core data structure: an immutable collection split into partitions across the cluster, rebuilt from its lineage if a partition is lost.',
    blocks: [
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
    ],
    terms: [['Shuffle', 'Redistributing data across partitions by key (expensive).'], ['Narrow dependency', 'Each child partition depends on one parent partition.']],
    exam: 'Comparison table (transformation vs action, narrow vs wide) and a short PySpark program with comments marking each as transformation or action.',
    revise: ['Transformations lazy → new RDD; actions trigger → value', 'Narrow: map, filter, flatMap; wide: groupByKey, reduceByKey, join'],
  },

  'bda.u5.dag': {
    oneLine: 'Spark turns your chain of transformations into a DAG (directed acyclic graph); when an action runs, the DAG scheduler splits it into stages at shuffle boundaries and each stage into parallel tasks.',
    blocks: [
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
    ],
    terms: [['Job', 'All work triggered by one action.'], ['Stage', 'Set of tasks with no shuffle between them.'], ['Task', 'Work on one partition in one stage.']],
    exam: 'Define DAG, draw job → stages → tasks, explain stage boundaries at shuffles and lazy evaluation, and give the word-count example.',
    revise: ['Action → job → stages (split at shuffles) → tasks', 'Narrow ops pipelined in one stage'],
  },

  'bda.u5.case-study': {
    oneLine: 'Case study: load student records into Spark, clean them, then group and sort to find department trends, how hard each department/subject is, and the top performers.',
    blocks: [
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
    ],
    terms: [['groupBy + agg', 'Group rows and compute aggregates per group.']],
    exam: 'Describe the pipeline (load → clean → aggregate → rank → report) and write the key Spark lines for each step with sample results.',
    revise: ['Difficulty = lowest average per subject/department', 'Top performers = orderBy(desc).limit(n)', 'Pipeline: load, clean, aggregate, rank, report'],
  },
}
