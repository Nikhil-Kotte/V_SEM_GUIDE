// Software Engineering, Unit II (agile development and requirements) and the start of Unit III
// (effort estimation). Keys are syllabus ids.
export default {
  'se.u2.agility': {
    oneLine: 'Agility is the ability to respond to change quickly; an agile process delivers working software in small, frequent increments with the customer on the team.',
    blocks: [
      'Requirements change, technology changes, team members change. An **agile** team accepts change as normal and is built to respond to it.',
      { h: 'The Agile Manifesto values' },
      { table: { head: ['We value more…', '…than'], rows: [
        ['Individuals and interactions', 'Processes and tools'],
        ['Working software', 'Comprehensive documentation'],
        ['Customer collaboration', 'Contract negotiation'],
        ['Responding to change', 'Following a plan'],
      ] } },
      { h: 'An agile process' },
      'It assumes three things are hard to predict: which requirements will persist, how much design is needed before construction, and how long analysis, design and testing will take. So it must be **adaptable** and **incremental**, delivering working software often so customer feedback can steer it.',
      { flow: ['Plan a short iteration', 'Build a small increment', 'Customer reviews working software', 'Adapt the plan'], loop: 'Every few weeks' },
      { h: 'A few of the 12 agile principles' },
      { ul: ['Satisfy the customer through early and continuous delivery.', 'Welcome changing requirements, even late.', 'Deliver working software frequently (weeks, not months).', 'Business people and developers work together daily.', 'Face-to-face conversation is the best way to convey information.', 'Working software is the main measure of progress.', 'At regular intervals the team reflects and adjusts.'] },
      { tip: 'Rapid delivery often matters more than full functionality (asked) because the business gets value and feedback early, can react to competitors, and avoids building features nobody uses.' },
    ],
    terms: [['Agility', 'The ability to respond quickly and effectively to change.'], ['Agile Manifesto', 'The 2001 statement of four values and twelve principles behind agile development.'], ['Iteration', 'A short, fixed period (usually 1 to 4 weeks) that ends with working software.']],
    exam: 'Define agility and an agile process, write the four manifesto values as a table, and list five principles.',
    revise: ['People, working software, collaboration, responding to change', 'Small increments, frequent delivery, customer on the team'],
  },

  'se.u2.xp': {
    oneLine: 'Extreme Programming (XP) is an agile model with four activities (planning, design, coding, testing) and practices like user stories, pair programming, refactoring and test-first coding.',
    blocks: [
      { flow: ['**Planning**: user stories, customer gives value, team gives cost, release plan', '**Design**: keep it simple, CRC cards, spike solutions', '**Coding**: write unit tests first, pair programming, continuous integration', '**Testing**: run unit tests daily; customer runs acceptance tests'], loop: 'Each release adds stories; project velocity sets the next plan' },
      { h: 'Key XP ideas' },
      { table: { head: ['Practice', 'What it means'], rows: [
        ['User story', 'A short description of a feature, written by the customer on a card'],
        ['Project velocity', 'Number of stories finished in the last release; used to plan the next'],
        ['KIS (keep it simple)', 'Design only what is needed now'],
        ['CRC cards', 'Class, Responsibility, Collaborator cards used for design'],
        ['Spike solution', 'A quick operational prototype of a hard design problem, to reduce risk'],
        ['Refactoring', 'Improving the internal structure of code without changing what it does'],
        ['Pair programming', 'Two people at one computer: one types, one reviews in real time'],
        ['Test-first', 'Write the unit test before the code it tests'],
        ['Continuous integration', 'Merge and test code many times a day'],
      ] } },
      { h: 'XP values' },
      '**Communication, simplicity, feedback, courage, respect.**',
      { tip: 'Every agile process is iterative (asked). XP changes easily because each release is small: a change only affects the next few stories, tests catch side effects, and refactoring keeps the code easy to change.' },
    ],
    terms: [['User story', 'A customer-written card describing one feature and its value.'], ['Spike solution', 'A throwaway prototype built to explore a risky design problem.'], ['Refactoring', 'Restructuring code to improve its design without changing behaviour.'], ['Pair programming', 'Two developers working together at one workstation.']],
    exam: 'Draw the four XP activities in a circle, explain each in two lines, and define spike, refactoring and pair programming.',
    revise: ['Activities: planning, design, coding, testing', 'Practices: stories, CRC, spike, refactor, pairs, test-first, CI', 'Values: communication, simplicity, feedback, courage, respect'],
  },

  'se.u2.asd': {
    oneLine: 'Adaptive Software Development (ASD), by Jim Highsmith, runs in cycles of speculation, collaboration and learning, and relies on self-organising teams.',
    blocks: [
      { flow: ['**Speculation**: start the project, plan adaptive cycles from the mission and constraints', '**Collaboration**: motivated people work together, share ideas and trust each other', '**Learning**: focus groups, technical reviews and project post-mortems'], loop: 'Each cycle ends in components delivered and lessons learned' },
      'The word "speculation" replaces "planning" because plans are expected to change. **Learning** is the heart of ASD: the team learns from customer feedback, reviews and post-mortems, then adapts.',
      { h: 'Why ASD teams succeed more often (asked)' },
      { ul: ['Self-organising teams share responsibility, so problems are spotted early.', 'Collaboration builds trust and better ideas.', 'Short cycles and reviews mean mistakes are learned from quickly.', 'Plans are adapted rather than defended.'] },
    ],
    terms: [['Speculation', 'ASD\'s planning phase, which expects the plan to change.'], ['Self-organising team', 'A team that decides for itself how to do the work.'], ['Post-mortem', 'A review at the end of a cycle or project to learn what went well and badly.']],
    exam: 'Draw the speculation, collaboration, learning cycle and explain each with one example; finish with why ASD teams succeed.',
    revise: ['Speculate, collaborate, learn', 'Self-organising teams, learning from reviews'],
  },

  'se.u2.scrum': {
    oneLine: 'Scrum organises work into short sprints from a prioritised backlog, with daily 15-minute meetings and a demo to the customer at the end of each sprint.',
    blocks: [
      { flow: ['**Product backlog**: prioritised list of features', '**Sprint backlog**: items chosen for this sprint', '**Sprint** (usually 30 days or less) with daily Scrum meetings', '**Demo** of the working increment to the customer'], loop: 'Next sprint takes the next items from the backlog' },
      { h: 'Daily Scrum meeting (15 minutes, standing)' },
      { ol: ['What did you do since the last meeting?', 'What obstacles are you facing?', 'What will you do by the next meeting?'] },
      { h: 'Roles' },
      { table: { head: ['Role', 'Job'], rows: [
        ['Product owner', 'Owns and prioritises the product backlog'],
        ['Scrum master', 'Runs the meetings and removes obstacles'],
        ['Development team', 'Self-organising; builds the increment'],
      ] } },
      { h: 'Significance of Scrum (asked)' },
      'It keeps the team focused on a small, fixed goal; problems surface every day; the customer sees working software every sprint; and changes go into the backlog instead of disrupting the current sprint.',
    ],
    terms: [['Backlog', 'A prioritised list of requirements or features.'], ['Sprint', 'A time-boxed work period, usually up to 30 days.'], ['Scrum master', 'The person who leads the Scrum meetings and removes blockers.']],
    exam: 'Draw the Scrum flow (backlog, sprint backlog, sprint with daily meetings, demo), list the three daily questions and the three roles.',
    revise: ['Backlog, sprint, daily scrum, demo', 'Three questions every day', 'Roles: product owner, scrum master, team'],
  },

  'se.u2.dsdm': {
    oneLine: 'DSDM builds systems to tight time limits using incremental prototyping and the 80/20 rule: deliver the 80% of value that takes 20% of the effort first.',
    blocks: [
      '**Dynamic Systems Development Method** is guided by the **Pareto principle**: 80% of an application can be delivered in 20% of the time it takes to deliver all of it. Each increment delivers just enough to move to the next.',
      { flow: ['**Feasibility study**: can DSDM work here?', '**Business study**: functional and information requirements, architecture', '**Functional model iteration**: incremental prototypes shown to users', '**Design and build iteration**: rebuild prototypes into production quality', '**Implementation**: put the latest increment into operation'] },
      'The last three are iterative and can overlap. The **DSDM Consortium** maintains the method; it can be combined with XP.',
    ],
    terms: [['DSDM', 'Dynamic Systems Development Method: an agile method for time-boxed, incremental delivery.'], ['Pareto principle', 'The 80/20 rule: 80% of the value comes from 20% of the effort.'], ['Time box', 'A fixed amount of time for an increment; scope is cut, not the deadline.']],
    exam: 'Define DSDM, state the 80/20 principle, and draw its five life-cycle activities.',
    revise: ['80/20 rule, time boxes', 'Feasibility, business study, functional model, design and build, implementation'],
  },

  'se.u2.fdd': {
    oneLine: 'Feature Driven Development (FDD) plans, designs and builds a system one small, client-valued feature at a time, each finished in two weeks or less.',
    blocks: [
      'A **feature** is a client-valued function that can be built in two weeks or less, written as **<action> the <result> <by|for|of|to> a(n) <object>**, for example "Calculate the total of a sale".',
      { flow: ['Develop an overall model', 'Build a features list', 'Plan by feature', 'Design by feature', 'Build by feature'], loop: 'Design and build repeat for each feature set' },
      { h: 'Features and applications (asked)' },
      { ul: ['Small features are easy to describe, estimate and review.', 'Features grouped into feature sets give progress reports managers understand.', 'Design and code inspections are part of every feature.', 'Suits **large teams** and business systems with many well-defined functions (banking, inventory, e-commerce).'] },
    ],
    terms: [['Feature', 'A small, client-valued function deliverable in two weeks or less.'], ['Feature set', 'A group of related features used for planning and tracking.']],
    exam: 'Define a feature with the template and an example, draw the five FDD steps, and list where FDD is used.',
    revise: ['Feature = client value, 2 weeks or less', 'Model, list, plan, design, build by feature'],
  },

  'se.u2.am': {
    oneLine: 'Agile Modelling (AM) is a practical way to model software: build only the models you need, keep them simple, and work out several at once.',
    blocks: [
      'Large systems still need models, but agile teams avoid heavy documentation. **Agile Modelling** (Scott Ambler) gives principles for modelling just enough.',
      { h: 'Principles' },
      { ul: [
        '**Model with a purpose**: know why you are building a model and who it is for.',
        '**Use multiple models**: each shows a different view; pick only those that add value.',
        '**Travel light**: keep only models with long-term value; discard the rest.',
        '**Content is more important than representation**: a whiteboard sketch can be enough.',
        '**Know the models and tools** you use.',
        '**Adapt locally** to the team\'s needs.',
      ] },
    ],
    terms: [['Agile modelling', 'A set of principles for effective, lightweight modelling.'], ['Travel light', 'Keep only the models that will stay useful; throw away the rest.']],
    exam: 'Define Agile Modelling and explain four or five of its principles with one line each.',
    revise: ['Purpose, multiple models, travel light, content over form'],
  },

  'se.u2.req-engineering': {
    oneLine: 'Requirements engineering is the set of tasks that turn a customer\'s needs into an agreed, checked specification: inception, elicitation, elaboration, negotiation, specification, validation and management.',
    blocks: [
      { flow: ['**Inception**: basic understanding, stakeholders, nature of the solution', '**Elicitation**: draw out requirements from stakeholders', '**Elaboration**: refine into an analysis model (scenarios, classes)', '**Negotiation**: resolve conflicts, prioritise', '**Specification**: write it down (SRS, models, use cases)', '**Validation**: check for errors, ambiguity, omissions', '**Management**: track and control changes'] },
      { h: 'Functional vs non-functional requirements' },
      { compare: [
        { title: 'Functional', items: ['What the system must **do**', '"The system shall let a user reserve a seat"', 'Services, inputs, outputs, behaviour'] },
        { title: 'Non-functional', items: ['How **well** it must do it', '"Search must return results in under 2 s"', 'Performance, security, usability, reliability, portability'] },
      ] },
      { tip: 'User vs system requirements (asked): user requirements are in plain language for customers; system requirements are detailed and technical for developers. Keeping them separate lets each reader understand and agree to the part that concerns them.' },
    ],
    terms: [['Requirements engineering', 'The tasks that lead to an understanding of what the customer wants and a verified specification.'], ['Functional requirement', 'A service or behaviour the system must provide.'], ['Non-functional requirement', 'A quality or constraint such as speed, security or usability.']],
    exam: 'List the seven requirements engineering tasks as a flow with one line each, and give a functional vs non-functional table with examples.',
    revise: ['Inception, elicitation, elaboration, negotiation, specification, validation, management', 'Functional = what; non-functional = how well'],
  },

  'se.u2.groundwork': {
    oneLine: 'Establishing the groundwork means preparing for requirements work: identify stakeholders, recognise their different viewpoints, aim for collaboration and ask the first questions.',
    blocks: [
      { flow: ['Identify the **stakeholders**', 'Recognise **multiple viewpoints**', 'Work toward **collaboration**', 'Ask the **first questions**'] },
      { ul: [
        '**Stakeholders**: anyone who benefits from the system: managers, users, engineers, support staff. Start a list and ask each person "who else should I talk to?"',
        '**Multiple viewpoints**: marketing wants features, managers want a deadline, users want ease of use. Record all of them; conflicts are expected.',
        '**Collaboration**: find areas of agreement and conflict; a senior stakeholder may make the final call.',
      ] },
      { h: 'The first questions' },
      { table: { head: ['Kind', 'Example question'], rows: [
        ['Context-free (about the project)', 'Who is behind the request? Who will use the solution? What is the economic benefit?'],
        ['About the problem', 'What does a good output look like? What problems will this solve?'],
        ['About the meeting itself', 'Are you the right person to answer? Are my questions relevant? Should I ask anything else?'],
      ] } },
    ],
    terms: [['Stakeholder', 'Anyone who benefits directly or indirectly from the system.'], ['Context-free question', 'A question that does not assume the solution, used to start requirements gathering.']],
    exam: 'Explain the four groundwork steps with examples and give two sample questions of each kind.',
    revise: ['Stakeholders, viewpoints, collaboration, first questions'],
  },

  'se.u2.eliciting': {
    oneLine: 'Eliciting requirements means drawing them out of stakeholders through collaborative meetings, quality function deployment, usage scenarios and work products.',
    blocks: [
      { h: 'Collaborative requirements gathering (guidelines, asked)' },
      { ul: [
        'Meetings are attended by both developers and stakeholders.',
        'Rules for preparation and participation are set in advance.',
        'An agenda is formal enough to cover every point but informal enough to let ideas flow.',
        'A **facilitator** (customer, developer or outsider) controls the meeting.',
        'A **definition mechanism** (whiteboard, flip charts, wall stickers, an online forum) is used.',
        'Goal: identify the problem, propose solutions, negotiate approaches and specify a first set of requirements.',
      ] },
      { h: 'Techniques' },
      { tree: { root: 'Elicitation techniques', kids: ['Interviews', 'Collaborative meetings', 'Questionnaires', 'Observation', 'Use-case scenarios', 'Quality Function Deployment', 'Prototypes'] } },
      { h: 'Quality Function Deployment (QFD)' },
      'QFD translates customer needs into technical requirements. It sorts requirements into **normal** (stated, e.g. graphical display), **expected** (implicit, so basic the customer forgets to say them, e.g. easy installation) and **exciting** (beyond expectations, e.g. a surprising feature).',
      { h: 'Elicitation work products' },
      { ul: ['Statement of need and feasibility', 'Bounded statement of scope', 'List of stakeholders who took part', 'Description of the technical environment', 'List of requirements and constraints', 'Usage scenarios', 'Any prototypes'] },
      { tip: 'Watch example (asked): elicit "set the time" and "set an alarm" by asking users how they set them today, observing them, writing a scenario ("user holds Mode for 2 s, digits blink, user presses + to change..."), and listing constraints (battery life, button count).' },
      { warn: 'Problems with three or four customers (asked): conflicting priorities, different vocabulary, one customer dominating, and requirements that contradict each other. Fix it with a facilitated joint meeting, a shared glossary and agreed priorities.' },
    ],
    terms: [['Facilitator', 'The person who runs a requirements-gathering meeting.'], ['QFD', 'Quality Function Deployment: turns customer needs into technical requirements; normal, expected, exciting.'], ['Usage scenario', 'A story of how a user will interact with the system.']],
    exam: 'Explain collaborative requirements gathering (list the guidelines), describe QFD with its three kinds of requirements, and list the elicitation work products.',
    revise: ['Collaborative meeting with facilitator and agenda', 'QFD: normal, expected, exciting', 'Work products: scope, stakeholders, requirements, scenarios'],
  },

  'se.u2.negotiating': {
    oneLine: 'Negotiation resolves conflicting requirements so every stakeholder gets enough of what they want; it aims for a win-win result.',
    blocks: [
      'Customers often ask for more than can be built with the time and money available, and different stakeholders conflict. Negotiation (Boehm\'s **win-win** approach) settles this.',
      { flow: ['Identify the key stakeholders', 'Find each stakeholder\'s **win conditions**', 'Negotiate the win conditions into a set of **win-win** conditions for everyone'] },
      { h: 'Good negotiation habits' },
      { ul: ['Recognise it is not a competition.', 'Map out a strategy: decide what you and the others want.', 'Listen actively.', 'Focus on the other side\'s interests, not their position.', 'Do not let it get personal.', 'Be creative when stuck.', 'Be ready to commit once agreement is reached.'] },
    ],
    terms: [['Win condition', 'What a stakeholder needs from the system to be satisfied.'], ['Win-win', 'An outcome where every stakeholder gets an acceptable result.']],
    exam: 'Explain why negotiation is needed, describe Boehm\'s win-win steps and list negotiation guidelines.',
    revise: ['Stakeholders, win conditions, win-win'],
  },

  'se.u2.validating': {
    oneLine: 'Validation checks the requirements and the analysis model for errors, ambiguity, omissions and conflicts before design begins.',
    blocks: [
      { h: 'Questions a validation review asks' },
      { ul: ['Is each requirement consistent with the overall objective?', 'Is it at the right level of detail?', 'Is it really needed, or is it an add-on?', 'Is it **unambiguous**?', 'Is its source (a person or rule) known?', 'Does it conflict with any other requirement?', 'Can it be achieved with the available technology?', 'Can it be **tested** once built?'] },
      { h: 'Methods' },
      { ul: ['**Requirements reviews** (formal technical review of the SRS)', '**Prototyping** to check understanding with users', '**Test-case generation**: if you cannot write a test, the requirement is unclear', '**Consistency analysis** of the analysis model'] },
      { flow: ['Plan the review', 'Distribute the SRS to reviewers', 'Review meeting', 'Record errors', 'Agree follow-up actions', 'Revise the SRS'], label: 'Organising a requirements review' },
      { tip: 'When validation finds an error (asked), the requirement is sent back: the analyst and the stakeholder who owns the requirement correct it, the change is recorded under requirements management, and the corrected part is re-reviewed.' },
      'Who takes part in a review: the requirements engineer, customer and user representatives, a designer, a tester and a moderator.',
    ],
    terms: [['Validation', 'Checking that the requirements correctly and completely describe what the customer needs.'], ['Requirements review', 'A formal meeting where stakeholders examine the specification for errors.']],
    exam: 'List the validation checklist questions, name the validation methods, and draw the review process.',
    revise: ['Consistent, unambiguous, needed, testable, achievable', 'Reviews, prototypes, test cases'],
  },

  'se.u2.srs-value': {
    oneLine: 'A good SRS is the agreed contract between customer and developer: it reduces rework, gives a basis for estimates and tests, and must be correct, complete, unambiguous and verifiable.',
    blocks: [
      'The **Software Requirements Specification** records what the software must do and how well, before design starts.',
      { h: 'Why a good SRS has value' },
      { ul: ['Forms the **agreement** between client and supplier.', 'Reduces development cost: errors found in requirements are far cheaper to fix than in code.', 'Gives a basis for **estimating** cost and schedule.', 'Gives a basis for **validation and testing**.', 'Makes later enhancement easier.'] },
      { h: 'Characteristics of a good SRS (IEEE 830)' },
      { table: { head: ['Quality', 'Meaning'], rows: [
        ['Correct', 'Every requirement is one the software must meet'],
        ['Complete', 'All requirements, responses to all inputs, all terms defined'],
        ['Unambiguous', 'Each requirement has only one interpretation'],
        ['Consistent', 'No requirements conflict'],
        ['Verifiable', 'Each can be checked by a test or inspection'],
        ['Ranked', 'For importance and stability'],
        ['Modifiable', 'Easy to change in a structured way'],
        ['Traceable', 'Each requirement can be traced to its source and forward to design'],
      ] } },
    ],
    terms: [['SRS', 'Software Requirements Specification: the document that states all software requirements.'], ['Verifiable', 'A requirement that can be checked objectively, for example by a test.'], ['Traceable', 'A requirement whose origin and later design and code can be followed.']],
    exam: 'Define SRS, list why it is valuable, then the eight characteristics of a good SRS in a table.',
    revise: ['Correct, complete, unambiguous, consistent, verifiable, ranked, modifiable, traceable'],
  },

  'se.u2.problem-analysis': {
    oneLine: 'Problem analysis studies the problem domain to understand what the system must do, using informal approaches, data flow modelling, object-oriented modelling or prototyping.',
    blocks: [
      'The aim is to understand the problem and its context well enough to write correct requirements. The basic principle is **partition**: break the problem into smaller parts and understand each.',
      { tree: { root: 'Problem analysis approaches', kids: ['Informal approach (meetings, questionnaires)', 'Data flow modelling (DFDs, data dictionary)', 'Object-oriented modelling (classes, use cases)', 'Prototyping'] } },
      { ul: [
        '**Informal approach**: analyst talks to users, studies documents, and writes down understanding directly in the SRS.',
        '**Data flow modelling**: the system is seen as data flowing through transformations; draw context diagrams and DFDs, then a data dictionary.',
        '**Object-oriented modelling**: identify objects, their attributes, services and relationships.',
        '**Prototyping**: build a quick version so users can clarify their needs.',
      ] },
    ],
    terms: [['Partitioning', 'Breaking a problem into smaller parts that can be understood separately.'], ['Data dictionary', 'A list of all data items in the DFDs with their meaning and structure.']],
    exam: 'State the aim of problem analysis, then explain the four approaches with one example each.',
    revise: ['Informal, data flow, object-oriented, prototyping'],
  },

  'se.u2.req-spec': {
    oneLine: 'Requirements specification writes the agreed requirements down in a standard structure (IEEE 830): introduction, overall description and specific requirements.',
    blocks: [
      { h: 'IEEE 830 SRS template' },
      { stack: ['**1. Introduction**: purpose, scope, definitions, references, overview', '**2. Overall description**: product perspective, product functions, user characteristics, constraints, assumptions and dependencies', '**3. Specific requirements**: external interfaces, functional requirements, performance, design constraints, software system attributes (reliability, security...)', '**Appendices and index**'], label: 'SRS sections in order' },
      { h: 'What an SRS contains' },
      { ul: ['**Functional** requirements (inputs, processing, outputs)', '**Performance** requirements (response time, throughput)', '**Design constraints** (standards, hardware limits)', '**External interfaces** (user, hardware, software, communication)'] },
      { h: 'Specification languages (asked)' },
      { ul: ['**Natural language** (structured English): easy to read, but can be ambiguous.', '**Structured / tabular** notations: decision tables, forms.', '**Graphical** notations: DFDs, UML use case and state diagrams.', '**Formal** languages: Z, VDM: precise, mathematical, harder to read.'] },
      { h: 'Example: railway reservation (asked)' },
      { compare: [
        { title: 'Functional', items: ['Search trains between two stations on a date', 'Book a ticket and generate a PNR', 'Cancel a ticket and refund', 'Check PNR status'] },
        { title: 'Non-functional', items: ['Handle 10,000 users at once', 'Booking response under 3 s', 'Secure payment over HTTPS', 'Available 99.9% of the time'] },
      ] },
    ],
    terms: [['IEEE 830', 'The IEEE recommended practice for writing an SRS.'], ['Specification language', 'A notation used to write requirements: natural, tabular, graphical or formal.']],
    exam: 'Give the IEEE 830 SRS outline, list what each part contains, and, if a system is named, write four functional and four non-functional requirements for it.',
    revise: ['Intro, overall description, specific requirements', 'Natural, tabular, graphical, formal specification'],
  },

  'se.u3.effort': {
    oneLine: 'Effort estimation predicts how many person-months a project needs, usually from its size (LOC or FP) using past data or a model such as COCOMO.',
    blocks: [
      '**Effort** is the total work, measured in **person-months** (PM). If a project needs 24 PM, 4 people could finish it in about 6 months (ignoring communication overhead).',
      { flow: ['Estimate the **size** (LOC or function points)', 'Use past productivity or a model to get **effort** (PM)', 'Derive **schedule** (months) and **staff** (people)', 'Derive **cost** = effort × cost per PM'] },
      { h: 'Approaches' },
      { ul: [
        '**Decomposition**: split the software into functions or tasks, estimate each, add up.',
        '**Empirical models**: formulas fitted on past projects, e.g. COCOMO: Effort = a × (KLOC)^b.',
        '**Expert judgement / analogy**: compare with a similar finished project.',
      ] },
      { tip: 'Estimates get better as the project goes on. Give a range and re-estimate after each phase.' },
    ],
    terms: [['Person-month', 'The work one person does in one month.'], ['Effort', 'Total work needed, in person-months.'], ['Empirical model', 'A formula built from data on past projects.']],
    exam: 'Define effort and person-month, show the size, effort, schedule, cost chain, and name the three approaches.',
    revise: ['Size → effort → schedule → cost', 'Decomposition, empirical (COCOMO), expert judgement'],
  },
}
