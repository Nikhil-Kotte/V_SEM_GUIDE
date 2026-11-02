// BDA Unit IV model answers (Hive and Pig). Keyed by PYQ id.
const U4 = 'BDA Unit-4 slides (Unit-4.pptx)'
const W = 'Tom White, Hadoop: The Definitive Guide'

const HIVE_DDL = `-- databases
CREATE DATABASE IF NOT EXISTS college COMMENT 'CSE data'
  WITH DBPROPERTIES ('creator'='cse');
SHOW DATABASES;
DESCRIBE DATABASE EXTENDED college;
USE college;
ALTER DATABASE college SET DBPROPERTIES ('edited-by'='hod');
ALTER DATABASE college SET OWNER USER admin;
DROP DATABASE IF EXISTS college;            -- fails if it still has tables
DROP DATABASE IF EXISTS college CASCADE;    -- drops its tables too

-- tables
CREATE TABLE IF NOT EXISTS student (roll INT, name STRING, dept STRING, cgpa FLOAT)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE;
LOAD DATA LOCAL INPATH '/home/cse/student.csv' INTO TABLE student;
SHOW TABLES;
DESCRIBE student;
ALTER TABLE student ADD COLUMNS (phone STRING);
ALTER TABLE student CHANGE cgpa gpa FLOAT;
ALTER TABLE student RENAME TO students;
DROP TABLE IF EXISTS students;`

const MARKS_HQL = `CREATE DATABASE IF NOT EXISTS university;
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

-- 4. students scoring above the subject average
SELECT m.name, m.subject, m.score
FROM marks m JOIN (SELECT subject, AVG(score) AS a FROM marks GROUP BY subject) s
  ON m.subject = s.subject
WHERE m.score > s.a;`

const NCDC_PIG = `-- 1. load: each line has year, temperature, quality code
records  = LOAD 'input/ncdc/sample.txt'
           AS (year:chararray, temperature:int, quality:int);
-- 2. remove missing readings (9999) and bad quality codes
filtered = FILTER records BY temperature != 9999 AND
           (quality == 0 OR quality == 1 OR quality == 4 OR quality == 5 OR quality == 9);
-- 3. group by year
grouped  = GROUP filtered BY year;
-- 4. highest temperature in each group
max_temp = FOREACH grouped GENERATE group, MAX(filtered.temperature);
-- 5. output
DUMP max_temp;      -- e.g. (1949,111) (1950,22)`

const STUDENT_PIG = `s = LOAD '/data/students.csv' USING PigStorage(',')
    AS (id:int, name:chararray, dept:chararray, marks:int);
p = FILTER s BY marks >= 40;                         -- filtering
g = GROUP p BY dept;                                 -- grouping
r = FOREACH g GENERATE group AS dept,
        COUNT(p) AS passed, AVG(p.marks) AS avg_marks;
o = ORDER r BY avg_marks DESC;
STORE o INTO '/out/dept' USING PigStorage(',');       -- or DUMP o;`

