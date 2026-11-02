// SE Unit V model answers (testing, reviews, quality, deployment). Keyed by PYQ id.
const P = 'Pressman, Software Engineering: A Practitioner\'s Approach'
const T = 'SE Unit-5 notes (Testing Unit V.docx, UNIT V.pdf)'
const Q5 = 'SE-unit5-part2-quality-roger pressman.pdf'
const QP = 'unit5-part2-quality.pptx'
const REV = 'unit 5-review techniques.pdf'

// A small program used for the basis-path examples.
const SUM_EVEN = '1: read n; sum = 0; i = 1\n2: while (i <= n)\n3:     if (i % 2 == 0)\n4:         sum = sum + i\n5:     i = i + 1\n6: print sum'

export default {
  // ---------------- Quality ----------------
  'se-mccall': {
    blocks: [
      'McCall, Richards and Walters (1977) proposed a quality model that groups **11 quality factors** under three aspects of a software product: how it **operates**, how easily it can be **revised**, and how easily it can be **transitioned** to new environments. It is drawn as the **McCall quality triangle**.',
      { img: 'se-mccall' },
      { h: '1. Product operation: using the software' },
      { ul: ['**Correctness**: extent to which a program satisfies its specification and fulfils the customer\'s mission objectives.', '**Reliability**: extent to which a program performs its intended function with the required precision.', '**Efficiency**: amount of computing resources and code required to perform its function.', '**Integrity**: extent to which access to software or data by unauthorised persons can be controlled.', '**Usability**: effort required to learn, operate, prepare input for, and interpret output of a program.'] },
      { h: '2. Product revision: changing the software' },
      { ul: ['**Maintainability**: effort required to locate and fix an error.', '**Flexibility**: effort required to modify an operational program.', '**Testability**: effort required to test a program to ensure it performs its intended function.'] },
      { h: '3. Product transition: moving the software' },
      { ul: ['**Portability**: effort required to transfer the program from one hardware/software environment to another.', '**Reusability**: extent to which a program (or parts) can be reused in other applications.', '**Interoperability**: effort required to couple one system to another.'] },
      { h: 'Measuring the factors' },
      'The factors are hard to measure directly, so each is assessed through **metrics** (graded 0 = low to 10 = high) such as auditability, accuracy, communication commonality, completeness, conciseness, consistency, data commonality, error tolerance, execution efficiency, expandability, generality, hardware independence, instrumentation, modularity, operability, security, self-documentation, simplicity, software-system independence, traceability and training.',
      { formula: 'Fq = c1·m1 + c2·m2 + … + cn·mn   (Fq = quality factor, mi = metrics, ci = regression weights)' },
      { exam: 'Draw the triangle with the three sides labelled and list all 11 factors with one-line definitions: this alone usually earns most of the marks.' },
    ],
    sources: [`${T} paras 482–600`, `${QP} slides 2–4`, `${P} §19.2.2`],
  },

  'se-quality-define': {
    blocks: [
      '**Software quality** (Pressman): "An effective software process applied in a manner that creates a **useful product** that provides **measurable value** for those who produce it and those who use it." An older definition: conformance to explicitly stated functional and performance requirements, explicitly documented development standards, and implicit characteristics expected of all professionally developed software.',
      { h: 'Core concepts' },
      { ul: ['**Quality of design**: the characteristics the designers specify (requirements, specifications, design) describe what users need.', '**Quality of conformance**: the degree to which the implementation follows the design and meets requirements and performance goals.', '**User satisfaction** = compliant product + good quality + delivery within budget and schedule.', '**Quality control (QC)**: inspections, reviews and tests used throughout the process to ensure each work product meets its requirements.', '**Quality assurance (QA)**: auditing and reporting functions that give management the data to judge whether quality goals are being met.', '**Cost of quality**: prevention + appraisal + failure (internal and external) costs.'] },
      { h: 'Significance in development' },
      { ul: ['Defects found late cost many times more than defects found in requirements or design.', 'Quality reduces rework, so projects finish closer to schedule and budget.', 'Lower maintenance cost over the product\'s lifetime.', 'Avoids risks: failures, security breaches, legal liability.'] },
      { h: 'Significance for user satisfaction' },
      { ul: ['Users trust and keep using reliable, usable software.', 'Good quality builds reputation and repeat business.', 'Poor quality loses customers and revenue.'] },
      { h: 'Quality dimensions (Garvin)' },
      'Performance, feature, reliability, conformance, durability, serviceability, aesthetic and perception quality.',
    ],
    sources: [`${Q5} p1–7`, `${P} §19.1–19.3`],
  },

  'se-quality-factors': {
    blocks: [
      { h: 'Factors that determine software quality' },
      { ul: ['**Product factors**: correctness, reliability, efficiency, integrity, usability (operation); maintainability, flexibility, testability (revision); portability, reusability, interoperability (transition): McCall.', '**Process factors**: a defined, mature development process; standards; reviews.', '**People factors**: skill and experience of the team, training.', '**Project factors**: realistic schedule and budget; stable requirements.', '**Tools and technology**: good tools, CI, static analysis.'] },
      { h: 'How quality is measured' },
      { table: { head: ['Factor', 'Example metric'], rows: [['Correctness', 'Defects per KLOC after release'], ['Reliability', 'MTBF, failure rate, availability %'], ['Efficiency', 'Response time, CPU/memory use'], ['Usability', 'Time to learn tasks, user error rate, satisfaction surveys'], ['Maintainability', 'Mean time to change (MTTC), cyclomatic complexity'], ['Integrity', 'Number of successful attacks, threat × security'], ['Process', 'Review effectiveness, defect removal efficiency DRE = E/(E + D)']] } },
      { h: 'How quality is achieved / improved' },
      { ol: ['**Software engineering methods**: understand the problem, create a sound design.', '**Project management techniques**: realistic estimates, schedule dependencies understood, risk planning.', '**Quality control**: inspections, reviews and testing at every step.', '**Quality assurance**: an SQA group audits processes and products against standards.', 'Measure, analyse defects (root-cause, Six Sigma), and **continuously improve** the process.'] },
    ],
    sources: [`${Q5} p8–14`, `${QP}`, `${P} §19.4`],
  },

  'se-garvin': {
    blocks: [
      'David Garvin suggests that quality should be considered by taking a **multidimensional viewpoint**, beginning with an assessment of conformance and ending with an aesthetic view. His **eight dimensions** applied to software:',
      { ol: [
        '**Performance quality**: does the software deliver all content, functions and features specified in the requirements, in a way that provides value to the end user?',
        '**Feature quality**: does it provide features that surprise and delight first-time users?',
        '**Reliability**: does it deliver all features and capability without failure? Is it available when needed? Is it error-free?',
        '**Conformance**: does it conform to local and external standards relevant to the application, and to de facto design and coding conventions (e.g. UI conventions)?',
        '**Durability**: can it be maintained (changed) or corrected (debugged) without inadvertent side effects? Will changes cause error rate or reliability to degrade over time?',
        '**Serviceability**: can it be maintained or corrected in an acceptably short time? Can support staff get the information they need to make changes or fix defects?',
        '**Aesthetics**: elegance, unique flow, and an obvious "presence" that are hard to quantify but evident.',
        '**Perception**: the user\'s prejudices; e.g. a product from a vendor with a reputation for poor quality is perceived as poor, while a strong reputation creates a favourable perception.',
      ] },
      'Many of these dimensions can only be considered **subjectively**, so we also need hard, measurable factors (McCall, ISO 9126/25010).',
    ],
    sources: [`${Q5} p4–5`, `${P} §19.2.1`],
  },

  'se-quality-attributes': {
    blocks: [
      { table: { head: ['Attribute', 'Meaning', 'How to assess', 'How to enhance'], rows: [
        ['**Reliability**', 'Probability of failure-free operation for a time in a given environment', 'MTBF = MTTF + MTTR; failure rate; availability = MTTF/(MTTF + MTTR) × 100%; defect density', 'Reviews and inspections; thorough testing; fault-tolerant design; error handling; reliability growth testing'],
        ['**Maintainability**', 'Ease of locating and fixing errors, adapting and enhancing', 'Mean time to change (MTTC); cyclomatic complexity; coupling/cohesion metrics; comment ratio', 'Modular design, high cohesion/low coupling, coding standards, documentation, refactoring, automated regression tests'],
        ['**Usability**', 'Effort to learn, operate, prepare input and interpret output', 'Usability tests: time to complete tasks, error rate, learnability, satisfaction questionnaires (SUS)', 'User-centred design, prototypes, consistent UI, help and feedback, accessibility guidelines'],
        ['**Efficiency**', 'Use of computing resources (time, memory, network) to perform functions', 'Response time, throughput, CPU/memory profiling, load and stress tests', 'Better algorithms and data structures, caching, profiling and optimisation, scalable architecture'],
        ['**Portability**', 'Effort to transfer to another hardware/software environment', 'Number of platform-specific modules; effort/time to port; tests on target platforms', 'Low coupling to the platform, abstraction layers, standard languages and APIs, containers/VMs'],
      ] } },
      'These attributes appear in McCall\'s model (operation, revision and transition), in HP\'s FURPS and in ISO 9126 / 25010 (functionality, reliability, usability, efficiency, maintainability, portability).',
    ],
    sources: [`${Q5}`, `${QP}`, `${P} §19.2`],
  },

  'se-pred-hp': {
    blocks: [
      'Hewlett-Packard defined the **FURPS** quality attributes, each with sub-attributes used as targets for design and as criteria for assessment:',
      { table: { head: ['Attribute', 'Assessed by'], rows: [
        ['**Functionality**', 'Feature set and capabilities of the program, generality of functions, security of the overall system'],
        ['**Usability**', 'Human factors, overall aesthetics, consistency, documentation'],
        ['**Reliability**', 'Frequency and severity of failure, accuracy of output, mean time to failure (MTTF), ability to recover from failure, predictability'],
        ['**Performance**', 'Processing speed, response time, resource consumption, throughput, efficiency'],
        ['**Supportability**', 'Maintainability (extensibility, adaptability, serviceability), testability, compatibility, configurability, ease of installation, ease of problem localisation'],
      ] } },
      'FURPS is often extended as **FURPS+** to include design constraints, implementation, interface and physical requirements. Compared with McCall\'s 11 factors, FURPS is shorter and more practical for specifying requirements and reviewing designs.',
    ],
    sources: [`${QP}`, `${P} §12.2.1`],
  },

  // ---------------- White box ----------------
  'se-whitebox': {
    blocks: [
      '**White-box testing** (glass-box or structural testing) derives test cases from the **internal control structure** of the program. Using white-box methods, test cases are designed that:',
      { ol: ['Guarantee that all **independent paths** within a module have been exercised at least once.', 'Exercise all **logical decisions** on their true and false sides.', 'Execute all **loops** at their boundaries and within their operational bounds.', 'Exercise **internal data structures** to ensure their validity.'] },
      { h: '1. Basis path testing' },
      { steps: ['Draw the **flow graph** from the code.', 'Compute **cyclomatic complexity** V(G) = E − N + 2 = P + 1 = number of regions.', 'Identify a **basis set** of V(G) independent paths.', 'Prepare a **test case** that forces each path.'] },
      { code: SUM_EVEN },
      'N = 6, E = 7 (1→2, 2→3, 2→6, 3→4, 3→5, 4→5, 5→2) → V(G) = 7 − 6 + 2 = **3**. Paths: 1-2-6 (n = 0), 1-2-3-5-2-6 (n = 1), 1-2-3-5-2-3-4-5-2-6 (n = 2).',
      { h: '2. Control structure testing' },
      { ul: ['**Condition testing**: exercise each simple condition in each decision as true and false (e.g. for (a > 0 && b < 5) test both parts).', '**Data-flow testing**: select paths by the locations of **definitions and uses** of variables: DEF(S), USE(S); cover every DU chain [X, S, S\'].', '**Loop testing**: simple, nested, concatenated and unstructured loops (see loop testing).'] },
      { h: 'Advantages and limits' },
      'Finds logic errors, unreachable code and wrong paths early; but it needs the code and cannot detect **missing** requirements.',
      { tip: 'Practise with the cyclomatic complexity tool on the Numericals tab.' },
    ],
    sources: [`${T} paras 167–240`, 'UNIT V.pdf', `${P} §23.3–23.5`],
  },

  'se-cyclomatic': {
    blocks: [
      '**Cyclomatic complexity** is a software metric that gives a quantitative measure of the **logical complexity** of a program. In basis path testing, its value is the number of **independent paths** in the basis set, an upper bound for the number of tests that ensures every statement and branch executes at least once. An **independent path** introduces at least one new set of statements or a new condition (at least one edge not traversed before).',
      { h: 'Flow-graph notation' },
      { ul: ['**Node** (circle): one or more procedural statements; a sequence of statements maps to one node.', '**Edge** (arrow): flow of control; must end in a node.', '**Predicate node**: a node containing a condition; two or more edges leave it. A compound condition (a AND b) is split into one predicate node per simple condition.', '**Region**: area bounded by edges and nodes; the area outside the graph counts as one region.', 'Constructs: sequence, if, while, until and case each have a standard flow-graph shape.'] },
      { h: 'Three ways to compute V(G)' },
      { formula: 'V(G) = E − N + 2     V(G) = P + 1     V(G) = number of regions' },
      { h: 'Example' },
      { code: SUM_EVEN },
      { ul: ['Nodes 1–6 → N = 6; edges 1→2, 2→3, 2→6, 3→4, 3→5, 4→5, 5→2 → E = 7 → V(G) = 7 − 6 + 2 = **3**.', 'Predicates: node 2 (while), node 3 (if) → P = 2 → V(G) = **3**.', 'Regions: two closed regions + the outer region = **3**.'] },
      { h: 'Independent paths → test cases' },
      { table: { head: ['Path', 'Input', 'Expected'], rows: [['1-2-6', 'n = 0', 'sum = 0'], ['1-2-3-5-2-6', 'n = 1', 'sum = 0'], ['1-2-3-5-2-3-4-5-2-6', 'n = 2', 'sum = 2']] } },
      { h: 'Steps to select paths in data-flow testing' },
      { steps: ['Number the statements; for each statement S find DEF(S) and USE(S).', 'A definition of X at S is **live** at S\' if there is a path from S to S\' with no other definition of X.', 'Form **DU chains** [X, S, S\'] where X ∈ DEF(S), X ∈ USE(S\') and the definition is live at S\'.', 'Choose test paths so every DU chain is covered at least once (DU testing strategy).', 'Find input data that forces each chosen path.'] },
      'In the example: DU chains for sum: [sum, 1, 4], [sum, 1, 6], [sum, 4, 4], [sum, 4, 6]. n = 0 covers [sum,1,6]; n = 2 covers [sum,1,4] and [sum,4,6]; add n = 4 (sum = 6) to cover [sum,4,4].',
    ],
    sources: [`${T}`, 'UNIT V.pdf', `${P} §23.4.1–23.5.2`],
  },

  'se-basis-path': {
    blocks: [
      '**Basis path testing**, proposed by Tom McCabe, is a white-box technique that derives a logical complexity measure of a procedural design and uses it to define a **basis set** of execution paths. Test cases that exercise the basis set execute **every statement at least once and every condition on both its true and false sides**.',
      { h: 'Steps to derive test cases' },
      { steps: ['Using the design or code as a foundation, draw the corresponding **flow graph**.', 'Determine the **cyclomatic complexity** V(G) of the flow graph.', 'Determine a **basis set** of linearly independent paths (V(G) of them).', 'Prepare **test cases** that force execution of each path in the basis set; run them and compare with expected results.'] },
      { h: 'Example' },
      { code: SUM_EVEN },
      'Flow graph: N = 6, E = 7 → V(G) = 3. Predicate nodes: 2 (while) and 3 (if) → 2 + 1 = 3.',
      { table: { head: ['Path', 'Test input', 'Expected output'], rows: [['1-2-6 (loop skipped)', 'n = 0', '0'], ['1-2-3-5-2-6 (odd i, if false)', 'n = 1', '0'], ['1-2-3-5-2-3-4-5-2-6 (even i, if true)', 'n = 2', '2']] } },
      { h: 'Graph matrices' },
      'For tool support, the flow graph can be represented as a **graph matrix** (square, rows/columns = nodes, entries = edges or link weights). Summing (connections − 1) for each row and adding 1 also gives V(G).',
      { h: 'Benefits' },
      'Guarantees statement and branch coverage with the minimum number of tests; the metric also flags overly complex modules (V(G) > 10 is often considered risky).',
    ],
    sources: [`${T}`, 'UNIT V.pdf', `${P} §23.4`],
  },

  'se-loop-testing': {
    blocks: [
      '**Loop testing** is a white-box technique that focuses exclusively on the validity of loop constructs. Four classes of loops are tested:',
      { h: '1. Simple loops (n = maximum number of allowable passes)' },
      { ol: ['Skip the loop entirely.', 'Only one pass through the loop.', 'Two passes.', 'm passes, where m < n.', 'n − 1, n, n + 1 passes.'] },
      'Example: a loop reading at most 10 marks → test with 0, 1, 2, 5, 9, 10 and 11 marks.',
      { h: '2. Nested loops' },
      { steps: ['Start at the **innermost** loop; set all other loops to minimum values.', 'Conduct simple-loop tests for the innermost loop while holding outer loops at their minimum iteration values; add tests for out-of-range or excluded values.', 'Work **outward**, testing the next loop while keeping outer loops at minimum and inner loops at "typical" values.', 'Continue until all loops have been tested.'] },
      'This avoids the geometric explosion of tests that testing every combination would cause.',
      { h: '3. Concatenated loops' },
      'If the loops are **independent** of each other, test each as a simple loop. If the loop counter of loop 1 is used as the initial value of loop 2, they are dependent: use the nested-loop approach.',
      { h: '4. Unstructured loops' },
      'Whenever possible, **redesign** them to reflect structured programming constructs, then test.',
    ],
    sources: [`${T}`, `${P} §23.5.3`],
  },

  'se-num-cc': {
    blocks: [
      'Nodes (N): a, bc, f, g, h, i, de, j, k → **N = 9**.',
      'Edges (E): a→bc, bc→f, bc→de, f→g, f→h, g→i, h→i, i→j, de→j, j→a, a→k → **E = 11**.',
      { formula: 'V(G) = E − N + 2 = 11 − 9 + 2 = 4' },
      'Check with predicate nodes: a (to bc or k), bc (to f or de), f (to g or h) → P = 3 → V(G) = 3 + 1 = **4**. Regions: 3 enclosed + 1 outer = 4.',
      { h: 'Independent paths (basis set)' },
      { ol: ['a → k', 'a → bc → de → j → a → k', 'a → bc → f → g → i → j → a → k', 'a → bc → f → h → i → j → a → k'] },
      '**Cyclomatic complexity = 4; number of independent paths = 4.** Four test cases, one forcing each path, give full statement and branch coverage.',
    ],
    sources: ["SE Jun '23 paper (compiled bank)", 'Verified with the cyclomatic complexity tool'],
  },

  // ---------------- Black box ----------------
  'se-wb-vs-bb': {
    blocks: [
      { table: { head: ['Basis', 'White-box testing', 'Black-box testing'], rows: [
        ['Also called', 'Glass-box, structural, clear-box', 'Behavioural, functional, closed-box'],
        ['Test basis', 'Internal code, logic and structure', 'Requirements and specifications'],
        ['Knowledge of code', 'Required', 'Not required'],
        ['Performed by', 'Developers', 'Independent testers, end users'],
        ['Techniques', 'Basis path, condition, data-flow, loop testing', 'Equivalence partitioning, BVA, graph-based, decision tables, orthogonal arrays'],
        ['Errors found', 'Logic errors, wrong paths, unreachable code, loop errors', 'Missing or incorrect functions, interface errors, data-structure/DB access errors, behaviour/performance errors, initialisation/termination errors'],
        ['Coverage measured as', 'Statement, branch, path coverage', 'Requirement / input-domain coverage'],
        ['Level', 'Mainly unit (and integration)', 'Integration, system, acceptance'],
        ['When', 'Early, once code exists', 'Later stages; tests can be designed from requirements before code'],
        ['Limitation', 'Cannot detect missing features', 'Cannot test all paths; some code may never run'],
      ] } },
      { h: 'Example' },
      'For a function that grades marks: white-box tests make sure each if-branch and loop runs; black-box tests check that marks 39, 40, 100 and −1 give FAIL, PASS, PASS and an error as the specification says.',
      'The two are **complementary**: white-box checks the code is built right, black-box checks the right function is built.',
    ],
    sources: [`${T}`, `${P} §23.3–23.6`],
  },

  'se-blackbox': {
    blocks: [
      '**Black-box testing** (behavioural testing) focuses on the **functional requirements**: the tester derives sets of input conditions that fully exercise all functional requirements, **without looking at the internal code**. Only inputs and expected outputs are used.',
      { h: 'Errors it finds' },
      { ol: ['Incorrect or missing functions.', 'Interface errors.', 'Errors in data structures or external database access.', 'Behaviour or performance errors.', 'Initialisation and termination errors.'] },
      { h: 'How it is conducted without the code' },
      { steps: ['Study the requirements/specification.', 'Identify input domains and output conditions.', 'Partition the inputs and choose boundary values.', 'Write test cases: input, expected output.', 'Execute, compare actual vs expected, log failures.'] },
      { h: 'Equivalence partitioning' },
      'Divide the input domain into **classes of data** where every member is expected to behave the same; one test per class. Guidelines:',
      { ul: ['A **range** → one valid and two invalid classes.', 'A **specific value** → one valid and two invalid classes.', 'A **member of a set** → one valid and one invalid class.', 'A **Boolean** → one valid and one invalid class.'] },
      'Example: age must be 18–60 → classes < 18 (invalid), 18–60 (valid), > 60 (invalid) → tests 10, 35, 70.',
      { h: 'Boundary value analysis' },
      'Errors cluster at the **edges** of input classes, so test at and around the boundaries: for 18–60 → 17, 18, 19, 59, 60, 61. Also apply to outputs and internal data-structure limits.',
      { h: 'Other techniques' },
      { ul: ['**Graph-based testing**: model objects and relationships as a graph; test each relationship.', '**Orthogonal array testing**: for many input combinations, pick a balanced subset.', '**Decision-table / cause–effect testing**: combinations of conditions and actions.'] },
    ],
    sources: [`${T} paras 240–304`, `${P} §23.6`],
  },

  'se-bva': {
    blocks: [
      '**Boundary value analysis (BVA)** is a black-box technique that selects test cases at the **edges** of input (and output) classes, because a greater number of errors occurs at the boundaries of the input domain than in the "centre" (e.g. using < instead of <=). It complements equivalence partitioning.',
      { h: 'Guidelines / boundary criteria' },
      { ol: ['If an input condition is a **range** bounded by a and b, design tests with values a and b and just above and just below a and b.', 'If an input condition specifies a **number of values**, test the minimum and maximum numbers, and values just above and below them.', 'Apply guidelines 1 and 2 to **output** conditions (e.g. a report with at most 100 rows: produce 0, 1, 100 and try 101).', 'If internal program **data structures** have prescribed boundaries (an array of 100 entries), design a test case to exercise the structure at its boundary.'] },
      { h: 'Example: exam result (marks 0–100, pass if marks ≥ 40)' },
      { table: { head: ['Test', 'Input', 'Expected'], rows: [['Below range', '−1', 'Invalid input'], ['Lower bound', '0', 'Fail'], ['Just above lower', '1', 'Fail'], ['Just below pass mark', '39', 'Fail'], ['Pass mark', '40', 'Pass'], ['Just above pass mark', '41', 'Pass'], ['Just below upper', '99', 'Pass'], ['Upper bound', '100', 'Pass'], ['Above range', '101', 'Invalid input']] } },
      { h: 'Use in good test-case design' },
      'BVA gives a **small set of high-yield tests**: a handful of values per input find most off-by-one and comparison errors, which random values in the middle of a range would miss.',
    ],
    sources: [`${T}`, `${P} §23.6.3`],
  },

  // ---------------- Strategies and levels ----------------
  'se-unit-testing': {
    blocks: [
      '**Unit testing** verifies the **smallest unit** of software design: a component, module, function or class, in isolation. It is usually white-box oriented and done by the developer.',
      { h: 'What is tested' },
      { ul: ['**Module interface**: information flows in and out correctly.', '**Local data structures**: data keeps its integrity during execution.', '**Boundary conditions**: the module works at limits.', '**Independent paths**: all statements executed at least once.', '**Error-handling paths**: errors are caught and reported correctly.'] },
      { h: 'Unit-test environment' },
      'Because a unit is not a standalone program, **drivers** (a "main" that feeds test data and prints results) and **stubs** (dummy subprograms that replace modules the unit calls) are written.',
      { h: 'Why it is important / how it improves quality' },
      { ul: ['Finds errors early and cheaply, at the source.', 'Makes debugging easy: the failure is localised.', 'Gives confidence to refactor; tests act as living documentation.', 'High cohesion simplifies unit testing.'] },
      { h: 'Tools' },
      'JUnit/TestNG (Java), pytest/unittest (Python), NUnit (C#), Jest/Mocha (JavaScript), Google Test (C++); mocking with Mockito; coverage with JaCoCo/coverage.py.',
      { h: 'Is unit testing always possible or desirable?' },
      '**Not always.** It may be impractical when: units are tightly coupled to hardware, the OS or external services (stubbing is too costly); in GUI-heavy or real-time code whose behaviour emerges only when integrated; for trivial getters/setters; for throw-away prototypes or very short deadlines; or for third-party components without source. In such cases integration/system tests, inspections or contract tests are preferred. But for business logic, unit testing is almost always worth it.',
    ],
    sources: [`${T}`, 'UNIT V.pdf', `${P} §22.3.1`],
  },

  'se-levels': {
    blocks: [
      'Testing proceeds in a **spiral** from the small to the large: test the units, then integrate, then validate against requirements, then test the whole system in its environment.',
      { img: 'se-t-img19' },
      { table: { head: ['Level', 'Scope', 'Objective', 'Techniques', 'By'], rows: [
        ['**Unit**', 'Single module/class', 'Each unit works correctly in isolation', 'White-box (basis path, loop), drivers and stubs', 'Developers'],
        ['**Integration**', 'Groups of modules and their interfaces', 'Find interface errors as modules are combined', 'Top-down, bottom-up, sandwich, regression, smoke testing', 'Developers / test team'],
        ['**Validation**', 'Whole software vs the SRS', 'Software does what the customer reasonably expects', 'Black-box, acceptance, alpha, beta', 'Independent testers, users'],
        ['**System**', 'Software + hardware, people, databases', 'Whole system works in its real environment', 'Recovery, security, stress, performance, deployment testing', 'Independent test group'],
      ] } },
      { img: 'se-t-img9' },
      { h: 'Integration approaches' },
      { ul: ['**Top-down**: from the main module down, using stubs; depth-first or breadth-first.', '**Bottom-up**: from atomic modules up, using drivers; clusters (builds).', '**Sandwich**: both at once, meeting in the middle.', '**Regression testing** after each change; **smoke testing** daily builds.'] },
    ],
    sources: [`${T}`, 'UNIT V.pdf', `${P} §22.3–22.7`],
  },

  'se-strategy-steps': {
    blocks: [
      'A **strategy** for software testing provides a road map: the steps to be conducted, when they are planned and undertaken, and how much effort, time and resources they need.',
      { h: 'Strategic approach (generic characteristics)' },
      { ul: ['Conduct effective **technical reviews** before testing; many errors are removed before tests start.', 'Testing begins at the **component level** and works outward to integration of the whole system.', 'Different techniques suit different approaches and points in time.', 'Testing is done by the **developer** and, for large projects, an **independent test group (ITG)**.', '**Testing and debugging are different activities**, but debugging must be accommodated in any strategy.'] },
      { h: 'The strategic steps (spiral)' },
      { ol: ['**Unit testing**: each component as an individual unit.', '**Integration testing**: assemble components; focus on design and interfaces.', '**Validation testing**: check requirements are met.', '**System testing**: software and other system elements tested as a whole.'] },
      'Verification and validation are both covered: unit and integration testing verify the design; validation and system testing validate the requirements.',
      { h: 'Strategic issues (Gilb)' },
      { ol: ['**Specify product requirements in a quantifiable manner** long before testing begins (e.g. portability, usability as measurable targets).', '**State testing objectives explicitly** (coverage, mean time to failure, cost to find and fix defects, test-work-hours).', '**Understand the users** and develop a profile for each user category (use cases).', '**Develop a testing plan that emphasises "rapid cycle testing"**: deliver useful increments and test them quickly.', '**Build robust software designed to test itself** (antibugging, automated test hooks, diagnostics).', '**Use effective technical reviews** as a filter prior to testing.', '**Conduct technical reviews to assess the test strategy and test cases** themselves.', '**Develop a continuous improvement approach** for the testing process, using metrics.'] },
    ],
    sources: [`${T}`, 'UNIT V.pdf p1–10', `${P} §22.1–22.2`],
  },

  'se-system-testing': {
    blocks: [
      '**System testing** is a series of different tests whose primary purpose is to fully exercise the **computer-based system as a whole**: software integrated with hardware, people, databases and other systems. Each test has a different purpose, but all verify that system elements have been properly integrated and perform their allocated functions.',
      { h: 'Why it is important' },
      'Unit and integration tests check the software alone; system testing finds problems that appear only in the **real environment**: under load, after crashes, under attack, on target configurations. It is the last check before acceptance.',
      { h: 'Types' },
      { table: { head: ['Type', 'Purpose', 'Example'], rows: [
        ['**Recovery testing**', 'Force the software to fail in many ways and verify recovery is properly performed (automatic restart, data recovery, MTTR within limits)', 'Pull the network cable during a banking transaction: no money lost, transaction rolled back'],
        ['**Security testing**', 'Verify protection mechanisms prevent improper penetration', 'Testers try SQL injection, brute-force logins'],
        ['**Stress testing**', 'Run the system with abnormal quantity, frequency or volume of resources', '10× the normal number of users on an exam portal; sensitivity testing near limits'],
        ['**Performance testing**', 'Test run-time performance within the integrated system; often with stress tests and instrumentation', 'Measure response time < 2 s at 1,000 users'],
        ['**Deployment (configuration) testing**', 'Exercise the software in each environment it must run in; test installation procedures', 'Install on Windows, Linux, different browsers'],
      ] } },
      { h: 'Example' },
      'An online railway reservation system: after integration, testers run it with real hardware and database servers, simulate 50,000 simultaneous users (stress), crash a server mid-booking (recovery), try unauthorised access (security) and test installation on new servers (deployment).',
    ],
    sources: [`${T}`, 'UNIT V.pdf p20–24', `${P} §22.7`],
  },

  'se-debugging': {
    blocks: [
      { h: 'System testing (summary)' },
      'Tests the complete, integrated system in its environment: **recovery, security, stress, performance and deployment** testing (see the system testing answer).',
      { h: 'Debugging' },
      '**Debugging** occurs as a consequence of successful testing: when a test uncovers an error, debugging is the process that **results in the removal of the error**. Testing finds that there is a problem; debugging finds where and why, and fixes it.',
      { h: 'The debugging process' },
      { steps: ['Execute test cases; compare actual and expected results.', 'A mismatch shows a **symptom**; debugging tries to match the symptom with its **cause**.', 'Either the cause is found and corrected, or a cause is **suspected**, additional tests are designed to confirm it, and the process iterates.', 'After correction, **regression tests** make sure the fix did not introduce new errors.'] },
      { h: 'Why debugging is difficult' },
      { ul: ['The symptom and the cause may be geographically remote (in different modules).', 'The symptom may disappear temporarily when another error is fixed.', 'It may be caused by non-errors (round-off inaccuracies), human error, timing problems.', 'Input conditions may be hard to reproduce (real-time systems).', 'The symptom may be intermittent, or due to causes distributed across many tasks on different processors.'] },
      { h: 'Debugging strategies' },
      { ul: ['**Brute force**: memory dumps, run-time traces, print statements. Most common, least efficient.', '**Backtracking**: start where the symptom appears and trace the code backwards until the cause is found. Good for small programs.', '**Cause elimination**: induction/deduction and **binary partitioning**: form a hypothesis, design data to prove or disprove it, narrow down the possible causes.', '**Automated debugging tools**: debuggers, breakpoints, static analysers.'] },
      { h: 'Correcting the error: three questions' },
      { ol: ['Is the cause of the bug reproduced in another part of the program?', 'What "next bug" might be introduced by the fix?', 'What could we have done to prevent this bug in the first place?'] },
    ],
    sources: [`${T}`, 'UNIT V.pdf', `${P} §22.8`],
  },

  // ---------------- Testing concepts ----------------
  'se-testing-what': {
    blocks: [
      '**Software testing** is the process of executing a program with the intent of **finding errors** before it is delivered to the end user. It is a set of activities that can be planned in advance and conducted systematically.',
      { h: 'Objectives (Myers)' },
      { ol: ['Testing is a process of executing a program with the intent of finding an error.', 'A good test case is one that has a high probability of finding an as-yet-undiscovered error.', 'A successful test is one that uncovers an as-yet-undiscovered error.'] },
      'Further objectives: verify that the software meets its requirements (validation), give confidence in quality and reliability, prevent defects, and provide information for decisions (release or not).',
      { h: 'Characteristics of testing / testable software' },
      { ul: ['Testing begins at the **component level** and works outward.', 'Different techniques suit different points in time.', 'Conducted by developers and an **independent test group**.', 'Testing and debugging are different activities.', '**Testability** characteristics (Bach): operability, observability, controllability, decomposability, simplicity, stability, understandability.', 'A good test: high probability of finding an error, not redundant, "best of breed", neither too simple nor too complex.'] },
      { h: 'Principles' },
      'All tests should be traceable to requirements; planned long before testing begins; the Pareto principle applies (80% of errors in 20% of components); begin "in the small" and progress "in the large"; exhaustive testing is not possible.',
    ],
    sources: [`${T}`, 'UNIT V.pdf', `${P} §22.1, §23.1`],
  },

  'se-presence-errors': {
    blocks: [
      'This is Dijkstra\'s famous observation: "Program testing can be used to show the **presence** of bugs, but never to show their **absence**."',
      { h: 'Justification' },
      { ul: [
        '**Exhaustive testing is impossible**: even a small program with a loop of 20 iterations and a few if-statements can have about 10¹⁴ possible paths; executing all of them would take thousands of years. Input domains (all integers, all strings) are effectively infinite.',
        'Testing executes only a **finite sample** of inputs and paths. A failing test proves an error exists; passing tests prove only that **those particular cases** work.',
        'Some errors appear only under rare conditions (timing, specific data combinations, environments) that tests did not exercise.',
        'Tests are designed from requirements and code; if a requirement is **missing or misunderstood**, no test will reveal it.',
        'The test oracle (expected results) may itself be wrong.',
      ] },
      { h: 'Example' },
      'A division routine tested with 100 random pairs passes every time, but fails when the divisor is 0, which was never chosen. 100 passing tests did not show that errors were absent.',
      { h: 'Consequence' },
      'We use systematic techniques (BVA, equivalence partitioning, basis path coverage), reviews and inspections, and reliability metrics to **reduce** remaining errors to an acceptable level, and decide when to stop testing based on risk and statistics, not on proof of correctness.',
    ],
    sources: [`${T}`, `${P} §22.1, §23.1`],
  },

  'se-error-defect': {
    blocks: [
      { table: { head: ['Term', 'Meaning', 'Found when', 'Example'], rows: [
        ['**Error (mistake)**', 'A human action that produces an incorrect result; in Pressman\'s usage, a quality problem found **before** the software is released', 'During reviews/development', 'A programmer misreads the requirement "≥ 1000" as "> 1000"'],
        ['**Defect (fault, bug)**', 'The flaw in a work product (code, design) caused by the error; in Pressman\'s usage, a quality problem found **after** release to end users', 'In the product, often found by testing or users', 'The code contains if (amount > 1000)'],
        ['**Failure**', 'The observable deviation of the system from its expected behaviour when a defect is executed', 'At run time', 'A customer buying exactly ₹1,000 does not get the discount'],
      ] } },
      'Chain: **error (human) → defect (in the product) → failure (in operation)**. Not every defect causes a failure (the faulty code may never run with the triggering input).',
    ],
    sources: [`${T}`, `${P} §20.2`],
  },

  'se-test-case-design': {
    blocks: [
      'A **test case** specifies inputs, execution conditions and expected results designed to check a particular objective. **Test-case design** decides which, of an infinite number of possible tests, to run.',
      { h: 'Importance' },
      { ul: ['Exhaustive testing is impossible, so test design determines **how many errors are found** for the effort spent.', 'Good test cases have a **high probability of finding undiscovered errors** with a minimum number of tests.', 'They make testing **repeatable** and automatable (regression).', 'They provide **traceability**: each requirement is covered by tests.'] },
      { h: 'Factors for effective test cases' },
      { ul: ['**Traceable** to a requirement or design element.', 'Clear **preconditions, inputs, steps and expected results**.', '**Not redundant**; each tests something new.', '"**Best of breed**": the test most likely to find errors in its class (e.g. boundary values).', 'Neither too simple nor too complex; one objective per test.', 'Cover valid **and invalid** inputs, boundaries, error handling.', 'Use systematic techniques: white-box (basis path, condition, loop) and black-box (equivalence classes, BVA, decision tables).', 'Independent of other tests; maintainable.'] },
      { h: 'Test coverage as a measure of effectiveness' },
      '**Coverage** measures how much of the program or requirements the tests exercise:',
      { ul: ['**Statement coverage**: % of statements executed.', '**Branch (decision) coverage**: % of decision outcomes (true/false) taken.', '**Path / basis-path coverage**: % of independent paths.', '**Condition coverage**: each simple condition true and false.', '**Requirement coverage**: % of requirements with at least one test.'] },
      'Low coverage shows untested code where errors can hide and guides new test cases. High coverage is necessary but not sufficient: it shows the code ran, not that the results were checked.',
      { h: 'Example test case' },
      { table: { head: ['ID', 'Precondition', 'Input', 'Expected', 'Requirement'], rows: [['TC-07', 'User logged in', 'Withdraw ₹10,001 with daily limit ₹10,000', 'Error: limit exceeded', 'R-12 daily limit']] } },
    ],
    sources: [`${T}`, `${P} §23.1–23.2`],
  },

  // ---------------- V&V and validation ----------------
  'se-v-and-v': {
    blocks: [
      'Boehm: **Verification**: "Are we building the product **right**?" **Validation**: "Are we building the **right product**?"',
      { table: { head: ['Basis', 'Verification', 'Validation'], rows: [
        ['Definition', 'Set of activities that ensure the software correctly implements a specific function (each phase output matches its input specification)', 'Set of activities that ensure the software built is traceable to and meets customer requirements'],
        ['Question', 'Built right?', 'Right thing built?'],
        ['Focus', 'Documents, design, code against specifications', 'Final product against user needs'],
        ['Type', 'Mainly **static**: reviews, walkthroughs, inspections, plus unit/integration testing', '**Dynamic**: executing the software (validation, system, acceptance testing)'],
        ['When', 'Throughout development, before validation', 'After verification, at the end of each increment / before release'],
        ['By', 'Developers, QA team', 'Testers and end users/customers'],
        ['Finds', 'Defects early (cheaper)', 'Requirement misunderstandings, unmet needs'],
      ] } },
      { h: 'Do both use test-case design methods and testing strategies?' },
      '**Yes.** Verification and validation together encompass a wide range of SQA activities: technical reviews, quality and configuration audits, performance monitoring, simulation, feasibility study, documentation review, database review, algorithm analysis, development testing, usability testing, qualification testing, acceptance testing and installation testing. Test-case design methods are used in both: **white-box** methods mainly in verification (unit and integration testing), **black-box** methods in both, and especially in validation. The testing **strategy** (unit → integration → validation → system) spans both: the early steps verify, the later steps validate.',
    ],
    sources: [`${T}`, 'UNIT V.pdf p3', `${P} §22.1.1`],
  },

  'se-alpha-beta': {
    blocks: [
      'When software is built for many customers, formal acceptance tests with each one are impractical, so most builders use **alpha and beta testing** to uncover errors that only the end user seems able to find.',
      { table: { head: ['Basis', 'Alpha testing', 'Beta testing'], rows: [
        ['Location', 'At the **developer\'s site**', 'At **end users\' sites**'],
        ['Conducted by', 'Representative group of end users, **developer present** ("looking over the shoulder")', 'End users, **developer generally not present**'],
        ['Environment', '**Controlled**', '**Live**, not controlled by the developer'],
        ['Recording problems', 'Developer records errors and usage problems', 'Users record problems and report them to the developer at regular intervals'],
        ['Timing', 'Before beta testing, near the end of development', 'After alpha, just before release'],
        ['Testing type', 'White-box and black-box', 'Mostly black-box'],
        ['Purpose', 'Catch usage errors early in a natural setting', 'Real-world feedback on functionality, usability, reliability'],
        ['Example', 'Company employees test a new banking app in the office lab', 'A public beta of a mobile app released to volunteer users'],
      ] } },
      'A variation, **customer acceptance testing**, is performed when custom software is delivered to a customer under contract; the customer runs specific tests to decide whether to accept the software.',
    ],
    sources: [`${T} paras 95–107`, `${P} §22.6.3`],
  },

  'se-validation-strategies': {
    blocks: [
      '**Validation testing** begins at the culmination of integration testing, when components have been exercised, the software is assembled and interfacing errors are corrected. It focuses on **user-visible actions and user-recognisable output**. Validation succeeds when the software functions in a manner that can reasonably be expected by the customer, as defined in the **SRS** (validation criteria section).',
      { h: 'What validation represents' },
      'Confirmation that we built the **right product**: the software meets the customer\'s real needs.',
      { h: 'Testing strategies under validation testing' },
      { ol: [
        '**Validation-test criteria**: a test plan outlines the classes of tests, and test procedures define specific test cases, to ensure all functional requirements are satisfied, behavioural characteristics achieved, content accurate, performance attained, documentation correct, and usability and other requirements (transportability, compatibility, error recovery, maintainability) met. After each test, either the function conforms or a **deviation** is recorded on a **deficiency list** and resolved with the customer.',
        '**Configuration review (audit)**: ensures all elements of the software configuration have been properly developed, are catalogued and have the detail needed to support the support phase.',
        '**Acceptance testing**: for custom software, the customer conducts tests (from an informal "test drive" to planned tests over weeks or months).',
        '**Alpha testing**: at the developer\'s site, users in a controlled environment.',
        '**Beta testing**: at users\' sites, live environment, developer absent.',
      ] },
      { h: 'How it differs from verification' },
      'Verification checks work products against specifications (often statically); validation executes the whole software against user requirements using mainly **black-box** techniques.',
      { h: 'Who should perform it: developer or user?' },
      'The **user/customer** (or an independent test group acting for them). Developers test what they think they built and share the same misunderstandings of requirements; users judge whether the software meets their needs, in their environment, with their data. Developers support the tests and fix the deficiencies.',
      { h: 'Benefits of involving users early in release testing' },
      { ul: ['Requirement misunderstandings are found while still cheap to fix.', 'Real usage patterns and data expose errors testers miss.', 'Users build familiarity and acceptance; training is easier.', 'Feedback improves usability.'] },
      { h: 'Disadvantages' },
      { ul: ['Users may not be skilled testers: vague or incomplete reports.', 'Early versions may frustrate users and damage confidence.', 'Takes users\' time; may cause scope creep as they request new features.', 'Confidentiality risks if prototypes are exposed.'] },
    ],
    sources: [`${T} paras 78–107`, 'UNIT V.pdf p16–19', `${P} §22.6`],
  },

  // ---------------- Reviews ----------------
  'se-ftr': {
    blocks: [
      'A **formal technical review (FTR)** is a software quality control activity performed by software engineers. Objectives: (1) uncover errors in function, logic or implementation; (2) verify the software meets its requirements; (3) ensure it is represented according to predefined standards; (4) achieve software developed in a uniform manner; (5) make projects more manageable. It also serves as a training ground and promotes backup and continuity.',
      { h: 'The review meeting' },
      { ul: ['Between **three and five people** (typically) should be involved.', '**Advance preparation** should occur but should require **no more than two hours** of work for each person.', 'The duration of the meeting should be **less than two hours**.', 'The focus is a specific, small part of the software (e.g. one component), which increases the likelihood of finding errors.'] },
      { steps: ['The **producer** informs the project leader that the work product is complete and ready for review.', 'The project leader contacts a **review leader**, who evaluates the product for readiness, generates copies and distributes them to two or three **reviewers**.', 'Each reviewer spends one to two hours reviewing the product and making notes.', 'The review leader also reviews the product and establishes an **agenda**.', 'At the meeting the **producer walks through** the work product; reviewers raise issues; a **recorder** records all important issues.', 'At the end, all attendees decide: **accept** without modification, **reject** (severe errors; another review after correction), or **accept provisionally** (minor errors; no further review). All sign off.', 'A **review summary report** and **review issues list** are produced.'] },
      { h: 'Role of the review leader' },
      'Checks readiness, distributes materials, sets and maintains the agenda, chairs the meeting, keeps the discussion on the product (not the producer), limits debate, ensures the recorder logs issues, drives the decision, and ensures follow-up so that issues are corrected.',
      { h: 'Recognising an unprepared participant' },
      { ul: ['Has no written notes or marked-up copy.', 'Asks basic questions the materials already answer; raises no issues of their own.', 'Comments only on what others say, or on trivial typos.', 'Is reading the material for the first time during the meeting.', 'The review leader can also ask for preparation time/notes in advance.'] },
      { h: 'What to do as review leader' },
      'Privately and politely confirm the person is unprepared. If key reviewers are unprepared, **reschedule** the meeting rather than hold an ineffective one; otherwise, let the person observe but not count as a reviewer. Afterwards, discuss the importance of preparation, make sure preparation time is scheduled in their workload, and report persistent problems to management. Never embarrass the person in the meeting.',
      { h: 'Review guidelines' },
      'Review the product, not the producer; set and keep an agenda; limit debate; enunciate problems but don\'t solve them all; take written notes; limit participants and insist on preparation; use checklists; allocate resources; train reviewers; review early reviews.',
    ],
    sources: [REV, `${P} §20.6`],
  },

  'se-informal-vs-ftr': {
    blocks: [
      { table: { head: ['Basis', 'Informal review', 'Formal technical review (FTR)'], rows: [
        ['Formality', 'Casual, unplanned', 'Planned, structured process with defined steps'],
        ['Examples', 'Desk check with a colleague, casual meeting, pair programming, a peer looking over a pull request', 'Inspections, walkthroughs, round-robin reviews'],
        ['Participants and roles', 'One or two colleagues, no defined roles', '3–5 people: producer, review leader, reviewers, recorder'],
        ['Preparation', 'None or little', 'Required: ≤ 2 hours per reviewer'],
        ['Agenda / time limit', 'None', 'Agenda; meeting ≤ 2 hours'],
        ['Records', 'Usually none', 'Review issues list and summary report'],
        ['Decision', 'None formal', 'Accept / accept provisionally / reject; sign-off'],
        ['Follow-up', 'Not tracked', 'Corrections verified'],
        ['Effectiveness', 'Finds fewer errors; low cost; quick feedback', 'Most effective filter for errors; higher cost'],
        ['Metrics', 'Not collected', 'Preparation effort, errors found, review rate collected'],
      ] } },
      'Both are valuable: informal reviews give fast feedback during work (e.g. pair programming), FTRs are used for major work products (requirements, design, critical code).',
    ],
    sources: [REV, `${P} §20.5–20.6`],
  },

  // ---------------- Deployment ----------------
  'se-deployment-rollback': {
    blocks: [
      '**Deployment** is the process of delivering software to users or production environments: installing, configuring and enabling it, and supporting it afterwards.',
      { h: 'Deployment planning: phases' },
      { ol: ['**Preparation**: final testing, documentation and packaging; release notes.', '**Environment setup**: configuring servers, databases and networks; matching staging to production.', '**Release planning**: schedule (low-traffic window), versioning, stakeholder communication, downtime notices, training and support.', '**Execution**: deploy using a defined strategy (all-at-once, rolling, blue-green, canary).', '**Monitoring**: post-deployment checks, smoke tests, performance and error tracking.'] },
      { h: 'Best practices' },
      { ul: ['Use **CI/CD pipelines**: source control → build → automated tests → release (package and tag) → deploy to staging/production → monitor.', 'Continuous **delivery**: every change is tested and ready to release; continuous **deployment**: every change that passes tests goes live automatically.', 'Always include a **rollback plan** in the deployment plan.', 'Communicate clearly with users about changes and downtime.', 'Pressman\'s deployment principles: manage customer expectations; assemble and test a complete delivery package; establish a support regime before delivery; provide instructional materials; fix bugs before delivering.'] },
      { h: 'Rollback planning' },
      '**Rollback** is reverting to a previous stable version when a deployment fails or causes issues.',
      { h: 'When to roll back' },
      'Critical bugs or crashes, security vulnerabilities, serious performance degradation, data corruption.',
      { h: 'Rollback strategies' },
      { ul: ['**Version control / keep previous builds** for quick redeployment of the last good release.', '**Blue-green deployment**: run two identical environments (live and standby); switch traffic back instantly.', '**Canary release**: release to a small % of users first; stop if errors rise.', '**Feature flags**: disable a problematic feature without a full rollback.', '**Database snapshots / backward-compatible migrations**: restore data to the pre-deployment state.'] },
      { h: 'Rollback plan contents' },
      'Trigger criteria, decision owner, step-by-step procedure and time estimate, data-restore steps, verification checks after rollback, and communication to users.',
    ],
    sources: [`${QP} "Deployment Overview and Planning", "Deployment Rollback"`, `${P} §7.4 (deployment principles)`],
  },

  'se-pred-auto-manual': {
    blocks: [
      { table: { head: ['Basis', 'Manual testing', 'Automated testing'], rows: [
        ['How', 'Tester executes test cases by hand and observes results', 'Scripts/tools execute tests and compare results'],
        ['Speed', 'Slow', 'Fast; can run unattended, overnight, in CI'],
        ['Initial cost', 'Low', 'High (tools, script writing)'],
        ['Long-term cost', 'High for repeated runs', 'Low per run'],
        ['Reliability', 'Prone to human error and fatigue', 'Consistent and repeatable'],
        ['Best for', 'Exploratory, usability, ad-hoc testing; UI look and feel; one-off tests', 'Regression, smoke, load/performance, data-driven tests; frequent builds'],
        ['Human judgement', 'Yes: can notice unexpected issues', 'No: checks only what it is scripted to check'],
        ['Tools', 'Test case documents, bug trackers', 'Selenium, JUnit/pytest, Cypress, JMeter, Appium'],
      ] } },
      { img: 'se-t-img17' },
      { h: 'When to choose each' },
      { ul: ['Choose **automation** for stable features that are tested repeatedly (regression), for many data combinations, for performance/load testing and in CI/CD pipelines.', 'Choose **manual** testing for new or rapidly changing features, exploratory and usability testing, and tests run once.', 'Most projects use **both**: automate the repetitive core, explore manually.'] },
    ],
    sources: [`${T}`, `${QP}`],
  },
}
