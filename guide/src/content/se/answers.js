// Model answers keyed by PYQ id. Every answer lists its sources.
const P = 'Pressman, Software Engineering: A Practitioner\'s Approach'
const U3 = 'SE Unit-3 notes (Unit 3.docx, SE_Unit-3_Part2.pdf)'
const U4 = 'SE Unit-4 notes (Unit 4.docx, Software Architecture_Unit 4.docx)'
const U5 = 'SE Unit-5 notes (Testing Unit V.docx)'

export default {
  'se-mccall': {
    blocks: [
      'McCall, Richards and Walters (1977) proposed a quality model that groups **11 quality factors** under three aspects of a software product: how it operates, how easily it can be changed, and how easily it can be moved to new environments.',
      { img: 'se-mccall' },
      { h: '1. Product operation — using the software' },
      { ul: ['**Correctness**: satisfies its specification and the customer\'s objectives.', '**Reliability**: performs its intended function with the required precision.', '**Efficiency**: uses the minimum computing resources and code.', '**Integrity**: controls unauthorised access to software and data.', '**Usability**: effort needed to learn, operate, prepare input and interpret output.'] },
      { h: '2. Product revision — changing the software' },
      { ul: ['**Maintainability**: effort to locate and fix an error.', '**Flexibility**: effort to modify an operational program.', '**Testability**: effort to test a program to ensure it works.'] },
      { h: '3. Product transition — moving the software' },
      { ul: ['**Portability**: effort to transfer it to another hardware/software environment.', '**Reusability**: extent to which parts can be reused in other applications.', '**Interoperability**: effort to couple it with another system.'] },
      'Each factor is measured indirectly through metrics such as auditability, accuracy, completeness, consistency, error tolerance, modularity and simplicity, graded 0–10.',
    ],
    sources: [`${U5} paras 482–600`, 'unit5-part2-quality.pptx slides 2–4', `${P} §19.2`],
  },

  'se-arch-styles': {
    blocks: [
      'An **architectural style** is a template for building a whole system. It specifies a set of **components**, **connectors** that let components communicate, **constraints** on how they are integrated, and **semantic models** to understand the overall properties. Pressman\'s brief taxonomy has five styles:',
      { h: '1. Data-centred architecture' },
      { img: 'se-arch-data-centred' },
      'A central data store (repository) is accessed frequently by independent client components that add, update or delete data. A **blackboard** variant notifies clients when data of interest changes. Integrability is high: clients can be added without affecting others. *Example: hospital records system.*',
      { h: '2. Data-flow architecture' },
      { img: 'se-arch-data-flow' },
      'Input data is transformed through a series of computational components (**filters**) connected by **pipes**. Filters work independently and don\'t need to know their neighbours. A single line of filters is **batch sequential**. *Example: compiler phases, Unix pipes.*',
      { h: '3. Call-and-return architecture' },
      { img: 'se-arch-call-return' },
      'A program structure that is easy to modify and scale. Sub-styles: **main program/subprogram** (hierarchical decomposition) and **remote procedure call** (components distributed across machines).',
      { h: '4. Object-oriented architecture' },
      'Components encapsulate data and the operations on it; they communicate by message passing.',
      { h: '5. Layered architecture' },
      { img: 'se-arch-layered' },
      'Layers each do a set of operations closer to the machine as you go inward: user interface → application → utility → core. *Example: OSI model, OS kernels.*',
    ],
    sources: ['unit3-cohesion-coupling-taxanomy of archi styles.pptx slides 33–44', `${U4}`, `${P} §13.3`],
  },

  'se-validation-strategies': {
    blocks: [
      '**Validation testing** begins when integration testing is complete. It succeeds when the software functions in a manner that can reasonably be expected by the customer (as defined in the SRS).',
      { h: 'Validation-test criteria' },
      'A test plan and test procedures show that all functional requirements are met, behavioural characteristics achieved, performance attained, documentation correct, and usability and other requirements (portability, compatibility, error recovery, maintainability) met. Deviations found go on a **deficiency list**.',
      { h: 'Configuration review' },
      'An audit to make sure all elements of the software configuration are properly developed, catalogued and detailed enough to support the support phase.',
      { h: 'Acceptance, alpha and beta testing' },
      { table: { head: ['', 'Alpha', 'Beta'], rows: [['Location', 'Developer\'s site', 'End users\' sites'], ['Conducted by', 'Representative users, developer present', 'End users, developer absent'], ['Environment', 'Controlled', 'Live'], ['Purpose', 'Catch usage errors early', 'Real-world feedback before release']] } },
      '**Acceptance testing**: for custom software, the customer runs a series of tests (informal test drive to planned tests over weeks) to validate all requirements.',
      { h: 'Who should perform it?' },
      'The **user/customer** (or an independent test group on their behalf). Developers test what they built and may miss requirement misunderstandings; users judge whether the software meets their needs. Involving users early (prototypes, release testing) finds these gaps while they are still cheap to fix.',
    ],
    sources: [`${U5} paras 78–107`, 'UNIT V.pdf p16–19', `${P} §22.6`],
  },

  'se-problem-based': {
    blocks: [
      '**Problem-based estimation** estimates the size of the software (LOC or FP) by decomposing it into functions, then converts size into effort and cost using historical productivity.',
      { steps: ['Begin with a bounded statement of software scope.', 'Decompose the software into problem functions that can each be estimated individually.', 'Estimate LOC or FP for each function as optimistic, most likely and pessimistic values.', 'Compute the expected value with the three-point formula.', 'Apply baseline productivity metrics (LOC/pm or FP/pm) to get effort; multiply by labour rate for cost.'] },
      { formula: 'S = (Sopt + 4·Sm + Spess) / 6' },
      { h: 'Example' },
      'CAD software, 3-D geometric analysis function: Sopt = 4600, Sm = 6900, Spess = 8600 → S = 6800 LOC. After estimating all seven functions the total is 33,200 LOC. With 620 LOC/pm and Rs 8,000/month: effort ≈ 54 pm and cost ≈ Rs 4.3 lakh.',
      { h: 'Guidelines' },
      { ul: ['Decompose finely enough to estimate confidently.', 'Use your own organisation\'s historical data.', 'Do both LOC and FP estimates and reconcile.', 'Record actual values to improve the next estimate.'] },
    ],
    sources: [`${U3}`, 'SE_Unit-3_Part2.pdf p23–25', `${P} §26.6`],
  },

  'se-size-metrics': {
    blocks: [
      '**Size-oriented metrics** normalise quality and productivity measures by the size of the software, usually **lines of code (LOC)**.',
      { table: { head: ['Project', 'LOC', 'Effort (pm)', 'Cost', 'Pages of docs', 'Errors', 'Defects', 'People'], rows: [['alpha', '12,100', '24', '$168,000', '365', '134', '29', '3']] } },
      { h: 'Metrics derived' },
      { ul: ['Errors per KLOC', 'Defects per KLOC', 'Cost per LOC', 'Pages of documentation per KLOC', 'LOC per person-month (productivity)'] },
      { h: 'As progress indicators' },
      'Comparing LOC completed with LOC planned, or errors/KLOC found so far with historical values, tells the manager whether the project is on track and whether quality is acceptable.',
      { h: 'The LOC metric' },
      { compare: [
        { title: 'For', items: ['Easy to count', 'Many models (COCOMO) use it', 'Lots of historical data'] },
        { title: 'Against', items: ['Language dependent', 'Penalises well-designed short programs', 'Hard to estimate early', 'Doesn\'t suit non-procedural languages'] },
      ] },
    ],
    sources: [`${U3}`, `${P} §30.3`],
  },

  'se-risk-reactive-proactive': {
    blocks: [
      { compare: [
        { title: 'Reactive risk strategy', items: ['Team does nothing about risks until something goes wrong', 'Then rushes to correct the problem ("fire-fighting")', 'At best, monitors the project for likely risks', 'Resources set aside only when a problem appears', 'Often the project is already in trouble when action is taken'] },
        { title: 'Proactive risk strategy', items: ['Begins long before technical work starts', 'Identifies potential risks', 'Assesses their probability and impact and ranks them', 'Establishes a plan to manage them (avoid where possible)', 'Prepares contingency plans for the rest'] },
      ] },
      { h: 'How proactive risk management helps project success' },
      { ul: ['Fewer surprises: major risks are known and watched.', 'Better estimates and schedules (risk exposure is budgeted).', 'Avoids costly late changes; problems are mitigated early.', 'Gives management a clear picture and improves stakeholder confidence.', 'Contingency plans let the team react quickly if a risk occurs.'] },
      { img: 'se-risk' },
    ],
    sources: [`${U3} paras 222–273`, 'Unit-3-Part-1_SE.pdf p58–79', `${P} §28.1`],
  },

  'se-rmmm': {
    blocks: [
      'The **RMMM plan** documents all work done as part of risk analysis and is used by the project manager as part of the overall plan. It addresses three issues:',
      { ol: ['**Risk mitigation (avoidance)**: steps to reduce the probability of the risk.', '**Risk monitoring**: tracking whether the risk is becoming more or less likely, and whether mitigation steps are being followed.', '**Risk management and contingency planning**: what to do if the risk actually happens.'] },
      { h: 'Example: high staff turnover (probability 0.70, critical impact)' },
      { table: { head: ['', 'Actions'], rows: [
        ['Mitigation', 'Meet current staff to find causes of turnover (pay, conditions); reduce those causes before the project; organise teams so information is widely shared; define documentation standards; peer-review all work; assign a backup for every critical technologist'],
        ['Monitoring', 'General attitude of team members, interpersonal relationships, potential problems with compensation and benefits, availability of jobs inside and outside the company'],
        ['Management', 'If people leave: documented work and backups allow handover; newcomers are briefed; the schedule is adjusted'],
      ] } },
      { h: 'Risk information sheet' },
      'Each risk can be recorded in a sheet: ID, date, probability, impact, description, refinement/context, mitigation/monitoring, management/contingency plan/trigger, current status, originator.',
      { formula: 'Risk exposure RE = P × C' },
    ],
    sources: ['Unit-3-Part-1_SE.pdf p70–79', `${P} §28.6–28.7`],
  },

  'se-design-principles': {
    blocks: [
      { h: 'The design process' },
      'Design translates requirements into a blueprint for building the software, refining from a high level of abstraction (architecture, data, interfaces) to lower levels (component-level, algorithms). It is iterative and is evaluated through reviews.',
      { h: 'Basic design principles (Davis)' },
      { ol: [
        'The design process should not suffer from "tunnel vision"; consider alternatives.',
        'The design should be traceable to the analysis model.',
        'The design should not reinvent the wheel; reuse patterns.',
        'It should minimise the intellectual distance between the software and the real-world problem.',
        'It should exhibit uniformity and integration.',
        'It should be structured to accommodate change.',
        'It should degrade gently under abnormal data, events or conditions.',
        'Design is not coding, and coding is not design.',
        'It should be assessed for quality as it is being created.',
        'It should be reviewed to minimise conceptual (semantic) errors.',
      ] },
      { h: 'Core design concepts' },
      'Abstraction, architecture, patterns, separation of concerns, **modularity**, **information hiding**, **functional independence** (high cohesion, low coupling), refinement, refactoring.',
      { h: 'Why apply them?' },
      'They give designs that are easier to understand, test, change and reuse, and they catch problems before they are coded, when fixing them is cheap.',
    ],
    sources: [`${U4}`, 'sw architecture and component design.pdf', `${P} §12.2–12.3`],
  },

  'se-coupling-cohesion': {
    blocks: [
      '**Cohesion** is the degree to which the elements of a module belong together; it is a measure of a module\'s internal strength. **Coupling** is the degree of interdependence between modules. A good design has **high cohesion and low coupling** (functional independence).',
      { h: 'Types of cohesion (best → worst)' },
      { img: 'se-cohesion-types' },
      { ol: ['**Functional**: all elements perform a single task.', '**Sequential**: output of one element is input to the next.', '**Communicational**: elements operate on the same data.', '**Procedural**: elements follow a specific sequence of execution.', '**Temporal**: elements are executed at the same time (e.g. initialisation).', '**Logical**: elements perform logically similar operations, selected by a flag.', '**Coincidental**: elements are unrelated.'] },
      { h: 'Types of coupling (best → worst)' },
      { img: 'se-coupling-types' },
      { ol: ['**Data coupling**: modules exchange only elementary data parameters.', '**Stamp coupling**: modules pass a whole data structure.', '**Control coupling**: one module passes a control flag that directs the other.', '**External coupling**: modules depend on external formats, devices or protocols.', '**Common coupling**: modules share global data.', '**Content coupling**: one module modifies or branches into another\'s internals.'] },
      'Higher cohesion improves understandability and reuse; lower coupling limits the ripple effect of changes and improves portability.',
    ],
    sources: ['unit3-cohesion-coupling-taxanomy of archi styles.pptx slides 1–24', 'Function.docx', `${P} §12.3.8`],
  },

  'se-quality-define': {
    blocks: [
      '**Software quality** (Pressman): an effective software process applied in a manner that creates a useful product that provides measurable value for those who produce it and those who use it.',
      { h: 'Core concepts' },
      { ul: ['**Quality of design**: the requirements, specifications and design describe what users need.', '**Quality of conformance**: the implementation follows the design and meets requirements and performance goals.', '**User satisfaction** = compliant product + good quality + delivery within budget and schedule.', '**Quality control**: reviews and testing to make each product meet its requirements.', '**Quality assurance**: auditing and reporting to give management confidence in the process.', '**Cost of quality**: prevention + appraisal + failure (internal and external).'] },
      { h: 'Significance' },
      { ul: ['Poor quality raises risk: failures, security breaches, lost customers and legal liability.', 'Defects found late are many times more expensive to fix.', 'Good quality lowers maintenance cost and increases user trust.'] },
      { h: 'Garvin\'s dimensions' },
      'Performance, feature, reliability, conformance, durability, serviceability, aesthetic and perception quality.',
    ],
    sources: ['SE-unit5-part2-quality-roger pressman.pdf p1–7', `${P} §19.1–19.3`],
  },

  'se-whitebox': {
    blocks: [
      '**White-box testing** (glass-box, structural testing) derives test cases from the internal control structure of the program. Test cases guarantee that all independent paths are exercised at least once, all logical decisions on their true and false sides, all loops at their boundaries, and internal data structures are checked.',
      { h: '1. Basis path testing' },
      { steps: ['Draw the flow graph from the code.', 'Compute cyclomatic complexity V(G) = E − N + 2 = P + 1 = number of regions.', 'Identify a basis set of independent paths.', 'Prepare a test case for each path.'] },
      { h: '2. Condition testing' },
      'Exercises each logical condition in the program (each relational expression and boolean operand true and false).',
      { h: '3. Data-flow testing' },
      'Selects test paths according to the definitions and uses of variables: DEF(S) = variables defined in statement S, USE(S) = variables used. Every DU chain [X, S, S\'] is covered.',
      { h: '4. Loop testing' },
      { ul: ['**Simple loops** (n = max passes): skip the loop, 1 pass, 2 passes, m passes (m < n), n − 1, n, n + 1 passes.', '**Nested loops**: start at the innermost loop with outer loops at minimum; work outward.', '**Concatenated loops**: test as simple loops if independent, else as nested.', '**Unstructured loops**: redesign to structured form.'] },
    ],
    sources: [`${U5} paras 167–240`, `${P} §23.4–23.5`],
  },

  'se-wb-vs-bb': {
    blocks: [
      { table: { head: ['Basis', 'White-box testing', 'Black-box testing'], rows: [
        ['Also called', 'Glass-box, structural', 'Behavioural, functional'],
        ['Test basis', 'Internal code and logic', 'Requirements and specifications'],
        ['Code knowledge', 'Required', 'Not required'],
        ['Performed by', 'Developers', 'Independent testers, end users'],
        ['Techniques', 'Basis path, condition, data-flow, loop testing', 'Equivalence partitioning, BVA, graph-based, decision tables'],
        ['Finds', 'Logic errors, unreachable code, bad paths', 'Missing/incorrect functions, interface and performance errors'],
        ['Level', 'Mainly unit testing', 'Integration, system and acceptance testing'],
        ['When', 'Early, once code exists', 'Later stages, or from requirements before code'],
      ] } },
    ],
    sources: [`${U5}`, `${P} §23.3–23.6`],
  },

  'se-blackbox': {
    blocks: [
      '**Black-box testing** focuses on functional requirements: test cases are derived from inputs and expected outputs without regard to internal code. It finds incorrect/missing functions, interface errors, errors in data structures or external database access, behaviour or performance errors, and initialisation/termination errors.',
      { h: 'Equivalence partitioning' },
      'Divide the input domain into classes of data from which test cases can be derived; one test per class. Guidelines: a range → one valid, two invalid classes; a specific value → one valid, two invalid; a member of a set → one valid, one invalid; a boolean → one valid, one invalid.',
      'Example: age must be 18–60 → classes < 18, 18–60, > 60 → test 10, 35, 70.',
      { h: 'Boundary value analysis' },
      'More errors happen at the boundaries of the input domain than in the centre. For a range a..b, test a, b, and values just above and below each: a−1, a, a+1, b−1, b, b+1. Apply the same to output ranges and internal data structures (e.g. array limits).',
      'Example: 18–60 → test 17, 18, 19, 59, 60, 61.',
      { h: 'Other methods' },
      'Graph-based testing, orthogonal array testing, decision-table / cause-effect testing.',
    ],
    sources: [`${U5} paras 240–304`, `${P} §23.6`],
  },

  'se-bva': {
    blocks: [
      '**Boundary value analysis** complements equivalence partitioning: instead of any value in a class, it selects test cases at the **edges** of the class, because input-validation errors cluster at boundaries (e.g. `<` vs `<=`).',
      { h: 'Guidelines' },
      { ol: ['If an input is a range a..b, test a and b, and values just above and below a and b.', 'If an input is a number of values, test the minimum, maximum, and one below/above them.', 'Apply 1 and 2 to output conditions.', 'If internal data structures have limits (array of 100 entries), test at those boundaries.'] },
      { h: 'Example: exam result (pass if marks ≥ 40, marks 0–100)' },
      { table: { head: ['Test', 'Input', 'Expected'], rows: [['Below range', '−1', 'Invalid input'], ['Lower bound', '0', 'Fail'], ['Just below pass', '39', 'Fail'], ['Pass boundary', '40', 'Pass'], ['Just above pass', '41', 'Pass'], ['Upper bound', '100', 'Pass'], ['Above range', '101', 'Invalid input']] } },
    ],
    sources: [`${U5}`, `${P} §23.6.3`],
  },

  'se-cyclomatic': {
    blocks: [
      '**Cyclomatic complexity** is a software metric that gives a quantitative measure of the logical complexity of a program. In basis path testing it equals the number of **independent paths** in the basis set, which is an upper bound for the number of tests needed to execute every statement and branch at least once.',
      { h: 'Flow-graph notation' },
      'Circles (nodes) represent one or more statements; arrows (edges) represent flow of control; a node containing a condition is a **predicate node**; areas bounded by edges and nodes are **regions** (count the outside as one).',
      { h: 'Three ways to compute it' },
      { formula: 'V(G) = E − N + 2   •   V(G) = P + 1   •   V(G) = number of regions' },
      { h: 'Selecting paths for data-flow testing' },
      { steps: ['Number the statements and find DEF(S) and USE(S) for each variable.', 'List definition–use (DU) chains [X, S, S\'] with no redefinition of X between S and S\'.', 'Choose test paths so that every DU chain is covered at least once.', 'Write input data that forces each chosen path.'] },
      { tip: 'Try the cyclomatic complexity tool on the Numericals tab with your own flow graph.' },
    ],
    sources: [`${U5}`, `${P} §23.4.2–23.5.2`],
  },

  'se-num-cc': {
    blocks: [
      'Nodes (N): a, bc, f, g, h, i, de, j, k → **N = 9**.',
      'Edges (E): a→bc, bc→f, bc→de, f→g, f→h, g→i, h→i, i→j, de→j, j→a, a→k → **E = 11**.',
      { ul: ['V(G) = E − N + 2 = 11 − 9 + 2 = **4**.', 'Predicate nodes: a (to bc or k), bc (to f or de), f (to g or h) → P = 3 → V(G) = 3 + 1 = **4**.'] },
      { h: 'Independent paths' },
      { ol: ['a → k', 'a → bc → de → j → a → k', 'a → bc → f → g → i → j → a → k', 'a → bc → f → h → i → j → a → k'] },
      'Four test cases, one forcing each path, give full branch coverage.',
    ],
    sources: ["SE Jun '23 paper (compiled bank)", 'Verified with the cyclomatic complexity tool'],
  },

  'se-num-fp': {
    blocks: [
      { table: { head: ['Domain value', 'Count', 'Average weight', 'Total'], rows: [['External inputs', '50', '4', '200'], ['External outputs', '40', '5', '200'], ['External inquiries', '35', '4', '140'], ['Internal logical files', '6', '10', '60'], ['External interfaces', '4', '7', '28'], ['**Count total (UFP)**', '', '', '**628**']] } },
      'The paper gives no ratings for the 14 complexity-adjustment factors, so assume each is **average (Fi = 3)**: ΣFi = 14 × 3 = 42.',
      { formula: 'FP = UFP × [0.65 + 0.01 × ΣFi] = 628 × [0.65 + 0.42] = 628 × 1.07 = 671.96' },
      '**FP ≈ 672.**',
    ],
    sources: ["SE May '25 paper (compiled bank)", `${P} §30.2.1`, 'Verified with the FP calculator'],
  },

  'se-num-cocomo-200': {
    blocks: [
      'Average-experience team, schedule not very tight → **semi-detached** mode: a = 3.0, b = 1.12, c = 2.5, d = 0.35.',
      { ul: ['Effort E = 3.0 × (200)^1.12 = 3.0 × 377.7 = **1133.12 person-months**', 'Development time D = 2.5 × (1133.12)^0.35 = **29.30 months**', 'Average staff = E / D = 1133.12 / 29.30 = **38.67 ≈ 39 persons**', 'Productivity = 200,000 LOC / 1133.12 pm = **176.5 LOC/pm**'] },
    ],
    sources: ["SE May '25 paper (compiled bank)", `${U3} COCOMO section`, 'Verified with the COCOMO calculator'],
  },

  'se-num-cocomo-400': {
    blocks: [
      { table: { head: ['Mode', 'Effort E = a·400ᵇ (pm)', 'Time D = 2.5·Eᵈ (months)'], rows: [
        ['Organic (2.4, 1.05, 0.38)', '2.4 × 400^1.05 = **1295.31**', '2.5 × 1295.31^0.38 = **38.08**'],
        ['Semi-detached (3.0, 1.12, 0.35)', '3.0 × 400^1.12 = **2462.80**', '2.5 × 2462.80^0.35 = **38.45**'],
        ['Embedded (3.6, 1.20, 0.32)', '3.6 × 400^1.20 = **4772.81**', '2.5 × 4772.81^0.32 = **37.60**'],
      ] } },
      'Effort rises sharply with the mode while development time stays almost the same: embedded projects need far more people working in parallel.',
    ],
    sources: ["SE Jun '24 paper (compiled bank)", 'Verified with the COCOMO calculator'],
  },

  'se-num-loc-cad': {
    blocks: [
      { table: { head: ['Function', 'LOC'], rows: [['3DGA', '6,800'], ['UI (UICF)', '2,300'], ['2DGA', '5,300'], ['DB management', '3,350'], ['Graphics display', '4,950'], ['Peripheral control', '2,100'], ['Design analysis', '8,400'], ['**Total**', '**33,200**']] } },
      { ul: ['Cost per LOC = labour rate ÷ productivity = 8000 ÷ 620 = **Rs 12.90 per LOC**', 'Total effort = 33,200 ÷ 620 = **53.55 person-months** (≈ 54 pm)', 'Total cost = 53.55 × 8000 = **Rs 4,28,387** (or 33,200 × 12.90 ≈ Rs 4,28,280)'] },
    ],
    sources: ["SE Dec '22–Jan '23 paper Q", `${P} §26.6.3`],
  },

  'se-num-loc-mower': {
    blocks: [
      'Any reasonable functional decomposition earns the marks; show it as a table, then compute. One example:',
      { table: { head: ['Function', 'Estimated LOC'], rows: [
        ['User interface & control panel (start/stop, settings)', '1,500'], ['Lawn mapping & boundary detection', '2,500'], ['Path planning & navigation', '3,500'], ['Obstacle detection (sensors)', '2,000'],
        ['Motor and blade control', '1,800'], ['Battery monitoring & return-to-dock', '1,000'], ['Scheduling (mow times, weather)', '800'], ['Error handling & diagnostics / logging', '1,200'], ['**Total**', '**14,300**'],
      ] } },
      { ul: ['Effort = 14,300 ÷ 450 = **31.8 person-months**', 'Cost = 31.8 × $7,000 = **$222,444** (≈ $2.2 lakh)', 'Cost per LOC = 7000 ÷ 450 = **$15.56**'] },
      { tip: 'You may use optimistic/likely/pessimistic values per function with S = (opt + 4·likely + pess)/6 for extra marks.' },
    ],
    sources: ["SE Nov '25 paper Q11(b)", `${P} §26.6.3 (CAD example method)`],
  },

  'se-num-cocomo2-atm': {
    blocks: [
      'COCOMO II application-composition model uses **object points**.',
      { table: { head: ['Object', 'Count', 'Complexity weight (medium)', 'Points'], rows: [['Screens', '12', '2', '24'], ['Reports', '10', '5', '50'], ['3GL components', '80', '10', '800'], ['**Object points (OP)**', '', '', '**874**']] } },
      'Assume no reuse: NOP = OP × (100 − %reuse)/100 = 874.',
      'Average developer experience and maturity → nominal productivity PROD = 13 NOP/pm.',
      { formula: 'Effort = NOP ÷ PROD = 874 ÷ 13 ≈ 67.2 person-months' },
      { note: 'State your assumptions (reuse %, PROD value) clearly; with 20% reuse NOP = 699 and effort ≈ 53.8 pm.' },
    ],
    sources: ["SE Dec '24 paper", 'SE_Unit-3_Part2.pdf p31–36', `${P} §26.7.2`],
  },

  'se-num-defect-density': {
    blocks: [
      { ul: ['Total defects = 9 minor + 5 major = **14**', 'Size = 0.350 KLOC'] },
      { formula: 'Defect density = 14 ÷ 0.350 = 40 defects per KLOC' },
      'Major-defect density alone = 5 ÷ 0.35 ≈ 14.3 per KLOC. Comparing these with the organisation\'s historical figures tells whether the module is unusually error-prone.',
    ],
    sources: ["SE Dec '22–Jan '23 paper"],
  },
}
