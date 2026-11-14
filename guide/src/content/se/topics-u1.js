// Software Engineering, Unit I: introduction and process models. Keys are syllabus ids.
export default {
  'se.u1.practice': {
    oneLine: 'Software engineering is a disciplined, layered way of building software; its *practice* is four steps (understand, plan, carry out, check) guided by a few core principles.',
    blocks: [
      '**Software** is the programs, the data they use and the documents that describe them. **Software engineering** (IEEE) is the application of a systematic, disciplined, measurable approach to developing, running and maintaining software.',
      { h: 'Why software is different from hardware' },
      { ul: [
        'Software is **developed, not manufactured**: the cost is in design and engineering, not in making copies.',
        "Software **doesn't wear out**: it has no physical parts. But it **deteriorates** because every change can add new defects (the failure curve gets spikes after each change).",
        'Most software is still **custom-built** rather than assembled from ready-made parts, though reuse is growing.',
      ] },
      { h: 'Software engineering is a layered technology' },
      { stack: ['**Tools**: automated support for the process and methods (CASE tools)', '**Methods**: the how-to for each task (analysis, design, coding, testing)', '**Process**: the framework that holds the layers together and decides what is done when', '**A quality focus**: the base every layer rests on'], label: 'SE layers, top to bottom' },
      { h: 'The essence of practice (Polya)' },
      { flow: ['Understand the problem (communication, analysis)', 'Plan a solution (modelling, design)', 'Carry out the plan (code generation)', 'Examine the result (testing, quality assurance)'] },
      { h: "Hooker's seven general principles" },
      { ol: [
        'The reason it all exists: provide **value to users**.',
        '**KISS**: keep it simple.',
        'Maintain the **vision** of the system.',
        'What you produce, **others will consume** (write for the next reader).',
        'Be **open to the future** (design for change).',
        '**Plan ahead for reuse**.',
        '**Think** before you act.',
      ] },
      { h: 'Software myths (often asked)' },
      { table: { head: ['Kind', 'Myth', 'Reality'], rows: [
        ['Management', '"We have a book of standards, so we are fine." / "If we are late, add more programmers."', 'Nobody may follow the book. Adding people to a late project makes it later (Brooks\'s law).'],
        ['Customer', '"A general statement of objectives is enough to start coding."', 'Vague requirements cause expensive changes later; change costs grow sharply over time.'],
        ['Practitioner', '"Once the program works, our job is done." / "The only deliverable is working code."', '60 to 80% of the effort comes after first delivery; documentation and models are deliverables too.'],
      ] } },
    ],
    terms: [['Software engineering', 'A systematic, disciplined, measurable approach to developing, operating and maintaining software.'], ['Quality focus', 'The bottom layer of SE: a commitment to quality that every other layer rests on.'], ['Software deterioration', 'Software gets worse over time because changes introduce new defects, even though it does not wear out.']],
    exam: 'Define software and software engineering, draw the four SE layers, list Polya\'s four steps and a few of Hooker\'s principles. For "software doesn\'t wear out", sketch the idealised vs actual failure curve.',
    revise: ['Layers: quality focus, process, methods, tools', 'Practice: understand, plan, carry out, examine', 'Software is developed, not manufactured, and deteriorates without wearing out'],
  },

  'se.u1.process': {
    oneLine: 'A software process is the set of activities, actions and tasks done to build software; five framework activities do the work and umbrella activities run alongside all of them.',
    blocks: [
      'A **process** is a collection of **activities** (broad goals such as communication), **actions** (a set of tasks such as architectural design) and **tasks** (small, concrete jobs) done to create a work product. It is an adaptable approach, not a rigid recipe: the team picks what fits the project.',
      { h: 'The five framework activities' },
      { flow: ['**Communication**: talk to the customer, gather requirements', '**Planning**: estimates, schedule, risks, resources', '**Modelling**: analysis and design models', '**Construction**: code and test', '**Deployment**: deliver, get feedback'] },
      { h: 'Umbrella activities (applied throughout, not in one phase)' },
      { ul: [
        '**Software project tracking and control**: compare progress with the plan.',
        '**Risk management**: find and handle risks.',
        '**Software quality assurance**: activities that ensure quality.',
        '**Technical reviews**: find errors early in work products.',
        '**Measurement**: collect process, project and product measures.',
        '**Software configuration management**: control changes.',
        '**Reusability management**: plan and manage reuse.',
        '**Work product preparation and production**: models, documents, logs, forms.',
      ] },
      { tip: 'Asked twice: "Are umbrella activities applied evenly?" They are applied **throughout** the project, but not with equal effort everywhere. Tracking and risk management are heavier early and during construction; configuration management rises as the code grows; reviews cluster around each work product.' },
    ],
    terms: [['Framework activity', 'One of the five activities every project needs: communication, planning, modelling, construction, deployment.'], ['Umbrella activity', 'A supporting activity such as risk management or SQA that runs across the whole process.'], ['Work product', 'Anything the process produces: a model, document, code or test case.']],
    exam: 'Define a software process, draw the five framework activities as a flow, then list the umbrella activities with one line each.',
    revise: ['Activities > actions > tasks', 'Framework: communication, planning, modelling, construction, deployment', 'Umbrella: tracking, risk, SQA, reviews, measurement, SCM, reuse, work products'],
  },

  'se.u1.generic-model': {
    oneLine: 'A generic process model is the five framework activities plus umbrella activities, arranged in a chosen *process flow*: linear, iterative, evolutionary or parallel.',
    blocks: [
      'Every process model uses the same framework activities. What changes is the **process flow**: the order in which the activities happen and repeat.',
      { h: 'Four process flows' },
      { table: { head: ['Flow', 'How it moves', 'Typical model'], rows: [
        ['Linear', 'Each activity once, in sequence', 'Waterfall'],
        ['Iterative', 'Repeats one or more activities before moving on', 'Incremental'],
        ['Evolutionary', 'Goes round all activities in a circle; each circuit gives a more complete version', 'Spiral, prototyping'],
        ['Parallel', 'Some activities run at the same time (e.g. modelling one part while constructing another)', 'Concurrent model'],
      ] } },
      { h: 'Defining a framework activity' },
      'For a small project, communication may be a phone call and an e-mail. For a large one it may be inception, elicitation, elaboration, negotiation, specification and validation. A **task set** lists the actual tasks, work products, quality checks and milestones for an action.',
      { h: 'Process patterns' },
      'A **process pattern** describes a problem met during the process, the environment it occurs in, and a proven solution. Types: **stage** pattern (a framework activity), **task** pattern (one action) and **phase** pattern (the sequence of activities).',
    ],
    terms: [['Process flow', 'How framework activities are ordered and repeated in time.'], ['Task set', 'The tasks, work products, quality points and milestones that make up an action.'], ['Process pattern', 'A proven solution to a recurring problem in the software process.']],
    exam: 'Draw the generic model (framework activities under the umbrella), then sketch the four process flows as small arrow diagrams.',
    revise: ['Generic model = 5 framework activities + umbrella activities', 'Flows: linear, iterative, evolutionary, parallel', 'Pattern types: stage, task, phase'],
  },

  'se.u1.assessment': {
    oneLine: 'Process assessment checks a team\'s process against a standard to find strengths and weaknesses; CMMI rates maturity in five levels.',
    blocks: [
      'A good process does not guarantee good software, but a weak one makes good software unlikely. **Assessment** examines the process so it can be **improved**.',
      { h: 'Approaches to assessment' },
      { ul: [
        '**SCAMPI** (Standard CMMI Assessment Method for Process Improvement): five steps: initiating, diagnosing, establishing, acting, learning.',
        '**CBA IPI** (CMM-Based Appraisal for Internal Process Improvement): diagnostic technique using the SEI CMM.',
        '**SPICE** (ISO/IEC 15504): a standard for process assessment.',
        '**ISO 9001:2000 for software**: a quality management standard for any organisation.',
      ] },
      { h: 'CMMI maturity levels' },
      { stack: ['**5 Optimizing**: continuous process improvement using measurement', '**4 Quantitatively managed**: process and product measured and controlled with numbers', '**3 Defined**: a standard, documented process for the whole organisation', '**2 Managed**: basic project management (requirements, planning, tracking)', '**1 Initial**: ad hoc, success depends on heroes'], label: 'CMMI levels, highest at the top' },
      { compare: [
        { title: 'Advantages of CMMI', items: ['Clear, staged path for improvement', 'Comparable across organisations', 'Better predictability of cost and schedule'] },
        { title: 'Disadvantages', items: ['Heavy paperwork and cost for small teams', 'Can become box-ticking rather than real improvement', 'Slow: moving up a level takes years'] },
      ] },
    ],
    terms: [['CMMI', 'Capability Maturity Model Integration: a model that rates process maturity from level 1 (initial) to 5 (optimizing).'], ['SCAMPI', 'The standard appraisal method used with CMMI.'], ['SPICE', 'ISO/IEC 15504, an international standard for process assessment.']],
    exam: 'List the assessment approaches (SCAMPI, CBA IPI, SPICE, ISO 9001) and draw the CMMI levels as a staircase with one line each. Add two pros and two cons.',
    revise: ['Assessment: SCAMPI, CBA IPI, SPICE, ISO 9001', 'CMMI: initial, managed, defined, quantitatively managed, optimizing'],
  },

  'se.u1.waterfall': {
    oneLine: 'The waterfall model does each framework activity once, in strict order, like water falling down steps; it suits projects whose requirements are clear and stable.',
    blocks: [
      'Also called the **classic life cycle** or **linear sequential model**. Work flows from one phase to the next; going back is expensive.',
      { flow: ['Communication (requirements)', 'Planning (estimating, scheduling, tracking)', 'Modelling (analysis, design)', 'Construction (code, test)', 'Deployment (delivery, support, feedback)'] },
      'A variant, the **V-model**, pairs each development phase with a testing phase: requirements with acceptance testing, design with integration testing, code with unit testing.',
      { compare: [
        { title: 'Advantages', items: ['Simple and easy to manage', 'Clear milestones and documents at each phase', 'Works well when requirements are fixed and well understood'] },
        { title: 'Limitations', items: ['Real projects rarely follow a strict sequence', 'Customers struggle to state all requirements up front', 'A working version appears only at the end', 'Blocking states: some team members wait for others to finish'] },
      ] },
      { h: 'Where it fits (asked as "give three examples")' },
      { ul: ['An enhancement to a well-understood existing system (e.g. adding a tax rule to payroll)', 'A small, fixed-scope system such as a college library catalogue', 'Safety-critical embedded software with fully specified requirements (e.g. a lift controller)'] },
    ],
    terms: [['Linear sequential model', 'Another name for waterfall: each phase once, in order.'], ['V-model', 'A waterfall variant that links each development phase to a matching test phase.'], ['Blocking state', 'When team members must wait for a previous phase to finish before they can work.']],
    exam: 'Draw the five waterfall boxes as a staircase with arrows, state when it is used, then list advantages and limitations. Mention the V-model in one line.',
    revise: ['Phases: communication, planning, modelling, construction, deployment', 'Use: clear, stable requirements', 'Problem: late working version, hard to go back'],
  },

  'se.u1.incremental': {
    oneLine: 'The incremental model delivers the software in pieces: each increment is a small waterfall, and the first increment is the core product.',
    blocks: [
      'The requirements are fairly clear, but the customer needs some function **quickly**. So the system is built as a series of **increments**. Each one goes through communication, planning, modelling, construction and deployment.',
      { flow: ['Increment 1: core product (basic features)', 'Increment 2: more features', 'Increment 3: more features', 'Increment n: complete product'], loop: 'Feedback from each delivered increment shapes the plan for the next' },
      { h: 'Example: a word processor' },
      { ul: ['1st increment: basic file management, editing and document production', '2nd: more advanced editing and layout', '3rd: spelling and grammar checking', '4th: advanced page layout'] },
      { compare: [
        { title: 'Advantages', items: ['Working software early', 'Customer feedback after each increment', 'Smaller teams can start; staff added later', 'Technical risks can be handled in later increments'] },
        { title: 'Disadvantages', items: ['Needs a clear overall design up front', 'Each increment must fit the earlier ones', 'Total cost can be higher than a single build'] },
      ] },
      { tip: 'Key outputs of each iteration (asked): a working, tested increment; updated requirements and design; customer feedback; a plan for the next increment.' },
    ],
    terms: [['Increment', 'A deliverable, working piece of the product that adds features to the previous one.'], ['Core product', 'The first increment: the basic requirements, used and evaluated by the customer.']],
    exam: 'Draw several staggered waterfall bars (one per increment) along a time axis, give the word processor example, and list advantages.',
    revise: ['Each increment = a mini waterfall', 'First increment = core product', 'Early working software, feedback each time'],
  },

  'se.u1.rad': {
    oneLine: 'RAD (Rapid Application Development) is an incremental model with a very short cycle (60 to 90 days), built by several teams in parallel using reusable components.',
    blocks: [
      'RAD works when requirements are well understood and the project can be split into modules. Each module is given to a separate team; they work **in parallel** and the results are integrated.',
      { flow: ['Communication', 'Planning', 'Modelling by teams 1..n (business, data, process modelling)', 'Construction by teams 1..n (component reuse, automatic code generation, testing)', 'Deployment (integration, delivery, feedback)'] },
      { compare: [
        { title: 'When it works', items: ['Requirements clear and scope fixed', 'System can be modularised', 'Reusable components and good tools exist', 'Enough skilled people for several teams'] },
        { title: 'Drawbacks', items: ['Large projects need many people for the teams', 'Developers and customers must commit to fast activity, or it fails', 'Not suitable if the system cannot be split into modules', 'Risky when high performance or new technology is involved'] },
      ] },
      { h: 'RAD vs prototyping (asked)' },
      { table: { head: ['', 'RAD', 'Prototyping'], rows: [
        ['Requirements', 'Well understood', 'Unclear, discovered through the prototype'],
        ['Goal', 'Deliver the real system fast', 'Learn what the customer wants'],
        ['Output', 'Production modules', 'Often a throwaway model'],
        ['Teams', 'Several in parallel', 'Usually one'],
      ] } },
    ],
    terms: [['RAD', 'Rapid Application Development: a fast, component-based incremental model with parallel teams.'], ['Component reuse', 'Building with existing, tested parts instead of writing everything new.']],
    exam: 'Draw the RAD diagram with parallel team lanes for modelling and construction, state the 60 to 90 day cycle, and list drawbacks.',
    revise: ['Short cycle, parallel teams, reuse', 'Needs clear requirements and modular system', 'Fails without enough people or commitment'],
  },

  'se.u1.prototyping': {
    oneLine: 'Prototyping builds a quick, rough version so the customer can see it and say what they really want; it is used when requirements are fuzzy.',
    blocks: [
      'Customers often know the general goal but not the details (inputs, processing, outputs). A **prototype** lets them try something and react.',
      { flow: ['Communication (overall goals)', 'Quick plan', 'Quick design (what the user sees)', 'Construction of the prototype', 'Deployment, delivery and feedback'], loop: 'Repeat until the customer is satisfied, then build the real system' },
      { compare: [
        { title: 'Advantages', items: ['Users see something early', 'Missing or wrong requirements show up fast', 'Reduces risk of building the wrong thing'] },
        { title: 'Problems', items: ['Customer may think the prototype is the product', 'Quick choices (wrong language, slow algorithm) can stay in the final system', 'Hard to know when to stop iterating'] },
      ] },
      { tip: 'Treat the prototype as a **throwaway** used to define requirements. Agree this with the customer at the start.' },
      { h: 'Evolutionary vs traditional development (asked)' },
      { table: { head: ['', 'Evolutionary', 'Traditional (waterfall)'], rows: [
        ['Requirements', 'Evolve during development', 'Fixed at the start'],
        ['Delivery', 'Versions improve over time', 'One delivery at the end'],
        ['Customer involvement', 'Continuous', 'Mostly at the start and end'],
        ['Suits', 'Unclear or changing needs', 'Stable, well-known needs'],
      ] } },
    ],
    terms: [['Prototype', 'A quick, partial model of the system used to discover requirements.'], ['Throwaway prototype', 'A prototype discarded after requirements are clear; the real system is built properly.'], ['Evolutionary model', 'A model where the software grows through repeated, more complete versions.']],
    exam: 'Draw the prototyping cycle (communication, quick plan, quick design, construction, deployment and feedback, back to communication). List when to use it and its problems.',
    revise: ['Use when requirements are fuzzy', 'Cycle: communicate, quick plan and design, build, feedback', 'Danger: prototype mistaken for product'],
  },

  'se.u1.spiral': {
    oneLine: 'The spiral model (Boehm) grows the software in loops; every loop goes through the framework activities and starts with risk analysis, so it suits large, risky projects.',
    blocks: [
      'The spiral combines the **iteration** of prototyping with the **control** of waterfall. Each circuit of the spiral produces a more complete version: first a concept, then a prototype, then the real product, then maintenance releases.',
      { flow: ['Communication', 'Planning (estimation, scheduling, **risk analysis**)', 'Modelling (analysis, design)', 'Construction (code, test)', 'Deployment (delivery, feedback)'], loop: 'Go round again on a wider loop; cost and completeness grow with every circuit' },
      { h: 'Moving outward along the spiral (asked)' },
      'The software becomes **more complete**: early circuits give a concept and prototypes, later ones give the full product, and the outermost circuits are maintenance and enhancement. Cost and time spent so far also grow with the radius. **Anchor point milestones** mark what must be achieved on each pass.',
      { compare: [
        { title: 'Advantages', items: ['Risk is handled on every loop', 'Suits large and complex systems', 'Customer sees progress each circuit', 'Can last the whole life of the software'] },
        { title: 'Disadvantages', items: ['Needs real risk-assessment expertise', 'Hard to convince customers it is controllable', 'Costly for small projects'] },
      ] },
      { h: 'Why spiral is more useful than prototyping' },
      'Prototyping only clarifies requirements. The spiral **also analyses risk** in every loop, covers the **whole life cycle**, and keeps waterfall-style planning, so it can run a large project end to end.',
      { tip: 'Choosing a model (asked): clear requirements and enough budget and staff gives **waterfall**; a cautious client wanting risk assessment at every stage gives **spiral**.' },
    ],
    terms: [['Spiral model', 'An evolutionary, risk-driven process model by Barry Boehm.'], ['Risk analysis', 'Identifying and evaluating what could go wrong, done at the start of every spiral loop.'], ['Anchor point milestone', 'A checkpoint reached on each spiral pass.']],
    exam: 'Draw the spiral with its quadrants (communication, planning with risk analysis, modelling, construction, deployment) and label circuits as concept, prototype, product, maintenance. Then advantages and disadvantages.',
    revise: ['Risk-driven, evolutionary, by Boehm', 'Each loop: plan + risk analysis + engineer + evaluate', 'Outer loops = more complete product, more cost'],
  },

  'se.u1.specialized': {
    oneLine: 'Specialized process models are used when a project needs a particular approach: component-based development, formal methods, or aspect-oriented development.',
    blocks: [
      { tree: { root: 'Specialized process models', kids: ['Component-based development', 'Formal methods model', 'Aspect-oriented software development'] } },
      { h: 'Component-based development' },
      { steps: ['Research and evaluate available components (COTS: commercial off-the-shelf) for the domain.', 'Consider how to integrate them.', 'Design an architecture that holds them.', 'Integrate the components.', 'Test thoroughly.'] },
      'Pros: reuse cuts development time and cost. Cons: you depend on vendors, and components may not fit perfectly.',
      { h: 'Formal methods model' },
      'Uses **mathematical notation** to specify, develop and verify software. Errors such as ambiguity and inconsistency can be found by proof. A variant, **cleanroom software engineering**, uses it to avoid defects instead of finding them later.',
      'Pros: very reliable software, good for safety-critical systems (medical, avionics). Cons: slow and expensive, needs special training, hard to explain to customers.',
      { h: 'Aspect-oriented software development (AOSD)' },
      'Some concerns, such as **security, logging and memory management**, cut across many parts of a system. These are **crosscutting concerns** or **aspects**. AOSD gives a way to define, specify and build aspects separately and then weave them in.',
    ],
    terms: [['COTS', 'Commercial off-the-shelf components bought and reused.'], ['Formal methods', 'Mathematically based techniques to specify and verify software.'], ['Crosscutting concern', 'A requirement such as security or logging that affects many modules (an aspect).']],
    exam: 'Name the three specialized models, give the steps of component-based development, and one paragraph each on formal methods and AOSD with pros and cons.',
    revise: ['Component-based: reuse COTS', 'Formal: math specification, proof, cleanroom', 'AOSD: crosscutting concerns as aspects'],
  },
}
