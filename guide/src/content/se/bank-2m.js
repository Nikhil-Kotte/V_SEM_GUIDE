// Software Engineering: a 2-mark question bank for each unit, with full-mark answers.
//   from:  the PYQ this question was asked as (its papers and class tests are shown and drive the order:
//          class-test questions first, then the most-asked); omitted for likely questions.
//   q:     the question as it would be set for 2 marks.
//   a:     the answer: a definition plus the points an examiner looks for (content blocks).
// Answers for questions linked with `from` also serve as that PYQ's model answer when it has none.
export default [
  {
    unit: 'I',
    items: [
      { id: 's1-sdlc', from: 'se-mid-sdlc', q: 'Define the Software Development Life Cycle and list all its phases.', a: [
        'The **SDLC** is a structured sequence of phases that a software product goes through **from the initial idea to its retirement**, defining the activities needed to build and maintain it systematically.',
        { ol: ['Requirement gathering and analysis', 'Planning (feasibility, estimation)', 'Design', 'Implementation (coding)', 'Testing', 'Deployment', 'Maintenance'] },
      ] },
      { id: 's1-define-se', from: 'se-define-se', q: 'Define software and software engineering.', a: [
        '**Software**: programs (instructions) that provide the desired function, the data structures they manipulate, and the documents describing their operation and use.',
        '**Software engineering** (IEEE): the application of a **systematic, disciplined, quantifiable approach** to the development, operation and maintenance of software; that is, the application of engineering to software.',
      ] },
      { id: 's1-practice', from: 'se-define-practice', q: 'Define software engineering practice.', a: [
        '**Software engineering practice** is the collection of concepts, principles, methods and tools a software engineer applies daily. Its essence (Polya): **understand the problem** (communication, analysis), **plan a solution** (modelling, design), **carry out the plan** (code generation), **examine the result** (testing, quality assurance).',
      ] },
      { id: 's1-process', from: 'se-define-process', q: 'Define a software process. List its activities.', a: [
        'A **software process** is a collection of **activities, actions and tasks** performed when a work product is to be created.',
        'Framework activities: **communication, planning, modelling, construction, deployment**, supported by umbrella activities (tracking and control, risk management, SQA, reviews, measurement, SCM, reusability management, work product preparation).',
      ] },
      { id: 's1-five', from: 'se-five-framework', q: 'List the five generic process framework activities.', a: [
        { ol: ['**Communication**: understand objectives and gather requirements with stakeholders.', '**Planning**: tasks, risks, resources, work products, schedule.', '**Modelling**: analysis and design models.', '**Construction**: code generation and testing.', '**Deployment**: delivery, evaluation and feedback.'] },
      ] },
      { id: 's1-umbrella', from: 'se-umbrella-list', q: 'List the umbrella activities of a software process.', a: [
        { ul: ['Software project tracking and control', 'Risk management', 'Software quality assurance', 'Technical reviews', 'Measurement', 'Software configuration management', 'Reusability management', 'Work product preparation and production'] },
      ] },
      { id: 's1-assessment', from: 'se-assessment-approaches', q: 'List the approaches for software process assessment.', a: [
        { ul: ['**SCAMPI**: Standard CMMI Assessment Method for Process Improvement (initiating, diagnosing, establishing, acting, learning).', '**CBA IPI**: CMM-Based Appraisal for Internal Process Improvement.', '**SPICE** (ISO/IEC 15504): standard for process assessment.', '**ISO 9001:2000 for software**: generic quality-management standard.'] },
      ] },
      { id: 's1-cmm', from: 'se-cmm-pros-cons', q: 'Give two advantages and two disadvantages of the SEI process-maturity (CMM/CMMI) approach.', a: [
        { compare: [{ title: 'Advantages', items: ['Clear, staged roadmap for process improvement', 'Better predictability of cost, schedule and quality; comparable across organisations'] }, { title: 'Disadvantages', items: ['Heavy documentation and cost; hard for small organisations', 'Can become box-ticking; moving up a level takes years'] }] },
      ] },
      { id: 's1-waterfall', from: 'se-waterfall-phases', q: 'Name the successive phases of the waterfall model.', a: [
        { flow: ['Communication (initiation, requirements)', 'Planning (estimating, scheduling, tracking)', 'Modelling (analysis, design)', 'Construction (code, test)', 'Deployment (delivery, support, feedback)'] },
        'Each phase is completed in sequence before the next begins (classic life cycle).',
      ] },
      { id: 's1-rad', from: 'se-rad-drawbacks', q: 'What are the drawbacks of the RAD model?', a: [
        { ul: ['Large projects need enough skilled people to form several RAD teams.', 'Fails if developers and customers are not committed to rapid-fire activity.', 'Only systems that can be properly **modularised** can be built.', 'Not appropriate when technical risks are high or performance needs tuning; high cost of modelling and code-generation tools.'] },
      ] },
      { id: 's1-iteration', from: 'se-iteration-outputs', q: 'What are the key outputs of an iteration in an iterative development project?', a: [
        { ul: ['A **working, tested increment** of the software.', 'Updated requirements and design models (and documentation).', '**Customer feedback** on the increment.', 'A **plan for the next iteration** (updated estimates, risks, priorities).'] },
      ] },
      { id: 's1-evo-trad', from: 'se-evolutionary-vs-traditional', q: 'Differentiate evolutionary and traditional (waterfall) software development.', a: [
        { table: { head: ['Evolutionary', 'Traditional'], rows: [['Requirements evolve during development', 'Requirements fixed at the start'], ['Increasingly complete versions delivered', 'One delivery at the end'], ['Continuous customer involvement', 'Customer mainly at start and end'], ['Suits unclear or changing needs (prototyping, spiral)', 'Suits stable, well-known needs']] } },
      ] },
      { id: 's1-spiral', q: 'What is the spiral model? When is it used?', a: [
        'The **spiral model** (Boehm) is a **risk-driven evolutionary model** that couples the iterative nature of prototyping with the systematic control of waterfall; each loop passes through communication, planning with **risk analysis**, modelling, construction and deployment, producing increasingly complete versions.',
        'Used for **large, complex, high-risk** projects (banking, medical, safety-critical) and when requirements are unclear or expected to change.',
      ] },
      { id: 's1-prototype', q: 'When is the prototyping model used? State one problem with it.', a: [
        'Used when the customer gives **general objectives but not detailed requirements**, or when the developer is **unsure of an algorithm, OS or interface**; a quick prototype is built, evaluated by users, and refined until requirements are clear.',
        'Problem: the customer may treat the prototype as the **working product**, and quick implementation compromises may remain in the final system.',
      ] },
      { id: 's1-specialized', q: 'Name the specialized process models.', a: [
        { ul: ['**Component-based development**: builds applications from reusable COTS components.', '**Formal methods model**: mathematical specification and verification (cleanroom).', '**Aspect-oriented software development**: handles crosscutting concerns (security, logging) as aspects.'] },
      ] },
    ],
  },
  {
    unit: 'II',
    items: [
      { id: 's2-backlog-sprint', from: 'se-mid-backlog-sprint', q: 'Mention the importance of backlogs and sprints in the agile process model.', a: [
        { ul: ['**Product backlog**: a prioritised list of all requirements and features; the most valuable items are built first, and **new or changed requirements** are absorbed by adding to it, without disturbing current work.', '**Sprint**: a short time-boxed iteration (≤ 30 days) in which selected backlog items are built into a **working, shippable increment**; no changes during the sprint give stability, and the demo at its end gives regular customer feedback and visible progress.'] },
      ] },
      { id: 's2-agile', from: 'se-agile-what', q: 'What is an agile process?', a: [
        'An **agile process** is an adaptable, **incremental** software process that delivers working software in **short iterations** with continuous customer collaboration, so it can respond quickly to changing requirements. It assumes requirements are hard to predict, design and construction are interleaved, and activities are not predictable, so it adapts incrementally using customer feedback (e.g. XP, Scrum, ASD).',
      ] },
      { id: 's2-asd', from: 'se-asd-success', q: 'Why do ASD teams have a higher likelihood of success?', a: [
        'ASD emphasises **self-organising teams**, **interpersonal collaboration** and **individual and team learning**. Shared responsibility, trust, short speculate–collaborate–learn cycles, focus groups, technical reviews and postmortems mean problems are detected early and the plan adapts, so teams are more likely to succeed.',
      ] },
      { id: 's2-scrum', from: 'se-scrum-significance', q: 'What is the significance of Scrum?', a: [
        { ul: ['Work in short **sprints** keeps the team focused on a small, fixed goal and delivers working increments frequently.', 'The **daily 15-minute scrum** exposes progress and obstacles every day.', 'Changes go into the **prioritised backlog**, not into the current sprint.', 'The customer sees a **demo** after every sprint and steers the product.'] },
      ] },
      { id: 's2-dsdm', from: 'se-dsdm', q: 'What is DSDM?', a: [
        'The **Dynamic Systems Development Method** is an agile approach that provides a framework for building systems that meet **tight time constraints** through **incremental prototyping** in a controlled environment. It follows the **Pareto principle**: 80% of an application can be delivered in 20% of the time. Life cycle: feasibility study, business study, functional model iteration, design and build iteration, implementation.',
      ] },
      { id: 's2-re-phases', from: 'se-re-phases', q: 'Mention the main phases of the requirements engineering process.', a: [
        { flow: ['Inception', 'Elicitation', 'Elaboration', 'Negotiation', 'Specification', 'Validation', 'Requirements management'] },
      ] },
      { id: 's2-func', from: 'se-func-nonfunc', q: 'Define functional and non-functional requirements.', a: [
        '**Functional requirements**: statements of the **services the system must provide**, how it reacts to inputs and behaves in situations (e.g. "the user shall be able to book a ticket").',
        '**Non-functional requirements**: **constraints and qualities** of the system as a whole: performance, security, reliability, usability, portability (e.g. "booking shall complete in under 3 seconds").',
      ] },
      { id: 's2-nfr-issues', from: 'se-nfr-issues', q: 'Identify the non-functional requirement issues considered for any problem.', a: [
        { ul: ['**Performance**: response time, throughput, capacity.', '**Security**: authentication, authorisation, data protection.', '**Reliability and availability**: uptime, MTTF, recovery.', '**Usability**: ease of learning and use, accessibility.', '**Maintainability and portability**; **scalability**; legal and standards constraints.'] },
      ] },
      { id: 's2-validation-error', from: 'se-validation-error', q: 'What happens when requirement validation uncovers an error? Who corrects it?', a: [
        'The error is **recorded** (in the review issues list) and the requirement is sent back for correction. The **requirements engineer/analyst**, together with the **stakeholder who owns the requirement** (customer or user), corrects it; the change is controlled under **requirements management** (traceability updated), and the corrected part is **re-reviewed**.',
      ] },
      { id: 's2-spike', from: 'se-xp-spike', q: 'What is a spike solution in XP? Define refactoring and pair programming.', a: [
        { ul: ['**Spike solution**: an immediate operational **prototype of a difficult design problem**, built to lower risk and validate estimates.', '**Refactoring**: changing the internal structure of code to improve its design **without changing its external behaviour**.', '**Pair programming**: two programmers work together at **one workstation**; one codes, the other reviews in real time.'] },
      ] },
      { id: 's2-iterative', from: 'se-iterative-change', q: 'Why does an iterative process make change easier to manage? Is every agile process iterative?', a: [
        'In an iterative process each iteration is small, so a change affects only the **next iteration**, is incorporated through the re-prioritised backlog or plan, and is verified quickly with tests; nothing large has been built on wrong assumptions.',
        '**Yes**: every agile process is iterative and incremental, because it delivers working software in short cycles and adapts to feedback.',
      ] },
      { id: 's2-user-system', from: 'se-user-vs-system', q: 'Why distinguish user requirements from system requirements?', a: [
        '**User requirements** are high-level statements in natural language and diagrams for customers and managers; **system requirements** are detailed, technical specifications for developers. Keeping them separate lets each audience **understand and agree to** the part that concerns them, and avoids confusing users with technical detail or leaving developers with vague statements.',
      ] },
      { id: 's2-good-srs', from: 'se-good-srs', q: 'What are the desirable characteristics of a good SRS?', a: [
        { ul: ['**Correct**, **complete**, **unambiguous**, **consistent**', '**Verifiable**, **ranked** for importance/stability', '**Modifiable**, **traceable**'] },
      ] },
      { id: 's2-qfd', q: 'What is QFD? Name its three types of requirements.', a: [
        '**Quality Function Deployment** is a technique that **translates customer needs into technical requirements**, maximising customer satisfaction.',
        'Types: **normal** (stated objectives), **expected** (implicit, e.g. ease of installation) and **exciting** (beyond expectations, delight the customer).',
      ] },
      { id: 's2-story', q: 'What is a user story? What is project velocity?', a: [
        '**User story**: a short description, written by the customer on an index card, of a feature the software must provide, with a value (priority) assigned by the customer and a cost estimated by the team.',
        '**Project velocity**: the number of user stories (or story points) implemented in the previous release; used to estimate delivery dates and plan later releases.',
      ] },
    ],
  },
  {
    unit: 'III',
    items: [
      { id: 's3-effort', from: 'se-mid-effort-define', q: 'Define effort estimation.', a: [
        '**Effort estimation** is the process of predicting the most realistic amount of **effort (in person-hours or person-months)** required to develop or maintain software, from incomplete and uncertain information. It is usually derived from the estimated **size** (LOC or FP) using historical productivity or an empirical model (COCOMO), and it drives the schedule, staffing and cost.',
      ] },
      { id: 's3-decomposition', from: 'se-mid-decomposition-list', q: 'List the decomposition techniques used in software estimation.', a: [
        { ol: ['**Software sizing** (fuzzy-logic, function point, standard component, change sizing)', '**Problem-based estimation** using **LOC**', '**Problem-based estimation** using **FP**', '**Process-based estimation** (effort per framework activity per function)', '**Use-case–based estimation**'] },
      ] },
      { id: 's3-effort-role', from: 'se-effort-role', q: 'What is the role of effort estimation and why do it early?', a: [
        'Effort estimation provides the basis for the **budget, schedule, staffing and bidding**; it lets managers judge feasibility and commit to delivery dates. It is done **early** so that the project can be approved, planned and resourced, and so that risks of over-commitment are seen before work starts; it is then **refined** as more is known.',
      ] },
      { id: 's3-loc-role', from: 'se-loc-role', q: 'What is the role of LOC in project size estimation?', a: [
        '**LOC (lines of code)** is a **direct size measure**: the estimated LOC of each function is summed and divided by historical productivity (LOC/PM) to give effort, and multiplied by cost per LOC to give cost. It is also the input to COCOMO (KLOC) and the base of size-oriented metrics (errors/KLOC). Limitation: it depends on the language and is hard to estimate early.',
      ] },
      { id: 's3-problem-based', from: 'se-problem-based', q: 'What is problem-based estimation?', a: [
        'An estimation approach in which the software scope is **decomposed into problem functions**; LOC or FP is estimated for each (three-point: S = (s_opt + 4 s_m + s_pess) / 6), the sizes are summed and converted to effort and cost using **historical productivity** data.',
      ] },
      { id: 's3-milestones', from: 'se-milestones', q: 'Differentiate an activity and a milestone. Give three milestones for building a house.', a: [
        '**Activity**: work that consumes time and resources (e.g. laying bricks). **Milestone**: a **zero-duration checkpoint** marking the completion of a significant deliverable, verified by review.',
        'House milestones: foundation completed and inspected; roof completed; house handed over to the owner.',
      ] },
      { id: 's3-cocomo', from: 'se-cocomo-what', q: 'What is the COCOMO model? Name its modes.', a: [
        '**COCOMO** (Boehm) is an empirical estimation model that computes effort and time from size: **E = a × (KLOC)ᵇ PM**, **D = c × Eᵈ months**.',
        'Modes: **organic** (small, familiar; a = 2.4, b = 1.05), **semi-detached** (medium, mixed; 3.0, 1.12), **embedded** (tight constraints; 3.6, 1.20).',
      ] },
      { id: 's3-fp', from: 'se-fp-define', q: 'Define function points.', a: [
        'A **function point** is a measure of the **functionality delivered to the user**, computed from the information domain: external inputs, external outputs, external inquiries, internal logical files and external interface files (weighted by complexity), adjusted by 14 value-adjustment factors: **FP = UFP × [0.65 + 0.01 × ΣFi]**. It is language-independent.',
      ] },
      { id: 's3-risk-chars', from: 'se-risk-characteristics', q: 'Mention the two characteristics of risks.', a: [
        { ul: ['**Uncertainty**: the risk may or may not happen (there are no 100% probable risks).', '**Loss**: if the risk becomes a reality, unwanted consequences or losses occur.'] },
      ] },
      { id: 's3-checklist', from: 'se-risk-checklist', q: 'How is a risk item checklist used for risk identification?', a: [
        'A **risk item checklist** lists questions about known and predictable risks in categories: **product size, business impact, stakeholder characteristics, process definition, development environment, technology to be built, staff size and experience**. Answering the questions for the project reveals which generic and product-specific risks apply.',
      ] },
      { id: 's3-reactive', from: 'se-risk-reactive-proactive', q: 'Differentiate reactive and proactive risk strategies.', a: [
        { table: { head: ['Reactive', 'Proactive'], rows: [['Act only when a risk becomes a problem ("fire-fighting")', 'Identify and assess risks before work begins'], ['Resources spent on crisis management', 'Plans to avoid risks and contingency plans ready'], ['Often too late and costly', 'Fewer surprises; higher chance of success']] } },
      ] },
      { id: 's3-pm', q: 'What is a person-month?', a: [
        'A **person-month (PM)** is the amount of work done by **one person in one month**; it is the unit of effort. E.g. 24 PM may be 4 people for 6 months, though people and months are not freely interchangeable (Brooks\'s law).',
      ] },
      { id: 's3-re', q: 'What is risk exposure? Give an example.', a: [
        '**Risk exposure RE = P × C**, where P is the probability of the risk occurring and C is the cost to the project if it does.',
        'Example: P = 0.8 that only 60% of reusable components can be used; cost of building the rest = $25,200 → RE = 0.8 × 25,200 = **$20,160**.',
      ] },
      { id: 's3-three-point', q: 'Write the three-point (expected value) estimate formula.', a: [
        { formula: 'S = (s_opt + 4 × s_m + s_pess) / 6' },
        'Example: s_opt = 4600, s_m = 6900, s_pess = 8600 LOC → S = (4600 + 27,600 + 8600) / 6 = **6800 LOC**.',
      ] },
      { id: 's3-rmmm', q: 'What is RMMM?', a: [
        '**Risk Mitigation, Monitoring and Management**: the plan for each significant risk: **mitigation** (steps to avoid it), **monitoring** (indicators tracked to see whether it is becoming likely) and **management/contingency** (actions if it occurs). It is recorded in the RMMM plan or risk information sheets.',
      ] },
    ],
  },
  {
    unit: 'IV',
    items: [
      { id: 's4-incremental', from: 'se-mid-incremental-code', q: 'Explain how incremental code development helps in software development.', a: [
        'In **incremental development of code**, a small part is written and tested, and only then is the next part added, re-running all tests each time. It helps by:',
        { ul: ['**Early defect detection**: a failure is almost always in the code just added, so bugs are found and fixed quickly.', '**Always a working version**: progress is real and visible.', '**Regression safety**: accumulated tests are re-run, so new code does not break old code.'] },
      ] },
      { id: 's4-defect-density', from: 'se-num-defect-density', q: 'A 0.350 KLOC module had 9 minor and 5 major defects at inspection. Compute the defect density.', a: [
        { formula: 'Defect density = defects ÷ size (KLOC) = (9 + 5) ÷ 0.350 = 14 ÷ 0.35 = 40 defects/KLOC' },
      ] },
      { id: 's4-ocp', from: 'se-ocp', q: 'State the Open-Closed Principle.', a: [
        '**OCP**: "A module (component) should be **open for extension but closed for modification**." New behaviour is added by extending the component (e.g. a new class implementing an existing interface), without changing its tested internal code. Example: a Sensor interface lets new sensor types be added without editing the controller.',
      ] },
      { id: 's4-good-design', from: 'se-good-design', q: 'What are the characteristics of a good design?', a: [
        { ul: ['Implements **all explicit requirements** and accommodates implicit ones.', '**Readable and understandable** guide for coders and testers.', 'Gives a **complete picture** of data, functional and behavioural domains.', '**Modular**, with high cohesion and low coupling; uses recognisable patterns.'] },
      ] },
      { id: 's4-data-centred', from: 'se-data-centred', q: 'What is a data-centred architecture?', a: [
        'An architecture in which a **central data store (repository or blackboard)** is accessed frequently by other components that add, update or delete data; client components work **independently** and can be added or changed without affecting others. Example: a library database accessed by issue, return and search modules.',
      ] },
      { id: 's4-structured', from: 'se-structured-design', q: 'State the principles of structured design methodology.', a: [
        { ul: ['**Top-down functional decomposition** (stepwise refinement).', '**Modularity**: each function becomes a module.', '**High cohesion and low coupling** (functional independence).', '**Information hiding**; hierarchy of modules shown in **structure charts**, derived from DFDs by transform/transaction analysis.'] },
      ] },
      { id: 's4-cohesion', q: 'Define cohesion. Which is the best and the worst type?', a: [
        '**Cohesion** is a measure of the **functional strength of a module**: how closely the elements inside it are related. **Best: functional cohesion** (all elements contribute to a single task). **Worst: coincidental cohesion** (no meaningful relationship).',
      ] },
      { id: 's4-coupling', q: 'Define coupling. Which is the best and the worst type?', a: [
        '**Coupling** is a measure of the **interdependence among modules**. **Best: data coupling** (only simple data parameters passed) or no direct coupling. **Worst: content coupling** (one module modifies or jumps into another\'s internals).',
      ] },
      { id: 's4-context', q: 'What is a context diagram?', a: [
        'A **context diagram (level-0 DFD)** represents the **entire system as a single process (bubble)** with its **external entities** and the data flows between them and the system; it defines the system boundary and is refined into level-1 and lower DFDs.',
      ] },
      { id: 's4-balancing', q: 'What is DFD balancing?', a: [
        '**Balancing** means that the **inputs and outputs of a parent process must be the same as the net inputs and outputs of its child (refined) diagram**. It keeps the levels of a DFD consistent as processes are decomposed.',
      ] },
      { id: 's4-architecture', q: 'Define software architecture.', a: [
        '"The **structure or structures of the system**, which comprise **software components**, the **externally visible properties** of those components, and the **relationships** among them" (Bass, Clements, Kazman). It captures early design decisions and lets stakeholders analyse and communicate the design.',
      ] },
      { id: 's4-style', q: 'What is an architectural style? Name any four.', a: [
        'An **architectural style** is a pattern for an entire system described by components, connectors, constraints and semantic models.',
        'Examples: **data-centred**, **data-flow (pipes and filters)**, **call-and-return**, **object-oriented**, **layered**.',
      ] },
      { id: 's4-info-hiding', q: 'What is information hiding?', a: [
        'A design principle (Parnas) that modules should be specified so that **information (algorithms and data) inside a module is inaccessible to other modules** that do not need it; modules communicate only through their interfaces. It limits the effects of change and errors.',
      ] },
      { id: 's4-standards', q: 'Differentiate coding standards and coding guidelines.', a: [
        '**Coding standards** are **mandatory rules** a project must follow (naming conventions, header comments, no global variables, error handling), often enforced by tools and reviews. **Coding guidelines** are **recommendations** that improve readability and quality (keep functions short, avoid deep nesting, comment why not what) and are applied with judgement.',
      ] },
      { id: 's4-inspection', q: 'What is code inspection?', a: [
        'A **formal review of source code by a team** (moderator, author, reader, recorder, inspectors) following a defined process (planning, preparation, meeting, rework, follow-up) and a checklist, to **find defects before testing**; defects are recorded, not fixed, in the meeting.',
      ] },
    ],
  },
  {
    unit: 'V',
    items: [
      { id: 's5-rollback', from: 'se-mid-rollback', q: 'What is deployment rollback?', a: [
        '**Deployment rollback** is **reverting a newly deployed release to the previous known-good version** (code, configuration and data if needed) when the new release causes failures, so service is restored quickly while the problem is fixed.',
        'It needs pre-defined triggers (error spikes, failed health checks), the previous build and database backups kept ready, and a method such as redeploying the old build, a **blue-green** switch or turning off a feature flag.',
      ] },
      { id: 's5-wb-bb', from: 'se-wb-vs-bb', q: 'Differentiate white-box and black-box testing.', a: [
        { table: { head: ['White-box', 'Black-box'], rows: [['Based on the internal code structure', 'Based on requirements/specification'], ['Knowledge of code needed; done by developers', 'No code knowledge; done by testers/users'], ['Basis path, condition, loop, data-flow testing', 'Equivalence partitioning, BVA, graph-based'], ['Finds logic errors, unreachable code', 'Finds missing functions, interface errors']] } },
      ] },
      { id: 's5-unit', from: 'se-unit-testing', q: 'What is unit testing? Is it always possible?', a: [
        '**Unit testing** verifies the **smallest unit of design (a component or module)** in isolation: its interface, local data structures, boundary conditions, independent paths and error-handling paths.',
        'It is **not always directly possible**, because a module may call or be called by modules that do not exist yet; **drivers** (dummy callers) and **stubs** (dummy called modules) must be written to test it.',
      ] },
      { id: 's5-error', from: 'se-error-defect', q: 'Differentiate error, defect and failure.', a: [
        { ul: ['**Error (mistake)**: a human action that produces an incorrect result (e.g. typing > instead of >=).', '**Defect (fault, bug)**: the flaw in the code or document caused by the error.', '**Failure**: the observable deviation of the system from its expected behaviour when a defect is executed.'] },
      ] },
      { id: 's5-alpha-beta', from: 'se-alpha-beta', q: 'Differentiate alpha and beta testing.', a: [
        { table: { head: ['Alpha testing', 'Beta testing'], rows: [['At the **developer\'s site**', 'At **end users\' sites**'], ['By representative users, with developers present', 'By real users, without developers'], ['Controlled environment', 'Real, uncontrolled environment'], ['Before beta', 'Before final release']] } },
      ] },
      { id: 's5-vv', from: 'se-v-and-v', q: 'Differentiate verification and validation.', a: [
        { table: { head: ['Verification', 'Validation'], rows: [['"Are we building the product **right**?"', '"Are we building the **right product**?"'], ['Checks the software against its specification/design', 'Checks the software against customer needs'], ['Reviews, inspections, unit tests', 'Acceptance, alpha and beta testing']] } },
      ] },
      { id: 's5-informal-ftr', from: 'se-informal-vs-ftr', q: 'Differentiate informal reviews and formal technical reviews.', a: [
        { table: { head: ['Informal review', 'FTR'], rows: [['Desk check, casual meeting, pair programming', 'Planned meeting with an agenda'], ['No defined roles or preparation', 'Review leader, recorder, producer, prepared reviewers'], ['No records', 'Issues list and summary report; accept/reject decision'], ['Quick, less effective', 'Systematic, more effective']] } },
      ] },
      { id: 's5-presence', from: 'se-presence-errors', q: '"Testing can show the presence of errors, not their absence." Justify briefly.', a: [
        'A failing test proves that a defect **exists**, but passing tests only show that the **inputs tried** worked. Exhaustive testing of all inputs and paths is impossible (even a small loop can have more than 10¹⁴ paths), so untested combinations may still fail; hence testing can never prove that software is error-free (Dijkstra).',
      ] },
      { id: 's5-cc', q: 'What is cyclomatic complexity? Give its formulas.', a: [
        '**Cyclomatic complexity V(G)** is a software metric that gives the **number of independent paths** in a program\'s flow graph, i.e. the upper bound on the number of tests for full branch coverage.',
        { formula: 'V(G) = E − N + 2 = P + 1 = number of regions' },
      ] },
      { id: 's5-bva', q: 'What is boundary value analysis?', a: [
        'A black-box technique that selects test cases **at the edges of input ranges**, because errors cluster at boundaries. For a range a..b, test **a − 1, a, a + 1, b − 1, b, b + 1**. Example: age 18–60 → 17, 18, 19, 59, 60, 61.',
      ] },
      { id: 's5-regression', q: 'What is regression testing?', a: [
        '**Regression testing** is the **re-execution of a subset of tests already conducted** to ensure that changes (new modules, bug fixes) have not introduced unintended side effects in previously working functions. It is done after every integration step and fix, and is ideal for automation.',
      ] },
      { id: 's5-stub-driver', q: 'What are stubs and drivers?', a: [
        '**Driver**: a dummy "main program" that accepts test data, passes it to the component under test and prints results. **Stub**: a dummy subprogram that **replaces a module called** by the component under test, doing minimal processing and returning control. Top-down integration uses stubs; bottom-up uses drivers.',
      ] },
      { id: 's5-smoke', q: 'What is smoke testing?', a: [
        'An integration-testing approach for products built daily: the software is **built and tested every day** with a set of tests designed to expose **show-stopper errors** that would keep the build from functioning properly, so integration risk is minimised and problems are found early.',
      ] },
      { id: 's5-furps', q: 'Expand FURPS.', a: [
        'Hewlett-Packard\'s quality attributes: **F**unctionality, **U**sability, **R**eliability, **P**erformance, **S**upportability (extensibility, adaptability, serviceability, testability, configurability).',
      ] },
      { id: 's5-coq', q: 'What is the cost of quality?', a: [
        'The **total cost of achieving and of not achieving quality**: **prevention costs** (planning, training, process reviews), **appraisal costs** (inspections, testing) and **failure costs**: internal (rework before release) and external (complaints, support, returns after release), external failure being the most expensive.',
      ] },
      { id: 's5-system', q: 'Name the types of system testing.', a: [
        { ul: ['**Recovery testing**: forces failure and checks recovery.', '**Security testing**: checks protection against improper access.', '**Stress testing**: abnormal quantity, frequency or volume.', '**Performance testing**: run-time performance in the integrated system.', '**Deployment (configuration) testing**: works on each target platform.'] },
      ] },
    ],
  },
]
