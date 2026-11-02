// The Mid-2 syllabus exactly as given — this is the allowlist.
// Every topic card, PYQ, diagram and simulator must point at one of these ids.
// Anything not listed here is out of scope, even if an old paper asked it.

const T = (id, title, covers) => ({ id, title, covers })

export const syllabus = {
  se: [
    {
      unit: 'III', title: 'Planning & Estimation (rest of Unit III)', topics: [
        T('se.u3.schedule-staffing', 'Project Schedule and Staffing'),
        T('se.u3.quality-planning', 'Quality Planning'),
        T('se.u3.risk', 'Risk Management'),
        T('se.u3.decomposition', 'Estimation: Decomposition Techniques'),
        T('se.u3.sizing', 'Software Sizing'),
        T('se.u3.problem-based', 'Problem-Based Estimation'),
        T('se.u3.loc', 'LOC-Based Estimation (with example)'),
        T('se.u3.fp', 'FP-Based Estimation (with example)'),
        T('se.u3.cocomo', 'COCOMO Model'),
      ],
    },
    {
      unit: 'IV', title: 'Design & Coding', topics: [
        T('se.u4.function-oriented', 'Function-Oriented Modelling'),
        T('se.u4.coupling-cohesion', 'Design Concepts: Coupling & Cohesion'),
        T('se.u4.dfd', 'Flow-Oriented Modelling with DFDs'),
        T('se.u4.architecture', 'Software Architecture'),
        T('se.u4.arch-styles', 'A Brief Taxonomy of Architectural Styles'),
        T('se.u4.component-design', 'Component-Level Design', 'definition, basic design principles, design guidelines, designing traditional components'),
        T('se.u4.coding', 'Coding Principles and Guidelines'),
        T('se.u4.incremental-code', 'Incremental Development of Code'),
        T('se.u4.code-inspection', 'Code Inspection and Planning'),
      ],
    },
    {
      unit: 'V', title: 'Testing, Quality & Deployment', topics: [
        T('se.u5.testing-concepts', 'Testing Concepts'),
        T('se.u5.testing-process', 'Testing Process'),
        T('se.u5.strategies', 'Testing Strategies', 'strategic approach, strategic issues, test strategies for conventional software'),
        T('se.u5.validation', 'Validation Testing'),
        T('se.u5.system', 'System Testing'),
        T('se.u5.whitebox', 'White Box Testing'),
        T('se.u5.blackbox', 'Black Box Testing'),
        T('se.u5.auto-manual', 'Automatic vs Manual Testing'),
        T('se.u5.reviews', 'Software Review Techniques', 'informal reviews, formal technical reviews'),
        T('se.u5.quality-concepts', 'Quality Concepts', 'what is quality, software quality, objectives'),
        T('se.u5.quality-models', "Software Quality Attributes (McCall's, HP)"),
        T('se.u5.deployment', 'Deployment', 'overview, deployment planning, deployment rollback'),
      ],
    },
  ],

  os: [
    {
      unit: 'III', title: 'Memory & Disks (rest of Unit III)', topics: [
        T('os.u3.address-translation', 'Address Translation & Static Mapping'),
        T('os.u3.segmentation', 'Segmentation'),
        T('os.u3.paging', 'Paging'),
        T('os.u3.page-faults', 'Page Faults'),
        T('os.u3.page-replacement', 'Page Replacement Algorithms'),
        T('os.u3.sharing-permissions', 'Page Sharing & Read/Write Permissions'),
        T('os.u3.swapping', 'Swapping'),
        T('os.u3.linux-mm', 'Memory Management in Linux/Unix'),
        T('os.u3.disk-structure', 'Disk Structure'),
        T('os.u3.disk-scheduling', 'Disk Scheduling'),
        T('os.u3.disk-management', 'Disk Management'),
        T('os.u3.buffering', 'Buffering'),
        T('os.u3.swap-space', 'Swap Space Management'),
      ],
    },
    {
      unit: 'IV', title: 'Concurrency, Synchronization & Deadlocks', topics: [
        T('os.u4.threads', 'Threads: Introduction, Benefits, Types'),
        T('os.u4.thread-apis', 'Thread APIs'),
        T('os.u4.sync-issues', 'Synchronization Issues'),
        T('os.u4.sync-solutions', 'Hardware & Software Solutions'),
        T('os.u4.classical', 'Classical Problems of Synchronization'),
        T('os.u4.deadlock-intro', 'Deadlocks: Introduction & Necessary Conditions'),
        T('os.u4.rag', 'Resource Allocation Graph (RAG)'),
        T('os.u4.deadlock-prevention', 'Deadlock Prevention'),
        T('os.u4.deadlock-avoidance', "Deadlock Avoidance (Banker's Algorithm)"),
        T('os.u4.deadlock-recovery', 'Deadlock Recovery'),
      ],
    },
    {
      unit: 'V', title: 'File Systems & Security', topics: [
        T('os.u5.file-concepts', 'File Concepts & File Types'),
        T('os.u5.allocation', 'Allocation & Organization Methods'),
        T('os.u5.syscalls', 'File Handling System Calls'),
        T('os.u5.metadata', 'File System Metadata'),
        T('os.u5.directory', 'Directory Structure'),
        T('os.u5.caching', 'Caching Optimizations'),
        T('os.u5.case-study', 'File Systems Case Study'),
        T('os.u5.threats', 'Types of Threats'),
        T('os.u5.mechanisms', 'Basic Security Mechanisms'),
        T('os.u5.malware', 'Malware: Taxonomy, Viruses, Worms, Rootkits'),
        T('os.u5.logging', 'Logging, Auditing & Recovery'),
      ],
    },
  ],

  cn: [
    {
      unit: 'III', title: 'Routing & the Internet Layer (rest of Unit III)', topics: [
        T('cn.u3.link-state', 'Link State Routing'),
        T('cn.u3.ospf', 'OSPF'),
        T('cn.u3.bgp', 'BGP'),
        T('cn.u3.qos', 'Quality of Service'),
        T('cn.u3.ipv4', 'The IPv4 Protocol'),
        T('cn.u3.ip-addresses', 'IP Addresses'),
        T('cn.u3.ipv6', 'IPv6'),
      ],
    },
    {
      unit: 'IV', title: 'Transport Layer', topics: [
        T('cn.u4.transport-service', 'Transport Service'),
        T('cn.u4.sockets', 'Berkeley Sockets'),
        T('cn.u4.elements', 'Elements of Transport Protocols'),
        T('cn.u4.udp', 'UDP'),
        T('cn.u4.tcp-intro', 'The TCP Protocol'),
        T('cn.u4.tcp-header', 'TCP Segment Header'),
        T('cn.u4.tcp-connect', 'TCP Connection Establishment'),
        T('cn.u4.tcp-release', 'TCP Connection Release'),
        T('cn.u4.tcp-window', 'TCP Sliding Window'),
        T('cn.u4.tcp-timers', 'TCP Timer Management'),
        T('cn.u4.flow-control', 'TCP Flow Control'),
        T('cn.u4.congestion', 'Congestion Control'),
      ],
    },
    {
      unit: 'V', title: 'Application Layer', topics: [
        T('cn.u5.dns', 'DNS — The Domain Name System'),
        T('cn.u5.dns-namespace', 'The DNS Name Space'),
        T('cn.u5.dns-rr', 'Domain Resource Records'),
        T('cn.u5.name-servers', 'Name Servers'),
        T('cn.u5.email-arch', 'Email: Architecture and Services'),
        T('cn.u5.user-agent', 'The User Agent'),
        T('cn.u5.formats', 'Message Formats'),
        T('cn.u5.transfer', 'Message Transfer & SMTP'),
        T('cn.u5.delivery', 'Final Delivery'),
        T('cn.u5.ftp', 'FTP'),
        T('cn.u5.telnet', 'TELNET'),
        T('cn.u5.snmp', 'SNMP'),
      ],
    },
  ],

  fds: [
    {
      unit: 'III', title: 'pandas (rest of Unit III)', topics: [
        T('fds.u3.dataframes', 'Creating pandas DataFrames'),
        T('fds.u3.series', 'Understanding pandas Series'),
        T('fds.u3.quandl', 'Reading & Querying Quandl Data'),
        T('fds.u3.describe', 'Describing DataFrames'),
        T('fds.u3.group-join', 'Grouping & Joining DataFrames'),
        T('fds.u3.missing-pandas', 'Working with Missing Values'),
        T('fds.u3.pivot', 'Creating Pivot Tables'),
        T('fds.u3.dates', 'Dealing with Dates'),
      ],
    },
    {
      unit: 'IV', title: 'Data Cleaning, Correlation & Hypothesis Testing', topics: [
        T('fds.u4.cleaning', 'Data Cleaning & Filtering', 'exploring data, filtering to weed out noise, column-wise and row-wise filtration'),
        T('fds.u4.missing', 'Handling Missing Values: Dropping & Filling'),
        T('fds.u4.outliers', 'Handling Outliers'),
        T('fds.u4.encoding', 'Feature Encoding (One-hot, Label, Ordinal)'),
        T('fds.u4.correlation', 'Correlation & Types of Analysis', 'univariate, bivariate, multivariate'),
        T('fds.u4.titanic', 'Multivariate Analysis: Titanic Dataset'),
        T('fds.u4.hypothesis', 'Hypothesis Testing', 'principle, statsmodels library, average reading time, types of hypothesis testing'),
        T('fds.u4.ttest', 'T-test'),
      ],
    },
    {
      unit: 'V', title: 'Supervised & Unsupervised Learning', topics: [
        T('fds.u5.linear', 'Regression Analysis: Linear & Multiple Linear Regression'),
        T('fds.u5.multicollinearity', 'Multicollinearity & Removing It'),
        T('fds.u5.dummy', 'Dummy Variables'),
        T('fds.u5.model-dev', 'Developing a Regression Model'),
        T('fds.u5.metrics', 'Evaluating Performance: R², MSE, MAE, RMSE'),
        T('fds.u5.polynomial', 'Polynomial Regression'),
        T('fds.u5.logistic', 'Logistic Regression', 'regression models for classification, characteristics, types, advantages, disadvantages, scikit-learn'),
        T('fds.u5.pca', 'Dimensionality Reduction & PCA'),
        T('fds.u5.num-clusters', 'Finding the Number of Clusters (Elbow, Silhouette)'),
        T('fds.u5.kmeans', 'K-Means Clustering'),
        T('fds.u5.hierarchical', 'Hierarchical Clustering'),
        T('fds.u5.dbscan', 'DBSCAN'),
        T('fds.u5.spectral', 'Spectral Clustering'),
        T('fds.u5.cluster-metrics', 'Evaluating Clustering Performance', 'Davies-Bouldin, silhouette, Rand, Jaccard, F1, Fowlkes-Mallows'),
      ],
    },
  ],

  bda: [
    {
      unit: 'III', title: 'YARN (rest of Unit III)', topics: [
        T('bda.u3.yarn-intro', 'Introduction to YARN'),
        T('bda.u3.yarn-arch', 'YARN Architecture'),
        T('bda.u3.yarn-manage', 'Managing Resources & Applications with YARN'),
      ],
    },
    {
      unit: 'IV', title: 'Hive & Pig', topics: [
        T('bda.u4.hive-intro', 'What is Hive'),
        T('bda.u4.hive-arch', 'Hive Architecture'),
        T('bda.u4.hive-types', 'Hive Data Types'),
        T('bda.u4.hive-formats', 'Hive File Formats & RCFile'),
        T('bda.u4.hiveql', 'HiveQL'),
        T('bda.u4.hive-udf', 'Hive UDFs'),
        T('bda.u4.pig-intro', 'What is Pig, Anatomy & Pig on Hadoop'),
        T('bda.u4.pig-types', 'Pig Data Types & Complex Types'),
        T('bda.u4.pig-run', 'Running Pig, Execution Modes & HDFS Commands'),
        T('bda.u4.pig-operators', 'Relational Operators & Eval Functions'),
        T('bda.u4.pig-udf', 'Piggy Bank & Pig UDFs'),
        T('bda.u4.pig-vs-hive', 'Pig vs Hive'),
      ],
    },
    {
      unit: 'V', title: 'Apache Spark', topics: [
        T('bda.u5.spark-intro', 'Introduction & Design Principles'),
        T('bda.u5.spark-pros-cons', 'Advantages & Disadvantages'),
        T('bda.u5.spark-arch', 'Layered Architecture'),
        T('bda.u5.rdd', 'Programming with RDDs: Creating RDDs'),
        T('bda.u5.ops', 'Spark Operations: Transformations & Actions'),
        T('bda.u5.dag', 'DAG in Apache Spark'),
        T('bda.u5.case-study', 'Case Study: Student Academic Data'),
      ],
    },
  ],

  pdt: [
    {
      unit: 'III', title: 'Define Phase (rest of Unit III)', topics: [
        T('pdt.u3.persona-steps', 'Steps to Creating Personas'),
        T('pdt.u3.problem-statement', 'Problem Statement'),
        T('pdt.u3.affinity', 'Affinity Diagrams'),
        T('pdt.u3.empathy-map', 'Empathy Mapping'),
      ],
    },
    {
      unit: 'IV', title: 'Ideation Phase', topics: [
        T('pdt.u4.ideation', 'What is Ideation: Need & Uses'),
        T('pdt.u4.methods', 'Ideation Methods'),
        T('pdt.u4.brainstorming', 'Brainstorming & Its Rules'),
        T('pdt.u4.mind-maps', 'Mind Maps & Guidelines'),
        T('pdt.u4.games', 'Ideation Games'),
        T('pdt.u4.six-hats', 'Six Thinking Hats'),
        T('pdt.u4.doodling', 'Doodling for Creative Ideas'),
      ],
    },
    {
      unit: 'V', title: 'Prototyping & Testing', topics: [
        T('pdt.u5.prototype-types', 'Types of Prototyping'),
        T('pdt.u5.prototype-guidelines', 'Guidelines for Prototyping'),
        T('pdt.u5.storytelling', 'Storytelling', 'characteristics of good stories, reaching users through stories'),
        T('pdt.u5.prototype-importance', 'Importance of Prototyping'),
        T('pdt.u5.value-prop', 'Writing a Value Proposition'),
        T('pdt.u5.test-need', 'Why Test & User Feedback'),
        T('pdt.u5.user-test', 'Conducting a User Test'),
        T('pdt.u5.dfv', 'Desirable, Feasible & Viable'),
        T('pdt.u5.iterate', 'The Iterate Phase'),
      ],
    },
  ],
}

export const topicIndex = {}
for (const [subject, units] of Object.entries(syllabus)) {
  for (const u of units) for (const t of u.topics) topicIndex[t.id] = { ...t, subject, unit: u.unit }
}
