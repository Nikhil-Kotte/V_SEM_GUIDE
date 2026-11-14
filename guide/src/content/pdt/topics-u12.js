// Principles of Design Thinking, Units I and II and the start of Unit III. Keys are syllabus ids.
export default {
  // ======================= UNIT I =======================
  'pdt.u1.impact': {
    oneLine: 'Science explains how the world works and engineering uses that knowledge to solve human problems; together they have shaped health, communication, transport, energy and everyday life.',
    blocks: [
      { compare: [
        { title: 'Science', items: ['Asks "why and how does it work?"', 'Discovers knowledge', 'Example: discovering electromagnetism'] },
        { title: 'Engineering', items: ['Asks "how can we use it to solve a problem?"', 'Designs and builds solutions', 'Example: electric motors, power grids'] },
      ] },
      { h: 'Impact of engineering on social development' },
      { table: { head: ['Area', 'Impact'], rows: [
        ['Health', 'Medical devices, clean water, sanitation; longer lives'],
        ['Communication', 'Phones, internet; connected societies, access to information'],
        ['Transport', 'Roads, rail, aircraft; trade and mobility'],
        ['Energy', 'Electricity, renewables; industry and comfort'],
        ['Agriculture', 'Irrigation, machines; food security'],
        ['Education', 'Online learning; wider access'],
      ] } },
      'Engineering also brings **responsibilities**: pollution, job loss through automation and the digital divide. Good engineering considers people and society, which is what design thinking adds.',
      { h: 'Is design thinking connected to engineering? (asked)' },
      'Yes. Engineering builds the solution; design thinking makes sure it is the **right** solution for real people. Start with design thinking (understand the user and define the problem), then engineer the solution, then test with users and iterate. They overlap in prototyping and testing.',
    ],
    terms: [['Engineering', 'Applying science and maths to design and build useful solutions.'], ['Social development', 'Improvement in people\'s well-being, health, education and opportunities.']],
    exam: 'Differentiate science and engineering, give a table of engineering\'s impact on society, mention the downsides, and link it to design thinking.',
    revise: ['Science discovers; engineering applies', 'Health, communication, transport, energy, food'],
  },

  'pdt.u1.thinking-behaviour': {
    oneLine: 'How we think shapes how we behave: our beliefs, habits and biases decide which solutions we see, so changing our thinking changes the problems we can solve.',
    blocks: [
      { flow: ['Thoughts and beliefs', 'Feelings', 'Behaviour and actions', 'Results'], loop: 'Results reinforce the beliefs' },
      { ul: ['Habits and past experience create mental shortcuts; they save time but can block new ideas.', '**Cognitive biases** (confirmation bias, functional fixedness) make us repeat old solutions.', 'Designers deliberately change their thinking (open mind, curiosity, empathy) to change their behaviour and find better solutions.'] },
      { tip: 'Functional fixedness: seeing an object only in its usual role. A designer asks "what else could this be used for?"' },
    ],
    terms: [['Cognitive bias', 'A systematic pattern of thinking that leads away from good judgement.'], ['Functional fixedness', 'Seeing an object only in its normal use.']],
    exam: 'Explain the link between thinking and behaviour with the cycle diagram, name two biases, and show how designers change their thinking.',
    revise: ['Thoughts → feelings → actions → results', 'Biases block new ideas'],
  },

  'pdt.u1.thinking-types': {
    oneLine: 'Linear thinking goes step by step to one logical answer; lateral thinking looks at the problem from new, indirect angles; design thinking combines both around the user\'s real needs.',
    blocks: [
      { table: { head: ['', 'Linear', 'Lateral', 'Design thinking'], rows: [
        ['Approach', 'Step by step, logical', 'Creative, indirect, sideways', 'Human-centred, iterative'],
        ['Answer', 'One correct answer', 'Many possible ideas', 'The best solution for users'],
        ['Example', 'Solving a maths equation', 'A puzzle with a trick', 'Designing a better school bag'],
      ] } },
      { h: 'Examples' },
      { ul: ['**Linear**: a lift is slow, so make the motor faster.', '**Lateral** (Edward de Bono\'s classic): people complained the lift was slow; mirrors were put beside it so people did not notice the wait.', '**Design thinking**: watch the people waiting, learn what really bothers them, and test several ideas.'] },
      { h: 'Other kinds' },
      '**Convergent** thinking narrows many ideas to the best one; **divergent** thinking spreads out to generate many ideas; **critical** thinking evaluates; **systems** thinking sees how parts affect each other.',
    ],
    terms: [['Linear thinking', 'Logical, step-by-step thinking towards one answer.'], ['Lateral thinking', 'Solving problems by an indirect, creative approach (Edward de Bono).'], ['Divergent thinking', 'Generating many different ideas.']],
    exam: 'Compare linear, lateral and design thinking in a table with an example each; for "types of thinking" also list convergent, divergent, critical and systems thinking.',
    revise: ['Linear: one logical path', 'Lateral: new angles', 'Design: human-centred, iterative'],
  },

  'pdt.u1.importance': {
    oneLine: 'Design thinking matters because it starts from real human needs, so it produces solutions people actually want; the human-centric approach puts the user at the centre of every step.',
    blocks: [
      { h: 'Why design thinking is important' },
      { ul: ['Solves the **right** problem, not just a problem.', 'Handles complex, unclear ("wicked") problems.', 'Reduces risk: cheap prototypes catch mistakes early.', 'Encourages teamwork across disciplines.', 'Leads to innovation and better user experience.'] },
      { h: 'Human-centric approach' },
      { flow: ['Understand people (empathy)', 'Design with them', 'Test with them', 'Improve for them'] },
      'The solution must be **desirable** (people want it), **feasible** (it can be built) and **viable** (it can last as a business).',
    ],
    terms: [['Human-centred design', 'Designing around the needs, behaviour and context of the people who will use the solution.'], ['Wicked problem', 'A complex problem with no single clear definition or answer.']],
    exam: 'List the reasons design thinking is important and explain the human-centric approach with the desirable, feasible, viable overlap.',
    revise: ['Right problem, less risk, innovation', 'People at the centre'],
  },

  'pdt.u1.phases': {
    oneLine: 'The design thinking process has five phases: Empathize, Define, Ideate, Prototype and Test, moving from understanding users to testing solutions with them.',
    blocks: [
      { flow: ['Empathize: understand the users', 'Define: state their core problem', 'Ideate: generate many ideas', 'Prototype: build quick models', 'Test: try them with users'] },
      { table: { head: ['Phase', 'Key question', 'Output'], rows: [
        ['Empathize', 'Who are the users and what do they experience?', 'Interviews, observations, insights'],
        ['Define', 'What is the real problem?', 'Problem statement / point of view'],
        ['Ideate', 'What could we do?', 'Many ideas, a few chosen'],
        ['Prototype', 'How can we make it real cheaply?', 'Sketches, models, mock-ups'],
        ['Test', 'Does it work for users?', 'Feedback, improvements'],
      ] } },
      'The first two phases understand the **problem space**; the last three explore the **solution space**.',
    ],
    terms: [['Problem space', 'Understanding users and their real problem.'], ['Solution space', 'Generating and testing possible answers.']],
    exam: 'Draw the five phases and explain each with its key question and output.',
    revise: ['Empathize, Define, Ideate, Prototype, Test'],
  },

  'pdt.u1.five-stage': {
    oneLine: 'The five stages are not a straight line: teams loop back (testing may send them back to define or ideate), which makes design thinking iterative, unlike a linear problem-solving method.',
    blocks: [
      { flow: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'], loop: 'Test results send the team back to any earlier stage; stages can also run in parallel' },
      { compare: [
        { title: 'Linear problem solving', items: ['Fixed order: define, solve, implement', 'Problem assumed known at the start', 'Errors found late'] },
        { title: 'Five-stage design thinking', items: ['Loops back whenever something is learned', 'Problem refined along the way', 'Cheap tests find errors early'] },
      ] },
      { h: 'Example of iteration' },
      'A team designs an app for college canteen orders. Testing shows students do order, but staff miss orders at rush hour. The team goes **back to Empathize** with the staff, **redefines** the problem as "staff need a clear queue", and **prototypes** a token display.',
    ],
    terms: [['Iterative', 'Repeating stages, improving each time based on what was learned.'], ['Non-linear', 'Not following a fixed one-way order.']],
    exam: 'Draw the five stages with the loop-back arrows, compare with linear problem solving, and give a real example of iteration.',
    revise: ['Not a straight line', 'Test → back to define, ideate or empathize'],
  },

  'pdt.u1.applications': {
    oneLine: 'Design thinking is used well beyond product design: in engineering products, software and services, healthcare, education, business and social problems.',
    blocks: [
      { table: { head: ['Domain', 'Example'], rows: [
        ['Engineered products', 'The Embrace infant warmer: a low-cost sleeping bag for premature babies where incubators are unaffordable'],
        ['Software and apps', 'Airbnb improved its listings after the founders met hosts and saw poor photos'],
        ['Healthcare', 'Redesigning hospital waiting areas and patient journeys'],
        ['Education', 'Classroom layouts and learning apps built around students'],
        ['Business and services', 'Banks redesigning account opening to take minutes, not days'],
        ['Social sector', 'Clean-water and sanitation solutions designed with villagers'],
      ] } },
      'Two examples for a 2-mark answer: the **Embrace infant warmer** and the **Oral-B kids\' toothbrush** (a fatter handle after observing how children grip).',
    ],
    terms: [['Service design', 'Applying design thinking to the whole experience of a service.']],
    exam: 'Give a table of domains with one concrete example each; for 2 marks, name two engineered products shaped by design thinking.',
    revise: ['Products, software, health, education, business, social'],
  },

  // ======================= UNIT II =======================
  'pdt.u2.user-needs': {
    oneLine: 'Every user has unique needs shaped by their situation; designers uncover both stated needs and the deeper, unspoken (latent) ones by watching and listening.',
    blocks: [
      { compare: [
        { title: 'Explicit (stated) needs', items: ['What users say they want', '"I want a cheaper phone"'] },
        { title: 'Latent (hidden) needs', items: ['What users need but do not say', '"I am afraid of losing my contacts if I switch"'] },
      ] },
      { ul: ['Needs depend on context: age, ability, culture, income, place.', 'Users often cannot describe their needs; watch what they **do**, not only what they **say**.', 'Look for **workarounds** (taped notes, home-made fixes): they reveal unmet needs.'] },
    ],
    terms: [['Latent need', 'A need the user has but does not express or even realise.'], ['Workaround', 'A user\'s own fix for a problem a product does not solve.']],
    exam: 'Differentiate explicit and latent needs with examples, and explain how designers uncover unique needs.',
    revise: ['Say vs do', 'Workarounds reveal hidden needs'],
  },

  'pdt.u2.empathize': {
    oneLine: 'Empathizing means understanding users\' experiences and feelings from their point of view, by observing, engaging and immersing yourself in their world.',
    blocks: [
      { compare: [
        { title: 'Empathy', items: ['Feeling with someone', 'Understanding their view from inside', '"I see why this is hard for you"'] },
        { title: 'Sympathy', items: ['Feeling for someone', 'Pity from outside', '"I feel sorry for you"'] },
      ] },
      { tree: { root: 'Empathize by', kids: ['Observe: watch users in their setting', 'Engage: interview and talk', 'Immerse: experience it yourself'] } },
      { h: 'Key outputs of the Empathize phase (asked)' },
      { ul: ['Interview notes, photos and recordings.', 'Observations and quotes.', 'Insights about needs and pain points.', 'Empathy maps and user journey maps.', 'Material for personas in the Define phase.'] },
      { tip: 'Empathy is necessary but not sufficient (asked): it gives understanding, but you still need a sharp problem definition, ideas and testing to meet the needs.' },
    ],
    terms: [['Empathy', 'Understanding and sharing another person\'s feelings and perspective.'], ['Pain point', 'A specific problem that frustrates the user.']],
    exam: 'Define empathy, contrast it with sympathy, explain observe, engage and immerse, and list the outputs of the phase.',
    revise: ['Observe, engage, immerse', 'Empathy ≠ sympathy'],
  },

  'pdt.u2.steps': {
    oneLine: 'The empathize phase follows steps: decide whom to study, prepare questions, observe and interview users, immerse yourself, and record and share what you learn.',
    blocks: [
      { flow: ['Identify the users', 'Prepare (questions, consent, tools)', 'Observe in context', 'Interview (ask "why?")', 'Immerse / experience it', 'Capture and share insights'] },
      { h: 'Example: street vendors (asked)' },
      { ul: ['**Users**: vegetable and food vendors near the college.', '**Observe**: when they set up, how they handle rain, cash and change, waste.', '**Interview**: "What is the hardest part of your day? Why?"', '**Immerse**: spend a morning helping one vendor.', '**Insights**: no shade in rain, difficulty with digital payments, eviction fear.', 'These lead to a **Define** statement and ideas such as foldable shade carts or simple UPI QR stands.'] },
    ],
    terms: [['Contextual inquiry', 'Interviewing users while they do their work in their own setting.']],
    exam: 'List the steps in order with one line each and apply them to the example given in the question.',
    revise: ['Identify, prepare, observe, interview, immerse, capture'],
  },

  'pdt.u2.developing-empathy': {
    oneLine: 'Empathy is developed by listening actively, setting aside your assumptions, asking open questions, observing closely and spending time in the users\' world.',
    blocks: [
      { tree: { root: 'Developing empathy', kids: ['Listen more than you talk', 'Ask open "why?" questions', 'Drop assumptions and judgement', 'Observe body language and context', 'Experience their situation'] } },
      { ul: ['Use **immersive or experiential learning**: try the task yourself (use a wheelchair for a day, cook in a small kitchen).', 'Follow "show me" rather than "tell me".', 'Notice contradictions between what users say and what they do.'] },
      { h: 'Importance of empathy (asked)' },
      'Without empathy, designers solve their own idea of the problem. With it, they discover real needs, build trust, and create solutions people adopt. Example: designers who spent nights in hospital wards learned that patients most needed rest from noise and light, not new gadgets.',
    ],
    terms: [['Active listening', 'Fully concentrating on, understanding and responding to the speaker.'], ['Experiential learning', 'Learning by doing and experiencing.']],
    exam: 'Explain the ways to develop empathy, the role of immersive learning, and why empathy is important, with an example.',
    revise: ['Listen, ask why, drop assumptions, observe, experience'],
  },

  'pdt.u2.beginners-mind': {
    oneLine: 'A beginner\'s mindset means approaching users as if you know nothing: no assumptions, lots of curiosity, and asking "what?" and "why?" again and again.',
    blocks: [
      { flow: ['What is happening?', 'Why is it happening?', 'Why does that matter?', 'Real need found'] },
      { ul: ['Do not judge; observe and accept what you see.', 'Question everything, even "obvious" things.', 'Be curious like a child.', 'Listen to understand, not to reply.', 'Use the **5 Whys**: keep asking why to reach the root cause.'] },
      { h: 'Why it matters' },
      'Experts carry assumptions that hide what users really do. A beginner\'s mind notices details experts skip, which is where new ideas come from.',
    ],
    terms: [['Beginner\'s mindset', 'Approaching a situation with openness and curiosity, without preconceptions.'], ['5 Whys', 'Asking "why?" repeatedly to reach the root cause.']],
    exam: 'Define the beginner\'s mindset, give its habits, show the what/why chain or 5 Whys, and explain why it helps empathy.',
    revise: ['No assumptions, curious, ask what and why'],
  },

  'pdt.u2.immersion': {
    oneLine: 'An immersion activity puts the designer into the user\'s world to experience it first-hand: plan it, go there, take part, observe, reflect and record.',
    blocks: [
      { flow: ['Plan: choose the user group and setting', 'Get permission and prepare', 'Go and take part in the activity', 'Observe and note feelings and problems', 'Reflect and discuss as a team', 'Record insights'] },
      { ul: ['Example: to design for visually impaired students, spend a day blindfolded using the college campus.', 'Example: to redesign a bus service, travel the route at rush hour.', 'Keep a journal, photos (with consent) and quotes.'] },
    ],
    terms: [['Immersion', 'Experiencing the user\'s environment and tasks yourself.']],
    exam: 'List the steps of an immersion activity and give an example of applying them.',
    revise: ['Plan, permission, take part, observe, reflect, record'],
  },

  'pdt.u2.bodystorming': {
    oneLine: 'Bodystorming means physically acting out a situation or a solution with props, so the team feels how users would experience it and spots problems early.',
    blocks: [
      { flow: ['Set up the space with simple props', 'Team members play users and staff', 'Act out the scenario', 'Notice problems and feelings', 'Change the idea and act again'] },
      { h: 'Example' },
      'To design a hospital check-in, the team turns a classroom into a reception: one person plays a patient on crutches, another the receptionist. Acting it out shows the counter is too high and there is nowhere to rest the crutches, problems nobody saw on paper.',
      { compare: [
        { title: 'Brainstorming', items: ['Ideas by talking and writing', 'Sitting at a table'] },
        { title: 'Bodystorming', items: ['Ideas by acting and moving', 'In a physical space, with props'] },
      ] },
    ],
    terms: [['Bodystorming', 'Physically enacting a scenario to empathize and generate ideas.'], ['Role-play', 'Acting as a user or another person to understand their experience.']],
    exam: 'Define bodystorming, give its steps, a worked example, and compare it with brainstorming.',
    revise: ['Act it out with props', 'Feel the experience, find problems early'],
  },

  // ======================= UNIT III (first half) =======================
  'pdt.u3.define': {
    oneLine: 'The Define phase makes sense of everything learned while empathizing and turns it into a clear statement of the user\'s core problem, which guides the rest of the process.',
    blocks: [
      { flow: ['Gather empathy findings', 'Find patterns and insights', 'Identify the user\'s core need', 'Write the problem statement', 'Check it with the team'] },
      { ul: ['**Interpret the results**: what do the observations mean? Why do users behave this way?', 'A good definition is **human-centred** (about the user, not the technology), **broad enough** to allow creative ideas, and **narrow enough** to be manageable.', 'Tools: affinity diagrams, empathy maps, personas, point-of-view statements, "How might we…?" questions.'] },
    ],
    terms: [['Define phase', 'The stage that turns user research into a clear problem statement.'], ['Insight', 'A new understanding of why users behave or feel a certain way.']],
    exam: 'Explain the purpose of the Define phase, its steps from findings to problem statement, and the qualities of a good definition.',
    revise: ['Findings → patterns → core need → problem statement'],
  },

  'pdt.u3.analysis-synthesis': {
    oneLine: 'Analysis breaks the research into small pieces of information; synthesis puts those pieces back together into patterns and insights that explain the user\'s problem.',
    blocks: [
      { compare: [
        { title: 'Analysis', items: ['Break down', 'Sort notes, quotes, observations', '"What did we see and hear?"'] },
        { title: 'Synthesis', items: ['Build up', 'Group into themes and insights', '"What does it all mean?"'] },
      ] },
      { flow: ['Raw research', 'Analysis: break into single observations', 'Synthesis: cluster into themes', 'Insights and problem statement'] },
      'Both are needed: analysis without synthesis leaves a pile of facts; synthesis without analysis jumps to conclusions.',
    ],
    terms: [['Analysis', 'Breaking information into parts to understand it.'], ['Synthesis', 'Combining parts into a meaningful whole.']],
    exam: 'Differentiate analysis and synthesis with a table and show how they lead to insights in the Define phase.',
    revise: ['Analysis breaks down; synthesis builds up'],
  },

  'pdt.u3.persona-perspectives': {
    oneLine: 'Personas can be built from four perspectives (Lene Nielsen): goal-directed, role-based, engaging and fictional, depending on how much data and storytelling they use.',
    blocks: [
      { table: { head: ['Perspective', 'Focus', 'Built from'], rows: [
        ['Goal-directed', 'What the user wants to achieve and how', 'User goals and tasks'],
        ['Role-based', 'The user\'s role in an organisation and society', 'Large amounts of data on roles'],
        ['Engaging', 'A rich, story-like character people relate to', 'Data plus storytelling, emotions'],
        ['Fictional', 'Assumptions of the team, not research', 'Team experience; used early, risky'],
      ] } },
      { tip: 'Fictional personas are quick but can be wrong; check them against real user data as soon as possible.' },
    ],
    terms: [['Persona', 'A research-based fictional character representing a group of users.'], ['Goal-directed persona', 'A persona focused on what the user wants to achieve.']],
    exam: 'Name and explain the four persona perspectives with what each is based on, and note the risk of fictional personas.',
    revise: ['Goal-directed, role-based, engaging, fictional'],
  },
}
