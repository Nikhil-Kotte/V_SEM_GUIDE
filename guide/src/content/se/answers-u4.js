// SE Unit IV model answers (design, architecture, coding, inspection). Keyed by PYQ id.
const P = 'Pressman, Software Engineering: A Practitioner\'s Approach'
const ARCH = 'unit3-cohesion-coupling-taxanomy of archi styles.pptx'
const SA = 'Software Architecture_Unit 4.docx'
const U4 = 'Unit 4.docx'
const FN = 'Function.docx'
const SWA = 'sw architecture and component design.pdf'

export default {
  // ---------------- Architecture ----------------
  'se-arch-styles': {
    blocks: [
      '**Software architecture** is the structure of the system: its components, their externally visible properties, and the relationships among them. **Architectural design** produces this structure from the requirements; it is the first step of design and shows how the system is organised before any module is detailed.',
      'An **architectural style** is a template for building a whole system. Each style describes a system category that encompasses:',
      { ol: ['A set of **components** (e.g. a database, computational modules) that perform a function.', 'A set of **connectors** that enable communication, coordination and cooperation among components.', '**Constraints** that define how components can be integrated.', '**Semantic models** that let a designer understand the overall properties by analysing its parts.'] },
      'Pressman\'s brief **taxonomy of architectural styles** has five styles:',
      { h: '1. Data-centred architecture' },
      { img: 'se-arch-data-centred' },
      'A **central data store** (file or database) is accessed frequently by other components that add, update, delete or modify data. Client software accesses the repository independently. In the **blackboard** variant, the repository notifies clients when data of interest changes. Clients can be added or changed without affecting others (**integrability**). *Example: hospital patient records, library catalogue, compilers\' symbol table, IDE repository.*',
      { h: '2. Data-flow architecture (pipes and filters)' },
      { img: 'se-arch-data-flow' },
      'Input data is transformed through a series of computational components called **filters**, connected by **pipes** that carry data from one to the next. Each filter works independently and does not need to know its neighbours. If the data flow degenerates into a single line of transforms, it is called **batch sequential**. *Example: compiler phases (lexical → syntax → semantic → code generation), Unix pipelines, payroll batch processing.*',
      { h: '3. Call-and-return architecture' },
      { img: 'se-arch-call-return' },
      'Produces a program structure that is relatively easy to modify and scale. Two sub-styles:',
      { ul: ['**Main program/subprogram**: functional decomposition into a control hierarchy where a main program invokes subprograms, which in turn invoke others.', '**Remote procedure call**: the components of a main program/subprogram architecture are distributed across multiple computers on a network.'] },
      '*Example: a traditional C program, client–server banking calls.*',
      { h: '4. Object-oriented architecture' },
      { img: 'se-arch-oo' },
      'Components encapsulate **data and the operations** that manipulate it. Communication and coordination between components is done by **message passing** (method calls). *Example: GUI frameworks, an online shopping system with Cart, Order, Payment objects.*',
      { h: '5. Layered architecture' },
      { img: 'se-arch-layered' },
      'A number of layers are defined, each accomplishing operations that progressively become closer to the machine instruction set. Outer layer: user-interface operations; inner layer: operating-system interfacing; intermediate layers: utility services and application software functions. *Example: OSI/TCP-IP stack, OS kernel, 3-tier web app (presentation, business, data).*',
      { h: 'Choosing a style' },
      'Styles can be **combined** (e.g. a layered system whose data layer is data-centred). The choice depends on requirements such as modifiability, performance and integrability; architectural design should evaluate alternatives (ATAM) before selecting.',
      { exam: 'For 10 marks: define style (4 elements), draw at least three diagrams, and give one real example per style.' },
    ],
    sources: [`${ARCH} slides 33–44`, `${SWA}`, `${P} §13.3`],
  },

  'se-data-centred': {
    blocks: [
      'In a **data-centred (repository) architecture**, a **data store** (a file or database) resides at the centre and is accessed frequently by other components that update, add, delete or otherwise modify data within the store.',
      { img: 'se-arch-data-centred' },
      { h: 'Components' },
      { ul: ['**Central data store / repository**: holds the shared data; the only way clients share information.', '**Client software (independent components)**: each accesses the store independently to read and write data.', '**Connectors**: the data-access requests (queries, transactions).'] },
      { h: 'Two variants' },
      { ul: ['**Passive repository**: clients pull data when they need it; the store does nothing on its own (e.g. a database accessed by many applications).', '**Blackboard**: the repository is **active**; it sends notifications to client software when data of interest to the client changes (e.g. AI/speech-recognition systems, sensor fusion).'] },
      { h: 'Properties' },
      { ul: ['**Integrability**: existing components can be changed and new clients added without concern about other clients, because clients are independent.', 'Data is managed consistently (backup, security, concurrency in one place).', 'Clients exchange data through the store, so they are loosely coupled to each other.', 'Drawback: the store is a single point of failure and a possible performance bottleneck; schema changes affect all clients.'] },
      { h: 'Example' },
      'A **hospital information system**: registration, pharmacy, laboratory, billing and doctor modules all work on one patient-records database. A new "insurance" module can be added without touching the others.',
    ],
    sources: [`${ARCH} slides 36–37`, `${SWA}`, `${P} §13.3.1`],
  },

  'se-arch-before-srs': {
    blocks: [
      { h: 'Why design the architecture before the SRS is complete' },
      { ul: [
        '**Requirements and architecture influence each other** (twin peaks): some requirements cannot be judged feasible, or costed, until a candidate architecture exists.',
        'An early architecture lets you **structure the requirements**: the SRS can be organised by subsystems.',
        '**Estimation and planning** need the major components and their sizes; architecture provides them.',
        '**Non-functional requirements** (performance, availability, security) are achieved mainly by architecture; an early architecture shows which targets are realistic.',
        '**Reuse and procurement**: deciding early which off-the-shelf components or platforms will be used shapes the remaining requirements.',
        '**Work division**: large systems are developed by several teams; architecture defines subsystem boundaries so each team can refine its own requirements in parallel.',
        '**Risk reduction**: architectural prototypes expose technical risks early.',
      ] },
      { h: 'Architecture vs module-level (component) design' },
      { table: { head: ['', 'Architectural design', 'Module-level / component design'], rows: [
        ['Level', 'Whole system: high-level structure', 'Inside each component'],
        ['Concerns', 'Components, connectors, styles, distribution, non-functional properties', 'Data structures, algorithms, interfaces, local processing logic'],
        ['Output', 'Architecture diagrams, subsystem interfaces', 'Pseudocode, flowcharts, detailed class/function designs'],
        ['Done by', 'Architects, early', 'Designers/programmers, after architecture'],
        ['Example', '"Use a 3-tier client-server with a central DB"', '"The search module uses a hash table and binary search"'],
      ] } },
      'The relationship: architecture **constrains and drives** module design; each module must fit an architectural component and respect its interfaces, while module design fills in the details.',
    ],
    sources: [`${SWA}`, `${P} §13.1, §14.1`],
  },

  // ---------------- Component-level design ----------------
  'se-design-principles': {
    blocks: [
      { h: 'The design process' },
      'Software design translates the requirements model into a **blueprint** for constructing the software. It is iterative: the design begins at a high level of abstraction (architecture, data and interfaces) and is **refined** to lower levels (component-level, algorithms, data structures). Each iteration is evaluated through **reviews** against quality guidelines. Design produces four models: data/class design, architectural design, interface design, component-level design.',
      { h: 'Basic design principles (Davis)' },
      { ol: [
        'The design process should **not suffer from "tunnel vision"**: consider alternative approaches.',
        'The design should be **traceable** to the analysis model.',
        'The design should **not reinvent the wheel**: reuse design patterns and components.',
        'The design should **minimise the intellectual distance** between the software and the problem as it exists in the real world.',
        'The design should exhibit **uniformity and integration**.',
        'The design should be **structured to accommodate change**.',
        'The design should be structured to **degrade gently** when faced with aberrant data, events or operating conditions.',
        '**Design is not coding**, coding is not design.',
        'The design should be **assessed for quality as it is being created**, not after the fact.',
        'The design should be **reviewed to minimise conceptual (semantic) errors**.',
      ] },
      { h: 'Design concepts that support them' },
      'Abstraction, architecture, patterns, separation of concerns, **modularity**, **information hiding**, **functional independence** (high cohesion, low coupling), stepwise refinement, refactoring, OO design principles (OCP, LSP, DIP, ISP).',
      { h: 'Motivation: why apply them?' },
      { ul: ['Produces designs that are **easy to understand, test, change and reuse**.', 'Catches errors **before coding**, when they are cheapest to fix.', 'Keeps the design aligned with requirements (traceability).', 'Makes the system **robust** under unexpected conditions.', 'Lets teams work in parallel on independent modules.'] },
    ],
    sources: [`${SA} §2`, `${SWA}`, `${P} §12.2–12.3`],
  },

  'se-component-guidelines': {
    blocks: [
      '**Component-level design** defines the data structures, algorithms, interface characteristics and communication mechanisms for each software component. Guidelines help produce components that are correct, understandable, reusable and maintainable.',
      { h: 'Ambler\'s guidelines (Pressman)' },
      { ul: [
        '**Components**: establish naming conventions; component names should come from the problem domain and be meaningful to stakeholders (e.g. FloorPlan, not Comp7); use stereotypes for infrastructure components.',
        '**Interfaces**: show interfaces with the lollipop notation; for consistency, interfaces flow from the left of the component box; show only interfaces relevant to the component being considered.',
        '**Dependencies and inheritance**: model dependencies left to right and inheritance bottom (derived) to top (base); dependencies between components should be represented via interfaces, not direct component-to-component links.',
      ] },
      { h: 'General design guidelines (notes)' },
      { ol: [
        '**Functional independence**: each component does one clear task (high cohesion) and depends on others only when necessary (low coupling).',
        '**Information hiding**: hide internal data and algorithms; expose only operations (e.g. payFee(), getPaymentStatus()).',
        '**Modularity**: balance module size against integration effort.',
        '**Abstraction**: describe what a component does before how (calculateGrade(marks)).',
        '**Stepwise refinement**: refine operations top-down until ready for coding.',
        '**Simplicity and consistency**: simple algorithms, consistent names, no duplicated logic, suitable data structures, refactor when needed.',
        '**Design for testability and maintainability**: clear inputs, outputs and dependencies.',
      ] },
      { h: 'Steps in component-level design' },
      { steps: ['Identify all design classes/components from the problem domain.', 'Identify infrastructure classes (GUI, OS, data management).', 'Elaborate classes: specify message details, interfaces, attributes, data structures, and processing logic of each operation.', 'Describe persistent data sources (databases, files).', 'Develop behavioural representations (state diagrams).', 'Elaborate deployment diagrams.', 'Refactor every design representation and consider alternatives.'] },
      { h: 'Example' },
      'College system "Fee Payment" component: interface PaymentMethod with pay(amount); implementations UPIPayment, CardPayment (OCP, DIP); internal transaction list hidden (information hiding); validation of amount ≥ 0 (degrade gently).',
    ],
    sources: [`${SA} §3`, `${SWA} p1180–1195`, `${P} §14.3–14.4`],
  },

  'se-ocp': {
    blocks: [
      '**Open-Closed Principle (OCP)**: "A module (component) should be **open for extension but closed for modification**." The designer should specify the component so that it can be extended (within its functional domain) **without** making internal code or logic modifications to the component itself.',
      'This is achieved by creating **abstractions (interfaces / abstract classes)** that serve as a buffer between the functionality likely to be extended and the design class itself.',
      { h: 'Diagram (in words)' },
      { code: '        +-------------------+          <<interface>>\n        |     Checkout      |--------> PaymentMethod\n        +-------------------+          + pay(amount)\n                                         ^      ^      ^\n                                         |      |      |\n                                     UPIPay  CardPay  NetBanking  <- new class added\n                                                                    (Checkout unchanged)' },
      { h: 'Example' },
      'A payment system supports UPI. Later, credit cards and net banking are needed. **Poor design**: one big processPayment() with if/else for each type, edited every time (modification risks breaking tested code). **OCP design**: Checkout depends on a PaymentMethod interface; each method is a separate class. Adding net banking = adding a new class; Checkout is not modified.',
      'Pressman\'s example: a SafeHome **Detector** interface; Window/door sensor, Motion detector, Heat sensor, Smoke sensor all implement it, so the Sensor component can support new sensor types without change.',
      { h: 'Benefits' },
      { ul: ['Existing, tested code is not touched → fewer new bugs.', 'Easy to add features (extensibility).', 'Encourages loose coupling through abstractions.'] },
    ],
    sources: [`${SA} §2.1`, `${SWA}`, `${P} §14.2.1`],
  },

  'se-good-design': {
    blocks: [
      'A **good design** correctly implements the requirements and is easy to understand, build, test and change. Characteristics (Pressman\'s quality guidelines):',
      { ol: [
        '**Correctness and completeness**: implements all explicit requirements in the analysis model and accommodates implicit requirements.',
        '**Understandability**: readable, understandable guide for coders, testers and maintainers.',
        '**Modularity**: logically partitioned into elements or subsystems.',
        '**High cohesion and low coupling** (functional independence): components with independent functional characteristics.',
        '**Architecture** created using recognisable styles and patterns, with components that have good design characteristics, and that can be implemented evolutionarily.',
        '**Distinct representations** of data, architecture, interfaces and components.',
        '**Appropriate data structures** drawn from recognisable data patterns.',
        '**Simple interfaces** that reduce the complexity of connections between components and with the environment.',
        '**Traceability**: derived using a repeatable method driven by requirements analysis.',
        '**Maintainability and flexibility**: easy to modify and extend; degrades gently.',
        '**Efficiency**: makes good use of resources.',
      ] },
      'Design quality attributes (HP\'s **FURPS**): Functionality, Usability, Reliability, Performance, Supportability.',
    ],
    sources: [`${SWA}`, `${P} §12.2.1`],
  },

  'se-ds-algos': {
    blocks: [
      'Component-level design specifies, for each component, its **data structures** (how data is stored inside it) and its **algorithms** (the processing logic). Choosing them well is central to the component\'s quality.',
      { h: 'Why the right data structures matter' },
      { ul: ['**Performance**: lookup in a hash table is O(1) on average vs O(n) in a list; a sorted array allows binary search.', '**Memory use**: a sparse matrix stored as a list of non-zero entries saves space.', '**Simplicity and correctness**: a structure that mirrors the problem (queue for print jobs, tree for a file system, graph for a road map) makes the algorithm simpler and less error-prone.', '**Information hiding**: an abstract data type hides the representation, so it can change without affecting other components.', '**Maintainability and reuse**: standard structures from libraries are well tested.'] },
      { h: 'Why the right algorithms matter' },
      { ul: ['Determine **response time and scalability** (sorting 1 million records with O(n log n) vs O(n²)).', 'Must be **correct** for all inputs, including boundaries and invalid data.', 'Should be expressed with **structured constructs** (sequence, selection, repetition) so they are easy to verify and test.', 'Clear algorithms ease code inspection and white-box testing.'] },
      { h: 'Example' },
      'A library component "Search book by ISBN": storing books in a hash map keyed by ISBN gives instant lookup; storing them in an unsorted list would make every search scan the whole collection. The "Issue book" algorithm must check availability, member limits and due dates in a defined order (sequence + selection).',
      { h: 'Design guidelines' },
      'Select data structures appropriate to the problem; prefer straightforward algorithms; specify them in pseudocode or flowcharts during design; review them before coding; refactor when a simpler structure exists.',
    ],
    sources: [`${SA} §1, §3.6, "Designing Traditional Components"`, `${P} §14.5`],
  },

  // ---------------- Coupling, cohesion, modularity ----------------
  'se-coupling-cohesion': {
    blocks: [
      '**Functional independence** is achieved by modules with a single-minded function and minimal interaction with other modules. It is measured with two criteria:',
      { ul: ['**Cohesion**: the degree to which the elements **inside a module** belong together; a measure of the module\'s internal strength. A cohesive module does just one thing.', '**Coupling**: the degree of **interdependence between modules**; depends on the interface complexity, the point of entry and what data passes across the interface.'] },
      'A good design has **high cohesion and low coupling**.',
      { h: 'Types of cohesion (best → worst)' },
      { img: 'se-cohesion-types' },
      { ol: ['**Functional**: all elements contribute to a single, well-defined task (e.g. computeSquareRoot).', '**Sequential**: output of one element is input to the next (read → validate → store).', '**Communicational**: elements operate on the same input or output data (update and print the same record).', '**Procedural**: elements follow a specific sequence of execution but on different data.', '**Temporal**: elements are executed at the same time (initialisation, shutdown).', '**Logical**: elements do logically similar operations, selected by a flag (all input routines in one module).', '**Coincidental**: elements are unrelated; grouped arbitrarily.'] },
      { h: 'Types of coupling (best → worst)' },
      { img: 'se-coupling-types' },
      { ol: ['**No direct coupling**: modules are independent.', '**Data coupling**: modules exchange only elementary data parameters.', '**Stamp coupling**: a whole data structure is passed when only part is needed.', '**Control coupling**: one module passes a control flag that directs the other\'s logic.', '**External coupling**: modules depend on an external format, device or protocol.', '**Common coupling**: modules share global data.', '**Content coupling**: one module modifies or branches into the internals of another.'] },
      { h: 'Why it matters' },
      'High cohesion makes modules easier to understand, test and reuse; low coupling limits the **ripple effect** of changes and errors, eases maintenance and improves portability.',
    ],
    sources: [`${ARCH} slides 1–24`, `${FN}`, `${P} §12.3.8`],
  },

  'se-cohesion-levels': {
    blocks: [
      'Cohesion levels, from highest (best) to lowest (worst), with their implications:',
      { table: { head: ['Level', 'Meaning', 'Example', 'Comprehension', 'Reusability'], rows: [
        ['**Functional**', 'Every element contributes to one task', 'calculateNetSalary()', 'Excellent: the name says it all', 'Excellent'],
        ['**Sequential**', 'Output of one part feeds the next', 'readMarks → computeGrade → storeResult', 'Good', 'Good, though tied to this sequence'],
        ['**Communicational**', 'Parts use the same data', 'Update a student record and print it', 'Fair', 'Limited: callers may want only one action'],
        ['**Procedural**', 'Parts follow a control sequence, different data', 'Check file, open it, read header', 'Fair to poor', 'Poor'],
        ['**Temporal**', 'Parts run at the same time', 'initialise(): open files, reset counters, clear screen', 'Poor: unrelated steps', 'Poor'],
        ['**Logical**', 'Similar operations chosen by a flag', 'inputAll(type) handles keyboard, file, network', 'Poor: must trace the flag', 'Poor; also creates control coupling'],
        ['**Coincidental**', 'No meaningful relation', 'utils module with random functions', 'Very poor', 'Very poor'],
      ] } },
      { img: 'se-cohesion-types' },
      { h: 'Implications' },
      { ul: ['**Code comprehension**: a functionally cohesive module can be understood from its name and interface; low-cohesion modules force the reader to understand several unrelated concerns and the flags that select between them.', '**Reusability**: high-cohesion modules do one job, so they fit other systems; low-cohesion modules drag unwanted behaviour with them.', '**Maintainability and testing**: changes and tests are localised in high-cohesion modules.', 'Designers should aim for functional, sequential or communicational cohesion and refactor modules with the lower levels.'] },
    ],
    sources: [`${ARCH} slides 6–14`, `${FN}`, `${P} §12.3.8`],
  },

  'se-modular-design': {
    blocks: [
      '**Modularity** is the single attribute of software that allows a program to be intellectually manageable. **Modular design** divides software into separately named and addressable components (**modules**) that are integrated to satisfy the requirements.',
      { h: 'Why it is needed' },
      { ul: ['**Divide and conquer**: a monolithic program with many control paths and variables is nearly impossible to understand. Splitting reduces complexity.', '**Easier development**: modules can be built and tested in parallel by different people.', '**Easier change**: changes are localised, with fewer ripple effects.', '**Reuse**: well-defined modules can be reused.', '**Easier testing and debugging**: errors can be isolated to a module.'] },
      { h: 'How many modules?' },
      'As the number of modules grows, the effort per module falls but the **integration (interface) cost** rises. Total cost is minimised in a region of **optimal modularity (M)**: neither too many tiny modules nor too few large ones.',
      { h: 'Criteria for effective modularity (Meyer)' },
      'Modular decomposability, composability, understandability, continuity (small requirement change → change in few modules), protection (errors stay inside a module).',
      { h: 'Example' },
      'College management system → modules: Student Registration, Attendance, Examination, Fee Payment, Report Generation. Each has its own data and interface; a change to fee rules touches only Fee Payment.',
      'Good modules are **functionally independent**: high cohesion, low coupling, and they hide their internal details (information hiding).',
    ],
    sources: [`${SA} §3.3`, `${SWA}`, `${P} §12.3.5`],
  },

  'se-external-coupling': {
    blocks: [
      '**External coupling** occurs when a component communicates or collaborates with **infrastructure components** outside the problem domain: operating system functions, database capability, telecommunication functions, devices or external file formats.',
      { h: 'Is it reasonable to say problem-domain components should never exhibit external coupling?' },
      '**Largely yes, as a design goal.** Problem-domain components (e.g. Order, Student, Account) should model business concepts only. If they call the OS, database or devices directly, they become tied to that platform, harder to reuse, test and port. Pressman notes that although external coupling is **necessary**, it should be **limited to a small number of components or classes** within a system.',
      'It is not absolute: some domain logic must eventually reach a device or database, but it should do so **through an interface/adapter** (dependency inversion), not directly.',
      { h: 'Which components would exhibit external coupling?' },
      { ul: ['**Infrastructure / system components**: database access layer (DAO/repository), file I/O managers.', '**Device drivers and hardware interface** components (sensor, printer, card reader).', '**Communication components**: network, messaging, external API clients.', '**Operating-system interface** components and UI frameworks.'] },
      { h: 'Example' },
      'In a SafeHome system, the AlarmZone (domain) asks a SensorInterface; only the SensorDriver component talks to the hardware port. Replacing the hardware changes only the driver.',
    ],
    sources: [`${ARCH} coupling slides`, `${P} §14.2.4`],
  },

  'se-coupling-global': {
    blocks: [
      'Sharing a **global variable x** between modules A and B is **common coupling**, the second-worst level: either module can change x unexpectedly, errors are hard to trace, and the modules cannot be reused separately.',
      { h: 'Design to minimise coupling' },
      { ol: [
        '**Pass x as a parameter (data coupling)**: A computes x and calls B with it, or B returns x to A. Only the elementary value crosses the interface.',
        '**Encapsulate x in its own module (information hiding)**: a module (or class) owns x and provides getX() / setX() (with validation). A and B depend only on this interface, not on the variable.',
        'If x must be shared over time, make the owner the **only writer**; others read through a function.',
        'Avoid passing **control flags** together with x (would add control coupling).',
      ] },
      { h: 'Example' },
      { code: '// Before: common coupling\nint total;              // global\nvoid A() { total = computeMarks(); }\nvoid B() { print(total); }\n\n// After: data coupling\nint A() { return computeMarks(); }\nvoid B(int total) { print(total); }\nmain() { int t = A(); B(t); }\n\n// Or: information hiding\nclass MarksStore { private int total; int get(); void set(int t); }' },
      'Now B works with any value given to it, A can be tested alone, and changing how total is stored affects only one place.',
    ],
    sources: [`${ARCH} coupling slides`, `${FN}`, `${P} §12.3.8`],
  },

  'se-coupling-portability': {
    blocks: [
      '**Portability** is the effort needed to transfer software to another hardware or software environment. **Coupling** (especially to the environment) directly affects it: the more modules are tied to platform-specific features, the more modules must change when the platform changes.',
      { ul: [
        '**External coupling** to OS calls, specific devices, file formats or a vendor\'s database spreads platform dependencies through the code → poor portability.',
        '**Common coupling** through global data or **content coupling** makes it hard to replace one module without touching others.',
        '**Low coupling** confines platform-specific code to a few modules (adapters/drivers); only those need rewriting when porting.',
      ] },
      { h: 'Examples' },
      { ul: ['A Windows app whose business modules call the Win32 API directly must change everywhere to run on Linux; if all OS calls go through one "PlatformServices" module, only that module is rewritten.', 'An app that uses raw Oracle-specific SQL in every class is tied to Oracle; using a data-access layer (repository) lets it move to MySQL by changing one layer.', 'Java\'s JVM is a large-scale example: programs are coupled to the JVM interface, not the OS.'] },
      'Therefore: **lower coupling → higher portability** (and reusability).',
    ],
    sources: [`${ARCH} coupling slides`, `${P} §12.3.8, §19.2 (McCall portability)`],
  },

  // ---------------- Function- and flow-oriented modelling ----------------
  'se-function-oriented': {
    blocks: [
      '**Function-oriented design** views the system as a set of **functions** that transform inputs into outputs. Starting from a high-level view of the system\'s function, it is decomposed **top-down** into more detailed functions, while the system state is centralised and shared among them.',
      { h: 'Goal' },
      'To decompose the system into a **hierarchy of modules** (functions), each with a single well-defined purpose, high cohesion and low coupling, so that the design is easy to understand, implement and maintain. It maps naturally to call-and-return architectures through structured design.',
      { h: 'Structure chart' },
      'A **structure chart** shows the module hierarchy: which module calls which, and the data and control passed between them. It is derived from the DFD (transform or transaction analysis).',
      { img: 'se-sc-elements' },
      { ul: ['**Module**: rectangle (a library/predefined module has double edges).', '**Call (invocation)**: arrow from caller to called module.', '**Data couple**: arrow with a hollow circle: data passed.', '**Control couple (flag)**: arrow with a filled circle: control information.', '**Condition / selection**: diamond at the bottom of a module: one of several modules is called.', '**Loop / iteration**: curved arrow over calls that are repeated.'] },
      { h: 'Example' },
      { img: 'se-sc-example' },
      'Main calls Configure, Process and UpdateReport; Process calls GetInput, CalculateArea and Display; data couples show the values passed.',
      { h: 'Use of structure charts' },
      'They show the program structure clearly before coding, help evaluate coupling and cohesion, and guide implementation and integration testing (top-down order).',
    ],
    sources: [`${FN}`, `${U4} "Structured Design"`, `${P} §12`],
  },

  'se-structured-design': {
    blocks: [
      '**Structured design** is a function-oriented methodology that converts the structured analysis (DFDs) into a **modular program structure** (structure chart). Its principles:',
      { ol: [
        '**Top-down decomposition**: start from the system\'s main function and refine it step by step into sub-functions until each is simple enough to code.',
        '**Modularity**: divide the system into separately named modules.',
        '**Functional independence**: each module performs a single function (**high cohesion**) and interacts minimally with others (**low coupling**).',
        '**Information hiding / abstraction**: a module\'s internal details are hidden; only its interface is known.',
        '**Hierarchy of control**: a clear calling hierarchy (fan-out from managers to workers; avoid very wide or deep structures; high fan-in for reused utility modules).',
        '**Use of structured programming constructs**: sequence, selection, iteration only.',
        '**Transform and transaction analysis**: map the DFD into a structure chart by identifying the central transform (input, processing, output branches) or the transaction centre.',
        '**Scope of effect within scope of control**: a decision should affect only modules that are subordinate to the module making it.',
      ] },
      { h: 'Steps' },
      { steps: ['Draw DFDs (structured analysis).', 'Identify the flow type: transform or transaction.', 'Find the central transform / transaction centre.', 'Map to a first-cut structure chart.', 'Refine using cohesion/coupling heuristics.', 'Update the data dictionary and review with stakeholders.'] },
      { h: 'Advantages and limitations' },
      { compare: [
        { title: 'Advantages', items: ['Clarity and simplicity of structure', 'Good documentation (charts, pseudocode)', 'Scalable via modules', 'Suits legacy and large, stable systems'] },
        { title: 'Limitations', items: ['Can be rigid when requirements change', 'Emphasises data flow over UI/external interactions', 'Learning curve', 'Less suited to agile development'] },
      ] },
    ],
    sources: [`${U4} "Structured Design"`, `${FN}`, `${P} (structured design/transform mapping)`],
  },

  'se-flow-oriented': {
    blocks: [
      '**Flow-oriented modelling** represents how **data objects are transformed** as they move through the system. Although considered an older technique, it remains one of the most widely used requirements-analysis notations. Its main tool is the **data flow diagram (DFD)**, supported by a data dictionary and process specifications.',
      { h: 'DFD notation' },
      { img: 'se-dfd-symbols' },
      { ul: ['**External entity** (rectangle): producer or consumer of data outside the system.', '**Process / transform** (circle/bubble): transforms input data into output.', '**Data flow** (labelled arrow).', '**Data store** (open rectangle / parallel lines).'] },
      { h: 'Levelling' },
      'The **level-0 DFD (context diagram)** shows the whole system as one bubble with its external entities. Each bubble is refined into a lower-level DFD (level 1, level 2 …), keeping **information-flow continuity** (inputs and outputs of a bubble match those of its refinement). A typical refinement ratio is 3–7 bubbles per level.',
      { h: 'Example: library system' },
      { img: 'se-dfd-l0-library' },
      { img: 'se-dfd-l1' },
      { h: 'Guidelines' },
      { ul: ['Level 0 shows the software as a single bubble.', 'Note all primary inputs and outputs.', 'Refine by isolating candidate processes, data objects and stores.', 'Label all arrows and bubbles with meaningful names.', 'Maintain information-flow continuity between levels.', 'Refine one bubble at a time.'] },
      { h: 'Control flow model' },
      'For event-driven systems, a control flow model (control flow diagram, control specification with state diagrams) is added alongside the DFD.',
    ],
    sources: [`${U4}`, `${P} §11.4 (flow-oriented modelling)`],
  },

  'se-dfd': {
    blocks: [
      { h: 'Why model with DFDs?' },
      { ul: ['**Simple notation** (four symbols) that customers and developers both understand: good for validating requirements.', 'Shows **what** the system does with data, independent of how it will be implemented.', '**Levelling** controls complexity: start with the context diagram and refine.', 'Identifies **data stores and interfaces** clearly; supports the data dictionary.', 'Maps directly into a **program structure** (structure chart) during structured design.'] },
      { h: 'Example: ATM system' },
      { img: 'se-u4-img1' },
      { h: 'Level 0 (context)' },
      'External entities: **Customer**, **Bank database**. Process: 0 ATM System. Flows: card + PIN, transaction request → ATM; cash, receipt, messages → Customer; account queries/updates ↔ Bank.',
      { h: 'Level 1' },
      { ol: ['**1.0 Authenticate customer**: reads card and PIN, checks against Account store → valid/invalid.', '**2.0 Process transaction**: withdrawal/deposit/balance enquiry; reads and updates the Account store; writes the Transaction store.', '**3.0 Dispense cash & print receipt**: outputs cash and receipt to the customer.'] },
      'Data stores: D1 Accounts, D2 Transactions.',
      { h: 'Library example (refinement)' },
      { img: 'se-dfd-l1' },
      { img: 'se-dfd-l2' },
      { tip: 'In the exam: draw the symbols legend, a level-0 and a level-1 DFD, label every arrow, and number processes (1.0, 2.0; 1.1, 1.2 …).' },
    ],
    sources: [`${U4}`, `${P} §11.4`],
  },

  // ---------------- Coding & inspection ----------------
  'se-coding-principles': {
    blocks: [
      '**Coding** translates the component design into a programming language. The objective is not merely a program that runs, but code that is **correct, readable, testable and maintainable**.',
      { h: 'Coding principles' },
      { ol: ['**Follow the design**: implement the specified algorithms, interfaces and data structures.', '**Keep modules small and focused**: one responsibility per function.', '**Use meaningful identifiers** (price, quantity, total_cost instead of a, b, c).', '**Use structured programming**: sequence, selection, repetition; avoid goto/spaghetti flow.', '**Avoid duplication**: move repeated logic into functions.', '**Validate inputs**: check invalid, missing or out-of-range values.', '**Handle errors properly**: don\'t silently ignore exceptions.', '**Protect data**: don\'t expose passwords or internal data.', '**Make code testable**: separate business logic from UI and external dependencies.', '**Refactor** to improve structure without changing behaviour.'] },
      { h: 'Coding guidelines / standards' },
      { ul: ['Consistent **naming conventions** and indentation/layout.', '**Comments** for each module (purpose, inputs, outputs, author, history) and for non-obvious logic, but don\'t restate the code.', 'Limit function length and nesting depth; one statement per line.', 'Avoid global variables and side effects; use constants instead of magic numbers.', 'Avoid clever, obscure code; prefer clarity.', 'Use language-specific idioms and the team\'s style guide; run static analysers.', 'Write unit tests along with code; check code into version control frequently.'] },
      { h: 'Example' },
      { code: '# Poor\nm = int(input("Marks: "))\nif m >= 40: print("pass")\nelse: print("fail")\n\n# Improved\nPASS_MARK = 40\ndef get_result(marks):\n    if not 0 <= marks <= 100:\n        raise ValueError("Marks must be between 0 and 100")\n    return "PASS" if marks >= PASS_MARK else "FAIL"' },
      'The improved version uses a named constant, validates input, separates logic into a testable function and uses a clear name.',
    ],
    sources: [`${SA} "Coding Principles and Guidelines"`, `${P} §7.3.4 (coding principles)`],
  },

  'se-code-review-report': {
    blocks: [
      'After a review (inspection), the recorder prepares a **review summary report** answering: What was reviewed? Who reviewed it? What were the findings and conclusions? Together with the **review issues list**, it becomes part of the project record. Rules used to evaluate it:',
      { ol: [
        '**Completeness of identification**: the product/module, version and size (LOC) reviewed are stated, with the date and duration.',
        '**Participants**: the review leader, reviewers, recorder and author are listed, along with each reviewer\'s **preparation time**.',
        '**Findings**: every defect is listed with location, type (logic, interface, standards, data) and **severity (major/minor)**.',
        '**Decision recorded**: one of **accept without modification**, **reject** (severe errors; another review needed after correction), or **accept provisionally** (minor errors; no further review, but corrections must be verified).',
        '**Metrics**: total defects, defect density (defects/KLOC), review rate (LOC/hour), preparation effort, so the effectiveness can be compared with historical norms.',
        '**Action items**: each issue has an owner and due date; follow-up/verification is planned.',
        '**Sign-off**: all participants sign, indicating their agreement with the findings and decision.',
        '**Product focus**: the report criticises the product, not the producer.',
      ] },
      { h: 'Evaluating the numbers' },
      'If the review rate was too high (e.g. > 500 LOC/hour) or preparation too short, or defect density is far below norms, the review may have been superficial and should be repeated. Very high defect density means the module itself should be reworked or redesigned.',
    ],
    sources: ['unit 5-review techniques.pdf', `${SA} "Code Inspection – Planning"`, `${P} §20.6.2`],
  },

  'se-code-inspection': {
    blocks: [
      '**Code inspection** is a formal, systematic **static** review of source code (without executing it) by a team, to find defects such as incorrect logic, missing conditions, interface mismatches, improper data handling, standard violations and security problems.',
      { img: 'se-inspection' },
      { h: 'Process' },
      { steps: ['**Planning**: select the work product, define objectives, choose participants and roles (moderator, author, reader, recorder, inspectors), distribute materials, schedule, set entry criteria.', '**Overview** (optional): author explains the code.', '**Preparation**: each inspector studies the code alone using a checklist and notes suspected defects.', '**Inspection meeting**: the reader paraphrases the code; defects are found and logged (not fixed).', '**Rework**: the author fixes defects.', '**Follow-up**: the moderator verifies the fixes and checks exit criteria.'] },
      { h: 'Guidelines for the group review meeting (FTR)' },
      { ul: ['Typically **3–5 people**; advance preparation **≤ 2 hours** per person; meeting **≤ 2 hours**.', '**Review the product, not the producer**.', '**Set an agenda and maintain it**.', '**Limit debate and rebuttal**; record issues for offline resolution.', '**Enunciate problem areas, but don\'t try to solve every problem**.', '**Take written notes** (recorder).', '**Limit the number of participants and insist on advance preparation**.', '**Develop a checklist** for each product type.', '**Allocate resources and schedule** time for reviews.', '**Conduct meaningful training** for reviewers.', '**Review your early reviews**.'] },
      { h: 'Use of the group review meeting' },
      'It pools the knowledge of several people to find errors one person misses, spreads knowledge of the code across the team, enforces standards, and produces records (issue list, summary report) for tracking quality.',
      { h: 'Example' },
      'Requirement: purchases of ₹1,000 or more get 10% discount. Code: if (amount > 1000) → the inspector flags a boundary defect; it should be >=.',
    ],
    sources: [`${SA} "Code Inspection – Planning"`, 'unit 5-review techniques.pdf', `${P} §20.6`],
  },

  'se-num-defect-density': {
    blocks: [
      { formula: 'Defect density = number of defects ÷ size (KLOC)' },
      { ul: ['Size = 0.350 KLOC', 'Minor defects = 9 → minor-defect density = 9 ÷ 0.350 = **25.7 per KLOC**', 'Major defects = 5 → major-defect density = 5 ÷ 0.350 = **14.3 per KLOC**', 'Total = 14 → overall defect density = 14 ÷ 0.350 = **40 defects per KLOC**'] },
      'Comparing these values with the organisation\'s historical figures (e.g. 10–15 defects/KLOC found in inspections) tells whether the module is unusually error-prone and whether it needs rework or re-inspection.',
    ],
    sources: ["SE Dec '22–Jan '23 paper"],
  },

  'se-pred-incremental': {
    blocks: [
      '**Incremental development of code** means building and testing the program in **small pieces** instead of writing all the code first and testing at the end ("write a little, test a little").',
      { img: 'se-sa-img21' },
      { steps: ['Identify requirements and divide them into increments.', 'Prioritise features by importance and dependency.', 'Design the selected increment.', 'Write the code following coding standards.', 'Unit-test it and integrate it with the existing working code; run regression tests.', 'Deliver/demonstrate the increment and collect feedback.', 'Refine the design and move to the next increment.'] },
      { h: 'Example' },
      'College management system: increment 1 student registration; increment 2 attendance; increment 3 exams and results; increment 4 fee payment; increment 5 reports.',
      { compare: [
        { title: 'Advantages', items: ['Working software early', 'Errors found while the code is small and fresh', 'Easier testing and debugging', 'User feedback shapes later increments', 'Progress is measurable'] },
        { title: 'Challenges', items: ['Dependencies between increments need planning', 'Integration problems as features grow', 'Technical debt without refactoring', 'Needs regression testing to protect old features'] },
      ] },
      { note: 'Incremental = add functionality in stages; iterative = improve a solution through repeated cycles. Projects often use both. Test-driven development is an extreme form: write a test, then just enough code to pass it.' },
    ],
    sources: [`${SA} "Incremental Development of Code"`],
  },
}
