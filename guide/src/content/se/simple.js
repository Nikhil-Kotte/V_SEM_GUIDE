// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default {
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
  }
}
