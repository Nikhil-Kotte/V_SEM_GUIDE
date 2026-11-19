// Model answers for the SE class-test (mid-term) questions, written for the marks given.
// The FP and effort numericals were computed and checked by hand. The 2-mark class-test questions
// take their answers from bank-2m.js.
const N = 'SE unit notes'
const PR = "Pressman, Software Engineering: A Practitioner's Approach"
const MID = 'SE class tests (PYQs/SE MIDS.pdf)'

export default {
  'se-mid-campedu': {
    blocks: [
      'CampEdu has two problems: **unclear requirements** and **technical risks**. Prototyping attacks the first; the spiral model attacks both.',
      { h: 'Prototyping model' },
      { img: 'se-prototyping' },
      { ul: ['Developers and users **communicate** the general objectives of CampEdu (student portal, course registration, timetables).', 'A **quick design** of the visible parts (screens, input forms, outputs) leads to a **prototype**.', 'Students and staff **use the prototype and give feedback**; missing or wrong requirements surface early.', 'The cycle repeats until the requirements are clear; the prototype is then usually thrown away and the real system built properly.', 'A prototype can also test a risky technical choice (e.g. integration with the existing student database).'] },
      { h: 'Spiral model' },
      { img: 'se-spiral' },
      { ul: ['Each loop goes through communication, **planning with risk analysis**, modelling, construction and deployment.', 'The team **identifies the technical risks** (performance, integration, security), evaluates them, and resolves them with prototypes or simulations before committing.', 'Requirements are refined loop by loop with customer evaluation at the end of each circuit; early loops give a concept and prototypes, later loops the full product.', 'If a risk is too high, the project can change direction at an anchor-point milestone.'] },
      { table: { head: ['Concern', 'Prototyping', 'Spiral'], rows: [['Unclear requirements', 'Clarified through user feedback on the prototype', 'Refined in each circuit with customer evaluation'], ['Technical risks', 'Only partly (a prototype can test a risky choice)', 'Explicit risk analysis in every loop'], ['Best use for CampEdu', 'Settle the requirements', 'Manage risk across the whole life cycle']] } },
      'Conclusion: use prototyping (inside the early spiral loops) to fix the requirements, and the spiral model to control the technical risks.',
    ],
    sources: [`${N} (Unit 1)`, `${PR} §2.3.3`, MID],
  },

  'se-mid-waterfall-exam': {
    blocks: [
      'The **waterfall model** performs the framework activities **once, in sequence**. It suits the Online Examination Management System because the **requirements are clearly defined and stable**, the technology (web application with a database) is well understood, and the scope is fixed.',
      { img: 'se-waterfall' },
      { table: { head: ['Phase', 'Applied to the Online Examination Management System'], rows: [
        ['**Communication**', 'Project initiation; meet the examination branch, faculty and students; gather requirements: student registration and login, question-bank management, exam scheduling, timed online tests, automatic evaluation, result publication, reports; output the **SRS**'],
        ['**Planning**', 'Estimate size, effort and cost; schedule the phases (e.g. 4 months); allocate the team; identify risks (heavy load during exams, cheating, data loss) and plan backups; plan testing'],
        ['**Modelling**', 'Analysis: use cases (student takes exam, faculty sets paper), DFDs, ER diagram (Student, Exam, Question, Answer, Result). Design: architecture (web client, application server, database), module design, UI screens, security design'],
        ['**Construction**', 'Code the modules (user management, question bank, exam engine with timer, evaluation, results and reports); unit testing, integration testing, system testing (load test with many students at once)'],
        ['**Deployment**', 'Install on college servers, train staff, run a pilot exam, collect feedback; then support and maintenance'],
      ] } },
      'Advantages here: clear milestones and documents for the college, easy management, predictable cost. The limitation (a working system only at the end) is acceptable because requirements will not change much.',
    ],
    sources: [`${N} (Unit 1)`, `${PR} §2.3.1`, MID],
  },

  'se-mid-generic-three': {
    blocks: [
      'The **generic process model** has five framework activities applicable to all projects, wrapped by umbrella activities:',
      { img: 'se-process-framework' },
      { ol: ['**Communication**: before technical work starts, the team **communicates and collaborates with the customer** and other stakeholders to understand their objectives and **gather requirements** that define software features and functions. Work products: requirements, use cases.', '**Planning**: creates a "map", the **software project plan**, that defines the technical tasks, the **risks** likely to occur, the **resources** required, the **work products** and a **work schedule**.', '**Modelling**: the engineer creates **models** (analysis/requirements models and design models: architecture, data, interface, components) so that developers and the customer better understand the requirements and the design that will achieve them.'] },
      'The other two: **construction** (code generation and testing) and **deployment** (delivery, customer evaluation, feedback). Umbrella activities such as project tracking, risk management and SQA run throughout.',
    ],
    sources: [`${N} (Unit 1)`, `${PR} §1.4`, MID],
  },

  'se-mid-specialized-choice': {
    blocks: [
      'The three specialized process models are component-based development (CBD), formal methods and aspect-oriented software development (AOSD). The most suitable here is **component-based development**.',
      { img: 'se-cbd' },
      { h: 'Justification' },
      { table: { head: ['Project need', 'How CBD meets it'], rows: [
        ['**Short time**', 'The application is assembled from **pre-built, tested COTS components** (login, payments, reporting, CRM); reuse greatly reduces development cycle time and cost'],
        ['**Active user involvement**', 'CBD is **evolutionary and iterative** (like the spiral model): after each iteration users see working functionality and give feedback'],
        ['**Frequently changing requirements**', 'In a component-based architecture, components can be **replaced, added or reconfigured** without redesigning the whole system'],
      ] } },
      { ul: ['**Formal methods** are unsuitable: mathematical specification is slow and expensive, needs special training, and is hard to use for communicating with business users.', '**AOSD** addresses crosscutting concerns (security, logging), not speed or changing business features.'] },
      'Note: if RAD is argued for, it is also built on component reuse; CBD is the specialized model that fits.',
    ],
    sources: [`${N} (Unit 1)`, `${PR} §2.4`, MID],
  },

  'se-mid-agile-choice': {
    blocks: [
      '**Scrum** is the most suitable agile model for delivering software in short iterations with continuous customer feedback.',
      { img: 'se-scrum' },
      { ul: ['**Short iterations**: work is organised into **sprints**, time-boxed iterations of 2–4 weeks (≤ 30 days), each producing a potentially shippable increment.', '**Continuous customer feedback**: each sprint ends with a **demo (sprint review)** to the customer; the feedback goes into the **product backlog**, which the **product owner** (the customer\'s representative) re-prioritises before the next sprint.', '**Visibility**: the **daily 15-minute scrum** exposes progress and obstacles every day; the Scrum master removes impediments.', '**Stable work, flexible plan**: changes are not introduced during a sprint (stable environment) but are accepted into the backlog for the next one.'] },
      'XP would also work (short releases, on-site customer, acceptance tests), but Scrum gives the explicit framework (backlog, sprints, reviews) for managing iterations and feedback.',
    ],
    sources: [`${N} (Unit 2)`, `${PR} §3.5.2`, MID],
  },

  'se-mid-feedback-re': {
    blocks: [
      '**Requirements engineering** for the Online Student Feedback System: inception → **elicitation** → elaboration → **negotiation** → specification → **validation** → management.',
      { img: 'se-req-tasks' },
      { h: '1. Eliciting the requirements' },
      { ul: ['Identify stakeholders: **students, faculty, HODs, IQAC/administration, IT staff**.', 'Hold **collaborative requirements-gathering** meetings with a facilitator and an agenda; **interview** faculty and admin; send a **questionnaire** to students; study existing paper feedback forms.', 'Write **usage scenarios**: "a student logs in, sees the courses pending feedback, rates each on a 1–5 scale with optional comments, and submits anonymously".', 'Apply **QFD**: normal (online forms, course-wise reports), expected (anonymity, mobile-friendly, one response per course), exciting (charts and comment summaries for faculty).'] },
      { h: '2. Negotiating the requirements' },
      { ul: ['Use Boehm\'s **win-win** approach: identify key stakeholders, their win conditions, and reconcile them.', 'Students want **full anonymity**; admin wants to **prevent duplicate or fake entries** → authenticated login, but responses stored without identity.', 'Faculty want raw comments; students want privacy → show aggregated scores and moderated comments.', 'Prioritise within budget and the semester deadline: must-have (forms, anonymity, reports) vs could-have (analytics).'] },
      { h: '3. Validating the requirements' },
      { ul: ['Conduct a **formal technical review** of the SRS with representatives of every stakeholder group.', 'Check each requirement is **consistent, unambiguous** ("anonymous" defined exactly), **complete, feasible and testable**, and that none conflict.', 'Show a **prototype** feedback form to students; derive **test cases** from requirements; record errors and revise the SRS under requirements management.'] },
    ],
    sources: [`${N} (Unit 2)`, `${PR} §5.1–5.7`, MID],
  },

  'se-mid-size-effort': {
    blocks: [
      '**Size** (in LOC or function points) is the **primary driver of effort**: a larger product needs more work. So estimation first estimates size and then converts it into effort.',
      { steps: ['**Decompose** the software into functions (problem-based estimation).', 'Estimate the size of each function, using **three-point estimates**: S = (s_opt + 4 s_m + s_pess) / 6; sum them.', 'Convert size to effort with **historical productivity**: Effort = Size ÷ productivity (e.g. 33,200 LOC ÷ 620 LOC/PM = 53.5 PM), or with an **empirical model** such as COCOMO: E = a × KLOCᵇ.', 'Derive **schedule** (D = c × Eᵈ), **staff** (E ÷ D) and **cost** (E × labour rate).'] },
      { ul: ['Size can be estimated early (FP from requirements) and compared with past projects of similar size.', 'Size-based models make estimates objective and repeatable.', 'Accuracy of effort depends directly on the accuracy of the size estimate, so sizing is refined as the project progresses.'] },
    ],
    sources: [`${N} (Unit 3)`, `${PR} §26.6`, MID],
  },

  'se-num-600ph': {
    blocks: [
      { formula: 'Effort per day = 3 developers × 8 hours = 24 person-hours/day' },
      { formula: 'Development time = 600 person-hours ÷ 24 person-hours/day = 25 working days' },
      'Approximate development time = **25 working days** (about 5 weeks with a 5-day week).',
      { h: 'One limitation' },
      'The estimate assumes **effort divides linearly among people** and that all three developers are fully and equally productive for all 8 hours. In reality there is **communication and coordination overhead**, tasks have **dependencies** that cannot be done in parallel, and productivity varies (meetings, leave, rework), so the real duration is usually longer (Brooks\'s law: people and months are not interchangeable).',
    ],
    sources: [`${N} (Unit 3)`, MID],
  },

  'se-num-fp-ct2': {
    blocks: [
      { h: '1. Unadjusted Function Points (UFP)' },
      { table: { head: ['Component', 'Count', 'Complexity', 'Weight', 'Count × weight'], rows: [['External Inputs (EI)', '10', 'Average', '4', '40'], ['External Outputs (EO)', '6', 'High', '7', '42'], ['External Inquiries (EQ)', '5', 'Average', '4', '20'], ['Internal Logical Files (ILF)', '4', 'High', '15', '60'], ['External Interface Files (EIF)', '3', 'Low', '5', '15'], ['**Total UFP**', '', '', '', '**177**']] } },
      { h: '2. Value Adjustment Factor (VAF)' },
      { formula: 'VAF = 0.65 + 0.01 × ΣFi = 0.65 + 0.01 × 35 = 0.65 + 0.35 = 1.00' },
      { h: '3. Adjusted Function Points (FP)' },
      { formula: 'FP = UFP × VAF = 177 × 1.00 = 177' },
      'Result: **UFP = 177, VAF = 1.00, FP = 177**. (Standard weights, low/average/high: EI 3/4/6, EO 4/5/7, EQ 3/4/6, ILF 7/10/15, EIF 5/7/10.)',
    ],
    sources: [`${N} (Unit 3)`, `${PR} §23.2.1`, MID, 'Checked with the FP calculator'],
  },

  'se-mid-design-concepts': {
    blocks: [
      'Design is the **blueprint** from which the system is built. These fundamental design concepts make a system scalable (able to grow in features, users and load):',
      { table: { head: ['Concept', 'Meaning', 'How it helps scalability'], rows: [
        ['**Abstraction**', 'Procedural and data abstractions hide detail at each level', 'Parts can be understood and extended independently'],
        ['**Modularity**', 'Software divided into separately named, addressable modules', 'Modules (or services) can be developed, deployed and scaled separately'],
        ['**Information hiding**', 'A module\'s internals are hidden behind its interface', 'Implementations (e.g. a faster database) can change without affecting others'],
        ['**Functional independence**', 'High cohesion and low coupling', 'Changes and new features stay local; less ripple effect'],
        ['**Separation of concerns**', 'Split a problem into independently solvable pieces', 'Teams work in parallel; layers/services scale independently'],
        ['**Architecture and patterns**', 'Overall structure; proven solutions (layered, MVC, client–server)', 'Proven structures that handle growth'],
        ['**Refinement and refactoring**', 'Top-down elaboration; restructuring without changing behaviour', 'Keeps the design clean as the system grows'],
      ] } },
      'Example: an e-commerce site split into catalogue, cart, order and payment modules with clear interfaces can add servers only for the busy order module during a sale.',
    ],
    sources: [`${N} (Unit 4)`, `${PR} §8.3`, MID],
  },

  'se-mid-risk-importance': {
    blocks: [
      'A **risk** is a potential problem that may or may not occur (uncertainty) and causes loss if it does. **Risk management** identifies, analyses and controls risks before they become problems.',
      { h: 'Importance' },
      { ul: ['Software projects face many uncertainties (changing requirements, new technology, staff turnover, tight budgets).', '**Proactive** handling avoids crises: problems are cheaper to prevent than to fix.', 'Realistic estimates and schedules include contingency for known risks.', 'Technical risks are reduced early, protecting quality.', 'Stakeholders are informed, improving decisions.', 'Raises the chance of finishing on time, within budget and with the required quality.'] },
      { img: 'se-risk' },
      { h: 'Activities' },
      { ol: ['**Risk identification**: list project, technical and business risks using a risk-item checklist (product size, business impact, customer, process, technology, staff).', '**Risk analysis (projection)**: estimate the probability and impact of each risk.', '**Risk prioritisation**: build a risk table sorted by probability and impact; compute **risk exposure RE = P × C**; draw a cut-off line.', '**Risk planning (RMMM)**: mitigation (avoid), monitoring (watch indicators), management/contingency (act if it happens).', '**Risk monitoring and control**: track risks and plan effectiveness throughout.', '**Risk resolution**: execute contingency plans; record lessons.'] },
      { example: 'Risk: high staff turnover (P = 0.7, high impact). Mitigation: document work, pair people, assign backups. Monitoring: team morale, job market. Management: backups take over; adjust schedule.' },
    ],
    sources: [`${N} (Unit 3)`, `${PR} ch. 28`, MID],
  },

  'se-mid-coupling-cohesion': {
    blocks: [
      '**Cohesion** is the functional strength of a module: how closely its elements belong together (want **high**). **Coupling** is the interdependence between modules (want **low**). Together they give **functional independence**, the key to maintainable software.',
      { h: 'Role of cohesion' },
      { ul: ['A highly cohesive (functional) module does **one task**, so it is easy to **understand, test and debug**.', 'Changes to that task are made in **one place**.', 'Cohesive modules are easy to **reuse**. Scale: functional > sequential > communicational > procedural > temporal > logical > coincidental.'] },
      { img: 'se-cohesion-types' },
      { h: 'Role of coupling' },
      { ul: ['With low (data) coupling, a change in one module has few **ripple effects** on others.', 'Errors do not propagate easily; modules can be **replaced or reused** independently.', 'Avoid common (global data) and content coupling. Scale: data < stamp < control < external < common < content.'] },
      { img: 'se-coupling-types' },
      'Conclusion: design for **high cohesion and low coupling** so that the system is easy to understand, change, test and extend, which is what maintainability means.',
    ],
    sources: [`${N} (Unit 4)`, `${PR} §8.3.6`, MID],
  },

  'se-mid-dfd-library': {
    blocks: [
      { h: 'Context-level (level-0) DFD' },
      { img: 'se-dfd-l0-library' },
      'The whole Library Management System is **one process** exchanging data with the external entities: **Member/Student** (membership details, book request, returned book → issue slip, due-date reminder, fine receipt) and **Librarian** (new books, member updates → reports).',
      { h: 'Level-1 DFD' },
      { img: 'se-dfd-l1' },
      { ul: ['Processes: **1.0 Issue book**, **2.0 Return book (compute fine)**, and further processes such as **3.0 Manage members**, **4.0 Maintain catalogue / search books**, **5.0 Generate reports**.', 'Data stores: **D1 Members**, **D2 Books (catalogue)**, **D3 Transactions (issue/return)**.', 'Flows: book request → 1.0 checks D1 and D2, records the issue in D3, sends the issue slip; returned book → 2.0 updates D2 and D3, calculates any fine; reports read D3 and go to the librarian.', 'The level-1 diagram is **balanced** with the context diagram: the same external inputs and outputs.'] },
      { h: 'How it represents function-oriented modelling' },
      'Function-oriented modelling views the system as **functions that transform data**. The DFD shows exactly that: the context diagram is **decomposed top-down** into level-1 (and level-2) processes, each a function; the data stores and flows define what each function consumes and produces. Each process later becomes a module in the **structure chart** (transform/transaction analysis).',
    ],
    sources: [`${N} (Unit 4)`, `${PR} §7.2 (flow-oriented modelling)`, MID],
  },

  'se-mid-architecture': {
    blocks: [
      '**Software architecture** is "the structure or structures of the system, which comprise software components, the externally visible properties of those components, and the relationships among them" (Bass, Clements, Kazman).',
      { h: 'Real-life example: an online food-delivery application' },
      { stack: ['**Presentation layer**: customer app, restaurant dashboard, delivery-partner app', '**API gateway**: authentication, routing', '**Services**: user, restaurant/menu, order, payment, delivery tracking, notification', '**Data layer**: databases per service, message queue', '**External systems**: payment gateway, maps API, SMS/e-mail'], label: 'Food-delivery architecture, top to bottom' },
      { table: { head: ['Architectural element', 'In the example'], rows: [
        ['**Components**', 'Order, payment, menu, delivery and notification services; the three client apps'],
        ['**Connectors**', 'REST calls from apps through the API gateway; asynchronous events (order placed → notify restaurant and rider); database access'],
        ['**Externally visible properties**', 'Each service\'s interface; performance (order confirmed in < 2 s); availability; secure payment'],
        ['**Relationships / constraints**', 'Order service calls payment, then publishes an event consumed by delivery and notification; layers call only the layer below'],
      ] } },
      { h: 'Why model the architecture' },
      { ul: ['Stakeholders (owners, developers, operations) **communicate** with one picture.', 'Captures **early decisions** that decide performance, security and scalability (e.g. scale only the order service at lunchtime).', 'A reusable, analysable model; new features (loyalty points) are added as new components.'] },
      'Style used: **layered + service-oriented** (also call-and-return between services).',
    ],
    sources: [`${N} (Unit 4)`, `${PR} ch. 9`, MID],
  },

  'se-basis-path': {
    blocks: [
      '**Basis path testing** (McCabe) is a white-box technique: from the program\'s **flow graph**, compute the **cyclomatic complexity V(G)**, find a **basis set** of V(G) linearly independent paths, and design one test case per path, so every statement and every branch is executed at least once.',
      { steps: ['Draw the **flow graph** from the code (nodes = statements/decisions, edges = control flow, regions = enclosed areas).', 'Compute **V(G)** = E − N + 2 = P + 1 = number of regions.', 'Determine V(G) **independent paths** (each introduces at least one new edge).', 'Prepare **test cases** that force execution of each path.'] },
      { h: 'Example: maximum of an array' },
      { img: 'se-flow-graph' },
      { ul: ['N = 6 nodes, E = 7 edges, P = 2 predicate nodes.', 'V(G) = 7 − 6 + 2 = **3** = 2 + 1 = 3 = 3 regions.', 'Paths: (1) 1-2-6; (2) 1-2-3-4-5-2-6; (3) 1-2-3-5-2-6.', 'Tests: n = 0 (path 1: loop skipped); a = [2, 7] (path 2: max updated to 7); a = [7, 2] (path 3: max unchanged).'] },
    ],
    sources: [`${N} (Unit 5)`, `${PR} §23.4`, MID],
  },
}
