// BDA Unit III model answers (YARN only; MapReduce is Mid-1). Keyed by PYQ id.
const U3 = 'BDA Unit-3 slides (Unit-3.pptx)'
const W = 'Tom White, Hadoop: The Definitive Guide'

export default {
  'bda-yarn-resources': {
    blocks: [
      '**YARN (Yet Another Resource Negotiator)** is Hadoop 2\'s **cluster resource-management layer**. It separates the two jobs that the Hadoop 1 JobTracker did alone: **resource management** (global ResourceManager) and **job scheduling/monitoring** (one ApplicationMaster per application). This lets many kinds of applications (MapReduce, Spark, Tez, streaming) share one cluster.',
      { img: 'bda-yarn-arch' },
      { h: 'Components that manage resources' },
      { ul: [
        '**ResourceManager (RM)**, one per cluster (master): the ultimate authority that arbitrates resources among all applications. Two parts: the **Scheduler** (allocates containers to applications subject to capacities and queues; pure scheduler, it does not monitor or restart tasks) and the **ApplicationsManager** (accepts job submissions, negotiates the first container for each ApplicationMaster and restarts it on failure).',
        '**NodeManager (NM)**, one per machine: launches and manages **containers** on its node, monitors their resource usage (CPU, memory, disk, network), tracks the **health of the node**, and reports to the RM through heartbeats.',
        '**ApplicationMaster (AM)**, one per application: negotiates resources (containers) from the RM\'s scheduler, works with NMs to execute and monitor tasks, and handles task failures.',
        '**Container**: a bundle of resources (e.g. 2 GB RAM, 1 vCore) on one node, in which a task runs. It is described by a **Container Launch Context (CLC)**: environment variables, dependencies in remote storage, security tokens, payload for NM services and the command to start the process.',
      ] },
      { h: 'How an application is run (application workflow)' },
      { img: 'bda-yarn-flow' },
      { steps: [
        'The **client submits** the application to the ResourceManager.',
        'The RM **allocates a container** and asks a NodeManager to **launch the ApplicationMaster** in it.',
        'The AM **registers** with the RM (so the client can track progress through the RM).',
        'The AM **requests containers** from the RM\'s scheduler for its tasks (with locality preferences: data-local, rack-local, any).',
        'The AM tells the NodeManagers to **launch the containers** (with their CLCs).',
        'The **application code runs** in the containers and reports progress/status to the AM.',
        'The client gets status from the RM/AM.',
        'When finished, the AM **unregisters** from the RM and its containers are released.',
      ] },
      { h: 'Scheduling policies' },
      { ul: ['**FIFO scheduler**: jobs run in order of submission (simple, but a large job blocks small ones).', '**Capacity scheduler**: the cluster is divided into queues (e.g. per department) with guaranteed capacities; unused capacity can be borrowed.', '**Fair scheduler**: resources are shared dynamically so that all running applications get, on average, an equal share over time.'] },
      { h: 'Why this design manages resources well' },
      { ul: ['**Scalability**: the RM only allocates resources; per-application work is pushed to AMs (Hadoop 1 was limited to ~4,000 nodes).', '**Utilisation**: generic containers instead of fixed map/reduce slots.', '**Multi-tenancy**: many frameworks and users share the cluster with queues and fair/capacity policies.', '**Availability**: RM high availability (active/standby) and AM restart on failure.'] },
    ],
    sources: [`${U3} slides 38–46`, `${W} ch. 4 (YARN)`],
  },

  'bda-pred-yarn-arch': {
    blocks: [
      'YARN has a **master–slave architecture** with four main components:',
      { img: 'bda-yarn-arch' },
      { table: { head: ['Component', 'Runs', 'Role'], rows: [
        ['**ResourceManager**', 'One per cluster (master)', 'Allocates cluster resources; contains the **Scheduler** (decides who gets containers, by FIFO/capacity/fair policy) and the **ApplicationsManager** (accepts applications, launches and restarts their ApplicationMasters)'],
        ['**NodeManager**', 'Every worker node', 'Launches containers, monitors their resource use and node health, sends heartbeats to the RM'],
        ['**ApplicationMaster**', 'One per application, in a container', 'Negotiates containers from the RM, asks NMs to start tasks, monitors tasks and handles failures'],
        ['**Container**', 'On worker nodes', 'A slice of resources (memory, CPU) where a task runs; described by a Container Launch Context'],
      ] } },
      { h: 'Flow' },
      { img: 'bda-yarn-flow' },
      'Client → RM (submit) → RM launches the AM in a container → AM registers and requests containers → NMs launch task containers → tasks report to the AM → AM unregisters when done.',
      { h: 'Key idea' },
      'Hadoop 1\'s JobTracker did both resource management and job tracking; YARN splits them, making Hadoop a general-purpose "data operating system" on which MapReduce is just one application.',
    ],
    sources: [`${U3} slides 39–46`, `${W} ch. 4`],
  },

  'bda-pred-yarn-why': {
    blocks: [
      { h: 'Problems with Hadoop 1 (MapReduce v1)' },
      { ul: ['The single **JobTracker** handled both resource management and the scheduling/monitoring of every task: a **bottleneck** that limited clusters to about 4,000 nodes and 40,000 concurrent tasks.', 'A **single point of failure**: if the JobTracker failed, all running jobs were lost.', '**Fixed map and reduce slots** on each TaskTracker: slots of one kind sat idle while jobs waited for the other → poor utilisation.', '**Only MapReduce** could run: interactive queries, graph processing, streaming and iterative (in-memory) jobs had to use separate clusters.'] },
      { h: 'How YARN solves them' },
      { table: { head: ['Aspect', 'Hadoop 1 (MRv1)', 'Hadoop 2 (YARN)'], rows: [
        ['Resource management + job tracking', 'JobTracker does both', 'ResourceManager (resources) + ApplicationMaster per application (job)'],
        ['Worker daemon', 'TaskTracker', 'NodeManager'],
        ['Resource unit', 'Fixed map/reduce slots', 'Flexible containers (memory, vCores)'],
        ['Scalability', '~4,000 nodes', '10,000+ nodes'],
        ['Frameworks', 'MapReduce only', 'MapReduce, Spark, Tez, Storm, streaming, interactive'],
        ['Availability', 'JobTracker is a single point of failure', 'RM high availability; AM restart'],
        ['Utilisation', 'Lower', 'Higher (no idle slot types)'],
      ] } },
      'YARN was described as a "redesigned resource manager": it lets stream processing, interactive querying and batch jobs run side by side on the same data in HDFS.',
    ],
    sources: [`${U3} slides 38–40`, `${W} ch. 4 (YARN compared to MapReduce 1)`],
  },
}
