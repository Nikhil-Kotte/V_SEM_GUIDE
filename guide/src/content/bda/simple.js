// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default {
  "bda.u3.yarn-arch": {
    "summary": "**YARN** manages resources in a Hadoop cluster, which is a group of computers working together. It decides how applications get memory and CPU time, so several applications can share the computers.",
    "points": [
      "**ResourceManager (RM)** manages resources across the cluster. Its **Scheduler** allocates resources but does not track tasks. Its **ApplicationsManager** accepts applications and arranges to start their ApplicationMasters.",
      "**NodeManager (NM)** runs on each worker computer. It launches containers and watches their resource use. It sends **heartbeats**, meaning regular status messages, to the RM.",
      "**ApplicationMaster (AM)** coordinates one application. It requests resources from the RM and works with NMs to run tasks. It tracks progress and arranges retries when tasks fail.",
      "A **Container** is an allocation of memory and CPU resources on one computer. A task runs using those resources. The AM also runs in a container.",
      "**FIFO** means first in, first out. Applications receive priority in arrival order.",
      "The **Capacity Scheduler** uses queues with guaranteed resource shares for different teams.",
      "The **Fair Scheduler** shares resources fairly among applications over time. With equal weights, applications aim to receive equal shares."
    ],
    "analogy": "Think of a college workshop. The RM allocates equipment across teams. Each room has an NM supervising it. Each team has an AM coordinating its work. A container is an assigned workspace with equipment.",
    "example": "An application needs two tasks. Its AM requests two containers. The RM allocates them, and the relevant NMs launch the tasks. The AM then tracks their progress."
  },
  "bda.u3.yarn-intro": {
    "summary": "**YARN** means **Yet Another Resource Negotiator**. It manages resources in **Hadoop 2**, such as processor time and memory, across a **cluster**, a group of computers working together. It separates assigning resources from managing how each application runs.",
    "points": [
      "In **Hadoop 1**, one **JobTracker** assigned resources, scheduled work and monitored all **MapReduce** tasks. MapReduce is a way to process large amounts of data in smaller parts. Doing everything made the JobTracker a bottleneck that limited growth.",
      "In YARN, the **ResourceManager** shares the cluster’s resources among applications. Each application has its own **ApplicationMaster**, which coordinates and monitors that application’s work.",
      "Each worker computer has a **NodeManager**. It manages the resources and running containers on that computer.",
      "A **container** is an allocation of resources, such as CPU and memory, on one computer. Containers replace Hadoop 1’s fixed map and reduce slots, helping use available resources better.",
      "**Scalability** means handling a larger cluster and more work. **Multi-tenancy** means several applications can share the cluster. YARN supports different processing systems, including MapReduce and Spark.",
      "**Compatibility** means existing MapReduce jobs can still run with YARN."
    ],
    "analogy": "Think of a shared kitchen. The **ResourceManager** assigns cooking space and equipment. Each **ApplicationMaster** acts like a chef who organises one order using those resources.",
    "example": "A MapReduce job analyses sales while a Spark application analyses website visits. YARN allocates containers to both, so they can share the same cluster."
  },
  "bda.u3.yarn-manage": {
    "summary": "**YARN** manages cluster resources: the memory and processing power of computers working together. It gives each **application** (a submitted job) resources and coordinates its execution.",
    "points": [
      "The **client** submits the application to the **ResourceManager (RM)**, which manages resources across the cluster.",
      "The RM allocates a **container**, an allowance of memory and CPU resources. A **NodeManager (NM)**, the manager on one computer, launches the **ApplicationMaster (AM)** inside it.",
      "The AM coordinates that application. It **registers** with the RM, then sends **resource requests** for containers with suitable memory, **vcores** (virtual CPU cores), and preferred locations.",
      "The RM’s **scheduler** grants containers. The AM asks NodeManagers to launch **tasks**, smaller pieces of the job, inside them. Tasks report progress to the AM. The client can check status through the RM or AM.",
      "Resource limits are configured in **yarn-site.xml**. **Queues** share resources between teams using capacity or fair scheduling. **Data locality** means trying to run tasks near their data in **HDFS**, Hadoop’s distributed file system.",
      "**Heartbeats** are regular status messages from NMs or AMs to the RM. For **fault tolerance**, the AM retries failed tasks, while the RM can restart a failed AM.",
      "When work finishes, the AM **unregisters**, and the application’s containers are released for other work."
    ],
    "analogy": "Think of a college event: the RM assigns rooms, the AM coordinates one team, and NMs supervise individual rooms.",
    "example": "For a word-count job, the AM requests containers near the stored files. NodeManagers launch counting tasks, which report progress to the AM."
  },
  "bda.u4.hive-arch": {
    "summary": "**Hive Architecture** shows how Hive turns a query into work that Hadoop can run. A query is a request for data. Hive plans the work, runs it, and returns the results.",
    "points": [
      "**Clients / UI** are where queries enter Hive. People use tools such as Beeline. Applications can connect through **JDBC**, **ODBC**, or **Thrift**, which provide ways to communicate with Hive.",
      "**HiveServer2** accepts queries from remote clients. It supports secure access for several users at once.",
      "The **Driver** coordinates the query. It manages the user’s session, asks for a plan, starts execution, and returns results.",
      "The **Compiler** checks the query’s structure and table details. It builds an **execution plan**: steps arranged as a **DAG**, a graph showing dependencies without circular paths.",
      "The **Optimizer** improves that plan. For example, **predicate pushdown** applies filters closer to where data is read, reducing unnecessary processing.",
      "The **Metastore** stores **metadata**, meaning information about data. This includes table structure, partitions, and HDFS locations. It uses a relational database such as MySQL. Partitions divide table data into groups.",
      "The **Execution Engine** runs the plan using **MapReduce**, **Tez**, or **Spark** jobs. **YARN** manages computing resources. **HDFS** stores the actual table data that tasks read."
    ],
    "analogy": "Think of a restaurant. The driver coordinates your order, the compiler plans its preparation, the metastore lists where ingredients are kept, and the execution engine does the cooking.",
    "example": "You request students scoring above 80. Hive checks the table details, plans the filtering, reads the stored data, and returns matching students through the driver."
  },
  "bda.u4.hive-formats": {
    "summary": "**Hive file formats** are different ways to store a table’s data. **RCFile (Record Columnar File)** stores data in small groups, with each column’s values together inside its group.",
    "points": [
      "**TEXTFILE** stores readable text, with separators such as commas between values. It is easy to load, but usually takes more space and is slower to query.",
      "**SEQUENCEFILE** stores binary key–value records: each record has a key and an associated value. It supports compression and splitting for parallel processing. It is useful for intermediate data produced between processing steps.",
      "**ORC** uses column storage, indexes and statistics for fast Hive queries. **PARQUET** supports nested data and sharing across tools. **AVRO** stores rows and includes a **schema**, which describes the data’s structure.",
      "**RCFile** first divides rows into **row groups**, or horizontal slices. Inside each group, it stores values column by column. This is **columnar storage within row groups**.",
      "**Metadata**, meaning information about the stored data, records details such as row counts and column lengths. **Sync markers** help readers locate valid reading positions.",
      "**Column pruning** means reading only the columns a query needs. RCFile can skip reading and decompressing unwanted columns.",
      "Each column’s data within a group can be compressed separately. Similar values stay together, helping compression. Grouping rows also supports efficient loading."
    ],
    "analogy": "Imagine dividing exam sheets into small bundles. Within each bundle, you collect all student IDs together, then all subjects, then all scores.",
    "example": "For a table containing id, subject and score, finding the average score needs only the **score** column. RCFile can skip the other two columns."
  },
  "bda.u4.hive-intro": {
    "summary": "**Hive** is a **data-warehouse layer on Hadoop**: it helps you study huge amounts of stored data. **Hadoop** supports storing and processing data across computers; **HDFS (Hadoop Distributed File System)** stores its files. Hive lets you ask questions using **HiveQL**, an SQL-like language, instead of writing **MapReduce** processing code.",
    "points": [
      "Hive began at Facebook and became an **Apache** project. You define tables over data files. Hive turns your queries into processing jobs using engines such as **MapReduce** or **Tez**.",
      "**Schema on read** means applying the table’s structure when querying the data. Traditional databases usually use **schema on write**, applying that structure when storing data.",
      "The **metastore** holds metadata: information about your data, such as table names, columns, and file locations.",
      "**Partitions** separate data by values, such as date. **Buckets** divide data into groups using a calculation on a column. Both can help queries run faster.",
      "Hive supports many file formats and **user-defined functions**, which are custom operations you add.",
      "Hive suits **OLAP (Online Analytical Processing)**: studying large datasets in batches. A traditional **RDBMS (Relational Database Management System)** usually suits **OLTP (Online Transaction Processing)**, such as quick purchases and account updates. Hive generally has slower responses and more restricted updates."
    ],
    "analogy": "Think of HDFS as a huge storeroom. Hive is the assistant who understands your question, checks the labelled records, and calculates the answer.",
    "example": "A shop stores years of sales in HDFS. Hive can calculate total sales for each month without you writing the detailed processing steps."
  },
  "bda.u4.hive-types": {
    "summary": "**Hive data types** tell Hive what kind of value a table column can store. **Primitive types** store single values, while **complex types** hold collections or grouped data.",
    "points": [
      "**Integer types** store whole numbers: **TINYINT** uses 1 byte, **SMALLINT** 2 bytes, **INT** 4 bytes, and **BIGINT** 8 bytes. A byte is a unit of storage.",
      "**FLOAT** and **DOUBLE** store approximate decimal numbers. **DECIMAL(p, s)** stores exact decimal numbers: p is the total number of digits, and s is the number after the decimal point.",
      "**STRING** stores text. **VARCHAR(n)** stores up to n characters. **CHAR(n)** has a fixed length of n characters and pads shorter text with spaces.",
      "**BOOLEAN** stores true or false. **BINARY** stores raw bytes. **DATE** stores a calendar date, **TIMESTAMP** stores date and time, and **INTERVAL** represents a duration.",
      "**ARRAY** is an ordered list whose items share one type. Positions start at zero, so subjects[0] gets the first subject.",
      "**MAP** stores key–value pairs: a label and its associated value. marks['maths'] gets the value stored under the key 'maths'.",
      "**STRUCT** groups named fields, which can have different types. address.city gets its city field. **UNIONTYPE** holds one value from several allowed types at a time."
    ],
    "analogy": "Think of a student form: age is one value, subjects are a list, and an address groups several related details.",
    "example": "A student has subjects ['CSE', 'IT'], marks {'maths': 90}, and an address with city 'Pune'. Then subjects[0] gives 'CSE', marks['maths'] gives 90, and address.city gives 'Pune'."
  },
  "bda.u4.hive-udf": {
    "summary": "**Hive UDFs** let you add your own functions when Hive’s built-in functions cannot do a task. You write the logic in Java, make it available to Hive, and use it in **HiveQL**, Hive’s SQL-like query language.",
    "points": [
      "A **UDF (User-Defined Function)** works on one row at a time and returns one value. For example, grade(score) turns a student’s score into a grade.",
      "A **UDAF (User-Defined Aggregate Function)** combines values from many rows into one result. **SUM** is a built-in aggregate function. A custom median function is an example of a UDAF.",
      "A **UDTF (User-Defined Table-Generating Function)** turns one input row into multiple output rows. For example, **explode(array)** produces a separate row for each item in an array, which is a list of values.",
      "For a simple UDF, write a Java class that extends Hive’s **UDF** class. Put the calculation inside its **evaluate()** method. Hive calls this method to get the result.",
      "Compile the class and package it in a **JAR**, a file that bundles Java code. Use **ADD JAR** to load it. Then use **CREATE TEMPORARY FUNCTION** to register its name for the current session.",
      "Call the registered function in a query like a built-in function. In the notes, a **null** score, meaning a missing value, returns null."
    ],
    "analogy": "A UDF is like adding your own grading rule to a calculator.",
    "example": "For a row containing Ravi and score 82, grade(score) returns A because 82 is at least 75 but below 90."
  },
  "bda.u4.hiveql": {
    "summary": "**HiveQL** is the SQL language used in **Hive** to organise and analyse large amounts of stored data. You write commands to describe tables, load data files and answer questions about the data.",
    "points": [
      "**DDL (Data Definition Language)** commands organise databases and tables. CREATE makes them, SHOW lists them, USE selects a database, ALTER changes their details, and DROP removes them. DESCRIBE shows a table’s structure.",
      "**HDFS (Hadoop Distributed File System)** stores files across computers. A Hive table gives stored data column names and types. **LOAD DATA** brings files into a table’s storage location.",
      "**SELECT** retrieves data. **WHERE** filters rows, **GROUP BY** groups similar rows, and **JOIN** combines related rows from tables. **ORDER BY** sorts results, **LIMIT** restricts their number, and **DISTINCT** removes duplicates.",
      "**Aggregate functions** calculate a result from several rows. COUNT counts, SUM adds, AVG finds the average, and MIN and MAX find the smallest and largest values.",
      "**Partitioning** separates data into folders by column values, such as year. Filtering by that column lets Hive skip unrelated folders. **Bucketing** uses a hash calculation on a column to divide data into a fixed number of files. It can help sampling and some joins.",
      "Dropping a **managed table** deletes its data too. Dropping an **external table** normally keeps the underlying files."
    ],
    "analogy": "Partitioning is like keeping each year’s exam papers in a separate cupboard.",
    "example": "For Maths scores of 60 and 80, grouping by subject and applying AVG(score) gives Maths an average of 70."
  },
  "bda.u4.pig-intro": {
    "summary": "**Apache Pig** is a platform that makes large datasets easier to process. You write steps in **Pig Latin**, and Pig turns them into **MapReduce jobs**, which split data processing across computers on **Hadoop**.",
    "points": [
      "Developed at Yahoo, Pig reduces the Java code needed for MapReduce. **Pig Latin** is **procedural**: you describe a sequence, such as load → filter → group → store.",
      "Pig handles structured data, like rows with fixed fields, and semi-structured data, like logs. A **schema**, which describes fields and their types, is optional. **UDFs**, or user-defined functions, let you add custom processing.",
      "The **Grunt shell** lets you enter commands interactively. **PigServer** lets a program submit Pig commands.",
      "The **Parser** checks syntax and types. It creates a **logical plan**: a **DAG**, or directed acyclic graph, showing processing steps and their dependencies without loops.",
      "The **Optimizer** improves the plan, for example by filtering unwanted rows early. The **Compiler** converts the plan into MapReduce jobs.",
      "The **Execution engine** submits jobs in dependency order. Pig runs on the client machine; its processing jobs run on Hadoop. **YARN** manages cluster resources, and **HDFS** stores input and output files.",
      "Pig supports **batch processing**: processing datasets together. It is useful for cleaning data and **ETL**—extracting, transforming and loading data. Unlike a database, it has no indexes, transactions or random writes."
    ],
    "analogy": "Pig Latin is like a recipe. Pig plans the kitchen work, while Hadoop’s computers perform it.",
    "example": "For shop sales, load records, remove invalid entries, group by product, calculate total sales, and save the results."
  },
  "bda.u4.pig-operators": {
    "summary": "**Pig Latin** processes data step by step. **Relational operators** read, change, group or save data, while **eval functions** calculate values or work with text and collections.",
    "points": [
      "A **tuple** is one row. A **relation** is a collection of rows. A **bag** holds tuples and can contain duplicates.",
      "**LOAD** reads data. **STORE** saves results, often to **HDFS**, Hadoop’s distributed file system. **DUMP** displays results. **PigStorage** reads or writes text with separators such as commas.",
      "**FILTER … BY** keeps rows that meet a condition. **FOREACH … GENERATE** selects columns or calculates values for each row.",
      "**GROUP … BY** collects rows with the same key, such as department. Each output row contains **group**, the key, and a bag of matching rows. **COGROUP** groups multiple relations using matching keys. **JOIN** combines matching rows.",
      "**ORDER … BY** sorts rows. **DISTINCT** removes duplicates. **LIMIT** keeps up to a chosen number of rows. **UNION** combines relations. **SPLIT** sends rows into separate relations.",
      "**COUNT** and **COUNT_STAR** count tuples, with different handling of nulls, meaning missing values. **SUM**, **AVG**, **MIN** and **MAX** calculate totals, averages, minimums and maximums. **TOKENIZE** splits text into words; **FLATTEN** expands its bag into separate rows.",
      "**DESCRIBE** shows the schema, meaning field names and types. **EXPLAIN** shows execution plans. **ILLUSTRATE** demonstrates processing with sample data."
    ],
    "analogy": "Think of sorting exam papers: keep passing papers, make department piles, then calculate each pile’s average.",
    "example": "For CS marks 30, 60 and 80, **FILTER** keeps 60 and 80. After **GROUP**, **COUNT** gives 2 and **AVG** gives 70."
  },
  "bda.u4.pig-run": {
    "summary": "**Apache Pig** helps you process data using instructions called **Pig Latin**. You choose an **execution mode** to decide where the work happens, and a way to give Pig your instructions.",
    "points": [
      "**Local mode** starts with **pig -x local**. It uses one **JVM** (Java Virtual Machine, which runs Java programs) and files on your computer. Use it to test small data.",
      "**MapReduce mode** starts with **pig** or **pig -x mapreduce**. It runs processing jobs on a Hadoop **cluster**, a group of computers working together. Files are stored in **HDFS**, Hadoop’s distributed file system. Use it for large data.",
      "**Interactive mode** means typing instructions into **Grunt**, Pig’s command shell. **Batch mode** runs instructions saved in a file: **pig script.pig**. **Embedded mode** calls Pig from another program using **PigServer**.",
      "To install Pig, download and unpack it. Set **PIG_HOME**, add **$PIG_HOME/bin** to **PATH**, and configure **HADOOP_HOME**. Check with **pig -version**.",
      "In Grunt’s MapReduce mode, **fs -ls** lists HDFS files, **fs -mkdir** creates a folder, and **fs -put** uploads a local file.",
      "**fs -cat** displays file contents. **fs -copyToLocal** downloads HDFS files. **sh ls** lists local files through the operating system’s shell. **exec script.pig** runs a script from Grunt."
    ],
    "analogy": "**Local mode** is like doing an assignment alone. **MapReduce mode** is like dividing a big assignment among classmates.",
    "example": "In Grunt’s MapReduce mode, run **fs -mkdir /user/cse/input**, then **fs -put students.csv /user/cse/input**. Your local CSV file is now in HDFS."
  },
  "bda.u4.pig-types": {
    "summary": "Pig stores data as single values and groups of values. Its **data model**, meaning how it organises data, uses **atoms**, **tuples**, **bags**, and **maps**.",
    "points": [
      "An **atom** is one value, such as 88 or 'Megha'. Its **data type** tells Pig what kind of value it is. Simple types include **int**, **long**, **float**, **double**, **chararray**, **bytearray**, **boolean**, **datetime**, **biginteger**, and **bigdecimal**. A **chararray** stores text.",
      "A **tuple** is one row of fields. A field is one item in that row. Fields have a fixed order. Tuples use parentheses: (101, 'Megha', 88).",
      "A **bag** is a collection of tuples. It has no fixed order, and repeated tuples are allowed. Bags use braces: {(101, 'Megha'), (103, 'Preethi')}.",
      "A **map** stores **key–value pairs**. A key is a text label used to find its value. Maps use square brackets: ['dept'#'CSE', 'gpa'#8.8]. Keys are **chararrays**.",
      "A **relation** is an outer bag of tuples. For example, **students** can name the relation created by **LOAD**, which reads data.",
      "A **schema** describes field names and types. Without a schema, fields default to **bytearray**. Refer to fields by name or position: **$0** is first, **$1** is second."
    ],
    "analogy": "Think of a bag holding student slips. Each slip is a tuple. Each individual detail on it is an atom.",
    "example": "For (101, 'Megha', 88), a schema could name the fields id, name, and marks. Both marks and **$2** refer to 88. **DESCRIBE** displays the relation’s schema."
  },
  "bda.u4.pig-udf": {
    "summary": "**Apache Pig** helps you process large amounts of data. If its built-in functions cannot do a task, you can add a **UDF**, meaning **User-Defined Function**. **Piggy Bank** is a shared collection of ready-made UDFs that you can reuse.",
    "points": [
      "A **UDF** is a function you write for a particular task. Pig supports UDFs written in **Java** or **Python**, using **Jython** for the Python approach shown in your notes.",
      "An **eval function** takes input and produces a result, such as changing a name to capital letters. A Java eval UDF extends **EvalFunc**, the base class that provides its starting structure. Its **exec** method contains the work to perform.",
      "A **filter function** returns a **boolean**, meaning true or false, to help decide which records to keep. Java filter UDFs extend **FilterFunc**. **Load/store functions** handle reading or writing custom data formats.",
      "**REGISTER** makes functions in a Java **JAR**, a package of Java code, or a script available to Pig. **DEFINE** gives a function a short alias, or nickname.",
      "Python UDFs can use **@outputSchema** to describe their output’s name and data type.",
      "**Piggy Bank** contains community-contributed Java UDFs for strings, maths, dates, and loading data. **CSVExcelStorage** is one example."
    ],
    "analogy": "A UDF is a tool you make yourself. Piggy Bank is a shared toolbox containing tools others have made.",
    "example": "Register myudfs.jar, then apply its **UPPER** UDF to student names using **FOREACH … GENERATE**. The name 'ravi' becomes 'RAVI'."
  },
  "bda.u4.pig-vs-hive": {
    "summary": "**Pig** and **Hive** let you process large amounts of data on **Hadoop** without writing detailed processing programs yourself. Pig suits data preparation, while Hive suits queries and reports.",
    "points": [
      "**Pig Latin** is **procedural**: you describe how to process data, step by step. This suits programmers and data engineers.",
      "**HiveQL** is **declarative** and similar to **SQL**, the language used to query databases. You describe what result you want. This suits analysts and SQL developers.",
      "Pig mainly handles **ETL**: extracting data, transforming or cleaning it, and loading it somewhere useful. Hive mainly handles **data warehousing**, which organizes data for analysis and reporting.",
      "Pig handles structured data, such as tables, and **semi-structured data**, whose layout can vary. Its **schema**, or description of fields and their types, is optional. Hive mostly works with structured data and requires a table schema, stored in its **metastore**.",
      "Hive supports **partitions**, which divide table data into groups, and **JDBC/ODBC**, standard connections for database tools. Pig has no native equivalents or built-in metastore.",
      "Compared with **MapReduce**, which usually requires detailed Java programs, Pig needs much less code. Joins are simpler, and users need no separate compilation and packaging step."
    ],
    "analogy": "Pig is like giving a cook step-by-step instructions. Hive is like ordering a dish and letting the cook decide the steps.",
    "example": "For shop sales, use Pig to clean messy records. Use Hive to calculate total sales for each month."
  },
  "bda.u5.case-study": {
    "summary": "This case study uses **Apache Spark**, a tool that can process data across many computers, to study student performance. We load student records, clean them, and compare marks and attendance to find useful patterns.",
    "points": [
      "**Loading:** Read students.csv into a **DataFrame**, a table with rows and columns. Each row contains a student's ID, name, department, marks, GPA, and attendance.",
      "**Data cleaning:** Remove repeated student IDs. Keep only rows where marks and attendance are between 0 and 100. Add a **result** column: marks of 40 or more mean PASS; below 40 means FAIL.",
      "**groupBy + agg:** Put students from the same department together. Then calculate each department's student count, average marks, and average attendance. These group calculations are called **aggregations**.",
      "**Sorting:** Arrange departments by average marks, lowest first. MECH has the lowest average, 61.50. This may suggest greater difficulty, but marks alone cannot prove which department is hardest.",
      "**Top performers:** Sort marks from highest to lowest. Use GPA to decide the order when marks are equal. Select the first five students.",
      "**At-risk students:** Find students with attendance below 75%. Their records can help identify students who may need support."
    ],
    "analogy": "Think of sorting report cards into department piles, calculating each pile's average, and picking out the highest scores.",
    "example": "Lokesh has 60% attendance and 45 marks. He passes, but is flagged for low attendance. Low attendance and low marks appearing together does not prove that one caused the other."
  },
  "bda.u5.dag": {
    "summary": "A **DAG (Directed Acyclic Graph)** is Spark’s plan for processing data. Think of it as steps joined by arrows. **Directed** means the arrows show which steps depend on earlier steps. **Acyclic** means no path loops back to the same step.",
    "points": [
      "**Transformations**, such as map and filter, describe changes to data. Spark records them first and waits to run them. This is called **lazy evaluation**.",
      "An **RDD** is a dataset divided into **partitions**, or smaller chunks. Its **lineage** records how it was created from earlier data.",
      "An **action**, such as saving results, triggers a **job**: the work needed to produce that result.",
      "The **DAG scheduler** divides work into **stages** at **shuffle** boundaries. A shuffle redistributes data across partitions. This is needed for a **wide dependency**. **Narrow transformations** can be **pipelined**, meaning processed together within one stage.",
      "Each stage has a **task set**, with one **task** per partition being processed. The **task scheduler** assigns tasks to **executors**, the processes that run the work.",
      "If data is lost, Spark uses lineage to recompute the needed partitions. Pipelining can reduce intermediate disk writes. The **Spark UI** helps you inspect jobs and stages."
    ],
    "analogy": "Imagine sorting classroom answer sheets. Students first sort their own piles in parallel. Exchanging sheets to group them by subject is like a shuffle.",
    "example": "For word counting: textFile → flatMap → map → reduceByKey → saveAsTextFile. This gives **1 job and 2 stages**: first read and prepare word pairs; then, after the shuffle, combine counts and save."
  },
  "bda.u5.ops": {
    "summary": "Spark operations are of two types: **Transformations** and **Actions**. Transformations describe changes to data. Actions ask Spark to run the required steps and produce a result.",
    "points": [
      "An **RDD** (Resilient Distributed Dataset) is a collection of data split into **partitions**, or smaller chunks, that Spark can process across computers.",
      "A **transformation** returns a new RDD. It does not change the original RDD. For example, **map** changes each item, **filter** keeps matching items, and **flatMap** can produce several items from one input.",
      "Transformations are **lazy**. Spark records the steps instead of immediately processing all the data. This recorded history is called **lineage**.",
      "A **narrow transformation**, such as map or filter, works without redistributing data between partitions. A **wide transformation**, such as reduceByKey, may require a **shuffle**: moving data between partitions. This movement adds work and can be expensive.",
      "An **action** triggers computation. **collect** returns all items to the **driver**, the program coordinating Spark. **count** returns the number of items. **saveAsTextFile** writes data to storage.",
      "Separate actions can recompute an uncached RDD. **cache()** lets Spark keep computed data for reuse."
    ],
    "analogy": "Think of transformations as writing cooking instructions. An action is the request to prepare and serve the food.",
    "example": "Start with [1, 2, 3, 4]. **filter** keeps even numbers: [2, 4]. **map** squares them: [4, 16]. These are planned transformations. **collect** triggers execution and returns [4, 16]."
  },
  "bda.u5.rdd": {
    "summary": "An **RDD (Resilient Distributed Dataset)** is Spark’s basic way to hold and process data. It splits a collection into **partitions**, or smaller chunks, that can be processed in parallel across computers. Each partition is handled by one **task**, a unit of work.",
    "points": [
      "**From a collection:** Use **parallelize()** to turn an existing list, such as student marks, into an RDD. You can choose the number of partitions.",
      "**From a file:** Use **textFile()** to read a text file. Each line becomes one RDD element. Files can come from local storage or **HDFS**, a storage system spread across computers.",
      "**From another RDD:** A **transformation**, such as map() or flatMap(), creates a new RDD. RDDs are **immutable**, meaning their existing contents cannot be changed.",
      "**From a DataFrame:** A **DataFrame** stores data in named columns, like a table. Its **.rdd** property gives an RDD containing its rows.",
      "**Resilient** means recoverable after failure. Spark uses **lineage**, the record of how an RDD was created, to rebuild lost partitions.",
      "**Lazy evaluation** means processing waits until an **action** requests a result. **cache()** and **persist()** can keep computed data for reuse, avoiding repeated work. Storage may use memory or disk.",
      "RDDs offer control over partitions and support unstructured data. However, they lack DataFrames’ built-in query optimiser, which improves execution plans. Python RDD processing is generally slower than JVM-based processing."
    ],
    "analogy": "Think of classmates sharing a stack of worksheets. Each smaller stack is a partition.",
    "example": "parallelize([10, 20, 30, 40], 2) creates an RDD with four numbers and two partitions."
  },
  "bda.u5.spark-arch": {
    "summary": "**Layered architecture** means organising Spark into parts with different jobs. Together, these layers help an application read data, get computing resources, process data and produce results.",
    "points": [
      "**Storage layer**: Holds the data Spark reads and writes. Examples include HDFS, S3, HBase, Cassandra and local files.",
      "**Resource management layer**: The **cluster manager** allocates computing resources. Your notes list Spark standalone, YARN, Mesos and Kubernetes.",
      "**Spark Core**: Handles task scheduling, memory, reading and writing data, and recovery after failures. It supports **RDDs**, collections of data divided across machines.",
      "**Libraries layer**: Provides tools for SQL queries, streaming data, machine learning and graphs. These tools use Spark Core.",
      "**API layer**: Lets you write Spark programs using Scala, Java, Python or R. An **API** is a way for your program to use Spark’s features.",
      "**Driver program**: Runs the main program and plans the work. Its **SparkContext** connects it to the cluster, a group of machines. The driver divides work into stages and tasks.",
      "**Worker nodes** are machines that host **executors**. An executor is a process that runs tasks and caches data, meaning it keeps data for reuse. A **task** processes one **partition**, a piece of the data."
    ],
    "analogy": "Think of a kitchen: storage holds ingredients, the manager assigns resources, the head chef plans work, and cooks carry out individual jobs.",
    "example": "To count words in a large file, executors start on workers. The driver sends tasks. Executors count words in different partitions and return results. When the application ends, its executors are released."
  },
  "bda.u5.spark-intro": {
    "summary": "**Apache Spark** is a **cluster computing engine**: it shares large data-processing jobs across several computers. It can keep working data in **RAM**, the computer’s fast temporary memory, making repeated calculations faster than disk-based **MapReduce**. Spark began at UC Berkeley’s AMPLab in 2009.",
    "points": [
      "**In-memory computing**: Spark can keep intermediate results in RAM for reuse. This reduces slow disk reads and writes. Some work can still use disk.",
      "**Lazy evaluation**: A **transformation**, such as filtering rows, builds a plan. An **action**, such as counting rows, starts execution. This lets Spark optimise the plan before running it.",
      "**Fault tolerance through lineage**: An **RDD** is a collection of data spread across computers. Its **lineage** records how it was created. Spark can use this record to rebuild lost pieces after a failure.",
      "**Unified engine**: One core supports batch processing, SQL queries, streaming data, machine learning and graph processing.",
      "**Immutability and parallelism**: Operations create new datasets instead of changing existing ones. Data is divided into **partitions**, or smaller pieces, which computers can process at the same time.",
      "**Runs anywhere**: Spark supports different cluster systems and storage sources. You can write programs in Scala, Java, Python or R."
    ],
    "analogy": "Think of students sharing a large assignment. Keeping useful notes on their desks is like keeping data in RAM: they avoid repeatedly fetching it from a cupboard.",
    "example": "To count passing students, Spark first plans a filter on marks. Requesting the count starts execution across the data partitions."
  },
  "bda.u5.spark-pros-cons": {
    "summary": "**Apache Spark** processes large amounts of data quickly. It supports many tasks, but needs enough **RAM** (working memory), separate storage and careful settings.",
    "points": [
      "**Speed:** Spark can keep reusable data in memory. It can be up to **100× faster in memory** and about **10× faster on disk** than **MapReduce**. These are possible gains, not guarantees.",
      "**Ease of use:** Its **high-level APIs** let you request operations without writing every detail. It supports Python, Scala, Java and R. Its **interactive shell** lets you try commands immediately.",
      "**Generality:** One engine handles **batch processing** (stored data), interactive queries, **streaming** (incoming data), **machine learning** and **graphs** (connected items). It works with many systems and data sources.",
      "**Fault tolerance:** After a failure, **lineage**, a record of processing steps, helps Spark rebuild lost data. Its **DAG**, a dependency diagram without loops, supports more flexible workflows than MapReduce’s map-and-reduce structure.",
      "**Memory hungry:** RAM costs money. When data does not fit, Spark may **spill to disk**, slowing processing. It has **no file system** of its own and uses storage such as HDFS or S3.",
      "**Tuning:** Performance needs suitable **partitions** (data chunks), memory settings and **caching** (keeping data for reuse). Many **small files** add overhead.",
      "**Limits:** Default streaming uses **micro-batches**, processing small groups rather than each event instantly. Specialist tools may offer more built-in algorithms."
    ],
    "analogy": "Memory is your study desk; disk is a cupboard. Keeping notes nearby saves repeated trips.",
    "example": "**K-means** is **iterative**: it revisits data repeatedly. Spark can cache that data, avoiding repeated disk reads."
  }
}
