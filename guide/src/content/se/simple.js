// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default {
  "se.u3.cocomo": {
    "summary": "**COCOMO** means **Constructive Cost Model**. It uses past project data to estimate the work and time needed to build software. Its basic input is **KLOC**, meaning thousands of delivered lines of code.",
    "points": [
      "**Effort (E)** measures work in **person-months**. One person-month means one person working for one month. **Development time (D)** is the project’s duration in months.",
      "**Basic COCOMO** uses E = a × KLOCᵇ and D = c × Eᵈ. The constants a, b, c and d depend on the project’s **mode**, or type.",
      "**Organic** means a small team doing familiar work with flexible requirements. **Semi-detached** means a medium-sized project with mixed team experience. **Embedded** means work under tight hardware or regulatory constraints.",
      "**Average staff** = E ÷ D. **Productivity** = KLOC ÷ E, measured in KLOC per person-month. Multiply by 1,000 to express it in lines per person-month.",
      "**Intermediate COCOMO** adjusts effort using an **Effort Adjustment Factor (EAF)**: the product of 15 cost-driver multipliers. These reflect factors such as complexity, reliability and team capability. **Detailed COCOMO** applies cost drivers to individual development phases.",
      "**COCOMO II’s application composition model** uses **object points**: weighted counts of screens, reports and third-generation-language components. **New object points (NOP)** remove the reused percentage. Effort = NOP ÷ **PROD**, the productivity rate."
    ],
    "analogy": "Like estimating house-building work from floor area, COCOMO starts with software size and accounts for the kind of job.",
    "example": "For a **200 KLOC semi-detached** project, Basic COCOMO estimates about **1,133 person-months**, **29.3 months**, and **39 people on average**."
  },
  "se.u3.decomposition": {
    "summary": "**Decomposition techniques** make software estimation easier. Break a large job into smaller parts, estimate each part, and add the estimates to find the total effort and cost.",
    "points": [
      "**Problem-based estimation** splits the software into functions, such as login and billing. Estimate each function’s **software size** using **LOC** (lines of code) or **FP** (function points, a measure of the functionality provided to users). Then add the sizes.",
      "**Productivity** means output per unit of effort, such as LOC per **person-month**. One person-month means one person’s work for one month. Divide estimated size by productivity from past projects to estimate effort. Multiply effort by cost per person-month to estimate cost.",
      "**Process-based estimation** splits the work into activities: analysis, design, coding, and testing. For each function, estimate the effort for each activity. Add these estimates. Software size helps you understand how much work is involved.",
      "Four ways to reduce estimation risk are: estimate later, use similar past projects, use decomposition, and use **empirical models** such as **COCOMO**, which use relationships developed from project data. Waiting until late is usually impractical.",
      "Use at least two estimation methods and compare their answers. Large differences suggest that the project’s scope or assumptions need another look.",
      "**Delphi technique** uses anonymous expert estimates and repeated revisions to reach agreement. **Recursive estimation** starts with the whole job, then repeatedly refines estimates through smaller parts."
    ],
    "analogy": "Like estimating a grocery bill: estimate each item’s cost, then add them.",
    "example": "Two functions total 1,240 LOC. At 620 LOC per person-month, estimated effort is 2 person-months."
  },
  "se.u3.fp": {
    "summary": "**Function Point (FP)-Based Estimation** measures software size by the functions it provides to users. This size helps estimate the work and cost needed to build it.",
    "points": [
      "**External Inputs (EI)** bring data into the system, such as a registration form. **External Outputs (EO)** send processed information out, such as a calculated bill.",
      "**External Inquiries (EQ)** retrieve information without updating stored data, such as checking an order’s status.",
      "**Internal Logical Files (ILF)** are related data groups maintained by the software. **External Interface Files (EIF)** are data groups it uses but another system maintains.",
      "Classify each function as simple, average or complex. Multiply each count by its textbook weight, then add the results. This gives **Unadjusted Function Points (UFP)**.",
      "Rate each of the **14 general system characteristics**, such as performance and reusability, from 0 to 5. Add these ratings to get **ΣFi**. The **Complexity Adjustment Factor (CAF)**, also called **VAF**, is 0.65 + 0.01 × ΣFi. Then **FP = UFP × CAF**.",
      "**Effort** in person-months = FP ÷ productivity in FP per person-month. A person-month means one person’s work for one month. FP also helps compare productivity, measure defects per FP and track growing requirements."
    ],
    "analogy": "Think of estimating a catering job: count the dishes, give harder dishes more weight, then adjust for extra service demands.",
    "example": "For 50 inputs, 40 outputs, 35 inquiries, 6 internal files and 4 external interface files, all average: **UFP = 50×4 + 40×5 + 35×4 + 6×10 + 4×7 = 628**. Assuming all 14 ratings are 3, **ΣFi = 42**, **CAF = 1.07**, and **FP = 628×1.07 ≈ 672**."
  },
  "se.u3.loc": {
    "summary": "**LOC-based estimation** uses the expected number of **Lines of Code (LOC)** to estimate the work and cost of building software. First, split the software into functions, such as a user interface or database management.",
    "points": [
      "Estimate the LOC needed for each function. Add these estimates to get **Total LOC**.",
      "**Productivity** means how many lines one person can produce in a month. Use productivity data from similar past projects.",
      "**Effort** is the amount of work needed. **Effort = Total LOC ÷ Productivity**. It is measured in **person-months (pm)**. One person-month means one person’s work for one month.",
      "**Labour rate** is the cost per person per month. **Cost = Effort × Labour rate**. Also, **Cost per LOC = Labour rate ÷ Productivity**.",
      "**LOC-based estimation** measures program size and depends on the programming language. **Function Point (FP) estimation** measures functionality delivered to users and is language independent.",
      "LOC estimates become easier when the design is understood. FP estimates can start from requirements, but counting them needs training."
    ],
    "analogy": "Think of painting walls. Wall area is like LOC. Area painted per worker per month is like productivity. Dividing the total area by productivity gives the work needed.",
    "example": "For the CAD software, the function estimates total **33,200 LOC**. Productivity is **620 LOC/pm**, and labour costs **Rs 8,000 per person-month**. Effort = 33,200 ÷ 620 ≈ **53.5 person-months**. Cost per LOC ≈ **Rs 12.90**. Using the unrounded effort, total cost ≈ **Rs 4,28,387**, or **Rs 4.28 lakh**."
  },
  "se.u3.problem-based": {
    "summary": "**Problem-Based Estimation** means splitting software into smaller functions and estimating each function’s size. You then use past project data to estimate the total work and cost.",
    "points": [
      "Start with a clear **scope**. This states what the software will do and what is outside the project.",
      "Use **decomposition**, which means breaking the software into smaller functions. Keep splitting until you can estimate each function with confidence.",
      "Measure size using **LOC (Lines of Code)** or **FP (Function Points)**. LOC measures code length. FP measures the functionality provided to users.",
      "For each function, make a **three-point estimate**: **optimistic (Sopt)** means the smallest reasonable size, **most likely (Sm)** means the size you expect, and **pessimistic (Spess)** means the largest reasonable size. Calculate the **weighted (beta) average**: **S = (Sopt + 4 × Sm + Spess) / 6**. The most likely value gets more weight.",
      "Add the expected sizes. Divide by **historical productivity**, meaning size produced per person-month on similar projects in your organisation. This gives **effort**. Multiply effort by cost per person-month to estimate cost. A **person-month** is one person’s work for one month.",
      "Make both LOC and FP estimates and compare them. Record actual results afterwards to improve future estimates."
    ],
    "analogy": "It is like estimating painting work room by room, then using your past painting speed to estimate the total work.",
    "example": "For a geometric analysis function, estimates of 4600, 6900 and 8600 LOC give **S = (4600 + 4 × 6900 + 8600) / 6 = 6800 LOC**."
  },
  "se.u3.quality-planning": {
    "summary": "**Quality planning** means deciding what “good enough” means before building software. A **quality plan** records the quality goals, rules, checks and people responsible, so the team knows what to achieve and how to verify it.",
    "points": [
      "**Quality goals** identify the qualities that matter most. These may include **reliability** (working without failure), **performance** (speed and resource use) and **usability** (ease of use). Set measurable targets wherever possible.",
      "**Standards** are agreed rules to follow. Examples include coding rules and fixed formats for documents.",
      "**Quality-control activities** check whether the work meets the plan. Schedule **reviews and inspections**, where people examine work for mistakes, and **testing**, where software is run to find problems. Choose **metrics**, meaning measurements such as defect counts.",
      "A **defect removal plan** states where mistakes should be found and corrected. Checks can happen during requirements review, design review, code inspection and testing.",
      "**Responsibilities** state who performs each check and who gives **sign-off**, meaning formal approval.",
      "**Performance requirements** cover response time, work handled per second, memory use and expected demand. Plan them early because they affect system design, hardware, schedule and testing effort. Include **performance modelling**, which estimates performance during design, plus **load and stress testing** under expected and extreme demand. Late discoveries may require redesign."
    ],
    "analogy": "It is like planning a college event: agree on what success means, assign duties and schedule checks beforehand.",
    "example": "For a library app, set a search response target below two seconds and test it under the expected user load."
  },
  "se.u3.risk": {
    "summary": "**Risk management** means spotting what could go wrong in a software project. You judge its chance and possible damage, then prepare a plan.",
    "points": [
      "**Reactive strategies** handle risks after they become problems. This is firefighting and can be costly. **Proactive strategies** identify and assess risks early, then prepare ways to reduce them and backup plans.",
      "**Project risks** affect schedules, staffing or budgets. **Technical risks** involve design, coding or technology. **Business risks** threaten business success, such as nobody wanting the product.",
      "**Known risks** come from examining the project plan. **Predictable risks** are suggested by past projects. **Unpredictable risks** cannot be foreseen.",
      "**Risk identification** uses a **risk item checklist**: product size, business impact, customer characteristics, development process, tools, technology, and staff size and experience.",
      "**Risk components** are what might suffer: **performance**, **cost**, **support** (maintenance), and **schedule**. **Risk drivers** cause or increase risk. Changing requirements, for example, can threaten deadlines.",
      "**Risk projection** means estimating risks. A **risk table** records category, probability, impact and an RMMM reference. Impact ranges from 1 (catastrophic) to 4 (negligible). Rank risks by probability and impact; actively manage those above a **cut-off line**.",
      "**RMMM** means **Mitigation**: reduce the chance or damage; **Monitoring**: watch warning signs; **Management**: use the contingency plan if the risk happens."
    ],
    "analogy": "For a picnic, checking the rain forecast is monitoring. Moving indoors when rain starts is contingency management.",
    "example": "**Risk exposure**, RE = P × C, means probability × cost if it happens. A 50% chance of ₹10,000 damage gives RE = ₹5,000."
  },
  "se.u3.schedule-staffing": {
    "summary": "**Project scheduling** decides when each task happens and when the project finishes. **Staffing** decides how many people are needed, what skills they need, and who does each task.",
    "points": [
      "Start with a **Work Breakdown Structure (WBS)**: split the project into smaller tasks. Identify **dependencies**, meaning tasks that must wait for other tasks to finish.",
      "Estimate **effort**, the total work people must do, and **duration**, the calendar time a task takes. A **Gantt chart** shows tasks along a timeline.",
      "The **critical path** is the longest chain of dependent tasks. It sets the shortest possible project duration. A delay on this path delays completion.",
      "An **activity** takes time and resources. A **milestone** is a zero-duration checkpoint showing that something is completed and verified, such as “requirements approved.”",
      "The **40-20-40 rule** suggests 40% of effort for analysis and design, 20% for coding, and 40% for testing. It is a guideline. Planning is **iterative**: revise estimates and check that effort and milestone dates still fit commitments.",
      "**Brooks’s law** warns that adding people to a late software project can delay it further through training and communication. The **Rayleigh/Putnam curve** models staffing rising, peaking, then falling. Keep a core team and add specialists when needed.",
      "The **project plan** records goals, estimates, schedule, staffing, risks, quality checks, version and change control, and progress tracking."
    ],
    "analogy": "Like building a house, tasks need the right order, workers, and inspection checkpoints.",
    "example": "If design takes 2 days, coding 3, and testing 2, all sequentially, the schedule needs 7 days."
  },
  "se.u3.sizing": {
    "summary": "**Software sizing** estimates how big a software product will be. Size helps estimate effort, cost and completion time. Common measures are **LOC** (lines of code) and **function points** (a measure of the functions provided to users).",
    "points": [
      "**Fuzzy-logic sizing**: Identify the application type. Judge whether it is small, medium or large. Then use records from past projects to narrow the estimate.",
      "**Function point sizing**: Estimate inputs, outputs, inquiries (requests for information), files and interfaces (connections to other systems). These describe the software’s information-handling functions.",
      "**Standard component sizing**: Count parts such as modules, screens and reports. Multiply each count by the average LOC for that type of part in past projects.",
      "**Change sizing**: For updates to existing software, count code that is reused, added, changed or deleted.",
      "**Size-oriented metrics** measure something relative to code size. **KLOC** means 1,000 lines of code. Examples include errors/KLOC, defects/KLOC, cost/LOC, documentation pages/KLOC and LOC/person-month. A person-month means one person’s work for one month. These metrics help track progress and compare similar projects.",
      "**LOC advantages**: Automatic counting is easy, and plenty of past data exists. **LOC disadvantages**: Counts depend on programming language and coding style. LOC is hard to predict before design. It can make short, well-designed programs look less productive."
    ],
    "analogy": "Software sizing is like estimating a house’s size before estimating the workers, money and time needed to build it.",
    "example": "A project has 5,000 LOC and 10 defects. Its size is **5 KLOC**, so its defect rate is **2 defects/KLOC**."
  },
  "se.u4.arch-styles": {
    "summary": "**Architectural styles** are common ways to organise a whole software system. Each style defines **components** (the main parts), **connectors** (links between parts), and **constraints** (rules for combining them). It also includes **semantic models**, which explain how the parts work together and what the system does.",
    "points": [
      "**Data-centred:** Independent parts share one central **repository**, or data store. Adding or changing clients is easier. But the store can become a **bottleneck**, slowing everyone down.",
      "**Data-flow:** Data passes through **filters**, which transform it. **Pipes** carry each filter’s output to the next. Filters are reusable. This style suits step-by-step processing, but poorly suits systems needing frequent user interaction.",
      "**Call-and-return:** A main program calls smaller **subprograms** to do tasks and return control. **Remote procedure calls** do this across a network. Control is easy to follow, but **tight coupling** means changes in one part can affect others.",
      "**Object-oriented:** **Objects** keep data and related operations together. This is **encapsulation**. Objects communicate through messages. The style supports reuse and hides internal details, but communicating objects generally need to know their receivers.",
      "**Layered:** Each **layer** provides services to the layer above. Separating responsibilities helps portability—moving software between environments. Passing through several layers can add processing overhead."
    ],
    "analogy": "Think of a restaurant: its work can be organised around a shared order board, a preparation line, or a manager assigning tasks.",
    "example": "A library system uses **data-centred architecture** when borrowing, returns, and catalogue search all access the same database."
  },
  "se.u4.architecture": {
    "summary": "**Software architecture** is the big picture of a software system. It shows its main **components** (parts), their **externally visible properties** (what other parts can use or observe), and their connections. It guides detailed design.",
    "points": [
      "Architecture gives **stakeholders**—people who build, use or care about the system—a shared picture to discuss. It also provides a model of organisation that can be reused.",
      "**Early design decisions** strongly affect **performance**, **security** and **maintainability**—how fast, protected and easy to change the system is.",
      "Start with an **architectural context diagram**. Show **superordinate systems** that use or control this system, **subordinate systems** it uses, **peer systems** it works alongside, and **actors**, such as users.",
      "Identify **archetypes**: basic ideas representing core system behaviour, such as a Controller. Refine these into components. Describe **instantiations**: concrete arrangements of those components.",
      "Compare possible designs using **ATAM**, the **Architecture Trade-off Analysis Method**. It examines trade-offs: improving one quality may weaken another.",
      "Architecture can begin before the **SRS**, or **Software Requirements Specification**, is complete. Develop both in repeated rounds. Test risky ideas with early working models called **prototypes**, and adapt as requirements change.",
      "**Architectural design** covers the whole system and major, hard-to-change choices. **Module design** covers one component’s internal details, such as algorithms and data structures."
    ],
    "analogy": "Architecture is like a house plan showing rooms and connections. Module design works out details inside each room.",
    "example": "A shopping system might have Catalogue, Order and Payment components. Architecture defines their connections. Module design decides how Order calculates a total."
  },
  "se.u4.code-inspection": {
    "summary": "**Code inspection** is a formal, planned team review to find defects (mistakes) before testing. Reviewers read the code using a **checklist**, a list of things to check.",
    "points": [
      "**Planning**: The **moderator**, who organises and leads the review, checks readiness. The code must compile and meet **entry criteria** (conditions for starting). They choose 3–5 participants, assign roles, schedule the meeting, and share code and checklists.",
      "**Roles**: The **author** wrote the code. The **reader** explains it in their own words. The **recorder** writes down defects. **Inspectors/reviewers** look for mistakes. Participants may combine roles.",
      "**Preparation / self-review**: Each reviewer studies the code alone beforehand and notes possible defects.",
      "**Inspection meeting**: The reader explains the code. Reviewers identify and record defects without fixing them. Keep the meeting under two hours.",
      "**Group review guidelines**: Review the product, not the producer. Follow an agenda, limit debate, use checklists, and take notes. Keep the group small, require preparation, and allocate time and resources.",
      "**Rework**: The author fixes defects. During **follow-up**, the moderator verifies fixes. Large changes may need another inspection.",
      "**Summary report**: Record the project, reviewed item, reviewers, effort, major/minor defects, and decision: accept, accept with minor changes, or re-inspect. Check preparation, checklist coverage, major-defect closure, and defect density against past results."
    ],
    "analogy": "It is like classmates checking an assignment before submission, with assigned jobs and a checklist.",
    "example": "**Defect density** = defects found ÷ size in **KLOC** (thousand lines of code). For 350 lines, 9 minor + 5 major defects gives 14 ÷ 0.350 = **40 defects/KLOC**."
  },
  "se.u4.coding": {
    "summary": "**Coding principles and guidelines** help you write code that is easy to read, change, test, and use safely. Code is read more often than it is written, so clarity matters.",
    "points": [
      "**KISS** means “Keep It Simple, Stupid.” Choose a clear solution. Avoid clever tricks that make readers struggle.",
      "**Structured programming** uses sequence, decisions, and loops to keep the flow clear. A single entry and exit keeps a block easy to follow. Avoid confusing jumps using **goto**.",
      "**Information hiding** means keeping internal details inside a module or class. **Encapsulation** groups data with the operations that control access to it. Avoid **global variables**, which many parts of a program can change.",
      "**DRY**, or “Don’t Repeat Yourself,” means avoiding duplicated logic. Reuse functions. Keep each function short and focused on one job so it is easy to test. Limit nesting: too many decisions inside decisions become confusing.",
      "Use meaningful names, consistent naming styles, and **indentation**—spaces that show code structure. Replace **magic numbers**, unexplained fixed values, with named constants. Comments should explain why. A module’s **header comment** records its purpose, author, date, and changes.",
      "Validate inputs, check returned results, and handle **exceptions**, which signal problems during execution. Avoid unexpected **side effects**, such as changing unrelated data. **Coding standards** are mandatory project rules; **guidelines** are recommendations."
    ],
    "analogy": "Coding guidelines are like keeping shared kitchen tools labelled and organised: everyone can find and use them easily.",
    "example": "Use a constant named **MAX_STUDENTS** instead of repeating an unexplained 60 throughout a program."
  },
  "se.u4.component-design": {
    "summary": "**Component-level design** plans the inside of each software building block: its data, algorithms (steps), and interfaces (ways to interact). A **component** can be collaborating classes in object-oriented software, or a module or function in traditional software.",
    "points": [
      "**Open-Closed Principle (OCP)** means adding features through new code without changing tested code. **Liskov Substitution Principle (LSP)** means a subclass must work correctly wherever its base class is expected.",
      "**Dependency Inversion Principle (DIP)** means depending on interfaces rather than specific classes. **Interface Segregation Principle (ISP)** means giving users of a component small interfaces containing only what they need.",
      "**Release Reuse Equivalency** means reusable components are packaged and released as units. **Common Closure** groups classes that change together. **Common Reuse** separates classes that are not reused together.",
      "**High cohesion** means a component’s responsibilities belong together. **Low coupling** means components depend little on each other. Both make changes easier.",
      "Use meaningful names, such as FloorPlan. Keep interfaces small and stable. Show them using **lollipop notation**, a small circle attached to a line.",
      "Traditional components use **structured programming**: sequence, conditions and loops, with single entry and exit. Describe logic using flowcharts, **pseudocode** (informal written steps), or **decision tables**, which match condition combinations to actions.",
      "Choose **data structures**—ways to organise data—before algorithms. Good design meets requirements, clearly describes data and behaviour, and is modular and easy to change and test."
    ],
    "analogy": "**OCP** is like plugging a new appliance into a wall socket without rewiring the house.",
    "example": "A printer component can use a **queue** to process jobs in arrival order."
  },
  "se.u4.coupling-cohesion": {
    "summary": "A **module** is a named part of a program. **Cohesion** means how well the tasks inside it belong together. **Coupling** means how much it depends on other modules. Aim for **high cohesion** and **low coupling**.",
    "points": [
      "**Modularity** means dividing software into modules. This makes understanding, testing, changes and reuse easier. Too many tiny modules increase the work of connecting them.",
      "**Functional independence** means each module does one clear job and needs little interaction with others.",
      "Cohesion, best to worst: **Functional**—one task; **Sequential**—one step’s output feeds another; **Communicational**—same data; **Procedural**—fixed order; **Temporal**—same time; **Logical**—similar activities selected by a flag; **Coincidental**—unrelated activities. A flag is a value that selects behaviour.",
      "Coupling, best to worst: **No direct coupling**—no direct dependency; **Data**—simple values passed; **Stamp**—a whole structure passed when only part is needed; **Control**—behaviour controlled by a flag; **External**—shared device, protocol or file format; **Common**—shared global data; **Content**—access to another module’s internals.",
      "**High cohesion** makes a module easier to understand and reuse. **Low coupling** helps changes stay local and improves **portability**, meaning ease of moving software to another system.",
      "**Domain logic**, meaning rules of the problem being solved, should generally avoid device and database dependencies. Keep those in **infrastructure** modules, such as database adapters."
    ],
    "analogy": "A cutlery-only drawer shows high cohesion. Rooms with separate entrances show low coupling.",
    "example": "If A and B share a global variable x, that is **common coupling**. Let A own x and pass its value to B as an input: **data coupling**."
  },
  "se.u4.dfd": {
    "summary": "**Flow-oriented modelling** shows how a system turns input data into output data. Its main tool is a **Data Flow Diagram (DFD)**, which shows where data comes from, what happens to it, where it is stored, and where it goes.",
    "points": [
      "A DFD has four parts. **External entities** are people or systems outside the system. **Processes** work on data. **Data stores** hold data. **Data flows** are arrows showing data movement.",
      "**Level 0**, or the **context diagram**, shows the whole system as one process connected to external entities. **Level 1** splits it into major processes, numbered 1.0, 2.0, and so on. **Level 2+** adds detail, using numbers such as 1.1 and 1.2.",
      "**Balancing** means the inputs and outputs crossing a parent process’s boundary must match those crossing its detailed child diagram’s boundary.",
      "Every process needs an input and an output. Data cannot move directly between two external entities or two data stores. A process must connect them.",
      "Use verbs for processes, such as “Issue book.” Use nouns for flows and stores. DFDs show data movement, not execution order, decisions, or loops.",
      "DFDs help spot missing requirements and support **function-oriented design**. Related **control flow diagrams** describe control behaviour. **Process specifications** explain individual processes."
    ],
    "analogy": "Think of a kitchen: ingredients enter, cooking transforms them, shelves store them, and meals leave. A DFD follows data similarly.",
    "example": "In a library DFD, a student sends a “Loan request” to “Issue book.” That process updates “Loan records” and returns “Loan confirmation.”"
  },
  "se.u4.function-oriented": {
    "summary": "**Function-Oriented Modelling** describes a system through functions that turn input data into output data. It breaks a big task into smaller tasks, making the system easier to understand, build and change.",
    "points": [
      "**Top-down decomposition** means starting with the main task and splitting it into smaller tasks, step by step. **Modularity** means organising these tasks into separate parts called modules.",
      "**High cohesion** means the work inside a module serves one clear purpose. **Low coupling** means modules depend as little as possible on each other.",
      "**Information hiding** means keeping a module’s internal details private. Other modules see only what they need to use it.",
      "A **Data Flow Diagram (DFD)** shows how data moves between processes and is transformed. A **structure chart** shows the module hierarchy: which modules call others, and what data or control signals they pass.",
      "In a structure chart, rectangles represent modules and connecting lines show calls. Arrows with hollow circles show **data couples**, or passed data. Filled circles show **control flags**, or signals that guide an action. Diamonds mark conditional calls; curved arrows mark repeated calls.",
      "**Transform analysis** converts a DFD into a structure chart with input, processing and output branches.",
      "**Transaction analysis** produces a structure chart where one module selects the appropriate handler for each transaction type."
    ],
    "analogy": "Think of preparing dinner. The main task splits into cooking, setting the table and serving. Cooking can split further into smaller jobs.",
    "example": "For a marks-report system, the main module calls Read Marks, Calculate Total and Print Report. These form input, processing and output branches."
  },
  "se.u4.incremental-code": {
    "summary": "**Incremental development of code** means building a program one small part at a time. You test and fix each part before adding more, so mistakes are easier to find.",
    "points": [
      "Start with one small function or feature. Write **unit tests**, which check whether a small piece of code gives the expected results.",
      "Run the tests. If any fail, find the mistake, fix it, and test again. Keep each completed step working before moving ahead.",
      "Add the next part and run all the earlier tests too. This is **regression testing**: checking that new changes have not broken existing behaviour.",
      "A new test failure often points to the latest change. This narrows your search. Your growing collection of tests becomes a **regression suite**.",
      "**Test-driven development (TDD)** follows this order: write a test, write code that passes it, then **refactor**. Refactoring means improving the code’s structure without changing its behaviour.",
      "Use **source-code control** to save each working step. **Continuous integration (CI)** regularly combines developers’ changes and runs automated checks."
    ],
    "analogy": "It is like building a toy tower one level at a time. Check that it stands after each addition. If it becomes unstable, inspect the latest addition first.",
    "example": "For a calculator, first build and test addition. Then add subtraction. Test subtraction and rerun the addition tests. Fix any failures before adding multiplication."
  },
  "se.u5.auto-manual": {
    "summary": "**Manual testing** means a person checks software by using it and observing what happens. **Automated testing**, also called **test automation**, uses software to run tests and compare actual results with expected results. Teams usually use both.",
    "points": [
      "**Execution:** A manual tester follows test steps. Automated tests follow scripts, which are written instructions. Common tools include Selenium, JUnit and pytest.",
      "**Initial cost:** Manual testing usually costs less to start. Automation needs more effort at first to write scripts and set up tools.",
      "**Speed and accuracy:** Repeating tests manually takes time, and people may make mistakes. Automation repeats tests quickly and consistently. However, its scripts must also be correct.",
      "**Regression testing** checks whether a change has broken something that worked before. These repeated checks are tedious manually and well suited to automation.",
      "**Exploratory testing** means investigating software while deciding what to check next. **Usability testing** checks how easy software is to use. Both benefit from human judgement.",
      "**Maintenance:** Manual test documents need updating when behaviour changes. Automated scripts may need updating when the interface or code changes. Automation also suits **load testing**, which checks performance under many users or requests."
    ],
    "analogy": "Manual testing is like checking each sum yourself. Automated testing is like setting up a calculator to repeat the same checks.",
    "example": "For a login page, a person can judge whether instructions are clear. An automated test can repeatedly check that a wrong password is rejected."
  },
  "se.u5.blackbox": {
    "summary": "**Black-box testing** checks whether software does what its requirements say. You give it inputs and compare the actual results with the expected results, without examining the code.",
    "points": [
      "It can find missing or incorrect functions, problems between connected parts, stored-data access errors, wrong behaviour, slow performance, and problems during startup or shutdown.",
      "**Equivalence partitioning** divides inputs into groups called **equivalence classes**. Inputs in each group should be treated alike. Test one representative value from each valid and invalid group.",
      "**Boundary value analysis (BVA)** tests the edges of a range. Try values exactly at, just below, and just above each edge, because mistakes often occur there.",
      "**Graph-based testing** represents objects as points and their relationships as links. Tests check those relationships.",
      "**Orthogonal array testing** uses a carefully chosen set of combinations to cover pairs of parameter values. This needs fewer tests than checking every possible combination.",
      "**Decision tables** list combinations of conditions and their expected actions. **Cause–effect graphing** shows how input conditions connect to outcomes.",
      "**White-box testing** uses knowledge of the internal code. **Black-box testing** uses requirements. The key difference is what guides the tests, not who performs them."
    ],
    "analogy": "Think of testing a vending machine. You insert money, select a snack, and check the snack and change. You do not inspect its wiring.",
    "example": "Marks must be 0–100. Equivalence partitioning suggests −5, 55, and 120. BVA suggests −1, 0, 1, 99, 100, and 101. If passing starts at 40, also test 39, 40, and 41."
  },
  "se.u5.deployment": {
    "summary": "**Deployment** means getting software installed, set up, and running where it is needed. It can happen in testing or **production**, the environment used by real users. A **deployment plan** explains how and when this happens.",
    "points": [
      "**Deployment** includes packaging the software, installing it, setting it up, updating it, and retiring old versions. **Release** means making a version available to users. It is a business decision and includes documentation and communication.",
      "**CI/CD pipelines** automate steps such as building, testing, and deploying software. Building turns the source code into software that can run.",
      "Before deployment, decide what will change, where it will run, and when. Check that tests passed, approvals are complete, and backups are ready.",
      "Choose a strategy. **Big bang** changes everything at once. **Phased / rolling deployment** updates parts gradually. **Blue-green deployment** switches users between two matching environments. A **canary release** starts with a small user group.",
      "Plan **data migration**, meaning moving or changing stored data. Prepare settings, user training, and support messages. Decide what to monitor and what counts as success.",
      "**Rollback** returns to the last working version. Set warning limits beforehand, such as too many errors. Keep the old version, database backups, and reversible database changes ready. After switching back, check system health, inform users, and investigate."
    ],
    "analogy": "Deployment is like replacing a shop’s billing machine. The plan covers the change; rollback brings back the working machine.",
    "example": "A college deploys a new results portal. If login failures cross the planned limit, the team restores the previous version and checks it."
  },
  "se.u5.quality-concepts": {
    "summary": "**Software quality** means meeting stated requirements and users’ reasonable, unstated expectations. Quality must be built into the work throughout development. Testing alone cannot create it at the end. Pressman links quality to an effective process, a useful product, and measurable value for makers and users.",
    "points": [
      "**Quality of design** asks: Do the requirements and design describe what users actually need?",
      "**Quality of conformance** asks: Does the finished software follow that design correctly?",
      "**User satisfaction** needs a product that meets requirements, works well, and arrives within the agreed budget and schedule.",
      "**Garvin’s quality dimensions** are performance (speed), features (capabilities), reliability (dependable operation), conformance (meeting specifications), durability (lasting usefulness), serviceability (ease of fixing), aesthetics (look and feel), and perception (users’ impression of quality).",
      "**Quality objectives** include meeting expectations, reducing defects and repeated work, improving reliability and **maintainability** (ease of changing software), and delivering on time and within budget.",
      "**Cost of quality** = **prevention** + **appraisal** + **failure costs**. Prevention includes planning and training. Appraisal means checking quality through inspections and testing. Internal failures need fixes before release. External failures cause complaints and support work after release; these are generally the most expensive.",
      "Sound engineering methods and project management help achieve quality. **Quality control** checks the product through reviews and testing. **Quality assurance** checks processes through audits and standards."
    ],
    "analogy": "Think of tailoring: design chooses the right measurements; conformance means stitching to those measurements.",
    "example": "A college app must calculate attendance correctly. Students also expect understandable screens, even if nobody explicitly requested them."
  },
  "se.u5.quality-models": {
    "summary": "**Software quality attributes** describe what makes software good. A **quality model** organises these attributes so we can judge software beyond just whether it runs. Two models are **McCall’s model** and **HP’s FURPS model**.",
    "points": [
      "**McCall’s model** has 11 factors in three groups. **Product operation** covers everyday use. **Correctness** means meeting requirements. **Reliability** means working consistently without failure. **Efficiency** means using computing resources well. **Integrity** means protection against unauthorised access. **Usability** means ease of learning and use.",
      "**Product revision** covers changing software. **Maintainability** means ease of finding and fixing faults. **Flexibility** means ease of changing it for new needs. **Testability** means ease of checking whether it works correctly.",
      "**Product transition** covers moving or connecting software. **Portability** means ease of moving to another environment. **Reusability** means using its parts in other software. **Interoperability** means working with other systems.",
      "HP means Hewlett-Packard. Its **FURPS** model has five attributes. **Functionality** covers features, capabilities and security. **Usability** covers ease of use, appearance, consistency and documentation.",
      "**Reliability** covers failures, accurate results and recovery after failure. **Performance** covers speed, response time and resource use. It also covers **throughput**, meaning work completed per unit of time.",
      "**Supportability** covers ease of fixing, testing, extending, adapting, configuring and installing software."
    ],
    "analogy": "Think of buying a bicycle. You check whether it works well, is easy to ride and can be repaired. Software needs several quality checks too.",
    "example": "For a college app, calculating marks correctly shows **correctness**. Opening results quickly shows **performance**. Connecting to the library system shows **interoperability**."
  },
  "se.u5.reviews": {
    "summary": "**Software reviews** mean checking software work, such as designs or code, to find mistakes before testing. Finding and fixing mistakes early usually costs less than fixing them after release.",
    "points": [
      "**Informal reviews** are quick checks with a colleague, casual discussions, or pair programming. They have no formal planning, fixed roles, or required records. They are fast and cheap, but results can vary.",
      "A **Formal Technical Review (FTR)** is a planned check by technical staff. It finds errors, checks requirements and standards, helps manage projects, and trains reviewers.",
      "Before an FTR, the **producer**, who created the work, says it is ready. The **review leader** checks and shares it. **Reviewers** spend 1–2 hours preparing.",
      "The meeting has **3–5 people** and lasts **under 2 hours**. The producer explains the work. The **recorder** writes an **issues list**. The decision is **accept**, **reject**, or **accept provisionally**, meaning minor changes are needed. A **review summary report** records what was reviewed, who attended, findings, and the decision.",
      "**Review the product, not the producer.** Follow an agenda, use a checklist, take notes, and limit arguments. Identify problems instead of solving every problem during the meeting.",
      "Missing notes, trivial comments, or questions already answered in the material can suggest poor preparation. The leader checks issues lists, reschedules if most are unprepared, and speaks privately with individuals."
    ],
    "analogy": "A review is like checking an assignment with a friend before submitting it.",
    "example": "A reviewer notices that a design allows withdrawal beyond the account balance. The team corrects it before coding."
  },
  "se.u5.strategies": {
    "summary": "A **testing strategy** is a step-by-step plan for checking software. It moves outward: **unit testing → integration testing → validation testing → system testing**, from one small part to the complete system.",
    "points": [
      "Start with **technical reviews**: people examine the work to catch mistakes before running tests. Review the test plan and test cases too.",
      "Set measurable requirements and clear testing goals. Understand different users. Plan quick, repeated testing cycles, build in self-checks (**anti-bugging**), and keep improving the process.",
      "**Unit testing** checks one module, or small program part, separately. Check its interface, local data, boundary conditions, independent execution paths, and error handling. A **driver** is a fake caller. A **stub** replaces a module it calls.",
      "**Integration testing** checks how connected modules work together. **Big bang** combines everything at once, making faults hard to locate. **Top-down** starts with the main module and uses stubs. **Bottom-up** starts with lower-level groups and uses drivers. **Sandwich** combines both approaches.",
      "**Regression testing** repeats earlier tests after changes to catch newly introduced problems. **Smoke testing** quickly checks critical functions in a new build, often daily.",
      "**Validation testing** checks whether software meets requirements. **System testing** checks it within the whole computer-based system, including other connected parts.",
      "Developers test software. Large projects may also use an **independent test group (ITG)**. **Testing** reveals failures; **debugging** finds and fixes their causes."
    ],
    "analogy": "Like checking bicycle parts separately, assembling them, checking the promised features, then trying the complete bicycle.",
    "example": "For a shopping app, test total calculation alone, then connect it to checkout and test their interaction."
  },
  "se.u5.system": {
    "summary": "**System testing** checks the complete, connected system: software, hardware, people and data. It checks **functional requirements** (what the system must do) and **non-functional requirements** (how well it must work). The aim is to check whether the whole system meets its requirements.",
    "points": [
      "**Recovery testing** forces a failure and checks recovery. Can the system restore its data and resume working within the required time?",
      "**Security testing** checks protection against access without permission. For example, a student should not be able to view another student’s private marks.",
      "**Stress testing** checks behaviour under abnormal amounts or frequency of work. For example, keep increasing users to see how the system behaves beyond its limits.",
      "**Performance testing** measures speed and other run-time behaviour. For example, responses must take less than two seconds with 5,000 users.",
      "**Deployment (configuration) testing** checks the system in its intended environments. This includes different browsers, devices, and installation or removal.",
      "Other tests check expected traffic (**load**), ease of use (**usability**), working with other platforms (**compatibility**), correct setup (**installation**), and continued operation without failure (**reliability**).",
      "**Testing** finds symptoms. **Debugging** finds and removes their cause. **Brute force** uses print statements or memory dumps—saved memory contents. **Backtracking** traces backwards from the symptom. **Cause elimination** tests possible causes to rule them out. **Binary partitioning** narrows the search by checking halves."
    ],
    "analogy": "It is like checking an entire restaurant service: the kitchen, equipment, staff and orders must work together.",
    "example": "Stop a college portal’s server during fee payment. Restart it and check whether the payment data recovers correctly."
  },
  "se.u5.testing-concepts": {
    "summary": "**Testing** means running a program to find errors. We check what it does against what it should do. A useful test has a good chance of finding a previously undiscovered bug.",
    "points": [
      "The **objectives of testing** are to find errors, check **requirements** (what the software must do), build confidence before release, and provide information about **reliability** (working without failure under stated conditions).",
      "A **test case** states the inputs, the conditions for running the test, and the expected results.",
      "An **error** is a human mistake. A **defect**, **fault**, or **bug** is the flaw it creates. A **failure** happens when the software does not behave as required.",
      "**Exhaustive testing** means checking every possible input or execution path. This is impractical. As Dijkstra said, testing shows the **presence of errors, not their absence**. Passing tests can still miss bugs.",
      "**Testability** means how easily software can be tested. **Operability** means it works well enough to test. **Observability** makes results visible. **Controllability** lets us set inputs and conditions.",
      "**Decomposability** lets us test parts separately. **Simplicity** avoids unnecessary complexity. **Stability** limits disruptive changes. **Understandability** makes behaviour clear.",
      "A **good test** targets likely bugs, avoids unnecessary repetition, and is neither too simple nor too complex. **Best of breed** means choosing the most effective test among similar alternatives."
    ],
    "analogy": "Testing is like checking a bicycle before riding. Finding a loose brake reveals a problem. Passing your checks cannot guarantee every part is perfect.",
    "example": "Students pass at 40 marks. A programmer mistakenly uses > instead of >=. That is the **error**; the wrong condition is the **defect**; showing 40 marks as failed is the **failure**."
  },
  "se.u5.testing-process": {
    "summary": "**Testing Process** means checking software in an organised way. We plan checks, run them, report problems, and check fixes. **Test coverage** measures the percentage of code or requirements exercised by tests. It reveals gaps, but even 100% statement coverage cannot guarantee bug-free software.",
    "points": [
      "**Test planning**: Decide what to test, how to test it, who will do it, and the schedule. Set **entry criteria**, conditions for starting a test phase, and **exit criteria**, conditions for ending it.",
      "**Test case design**: Write each test’s input, steps, and expected result. **Black-box testing** checks behaviour without looking inside the code. **White-box testing** uses the code’s internal structure to design tests.",
      "**Environment and data set-up**: Prepare the hardware, software, settings, and sample data needed for testing.",
      "**Execution**: Run the tests. Compare the actual results with the expected results.",
      "**Defect reporting and tracking**: Record problems, called **defects**. Decide which need attention first, assign them to developers, and track their progress.",
      "**Retesting and regression testing**: Retesting checks whether a reported defect is fixed. Regression testing checks whether changes have broken previously working features.",
      "**Test closure**: Summarise results, coverage, and lessons learned. Code coverage can measure statements executed, branches taken at decisions, or paths followed through the code."
    ],
    "analogy": "Think of checking a repaired bicycle: plan checks, prepare it, test it, report faults, and check again after repairs.",
    "example": "A login test uses a wrong password. Expected result: access denied. If access is allowed, report the defect. After repair, retest it and check that valid login still works."
  },
  "se.u5.validation": {
    "summary": "**Validation testing** checks whether working software meets the customer’s real needs. It asks, “Are we building the **right product**?” Software may follow its design perfectly and still fail to do what users need.",
    "points": [
      "**Verification** asks, “Are we building the **product right**?” It checks the written requirements and design throughout development, using reviews, inspections, walkthroughs and unit tests (tests of individual software parts).",
      "**Validation criteria** are conditions taken from requirements. Tests check whether these conditions are met. Any differences from the expected results go on a **deficiency list**, a record of shortcomings.",
      "**Configuration review**, or audit, checks that all software items, including code, documents and data, are complete and catalogued, meaning listed and organised.",
      "**Acceptance testing** lets the customer test custom-built software and decide whether to accept it. This testing may take weeks.",
      "**Alpha testing** happens at the developer’s site before beta testing. Representative users try the software in controlled conditions. Developers watch and record errors.",
      "**Beta testing** happens at users’ own sites before final release. Real users work in everyday, uncontrolled conditions, without developers watching, and report problems.",
      "**Users/customers**, or an independent test group representing them, should perform validation. They bring real expectations and data. Early involvement helps catch misunderstood needs before fixes become expensive."
    ],
    "analogy": "Think of a tailored shirt. **Verification** checks whether it follows the measurements. **Validation** checks whether it actually fits the customer.",
    "example": "A college fee app correctly calculates fees but lacks the instalment option students need. Validation reveals this missing requirement."
  },
  "se.u5.whitebox": {
    "summary": "**White-box testing** means designing tests by looking inside the code. We check its decisions, loops, and data. The aim is to find mistakes in how the program works.",
    "points": [
      "**Basis path testing** starts with a **flow graph**. Nodes represent statements or decisions. Edges show where execution can go next.",
      "**Cyclomatic complexity**, V(G), counts independent paths. For one connected flow graph, V(G) = E − N + 2. E means edges; N means nodes. It also equals the number of regions, including the outside region. With two-way decisions, V(G) = P + 1, where P counts decisions.",
      "Choose V(G) **independent paths**. Each adds at least one previously unused edge. Create inputs to follow each feasible path. This supports **branch coverage**: taking every decision’s true and false exits. V(G) is not necessarily the minimum number of tests for branch coverage.",
      "**Condition testing** checks each simple condition as both true and false. **Data-flow testing** follows variables from **DEF** (getting a value) to **USE** (reading it). A **DU chain** connects a definition to a use without another definition between them.",
      "**Loop testing** checks zero, one, two, typical, and boundary repetitions. For maximum n, test n−1, n, and an attempted n+1. Test nested loops from inside outward, keeping outer loops at minimum. Test consecutive independent loops separately; treat dependent ones like nested loops. Redesign unstructured loops."
    ],
    "analogy": "It is like checking a building using its floor plan, deliberately testing different corridors and doorways.",
    "example": "Your graph has 11 edges and 9 nodes. V(G) = 11 − 9 + 2 = **4**, so choose four independent paths."
  }
}
