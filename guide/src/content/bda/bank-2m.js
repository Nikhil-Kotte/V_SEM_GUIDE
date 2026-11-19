// Big Data Analytics: a 2-mark question bank for each unit, with full-mark answers.
//   from:  the PYQ this question was asked as (its papers and class tests are shown and drive the order:
//          class-test questions first, then the most-asked); omitted for likely questions.
//   q:     the question as it would be set for 2 marks.
//   a:     the answer: a definition plus the points an examiner looks for (content blocks).
// Answers for questions linked with `from` also serve as that PYQ's model answer when it has none.
export default [
  {
    unit: 'I',
    items: [
      { id: 'b1-integration', from: 'bda-mid-integration', q: 'Define the big data integration process.', a: [
        '**Big data integration** is the process of **combining data from many heterogeneous sources** (structured, semi-structured and unstructured; batch and streaming) **into a unified, consistent view** for storage and analysis.',
        { flow: ['Extract / ingest', 'Cleanse and validate', 'Transform and map schemas', 'Resolve duplicate entities', 'Load into a data lake / warehouse'] },
      ] },
      { id: 'b1-define', from: 'bda-define-two', q: 'Define big data and list any two characteristics.', a: [
        '**Big data** is a collection of data sets so **large, fast-growing and varied** that traditional database tools cannot capture, store, manage and analyse them in a tolerable time.',
        'Characteristics: **Volume** (huge size: TB to PB) and **Velocity** (high speed of generation and processing); also Variety, Veracity, Value.',
      ] },
      { id: 'b1-what-important', from: 'bda-what-important', q: 'What is big data? Why is it important?', a: [
        'Big data is data of very high volume, velocity and variety that needs distributed tools to store and analyse.',
        { ul: ['Reveals **patterns, trends and customer behaviour** for better decisions.', 'Enables **personalisation** (recommendations) and new products.', 'Supports **real-time** decisions (fraud detection, traffic).', '**Reduces costs** and improves efficiency (predictive maintenance).'] },
      ] },
      { id: 'b1-analytics-importance', from: 'bda-analytics-importance', q: 'Briefly explain the importance of big data analytics.', a: [
        { ul: ['**Better, faster decisions** based on evidence.', '**Customer insight**: understanding preferences, churn, sentiment.', '**Cost reduction** through efficient storage (Hadoop) and process optimisation.', '**New products and services**, and competitive advantage.', '**Risk management**: fraud and anomaly detection.'] },
      ] },
      { id: 'b1-when', from: 'bda-when-solution', q: 'When should big data be considered as a solution?', a: [
        'When the data **cannot be handled by traditional systems**: volume is too large for one server, data arrives too fast (streams), formats are too varied (logs, text, images), or analysis needs to scan all the data in parallel; and when the **value** of the insight justifies the cost.',
      ] },
      { id: 'b1-three-vs', from: 'bda-three-vs', q: 'List and explain the three Vs of big data.', a: [
        { ul: ['**Volume**: the enormous amount of data generated (terabytes to zettabytes).', '**Velocity**: the speed at which data is generated, collected and must be processed (real-time streams).', '**Variety**: the different types and formats: structured, semi-structured and unstructured.'] },
      ] },
      { id: 'b1-veracity', from: 'bda-veracity', q: 'What is the significance of veracity in big data?', a: [
        '**Veracity** refers to the **uncertainty, quality and trustworthiness** of data (noise, bias, missing values, fake data). It matters because decisions made on inaccurate data are wrong ("garbage in, garbage out"), so data must be cleaned and validated before analysis.',
      ] },
      { id: 'b1-types', q: 'Name the three types of digital data with an example each.', a: [
        { ul: ['**Structured**: fixed schema; e.g. a student table in MySQL.', '**Semi-structured**: tags/keys; e.g. JSON, XML, e-mail.', '**Unstructured**: no format; e.g. images, videos, tweets.'] },
      ] },
      { id: 'b1-sources', q: 'List five sources of big data.', a: [
        { ul: ['Social media (posts, likes, shares)', 'Sensors and IoT devices', 'Transactional systems (banking, e-commerce)', 'Web and clickstream logs', 'Mobile phones and GPS'] },
      ] },
      { id: 'b1-bi', q: 'What is business intelligence?', a: [
        'BI is the set of **technologies and processes that collect, integrate, analyse and present business data** (mostly structured, in a data warehouse) as **reports, dashboards and KPIs** to support decisions about what has happened.',
      ] },
      { id: 'b1-bi-ds', q: 'Differentiate business intelligence and data science.', a: [
        { table: { head: ['Business intelligence', 'Data science'], rows: [['What happened? (descriptive)', 'What will happen and why? (predictive)'], ['Structured data, warehouse', 'All data types, data lakes'], ['Reports, dashboards, OLAP', 'Statistics, ML models'], ['Business users', 'Data scientists']] } },
      ] },
      { id: 'b1-analytics-types', q: 'Name the four types of analytics.', a: [
        { ul: ['**Descriptive**: what happened?', '**Diagnostic**: why did it happen?', '**Predictive**: what will happen?', '**Prescriptive**: what should we do?'] },
      ] },
      { id: 'b1-traditional', q: 'How does big data differ from traditional data?', a: [
        { table: { head: ['Traditional data', 'Big data'], rows: [['GB scale, centralised', 'TB–PB scale, distributed'], ['Structured, fixed schema', 'All types, schema-on-read'], ['RDBMS, vertical scaling', 'Hadoop/NoSQL, horizontal scaling on commodity hardware'], ['Batch, periodic', 'Batch and real-time streaming']] } },
      ] },
      { id: 'b1-healthcare', q: 'Give two applications of big data in healthcare.', a: [
        { ul: ['**Predictive diagnosis**: analysing patient records and scans to detect disease risk early.', '**Epidemic tracking and hospital planning**: forecasting outbreaks and bed demand from admissions and public data.', '(Also: personalised treatment, wearable-device monitoring, fraud detection in insurance claims.)'] },
      ] },
      { id: 'b1-arch-layers', q: 'List the layers of a big data analytical architecture.', a: [
        { flow: ['Data sources', 'Ingestion', 'Storage', 'Processing', 'Analysis', 'Consumption / visualisation'] },
        'With resource management, security and governance across all layers.',
      ] },
    ],
  },
  {
    unit: 'II',
    items: [
      { id: 'b2-ingestion-tools', from: 'bda-mid-ingestion-tools', q: 'Identify the data ingestion tools used in the Hadoop ecosystem.', a: [
        { ul: ['**Apache Sqoop**: bulk transfer between relational databases and HDFS/Hive/HBase (import/export).', '**Apache Flume**: collects, aggregates and moves large volumes of log and event data into HDFS.', '**Apache Kafka**: distributed publish–subscribe platform for real-time data streams.', '(Also **Apache NiFi** for automated data flows and **Storm/Spark Streaming** for stream processing.)'] },
      ] },
      { id: 'b2-stack', from: 'bda-hadoop-stack', q: 'Define in brief the Hadoop stack for big data.', a: [
        'The Hadoop stack is the **layered set of components** for storing and processing big data: **HDFS** (storage), **YARN** (resource management), **MapReduce** (processing) and **Hadoop Common** (libraries), with ecosystem tools on top: **Hive, Pig, HBase, Spark, Sqoop, Flume, ZooKeeper, Oozie**.',
      ] },
      { id: 'b2-h1-h2', from: 'bda-h1-h2', q: 'Contrast Hadoop 1 and Hadoop 2.', a: [
        { table: { head: ['Hadoop 1', 'Hadoop 2'], rows: [['JobTracker/TaskTracker do resource management and processing', 'YARN (ResourceManager/NodeManager) separates resource management'], ['Only MapReduce', 'MapReduce, Spark, Tez, Storm…'], ['Single NameNode (single point of failure)', 'NameNode High Availability and Federation'], ['Fixed map/reduce slots; ~4,000 nodes', 'Flexible containers; ~10,000+ nodes']] } },
      ] },
      { id: 'b2-hdfs-vs-fs', from: 'bda-hdfs-vs-fs', q: 'Differentiate HDFS and a traditional file system.', a: [
        { table: { head: ['HDFS', 'Traditional file system'], rows: [['Distributed across many machines', 'On a single machine'], ['Large blocks (128 MB)', 'Small blocks (4 KB)'], ['Replication (3 copies) for fault tolerance', 'No built-in replication'], ['Write once, read many; high throughput', 'Random read/write; low latency']] } },
      ] },
      { id: 'b2-sql', from: 'bda-bigdata-vs-sql', q: 'Classify big data (Hadoop) and SQL (RDBMS).', a: [
        { table: { head: ['Big data / Hadoop', 'SQL / RDBMS'], rows: [['Any data type; schema-on-read', 'Structured data; schema-on-write'], ['PB scale, scale out on commodity nodes', 'GB–TB scale, scale up'], ['Batch analytics (MapReduce, Hive)', 'OLTP and interactive queries'], ['Open source, low cost per TB', 'Licensed, costly at scale']] } },
      ] },
      { id: 'b2-hdfs', from: 'bda-define-hdfs', q: 'Define the Hadoop Distributed File System.', a: [
        '**HDFS** is Hadoop\'s **distributed, fault-tolerant file system** that stores very large files across clusters of commodity machines: files are split into **128 MB blocks** replicated (default **3**) across **DataNodes**, with a **NameNode** managing the metadata; designed for high-throughput, write-once-read-many access.',
      ] },
      { id: 'b2-federation', from: 'bda-federation', q: 'What is HDFS Federation?', a: [
        'HDFS Federation (Hadoop 2) allows **multiple independent NameNodes**, each managing a separate **namespace volume** and its block pool, while sharing the same DataNodes. It improves **namespace scalability, performance and isolation** compared with a single NameNode.',
      ] },
      { id: 'b2-touchz', from: 'bda-touchz', q: 'Illustrate the touchz command with an example.', a: [
        '**touchz** creates a **zero-length (empty) file** in HDFS (it fails if a non-empty file exists there).',
        { code: 'hdfs dfs -touchz /user/data/status.txt\nhdfs dfs -ls /user/data        # status.txt has size 0' },
      ] },
      { id: 'b2-namenode', q: 'What are the functions of the NameNode and DataNode?', a: [
        '**NameNode** (master): manages the file-system **namespace and metadata** (file → blocks → DataNodes), handles opens/closes/renames, decides replica placement and re-replication. **DataNode** (slave): **stores the actual blocks**, serves read/write requests, and sends **heartbeats and block reports** to the NameNode.',
      ] },
      { id: 'b2-replication', q: 'What is the replication factor in HDFS?', a: [
        'The **number of copies of each block** kept on different DataNodes (default **3**: one on the local node, two on another rack). It provides **fault tolerance and availability**; it can be changed with dfs.replication or hdfs dfs -setrep.',
      ] },
      { id: 'b2-block', q: 'Why are HDFS blocks so large?', a: [
        'Large blocks (128 MB) **minimise seek time relative to transfer time**, reduce the amount of **metadata** the NameNode must hold, and give each map task a big chunk of data to process, improving throughput.',
      ] },
      { id: 'b2-etl-elt', q: 'Differentiate ETL and ELT.', a: [
        '**ETL** extracts data, **transforms it on a staging server**, then loads clean data into a data warehouse. **ELT** extracts and **loads raw data first** into the target (data lake/Hadoop/cloud DW) and **transforms it there** using the target\'s processing power; it is faster to load and more flexible for big data.',
      ] },
      { id: 'b2-ingestion-types', q: 'Differentiate batch and real-time ingestion.', a: [
        '**Batch ingestion** loads data in groups at scheduled intervals (e.g. nightly Sqoop imports), suited to large historical loads. **Real-time (streaming) ingestion** moves each event as it is generated (Kafka, Flume), suited to monitoring, fraud detection and live dashboards.',
      ] },
      { id: 'b2-sqoop', q: 'What is Sqoop? Give an import command.', a: [
        '**Sqoop** (SQL-to-Hadoop) transfers bulk data between **relational databases and Hadoop** (HDFS, Hive, HBase), running the transfer as parallel map tasks.',
        { code: 'sqoop import --connect jdbc:mysql://localhost/college --table students --target-dir /user/data/students -m 4' },
      ] },
      { id: 'b2-design', q: 'State two Hadoop design principles.', a: [
        { ul: ['**Move computation to the data** (data locality) instead of moving data to the computation.', '**Assume hardware failures** and handle them in software (replication, re-executing tasks); scale out on commodity machines.'] },
      ] },
    ],
  },
  {
    unit: 'III',
    items: [
      { id: 'b3-yarn-resp', from: 'bda-mid-yarn-resp', q: 'List the major responsibilities of YARN in Hadoop.', a: [
        { ul: ['**Cluster resource management**: tracks and allocates memory/CPU as containers.', '**Job scheduling**: decides which applications get resources (FIFO, Capacity, Fair schedulers).', '**Application monitoring**: starts ApplicationMasters, monitors containers and node health.', '**Fault tolerance**: restarts failed ApplicationMasters/containers.', '**Multi-tenancy**: lets MapReduce, Spark, Tez, etc. share one cluster.'] },
      ] },
      { id: 'b3-joins', from: 'bda-joins', q: 'Differentiate between map-side join and reduce-side join.', a: [
        { table: { head: ['Map-side join', 'Reduce-side join'], rows: [['Join is done in the **mapper**', 'Join is done in the **reducer**'], ['Needs one **small** table in memory (distributed cache) or pre-sorted, equally partitioned inputs', 'Works with **any** input sizes'], ['**No shuffle** of join data: faster', 'All records **shuffled and sorted** by key: slower'], ['e.g. big sales log ⋈ small product table', 'e.g. two large tables: orders ⋈ customers']] } },
      ] },
      { id: 'b3-define-mr', from: 'bda-define-mr', q: 'Define MapReduce.', a: [
        '**MapReduce** is a **programming model and framework for processing large data sets in parallel** across a Hadoop cluster: a **map** function turns input records into intermediate key–value pairs, the framework **shuffles and sorts** them by key, and a **reduce** function aggregates the values of each key into the final output.',
      ] },
      { id: 'b3-failures', from: 'bda-mr-failures', q: 'List the various failures in MapReduce.', a: [
        { ul: ['**Task failure**: a map/reduce task throws an exception or hangs; it is retried (up to 4 times) on another node.', '**ApplicationMaster failure**: YARN restarts the AM (job recovery).', '**NodeManager failure**: heartbeats stop; its tasks are rescheduled elsewhere.', '**ResourceManager failure**: handled by RM High Availability (standby RM).'] },
      ] },
      { id: 'b3-partitioner', from: 'bda-partitioner', q: 'What are the key objectives of a partitioner in MapReduce?', a: [
        'A **partitioner** decides **which reducer receives each intermediate key** (default HashPartitioner: hash(key) mod number of reducers). Objectives: send **all values of the same key to the same reducer**, **balance the load** evenly across reducers, and allow **custom grouping** (e.g. by year in secondary sort).',
      ] },
      { id: 'b3-combiner', q: 'What is a combiner?', a: [
        'A **"mini-reducer"** that runs on the **map side** to aggregate the map output locally before it is sent over the network (e.g. summing word counts per mapper). It **reduces shuffle traffic**; it must be commutative and associative, and Hadoop may run it zero or more times.',
      ] },
      { id: 'b3-split', q: 'What is an input split?', a: [
        'A **logical chunk of the input** processed by **one map task** (usually the size of an HDFS block). The InputFormat computes the splits, and a **RecordReader** converts each split into (key, value) records for the mapper.',
      ] },
      { id: 'b3-shuffle', q: 'What happens in the shuffle and sort phase?', a: [
        'Map output is **partitioned, sorted and spilled** on the map side, then **copied (shuffled) to the reducers**, which **merge and sort** it by key, so each reduce() call receives a key and the list of all its values.',
      ] },
      { id: 'b3-secondary', q: 'What is secondary sorting?', a: [
        'A technique to have the **values of each key arrive at the reducer in sorted order**, using a **composite key** (key + value), a partitioner and grouping comparator on the natural key, and a sort comparator on the full key; e.g. temperatures per year in descending order.',
      ] },
      { id: 'b3-wordcount', q: 'Write the map and reduce functions for word count (pseudo-code).', a: [
        { code: 'map(offset, line):\n    for word in line.split():\n        emit(word, 1)\n\nreduce(word, counts):\n    emit(word, sum(counts))' },
      ] },
      { id: 'b3-formats', q: 'Name any three Hadoop input formats.', a: [
        { ul: ['**TextInputFormat** (default): key = byte offset, value = line.', '**KeyValueTextInputFormat**: each line split into key and value at a separator (tab).', '**SequenceFileInputFormat**: reads binary key–value SequenceFiles.', '(Also NLineInputFormat, DBInputFormat.)'] },
      ] },
      { id: 'b3-yarn-comp', q: 'Name the components of YARN.', a: [
        { ul: ['**ResourceManager** (Scheduler + ApplicationsManager)', '**NodeManager** (one per worker node)', '**ApplicationMaster** (one per application)', '**Container** (allocated CPU + memory)'] },
      ] },
      { id: 'b3-schedulers', q: 'Name the YARN schedulers.', a: [
        { ul: ['**FIFO**: jobs run in order of submission.', '**Capacity scheduler**: queues with guaranteed shares of the cluster (multi-tenant).', '**Fair scheduler**: resources shared equally among running jobs over time.'] },
      ] },
      { id: 'b3-job-task', q: 'Differentiate a job and a task in MapReduce.', a: [
        'A **job** is the complete MapReduce program submitted by the client (input data + program + configuration). A job is divided into **tasks**: **map tasks** (one per input split) and **reduce tasks**, which run in parallel in containers; failed tasks are retried individually.',
      ] },
      { id: 'b3-chaining', q: 'What is job chaining (pipelining) in MapReduce?', a: [
        'Running **several MapReduce jobs in sequence**, where the output of one job is the input of the next (e.g. clean → aggregate → rank), coordinated with JobControl or Oozie; ChainMapper/ChainReducer pipeline several mappers within one job.',
      ] },
    ],
  },
  {
    unit: 'IV',
    items: [
      { id: 'b4-hive-udf', from: 'bda-mid-hive-udf', q: 'Define a user-defined function (UDF) in Hive.', a: [
        'A **UDF** is a **custom function, usually written in Java (extending UDF/GenericUDF), that extends HiveQL with logic not provided by built-in functions**. Types: **UDF** (row → value), **UDAF** (rows → aggregate), **UDTF** (row → many rows). Use: ADD JAR the jar; CREATE TEMPORARY FUNCTION name AS \'class\'; then call it in SELECT.',
      ] },
      { id: 'b4-hive-query', from: 'bda-hive-query', q: 'Define querying data in Hive.', a: [
        'Querying in Hive means retrieving and analysing data stored in HDFS using **HiveQL**, an SQL-like language (SELECT … FROM … WHERE … GROUP BY … JOIN …); Hive compiles the query into **MapReduce, Tez or Spark jobs** and returns the results. E.g. SELECT dept, AVG(salary) FROM employee GROUP BY dept;',
      ] },
      { id: 'b4-hive-shell', from: 'bda-hive-shell', q: 'What is the purpose of the Hive shell?', a: [
        'The **Hive shell (CLI)** is the command-line interface for running **HiveQL statements interactively** or from script files (hive -f script.hql): creating databases and tables, loading data, running queries and setting configuration. (Beeline is the newer JDBC client for HiveServer2.)',
      ] },
      { id: 'b4-pig-what', from: 'bda-pig-what', q: 'What is Apache Pig?', a: [
        '**Apache Pig** is a **high-level platform for analysing large data sets on Hadoop** using **Pig Latin**, a procedural data-flow language; the Pig engine converts scripts into MapReduce/Tez jobs. It simplifies ETL and handles semi-structured data.',
      ] },
      { id: 'b4-pig-udf', from: 'bda-pig-udf', q: 'What are user-defined functions in Pig?', a: [
        'Functions written in **Java (or Python, JavaScript)** to extend Pig Latin with custom processing: **eval** functions (transform values), **filter** functions, and **load/store** functions. They are registered with **REGISTER** jarfile and called by name; **Piggy Bank** offers shared UDFs.',
      ] },
      { id: 'b4-pig-syntax', from: 'bda-pig-syntax', q: 'Write the basic syntax of a Pig Latin script.', a: [
        { code: "data = LOAD '/path/input' USING PigStorage(',') AS (f1:chararray, f2:int);\nfilt = FILTER data BY f2 > 50;\ngrp  = GROUP filt BY f1;\nres  = FOREACH grp GENERATE group, COUNT(filt);\nSTORE res INTO '/path/output';   -- or DUMP res;" },
      ] },
      { id: 'b4-hive-features', q: 'List four features of Hive.', a: [
        { ul: ['SQL-like **HiveQL**; easy for SQL users.', '**Schema-on-read** over data in HDFS; metastore stores table metadata.', 'Supports **partitions and buckets** for faster queries; columnar formats (ORC, Parquet).', 'Extensible with **UDFs** and runs on MapReduce, Tez or Spark.'] },
      ] },
      { id: 'b4-metastore', q: 'What is the Hive metastore?', a: [
        'The central repository that stores **metadata of Hive tables and partitions** (schemas, column types, HDFS locations, SerDes) in a relational database (Derby, MySQL), used by the compiler to plan queries.',
      ] },
      { id: 'b4-partition-bucket', q: 'Differentiate partitioning and bucketing in Hive.', a: [
        '**Partitioning** divides a table into **sub-directories by column values** (e.g. by year, department), so queries scan only relevant partitions. **Bucketing** divides data into a **fixed number of files by hash of a column**, which helps sampling and efficient joins.',
      ] },
      { id: 'b4-hive-types', q: 'Name the complex data types in Hive.', a: [
        { ul: ['**ARRAY**: ordered list, e.g. ARRAY<STRING> skills', '**MAP**: key–value pairs, e.g. MAP<STRING,INT>', '**STRUCT**: named fields, e.g. STRUCT<city:STRING, pin:INT>', '**UNIONTYPE**: one of several types'] },
      ] },
      { id: 'b4-internal-external', q: 'Differentiate managed (internal) and external tables in Hive.', a: [
        'A **managed** table\'s data is stored in Hive\'s warehouse directory and **deleted** when the table is dropped. An **external** table points to data at a given HDFS location (CREATE EXTERNAL TABLE … LOCATION …); dropping it removes **only the metadata**, not the data.',
      ] },
      { id: 'b4-pig-model', q: 'Explain atom, tuple and bag in Pig.', a: [
        { ul: ['**Atom**: a single value (int, chararray…), e.g. 35.', '**Tuple**: an ordered set of fields, e.g. (101, Asha, CSE).', '**Bag**: a collection of tuples, e.g. {(101, Asha), (102, Ravi)}; a relation is an outer bag.', '(**Map**: key#value pairs.)'] },
      ] },
      { id: 'b4-pig-modes', q: 'What are the execution modes of Pig?', a: [
        '**Local mode** (pig -x local): runs in a single JVM on the local file system, for testing small data. **MapReduce/Hadoop mode** (pig): runs on the Hadoop cluster with data in HDFS (also Tez and Spark modes).',
      ] },
      { id: 'b4-pig-hive', q: 'Differentiate Pig and Hive.', a: [
        { table: { head: ['Pig', 'Hive'], rows: [['Procedural data-flow language (Pig Latin)', 'Declarative SQL-like language (HiveQL)'], ['Used by programmers/researchers for ETL', 'Used by analysts for reporting'], ['Handles semi-structured data well; no metastore needed', 'Mainly structured data; uses a metastore'], ['Developed at Yahoo', 'Developed at Facebook']] } },
      ] },
      { id: 'b4-group-cogroup', q: 'Differentiate GROUP and COGROUP in Pig.', a: [
        '**GROUP** groups the tuples of **one relation** by a key, giving (key, bag). **COGROUP** groups **two or more relations** by a common key, giving (key, bag from relation 1, bag from relation 2, …); it is the basis for joins.',
      ] },
    ],
  },
  {
    unit: 'V',
    items: [
      { id: 'b5-dag', from: 'bda-mid-dag', q: 'What is the role of the DAG Scheduler in Apache Spark?', a: [
        'The **DAG scheduler** (in the driver) converts the logical DAG of RDD transformations into **stages** when an action is called: it **splits the graph at shuffle (wide-dependency) boundaries**, pipelines narrow transformations within a stage, computes **preferred locations** for data locality, submits each stage as a **TaskSet** to the task scheduler in dependency order, and **resubmits stages** whose shuffle output is lost.',
      ] },
      { id: 'b5-spark-what', from: 'bda-spark-what', q: 'What is Apache Spark?', a: [
        '**Apache Spark** is an open-source, **fast, in-memory, distributed computing engine** for large-scale data processing, with APIs in Scala, Java, Python and R and built-in libraries for SQL, streaming, machine learning (MLlib) and graphs (GraphX); it can run on YARN, Mesos, Kubernetes or standalone.',
      ] },
      { id: 'b5-rdd', from: 'bda-rdd', q: 'Define RDD.', a: [
        'A **Resilient Distributed Dataset** is Spark\'s core abstraction: an **immutable, partitioned collection of records distributed across the cluster** and processed in parallel. It is **fault-tolerant** because lost partitions are recomputed from their **lineage**, and it is evaluated **lazily**.',
      ] },
      { id: 'b5-spark-mr', from: 'bda-spark-vs-mr', q: 'How is Spark different from MapReduce?', a: [
        { table: { head: ['Spark', 'MapReduce'], rows: [['In-memory processing; up to 100× faster', 'Writes intermediate results to disk'], ['DAG of many stages; lazy evaluation', 'Fixed map → reduce stages'], ['Batch, streaming, SQL, ML, graph', 'Batch only'], ['Rich APIs in Scala, Python, Java, R', 'Verbose Java API']] } },
      ] },
      { id: 'b5-future', from: 'bda-spark-future', q: 'Describe the present and the future of Spark.', a: [
        '**Present**: Spark is the most widely used big data processing engine: unified batch, streaming (Structured Streaming), SQL and ML, available on all major clouds (Databricks, EMR, Dataproc). **Future**: deeper integration with AI/ML and lakehouse formats (Delta Lake), GPU acceleration, Spark Connect for remote clients, and more Python-first (pandas API) development.',
      ] },
      { id: 'b5-trans-actions', q: 'Differentiate transformations and actions in Spark.', a: [
        '**Transformations** (map, filter, flatMap, reduceByKey, join) create a **new RDD** and are **lazy**: they only build the lineage. **Actions** (collect, count, take, reduce, saveAsTextFile) **trigger execution** of the DAG and return results to the driver or write output.',
      ] },
      { id: 'b5-narrow-wide', q: 'Differentiate narrow and wide transformations.', a: [
        '**Narrow** transformations (map, filter, union): each output partition depends on **one** input partition: no shuffle, pipelined in one stage. **Wide** transformations (groupByKey, reduceByKey, join): output partitions depend on **many** input partitions, requiring a **shuffle** and a new stage.',
      ] },
      { id: 'b5-lazy', q: 'What is lazy evaluation in Spark?', a: [
        'Spark **does not execute transformations immediately**; it records them in the DAG and runs them only when an **action** is called. This lets Spark **optimise the whole plan** (pipelining, avoiding unnecessary work) and recompute lost data from lineage.',
      ] },
      { id: 'b5-driver', q: 'What is the role of the driver program in Spark?', a: [
        'The **driver** runs the application\'s main() and creates the **SparkContext/SparkSession**; it builds the DAG, splits it into stages and tasks, requests executors from the cluster manager, schedules tasks on them, and collects results.',
      ] },
      { id: 'b5-executor', q: 'What is an executor in Spark?', a: [
        'An **executor** is a **JVM process launched on a worker node** for an application; it **runs the tasks** assigned by the driver, **caches data in memory** (persisted RDDs), and reports status and results back to the driver.',
      ] },
      { id: 'b5-create-rdd', q: 'Name two ways to create an RDD.', a: [
        { code: 'rdd1 = sc.parallelize([1, 2, 3, 4])          # from a collection\nrdd2 = sc.textFile("hdfs:///user/data/marks.csv")  # from external storage' },
        'A third way is transforming an existing RDD (rdd2.map(...)).',
      ] },
      { id: 'b5-persist', q: 'What are cache() and persist()?', a: [
        'They **keep an RDD/DataFrame in memory (or on disk) after it is first computed**, so later actions reuse it instead of recomputing. cache() uses the default level (MEMORY_ONLY for RDDs); persist(StorageLevel) lets you choose (MEMORY_AND_DISK, DISK_ONLY, serialized…).',
      ] },
      { id: 'b5-components', q: 'Name the components (libraries) of the Spark ecosystem.', a: [
        { ul: ['**Spark Core** (RDDs, scheduling, memory)', '**Spark SQL** (DataFrames, SQL queries)', '**Spark Streaming / Structured Streaming** (real-time)', '**MLlib** (machine learning)', '**GraphX** (graph processing)'] },
      ] },
      { id: 'b5-reducebykey', q: 'Differentiate reduceByKey and groupByKey.', a: [
        '**reduceByKey** combines values of each key **locally on each partition before the shuffle**, sending only partial results: efficient. **groupByKey** shuffles **all values** of each key across the network and then groups them: more memory and network use. Prefer reduceByKey for aggregations.',
      ] },
      { id: 'b5-cluster-managers', q: 'Name the cluster managers Spark can run on.', a: [
        { ul: ['**Standalone** (Spark\'s own)', '**Hadoop YARN**', '**Apache Mesos**', '**Kubernetes**'] },
      ] },
    ],
  },
]
