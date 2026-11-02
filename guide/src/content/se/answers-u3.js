// SE Unit III model answers (planning, estimation, risk). Keyed by PYQ id.
const P = 'Pressman, Software Engineering: A Practitioner\'s Approach'
const U3 = 'SE Unit-3 notes (SE Unit-3.pdf, Unit _3.docx)'
const RISK = 'Unit-3-Part-1_SE.pdf (risk slides)'
const EST = 'SE_Unit-3_Part2.pdf (estimation)'

export default {
  // ---------------- Risk ----------------
  'se-risk-reactive-proactive': {
    blocks: [
      'A **risk** is a potential problem: it might happen or it might not. A risk strategy is the team\'s attitude towards such problems. There are two broad strategies.',
      { compare: [
        { title: 'Reactive risk strategy', items: ['Team does nothing about risks until something goes wrong ("Indiana Jones school": "don\'t worry, I\'ll think of something")', 'Then rushes to correct the problem: **fire-fighting / crisis management**', 'At best, the project is monitored for likely risks', 'Resources are set aside only when a problem appears', 'When the fix fails, the project is in real jeopardy'] },
        { title: 'Proactive risk strategy', items: ['Begins **long before technical work starts**', 'Potential risks are **identified**', 'Their **probability and impact** are assessed and they are **ranked**', 'A plan is made to **avoid** risks where possible (mitigation)', 'The rest are **monitored**, with **contingency plans** ready'] },
      ] },
      { h: 'Example' },
      'Risk: "the key database developer may leave". Reactive team: discovers it on the day the developer resigns and the schedule slips by months. Proactive team: pairs a junior developer with the expert, insists on documentation, and keeps a contingency plan, so the hand-over takes days.',
      { h: 'How proactive risk management contributes to project success' },
      { ul: [
        '**Fewer surprises**: major risks are known and watched from the start.',
        '**Realistic estimates and schedules**: risk exposure (RE = P × C) is budgeted as contingency.',
        '**Cheaper fixes**: problems are mitigated early instead of discovered late, when rework is costly.',
        '**Better decisions**: management sees a ranked risk table and can trade scope, time and cost knowingly.',
        '**Faster recovery**: contingency plans let the team react immediately if a risk occurs.',
        '**Team morale and stakeholder confidence** stay high because the project is visibly under control.',
      ] },
      { img: 'se-risk' },
      { exam: 'Draw the two-column comparison, give one example, then list 4–5 benefits of the proactive approach.' },
    ],
    sources: [`${U3} "Reactive vs. Proactive Strategies"`, `${RISK} p58–60`, `${P} §28.1`],
  },

  'se-rmmm': {
    blocks: [
      'All risk-analysis activities have one goal: to help the team build a strategy for dealing with risk. The **RMMM plan** (Risk Mitigation, Monitoring and Management) documents that strategy. It can be a separate document or part of the project plan; some teams instead keep one **risk information sheet (RIS)** per risk in a database.',
      'An effective strategy addresses three issues:',
      { ol: [
        '**Risk mitigation (avoidance)**: proactive steps that reduce the *probability* of the risk occurring (or its impact) before it happens.',
        '**Risk monitoring**: tracking the factors that indicate whether the risk is becoming more or less likely, checking that mitigation steps are actually being applied, and collecting information for future risk analysis.',
        '**Risk management and contingency planning**: assumes mitigation has failed and the risk has become a real problem; it defines what the team will do then.',
      ] },
      { h: 'Worked example: high staff turnover' },
      'Suppose the risk table shows **staff turnover**, probability **0.70 (70%)**, impact **critical** (projected to add 15% to schedule and cost).',
      { table: { head: ['RMMM step', 'Actions'], rows: [
        ['Mitigation', 'Meet current staff to find the causes of turnover (poor pay, working conditions, competitive market) • reduce causes under management control before the project starts • organise teams so that information about each activity is widely shared • define documentation standards so documents are produced on time • conduct peer reviews of all work • assign a **backup staff member** for every critical technologist'],
        ['Monitoring', 'General attitude of team members under project pressure • interpersonal relationships within the team • potential problems with compensation and benefits • availability of jobs inside and outside the company • whether the mitigation steps (documentation, backups) are being followed'],
        ['Management / contingency', 'If people leave: the backup takes over using the documentation • new joiners are briefed and given time to come up to speed • the manager adjusts the schedule and focuses on functions that are fully staffed • the knowledge transfer is completed before the person leaves'],
      ] } },
      { h: 'Cost of the plan' },
      'RMMM steps add cost (backups, extra documentation). Use the 80–20 rule: about 20% of the identified risks cause 80% of the potential trouble, so detailed RMMM is prepared for the high-exposure risks. Compare **risk exposure** with the cost of mitigation.',
      { formula: 'Risk exposure RE = P × C   (P = probability, C = cost if the risk occurs)' },
      { h: 'Risk information sheet (fields)' },
      'Risk ID, date, probability, impact, description, refinement/context, mitigation/monitoring, management/contingency plan/trigger, current status, originator and assigned person.',
    ],
    sources: [`${RISK} p70–79`, `${U3} "RMMM"`, `${P} §28.6–28.7`],
  },

  'se-risk-categories': {
    blocks: [
      { h: '1. Categories by what they threaten' },
      { table: { head: ['Category', 'Threatens', 'Examples'], rows: [
        ['**Project risks**', 'The project plan: schedule, budget, staffing, resources, customer and requirements', 'Schedule slippage, budget overrun, key staff leaving, requirement volatility'],
        ['**Technical risks**', 'The quality and timeliness of the software: design, implementation, interfaces, verification, maintenance', 'Ambiguous specification, unproven technology, performance not achievable'],
        ['**Business risks**', 'The viability of the software', 'Market risk (product nobody wants), strategic risk (no longer fits the business), sales risk, management risk (loss of support), budget risk (loss of funding)'],
      ] } },
      { h: '2. Categories by how predictable they are' },
      { ul: ['**Known risks**: found by careful evaluation of the plan and environment (e.g. an unrealistic delivery date, no documented requirements).', '**Predictable risks**: extrapolated from past experience (e.g. staff turnover, poor communication with the customer).', '**Unpredictable risks**: can and do occur but are extremely hard to identify in advance.'] },
      { h: 'Strategies for risk identification' },
      'Risk identification is a systematic attempt to specify threats to the project plan. Two kinds of risk are identified: **generic risks** (a threat to every project) and **product-specific risks** (found only by understanding this product\'s technology, people and environment).',
      { ul: [
        '**Risk item checklist** grouped by: product size, business impact, stakeholder characteristics, process definition, development environment, technology to be built, staff size and experience.',
        '**Risk components and drivers** questions (performance, cost, support, schedule).',
        'Brainstorming with the team; reviewing the plan, requirements and technical environment; lessons learned from earlier projects.',
      ] },
      { h: 'Strategies for risk analysis (projection)' },
      { steps: [
        'Establish a scale for the **likelihood** of each risk (e.g. very low <10%, low 10–25%, moderate 25–50%, high 50–75%, very high >75%).',
        'Describe the **consequences** (impact) of each risk: catastrophic, critical, marginal, negligible.',
        'Estimate the impact on the project and the product.',
        'Build a **risk table** (risk, category, probability, impact, RMMM), sort by probability and impact, and draw a **cut-off line**: risks above it get full RMMM attention.',
        'Compute **risk exposure** RE = P × C for each risk to compare them.',
      ] },
    ],
    sources: [`${U3} "Risk Management"`, `${RISK} p61–69`, `${P} §28.2–28.4`],
  },

  'se-risk-monitoring': {
    blocks: [
      '**Risk monitoring and control** is the part of risk management that runs **throughout the project**, after risks have been identified and planned for.',
      { h: 'Risk monitoring' },
      'A project-tracking activity with three primary objectives:',
      { ol: ['To assess whether **predicted risks actually occur**.', 'To ensure that **risk-aversion steps** defined for each risk are being properly applied.', 'To collect information that can be used for **future risk analysis**.'] },
      'The manager watches **risk indicators** (triggers), e.g. for staff turnover: team attitude, interpersonal conflicts, complaints about pay, job openings in the market. Another objective is to try to **allocate origin**: which risk caused which problem.',
      { h: 'Risk control' },
      'Control is acting on what monitoring shows:',
      { ul: [
        '**Risk planning**: for each key risk, decide a strategy: avoid, transfer (e.g. outsource the risky part or buy insurance) or reduce (e.g. plan extra recruitment).',
        '**Risk resolution**: execute the mitigation or contingency plan when a trigger fires.',
        '**Re-assessment**: update probability/impact; new risks are added and closed risks removed from the table.',
        '**Risk leverage** decides which actions are worth it:',
      ] },
      { formula: 'Risk leverage = (RE before reduction − RE after reduction) ÷ cost of reduction' },
      'A leverage greater than 1 means the reduction step saves more than it costs.',
      { h: 'Example' },
      'Risk: third-party payment API may change. Indicator: vendor release notes and deprecation warnings, monitored monthly. Control: wrap the API behind our own interface (reduction), keep a second vendor\'s SDK evaluated (contingency).',
    ],
    sources: [`${U3} "Risk Control"`, `${RISK} p72–76`, `${P} §28.6`],
  },

  'se-risk-payroll': {
    blocks: [
      'As risk analyst for computerising a company\'s payroll, I would first list risks in each category, estimate probability and impact, sort them, and prepare RMMM for the ones above the cut-off.',
      { h: 'Risk table (ranked)' },
      { table: { head: ['#', 'Risk', 'Category', 'Probability', 'Impact'], rows: [
        ['1', 'Payroll rules (tax slabs, PF, ESI, allowances) are complex and change during development', 'Technical / requirements', '60%', 'Critical'],
        ['2', 'Calculation errors in salary/tax: wrong pay or legal non-compliance', 'Technical', '40%', 'Catastrophic'],
        ['3', 'Legacy data (employee records, past salaries) is incomplete or inconsistent at migration', 'Technical', '50%', 'Critical'],
        ['4', 'Key developer with payroll domain knowledge leaves', 'Project (staff)', '30%', 'Critical'],
        ['5', 'Security/privacy breach of salary and bank data', 'Technical / business', '20%', 'Catastrophic'],
        ['6', 'Delivery date fixed to a financial year start is unrealistic', 'Project (schedule)', '50%', 'Marginal'],
        ['7', 'Users (HR/accounts) resist the new system, lack training', 'Business', '30%', 'Marginal'],
      ] } },
      { h: 'RMMM for the top risks' },
      { table: { head: ['Risk', 'Mitigation', 'Monitoring', 'Management (contingency)'], rows: [
        ['Changing payroll rules', 'Keep rules in configurable tables, not code; get rules signed off by HR/finance', 'Track statutory notifications and change requests', 'Change-control board; prioritise legally required changes'],
        ['Calculation errors', 'Independent review of formulas; BVA tests around slab limits; **parallel run** with the manual system for 2–3 cycles', 'Compare outputs of both systems every cycle', 'Fall back to manual payroll for that cycle; correct and re-run'],
        ['Bad legacy data', 'Data profiling and cleaning before migration; validation scripts', 'Count rejected records each trial load', 'Manual correction team; migrate in batches'],
        ['Key person leaves', 'Pair programming, documentation, backup developer', 'Team morale, workload', 'Backup takes over; adjust schedule'],
        ['Security breach', 'Role-based access, encryption, audit logs', 'Access logs, security audits', 'Incident response; revoke access; notify'],
      ] } },
      { tip: 'Rank by risk exposure (P × cost). Catastrophic-impact risks stay above the cut-off even when their probability is low.' },
    ],
    sources: [`${RISK} p66–79`, `${P} §28.4–28.7`, 'Applied example (payroll is the question\'s scenario)'],
  },

  'se-risk-components-drivers': {
    blocks: [
      'The US Air Force guidelines used by Pressman describe risk using **risk components** (what can go wrong) and **risk drivers** (how badly each component is affected).',
      { compare: [
        { title: 'Risk components (4)', items: ['**Performance risk**: uncertainty that the product will meet its requirements and be fit for intended use', '**Cost risk**: uncertainty that the project budget will be maintained', '**Support risk**: uncertainty that the software will be easy to correct, adapt and enhance', '**Schedule risk**: uncertainty that the schedule will be maintained and the product delivered on time'] },
        { title: 'Risk drivers (impact categories)', items: ['The impact of each driver on a component is placed in one of four categories:', '**Negligible**', '**Marginal**', '**Critical**', '**Catastrophic**', 'Each is described by the consequence of an undetected error/fault or of failing to reach the outcome'] },
      ] },
      { h: 'Difference in one line' },
      'Components are the **dimensions** of risk (performance, cost, support, schedule); drivers are the **factors and their severity** that push each component (e.g. an unproven technology drives performance risk; its impact may be "critical").',
      { h: 'Example' },
      '"Using a new real-time database" → component: performance risk; driver impact: critical (failure would cause degraded performance and mission delays).',
      { table: { head: ['Impact', 'Performance', 'Cost'], rows: [['Catastrophic', 'Failure to meet requirement results in mission failure', 'Cost increase > $500K'], ['Critical', 'Degrades system performance; mission success questionable', '$100K–$500K'], ['Marginal', 'Secondary mission degraded', '$1K–$100K'], ['Negligible', 'Inconvenience', '< $1K']] } },
    ],
    sources: [`${RISK} p63–65`, `${P} §28.3.2`],
  },

  'se-risk-steps': {
    blocks: [
      '**Risk management** is a systematic series of steps that help the team understand and manage uncertainty so problems are avoided or their impact minimised. It has two phases with three activities each.',
      { img: 'se-risk' },
      { h: 'Phase 1: Risk assessment' },
      { ol: [
        '**Risk identification**: list all possible threats (checklists, brainstorming, plan and requirement reviews, past projects). Classify as project, technical or business risks.',
        '**Risk analysis (projection)**: for each risk estimate the probability *r* and the severity *s* of loss.',
        '**Risk prioritisation**: rank risks by priority/exposure p = r × s (RE = P × C) and draw a cut-off line.',
      ] },
      { h: 'Phase 2: Risk control' },
      { ol: [
        '**Risk management planning**: decide how to handle each top risk: avoid, transfer, or reduce; prepare mitigation and contingency plans (RMMM).',
        '**Risk monitoring**: track indicators continuously, check mitigation is being followed, re-assess.',
        '**Risk resolution**: carry out the plans when a risk occurs.',
      ] },
      { h: 'Principles behind the steps' },
      'Global perspective, forward-looking view, open communication, integrated management (part of project management), continuous process.',
      { h: 'Example' },
      'College management system: the senior DB designer may resign (35%, very high impact → high priority). Plan: knowledge-transfer sessions, documentation, train a backup. Monitor: fortnightly check-ins. Resolution: if he resigns, the trained junior takes over.',
    ],
    sources: [`${U3} "Risk Management Activities"`, 'Unit _3.docx "The Risk Management Process"', `${P} §28.2–28.7`],
  },

  'se-risk-budget-tech': {
    blocks: [
      { h: 'Budget risk' },
      'Uncertainty about money: the project may overrun its budget, or the funding/personnel commitment may be withdrawn. Causes: wrong estimation, scope creep, unplanned expansion, poor cost tracking.',
      '*Example:* a hospital app estimated at ₹40 lakh needs a costly HL7 integration discovered mid-way; cost rises to ₹55 lakh and management threatens to cut funding.',
      { h: 'Project risk' },
      'Threatens the **project plan**: schedule, staffing, resources, customer and requirement problems. If it occurs, the schedule slips and costs rise.',
      '*Example:* two of five developers are pulled onto another project; schedule slips by six weeks.',
      { h: 'Technical risk' },
      'Threatens the **quality and timeliness** of the software: design, implementation, interface, verification and maintenance problems; ambiguous specs; technical uncertainty or obsolescence. If it occurs, implementation may become difficult or impossible.',
      '*Example:* the chosen face-recognition library cannot meet the 1-second response time on the target hardware.',
      { table: { head: ['', 'Budget', 'Project', 'Technical'], rows: [['Affects', 'Cost', 'Plan & schedule', 'Product quality'], ['Typical trigger', 'Estimation error', 'Staff/resource loss', 'New or untried technology'], ['Mitigation', 'Contingency reserve, tracking', 'Backups, buffers', 'Prototypes, spikes, expert review']] } },
    ],
    sources: [`${U3} "Risk Management"`, `${P} §28.3`],
  },

  'se-risk-characteristics': {
    blocks: [
      'Risk always involves **two characteristics**:',
      { ol: [
        '**Uncertainty**: the risk may or may not happen; there are no 100% probable risks (a 100% probable risk is a constraint, not a risk).',
        '**Loss**: if the risk becomes a reality, unwanted consequences or losses will occur (to cost, schedule, quality or the business).',
      ] },
      'When risks are analysed, it is important to quantify the level of uncertainty (probability) and the degree of loss (impact) associated with each one.',
    ],
    sources: [`${RISK} p58`, `${P} §28.2`],
  },

  'se-risk-impact': {
    blocks: [
      'Each type of risk hits a different part of project management:',
      { table: { head: ['Risk type', 'Impact on project-management processes'], rows: [
        ['**Project risks** (schedule, staff, budget, requirements)', '**Scheduling**: slips and re-planning • **Staffing**: re-allocation, recruitment, training • **Cost control**: overruns, need for contingency reserves • **Scope management**: change requests'],
        ['**Technical risks** (design, technology, performance)', '**Estimation** becomes unreliable • **Quality management** needs more reviews and testing • extra prototyping tasks enter the schedule • rework affects cost'],
        ['**Business risks** (market, strategy, management support)', '**Project initiation and continuation** decisions • loss of funding or sponsorship can cancel or shrink the project • priorities and scope may change'],
        ['**Known/predictable risks**', 'Can be planned into the schedule and budget as buffers'],
        ['**Unpredictable risks**', 'Need general contingency reserves and quick re-planning'],
      ] } },
      'That is why risk management is **integrated** with planning, estimation, tracking and quality management rather than done once and forgotten.',
    ],
    sources: [`${U3}`, `${P} §28.3`],
  },

  'se-risk-checklist': {
    blocks: [
      'One method for identifying risks is a **risk item checklist**: a list of known and predictable risks in generic subcategories. The team goes through each item and asks whether it applies to this project.',
      { h: 'Subcategories of the checklist' },
      { ul: [
        '**Product size**: overall size of the software to be built or modified.',
        '**Business impact**: constraints imposed by management or the marketplace.',
        '**Stakeholder characteristics**: sophistication of stakeholders and the developer\'s ability to communicate with them.',
        '**Process definition**: degree to which the process has been defined and is followed.',
        '**Development environment**: availability and quality of tools.',
        '**Technology to be built**: complexity and newness of the system.',
        '**Staff size and experience**: overall technical and project experience of the engineers.',
      ] },
      { h: 'Using it' },
      { steps: ['Answer the questions for each subcategory (e.g. "Have top managers formally committed to support the project?", "Are requirements stable?", "Is the staff trained in the tools?").', 'Answers marked "no" or "uncertain" reveal risks.', 'The checklist can also be organised by **risk components and drivers** (performance, cost, support, schedule).', 'Record each identified risk in the risk table for analysis.'] },
      { h: 'Example questions (project risk)' },
      { ol: ['Have top software and customer managers formally committed to support the project?', 'Are end users enthusiastically committed to the project?', 'Are requirements fully understood by the team and its customers?', 'Have customers been involved fully in defining requirements?', 'Is project scope stable?', 'Does the team have the right mix of skills?', 'Is the number of people on the team adequate?'] },
      'The more "no" answers, the higher the overall project risk.',
    ],
    sources: [`${RISK} p61–63`, `${P} §28.3.1`],
  },

  // ---------------- Estimation ----------------
  'se-problem-based': {
    blocks: [
      '**Problem-based estimation** is a decomposition technique: the software is broken down into the **problem functions** it must deliver, the **size** (LOC or FP) of each is estimated, and size is converted into effort and cost using **historical productivity**.',
      { h: 'Steps' },
      { steps: [
        'Begin with a **bounded statement of software scope** (what is in and out).',
        '**Decompose** the software into problem functions that can each be estimated individually.',
        'Estimate **LOC or FP** for each function, as three values: optimistic, most likely, pessimistic.',
        'Compute the **expected value** with the three-point (beta) formula.',
        'Apply **baseline productivity** metrics (LOC/pm or FP/pm) from past projects to get effort; multiply by the labour rate for cost.',
        'Combine the per-function estimates into the project estimate; reconcile with other methods.',
      ] },
      { formula: 'S = (Sopt + 4·Sm + Spess) / 6' },
      { h: 'Example (CAD software)' },
      '3-D geometric analysis function: Sopt = 4,600, Sm = 6,900, Spess = 8,600 → S = (4,600 + 27,600 + 8,600) / 6 = **6,800 LOC**.',
      { table: { head: ['Function', 'Estimated LOC'], rows: [['User interface & control', '2,300'], ['2-D geometric analysis', '5,300'], ['3-D geometric analysis', '6,800'], ['Database management', '3,350'], ['Graphics display', '4,950'], ['Peripheral control', '2,100'], ['Design analysis', '8,400'], ['**Total**', '**33,200**']] } },
      'Productivity 620 LOC/pm, labour Rs 8,000/month → effort = 33,200/620 ≈ **54 pm**, cost ≈ **Rs 4.3 lakh**, cost per LOC ≈ Rs 13.',
      { h: 'Guidelines' },
      { ul: ['Decompose until each function can be estimated with confidence.', 'Use your own organisation\'s **historical data**, matched to the project domain.', 'Do **both LOC and FP** estimates (and a process-based estimate) and reconcile them; large disagreement means the scope is not understood.', 'Use the three-point formula to reflect uncertainty.', 'Record actual values to improve the next estimate.'] },
    ],
    sources: ['Unit _3.docx "Problem-Based Estimation"', `${EST} p23–25`, `${P} §26.6.2–26.6.3`],
  },

  'se-fp-define': {
    blocks: [
      'A **function point (FP)** is a measure of software size based on the **functionality delivered to the user**, proposed by Albrecht. FP is computed from countable measures of the information domain and an assessment of complexity, so it is **independent of the programming language**.',
      { h: 'Procedure' },
      { steps: [
        'Count the five **information-domain values**: External Inputs (EI), External Outputs (EO), External Inquiries (EQ), Internal Logical Files (ILF), External Interface Files (EIF).',
        'Rate each as simple, average or complex and multiply by the weighting factor.',
        'Add them to get the **count total** (unadjusted FP, UFP).',
        'Rate the **14 value adjustment factors** (Fi) from 0 (no influence) to 5 (essential): data communication, distributed processing, performance, heavily used configuration, transaction rate, online data entry, end-user efficiency, online update, complex processing, reusability, installation ease, operational ease, multiple sites, facilitate change.',
        'Compute FP with the formula.',
      ] },
      { table: { head: ['Domain value', 'Simple', 'Average', 'Complex'], rows: [['EI', '3', '4', '6'], ['EO', '4', '5', '7'], ['EQ', '3', '4', '6'], ['ILF', '7', '10', '15'], ['EIF', '5', '7', '10']] } },
      { formula: 'FP = count total × [0.65 + 0.01 × ΣFi]' },
      { h: 'Example' },
      'EI = 3, EO = 2, EQ = 2, ILF = 1, EIF = 4 (simple weights): count total = 9 + 8 + 6 + 7 + 20 = 50. ΣFi = 46 → FP = 50 × (0.65 + 0.46) = **55.5 ≈ 56**.',
      { h: 'Function-oriented metrics derived from FP' },
      'Errors per FP, defects per FP, cost per FP, pages of documentation per FP, FP per person-month.',
      { h: 'Applications' },
      { ul: ['Estimating effort and cost early (from requirements, before code exists).', 'Measuring productivity and quality independent of language.', 'Comparing projects and benchmarking; contract sizing.', 'Converting to LOC using language tables (backfiring) for models like COCOMO.'] },
      { tip: 'Practise with the FP calculator on the Numericals tab.' },
    ],
    sources: [`${EST} p26–30`, `${P} §30.2.1`],
  },

  'se-loc-vs-fp': {
    blocks: [
      { table: { head: ['Basis', 'LOC-based estimation', 'FP-based estimation'], rows: [
        ['Measures', 'Size of the **code** (lines)', 'Size of the **functionality** delivered'],
        ['Estimated from', 'Decomposition into functions; LOC per function', 'Five domain values per function + 14 adjustment factors'],
        ['Language', 'Dependent', 'Independent'],
        ['When possible', 'Harder early (needs design detail)', 'Early, from requirements'],
        ['Productivity metric', 'LOC/pm', 'FP/pm'],
        ['Drawbacks', 'Penalises short, well-designed programs; varies by language and style', 'Counting is subjective; needs trained counters'],
        ['Used by', 'COCOMO, size-oriented metrics', 'Function-oriented metrics, COCOMO II (via conversion)'],
      ] } },
      { h: 'LOC example' },
      'CAD software decomposed into seven functions totalling **33,200 LOC**; productivity 620 LOC/pm, Rs 8,000/pm → effort ≈ 54 pm, cost ≈ Rs 4.3 lakh.',
      { h: 'FP example (same CAD software)' },
      { table: { head: ['Domain value', 'Opt', 'Likely', 'Pess', 'Est. count', 'Weight', 'FP'], rows: [['EI', '20', '24', '30', '24', '4', '97'], ['EO', '12', '15', '22', '16', '5', '78'], ['EQ', '16', '22', '28', '22', '5', '88'], ['ILF', '4', '4', '5', '4', '10', '42'], ['EIF', '2', '2', '3', '2', '7', '15'], ['**Count total**', '', '', '', '', '', '**320**']] } },
      'ΣFi = 52 → FP = 320 × (0.65 + 0.52) ≈ **375**. With 6.5 FP/pm and Rs 8,000/pm → effort ≈ 58 pm, cost ≈ Rs 4.6 lakh.',
      'The two estimates (54 vs 58 pm) are close, which gives confidence in the result; a big difference would mean the scope must be re-examined.',
    ],
    sources: [`${EST} p23–30`, `${P} §26.6.3–26.6.4`],
  },

  'se-size-metrics': {
    blocks: [
      '**Size-oriented metrics** are derived by normalising quality and productivity measures by the **size** of the software, usually thousands of lines of code (KLOC). Each project records a row in a table:',
      { table: { head: ['Project', 'LOC', 'Effort (pm)', 'Cost', 'Pages of docs', 'Errors', 'Defects', 'People'], rows: [['alpha', '12,100', '24', '$168,000', '365', '134', '29', '3'], ['beta', '27,200', '62', '$440,000', '1,224', '321', '86', '5'], ['gamma', '20,200', '43', '$314,000', '1,050', '256', '64', '6']] } },
      { h: 'Metrics derived' },
      { ul: ['Errors per KLOC', 'Defects per KLOC', 'Cost ($) per LOC', 'Pages of documentation per KLOC', 'LOC per person-month (productivity)', 'Errors per person-month'] },
      'For alpha: 134/12.1 = 11.1 errors per KLOC; 12,100/24 = 504 LOC/pm; $168,000/12,100 = $13.9 per LOC.',
      { h: 'Examples of product size metrics' },
      'LOC/KLOC, number of functions or classes, function points, number of screens/reports, number of use cases or user stories, number of database tables.',
      { h: 'How they act as indicators of project progress' },
      { ul: [
        '**Estimating effort**: size × historical productivity (or COCOMO) gives effort and cost.',
        '**Tracking progress**: LOC (or functions) completed vs planned shows whether the project is on schedule (e.g. 18 KLOC of 30 KLOC done at 50% of time → ahead).',
        '**Detecting issues**: errors/KLOC much higher than history signals poor quality in a module; productivity far below history signals a staffing or technical problem.',
        '**Comparing** projects and teams over time.',
      ] },
      { h: 'The LOC metric' },
      'LOC counts the delivered source lines (excluding comments and blanks). It measures **size** directly and is a rough proxy for **complexity** and effort.',
      { compare: [
        { title: 'For', items: ['Easy to count and automate', 'Used by many estimation models (COCOMO)', 'Large body of historical data'] },
        { title: 'Against', items: ['Language dependent', 'Penalises well-designed, shorter programs', 'Hard to estimate before design', 'Doesn\'t suit non-procedural or generated code'] },
      ] },
    ],
    sources: [`${EST}`, `${P} §30.3.1`],
  },

  'se-loc-role': {
    blocks: [
      '**Lines of code (LOC)** is the most direct measure of software **size**. In estimation it plays these roles:',
      { ul: [
        '**Unit of size** in problem-based estimation: each function\'s LOC is estimated (three-point), and the total is converted to effort with LOC/pm productivity.',
        '**Input to empirical models**: COCOMO uses KLOC (E = a·KLOCᵇ).',
        '**Normalising metric**: errors/KLOC, cost per LOC, LOC/pm let us compare projects and use history.',
        '**Progress tracking**: LOC written vs planned.',
      ] },
      'Limitations: language-dependent, hard to know before design, penalises concise code. That is why LOC estimates are cross-checked with FP.',
    ],
    sources: [`${EST}`, `${P} §26.6.1`],
  },

  'se-sizing-methods': {
    blocks: [
      'The accuracy of a project estimate depends first on how well the **size** of the software is estimated. Size is quantified as LOC (direct) or FP (indirect). Putnam and Myers suggest four approaches to the sizing problem:',
      { ol: [
        '**"Fuzzy logic" sizing**: the planner identifies the type of application, establishes its magnitude on a qualitative scale (very small … very large), then refines it within the range using historical data on similar applications.',
        '**Function point sizing**: estimate the information-domain characteristics (EI, EO, EQ, ILF, EIF) and compute FP.',
        '**Standard component sizing**: software is built from standard components (subsystems, modules, screens, reports, interactive programs, batch programs, files, LOC, object-level instructions). The planner estimates the number of occurrences of each and multiplies by historical size per component.',
        '**Change sizing**: used when an existing system is modified; the planner estimates the number and type of modifications (reuse, adding code, changing code, deleting code) and weights them by effort ratio.',
      ] },
      'Results of these approaches are combined statistically: a **three-point** (optimistic, most likely, pessimistic) value is created for each, then the expected value is computed.',
      { formula: 'S = (Sopt + 4·Sm + Spess) / 6' },
      { h: 'Other common approaches' },
      'Use-case points, object/application points (COCOMO II), expert judgement and analogy with past projects.',
    ],
    sources: [`${EST} p18–21`, 'Unit _3.docx "Software Sizing"', `${P} §26.6.1`],
  },

  'se-effort-role': {
    blocks: [
      '**Effort estimation** predicts the amount of work (person-months), cost and duration needed to build the software.',
      { h: 'Role in the project' },
      { ul: ['Basis of the **budget** and quotations / bids.', 'Basis of the **schedule**: effort ÷ staff gives duration; milestones are set from it.', '**Staffing**: how many people, with which skills, and when.', '**Feasibility and go/no-go** decisions.', 'A **baseline** to track progress (actual vs estimated effort).'] },
      { h: 'Why do it early?' },
      { ul: ['Commitments to customers (price, delivery date) are made at the start.', 'Early estimates reveal an infeasible scope or deadline while it is still cheap to change.', 'Resources (people, tools) must be arranged in advance.', 'Early estimates can be **refined iteratively** as requirements and design become clearer.'] },
    ],
    sources: [`${U3} "Effort estimation"`, 'Unit _3.docx', `${P} §26.1`],
  },

  'se-expert-recursive': {
    blocks: [
      { h: 'Expert judgement' },
      'One or more experienced people estimate effort from their knowledge of similar past projects.',
      { ul: ['**Simple expert judgement**: a single expert gives a figure. Quick, often accurate if the expert has relevant experience; but subjective and biased.', '**Delphi / Wideband Delphi**: a coordinator gives each expert the specification; experts estimate **anonymously**; the coordinator summarises; experts discuss the differences (wideband) and re-estimate; repeat until estimates converge. Reduces individual bias and the influence of dominant people.', '**Planning poker** (agile variant): team members reveal effort cards simultaneously and discuss outliers.'] },
      { h: 'Recursive (decomposition) estimation' },
      'Based on **divide and conquer**: if a component is too large to estimate reliably, decompose it further; repeat **recursively** until each piece is small enough to estimate confidently, then add the estimates back up (bottom-up).',
      { steps: ['Start with the bounded software scope.', 'Decompose into major functions (problem-based) or process activities (process-based).', 'For each part: if it can be estimated confidently, estimate it (LOC, FP or effort, three-point); otherwise decompose it again.', 'Sum the estimates up the hierarchy (work breakdown structure).', 'Add integration and management effort; reconcile with a top-down estimate.'] },
      { compare: [
        { title: 'Expert judgement', items: ['Top-down, fast', 'Needs experienced people', 'Good early, little data', 'Hard to justify in detail'] },
        { title: 'Recursive decomposition', items: ['Bottom-up, detailed', 'Needs a clear scope/design', 'More accurate, more effort', 'Traceable: each figure has a basis'] },
      ] },
      'In practice both are used and compared: large disagreement means the scope is not yet understood.',
    ],
    sources: [`${U3} "Expert Judgment", "Wideband Delphi", "Bottom-Up Estimation"`, `${P} §26.5–26.6`],
  },

  'se-cocomo-what': {
    blocks: [
      'The **Constructive Cost Model (COCOMO)** was introduced by **Barry Boehm (1981)**. It is an empirical (regression-based) model that estimates **effort** (person-months), **development time** (months) and hence **staff** from the size of the software in **KLOC**.',
      { h: 'Three project modes' },
      { table: { head: ['Mode', 'Description', 'a', 'b', 'c', 'd'], rows: [
        ['Organic', 'Small, simple projects; small experienced team; familiar environment (e.g. payroll, business apps)', '2.4', '1.05', '2.5', '0.38'],
        ['Semi-detached', 'Medium size; mixed experience; some rigid requirements (e.g. DBMS, compilers, utilities)', '3.0', '1.12', '2.5', '0.35'],
        ['Embedded', 'Complex; tight hardware, real-time or regulatory constraints (e.g. air-traffic control, avionics)', '3.6', '1.20', '2.5', '0.32'],
      ] } },
      { formula: 'Effort E = a × (KLOC)^b  pm     Time D = c × (E)^d  months     Staff = E ÷ D' },
      { h: 'Three levels' },
      { ul: ['**Basic**: effort from size and mode only (rough).', '**Intermediate**: multiplies by an **Effort Adjustment Factor** (EAF) from **15 cost drivers** in four groups: product, hardware, personnel, project attributes.', '**Detailed**: applies cost drivers phase by phase.'] },
      { h: 'COCOMO II' },
      'Three sub-models: **application composition** (object points, early prototyping), **early design** (FP/KLOC + few cost drivers), **post-architecture** (17 cost drivers + 5 scale factors).',
      { h: 'Example' },
      '40 KLOC organic: E = 2.4 × 40^1.05 = 115.4 pm; D = 2.5 × 115.4^0.38 = 15.2 months; staff ≈ 7.6.',
    ],
    sources: ['Unit _3.docx "Introduction to COCOMO Model"', `${EST} p31–36`, `${P} §26.7`],
  },

  'se-reduce-estimate-risk': {
    blocks: [
      'Cost estimates are made before the software exists, so they are inherently risky. Four ways (Pressman) to reduce that risk:',
      { ol: [
        '**Delay estimation until late in the project.** 100% accurate estimates are possible after the project is complete, but this is impractical; estimates are needed up front.',
        '**Base estimates on similar projects that have already been completed.** Works well when the current project is quite similar and other influences (customer, environment, deadlines) are equivalent.',
        '**Use relatively simple decomposition techniques.** Break the project into major functions and activities (problem-based LOC/FP, process-based) and estimate each piece: divide and conquer.',
        '**Use one or more empirical models** for effort and cost (e.g. COCOMO, the software equation) calibrated with local data.',
      ] },
      'Options 3 and 4 are used together and their results cross-checked: if LOC, FP and COCOMO agree, confidence is high.',
      { h: 'Other good practices' },
      { ul: ['Use three-point (optimistic/likely/pessimistic) values.', 'Keep historical data and calibrate models.', 'Re-estimate at each milestone as information improves.', 'Include contingency for identified risks (risk exposure).'] },
    ],
    sources: ['Unit _3.docx "Decomposition Techniques"', `${EST} p10–14`, `${P} §26.5`],
  },

  // ---------------- Numericals ----------------
  'se-num-loc-mower': {
    blocks: [
      'Any reasonable functional decomposition earns the marks; show it as a table with three-point estimates, then compute. One example:',
      { table: { head: ['Function', 'Opt', 'Likely', 'Pess', 'Expected LOC'], rows: [
        ['User interface & control panel', '1,200', '1,500', '1,800', '1,500'],
        ['Lawn mapping & boundary detection', '2,000', '2,500', '3,000', '2,500'],
        ['Path planning & navigation', '2,800', '3,500', '4,200', '3,500'],
        ['Obstacle detection (sensors)', '1,500', '2,000', '2,500', '2,000'],
        ['Motor and blade control', '1,400', '1,800', '2,200', '1,800'],
        ['Battery monitoring & return-to-dock', '800', '1,000', '1,200', '1,000'],
        ['Scheduling (mow times, weather)', '600', '800', '1,000', '800'],
        ['Error handling, diagnostics, logging', '900', '1,200', '1,500', '1,200'],
        ['**Total**', '', '', '', '**14,300**'],
      ] } },
      'Expected value per function: S = (opt + 4·likely + pess)/6 (symmetric ranges give the likely value).',
      { ul: ['Effort = 14,300 ÷ 450 = **31.8 person-months**', 'Cost = 31.8 × $7,000 = **$222,444**', 'Cost per LOC = 7,000 ÷ 450 = **$15.56**', 'With, say, 5 developers → about 6.4 months'] },
    ],
    sources: ["SE Nov '25 paper Q11(b)", `${P} §26.6.3 (CAD example method)`],
  },

  'se-num-fp': {
    blocks: [
      { table: { head: ['Domain value', 'Count', 'Average weight', 'Total'], rows: [['External inputs', '50', '4', '200'], ['External outputs', '40', '5', '200'], ['External inquiries', '35', '4', '140'], ['Internal logical files', '6', '10', '60'], ['External interfaces', '4', '7', '28'], ['**Count total (UFP)**', '', '', '**628**']] } },
      'The paper gives no ratings for the 14 complexity-adjustment factors, so assume each is **average (Fi = 3)**: ΣFi = 14 × 3 = 42.',
      { formula: 'CAF = 0.65 + 0.01 × ΣFi = 0.65 + 0.42 = 1.07' },
      { formula: 'FP = UFP × CAF = 628 × 1.07 = 671.96' },
      '**FP ≈ 672.**',
      { note: 'If you assume all factors "moderate" (2) instead, ΣFi = 28, CAF = 0.93 and FP = 584. State your assumption: examiners accept either with working.' },
    ],
    sources: ["SE May '25 paper (compiled bank)", `${P} §30.2.1`, 'Verified with the FP calculator'],
  },

  'se-num-cocomo-200': {
    blocks: [
      'Average-experience team, schedule not very tight → **semi-detached** mode: a = 3.0, b = 1.12, c = 2.5, d = 0.35.',
      { formula: 'E = 3.0 × (200)^1.12 = 3.0 × 377.7 = 1133.12 person-months' },
      { formula: 'D = 2.5 × (1133.12)^0.35 = 2.5 × 11.72 = 29.30 months' },
      { ul: ['Average staff = E / D = 1133.12 / 29.30 = **38.67 ≈ 39 persons**', 'Productivity = 200,000 LOC / 1133.12 pm = **176.5 LOC/pm**'] },
    ],
    sources: ["SE May '25 paper (compiled bank)", 'Unit _3.docx COCOMO section', 'Verified with the COCOMO calculator'],
  },

  'se-num-cocomo-400': {
    blocks: [
      { table: { head: ['Mode (a, b, d)', 'Effort E = a·400ᵇ (pm)', 'Time D = 2.5·Eᵈ (months)', 'Staff E/D'], rows: [
        ['Organic (2.4, 1.05, 0.38)', '2.4 × 400^1.05 = **1295.31**', '2.5 × 1295.31^0.38 = **38.08**', '34'],
        ['Semi-detached (3.0, 1.12, 0.35)', '3.0 × 400^1.12 = **2462.80**', '2.5 × 2462.80^0.35 = **38.45**', '64'],
        ['Embedded (3.6, 1.20, 0.32)', '3.6 × 400^1.20 = **4772.81**', '2.5 × 4772.81^0.32 = **37.60**', '127'],
      ] } },
      'Effort rises sharply with the mode while development time stays almost the same: embedded projects need far more people working in parallel.',
    ],
    sources: ["SE Jun '24 paper (compiled bank)", 'Verified with the COCOMO calculator'],
  },

  'se-num-cocomo2-atm': {
    blocks: [
      'COCOMO II **application-composition** model uses **object points**: count screens, reports and 3GL components, weight them by complexity, adjust for reuse, and divide by a productivity rate.',
      { table: { head: ['Object', 'Count', 'Complexity weight (medium)', 'Points'], rows: [['Screens', '12', '2', '24'], ['Reports', '10', '5', '50'], ['3GL components', '80', '10', '800'], ['**Object points (OP)**', '', '', '**874**']] } },
      'Assume no reuse: NOP = OP × (100 − %reuse)/100 = 874.',
      { table: { head: ['Developer experience / environment maturity', 'Very low', 'Low', 'Nominal', 'High', 'Very high'], rows: [['PROD (NOP/pm)', '4', '7', '13', '25', '50']] } },
      'Average experience and maturity → nominal **PROD = 13**.',
      { formula: 'Effort = NOP ÷ PROD = 874 ÷ 13 ≈ 67.2 person-months' },
      { note: 'State your assumptions (reuse %, PROD) clearly; with 20% reuse NOP = 699 and effort ≈ 53.8 pm.' },
    ],
    sources: ["SE Dec '24 paper", `${EST} p31–36`, `${P} §26.7.2`],
  },

  'se-num-loc-cad': {
    blocks: [
      { table: { head: ['Function', 'LOC'], rows: [['3-D geometric analysis', '6,800'], ['User interface & control', '2,300'], ['2-D geometric analysis', '5,300'], ['Database management', '3,350'], ['Graphics display', '4,950'], ['Peripheral control', '2,100'], ['Design analysis', '8,400'], ['**Total**', '**33,200**']] } },
      { formula: 'Cost per LOC = labour rate ÷ productivity = 8000 ÷ 620 = Rs 12.90' },
      { formula: 'Effort = 33,200 ÷ 620 = 53.55 person-months (≈ 54 pm)' },
      { formula: 'Total cost = 53.55 × 8000 = Rs 4,28,387 (≈ 33,200 × 12.90)' },
    ],
    sources: ["SE Dec '22–Jan '23 paper", `${P} §26.6.3`],
  },

  // ---------------- Plan, schedule, staffing ----------------
  'se-schedule-staffing': {
    blocks: [
      '**Scheduling** distributes the estimated effort across the planned duration by allocating it to specific tasks. **Staffing** decides who does the work and when.',
      { h: 'Scheduling principles' },
      { ul: ['**Compartmentalisation**: define distinct, manageable tasks.', '**Interdependency**: which tasks are sequential and which can run in parallel.', '**Time allocation**: start date, end date and effort for every task.', '**Effort validation**: total assigned effort = estimated effort; no one over-allocated.', '**Defined responsibilities**, **defined outcomes** (work products) and **defined milestones**.'] },
      { h: 'Phases of building the schedule' },
      { steps: ['Define scope, deliverables and milestones.', 'Break work into tasks using a **work breakdown structure (WBS)**.', 'Sequence tasks: build a **task network** (activity / PERT diagram) showing dependencies and the critical path.', 'Estimate each task\'s duration (expert judgement, three-point).', 'Allocate resources and do resource levelling.', 'Produce a **timeline (Gantt) chart** with milestones.', 'Track progress (earned value) and re-plan when reality differs.'] },
      { img: 'se-gantt' },
      { h: 'People and effort' },
      'The relationship is **non-linear** (Putnam–Norden–Rayleigh curve). There is a minimum development time; compressing below it explodes effort, and **adding people late makes a late project later** (Brooks\'s law) because of training and communication overhead. Effort distribution guideline **40–20–40**: analysis & design, coding, testing.',
      { formula: 'Average staff = total effort (pm) ÷ duration (months)' },
      { h: 'Staffing strategies' },
      { ul: ['**Rayleigh-curve staffing**: build up slowly in requirements, peak during design/coding, taper off in testing, rather than a flat team.', '**Match roles to phases**: analysts and architects early, programmers in the middle, testers later.', '**Skill-based allocation**: assign tasks by expertise and availability; balance workload.', '**Recruit or contract** for skill gaps; consultants for short specialised needs.', '**Training and mentoring** to grow skills; backups for critical people.', '**Team organisation**: chief-programmer (closed), democratic/egoless (open), mixed; small agile teams.', '**Monitor and adjust** staffing as needs change.'] },
    ],
    sources: [`${U3} "Project Schedule and Staffing"`, 'Unit _3.docx "Project Schedule and Staffing"', `${P} §27.1–27.5`],
  },

  'se-project-plan-sections': {
    blocks: [
      'A **software project plan** is the document that records how the project will be carried out and controlled. Its sections and their purpose:',
      { table: { head: ['Section', 'Purpose'], rows: [
        ['1. Introduction / scope and objectives', 'States what is to be built, its boundaries, major functions, constraints, and the goals of the project'],
        ['2. Project estimates', 'Size, effort, cost and duration estimates with the techniques and historical data used'],
        ['3. Project schedule', 'WBS, task network, Gantt chart, milestones and deliverables'],
        ['4. Project resources and staffing', 'People (roles, skills, numbers), hardware, software and tools needed and when'],
        ['5. Team / organisation structure', 'Reporting lines, responsibilities, communication'],
        ['6. Risk management plan', 'Risk table and RMMM plans'],
        ['7. Quality assurance plan', 'Standards, reviews, testing strategy, metrics'],
        ['8. Configuration management plan', 'Version control, baselines, change control'],
        ['9. Tracking and control mechanisms', 'How progress is measured and reported; re-planning triggers'],
        ['10. Appendices', 'Supporting data'],
      ] } },
      { h: 'Activities that must be present' },
      'Estimation, scheduling, staffing, risk planning, quality planning, configuration management planning, and project monitoring/control.',
      { h: 'Does it depend on the SDLC?' },
      '**Partly.** The planning activities above are needed in every project, but **how** they are carried out depends on the life-cycle model:',
      { ul: ['**Waterfall**: one detailed up-front plan with phase milestones (requirements, design, code, test).', '**Incremental/iterative**: a high-level plan plus detailed plans per increment; milestones are increments.', '**Spiral**: planning and risk analysis repeated every cycle.', '**Agile**: release plan + sprint plans; estimates in story points; continuous re-planning.'] },
    ],
    sources: ['Unit-3-Part-1_SE.pdf p95–110', `${P} §26–27`],
  },

  'se-milestones': {
    blocks: [
      { compare: [
        { title: 'Activity', items: ['A part of the project that **takes time and resources** (effort)', 'Has a start and an end', 'Example: "lay the foundation", "write the payment module"'] },
        { title: 'Milestone', items: ['A **point in time** marking the **completion of an activity** or a group of activities', 'Takes no time or resources itself', 'Has a verifiable deliverable; used to check progress', 'Example: "foundation complete and inspected"'] },
      ] },
      { h: 'Three milestones for building a house' },
      { ol: ['**Foundation completed** (and approved by the inspector).', '**Structure / roof completed** (walls and roof up: building is weather-tight).', '**Electrical and plumbing completed** / **house ready for handover** (final inspection passed).'] },
      'Software equivalents: requirements signed off, design reviewed, code complete, system test passed, product delivered.',
      { h: 'How progress is affected' },
      'Milestones make progress **visible**: if a milestone date passes without its deliverable, the manager knows immediately that the project is slipping and can re-plan, add resources or reduce scope.',
    ],
    sources: ['Unit-3-Part-1_SE.pdf p264–272', `${P} §27.2`],
  },

  'se-plan-iterative': {
    blocks: [
      { h: 'Why planning is iterative' },
      { ul: ['At the start, information is incomplete: requirements are unclear and estimates are uncertain.', 'As the project proceeds, more is known (requirements firm up, design is done, actual productivity is measured), so the plan is **refined**.', 'Risks occur, requirements change, staff change: the plan must be adjusted.', 'Planning therefore starts with a coarse plan and is revisited at every milestone ("progressive elaboration").'] },
      { h: 'Why the plan must be continually reviewed' },
      'A plan that is never compared with reality is useless: reviews detect slippage early, keep estimates honest, and keep stakeholders informed.',
      { h: 'Checking a detailed schedule against the overall plan' },
      { steps: ['Map every detailed task to a phase/milestone of the overall plan.', 'Check that the **sum of task efforts** equals the estimated effort for that phase.', 'Check that the **milestone dates** in the detailed schedule match the dates in the plan.', 'Check that **staff allocation** does not exceed the people available in each period.', 'Check the **critical path**: does it end on or before the planned delivery date?'] },
      { h: 'If it is not consistent' },
      { ul: ['Re-estimate the tasks or find the wrong assumptions.', 'Adjust: add resources (early, not late), re-sequence tasks in parallel, reduce or phase the scope, or move the milestone.', 'Negotiate changes with the customer and update the plan formally (baseline it again).'] },
    ],
    sources: ['Unit-3-Part-1_SE.pdf', `${P} §26.2, §27.5`],
  },

  'se-performance-planning': {
    blocks: [
      '**Performance** (response time, throughput, resource use) is a **non-functional requirement** that affects architecture, hardware, cost and schedule, so it must be considered **during planning**, not left to testing.',
      { h: 'Justification' },
      { ul: [
        '**Estimation**: performance-critical systems need extra design, tuning and testing effort; COCOMO treats tight timing and storage constraints as cost drivers (TIME, STOR) that raise effort.',
        '**Risk**: "performance requirements not met" is a classic technical risk; planning includes prototypes/benchmarks to reduce it.',
        '**Architecture and resources**: the plan must budget for hardware, caching, load balancers or faster technologies.',
        '**Schedule**: performance and load testing must be scheduled and staffed.',
        '**Quality planning**: measurable targets (e.g. "95% of requests < 2 s with 1,000 users") are set as acceptance criteria.',
        '**Cost of late discovery**: poor performance found after delivery may need redesign, which is far more expensive.',
      ] },
      { h: 'Example' },
      'An online exam portal must handle 5,000 students submitting at the same minute. Planning includes load-test tasks, a scalable architecture, and a risk entry with mitigation (early stress-test prototype).',
      { h: 'Effect on project progress' },
      'If ignored, performance problems appear in system testing: rework of design and code delays milestones and increases cost. If planned, progress is tracked against performance targets at each milestone.',
    ],
    sources: [`${U3} "Quality Planning"`, 'Unit-3-Part-1_SE.pdf p263', `${P} §26.7`],
  },

  'se-pred-quality-plan': {
    blocks: [
      '**Quality planning** defines how the project will achieve the required quality: quality goals, the standards to follow, the reviews and tests to run, the metrics to collect and who is responsible. Quality cannot be "inspected in" at the end; it must be **planned and built in**.',
      { h: 'Contents of a quality (SQA) plan' },
      { ul: ['Purpose, scope and **measurable quality goals** (e.g. < 0.5 defects/KLOC at delivery).', 'Organisation and responsibilities (SQA group, QA lead, testers).', 'Applicable **standards**, procedures and conventions (ISO 9001, IEEE, coding standards).', 'Planned **reviews and audits**: FTRs, inspections, walkthroughs.', '**Testing strategy**: unit, integration, system, acceptance.', 'Defect reporting, tracking and analysis.', 'Configuration management and change control.', 'Tools, methods and training.', '**Metrics** and reporting (defect density, review effectiveness, test coverage).', 'Schedule of quality activities; handling of non-conformance.'] },
      { h: 'Steps in quality planning' },
      { steps: ['Analyse requirements for quality expectations.', 'Define acceptance criteria (functional and non-functional).', 'Write and approve the quality plan.', 'Build quality activities into the process and schedule.', 'Monitor metrics, audit, improve.'] },
      { h: 'Cost of quality' },
      'Prevention (training, process) + appraisal (reviews, testing) + internal failure (rework) + external failure (customer-found defects). Investing in prevention lowers the total.',
    ],
    sources: [`${U3} "Quality Planning"`, 'Unit _3.docx "Quality Planning"', `${P} §21`],
  },
}
