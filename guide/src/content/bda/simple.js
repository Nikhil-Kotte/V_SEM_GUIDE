// Big Data Analytics in simple words: a short summary, a picture of the idea, the key points,
// an everyday comparison and one example for every topic. Keys are syllabus ids.
export default {
  // ======================= UNIT I =======================
  'bda.u1.data-types': {
    summary: 'Data comes in three shapes: **structured** (neat tables), **semi-structured** (labelled but flexible, like JSON) and **unstructured** (photos, videos, free text).',
    picture: [{ table: { head: ['Shape', 'Example'], rows: [['Structured', 'Bank statement table'], ['Semi-structured', 'JSON from an app'], ['Unstructured', 'YouTube videos, tweets']] } }],
    points: [
      'About 80% of all data is unstructured.',
      'Normal databases handle only structured data well; big data tools handle all three.',
    ],
    analogy: 'Structured data is a filled form; semi-structured is a letter with headings; unstructured is a voice note.',
    example: '{ "name": "Ravi", "skills": ["Python", "SQL"] } is semi-structured: it has labels but no fixed table.',
  },
  'bda.u1.sources': {
    summary: 'Big data comes from **people** (social media, e-mail), **machines** (sensors, logs) and **businesses** (transactions).',
    picture: [{ tree: { root: 'Where big data comes from', kids: ['Social media', 'Sensors and IoT', 'Web and machine logs', 'Transactions', 'Mobile and GPS', 'Science and government'] } }],
    points: [
      'Each source has its own use: sensor data for predicting breakdowns, transactions for recommendations.',
      'Machines now produce more data than people.',
    ],
    analogy: 'Like rivers flowing into a lake: many sources, all filling the same big store.',
    example: 'Smart electricity meters send readings every 15 minutes, which helps predict demand.',
  },
  'bda.u1.evolution': {
    summary: '**Big data** is data too big, too fast or too varied for normal databases. Storage grew from files to databases to warehouses to distributed systems like Hadoop.',
    picture: [{ flow: ['Files', 'Databases', 'Data warehouses', 'Hadoop and NoSQL', 'Spark and cloud'] }],
    points: [
      'Gartner: high volume, high velocity, high variety.',
      'Big data scales out (more machines), not up (a bigger machine).',
      'Schema on read: structure is applied when data is used.',
    ],
    analogy: 'Like a family\'s photo collection: an album, then a shoebox, then a hard disk, now a cloud backup across many servers.',
    example: 'A bank once kept daily transactions in one database; now it also keeps app clicks, chats and call recordings in a Hadoop cluster.',
  },
  'bda.u1.characteristics': {
    summary: 'Big data is described by **Vs**: **Volume** (how much), **Velocity** (how fast), **Variety** (how many kinds), plus **Veracity** (how trustworthy) and **Value** (how useful).',
    picture: [{ tree: { root: 'The 5 Vs', kids: ['Volume', 'Velocity', 'Variety', 'Veracity', 'Value'] } }],
    points: [
      'Volume: petabytes of photos on social media.',
      'Velocity: millions of payments per minute.',
      'Veracity matters because bad data gives bad decisions.',
    ],
    analogy: 'Like a flood: a lot of water (volume), arriving fast (velocity), carrying all sorts of things (variety), some dirty (veracity), but useful if you can harness it (value).',
    example: 'UPI handles billions of transactions a month (volume) in real time (velocity).',
  },
  'bda.u1.challenges-need': {
    summary: 'We need big data tools because today\'s data is too large and fast for one computer. But big data brings challenges: storage, speed, quality, security and skills.',
    picture: [{ tree: { root: 'Challenges', kids: ['Storage', 'Processing speed', 'Data quality', 'Security and privacy', 'Integration', 'Skilled people', 'Cost'] } }],
    points: [
      'Use big data only when the data is too big, fast or varied, and the insight is worth it.',
      'Benefits: better decisions, lower costs, new products, fraud detection.',
    ],
    analogy: 'Like building a highway: needed when traffic grows, but costly to build, maintain and police.',
    example: 'A small shop does not need Hadoop; a nationwide e-commerce site with millions of daily orders does.',
  },
  'bda.u1.integration': {
    summary: 'The **big data integration process** gathers data from many sources, cleans and transforms it, and stores it in one place ready for analysis.',
    picture: [{ flow: ['Sources', 'Ingest', 'Clean', 'Transform', 'Store', 'Analyse'] }],
    points: [
      'Handles different formats and speeds.',
      'Tracks where each piece of data came from (lineage).',
    ],
    analogy: 'Like collecting vegetables from different farms, washing and sorting them, and stocking one supermarket shelf.',
    example: 'App logs, sales tables and customer reviews are combined in a data lake for a single customer view.',
  },
  'bda.u1.applications': {
    summary: 'Big data is used in **healthcare**, **shopping**, **banking**, **telecom**, **social media**, **transport** and **farming** to predict, personalise and save money.',
    picture: [{ table: { head: ['Domain', 'Use'], rows: [['Healthcare', 'Predict disease'], ['Shopping', 'Recommendations'], ['Banking', 'Fraud detection'], ['Transport', 'Traffic prediction'], ['Social media', 'Trends and sentiment']] } }],
    points: [
      'Healthcare: records, scans and wearables help predict risk and track epidemics.',
      'Social media: spot trends and public mood from millions of posts.',
    ],
    analogy: 'Like a very experienced shopkeeper who remembers every customer\'s habits, but for millions of customers at once.',
    example: 'Netflix recommends shows by analysing what millions of similar viewers watched.',
  },
  'bda.u1.bi-ds': {
    summary: '**Business intelligence** reports what happened using dashboards. **Data science** predicts what will happen using models. **Analytics** covers both.',
    picture: [{ table: { head: ['', 'BI', 'Data science'], rows: [['Asks', 'What happened?', 'What will happen?'], ['Data', 'Structured', 'Any'], ['Output', 'Reports', 'Predictions']] } }],
    points: [
      'Both clean data, analyse it and present results.',
      'Big data analytics focuses on scale; data science on methods.',
    ],
    analogy: 'BI is a car\'s speedometer (what is happening now); data science is the satnav predicting your arrival time.',
    example: 'BI: "sales fell 10% last quarter." Data science: "sales will rise 5% if we cut delivery time."',
  },
  'bda.u1.architecture': {
    summary: 'A **typical analytical architecture** moves data from sources through cleaning into a central warehouse, then to reports and analysts. Big data adds distributed storage and processing.',
    picture: [{ stack: ['Dashboards and analysts', 'Processing (MapReduce, Spark)', 'Storage (HDFS, data lake)', 'Ingestion (Sqoop, Kafka)', 'Sources'] }],
    points: [
      'The old warehouse handled only structured data and made analysts wait for IT.',
      'Big data keeps raw data and processes it where it is stored.',
    ],
    analogy: 'Like a factory line: raw material in, cleaning, storing in a warehouse, then products out to shops.',
    example: 'Sales data is extracted nightly, loaded into a warehouse, and shown on a morning dashboard.',
  },
  'bda.u1.analytics-types': {
    summary: 'Analytics answers three main questions: **what happened** (descriptive), **what will happen** (predictive) and **what should we do** (prescriptive).',
    picture: [{ flow: ['Descriptive', 'Diagnostic', 'Predictive', 'Prescriptive'] }],
    points: [
      'Each level adds more value and more difficulty.',
      'Prescriptive uses optimisation to recommend actions.',
    ],
    analogy: 'Like cricket: last match\'s scorecard (descriptive), predicting tomorrow\'s score (predictive), choosing the batting order (prescriptive).',
    example: 'A store reports last month\'s sales, forecasts next month\'s, and decides how much stock to order.',
  },

  // ======================= UNIT II =======================
  'bda.u2.need-hadoop': {
    summary: '**Hadoop** is needed because one computer cannot store or process big data. It splits the data and the work across many cheap computers that work in parallel.',
    picture: [{ stack: ['Tools: Hive, Pig, Sqoop, Flume', 'Processing: MapReduce', 'Resources: YARN', 'Storage: HDFS'] }],
    points: [
      'Reading 1 TB from one disk takes hours; from 100 disks in parallel, minutes.',
      'If one machine fails, copies on others keep the data safe.',
    ],
    analogy: 'Like 100 students each checking 10 answer sheets instead of one teacher checking 1,000.',
    example: 'Yahoo ran Hadoop on thousands of machines to index the web.',
  },
  'bda.u2.design-principles': {
    summary: 'Hadoop\'s main ideas: **move the program to the data**, add more cheap machines to grow, **expect failures** and keep copies, and **write once, read many times**.',
    picture: [{ tree: { root: 'Hadoop design', kids: ['Data locality', 'Scale out', 'Fault tolerance (3 copies)', 'Write once, read many', 'Simple map and reduce'] } }],
    points: [
      'Moving a small program is cheaper than moving terabytes of data.',
      'Files are split into big 128 MB blocks.',
    ],
    analogy: 'Like sending the teacher to each village school instead of bussing all the students to the city.',
    example: 'A word-count program runs on the very machines that hold the text blocks.',
  },
  'bda.u2.vs-rdbms': {
    summary: 'A **relational database** is great for neat tables with frequent updates and fast queries. **Hadoop** is great for huge amounts of any data, written once and analysed in big batches.',
    picture: [{ table: { head: ['', 'RDBMS', 'Hadoop'], rows: [['Data', 'Tables', 'Anything'], ['Size', 'GBs', 'TBs to PBs'], ['Updates', 'Often', 'Write once'], ['Grows by', 'Bigger server', 'More servers']] } }],
    points: [
      'RDBMS: schema on write; Hadoop: schema on read.',
      'HDFS blocks are 128 MB, not 4 KB like a normal file system.',
    ],
    analogy: 'An RDBMS is a neat cupboard for clothes you use daily; Hadoop is a huge warehouse for everything you ever owned.',
    example: 'A bank\'s account balances live in an RDBMS; years of transaction logs for fraud analysis live in Hadoop.',
  },
  'bda.u2.core-components': {
    summary: 'Hadoop has four core parts: **HDFS** (storage), **YARN** (resource manager), **MapReduce** (processing) and **Hadoop Common** (shared tools).',
    picture: [{ tree: { root: 'HDFS', kids: ['NameNode: knows where every block is', 'DataNodes: store the blocks', 'Secondary NameNode: saves checkpoints'] } }],
    points: [
      'The NameNode keeps only metadata, not the data itself.',
      'Federation uses several NameNodes for very large clusters.',
    ],
    analogy: 'The NameNode is a library catalogue; DataNodes are the shelves holding the books.',
    example: 'A 300 MB file becomes three blocks (128 + 128 + 44 MB), each stored on three DataNodes.',
  },
  'bda.u2.architecture': {
    summary: 'Hadoop uses a **master-worker** design: a master (NameNode, ResourceManager) manages the cluster, and many workers (DataNode, NodeManager) store data and do the work.',
    picture: [{ flow: ['Client asks NameNode where blocks are', 'NameNode replies with DataNodes', 'Client reads/writes directly to DataNodes'] }],
    points: [
      'Each block has 3 copies on different machines and racks.',
      'DataNodes send a heartbeat every 3 seconds; silent ones are replaced.',
    ],
    analogy: 'Like a head chef (master) who knows which cook has which ingredient, while the cooks (workers) do the cooking.',
    example: 'If a whole rack loses power, another rack still holds a copy of every block.',
  },
  'bda.u2.h1-vs-h2': {
    summary: '**Hadoop 2** fixed Hadoop 1\'s bottleneck by adding **YARN**: resource management moved out of MapReduce, so clusters grew bigger and could run engines like Spark.',
    picture: [{ table: { head: ['', 'Hadoop 1', 'Hadoop 2'], rows: [['Manager', 'JobTracker', 'ResourceManager + ApplicationMaster'], ['Engines', 'MapReduce only', 'MapReduce, Spark, more'], ['Scale', '~4,000 nodes', '10,000+ nodes'], ['NameNode', 'Single point of failure', 'Standby available']] } }],
    points: [
      'Hadoop 1\'s JobTracker did too much and became a bottleneck.',
      'Hadoop 2 uses flexible containers instead of fixed slots.',
    ],
    analogy: 'Hadoop 1 had one manager doing hiring and project work; Hadoop 2 hired a separate HR team (YARN).',
    example: 'A Hadoop 2 cluster can run a Spark job and a MapReduce job at the same time.',
  },
  'bda.u2.hdfs-ops': {
    summary: 'To **write** a file, HDFS sends each block through a chain of DataNodes to make copies. To **read**, the client asks the NameNode where blocks are and reads from the nearest DataNode.',
    picture: [{ flow: ['Write: client → DN1 → DN2 → DN3', 'ACKs flow back', 'NameNode records the file'] }],
    points: [
      'Commands: hdfs dfs -put, -get, -ls, -cat, -rm, -mkdir.',
      'touchz creates an empty file.',
    ],
    analogy: 'Writing is like passing a note down a row of three friends who each copy it; reading is asking the class monitor which friend has it and borrowing from the nearest.',
    example: 'hdfs dfs -put marks.csv /data copies a local file into HDFS.',
  },
  'bda.u2.ingestion-layer': {
    summary: 'The **ingestion layer** brings data from all sources into the big data system: it collects, checks, buffers and routes the data.',
    picture: [{ flow: ['Databases, logs, sensors', 'Ingestion layer', 'HDFS / data lake'] }],
    points: [
      'It must handle bursts without losing data.',
      'It must scale as sources grow.',
    ],
    analogy: 'Like the loading bay of a warehouse: trucks arrive at random times, goods are checked and sent to the right shelf.',
    example: 'Website logs from 50 servers are collected and written to HDFS every minute.',
  },
  'bda.u2.etl-elt': {
    summary: '**ETL** cleans and transforms data **before** loading it. **ELT** loads the raw data **first** and transforms it later inside Hadoop or the cloud.',
    picture: [{ compare: [{ title: 'ETL', items: ['Extract', 'Transform', 'Load'] }, { title: 'ELT', items: ['Extract', 'Load', 'Transform'] }] }],
    points: [
      'ETL suits classic data warehouses.',
      'ELT suits big data: keep everything raw, transform when needed.',
    ],
    analogy: 'ETL is washing and cutting vegetables before putting them in the fridge; ELT is putting them in as they are and preparing them when you cook.',
    example: 'Raw clickstream logs are loaded into HDFS as they are, then cleaned with Spark only for the reports that need them.',
  },
  'bda.u2.ingestion-tools': {
    summary: '**Sqoop** moves data between databases and Hadoop. **Flume** collects log files. **Kafka** carries real-time event streams.',
    picture: [{ table: { head: ['Tool', 'Carries'], rows: [['Sqoop', 'Database tables ↔ HDFS'], ['Flume', 'Log files → HDFS'], ['Kafka', 'Live event streams']] } }],
    points: [
      'Flume works as source → channel → sink.',
      'Kafka stores streams in topics that many consumers can read.',
    ],
    analogy: 'Sqoop is a moving truck for furniture; Flume is a pipe for water; Kafka is a busy post office sorting live messages.',
    example: 'sqoop import --table orders copies a MySQL orders table into HDFS.',
  },
  'bda.u2.ingestion-types': {
    summary: 'Data can be ingested in **batches** (big chunks at set times), in **real time** (each event as it happens), or both together (**lambda architecture**).',
    picture: [{ tree: { root: 'Ingestion types', kids: ['Batch: nightly loads', 'Real-time: live events', 'Micro-batch: every few seconds', 'Lambda: batch + real-time'] } }],
    points: [
      'Batch is simple and cheap; real-time is fast but complex.',
      'Choose by how fresh the data must be.',
    ],
    analogy: 'Batch is collecting letters once a day; real-time is a phone call the moment something happens.',
    example: 'Payroll uses batch loads; card fraud detection needs real-time streams.',
  },

  // ======================= UNIT III =======================
  'bda.u3.mapreduce-intro': {
    summary: '**MapReduce** processes big data in two steps: **map** turns each record into key-value pairs, and **reduce** combines all values with the same key. In between, Hadoop sorts and groups them (**shuffle**).',
    picture: [{ flow: ['Input splits', 'Map', 'Shuffle and sort', 'Reduce', 'Output'] }],
    points: [
      'A **combiner** does a small reduce on each mapper to save network traffic.',
      'A **partitioner** decides which reducer gets each key.',
    ],
    analogy: 'Counting votes: each booth counts its own votes (map), the counts are sorted by candidate (shuffle), and a central office adds them up (reduce).',
    example: 'Counting words: map emits (word, 1); reduce adds up the 1s for each word.',
  },
  'bda.u3.mapreduce-processing': {
    summary: 'To run MapReduce you write a **mapper**, a **reducer** and a **driver**, package them as a JAR, and run it on files in HDFS. Word count is the classic example.',
    picture: [{ flow: ['"car car river"', 'Map: (car,1) (car,1) (river,1)', 'Shuffle: car [1,1], river [1]', 'Reduce: car 2, river 1'] }],
    points: [
      'A **job** is split into many map and reduce **tasks** that run in parallel.',
      'Failed tasks are retried on other machines.',
      'Run with: hadoop jar wc.jar WordCount /in /out.',
    ],
    analogy: 'Like a school counting how often each name appears in the register: every class counts its own names, then the office adds the class totals.',
    example: 'Counting hashtags in a day\'s tweets to find trending topics.',
  },
  'bda.u3.io-formats': {
    summary: '**Input formats** decide how files are split and read into key-value records; **output formats** decide how results are written. Each mapper reads one **input split**.',
    picture: [{ table: { head: ['Input format', 'Key → Value'], rows: [['TextInputFormat', 'Byte offset → line'], ['KeyValueTextInputFormat', 'Before tab → after tab'], ['SequenceFileInputFormat', 'Binary key → value']] } }],
    points: [
      'One split is usually one 128 MB block.',
      'The RecordReader turns a split into records.',
    ],
    analogy: 'Like cutting a long book into chapters (splits) and reading each chapter line by line (records).',
    example: 'With TextInputFormat, the line "hello world" at byte 120 arrives as key 120, value "hello world".',
  },
  'bda.u3.joins': {
    summary: 'A **map-side join** joins data inside the mappers (fast, but one table must be small or both pre-sorted). A **reduce-side join** tags records and joins them in the reducers (works for any size).',
    picture: [{ flow: ['Customers (101, Ravi)', 'Orders (101, Book)', 'Group by key 101', 'Ravi bought Book'] }],
    points: [
      'Map-side: the small table is loaded in memory on every node.',
      'Reduce-side: more shuffling, so slower.',
    ],
    analogy: 'Map-side is giving every clerk a copy of the small customer list; reduce-side is sending all papers with the same ID to one clerk to match.',
    example: 'Joining a small "city codes" table to millions of orders works well as a map-side join.',
  },
  'bda.u3.secondary-sort': {
    summary: 'MapReduce sorts by key but not the values. **Secondary sorting** makes the values for each key arrive in order, using a composite key and custom comparators.',
    picture: [{ flow: ['Composite key (year, temp)', 'Partition by year', 'Sort by year, then temp', 'Group by year'] }],
    points: [
      'The partitioner sends all records of one key to one reducer.',
      'The grouping comparator gives one reduce call per natural key.',
    ],
    analogy: 'Like sorting exam papers first by class, and within each class by marks.',
    example: 'Max temperature per year: the first value each reducer sees is already the highest.',
  },
  'bda.u3.pipelining': {
    summary: 'Big tasks are split into a **chain of MapReduce jobs**: each job\'s output becomes the next job\'s input. Tools like Oozie run the chain in order.',
    picture: [{ flow: ['Job 1: clean', 'Job 2: count', 'Job 3: top 10'] }],
    points: [
      'ChainMapper runs several mappers inside one job.',
      'Each job writes to disk, which is slow; Spark avoids this by keeping data in memory.',
    ],
    analogy: 'Like an assembly line: one station cleans, the next paints, the last packs.',
    example: 'Clean web logs, count visits per page, then pick the 10 most visited pages.',
  },
  'bda.u3.yarn-intro': {
    summary: '**YARN** is Hadoop 2\'s resource manager. It decides which job gets which machines, separately from how each job runs, so many kinds of programs can share one cluster.',
    picture: [{ flow: ['Many jobs (MapReduce, Spark)', 'YARN shares the cluster', 'Each job gets containers'] }],
    points: [
      'Removes Hadoop 1\'s JobTracker bottleneck.',
      'Lets MapReduce, Spark and others run together.',
    ],
    analogy: 'Like a hotel reception assigning rooms to guests, whatever the purpose of their stay.',
    example: 'A data team runs a Spark job and a Hive query on the same cluster through YARN.',
  },
  'bda.u3.yarn-arch': {
    summary: 'YARN has one **ResourceManager** for the cluster, a **NodeManager** on every machine, an **ApplicationMaster** for each job, and **containers** where the work runs.',
    picture: [{ stack: ['ResourceManager (cluster boss)', 'ApplicationMaster (one per job)', 'NodeManager (one per machine)', 'Containers (CPU + memory slices)'] }],
    points: [
      'The ResourceManager has a scheduler and an applications manager.',
      'NodeManagers report each machine\'s resources.',
    ],
    analogy: 'ResourceManager is the hotel manager, NodeManagers are floor supervisors, the ApplicationMaster is a tour guide for one group, and containers are the rooms.',
    example: 'A job needing 10 containers of 2 GB each gets them spread over several NodeManagers.',
  },
  'bda.u3.yarn-manage': {
    summary: 'YARN runs an application step by step: submit to the ResourceManager, start an ApplicationMaster, the AM asks for containers, tasks run, and everything is released at the end.',
    picture: [{ flow: ['Client submits', 'RM starts the ApplicationMaster', 'AM requests containers', 'NodeManagers launch tasks', 'AM reports and finishes'] }],
    points: [
      'Schedulers: FIFO, Capacity, Fair.',
      'Failed containers are restarted elsewhere.',
    ],
    analogy: 'Like booking a group trip: the agent (RM) assigns a tour guide (AM), who books rooms (containers) and checks out at the end.',
    example: 'The Fair scheduler gives two teams\' jobs equal shares of the cluster.',
  },

  // ======================= UNIT IV =======================
  'bda.u4.hive-intro': {
    summary: '**Hive** lets you query huge files in Hadoop using SQL-like commands (**HiveQL**) instead of writing MapReduce code.',
    picture: [{ flow: ['HiveQL query', 'Hive compiles it', 'MapReduce / Tez / Spark jobs', 'Results'] }],
    points: [
      'Good for batch analysis, not for quick single-row updates.',
      'Tables are just structure placed over files in HDFS.',
    ],
    analogy: 'Like a translator: you speak SQL, and Hive tells Hadoop what to do in its own language.',
    example: 'SELECT city, COUNT(*) FROM orders GROUP BY city; runs over billions of rows.',
  },
  'bda.u4.hive-arch': {
    summary: 'A Hive query goes from the **client** to the **driver**, which compiles and optimises it using table details from the **metastore**, then runs it as jobs on Hadoop.',
    picture: [{ flow: ['CLI / JDBC client', 'Driver (compiler, optimiser)', 'Metastore (table info)', 'Execution engine', 'Hadoop (HDFS + YARN)'] }],
    points: [
      'The metastore keeps schemas in a normal database.',
      'HiveServer2 lets many clients connect.',
    ],
    analogy: 'Like a restaurant: the waiter (driver) takes your order, checks the menu (metastore), and the kitchen (Hadoop) cooks it.',
    example: 'A BI tool connects through JDBC to HiveServer2 to run reports.',
  },
  'bda.u4.hive-types': {
    summary: 'Hive has simple types (INT, STRING, BOOLEAN, DATE…) and **complex types**: ARRAY, MAP, STRUCT and UNIONTYPE for nested data.',
    picture: [{ table: { head: ['Type', 'Example'], rows: [['ARRAY', "['a', 'b']"], ['MAP', "{'math': 90}"], ['STRUCT', '{name, age}'], ['UNIONTYPE', 'One of several types']] } }],
    points: [
      'Complex types store nested data without extra tables.',
      'Access: arr[0], map["math"], struct.name.',
    ],
    analogy: 'Simple types are single items; complex types are boxes holding several items.',
    example: 'marks MAP<STRING, INT> stores each subject and its mark in one column.',
  },
  'bda.u4.hive-formats': {
    summary: 'Hive tables can be stored as plain text, SequenceFiles, or **columnar** formats like **RCFile**, **ORC** and **Parquet**, which read only the columns a query needs.',
    picture: [{ compare: [{ title: 'Row format (text)', items: ['Reads whole rows', 'Simple', 'Slow for analytics'] }, { title: 'Columnar (ORC, Parquet)', items: ['Reads only needed columns', 'Compresses well', 'Fast for analytics'] }] }],
    points: [
      'RCFile splits rows into groups and stores each group column by column.',
      'ORC adds indexes and better compression.',
    ],
    analogy: 'Row storage is reading every full form to find ages; columnar storage is reading just the "age" column of the register.',
    example: 'STORED AS ORC makes an average-salary query much faster.',
  },
  'bda.u4.hiveql': {
    summary: '**HiveQL** is Hive\'s SQL: create databases and tables, load data from files, and query with SELECT, WHERE, GROUP BY and JOIN.',
    picture: [{ flow: ['CREATE TABLE', 'LOAD DATA INPATH', 'SELECT … GROUP BY', 'Results'] }],
    points: [
      'Managed tables vs external tables (data stays in place).',
      'Partitions and buckets speed up queries.',
    ],
    analogy: 'It is SQL you already know, applied to files in a huge warehouse.',
    example: "LOAD DATA INPATH '/data/sales.csv' INTO TABLE sales; SELECT region, SUM(amount) FROM sales GROUP BY region;",
  },
  'bda.u4.hive-udf': {
    summary: 'When built-in functions are not enough, you write a **UDF** (user-defined function) in Java, package it as a JAR, register it, and call it in queries.',
    picture: [{ flow: ['Write a Java class extending UDF', 'Build a JAR', 'ADD JAR; CREATE FUNCTION', 'Use it in SELECT'] }],
    points: [
      'UDF: row to row. UDAF: many rows to one. UDTF: one row to many.',
    ],
    analogy: 'Like adding a new button to a calculator for an operation it does not have.',
    example: 'A UDF mask_phone() hides all but the last 4 digits of phone numbers.',
  },
  'bda.u4.pig-intro': {
    summary: '**Pig** processes big data with **Pig Latin**, a step-by-step data-flow language. Pig turns the script into MapReduce jobs.',
    picture: [{ flow: ['LOAD', 'FILTER', 'GROUP', 'FOREACH … GENERATE', 'STORE'] }],
    points: [
      'Good for ETL and data cleaning.',
      'Fewer lines of code than Java MapReduce.',
    ],
    analogy: 'Like a recipe written step by step: take this, filter that, group these, then store the result.',
    example: 'Ten lines of Pig Latin replace about 200 lines of Java for word count.',
  },
  'bda.u4.pig-types': {
    summary: 'Pig\'s data nests in layers: an **atom** (one value) inside a **tuple** (a row) inside a **bag** (a collection of tuples), plus **maps** for key-value pairs.',
    picture: [{ stack: ['Relation = outer bag', 'Bag {…}', 'Tuple (…)', 'Atom (single value)'] }],
    points: [
      'Tuples are ordered fields; bags are unordered collections.',
      'Maps look like [key#value].',
    ],
    analogy: 'Atom is a word, tuple is a sentence, bag is a paragraph of sentences.',
    example: "('Ravi', 21) is a tuple; {('Ravi', 21), ('Anu', 20)} is a bag.",
  },
  'bda.u4.pig-run': {
    summary: 'Pig runs in **local mode** (one machine, local files) for testing, or **MapReduce mode** (on the cluster, HDFS files), either in the **Grunt** shell or as a script.',
    picture: [{ compare: [{ title: 'Local mode', items: ['pig -x local', 'One machine', 'Testing'] }, { title: 'MapReduce mode', items: ['pig', 'Hadoop cluster', 'Real data'] }] }],
    points: [
      'Grunt shell for interactive use; .pig script files for batch.',
      'HDFS commands work inside Grunt (fs -ls).',
    ],
    analogy: 'Local mode is practising in your room; MapReduce mode is performing on stage.',
    example: 'pig -x local wordcount.pig tests a script on a small local file.',
  },
  'bda.u4.pig-operators': {
    summary: 'Pig Latin scripts are chains of operators: **LOAD**, **FILTER**, **FOREACH…GENERATE**, **GROUP**, **JOIN**, **ORDER** and **STORE**, with eval functions like COUNT, SUM and AVG.',
    picture: [{ flow: ['LOAD data', 'FILTER BY', 'GROUP BY', 'FOREACH GENERATE COUNT', 'STORE'] }],
    points: [
      'DUMP shows results on screen; DESCRIBE shows the schema.',
      'Nothing runs until DUMP or STORE (lazy).',
    ],
    analogy: 'Like a series of kitchen steps: wash, chop, group by dish, cook, serve.',
    example: "grouped = GROUP students BY dept; counts = FOREACH grouped GENERATE group, COUNT(students);",
  },
  'bda.u4.pig-udf': {
    summary: 'You can add your own functions to Pig (**UDFs**) in Java or Python. **Piggy Bank** is a shared library of ready-made Pig UDFs.',
    picture: [{ flow: ['Write UDF (Java / Python)', 'REGISTER the JAR', 'DEFINE an alias', 'Use it in FOREACH'] }],
    points: [
      'Eval, filter, load and store functions can all be custom.',
    ],
    analogy: 'Like adding apps to your phone for things it cannot do out of the box.',
    example: 'REGISTER piggybank.jar; then use a ready-made date-conversion function.',
  },
  'bda.u4.pig-vs-hive': {
    summary: '**Pig** is a step-by-step data-flow language for programmers doing ETL. **Hive** is SQL-like and declarative, for analysts writing reports.',
    picture: [{ table: { head: ['', 'Pig', 'Hive'], rows: [['Language', 'Pig Latin (procedural)', 'HiveQL (declarative)'], ['Users', 'Programmers', 'Analysts'], ['Best for', 'ETL, cleaning', 'Reporting, queries'], ['Schema', 'Optional', 'Required']] } }],
    points: [
      'Both turn code into Hadoop jobs.',
      'Many teams use Pig to prepare data and Hive to query it.',
    ],
    analogy: 'Pig is giving step-by-step directions; Hive is just telling the driver the destination.',
    example: 'Clean raw logs with Pig, then let analysts query the clean table in Hive.',
  },

  // ======================= UNIT V =======================
  'bda.u5.spark-intro': {
    summary: '**Apache Spark** is a fast engine for big data that keeps data **in memory** between steps, so it is much faster than MapReduce, which writes to disk after each step.',
    picture: [{ compare: [{ title: 'MapReduce', items: ['Disk between steps', 'Batch only', 'Slower'] }, { title: 'Spark', items: ['Memory between steps', 'Batch, streaming, SQL, ML', 'Up to 100× faster'] }] }],
    points: [
      'Supports Scala, Python, Java and R.',
      'Can run on YARN and read from HDFS.',
    ],
    analogy: 'MapReduce writes notes on paper after every step; Spark keeps everything in its head.',
    example: 'An iterative machine learning job that takes hours in MapReduce finishes in minutes in Spark.',
  },
  'bda.u5.spark-pros-cons': {
    summary: 'Spark is **fast, easy and general**, but it needs a lot of **memory**, has **no storage** of its own, and needs **tuning**.',
    picture: [{ compare: [{ title: 'Pros', items: ['In-memory speed', 'Simple APIs', 'Batch + streaming + ML'] }, { title: 'Cons', items: ['Needs lots of RAM', 'No own file system', 'Small-file and tuning issues'] }] }],
    points: [
      'Pick Spark for iterative and interactive work.',
    ],
    analogy: 'Like a sports car: very fast, but needs good fuel (memory) and a good mechanic (tuning).',
    example: 'A Spark job fails with out-of-memory errors until executor memory is increased.',
  },
  'bda.u5.spark-arch': {
    summary: 'A Spark program has a **driver** (with SparkContext) that plans the work, a **cluster manager** that gives out machines, and **executors** on worker nodes that run the tasks.',
    picture: [{ flow: ['Driver (SparkContext)', 'Cluster manager (YARN / standalone)', 'Executors on workers', 'Tasks'] }],
    points: [
      'Layered: storage, cluster manager, Spark core, and libraries on top.',
      'Executors also cache data in memory.',
    ],
    analogy: 'The driver is a project manager, the cluster manager is HR assigning staff, and executors are the workers.',
    example: 'spark-submit --master yarn app.py starts the driver and asks YARN for executors.',
  },
  'bda.u5.rdd': {
    summary: 'An **RDD** (Resilient Distributed Dataset) is Spark\'s basic data: a read-only collection split across machines that can be rebuilt if a part is lost.',
    picture: [{ flow: ['Create RDD (parallelize / textFile)', 'Partitions across nodes', 'Lost partition? Rebuild from lineage'] }],
    points: [
      'Immutable: transformations make new RDDs.',
      'Lineage records how each RDD was made.',
    ],
    analogy: 'Like a recipe written down: if a dish is spilt, you can cook it again from the recipe instead of keeping backups of the food.',
    example: "sc.textFile('hdfs:///logs') creates an RDD of log lines.",
  },
  'bda.u5.ops': {
    summary: 'Spark operations are **transformations** (map, filter, reduceByKey), which only build a plan, and **actions** (count, collect, saveAsTextFile), which actually run it.',
    picture: [{ flow: ['textFile', 'filter (lazy)', 'map (lazy)', 'count() runs everything'] }],
    points: [
      'Lazy evaluation lets Spark optimise the whole plan.',
      'Narrow transformations stay in one partition; wide ones shuffle data.',
    ],
    analogy: 'Transformations are writing a shopping list; an action is actually going to the shop.',
    example: "rdd.filter(lambda l: 'ERROR' in l).count() counts error lines.",
  },
  'bda.u5.dag': {
    summary: 'Spark turns your steps into a **DAG** (a graph with no loops). When an action runs, the DAG scheduler splits it into **stages** at shuffles, and stages into tasks.',
    picture: [{ flow: ['Transformations', 'DAG', 'Stages (split at shuffles)', 'Tasks on executors'] }],
    points: [
      'The DAG allows optimisation and fault recovery.',
      'The Spark UI shows the DAG of each job.',
    ],
    analogy: 'Like planning a wedding: tasks that depend on each other form a chart, and independent tasks run at the same time.',
    example: 'map → filter → reduceByKey makes two stages: before and after the shuffle.',
  },
  'bda.u5.case-study': {
    summary: 'Case study: load student records into Spark, clean them, group and sort them to find **trends**, **difficult subjects** and **top performers**.',
    picture: [{ flow: ['Load CSV', 'Clean', 'Group by subject', 'Average marks and pass rate', 'Top performers'] }],
    points: [
      'Difficulty = low average or low pass rate.',
      'Rank students by total or GPA.',
    ],
    analogy: 'Like a principal reviewing every class\'s marks at once to see which subjects need more teaching.',
    example: "df.groupBy('subject').avg('marks').orderBy('avg(marks)') lists the hardest subjects first.",
  },
}
