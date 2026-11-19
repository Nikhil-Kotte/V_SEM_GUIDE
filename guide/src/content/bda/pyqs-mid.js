import { Q } from '../pyq-helpers.js'

// Questions from the two BDA class tests (mid-terms) of this semester, PYQs/BDA MIDS.pdf:
// Class Test I (5 Sep 2026) and Class Test II (7 Nov 2026), in their original wording.
// Class-test questions that were near-identical to an older paper's question are not repeated here:
// the class test is added to that question's papers instead (see pyqs-u12.js: bda-types, bda-stack-arch,
// bda-hdfs-commands, bda-mr-working, bda-joins).
export default [
  // ---- Class Test I ----
  Q('bda-mid-integration', 'bda.u1.integration', 'Define the big data integration process.', ['bda-ct1:2']),
  Q('bda-mid-ingestion-tools', 'bda.u2.ingestion-tools', 'Identify the data ingestion tools used in the Hadoop ecosystem.', ['bda-ct1:2']),
  Q('bda-mid-analytic-arch', 'bda.u1.architecture', 'Illustrate and explain a typical analytical architecture for Big Data.', ['bda-ct1:4']),
  Q('bda-mid-chars-challenges', 'bda.u1.characteristics', 'Explain the characteristics of Big Data and discuss the challenges associated with managing it.', ['bda-ct1:4']),
  Q('bda-mid-bi', 'bda.u1.bi-ds', 'Discuss the importance and applications of Business Intelligence in Big Data Analytics.', ['bda-ct1:3']),
  Q('bda-mid-etl-elt', 'bda.u2.etl-elt', 'Discuss the ETL and ELT approaches and explain their working processes in detail.', ['bda-ct1:4']),
  // ---- Class Test II ----
  Q('bda-mid-yarn-resp', 'bda.u3.yarn-intro', 'List the major responsibilities of YARN in Hadoop.', ['bda-ct2:2']),
  Q('bda-mid-hive-udf', 'bda.u4.hive-udf', 'Define User Defined Function (UDF) in Hive.', ['bda-ct2:2']),
  Q('bda-mid-dag', 'bda.u5.dag', 'What is the role of the DAG Scheduler in Apache Spark?', ['bda-ct2:2']),
  Q('bda-mid-secondary-sort', 'bda.u3.secondary-sort', 'Explain the concept of secondary sorting in Hadoop MapReduce with a suitable example.', ['bda-ct2:3']),
  Q('bda-mid-hive-table', 'bda.u4.hive-types', 'Apply Hive data types to design a table containing employee ID, name, salary, joining date and department.', ['bda-ct2:4']),
  Q('bda-mid-yarn-arch', 'bda.u3.yarn-arch', 'Demonstrate the architecture of Hadoop YARN with a neat diagram.', ['bda-ct2:3']),
  Q('bda-mid-pig-avg', 'bda.u4.pig-operators', 'Develop a Pig script to calculate the average marks of students in each department.', ['bda-ct2:4']),
  Q('bda-mid-spark-layers', 'bda.u5.spark-arch', 'Explain the layered architecture of Apache Spark with a neat diagram.', ['bda-ct2:3']),
  Q('bda-mid-rdd-failed', 'bda.u5.ops', 'Write an RDD program using map() and filter() to identify students who failed in a particular subject.', ['bda-ct2:4']),
  Q('bda-mid-spark-avg', 'bda.u5.ops', 'Write a Spark program to calculate the average marks obtained in each subject.', ['bda-ct2:3']),
  Q('bda-mid-spark-trends', 'bda.u5.case-study', 'Explain how Spark can be used to identify trends in student academic performance.', ['bda-ct2:4']),
]
