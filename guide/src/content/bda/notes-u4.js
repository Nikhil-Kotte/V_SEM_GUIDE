// Big Data Analytics, Unit IV: Hive and Pig.
// Follows the BDA unit slides.
export default {
  'bda.u4.hive-intro': {
    oneLine: 'Hive is a data-warehouse layer on Hadoop that lets you query huge files in HDFS with an SQL-like language (HiveQL) instead of writing MapReduce code.',
    blocks: [
      { def: "Apache Hive", text: "A **data warehouse infrastructure built on top of Hadoop** that lets users **query and analyse large data sets in HDFS using HiveQL**, an SQL-like language; Hive compiles queries into MapReduce, Tez or Spark jobs. Developed at Facebook; best for batch analytics, not OLTP." },
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
      { def: "Hive architecture", text: "The components through which a HiveQL query is executed: **user interfaces** (CLI/Hive shell, Beeline, JDBC/ODBC via HiveServer2, web UI), the **driver** (compiler, optimiser, executor), the **metastore** (schemas and table metadata in an RDBMS), and the execution engine running jobs on **Hadoop (YARN + HDFS)**." },
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
      { def: "Hive data types", text: "The types used to define Hive table columns: **primitive** types (TINYINT, SMALLINT, INT, BIGINT, FLOAT, DOUBLE, DECIMAL, BOOLEAN, STRING, VARCHAR, CHAR, DATE, TIMESTAMP, BINARY) and **complex** types (ARRAY, MAP, STRUCT, UNIONTYPE)." },
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
      {"h": "Designing an employee table with Hive data types (Class Test II, question 4b)"},
      {"code": "CREATE TABLE employee (\n  emp_id      INT,              -- whole-number identifier\n  name        STRING,           -- variable-length text\n  salary      DECIMAL(10,2),    -- exact money value (or DOUBLE)\n  joining_dt  DATE,             -- yyyy-MM-dd\n  department  STRING            -- or VARCHAR(30)\n)\nROW FORMAT DELIMITED\nFIELDS TERMINATED BY ','\nSTORED AS TEXTFILE;\n\nLOAD DATA LOCAL INPATH 'employees.csv' INTO TABLE employee;\nSELECT department, AVG(salary) FROM employee GROUP BY department;"},
      {"ul": ["INT suits the numeric ID; STRING/VARCHAR the name and department; DECIMAL(10,2) stores salary exactly (DOUBLE is also acceptable); DATE stores the joining date and allows date functions (YEAR(joining_dt), DATEDIFF).", "Optionally partition by department: PARTITIONED BY (department STRING), or use a complex type such as skills ARRAY<STRING>."]},
    ],
    terms: [['STRUCT', 'Group of named fields, like a record.'], ['MAP', 'Key–value pairs.']],
    exam: 'Two tables (primitive and complex) and a CREATE TABLE using all three complex types.',
    revise: ['Primitive: TINYINT…BIGINT, FLOAT, DOUBLE, DECIMAL, STRING, BOOLEAN, DATE, TIMESTAMP', 'Complex: ARRAY, MAP, STRUCT, UNIONTYPE'],
  },
  'bda.u4.hive-formats': {
    oneLine: 'Hive can store tables as plain text, SequenceFiles, or column-oriented formats like RCFile, ORC and Parquet; columnar formats read only the columns a query needs.',
    blocks: [
      { def: "Hive file formats", text: "The storage formats of Hive tables: **TEXTFILE** (default, plain delimited text), **SEQUENCEFILE** (binary key–value), **RCFILE** (record columnar), **ORC** (optimised row columnar: compression, indexes) and **PARQUET** (columnar, cross-tool); columnar formats speed up analytical queries." },
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
      { def: "HiveQL", text: "Hive's **SQL-like query language** for DDL (CREATE/ALTER/DROP DATABASE and TABLE, partitions, buckets), DML (LOAD DATA, INSERT … SELECT) and queries (SELECT, WHERE, GROUP BY, JOIN, ORDER BY / SORT BY), which Hive converts into distributed jobs." },
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
      { def: "User-defined function (UDF) in Hive", text: "A **custom function written (usually in Java, or Python via TRANSFORM) to extend HiveQL with logic not available in the built-in functions**. Types: **UDF** (one row in → one value out), **UDAF** (many rows → one aggregate) and **UDTF** (one row → many rows). It is packaged as a JAR, added with ADD JAR and registered with CREATE TEMPORARY FUNCTION." },
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
      {"tip": "Class Test II question 2 (2 marks): give the definition, the three kinds, and the ADD JAR / CREATE TEMPORARY FUNCTION registration steps."},
      {"code": "ADD JAR /home/user/udfs/toupper.jar;\nCREATE TEMPORARY FUNCTION to_upper AS 'com.college.hive.ToUpper';\nSELECT to_upper(name) FROM employee;"},
    ],
    terms: [['UDF', 'User-defined function: one row in, one value out.'], ['UDTF', 'Table-generating function: one row in, many out.']],
    exam: 'UDF vs UDAF vs UDTF table, the 5 steps and a short Java evaluate() example.',
    revise: ['Extend UDF → evaluate()', 'ADD JAR → CREATE TEMPORARY FUNCTION → use'],
  },
  'bda.u4.pig-intro': {
    oneLine: 'Apache Pig is a high-level platform for processing big data with Pig Latin, a step-by-step data-flow language that Pig turns into MapReduce jobs on Hadoop.',
    blocks: [
      { def: "Apache Pig", text: "A **high-level platform for analysing large data sets on Hadoop** using the data-flow scripting language **Pig Latin**; the Pig engine compiles scripts into MapReduce (or Tez/Spark) jobs. Developed at Yahoo; suited to ETL and semi-structured data." },
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
      { def: "Pig data model", text: "Pig's nested data model: an **atom** (simple value: int, long, float, double, chararray, bytearray, boolean, datetime), a **tuple** (ordered set of fields), a **bag** (collection of tuples; a relation is an outer bag) and a **map** (set of key → value pairs)." },
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
      { def: "Running Pig", text: "Pig runs in **local mode** (pig -x local, files on the local file system) or **MapReduce/Hadoop mode** (pig, data in HDFS), interactively through the **Grunt shell**, in **batch** mode with script files (pig script.pig), or **embedded** in Java/Python programs." },
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
      { def: "Pig Latin operators", text: "Relational operators that build a data flow: **LOAD/STORE/DUMP** (I/O), **FILTER, FOREACH … GENERATE** (row/column), **GROUP, COGROUP, JOIN, UNION, SPLIT** (combining), **ORDER BY, DISTINCT, LIMIT** (ordering), and diagnostic operators **DESCRIBE, EXPLAIN, ILLUSTRATE**." },
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
      {"h": "Pig script: average marks of students in each department (Class Test II, question 5b)"},
      {"code": "-- students.csv: roll,name,dept,marks\nstudents = LOAD '/user/data/students.csv' USING PigStorage(',')\n           AS (roll:int, name:chararray, dept:chararray, marks:float);\nby_dept  = GROUP students BY dept;\navg_dept = FOREACH by_dept GENERATE group AS dept, AVG(students.marks) AS avg_marks;\nsorted   = ORDER avg_dept BY avg_marks DESC;\nDUMP sorted;\nSTORE sorted INTO '/user/output/avg_marks' USING PigStorage(',');"},
      {"ul": ["LOAD reads the file with a schema; GROUP … BY dept creates one bag of students per department; FOREACH … GENERATE applies AVG to the marks in each bag; ORDER sorts; DUMP prints and STORE writes to HDFS."]},
    ],
    terms: [['FLATTEN', 'Un-nests a bag or tuple into separate rows/fields.'], ['PigStorage', 'Default load/store function for delimited text.']],
    exam: 'Operator table, then a complete script with LOAD → FILTER → GROUP → FOREACH → STORE. Annotate each line.',
    revise: ['LOAD, FILTER, FOREACH…GENERATE, GROUP, JOIN, ORDER, STORE/DUMP', 'COUNT, SUM, AVG, MAX, TOKENIZE'],
  },
  'bda.u4.pig-udf': {
    oneLine: 'Pig can be extended with your own functions (UDFs) in Java or Python, and Piggy Bank is a shared library of ready-made UDFs you can register and reuse.',
    blocks: [
      { def: "Pig UDF", text: "A **user-defined function written in Java (or Python/JavaScript) that extends Pig Latin**: eval functions, filter functions, load/store functions. Registered with REGISTER jarfile and used by its class name (or a DEFINE alias); **Piggy Bank** is a repository of shared Pig UDFs." },
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
      { def: "Pig vs Hive", text: "**Pig** is a procedural **data-flow scripting** language (Pig Latin) favoured by programmers for ETL on semi-structured data; **Hive** is a declarative **SQL-like** warehouse (HiveQL) with a metastore, favoured by analysts for querying structured data and reporting." },
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
}