export default {
  // ---------------- Hive ----------------
  'bda-hive-query': {
    blocks: [
      '**Querying data in Hive** means retrieving and analysing data stored in **HDFS** using **HiveQL**, a SQL-like language. Hive translates each query into jobs (MapReduce, Tez or Spark) that run on the Hadoop cluster, so users can analyse huge datasets without writing Java code.',
      { code: 'SELECT dept, AVG(cgpa) FROM student WHERE cgpa > 6 GROUP BY dept ORDER BY dept;' },
      'Supported: SELECT, WHERE, GROUP BY, HAVING, ORDER BY / SORT BY, JOINs, subqueries, built-in and user-defined functions.',
    ],
    sources: [`${U4} slides 3–8`],
  },

  'bda-hive-shell': {
    blocks: [
      'The **Hive shell (CLI)** is the primary command-line interface for interacting with Hive. Its purpose:',
      { ul: ['**Run HiveQL** statements interactively: DDL (CREATE/ALTER/DROP), DML (LOAD, INSERT) and queries.', '**Manage metadata**: SHOW DATABASES/TABLES, DESCRIBE.', '**Run scripts**: `hive -f script.hql`, or a single query `hive -e "SELECT …"`.', '**Set configuration**: `SET hive.exec.reducers.max=10;`.', '**Run HDFS and shell commands** from inside Hive: `dfs -ls /user;`, `!ls;`.'] },
      'Today **Beeline** (a JDBC client of HiveServer2) is the recommended shell.',
    ],
    sources: [`${U4} slides 9–11`, `${W} ch. 17 (the Hive shell)`],
  },

  'bda-hive-arch': {
    blocks: [
      '**Hive** is a data-warehouse infrastructure built on Hadoop for querying and analysing large datasets in HDFS using HiveQL. Its architecture:',
      { img: 'bda-hive-arch' },
      { h: 'Components' },
      { ul: [
        '**User interfaces / clients**: Hive CLI, Beeline, Hive Web UI; applications connect through **Thrift, JDBC and ODBC** clients to **HiveServer2**.',
        '**Driver**: receives queries, creates a session, and coordinates their compilation and execution (like a controller).',
        '**Compiler**: parses the query, does semantic analysis and type checking using metadata from the metastore, and generates an **execution plan** (a DAG of stages).',
        '**Optimizer**: transforms the plan (predicate pushdown, column pruning, partition pruning, join reordering) for better performance.',
        '**Metastore**: stores **metadata**: databases, tables, columns and types, partitions, SerDe, and HDFS locations, in an RDBMS such as Derby or MySQL.',
        '**Execution engine**: runs the plan\'s stages as jobs on **YARN** (MapReduce, Tez or Spark), managing dependencies between stages.',
        '**HDFS / storage**: holds the actual table data.',
      ] },
      { h: 'How a HiveQL query is executed in Hadoop' },
      { steps: ['**executeQuery**: the UI sends the query to the driver.', '**getPlan**: the driver passes it to the compiler.', '**getMetaData / sendMetaData**: the compiler asks the metastore for table metadata and gets it back.', '**sendPlan**: the compiler returns the execution plan to the driver.', '**executePlan**: the driver gives the plan to the execution engine.', '**executeJob**: the engine submits jobs to YARN; tasks read and write data in HDFS. DDL operations go to the metastore (**metaDataOps**).', '**fetchResults / sendResults**: results come back from the engine to the driver and to the UI.'] },
    ],
    sources: [`${U4} slides 3–10`, `${W} ch. 17`],
  },

  'bda-hive-features': {
    blocks: [
      { h: 'Features of Hive' },
      { ul: [
        '**SQL-like language (HiveQL)**: analysts query big data without Java MapReduce code.',
        '**Schema on read**: data is loaded as files into HDFS; the schema is applied when reading.',
        '**Metastore**: central catalogue of tables and partitions shared by tools (Pig, Spark, Presto).',
        '**Partitioning and bucketing**: queries scan only the relevant parts of the data.',
        '**Multiple file formats**: TextFile, SequenceFile, RCFile, ORC, Parquet, Avro, with compression (Snappy, DEFLATE).',
        '**Optimizations**: predicate pushdown, column pruning, query parallelisation, vectorisation, cost-based optimiser.',
        '**Extensible**: UDF, UDAF, UDTF and custom SerDes.',
        '**Multiple execution engines**: MapReduce, Tez, Spark on YARN.',
        '**JDBC/ODBC** connectivity for BI tools; ACID tables for inserts/updates/deletes.',
      ] },
      { h: 'Benefits' },
      { ul: ['Scales to **petabytes** on cheap commodity clusters.', 'Short learning curve for SQL users; faster development.', 'Fault tolerance inherited from Hadoop.', 'Good for **batch analytics, reporting, ETL** over historical data.', 'Integrates with the Hadoop ecosystem.'] },
    ],
    sources: [`${U4} slides 3–8`],
  },

  'bda-hive-types': {
    blocks: [
      'HiveQL supports **primitive** and **complex (collection)** data types.',
      { h: 'Primitive types' },
      { table: { head: ['Category', 'Types', 'Example'], rows: [['Integer', 'TINYINT (1 byte), SMALLINT (2), INT (4), BIGINT (8)', 'age INT'], ['Decimal', 'FLOAT, DOUBLE, DECIMAL(p,s)', 'cgpa FLOAT, fee DECIMAL(10,2)'], ['String', 'STRING, VARCHAR(n), CHAR(n)', 'name STRING'], ['Boolean', 'BOOLEAN', 'is_hosteller BOOLEAN'], ['Date/time', 'TIMESTAMP, DATE, INTERVAL', 'dob DATE'], ['Binary', 'BINARY', 'photo BINARY']] } },
      { h: 'Complex types' },
      { table: { head: ['Type', 'Meaning', 'Example value', 'Access'], rows: [['**ARRAY<T>**', 'Ordered list of same-type elements', "['DBMS','OS','CN']", 'subjects[0]'], ['**MAP<K,V>**', 'Key–value pairs', "{'OS':85,'CN':78}", "marks['OS']"], ['**STRUCT<…>**', 'Record with named fields of different types', "{street:'MG Road', city:'Hyderabad'}", 'address.city'], ['**UNIONTYPE**', 'One of several types at a time', '{0:1} or {1:"a"}', '—']] } },
      { code: "CREATE TABLE student (\n  roll INT, name STRING, cgpa FLOAT,\n  subjects ARRAY<STRING>,\n  marks MAP<STRING,INT>,\n  address STRUCT<street:STRING, city:STRING, pin:INT>)\nROW FORMAT DELIMITED FIELDS TERMINATED BY ','\nCOLLECTION ITEMS TERMINATED BY '#'\nMAP KEYS TERMINATED BY ':';\n\nSELECT name, subjects[0], marks['OS'], address.city FROM student;" },
    ],
    sources: [`${U4} slides 12–15`, `${W} ch. 17 (data types)`],
  },

  'bda-hiveql-agg': {
    blocks: [
      '**HiveQL** is Hive\'s SQL-like query language. It supports DDL (CREATE, ALTER, DROP), DML (LOAD DATA, INSERT INTO/OVERWRITE) and queries (SELECT … WHERE … GROUP BY … HAVING … ORDER BY / SORT BY, JOINs, subqueries), plus partitioning and bucketing.',
      { h: 'Aggregate functions' },
      'Built-in aggregate functions summarise many rows into one value, usually with GROUP BY:',
      { table: { head: ['Function', 'Returns'], rows: [['COUNT(*), COUNT(col), COUNT(DISTINCT col)', 'Number of rows / non-null values / distinct values'], ['SUM(col)', 'Total'], ['AVG(col)', 'Average'], ['MIN(col), MAX(col)', 'Smallest / largest'], ['VARIANCE, STDDEV_POP', 'Spread'], ['COLLECT_SET(col), COLLECT_LIST(col)', 'Array of (distinct) values']] } },
      { code: 'SELECT dept, COUNT(*) AS students, ROUND(AVG(cgpa),2) AS avg_cgpa, MAX(cgpa) AS top\nFROM student\nGROUP BY dept\nHAVING COUNT(*) > 10\nORDER BY avg_cgpa DESC;' },
      { h: 'User-defined functions (UDFs)' },
      'When built-in functions are not enough, users write their own (usually in Java) and register them:',
      { ul: ['**UDF**: one row in → one value out (e.g. grade(marks)).', '**UDAF** (aggregate): many rows → one value (e.g. a custom median).', '**UDTF** (table-generating): one row → many rows (e.g. explode()).'] },
      { code: "ADD JAR /home/cse/udfs.jar;\nCREATE TEMPORARY FUNCTION grade AS 'edu.cbit.hive.Grade';\nSELECT name, marks, grade(marks) FROM student;" },
    ],
    sources: [`${U4} slides 16–26`, `${W} ch. 17 (UDFs)`],
  },

  'bda-hiveql-script': {
    blocks: [
      'Assume a CSV file with one row per student per subject: roll, name, dept, subject, score.',
      { code: MARKS_HQL },
      { ul: ['**Query 1** finds subject difficulty: the lowest average = hardest subject.', '**Query 2** finds the top performers by total marks.', '**Query 3** counts passes and failures using conditional aggregation.', '**Query 4** joins with a subquery to list students above their subject\'s average.'] },
      'Explain each query in one line in the exam: what it groups by and what it computes.',
    ],
    sources: [`${U4} slides 16–26`, "BDA Nov '25 paper Q9(b)"],
  },

  'bda-hive-commands': {
    blocks: [
      '**Hive commands** are HiveQL statements (and shell commands) used to define, load and query data.',
      { table: { head: ['Category', 'Commands'], rows: [
        ['**Database (DDL)**', 'CREATE DATABASE, SHOW DATABASES, USE, DESCRIBE DATABASE, ALTER DATABASE, DROP DATABASE [CASCADE]'],
        ['**Table (DDL)**', 'CREATE [EXTERNAL] TABLE, SHOW TABLES, DESCRIBE [FORMATTED], ALTER TABLE (RENAME TO, ADD COLUMNS, CHANGE, ADD PARTITION), DROP TABLE, TRUNCATE TABLE'],
        ['**Data loading (DML)**', 'LOAD DATA [LOCAL] INPATH … [OVERWRITE] INTO TABLE, INSERT INTO / INSERT OVERWRITE TABLE … SELECT, CREATE TABLE … AS SELECT'],
        ['**Querying**', 'SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY / SORT BY … LIMIT, JOIN, UNION ALL'],
        ['**Views and indexes**', 'CREATE VIEW, DROP VIEW'],
        ['**Functions**', 'SHOW FUNCTIONS, DESCRIBE FUNCTION, ADD JAR, CREATE TEMPORARY FUNCTION'],
        ['**Shell/other**', 'SET property=value, dfs -ls, !shell-cmd, source file.hql, quit'],
      ] } },
      { code: "CREATE TABLE emp (id INT, name STRING, salary FLOAT, dept STRING)\n  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',';\nLOAD DATA LOCAL INPATH '/home/cse/emp.csv' INTO TABLE emp;\nSELECT dept, AVG(salary) FROM emp GROUP BY dept;\nALTER TABLE emp ADD COLUMNS (city STRING);\nDROP TABLE emp;" },
    ],
    sources: [`${U4} slides 16–26`],
  },

  'bda-hive-ddl': {
    blocks: [
      'A Hive **database** is a namespace (a directory in HDFS under /user/hive/warehouse/db_name.db) that groups tables.',
      { code: HIVE_DDL },
      { h: 'Points to explain' },
      { ul: ['**IF NOT EXISTS / IF EXISTS** avoid errors when the object already exists / does not exist.', '**DBPROPERTIES** store key–value metadata; **COMMENT** adds a description.', '**DROP DATABASE** is RESTRICT by default (fails if tables exist); **CASCADE** drops the tables first.', 'Only properties and owner of a database can be altered, not its name or location (in older versions).', '**Managed (internal) table**: Hive owns the data; DROP deletes the HDFS files.', '**External table** (`CREATE EXTERNAL TABLE … LOCATION \'/path\'`): DROP removes only the metadata; the files stay.'] },
    ],
    sources: [`${U4} slides 16–26`, `${W} ch. 17 (managed and external tables)`],
  },

  'bda-hive-udf': {
    blocks: [
      'Hive has many built-in functions, but **user-defined functions (UDFs)** let users add their own logic, written in Java (or Python via TRANSFORM), that can then be called inside HiveQL like any built-in function.',
      { h: 'Three kinds' },
      { table: { head: ['Kind', 'Input → output', 'Example'], rows: [['**UDF**', 'One row → one value', 'grade(marks), mask_phone(phone)'], ['**UDAF**', 'Many rows → one value (aggregate)', 'a custom median or weighted average'], ['**UDTF**', 'One row → many rows', 'explode(subjects) turns an array into rows']] } },
      { h: 'How they enhance queries' },
      { ul: ['Domain-specific logic (grading rules, parsing log formats, cleaning data) inside the query.', 'Reuse: write once, use in many queries.', 'Run in parallel on the cluster like built-in functions.', 'Avoid exporting data to other tools for custom processing.'] },
      { h: 'Example' },
      { code: "// Java\npublic class Grade extends UDF {\n  public Text evaluate(IntWritable m) {\n    if (m == null) return null;\n    int x = m.get();\n    return new Text(x >= 90 ? \"O\" : x >= 75 ? \"A\" : x >= 40 ? \"P\" : \"F\");\n  }\n}\n\n-- Hive\nADD JAR /home/cse/grade.jar;\nCREATE TEMPORARY FUNCTION grade AS 'edu.cbit.Grade';\nSELECT name, marks, grade(marks) FROM student;" },
    ],
    sources: [`${U4} slides 24–26`, `${W} ch. 17 (user-defined functions)`],
  },

  'bda-hive-vs-rdbms': {
    blocks: [
      { table: { head: ['Basis', 'Hive', 'Traditional RDBMS'], rows: [
        ['Purpose', 'Data warehouse for **analytics (OLAP)** on big data', '**Transactions (OLTP)** and operational data'],
        ['Schema', 'Schema on **read** (applied at query time; fast loads)', 'Schema on **write** (checked at load time)'],
        ['Data size', 'Terabytes to petabytes, on HDFS', 'Gigabytes to a few terabytes'],
        ['Storage', 'Files in HDFS (distributed, replicated)', 'Proprietary storage on one server / SAN'],
        ['Query latency', 'Seconds to minutes (batch jobs on a cluster)', 'Milliseconds'],
        ['Updates / deletes', 'Limited (append, overwrite; ACID only on special tables)', 'Full row-level INSERT, UPDATE, DELETE'],
        ['Transactions', 'Limited', 'Full ACID'],
        ['Indexes, constraints', 'Minimal (no foreign keys)', 'Rich: keys, constraints, indexes, triggers'],
        ['Scaling', 'Horizontal (add commodity nodes)', 'Mostly vertical (bigger server)'],
        ['Language', 'HiveQL (SQL-like)', 'Standard SQL'],
        ['Data types', 'Also complex types: ARRAY, MAP, STRUCT', 'Mainly scalar types'],
        ['Fault tolerance', 'Built in (HDFS replication, task re-execution)', 'Backups, replication'],
      ] } },
      { h: 'Handling large datasets' },
      'Hive splits the data across many nodes and processes it in parallel, so a full scan of 10 TB is practical; an RDBMS would need very expensive hardware and still struggle. But for a single-row lookup or an update, an RDBMS answers instantly while Hive would launch a cluster job.',
      'Use Hive for large-scale reporting and analysis over historical data; use an RDBMS for fast, consistent transactions on current data.',
    ],
    sources: [`${U4} slides 3–6`, `${W} ch. 17 (comparison with traditional databases)`],
  },

  'bda-pred-rcfile': {
    blocks: [
      'Hive stores table data as files in HDFS; the **file format** decides how rows are laid out on disk (`STORED AS …`).',
      { table: { head: ['Format', 'Layout', 'Notes'], rows: [['**TextFile** (default)', 'Plain text, one row per line, delimited fields', 'Human-readable; large and slow to parse'], ['**SequenceFile**', 'Binary key–value pairs, row-oriented', 'Splittable, supports block compression'], ['**RCFile** (Record Columnar File)', 'Row groups, each stored column by column', 'Good compression; reads only needed columns'], ['**ORC** (Optimized Row Columnar)', 'Improved RCFile: stripes with indexes and statistics', 'Best compression and speed in Hive; supports ACID'], ['**Parquet / Avro**', 'Columnar / row-based with schema', 'Shared with other tools']] } },
      { h: 'RCFile layout' },
      { steps: ['The table is first split **horizontally** into **row groups** (e.g. 4 MB each); each row group fits in one HDFS block.', 'Inside a row group the data is stored **column-wise**: all values of column 1, then column 2, …', 'Each row group has a **sync marker**, a **metadata header** (number of rows, column lengths) and the **column data**, compressed per column.'] },
      { code: 'Row group 1:  | sync | header | c1: 101,102,103 | c2: Asha,Ravi,Megha | c3: 88,72,91 |\nRow group 2:  | sync | header | c1: 104,105,...   | c2: ...            | c3: ...      |' },
      { h: 'Benefits' },
      { ul: ['**Column pruning**: a query on two columns reads only those columns.', '**Better compression**: similar values stored together.', 'All columns of a row stay in the same block, so rows can be reconstructed without network transfer (unlike pure column stores).'] },
      { code: 'CREATE TABLE marks_rc (roll INT, subject STRING, score INT) STORED AS RCFILE;\nINSERT OVERWRITE TABLE marks_rc SELECT roll, subject, score FROM marks;' },
    ],
    sources: [`${U4} slides 15–17`, `${W} ch. 17 (storage formats)`],
  },

  // ---------------- Pig ----------------
  'bda-pig-what': {
    blocks: [
      '**Apache Pig** is a high-level platform for analysing large datasets on Hadoop, originally developed at **Yahoo**. It has two parts:',
      { ul: ['**Pig Latin**: a **data-flow language** in which a program is a sequence of steps, each transforming relations (load → filter → group → store).', '**Execution environment**: the Pig engine that parses, optimises and compiles Pig Latin scripts into **MapReduce (or Tez) jobs** that run on the Hadoop cluster.'] },
      { img: 'bda-pig-anatomy' },
      'It handles structured, semi-structured and unstructured data, needs no schema (optional), and is extended with UDFs. Typical uses: ETL, log processing, data cleaning and prototyping.',
    ],
    sources: [`${U4} slides 27–31`, `${W} ch. 16 (Pig)`],
  },

  'bda-pig-need': {
    blocks: [
      'Writing MapReduce programs in Java is powerful but painful. **Pig Latin** was created to make big-data processing easier:',
      { ol: [
        '**Less code**: an operation that needs ~200 lines of Java MapReduce can be written in ~10 lines of Pig Latin (about 1/20th of the code and 1/16th of the development time, as reported by Yahoo).',
        '**No Java required**: programmers who know SQL or scripting can work with Hadoop.',
        '**Built-in operators**: JOIN, GROUP, FILTER, ORDER, DISTINCT, UNION, which are hard to write by hand in MapReduce (especially joins).',
        '**Data-flow style**: a script reads step by step, matching how ETL pipelines are designed; intermediate results have names and can be inspected.',
        '**Optional schemas and nested data** (tuples, bags, maps): suits semi-structured logs and JSON-like data.',
        '**Automatic optimisation**: Pig rewrites the plan (e.g. pushes filters early, merges jobs) so programmers focus on logic.',
        '**Extensibility**: UDFs in Java, Python and other languages; Piggy Bank library.',
        '**Debugging tools**: DESCRIBE, EXPLAIN, ILLUSTRATE (shows sample data at each step).',
      ] },
      { h: 'Example' },
      'Find users with more than 100 page visits: Java MapReduce needs a mapper, reducer, driver and job configuration; Pig needs:',
      { code: "v = LOAD 'visits' AS (user:chararray, url:chararray);\ng = GROUP v BY user;\nc = FOREACH g GENERATE group, COUNT(v) AS n;\nheavy = FILTER c BY n > 100;\nDUMP heavy;" },
    ],
    sources: [`${U4} slides 27–31`],
  },

  'bda-pig-practice': {
    blocks: [
      'In practice Pig is used for **data pipelines (ETL)** and **ad-hoc analysis** of large raw data on Hadoop.',
      { h: 'Typical workflow' },
      { steps: ['**Load** raw data from HDFS (logs, CSV, JSON) with LOAD … USING PigStorage / JsonLoader.', '**Clean and filter**: remove bad records, fix formats (FILTER, FOREACH … GENERATE with functions).', '**Transform and enrich**: JOIN with reference data, split fields, compute new columns, apply UDFs.', '**Aggregate**: GROUP and compute COUNT, SUM, AVG, MAX.', '**Store** results in HDFS for Hive tables, reports or machine-learning jobs (STORE … INTO).'] },
      { h: 'Use cases' },
      { ul: ['**Web log analysis**: page views per user, error rates, sessions (Yahoo, Twitter, LinkedIn used Pig heavily).', '**ETL into a data warehouse**: preparing data before loading into Hive.', '**Data cleaning and sampling** for data scientists.', '**Search and ad data processing**: click-through statistics.', '**Prototyping** algorithms on large datasets quickly.'] },
      { h: 'Example: daily error report from server logs' },
      { code: "logs   = LOAD '/logs/2025-11-01' USING PigStorage(' ') AS (ip:chararray, ts:chararray, url:chararray, status:int);\nerrors = FILTER logs BY status >= 500;\nbyurl  = GROUP errors BY url;\ncounts = FOREACH byurl GENERATE group AS url, COUNT(errors) AS n;\ntop    = ORDER counts BY n DESC;\nSTORE top INTO '/reports/errors';" },
      'Scripts are run in local mode on a sample while developing, then in MapReduce mode on the full data, often scheduled by Oozie.',
    ],
    sources: [`${U4} slides 27–43`, `${W} ch. 16`],
  },

  'bda-pig-vs-db': {
    blocks: [
      { h: 'Pig' },
      'A data-flow platform for Hadoop: Pig Latin scripts are compiled into MapReduce jobs.',
      { h: 'Generating examples' },
      'Pig\'s **ILLUSTRATE** command generates a small **sample of example data** for each step of a script and shows how it is transformed (it even synthesises records so that every operator, such as a FILTER, produces some output). This lets programmers check the logic quickly without running the whole job on huge data.',
      { code: "ILLUSTRATE heavy;   -- shows sample tuples flowing through LOAD, GROUP, FOREACH, FILTER" },
      { h: 'Comparison with databases' },
      { table: { head: ['Basis', 'Pig', 'RDBMS (SQL databases)'], rows: [
        ['Language', '**Procedural data-flow** (step by step)', '**Declarative** (say what, not how)'],
        ['Schema', '**Optional**, can be declared at load time or not at all', '**Required** before loading (schema on write)'],
        ['Data model', 'Nested: tuples, bags, maps', 'Flat tables (first normal form)'],
        ['Data', 'Raw, semi-structured files in HDFS', 'Data loaded into managed storage'],
        ['Workload', 'Batch scans of the whole dataset', 'Random reads/writes, small transactions'],
        ['Updates', 'No updates: produce new data sets', 'INSERT/UPDATE/DELETE'],
        ['Transactions, indexes', 'None', 'ACID, indexes, constraints'],
        ['Scale', 'Petabytes on a cluster', 'GB–TB on one server'],
        ['Latency', 'Minutes', 'Milliseconds'],
      ] } },
    ],
    sources: [`${U4} slides 27–31, 67–70`, `${W} ch. 16 (Pig compared with databases)`],
  },

  'bda-pig-install': {
    blocks: [
      { h: 'Installing Pig' },
      { steps: ['Prerequisites: Java (JDK) and Hadoop installed and configured (`JAVA_HOME`, `HADOOP_HOME`).', 'Download a stable Pig release from pig.apache.org and extract it: `tar xzf pig-0.17.0.tar.gz`.', 'Set environment variables in ~/.bashrc: `export PIG_HOME=/opt/pig-0.17.0` and `export PATH=$PATH:$PIG_HOME/bin`; also `export PIG_CLASSPATH=$HADOOP_HOME/etc/hadoop` so Pig finds the cluster.', 'Reload the profile (`source ~/.bashrc`) and verify with `pig -version`.'] },
      { h: 'Running Pig' },
      { ul: ['**Interactive (Grunt shell)**: `pig -x local` or `pig` (MapReduce mode) opens `grunt>` where statements are typed one by one.', '**Batch (script)**: write statements in a file and run `pig -x mapreduce wordcount.pig` (or `pig -x local …`).', '**Embedded**: run Pig from Java/Python programs using the PigServer class.', 'HDFS commands can be used inside Grunt: `fs -ls /`, `fs -put data.txt /input`, `fs -cat /out/part-r-00000`.'] },
      { h: 'Example session' },
      { code: "$ pig -x local\ngrunt> s = LOAD 'students.csv' USING PigStorage(',') AS (id:int, name:chararray, marks:int);\ngrunt> p = FILTER s BY marks >= 40;\ngrunt> DUMP p;\ngrunt> quit" },
    ],
    sources: [`${U4} slides 37–43`],
  },

  'bda-pig-modes': {
    blocks: [
      'Pig scripts can run in two execution modes:',
      { compare: [
        { title: 'Local mode', items: ['Command: `pig -x local`', 'Runs in a **single JVM** on one machine', 'Reads and writes the **local file system**', 'No Hadoop cluster or HDFS needed', 'Used for **development, testing and debugging** with small data'] },
        { title: 'MapReduce (Hadoop) mode', items: ['Command: `pig` or `pig -x mapreduce` (also `-x tez`)', 'Pig **translates the script into MapReduce jobs** that run on the Hadoop cluster', 'Reads and writes **HDFS**', 'Needs a running Hadoop installation', 'Used for **production** on large datasets'] },
      ] },
      { h: 'Ways to run scripts in either mode' },
      { ul: ['**Interactive**: Grunt shell (`grunt>` prompt).', '**Batch**: `pig -x local script.pig` / `pig script.pig`.', '**Embedded**: from Java with PigServer.'] },
      'The same script works in both modes; only the input/output paths change.',
    ],
    sources: [`${U4} slides 37–43`, `${W} ch. 16 (execution types)`],
  },

  'bda-pig-model': {
    blocks: [
      'Pig\'s data model is **nested**: complex values can contain other values.',
      { img: 'bda-pig-model' },
      { table: { head: ['Concept', 'Meaning', 'Example'], rows: [
        ['**Atom (field)**', 'A single value of a simple type', "'Megha', 88"],
        ['**Tuple**', 'An **ordered set of fields**, like a row; fields can be of any type', "(101, 'Megha', 88)"],
        ['**Bag**', 'An **unordered collection of tuples** (duplicates allowed); tuples need not have the same schema', "{(101,'Megha',88), (102,'Ravi',72)}"],
        ['**Inner bag**', 'A bag inside a tuple (e.g. after GROUP)', "('CSE', {(101,'Megha',88), (103,'Asha',91)})"],
        ['**Map**', 'Set of **key#value** pairs; keys are chararray', "['dept'#'CSE', 'cgpa'#8.8]"],
        ['**Relation**', 'An **outer bag**: what LOAD and every statement produce', 'students = LOAD …'],
      ] } },
      { h: 'Example' },
      { code: "s = LOAD 'students' USING PigStorage(',') AS (id:int, name:chararray, dept:chararray, marks:int);\n-- s is a relation (bag) of tuples like (101,Megha,CSE,88)\ng = GROUP s BY dept;\n-- g has tuples (group, bag):  (CSE, {(101,Megha,CSE,88),(103,Asha,CSE,91)})\nDESCRIBE g;\n-- g: {group: chararray, s: {(id:int, name:chararray, dept:chararray, marks:int)}}" },
    ],
    sources: [`${U4} slides 32–36`, `${W} ch. 16 (data model)`],
  },

  'bda-pig-types': {
    blocks: [
      { h: 'Simple (scalar) types' },
      { table: { head: ['Type', 'Description', 'Example'], rows: [['int', '32-bit signed integer', '10'], ['long', '64-bit signed integer', '10L'], ['float', '32-bit floating point', '10.5F'], ['double', '64-bit floating point', '10.5'], ['chararray', 'Character string (UTF-8)', "'hello'"], ['bytearray', 'Byte array (blob); default type when no schema is given', '—'], ['boolean', 'true / false', 'true'], ['datetime', 'Date and time', '2025-11-01T10:00:00'], ['biginteger, bigdecimal', 'Arbitrary precision numbers', '—']] } },
      { h: 'Complex types' },
      { table: { head: ['Type', 'Description', 'Example'], rows: [['**tuple**', 'Ordered set of fields', "(101,'Megha',88)"], ['**bag**', 'Collection of tuples', "{(101,'Megha'),(102,'Ravi')}"], ['**map**', 'Set of key#value pairs', "['name'#'Megha','cgpa'#8.8]"]] } },
      { img: 'bda-pig-model' },
      'Fields without a declared type default to **bytearray**, and Pig casts them as needed. **null** means a missing or unknown value.',
      { code: "s = LOAD 'student.txt' USING PigStorage(',')\n    AS (id:int, name:chararray, cgpa:float,\n        subjects:bag{t:(sub:chararray)},\n        info:map[]);\nDESCRIBE s;" },
    ],
    sources: [`${U4} slides 32–36`],
  },

  'bda-pig-syntax': {
    blocks: [
      { h: 'Basic syntax of a Pig Latin script' },
      { ul: ['A script is a **sequence of statements**; each statement ends with a **semicolon**.', 'Each statement usually has the form **alias = OPERATOR input [BY/USING …];** and produces a new **relation** named by the alias.', 'Keywords (LOAD, FILTER) are case-insensitive; aliases and function names are case-sensitive.', 'Comments: `--` single line, `/* … */` multi-line.', 'Nothing runs until a **DUMP** or **STORE** statement (lazy evaluation; Pig builds a logical plan first).'] },
      { h: 'Structure (three parts)' },
      { steps: ['**Load**: `data = LOAD \'path\' USING PigStorage(\',\') AS (schema);`', '**Transform**: FILTER, FOREACH … GENERATE, GROUP, JOIN, ORDER, DISTINCT, LIMIT, UNION, SPLIT.', '**Output**: `DUMP alias;` (screen) or `STORE alias INTO \'path\';` (HDFS).'] },
      { code: "-- word count in Pig Latin\nlines  = LOAD 'input.txt' AS (line:chararray);\nwords  = FOREACH lines GENERATE FLATTEN(TOKENIZE(line)) AS word;\ngroups = GROUP words BY word;\ncounts = FOREACH groups GENERATE group, COUNT(words);\nSTORE counts INTO 'wc_out';" },
      'Diagnostic statements: DESCRIBE (schema), EXPLAIN (plans), ILLUSTRATE (sample run).',
    ],
    sources: [`${U4} slides 44–50`],
  },

  'bda-pig-latin': {
    blocks: [
      '**Pig Latin** is Pig\'s data-flow language. A script is a sequence of statements; each takes one or more relations as input and produces a new relation. Statements end with `;`, relations are named by aliases, and nothing runs until DUMP or STORE.',
      { h: 'Structure' },
      { steps: ['LOAD data into a relation (with an optional schema).', 'Transform it: FILTER, FOREACH … GENERATE, GROUP, JOIN, ORDER, DISTINCT, LIMIT.', 'Output it: DUMP to the screen or STORE into HDFS.'] },
      { h: 'Data processing (relational) operators' },
      { table: { head: ['Operator', 'Example'], rows: [
        ['LOAD', "s = LOAD 'students' USING PigStorage(',') AS (id:int, name:chararray, dept:chararray, marks:int);"],
        ['FILTER', 'p = FILTER s BY marks >= 40;'],
        ['FOREACH … GENERATE', 'n = FOREACH s GENERATE name, marks * 1.1;'],
        ['GROUP / COGROUP', 'g = GROUP s BY dept;'],
        ['JOIN', 'j = JOIN s BY id, fees BY id;'],
        ['ORDER BY', 'o = ORDER s BY marks DESC;'],
        ['DISTINCT', 'd = DISTINCT s;'],
        ['LIMIT', 't = LIMIT o 5;'],
        ['UNION / SPLIT', 'u = UNION a, b;  SPLIT s INTO pass IF marks>=40, fail IF marks<40;'],
        ['FLATTEN', 'w = FOREACH l GENERATE FLATTEN(TOKENIZE(line));'],
        ['STORE / DUMP', "STORE o INTO 'out'; DUMP t;"],
      ] } },
      { h: 'Eval functions' },
      'Built-in: AVG, COUNT, MAX, MIN, SUM, CONCAT, TOKENIZE, SIZE, IsEmpty.',
      { h: 'User-defined functions' },
      'When built-ins are not enough, write a UDF in Java (extend **EvalFunc**, FilterFunc or LoadFunc) or Python, **REGISTER** the JAR/script and call it in FOREACH or FILTER:',
      { code: "REGISTER myudfs.jar;\nDEFINE GRADE edu.cbit.pig.Grade();\nr = FOREACH s GENERATE name, GRADE(marks);" },
    ],
    sources: [`${U4} slides 44–66`],
  },

  'bda-pig-operators': {
    blocks: [
      'Pig\'s **data processing operators** work on relations (bags of tuples):',
      { table: { head: ['Group', 'Operators', 'What they do'], rows: [
        ['**Loading and storing**', 'LOAD, STORE, DUMP', 'Read data from the file system; write it; print it'],
        ['**Filtering**', 'FILTER, DISTINCT, FOREACH … GENERATE, STREAM, SAMPLE', 'Remove unwanted rows, duplicates; select/compute columns; pipe through an external program'],
        ['**Grouping and joining**', 'GROUP, COGROUP, JOIN, CROSS', 'Group by key; group several relations; inner/outer joins; cross product'],
        ['**Sorting**', 'ORDER BY, LIMIT, RANK', 'Sort; keep the first n; rank'],
        ['**Combining and splitting**', 'UNION, SPLIT', 'Merge relations; divide one relation into several'],
        ['**Diagnostic**', 'DESCRIBE, EXPLAIN, ILLUSTRATE', 'Show schema, execution plans, sample data flow'],
      ] } },
      { code: "s = LOAD 'students' USING PigStorage(',') AS (id:int, name:chararray, dept:chararray, marks:int);\np = FILTER s BY marks >= 40;\ng = GROUP p BY dept;\nr = FOREACH g GENERATE group, AVG(p.marks);\no = ORDER r BY $1 DESC;\nDUMP o;" },
    ],
    sources: [`${U4} slides 50–62`, `${W} ch. 16 (data processing operators)`],
  },

  'bda-pig-udf': {
    blocks: [
      '**User-defined functions (UDFs)** in Pig are custom functions, written in **Java** (most common), Python/Jython, JavaScript, Ruby or Groovy, that extend Pig Latin when built-in functions are not enough.',
      { ul: ['**Eval functions** (extend `EvalFunc`): used in FOREACH, e.g. converting text to upper case or computing a grade.', '**Filter functions** (extend `FilterFunc`): return a boolean, used in FILTER.', '**Load/Store functions** (`LoadFunc`, `StoreFunc`): read or write custom formats.', '**Aggregate (algebraic) functions**: like SUM, work on bags.'] },
      { code: "// Java\npublic class Upper extends EvalFunc<String> {\n  public String exec(Tuple t) throws IOException {\n    if (t == null || t.size() == 0) return null;\n    return ((String) t.get(0)).toUpperCase();\n  }\n}\n\n-- Pig\nREGISTER myudfs.jar;\nu = FOREACH s GENERATE myudfs.Upper(name);" },
      'Ready-made UDFs are shared in the **Piggy Bank** library.',
    ],
    sources: [`${U4} slides 63–66`],
  },

  'bda-pig-scripting': {
    blocks: [
      'A **Pig script** is a file (usually `.pig`) containing Pig Latin statements that are run together as a batch, rather than typed one by one in the Grunt shell.',
      { h: 'Writing and running a script' },
      { steps: ['Write the statements in a file, e.g. `dept_report.pig`.', 'Parameters can be used: `$input`, `$output`, passed with `-param input=/data/students.csv`.', 'Run in local mode for testing: `pig -x local dept_report.pig`.', 'Run on the cluster: `pig -x mapreduce -param input=/data/s.csv dept_report.pig`.', 'Pig builds a logical plan, optimises it, compiles it into MapReduce jobs and runs them when it reaches STORE/DUMP.'] },
      { h: 'Example: department-wise results' },
      { code: "-- dept_report.pig\nstudents = LOAD '$input' USING PigStorage(',')\n           AS (id:int, name:chararray, dept:chararray, marks:int);\npassed   = FILTER students BY marks >= 40;\nbydept   = GROUP passed BY dept;\nreport   = FOREACH bydept GENERATE group AS dept,\n               COUNT(passed) AS num_passed,\n               ROUND(AVG(passed.marks)) AS avg_marks;\nsorted   = ORDER report BY avg_marks DESC;\nSTORE sorted INTO '$output' USING PigStorage(',');" },
      'Other script features: comments (`--`, `/* */`), `exec`/`run` to call other scripts, `REGISTER` for UDF jars, `SET` for job properties (e.g. default_parallel).',
    ],
    sources: [`${U4} slides 44–50`],
  },

  'bda-pig-script': {
    blocks: [
      'Data: a CSV of students: id, name, dept, marks. Task: keep students who passed, group them by department, and compute the count and average.',
      { code: STUDENT_PIG },
      { ul: ['**LOAD** reads the file with a schema.', '**FILTER** keeps rows with marks ≥ 40.', '**GROUP** builds one tuple per department with a bag of its students.', '**FOREACH … GENERATE** computes COUNT and AVG on each bag.', '**ORDER** sorts; **STORE** writes the result to HDFS (DUMP shows it on screen).'] },
      'Sample output: `(CSE,58,78.4) (ECE,52,74.1) (IT,47,72.9)`.',
    ],
    sources: [`${U4} slides 44–66`],
  },

  'bda-pig-ncdc': {
    blocks: [
      'The NCDC weather data has one record per reading: year, temperature (tenths of °C) and a quality code. Missing temperatures are recorded as 9999.',
      { code: NCDC_PIG },
      { h: 'Step by step' },
      { ul: ['**LOAD** with a schema of three fields (tab-separated by default).', '**FILTER** removes missing values (9999) and keeps only good quality codes 0, 1, 4, 5, 9.', '**GROUP** by year: each tuple is (year, {bag of readings}).', '**FOREACH … GENERATE group, MAX(filtered.temperature)**: the maximum in each bag.', '**DUMP** prints, e.g., (1949,111) and (1950,22), i.e. 11.1 °C and 2.2 °C.'] },
      'The same job in Java MapReduce needs a mapper, a reducer and a driver class (about 60 lines); Pig does it in five statements.',
    ],
    sources: [`${U4} slides 44–66`, `${W} ch. 16 (max temperature example)`],
  },

  'bda-pig-vs-hive': {
    blocks: [
      { table: { head: ['Basis', 'Pig', 'Hive'], rows: [
        ['Developed by', 'Yahoo', 'Facebook'],
        ['Language', '**Pig Latin**: procedural data-flow language', '**HiveQL**: declarative, SQL-like'],
        ['Used by', 'Programmers and researchers', 'Data analysts, SQL users'],
        ['Data', 'Structured, semi-structured and unstructured', 'Mainly structured'],
        ['Schema', 'Optional; defined in the script (no metastore needed)', 'Mandatory; stored in the **metastore**'],
        ['Main use', '**ETL**, data pipelines, data cleaning', '**Reporting**, warehouse queries, analytics'],
        ['Runs on', 'Client side (Pig engine compiles scripts)', 'Server side (HiveServer2, metastore)'],
        ['Partitions', 'No concept of partitions', 'Supports partitions and bucketing'],
        ['JDBC/ODBC, BI tools', 'Not supported', 'Supported'],
        ['Web interface', 'No', 'Yes (Hue, web UI)'],
        ['Complex types', 'Tuple, bag, map', 'ARRAY, MAP, STRUCT'],
        ['Learning', 'Easy for scripters', 'Easy for SQL users'],
        ['Execution', 'MapReduce / Tez', 'MapReduce / Tez / Spark'],
      ] } },
      'Both compile to jobs on Hadoop and handle petabytes; organisations often use **Pig to prepare** raw data and **Hive to query** the cleaned tables.',
    ],
    sources: [`${U4} slides 67–70`],
  },

  'bda-pred-piggybank': {
    blocks: [
      '**Piggy Bank** is Pig\'s **repository of user-contributed UDFs** (shipped in contrib/piggybank). Instead of writing common functions themselves, users can reuse ones others have written: string functions, math functions, date/time conversions, and loaders/storers for formats such as CSV with quoted fields (CSVExcelStorage), XML (XMLLoader), multi-storage output.',
      { h: 'Using a Piggy Bank UDF' },
      { steps: ['Get the jar (piggybank.jar, built from the Pig source or downloaded).', '**REGISTER** it in the script.', 'Optionally **DEFINE** a short alias.', 'Call the function with its full class name (or alias).'] },
      { code: "REGISTER /usr/lib/pig/piggybank.jar;\nDEFINE Upper org.apache.pig.piggybank.evaluation.string.UPPER();\nDEFINE CSVLoader org.apache.pig.piggybank.storage.CSVExcelStorage();\n\ns = LOAD 'students.csv' USING CSVLoader() AS (id:int, name:chararray, marks:int);\nu = FOREACH s GENERATE id, Upper(name), marks;\nDUMP u;" },
      { h: 'Writing your own UDF' },
      'Extend EvalFunc in Java, compile it into a jar, REGISTER it and call it in FOREACH; good UDFs can be contributed back to Piggy Bank.',
    ],
    sources: [`${U4} slides 63–66`],
  },
}
