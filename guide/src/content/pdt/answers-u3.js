// PDT Unit III (define phase, rest) model answers. Keyed by PYQ id.
const U3 = 'PDT Unit-3 slides (FDT-Unit 3.pptx)'
const U2 = 'FDT Unit-2 Empathy Phase.pptx'
const BB = 'Stanford d.school Bootcamp Bootleg'

export default {
  'pdt-ps-what': {
    blocks: [
      'In the **Define phase**, the team analyses and synthesises what it learnt while empathising and states the core problem as a **problem statement** (also called a **point-of-view, POV**): a short, human-centred description of **who the user is, what they need, and why** (the insight).',
      { formula: '[User] needs [need: a verb] because [insight].' },
      'Example: "First-year hostel students need flexible meal options because fixed mess timings clash with their lab hours." It guides ideation without dictating a solution.',
    ],
    sources: [`${U3} slides 13–15`],
  },

  'pdt-problem-statement': {
    blocks: [
      'A **problem statement (POV)** is the output of the Define phase: a clear description of the user, their need and the insight behind it, which becomes the starting question for ideation.',
      { formula: '[User] needs [need] because [insight].' },
      { h: 'An ideal problem definition is…' },
      { ul: [
        '**Human-centred**: framed around a specific user group and their need, not around the company\'s or technology\'s needs.',
        '**Grounded in research**: based on insights from empathy work (interviews, observation), not assumptions.',
        '**Need, not solution**: states a need as a verb ("get help quickly"), not a feature ("an app with a panic button"), so many solutions remain possible.',
        '**Broad enough for creative freedom, narrow enough to be manageable**.',
        '**Insightful**: explains *why* the need exists (the surprising tension).',
        '**Actionable and inspiring**: the team can turn it into "How might we…?" questions.',
        '**Short and clear**: one or two sentences everyone agrees on.',
      ] },
      { img: 'pdt-s14' },
      { h: 'Three conditions for robust problem framing' },
      { ul: ['**Impact**: the problem is worth solving; solving it makes a real difference.', '**Constraint**: realistic limits (time, budget, technology) are acknowledged.', '**Equifinality**: it allows many different solutions to reach the goal.'] },
      { h: 'How do you know the problem is defined properly?' },
      { ul: ['It names a **real user** identified in research, and the users recognise themselves in it.', 'It states a **need**, not a solution; you can think of at least 3–4 very different ways to meet it.', 'The **insight** explains the "why" and is backed by evidence.', 'It passes **impact, constraint and equifinality**.', 'The whole team agrees on it and it leads easily to **How-Might-We** questions.', 'Why-How laddering moves neither too abstract nor too concrete.'] },
      'Example: "Day-scholar engineering students need to use their 2-hour commute productively because they have no quiet time at home to revise." → HMW make commute time useful for revision?',
    ],
    sources: [`${U3} slides 13–15`, BB],
  },

  'pdt-ps-guides': {
    blocks: [
      'The problem statement is the **bridge between Define and Ideate**. A well-defined one guides ideation in several ways:',
      { ol: [
        '**Gives focus**: the team generates ideas for one clearly stated user need instead of drifting into unrelated features.',
        '**Becomes How-Might-We questions**: the POV is reframed into several HMW questions ("How might we make calling for help effortless for elderly people?") that are the prompts for brainstorming.',
        '**Keeps the user at the centre**: ideas are judged by how well they meet the user\'s need and insight.',
        '**Leaves room for creativity**: because it states a need, not a solution, it allows divergent thinking and many alternatives (equifinality).',
        '**Sets boundaries and constraints**: tells the team what is out of scope, saving time.',
        '**Provides selection criteria**: during convergence (dot voting, bingo selection), the best ideas are those that best address the stated need and insight.',
        '**Aligns the team and stakeholders** on what success means, reducing conflict.',
        '**Can be revisited**: if ideas keep failing, the team checks whether the problem statement itself needs reframing.',
      ] },
      { h: 'Example' },
      'Poor statement: "Design an app for the canteen." → ideas are limited to apps. Good statement: "Students need to get lunch within their 20-minute break because long queues make them late for labs." → HMW reduce waiting time? → ideas: pre-ordering, more counters, grab-and-go packs, staggered breaks, snack vending machines.',
    ],
    sources: [`${U3} slides 13–15`, 'DT Unit-3 Ideate(New).pdf (ideation methods)'],
  },

  'pdt-why-how': {
    blocks: [
      '**Why-How laddering** is a Define-phase tool for finding the **right level** at which to frame a problem. Starting from a user need, you move **up** the ladder by asking "**Why?**" and **down** the ladder by asking "**How?**".',
      { ul: ['Asking **"Why?"** leads to more **abstract, meaningful** needs (the deeper motivation).', 'Asking **"How?"** leads to more **concrete, actionable** needs or possible solutions.'] },
      { code: '            WHY?  ^   "Feel safe and independent at home"\n                  |   "Stay healthy and avoid emergencies"\n  Starting need:  -   "Elderly person needs to take medicines on time"\n                  |   "Remember which pill to take when"\n            HOW?  v   "Get a reminder at the right time"' },
      { h: 'Purpose' },
      { ol: ['**Find the right scope** for the problem statement: not so abstract that it cannot be acted on, not so narrow that it already implies one solution.', '**Uncover deeper motivations** and meaningful needs behind what users say.', '**Generate How-Might-We questions** at different levels.', '**Connect needs to possible solutions** and see alternatives.', '**Synthesise** research findings into a clear POV.'] },
      'Usually the best problem statement sits in the **middle** of the ladder.',
    ],
    sources: [BB, `${U3} (define tools)`],
  },

  'pdt-pov': {
    blocks: [
      { h: 'Point-of-view statement' },
      'An **elderly person living alone** needs **a simple, reliable way to get help quickly when they feel unwell or fall at home**, because **they may not be able to reach or operate a phone in an emergency, and they value their independence and do not want to feel constantly watched**.',
      { h: 'How it was built (User + Need + Insight)' },
      { table: { head: ['Part', 'Content', 'From research'], rows: [['User', 'Elderly person (70+) living alone', 'Interviews with seniors, their children'], ['Need', 'Get help quickly in an emergency (a verb)', 'Stories of falls, waiting hours for help'], ['Insight', 'Wants safety *and* independence; phones are hard to use under stress', 'Observed hesitation with smartphones; dislike of cameras']] } },
      { h: 'Why it is a good POV' },
      { ul: ['Specific user, not "everyone".', 'Need stated as an action, not a product.', 'Insight captures the tension (help vs independence).', 'Leaves many solutions open: wearable button, voice assistant, neighbour network, smart floor sensors.'] },
      { h: 'How-might-we questions' },
      { ul: ['How might we make calling for help effortless?', 'How might we keep family informed without feeling intrusive?', 'How might we detect a fall without a camera?'] },
    ],
    sources: [`${U3} slides 13–15`, BB],
  },

  'pdt-define-walk': {
    blocks: [
      'Example product/service: **the college canteen**.',
      { h: 'Purpose of the Define phase' },
      'To **analyse and synthesise** the observations from the Empathise phase and state the **core problem** as a human-centred problem statement that will guide ideation.',
      { h: 'Steps' },
      { steps: [
        '**Gather and share findings**: the team pins up interview notes, photos and observations ("queue of 60 students at 1 pm", "students skip lunch before labs", "staff overloaded").',
        '**Organise data (affinity diagram)**: write each observation on a sticky note and cluster similar ones into themes: waiting time, menu, price, hygiene, seating.',
        '**Build empathy maps** for key users (says, thinks, does, feels; pains and gains): a day-scholar student says "I eat on the way", feels anxious about being late for lab.',
        '**Create personas** representing user groups: "Ravi, 19, day-scholar with back-to-back labs", "Priya, hosteller who eats all meals there".',
        '**Find insights**: look for patterns, contradictions and surprises (students value time more than price).',
        '**Frame the problem statement (POV)**: "Day-scholar students need to get a filling lunch within their 20-minute break because long queues make them late for labs."',
        '**Check and refine** using Why-How laddering and the impact, constraint, equifinality test; validate it with a few users.',
        '**Write How-Might-We questions** to hand over to ideation: HMW cut waiting time? HMW let students eat on the move?',
      ] },
      { h: 'Tools that help' },
      { table: { head: ['Tool', 'Use'], rows: [['Affinity diagram', 'Cluster many observations into themes'], ['Empathy map', 'Summarise what one user says, thinks, does, feels'], ['Personas', 'Represent user groups to design for'], ['Journey map', 'Show the user\'s steps and pain points over time'], ['POV statement (user + need + insight)', 'State the problem'], ['Why-How laddering', 'Find the right level of abstraction'], ['How-Might-We questions', 'Turn the problem into ideation prompts'], ['5 Whys / root-cause analysis', 'Find the underlying cause']] } },
      { img: 'pdt-e40' },
    ],
    sources: [`${U3} slides 1–40`, `${U2} slides 38–40`, BB],
  },

  'pdt-persona-role': {
    blocks: [
      'A **user persona** is a fictional but **research-based** character representing a group of users with similar goals, needs and behaviour. Its role:',
      { ul: ['Keeps the design **user-centred**: the team asks "would Ravi use this?"', 'Gives the whole team a **shared, memorable picture** of the users.', 'Helps **define the problem** and **prioritise features**.', 'Guides **ideation and testing** with realistic scenarios.'] },
    ],
    sources: [`${U3} slides 16–20`],
  },

  'pdt-personas': {
    blocks: [
      'A **persona** is a fictional character, built from research, that represents a group of real users. Personas help designers keep users in mind throughout the project.',
      { h: 'Types of personas (four perspectives)' },
      { table: { head: ['Type', 'Based on', 'Strength', 'Weakness'], rows: [
        ['**Goal-directed persona**', 'What the typical user **wants to do** with the product and why (goals, workflow)', 'Focuses design on tasks and objectives', 'Can ignore emotions and context'],
        ['**Role-based persona**', 'The user\'s **role** in an organisation, from qualitative and quantitative data', 'Good for large organisations and business systems; data-driven', 'Can become impersonal'],
        ['**Engaging persona**', 'Rich, **story-like** characters combining goals and roles with emotions, background and psychology', 'Creates real empathy; designers engage with them as people', 'Needs much research; risk of stereotypes'],
        ['**Fictional persona**', 'The design team\'s **assumptions and experience**, not new research', 'Quick; useful early on', 'May be wrong: should be used only as a starting sketch'],
      ] } },
      { img: 'pdt-s16' },
      { h: 'Steps to create personas (Lene Nielsen\'s 10 steps)' },
      { img: 'pdt-persona-steps' },
      { ol: ['**Collect data** about users (interviews, observation, surveys).', '**Form a hypothesis** about the different user groups (affinity diagrams, empathy maps).', '**Everyone accepts** the hypothesis.', '**Establish the number** of personas (usually 3–5).', '**Describe the personas**: name, photo, age, background, goals, frustrations, quotes.', '**Prepare situations or scenarios** in which each persona uses the product.', '**Obtain acceptance** from the organisation.', '**Disseminate knowledge**: share personas with everyone working on the project.', '**Create scenarios** for each persona to guide design.', '**Make ongoing adjustments** as new information arrives.'] },
    ],
    sources: [`${U3} slides 16–37`],
  },

  'pdt-empathy-map': {
    blocks: [
      'An **empathy map** is a collaborative tool that organises what the team learnt about a user into quadrants, to see the world from the user\'s point of view and uncover needs and insights. It is made after interviews and observations and is used in the Define phase.',
      { img: 'pdt-empathy-map' },
      { h: 'Aspects (quadrants)' },
      { ul: ['**Says**: direct quotes from interviews.', '**Thinks**: what occupies their thoughts (may not be said aloud).', '**Does**: actions and behaviour observed.', '**Feels**: emotions: worries, frustrations, excitement.', 'Extended versions add **Sees** and **Hears** (environment and influences), and **Pains** (fears, obstacles) and **Gains** (wants, measures of success).'] },
      { h: 'Example: a day-scholar engineering student' },
      { table: { head: ['Says', 'Thinks'], rows: [['"I don\'t mind the bus."', '"I waste 2 hours daily commuting."'], ['**Does**', '**Feels**'], ['Leaves at 6:30 am, tries to study on the bus, skips breakfast', 'Tired, stressed before exams, left out of evening group study']] } },
      '**Pains**: long commute, no quiet time, misses hostel study groups. **Gains**: more study time, less fatigue, feeling included.',
      { h: 'Using it' },
      'Contradictions between quadrants reveal insights: the student *says* "I don\'t mind" but *feels* stressed. Need: *day-scholars need to use commute time productively and stay connected to study groups.*',
      { h: 'Steps' },
      { steps: ['Pick one user (or persona) and a goal.', 'Draw the quadrants on a board.', 'Fill each with sticky notes from research.', 'Look for patterns, contradictions and surprises.', 'Write the insights and needs, and feed them into the POV.'] },
    ],
    sources: [`${U2} slides 38–40`, `${U3}`],
  },

  'pdt-pred-affinity': {
    blocks: [
      'An **affinity diagram** (KJ method) organises a large number of ideas, observations or facts into **groups based on their natural relationships**, so patterns and themes emerge. In the Define phase it is used to make sense of research data.',
      { img: 'affinity' },
      { h: 'How to build one' },
      { steps: ['Write **each observation or idea on its own sticky note** (one point per note).', 'Put all the notes on a wall or board in random order.', '**Silently group** notes that seem related; anyone can move any note.', 'Discuss and refine the groups; split large groups, merge similar ones.', 'Give each group a **header** (theme) that summarises it.', 'Arrange related groups near each other and draw links; identify the most important themes.', 'Turn themes into **insights and needs** for the problem statement.'] },
      { h: 'Example: library usage survey' },
      { table: { head: ['Theme (header)', 'Notes'], rows: [['Space', '"No free seats at 4 pm", "Too noisy near the door"'], ['Timings', '"Closes before evening classes end", "Closed on Sundays"'], ['Resources', '"Only 2 copies of the OS textbook", "Old editions"'], ['Digital access', '"Cannot find e-books", "Slow Wi-Fi"']] } },
      'Insight: students need quiet study space and resources in the evening, when the library is closed or full.',
      { h: 'Benefits' },
      'Handles large, messy qualitative data; encourages team participation; reveals hidden patterns; builds consensus.',
    ],
    sources: [`${U3} (affinity diagrams)`, 'Standard textbook coverage'],
  },

  'pdt-model-persona': {
    blocks: [
      { h: 'Persona: "Ananya, the busy online learner"' },
      { table: { head: ['Field', 'Details'], rows: [['Name, age', 'Ananya, 20, B.E. 3rd year (CSE), day-scholar'], ['Background', 'Commutes 1.5 hours each way; uses a mid-range phone; data pack 1.5 GB/day'], ['Goals', 'Revise lectures before exams; finish assignments on time; learn coding beyond the syllabus'], ['Frustrations', 'Videos buffer on the bus; long 1-hour lectures; cannot find the right part of a recording; notifications from too many groups'], ['Behaviour', 'Studies in short bursts while commuting; watches at 1.5× speed; prefers PDFs offline'], ['Quote', '"I have time on the bus, but the app doesn\'t work there."']] } },
      { h: 'How it is applied in design' },
      { ul: ['**Define**: "Commuting students need to study in short offline sessions because network and time are unreliable on the move."', '**Ideate**: offline downloads, 10-minute lecture chunks with chapters, low-data mode, audio-only option, quiz cards.', '**Prioritise**: features that help Ananya (offline, short chunks) come before nice-to-haves (social leaderboards).', '**Test**: recruit real users who match Ananya and test the prototype on a bus ride.'] },
      'The persona keeps the team focused on a real type of user instead of an imagined "average student".',
    ],
    sources: [`${U3} slides 16–37`],
  },

  'pdt-model-lab': {
    blocks: [
      { h: 'Define phase applied: laboratory equipment maintenance' },
      { steps: [
        '**Review empathy findings**: interviews with students, lab assistants and faculty; observation of labs. Notes: "probes left on benches", "students do not know how to switch off the oscilloscope", "no checklist", "fault noticed only next week", "students fear being blamed".',
        '**Affinity diagram** themes: lack of instructions, no accountability, time pressure at the end of lab, fear of blame, no reporting system.',
        '**Empathy map** of a student: *says* "I didn\'t break it"; *thinks* "I don\'t know the right way to shut it down"; *does* rushes out when the bell rings; *feels* anxious about fines.',
        '**Insight**: students are willing to care for equipment but lack simple guidance and a blame-free way to report problems, and the last 5 minutes are rushed.',
        '**Problem statement (POV)**: "Engineering students need a quick, clear way to shut down, store and report issues with lab equipment at the end of a session, because they are unsure of the correct procedure and fear blame, so faults go unreported and equipment deteriorates."',
        '**How-might-we questions**: HMW make the correct shutdown obvious at each bench? HMW make reporting a fault quick and blame-free? HMW reserve time at the end of each lab for put-away?',
      ] },
      'This statement is human-centred, states a need (not a solution) and allows many ideas: QR-code checklists, colour-coded storage, a 5-minute put-away bell, anonymous fault reporting.',
    ],
    sources: [`${U3} slides 13–15`],
  },
}
