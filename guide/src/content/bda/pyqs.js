import { Q, Predict } from '../pyq-helpers.js'

// Every in-scope question from the BDA unit-wise bank (22ADE12 / 22ADC12 / 20ADC14 / 18ITC27 / 18CSE17).
// MapReduce questions in Unit III are Mid-1 material and are left out; only YARN is in this portion.
export default [
  // ---------------- Unit III: YARN ----------------
  Q('bda-yarn-resources', 'bda.u3.yarn-manage', 'Extend your understanding on resource management by YARN: how does YARN manage resources and applications?', ['bda-dec23cse:4']),
  Predict('bda-pred-yarn-arch', 'bda.u3.yarn-arch', 'Explain the YARN architecture (ResourceManager, NodeManager, ApplicationMaster, Container) with a diagram.'),
  Predict('bda-pred-yarn-why', 'bda.u3.yarn-intro', 'Why was YARN introduced? Compare Hadoop 1 (MapReduce v1) and YARN.'),

  // ---------------- Unit IV: Hive ----------------
  Q('bda-hive-query', 'bda.u4.hive-intro', 'Define querying data in Hive.', ['bda-dec24:2']),
  Q('bda-hive-shell', 'bda.u4.hive-arch', 'Explain the purpose of the Hive shell.', ['bda-dec22it:2']),
  Q('bda-hive-arch', 'bda.u4.hive-arch', 'Describe the architecture of Hive with a neat diagram, and explain how HiveQL queries are executed in Hadoop.', ['bda-dec23aids:5', 'bda-nov25:5', 'bda-may26:5']),
  Q('bda-hive-features', 'bda.u4.hive-intro', 'Explain the features and benefits of Hive in Hadoop.', ['bda-jun23:4']),
  Q('bda-hive-types', 'bda.u4.hive-types', 'Explain the various data types supported by HiveQL with examples.', ['bda-dec22it:5']),
  Q('bda-hiveql-agg', 'bda.u4.hiveql', 'Explain HiveQL, user-defined functions and aggregate functions.', ['bda-dec24:5']),
  Q('bda-hiveql-script', 'bda.u4.hiveql', 'Design a sample HiveQL script for querying student marks data.', ['bda-nov25:7'], { numerical: true }),
  Q('bda-hive-commands', 'bda.u4.hiveql', 'What are Hive commands? Explain.', ['bda-dec23aids:5']),
  Q('bda-hive-ddl', 'bda.u4.hiveql', 'How can you create and manage databases in Hive? Explain creating, dropping and altering databases.', ['bda-dec22it:5', 'bda-jun23:5']),
  Q('bda-hive-udf', 'bda.u4.hive-udf', 'Explain how user-defined functions enhance Hive query capabilities, with examples.', ['bda-nov25:3']),
  Q('bda-hive-vs-rdbms', 'bda.u4.hive-intro', 'Compare and contrast Hive and traditional relational database systems in handling large datasets.', ['bda-dec24:5', 'bda-jun24:3', 'bda-may26:5']),
  Predict('bda-pred-rcfile', 'bda.u4.hive-formats', 'Explain Hive file formats (TextFile, SequenceFile, RCFile, ORC). How is RCFile laid out?'),

  // ---------------- Unit IV: Pig ----------------
  Q('bda-pig-what', 'bda.u4.pig-intro', 'What is Apache Pig?', ['bda-may26:2']),
  Q('bda-pig-need', 'bda.u4.pig-intro', 'Demonstrate the necessity of Pig Latin.', ['bda-dec23aids:4']),
  Q('bda-pig-practice', 'bda.u4.pig-intro', 'Explain how Pig can be used in practice for data processing.', ['bda-nov25:5']),
  Q('bda-pig-vs-db', 'bda.u4.pig-vs-hive', 'Explain Pig, generating examples, and compare Pig with (other) databases.', ['bda-dec24:5', 'bda-jun23:3']),
  Q('bda-pig-install', 'bda.u4.pig-run', 'Illustrate the steps of installing and running Pig.', ['bda-dec23aids:4']),
  Q('bda-pig-modes', 'bda.u4.pig-run', 'Describe the two modes for running scripts in Pig.', ['bda-jun23:5']),
  Q('bda-pig-model', 'bda.u4.pig-types', 'Explain the Pig data model including relations, tuples and bags, with examples.', ['bda-may26:5']),
  Q('bda-pig-types', 'bda.u4.pig-types', 'Describe the various data types supported by Pig in its data model, with an example.', ['bda-dec22it:5']),
  Q('bda-pig-syntax', 'bda.u4.pig-operators', 'Write the basic syntax of a Pig Latin script. Explain the Pig Latin structure.', ['bda-dec22it:2', 'bda-jun23:4']),
  Q('bda-pig-latin', 'bda.u4.pig-operators', 'Explain Pig Latin, user-defined functions and data processing operators.', ['bda-dec24:5']),
  Q('bda-pig-operators', 'bda.u4.pig-operators', 'Summarise the data processing operators of Pig.', ['bda-dec23aids:3']),
  Q('bda-pig-udf', 'bda.u4.pig-udf', 'What are user-defined functions in Pig?', ['bda-nov25:2']),
  Q('bda-pig-scripting', 'bda.u4.pig-run', 'Discuss in brief scripting in Pig with a suitable example.', ['bda-dec22it:5']),
  Q('bda-pig-script', 'bda.u4.pig-operators', 'Write a Pig Latin script to load a dataset and perform filtering and grouping operations.', ['bda-may26:5'], { numerical: true }),
  Q('bda-pig-ncdc', 'bda.u4.pig-operators', 'Write the Pig Latin script to find the maximum temperature from the NCDC dataset.', ['bda-jun24:9'], { numerical: true }),
  Q('bda-pig-vs-hive', 'bda.u4.pig-vs-hive', 'Compare Pig and Hive in detail.', ['bda-jun24:9']),
  Predict('bda-pred-piggybank', 'bda.u4.pig-udf', 'What is Piggy Bank? How do you register and use a UDF from it?'),

  // ---------------- Unit V: Spark ----------------
  Q('bda-spark-what', 'bda.u5.spark-intro', 'What is Apache Spark?', ['bda-dec23aids:3']),
  Q('bda-spark-vs-mr', 'bda.u5.spark-pros-cons', 'What is Apache Spark and how is it different from MapReduce? Discover three key performance aspects when comparing Spark to MapReduce.', ['bda-jun24:3', 'bda-dec23cse:3']),
  Q('bda-spark-future', 'bda.u5.spark-intro', 'Describe the present and the future of Spark.', ['bda-jun23:3']),
  Q('bda-spark-benefits', 'bda.u5.spark-pros-cons', 'State the benefits and challenges of using Spark for big data processing.', ['bda-nov25:5']),
  Q('bda-spark-components', 'bda.u5.spark-arch', 'What are the components of Spark? Illustrate and explain the components of the Spark framework.', ['bda-dec22it:5']),
  Q('bda-spark-arch', 'bda.u5.spark-arch', 'Explain the components of the Spark architecture in detail. Show the basic architecture of Spark.', ['bda-jun24:9', 'bda-dec23aids:5']),
  Q('bda-spark-scala', 'bda.u5.spark-arch', 'Explain the architecture of Apache Spark, and explain the fundamentals of Scala and functional programming.', ['bda-may26:5']),
  Q('bda-driver', 'bda.u5.spark-arch', 'Identify the role of the driver program in Spark.', ['bda-dec23aids:5']),
  Q('bda-rdd', 'bda.u5.rdd', 'Explain the Resilient Distributed Dataset (RDD) with examples. Define Spark concepts, RDDs and creating RDDs.', ['bda-may26:2', 'bda-dec24:5', 'bda-dec22it:5']),
  Q('bda-rdd-significance', 'bda.u5.rdd', 'What is the significance of RDDs in Spark? What are their advantages, and how do they contribute to improving big data processing?', ['bda-jun23:4']),
  Q('bda-rdd-props', 'bda.u5.rdd', 'Identify the properties and operations of RDDs in Spark and explain.', ['bda-may26:5']),
  Q('bda-rdd-create', 'bda.u5.rdd', 'How do you create an RDD in Apache Spark? Explain in detail how RDDs are created from different data sources, with examples.', ['bda-jun23:5', 'bda-nov25:5']),
  Q('bda-trans-actions', 'bda.u5.ops', 'What is the difference between transformations and actions in Spark? Explain them in the context of RDDs, with examples.', ['bda-nov25:5', 'bda-jun23:5']),
  Q('bda-transformation', 'bda.u5.ops', 'What is a Spark transformation? Explain.', ['bda-dec23aids:4']),
  Q('bda-trans-demo', 'bda.u5.ops', 'Demonstrate how RDD transformations and actions are used to process data in Spark, with an example.', ['bda-may26:5']),
  Q('bda-pyspark-program', 'bda.u5.ops', 'What is an RDD in Spark? Write a Python program to implement various RDD transformations and actions.', ['bda-dec23cse:5'], { numerical: true }),
  Predict('bda-pred-dag', 'bda.u5.dag', 'Explain the DAG in Apache Spark: jobs, stages and tasks, and lazy evaluation.'),
  Predict('bda-pred-case', 'bda.u5.case-study', 'Using Spark, analyse student academic data to find subject difficulty, trends and top performers.'),
]
