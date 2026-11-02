import { Q, Predict } from '../pyq-helpers.js'

// Past BDA papers are from 22ADE12/20ADC14. Spark SQL, MLlib, GraphX and streaming questions are excluded.
export default [
  // ---------------- YARN ----------------
  Q('bda-yarn-resources', 'bda.u3.yarn-manage', 'How does YARN manage resources and applications?', ['bda-dec23cse:4']),
  Predict('bda-pred-yarn-arch', 'bda.u3.yarn-arch', 'Explain the YARN architecture (ResourceManager, NodeManager, ApplicationMaster, Container) with a diagram.'),
  Predict('bda-pred-yarn-why', 'bda.u3.yarn-intro', 'Why was YARN introduced? Compare MapReduce v1 and YARN.'),

  // ---------------- Hive ----------------
  Q('bda-hive-arch', 'bda.u4.hive-arch', 'Explain the Hive architecture with a neat diagram. How is a HiveQL query executed?', ['bda-may26:5', 'bda-nov25', 'bda-dec23aids:5', 'bda-dec24:2', 'bda-dec22it:2', 'bda-jun23:4']),
  Q('bda-hive-vs-rdbms', 'bda.u4.hive-intro', 'Compare Hive with a traditional RDBMS.', ['bda-may26:5', 'bda-dec24:5', 'bda-jun24:3']),
  Q('bda-hive-ddl', 'bda.u4.hiveql', 'Write HiveQL to create, alter, drop and manage databases and tables. Explain Hive commands.', ['bda-jun23:5', 'bda-dec22it:5', 'bda-dec23aids:5']),
  Q('bda-hiveql-script', 'bda.u4.hiveql', 'Write a HiveQL script to analyse student marks (create table, load data, query averages/top scorers).', ['bda-nov25:7'], { numerical: true }),
  Q('bda-hiveql-agg', 'bda.u4.hiveql', 'Explain HiveQL with aggregate functions and UDFs.', ['bda-dec24:5']),
  Q('bda-hive-types', 'bda.u4.hive-types', 'Explain HiveQL data types (primitive and complex).', ['bda-dec22it:5']),
  Q('bda-hive-udf', 'bda.u4.hive-udf', 'How do UDFs extend Hive queries?', ['bda-nov25:3', 'bda-dec24']),
  Predict('bda-pred-rcfile', 'bda.u4.hive-formats', 'Explain Hive file formats (TextFile, SequenceFile, RCFile, ORC). How is RCFile laid out?'),

  // ---------------- Pig ----------------
  Q('bda-pig-latin', 'bda.u4.pig-operators', 'Explain Pig Latin: its structure, relational operators and data-processing operators with examples.', ['bda-dec24:5', 'bda-dec23aids:3', 'bda-jun23:4', 'bda-dec22it:5']),
  Q('bda-pig-script', 'bda.u4.pig-operators', 'Write a Pig script to load, filter and group data (e.g., max temperature per year from NCDC data).', ['bda-may26:5', 'bda-jun24:9'], { numerical: true }),
  Q('bda-pig-what', 'bda.u4.pig-intro', 'What is Pig? Why do we need Pig Latin? How is Pig used in practice?', ['bda-may26:2', 'bda-nov25:5', 'bda-dec23aids:4']),
  Q('bda-pig-vs-db', 'bda.u4.pig-vs-hive', 'Compare Pig with databases / Hive.', ['bda-dec24:5', 'bda-jun23:3', 'bda-jun24:9']),
  Q('bda-pig-modes', 'bda.u4.pig-run', 'Explain the two execution modes of Pig and how to install and run Pig.', ['bda-jun23:5', 'bda-dec23aids:4']),
  Q('bda-pig-types', 'bda.u4.pig-types', 'Explain the Pig data model and data types (atom, tuple, bag, map).', ['bda-may26:5', 'bda-dec22it:5']),
  Q('bda-pig-udf', 'bda.u4.pig-udf', 'Explain UDFs in Pig.', ['bda-nov25:2', 'bda-dec24']),
  Predict('bda-pred-piggybank', 'bda.u4.pig-udf', 'What is Piggy Bank? How do you register and use a UDF from it?'),

  // ---------------- Spark ----------------
  Q('bda-rdd', 'bda.u5.rdd', 'What is an RDD? Explain its properties, significance and advantages, and how to create RDDs from different sources.', ['bda-may26:5', 'bda-nov25:5', 'bda-dec24:5', 'bda-dec22it:5', 'bda-jun23:5']),
  Q('bda-trans-actions', 'bda.u5.ops', 'Differentiate transformations and actions on RDDs with examples.', ['bda-nov25:5', 'bda-may26:5', 'bda-dec23cse:5', 'bda-dec23aids:4', 'bda-jun23:5']),
  Q('bda-spark-arch', 'bda.u5.spark-arch', 'Explain the Spark architecture and its components (driver, cluster manager, executors).', ['bda-may26:5', 'bda-jun24:9', 'bda-dec23aids:5', 'bda-dec22it:5']),
  Q('bda-spark-vs-mr', 'bda.u5.spark-pros-cons', 'What are the benefits and challenges of Spark? Compare Spark with MapReduce.', ['bda-nov25:5', 'bda-jun24:3', 'bda-dec23cse:3']),
  Q('bda-spark-what', 'bda.u5.spark-intro', 'What is Apache Spark? Explain its present and future.', ['bda-dec23aids:3', 'bda-jun23:3']),
  Q('bda-pyspark-program', 'bda.u5.ops', 'Write a Python (PySpark) program that uses RDD transformations and actions.', ['bda-dec23cse:5'], { numerical: true }),
  Predict('bda-pred-dag', 'bda.u5.dag', 'Explain the DAG in Apache Spark: jobs, stages and tasks, and lazy evaluation.'),
  Predict('bda-pred-case', 'bda.u5.case-study', 'Using Spark, analyse student academic data to find subject difficulty, trends and top performers.'),
]
