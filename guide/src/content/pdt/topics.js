// Principles of Design Thinking — Mid-2 notes. Keys are syllabus ids from content/syllabus.js.
export default {
  // ======================= UNIT III (rest) — Define =======================
  'pdt.u3.persona-steps': {
    oneLine: 'A persona is a made-up but research-based character who stands for a group of real users; you build it step by step from user data so the team designs for "Priya, 19" instead of "users".',
    blocks: [
      { h: 'Role of a user persona' },
      { ul: ['Keeps the team focused on real user needs, not their own opinions.', 'Gives everyone a shared picture of who they are designing for.', 'Helps decide which features matter and to whom.', 'Makes the user\'s goals, frustrations and context easy to remember.'] },
      { h: 'Ten steps to create personas (Lene Nielsen)' },
      { img: 'pdt-persona-steps' },
      { steps: [
        '**Collect data** about users (interviews, surveys, observation).',
        '**Form a hypothesis** about the different kinds of users.',
        '**Get everyone to accept** the hypothesis.',
        '**Decide how many personas** to make (usually 3–5, one primary).',
        '**Describe the personas**: name, photo, age, background, goals, frustrations, quote.',
        '**Prepare situations / scenarios** in which each persona uses the product.',
        '**Get acceptance from the organisation**.',
        '**Share the knowledge** with everyone working on the project.',
        '**Create scenarios** for each persona using the solution.',
        '**Make ongoing adjustments** as you learn more.',
      ] },
      { img: 'pdt-s16' },
      { h: 'Types of personas' },
      { table: { head: ['Type', 'Based on'], rows: [['**Goal-directed**', 'What the user wants to achieve and how'], ['**Role-based**', 'The user\'s role in an organisation and the data behind it'], ['**Engaging**', 'A rich, story-like character (emotions, background) that the team can relate to'], ['**Fictional**', 'The team\'s assumptions from experience, not new research (quick but risky)']] } },
      'Also: **primary** persona (main target), **secondary** persona (served if possible), and **negative** persona (who you are *not* designing for).',
    ],
    terms: [['Persona', 'A fictional, research-based archetype of a user group.'], ['Primary persona', 'The main user the design must satisfy.']],
    exam: 'Define persona + its role, then the 10 steps as a numbered list, then the four types with one line each. Sketch a small persona card as an example.',
    revise: ['Persona = research-based fictional user', '10 steps: data → hypothesis → … → ongoing adjustment', 'Types: goal-directed, role-based, engaging, fictional'],
  },

  'pdt.u3.problem-statement': {
    oneLine: 'A problem statement (point of view) says clearly who the user is, what they need and why — framed around the user, not around a solution.',
    blocks: [
      { formula: '[User] needs [need] because [insight].' },
      'Example (POV, Dec \'25): *An elderly person living alone* **needs** *a simple way to get help quickly when they feel unwell at home* **because** *they often can\'t reach the phone or remember numbers in an emergency, and they don\'t want to feel watched all day.*',
      { h: 'What makes a good problem statement' },
      { ul: ['**Human-centred**: about the user and their need, not the company or technology.', '**Broad enough** to allow creative freedom (doesn\'t name a solution).', '**Narrow enough** to be manageable.', 'Based on real research insights.', 'Actionable and inspiring for the team.'] },
      { img: 'pdt-s14' },
      'Robust framing checks three conditions: **impact** (solving it matters), **constraint** (it respects real limits) and **equifinality** (many solutions remain possible).',
      { h: 'How it guides ideation' },
      'The problem statement becomes the question for brainstorming, usually rewritten as a **"How might we…?"** question: *How might we help elderly people living alone call for help without effort?* It keeps ideas focused on the real need and is the yardstick for choosing which ideas to prototype.',
      { compare: [
        { title: 'Poor', items: ['"We need to build a panic-button app."', 'Names a solution, ignores the user\'s situation'] },
        { title: 'Good', items: ['"Elderly people living alone need a way to get help quickly when unwell, because they may not reach a phone."', 'User + need + insight, open to many solutions'] },
      ] },
    ],
    terms: [['POV', 'Point-of-view statement: user + need + insight.'], ['HMW', '"How might we…" question that turns a problem into a design challenge.']],
    exam: 'Definition + the POV formula + characteristics + one good and one bad example + how it feeds ideation (HMW).',
    revise: ['User needs ___ because ___', 'Human-centred, not a solution, broad but manageable', 'Turn into "How might we…?"'],
  },

  'pdt.u3.affinity': {
    oneLine: 'An affinity diagram turns a messy pile of research notes into clear themes by writing each observation on a sticky note and grouping similar notes together.',
    blocks: [
      { img: 'affinity' },
      { steps: [
        'Write each observation, quote or idea from your research on its **own sticky note**.',
        'Put all notes on a wall, randomly.',
        'In silence, team members **move notes that feel related** next to each other.',
        'When groups settle, **name each group** with a header that captures its theme.',
        'Group related groups into bigger themes if useful.',
        'Discuss the themes and turn them into **insights and needs** for the problem statement.',
      ] },
      { h: 'Why use it' },
      { ul: ['Makes sense of large amounts of qualitative data.', 'Reveals patterns no one noticed alone.', 'Gets the whole team to agree on what the research says.', 'Bridges the Empathise and Define phases.'] },
      { gap: 'The unit slides list affinity diagrams but don\'t explain them; this is the standard method (also called the KJ method).' },
    ],
    terms: [['Affinity diagram', 'Clustering of notes into related themes (KJ method).']],
    exam: 'Definition, the 6 steps, a small sketched example with 3 themes, and 3 benefits.',
    revise: ['One idea per sticky → cluster silently → name groups → insights'],
  },

  'pdt.u3.empathy-map': {
    oneLine: 'An empathy map is a one-page picture of a user split into four quadrants — what they Say, Think, Do and Feel (plus Pains and Gains) — to understand them beyond what they say aloud.',
    blocks: [
      { img: 'pdt-empathy-map' },
      { table: { head: ['Quadrant', 'Question'], rows: [['**Says**', 'What does the user say out loud in interviews? (direct quotes)'], ['**Thinks**', 'What are they thinking but may not say?'], ['**Does**', 'What actions and behaviours did you observe?'], ['**Feels**', 'What emotions do they have? What worries or excites them?'], ['Sees / Hears', 'What is in their environment? Who influences them?'], ['**Pains**', 'Fears, frustrations, obstacles'], ['**Gains**', 'Wants, needs, measures of success']] } },
      { h: 'Example: a first-year hostel student using the mess' },
      { ul: ['**Says**: "The food is okay, I guess."', '**Thinks**: "I\'m spending too much on outside food."', '**Does**: skips breakfast, orders food at night.', '**Feels**: tired, homesick, guilty about money.', '**Pain**: no choice, fixed timings. **Gain**: healthy, affordable, flexible meals.'] },
      'Contradictions between quadrants (says "okay" but orders outside food) are where the real insights hide.',
      { h: 'Steps' },
      { steps: ['Pick the user (persona) and the goal.', 'Gather research (interviews, observation).', 'Fill each quadrant with sticky notes.', 'Look for contradictions and patterns.', 'Turn them into needs and insights.'] },
      { img: 'pdt-e40' },
    ],
    terms: [['Empathy map', 'Says / Thinks / Does / Feels canvas for a user.'], ['Insight', 'A surprising understanding about the user\'s needs.']],
    exam: 'Draw the 4-quadrant map (+ pains/gains) with the user in the centre, fill it for a sample user, and write 2 insights.',
    revise: ['Says, Thinks, Does, Feels (+ Sees, Hears, Pains, Gains)', 'Contradictions = insights'],
  },

  // ======================= UNIT IV — Ideation =======================
  'pdt.u4.ideation': {
    oneLine: 'Ideation is the phase where the team generates lots of possible solutions to the problem statement — quantity first, judging later.',
    blocks: [
      { h: 'Need for ideation' },
      { ul: ['Move beyond the first, obvious solution.', 'Use the whole team\'s creativity and different viewpoints.', 'Find innovative options before committing money to one.', 'Turn insights from Define into concrete possibilities.'] },
      { h: 'Uses' },
      'Product features, service improvements, solving social problems, new business ideas, process redesign — any "How might we…?" question.',
      { h: 'Divergent then convergent' },
      { img: 'pdt-i2' },
      { compare: [
        { title: 'Divergent thinking', items: ['Generate as many ideas as possible', 'No judgement, wild ideas welcome', 'Brainstorming, mind maps, SCAMPER'] },
        { title: 'Convergent thinking', items: ['Evaluate and select the best ideas', 'Use criteria: desirability, feasibility, viability', 'Dot voting, Now-Wow-How matrix, bingo selection'] },
      ] },
      { img: 'pdt-i6' },
    ],
    terms: [['Divergent thinking', 'Opening up many possibilities.'], ['Convergent thinking', 'Narrowing down to the best option.']],
    exam: 'Define ideation, its need and uses, then divergent vs convergent with examples of techniques for each.',
    revise: ['Ideation = generate many solutions', 'Diverge first, converge later'],
  },

  'pdt.u4.methods': {
    oneLine: 'Ideation methods are structured ways to get more and better ideas: brainstorming, mind mapping, SCAMPER, worst possible idea, storyboarding, analogies, and more.',
    blocks: [
      { table: { head: ['Method', 'How it works'], rows: [
        ['**Brainstorming**', 'Group generates many ideas quickly with rules like "defer judgement"'],
        ['**Brainwriting**', 'Everyone writes ideas silently, then passes them on to build on (stops loud people dominating)'],
        ['**Mind mapping**', 'Branch out ideas visually from a central problem'],
        ['**SCAMPER**', 'Ask Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse/Rearrange'],
        ['**Worst possible idea**', 'Deliberately think of terrible ideas, then flip them'],
        ['**Storyboarding**', 'Draw the user\'s experience as comic-strip frames'],
        ['**Analogies**', 'Borrow solutions from a different field'],
        ['**Six Thinking Hats**', 'Look at the problem from six fixed perspectives'],
        ['**Bodystorming / role play**', 'Act out the situation physically'],
      ] } },
      { img: 'pdt-i7' },
    ],
    terms: [['SCAMPER', 'Checklist of seven idea-changing questions.'], ['Brainwriting', 'Silent, written brainstorming.']],
    exam: 'For 2-markers, name 4 tools (e.g. mind map, SCAMPER, storyboarding, six hats). For longer answers, explain 4–5 methods with one line each.',
    revise: ['Brainstorming, brainwriting, mind map, SCAMPER, worst idea, storyboard, analogies, six hats'],
  },

  'pdt.u4.brainstorming': {
    oneLine: 'Brainstorming is a group session to generate as many ideas as possible on one question, following rules that keep judgement out until later.',
    blocks: [
      { h: 'Rules for effective brainstorming (IDEO)' },
      { ol: ['**Defer judgement** — no criticism during the session.', '**Encourage wild ideas** — they can lead to practical ones.', '**Build on the ideas of others** — "yes, and…" not "no, but…".', '**Stay focused on the topic** — the "How might we…?" question.', '**One conversation at a time**.', '**Be visual** — sketch, use sticky notes.', '**Go for quantity** — aim for 100 ideas in an hour.'] },
      { h: 'Running a session' },
      { steps: ['Pick a facilitator and a clear HMW question.', 'Invite 5–8 people with different backgrounds.', 'Warm up for a few minutes.', 'Generate ideas on sticky notes for 15–30 minutes; post them all.', 'Cluster similar ideas.', 'Vote (e.g. dot voting) to shortlist the best.'] },
      { h: 'Brainstorming for effective ideation' },
      'It works because many minds produce more variety, ideas spark each other, and the "no criticism" rule makes people share unusual thoughts. Variations such as brainwriting and SCAMPER fix its weak points (dominant voices, running dry).',
    ],
    terms: [['Facilitator', 'Person who runs the session and enforces the rules.'], ['Dot voting', 'Each person places a few dots on favourite ideas.']],
    exam: 'Define, list the 7 rules (numbered), then the session steps. Give a sample HMW question.',
    revise: ['Defer judgement, wild ideas, build on others, stay focused, one at a time, be visual, quantity'],
  },

  'pdt.u4.mind-maps': {
    oneLine: 'A mind map is a diagram that starts with one central idea and branches out into related ideas, keywords and pictures — a visual way to explore a problem.',
    blocks: [
      { img: 'pdt-i21' },
      { h: 'Guidelines to create a mind map' },
      { img: 'pdt-i20a' },
      { steps: ['Use a blank page in **landscape** orientation.', 'Put the **central idea** (or a picture of it) in the middle.', 'Draw **main branches** for major themes, thick near the centre and thinner outward.', 'Use **one keyword per branch**.', 'Add **sub-branches** for details.', 'Use **colours, images and symbols** to make it memorable.', 'Show **connections** across branches with arrows.', 'Keep it free-flowing; don\'t edit while creating.'] },
      { img: 'pdt-i20b' },
      { h: 'Importance' },
      { ul: ['Shows the whole problem on one page.', 'Helps generate associations and new ideas quickly.', 'Improves memory and understanding.', 'Easy to share and build on in a group.'] },
      { h: 'Mind maps vs doodling' },
      { compare: [
        { title: 'Mind map', items: ['Structured: centre → branches → sub-branches', 'Mainly words with images', 'Used to organise and explore ideas'] },
        { title: 'Doodle', items: ['Free, unstructured drawing', 'Mainly images and shapes', 'Used to think visually and spark ideas'] },
      ] },
    ],
    terms: [['Central idea', 'The topic in the middle of a mind map.'], ['Branch', 'A line from the centre carrying one keyword.']],
    exam: 'Define, draw a small mind map, list the guidelines, and give 3 benefits.',
    revise: ['Landscape page, centre idea, one keyword per branch, colours and images', 'Mind map structured; doodle free'],
  },

  'pdt.u4.games': {
    oneLine: 'Ideation games turn idea generation into play — with rules, time limits or random prompts — so people relax and produce more creative ideas.',
    blocks: [
      { table: { head: ['Game', 'How to play'], rows: [
        ['**Crazy 8s**', 'Fold a sheet into 8 boxes; sketch 8 different ideas in 8 minutes.'],
        ['**Worst possible idea / reverse brainstorming**', 'Come up with the worst ideas, then flip each into a good one.'],
        ['**Random word / random object**', 'Pick a random word or object and force a link to the problem.'],
        ['**What if…?**', 'Change a key constraint: "What if it had to be free? What if users were children?"'],
        ['**Round robin / 6-3-5 brainwriting**', '6 people write 3 ideas in 5 minutes, then pass the sheet on.'],
        ['**Idea bingo**', 'Ideas are placed on a bingo grid; selecting rows or columns forces combinations.'],
        ['**Role storming**', 'Brainstorm as a famous person or as the user.'],
      ] } },
      'Games remove fear of judgement, add energy and time pressure, and push people past obvious ideas.',
      { gap: 'Topic named in the syllabus with no detailed slides; these are standard ideation games.' },
    ],
    terms: [['Crazy 8s', 'Sketch eight ideas in eight minutes.'], ['6-3-5 method', 'Six people, three ideas, five minutes per round.']],
    exam: 'Explain any two games with steps and why games help ideation.',
    revise: ['Crazy 8s, worst idea, random word, what-if, 6-3-5, role storming'],
  },

  'pdt.u4.six-hats': {
    oneLine: 'Edward de Bono\'s Six Thinking Hats make a group look at a problem from six distinct angles, one at a time — facts, feelings, risks, benefits, creativity and process.',
    blocks: [
      { img: 'six-hats' },
      { table: { head: ['Hat', 'Thinking', 'Typical question'], rows: [
        ['⚪ White', 'Facts, data, information', 'What do we know? What is missing?'],
        ['🔴 Red', 'Emotions, intuition, gut feeling', 'How do I feel about this?'],
        ['⚫ Black', 'Caution, risks, weaknesses', 'What could go wrong?'],
        ['🟡 Yellow', 'Optimism, benefits, value', 'Why will this work?'],
        ['🟢 Green', 'Creativity, alternatives, new ideas', 'What else could we do?'],
        ['🔵 Blue', 'Process control, summary, next steps', 'Where are we? What next?'],
      ] } },
      { h: 'Example: improving campus security (Dec \'25)' },
      { ul: ['**White**: 12 bike thefts last semester; 4 gates; CCTV covers only 2.', '**Red**: Students feel unsafe walking back from the library at night.', '**Black**: More guards cost money; ID checks may cause long queues.', '**Yellow**: Better security attracts admissions and parents\' trust.', '**Green**: QR-based gate entry, lit "safe walk" routes, SOS button in the college app, volunteer patrols.', '**Blue**: Shortlist QR entry + lighting; pilot at one gate for a month; review data.'] },
      { h: 'Benefits' },
      'Separates thinking modes so discussions don\'t turn into arguments, makes sure every angle is covered, gives quiet people a structured turn, and speeds up meetings.',
    ],
    terms: [['Parallel thinking', 'Everyone looks in the same direction (wears the same hat) at the same time.']],
    exam: 'Draw/list the six hats with colour, meaning and a question, then apply them to the given scenario hat by hat (10-mark questions want the application).',
    revise: ['White facts, Red feelings, Black risks, Yellow benefits, Green creativity, Blue process', 'Everyone wears the same hat at once'],
  },

  'pdt.u4.doodling': {
    oneLine: 'Doodling — quick, rough drawings — helps you think, remember and share ideas visually, even if you "can\'t draw".',
    blocks: [
      { ul: [
        '**Thinking aid**: drawing activates different parts of the brain, helping new connections form.',
        '**Faster than words** for showing shapes, flows and interactions.',
        '**Improves focus and memory** (people who doodle during talks remember more).',
        '**Breaks the language barrier** in diverse teams.',
        '**Makes ideas tangible** early, before prototyping.',
      ] },
      { h: 'A simple visual vocabulary' },
      'Basic shapes (circle, square, triangle, line) + stick figures + arrows + speech bubbles + simple icons are enough to show people, places, actions and feelings.',
      { h: 'How to use it in ideation' },
      { steps: ['Sketch each idea as a quick doodle instead of a sentence.', 'Use storyboard frames to show how a user experiences it.', 'Share doodles on the wall; others add to them.', 'Pick promising doodles to turn into paper prototypes.'] },
      { gap: 'Doodling isn\'t covered in the unit PDFs; this follows Sunni Brown\'s "The Doodle Revolution" and standard design-thinking practice.' },
    ],
    terms: [['Visual vocabulary', 'A small set of simple drawings used to express ideas quickly.']],
    exam: 'Define doodling, list its benefits for creativity, and show how it is used in ideation (with a tiny sketch).',
    revise: ['Doodles = quick visual thinking', 'Focus, memory, faster sharing, leads to prototypes'],
  },

  // ======================= UNIT V — Prototype & Test =======================
  'pdt.u5.prototype-types': {
    oneLine: 'Prototypes range from low-fidelity (paper sketches, cardboard) to high-fidelity (realistic, working models); pick the cheapest one that answers your current question.',
    blocks: [
      { img: 'pdt-p5' },
      { table: { head: ['Type', 'Examples'], rows: [
        ['**Low fidelity**', 'Paper sketches, storyboards, cardboard models, sticky-note screens, role play'],
        ['**Medium fidelity**', 'Clickable wireframes (Figma), simple 3-D prints, Wizard-of-Oz demos'],
        ['**High fidelity**', 'Realistic app with real interactions, working physical model'],
      ] } },
      { h: 'Other ways to classify' },
      { ul: ['**Rough (throwaway)** vs **evolutionary** (keeps improving into the final product).', '**Physical** (objects) vs **digital** (apps, screens) vs **experience** (role-play a service).', '**Horizontal** (many features, shallow) vs **vertical** (one feature, full depth).'] },
    ],
    terms: [['Fidelity', 'How closely a prototype resembles the final product.'], ['Wizard of Oz', 'A person secretly does what the system will later do automatically.']],
    exam: 'Define prototyping, then low vs medium vs high fidelity with examples, pros and cons.',
    revise: ['Low (paper, cheap) → high (realistic, costly)', 'Throwaway vs evolutionary'],
  },

  'pdt.u5.prototype-guidelines': {
    oneLine: 'Good prototyping means starting quickly and cheaply, building just enough to test one question, keeping the user in mind, and being ready to throw it away.',
    blocks: [
      { img: 'pdt-p3' },
      { ol: [
        '**Just start building** — don\'t over-think; thinking with your hands reveals problems.',
        '**Don\'t spend too long** on one prototype — avoid falling in love with it.',
        '**Build with the user in mind** — what do you want to learn from them?',
        '**Answer a specific question** — each prototype tests one assumption.',
        '**Keep it low-fidelity at first**, raise fidelity as confidence grows.',
        '**Make it interactive** — users should touch/click/use it, not just look.',
        '**Fail early, fail cheap** — every failure is information.',
        '**Make several** versions to compare.',
      ] },
    ],
    terms: [['Assumption', 'A belief about users or the solution that hasn\'t been tested yet.']],
    exam: 'List 6–8 guidelines with a line each and the "just right" fidelity curve.',
    revise: ['Start fast, keep it cheap, test one question, user in mind, fail early'],
  },

  'pdt.u5.storytelling': {
    oneLine: 'Storytelling presents an idea as a story about a real user\'s problem and how their life gets better — which makes people understand, remember and care.',
    blocks: [
      { h: 'Characteristics of a good story' },
      { ul: ['A **relatable character** (your persona) with a **goal**.', 'A clear **conflict / problem** that matters.', 'A **turning point**: how the solution enters.', 'A **resolution**: how life is better afterwards.', '**Emotion** and concrete **details**, not jargon.', '**Simple and short**, with a clear message.', '**Authentic**: based on real research.'] },
      { h: 'Structure' },
      { steps: ['Once upon a time… (who the user is, their world)', 'Every day… (their routine)', 'But one day… (the problem)', 'Because of that… (they try your solution)', 'Until finally… (the better outcome)'] },
      { h: 'Reaching users through stories' },
      'Stories are used to test concepts (do users recognise themselves?), pitch ideas to stakeholders, explain a prototype (storyboards, short videos), and in marketing to communicate the value proposition. They get users talking about their own experiences, which produces richer feedback.',
      { gap: 'Covered only briefly as "storyboarding" in the unit notes; the story elements above are standard practice.' },
    ],
    terms: [['Storyboard', 'Comic-strip frames showing a user\'s experience step by step.']],
    exam: 'Characteristics list + a 5-part story structure + a short sample story for a product + how stories reach users.',
    revise: ['Character, conflict, solution, resolution, emotion', 'Stories test concepts, pitch ideas, communicate value'],
  },

  'pdt.u5.prototype-importance': {
    oneLine: 'Prototypes turn ideas into something people can see and use, so you learn what works before spending real time and money.',
    blocks: [
      { ul: [
        '**Test ideas cheaply and early** — find flaws before building the real product.',
        '**Get real user feedback** — users react to things, not descriptions.',
        '**Communicate ideas** to the team and stakeholders.',
        '**Reduce risk** of building the wrong thing.',
        '**Spark new ideas** — building reveals options you hadn\'t thought of.',
        '**Support decisions** by comparing alternatives.',
      ] },
      'Two reasons for a 2-marker: (1) it lets you test with real users and learn quickly and cheaply, (2) it reduces the risk and cost of failure later.',
    ],
    terms: [['Fail fast', 'Find what doesn\'t work as early and cheaply as possible.']],
    exam: 'Write 5–6 points; for 2 marks, the first two are enough.',
    revise: ['Learn early, user feedback, communicate, reduce risk'],
  },

  'pdt.u5.value-prop': {
    oneLine: 'A value proposition is a clear statement of the benefit your solution gives a specific customer, and why it beats the alternatives.',
    blocks: [
      { img: 'value-prop' },
      { h: 'Guidelines to write a value proposition' },
      { ol: ['**Know your customer**: their jobs, pains and gains (from your research).', '**State the main benefit** in one clear sentence.', '**Be specific** — numbers and concrete outcomes beat vague claims.', '**Show how you\'re different** from alternatives.', '**Use the customer\'s language**, not jargon.', '**Keep it short** — a headline, a sub-headline and 3 bullet points.', '**Test it** with users and refine.'] },
      { formula: 'For [customer] who [need/pain], our [product] is a [category] that [key benefit]. Unlike [alternative], it [main difference].' },
      'Example: *For college students who keep losing cards and struggle to split bills, SlimPay is a smart slim wallet that holds 6 cards and splits payments in one tap. Unlike a regular wallet, it alerts your phone if you leave it behind.*',
      { h: 'How ads communicate value propositions' },
      'Good ads show the **pain**, the **product as the hero**, and the **gain** in seconds — e.g. a delivery app showing "groceries in 10 minutes", or a phone ad focusing on battery life. They often use customer stories and feedback ("Rated 4.8 by 1M users") as proof.',
    ],
    terms: [['Value proposition canvas', 'Tool matching the value map to the customer profile.'], ['Pain reliever', 'How the product removes a customer\'s frustration.']],
    exam: 'Definition, the canvas sketch, 6–7 guidelines, a template sentence and one worked example.',
    revise: ['For [who] who [pain], [product] gives [benefit], unlike [alternative]', 'Customer jobs, pains, gains ↔ products, pain relievers, gain creators'],
  },

  'pdt.u5.test-need': {
    oneLine: 'Testing puts the prototype in front of real users to learn what works, what doesn\'t and why — because the designer\'s assumptions are often wrong.',
    blocks: [
      { h: 'Why test?' },
      { ul: ['**Validate assumptions** about users and the solution.', '**Find usability problems** early, when they are cheap to fix.', '**Refine the problem**: testing can show you defined the problem wrongly.', '**Build empathy** further — watch how people really use it.', '**Reduce risk** before investing in full development.', '**Decide** between alternative prototypes using evidence.'] },
      { h: 'User feedback' },
      'Feedback can be **direct** (what users say) or **observed** (what they do — often more reliable). Capture it with a **feedback capture grid**: *Likes*, *Criticisms*, *Questions*, *Ideas*.',
      { table: { head: ['Likes (+)', 'Criticisms (Δ)'], rows: [['What users enjoyed', 'What frustrated them'], ['**Questions (?)**', '**Ideas (💡)**'], ['What confused them', 'Suggestions they or you had']] } },
      'Testing is not the end: its results loop back into Define, Ideate and Prototype.',
    ],
    terms: [['Feedback capture grid', 'Likes / Criticisms / Questions / Ideas grid.'], ['Validation', 'Checking an assumption against real user behaviour.']],
    exam: 'List 5–6 reasons, then explain user feedback with the capture grid.',
    revise: ['Validate assumptions, find problems early, refine problem, reduce risk', 'Feedback grid: likes, criticisms, questions, ideas'],
  },

  'pdt.u5.user-test': {
    oneLine: 'A user test is a planned session where real users try your prototype on realistic tasks while you watch, ask "why?", and record what you learn.',
    blocks: [
      { h: 'Conducting a user test' },
      { steps: [
        '**Plan**: what do you want to learn? Write 3–5 realistic tasks.',
        '**Recruit** 5–8 users who match your personas (5 users find most usability problems).',
        '**Prepare** the prototype, a script, consent and a way to record.',
        '**Introduce**: "We\'re testing the prototype, not you. Think aloud."',
        '**Let them use it** — don\'t explain or help; observe.',
        '**Ask open questions**: "What did you expect here? Why did you do that?"',
        '**Record** observations in a feedback capture grid.',
        '**Debrief** with the team, find patterns, decide what to change.',
      ] },
      { h: 'How to test (methods)' },
      { ul: ['**Think-aloud** testing.', '**A/B testing**: two versions, compare results.', '**Observation** in the real context.', '**Interviews and surveys** after use.', '**Show, don\'t tell**: hand over the prototype, let the experience speak.'] },
      { h: 'Example: the bulky wallet (Dec \'25)' },
      'Users said the wallet prototype was too bulky. Steps: ask *why* bulk matters (pocket fit, sitting, carrying few cards) → observe what they actually carry → ideate slimmer options (card-only slots, removable coin pouch, thinner material) → build quick low-fi versions → re-test which one users prefer. The feedback makes the product more **desirable** without breaking feasibility or viability.',
    ],
    terms: [['Think-aloud', 'Users speak their thoughts while using the prototype.'], ['A/B test', 'Comparing two versions with users.']],
    exam: 'Numbered steps for conducting a test, then methods; for case questions, show feedback → why → ideate → re-prototype → re-test.',
    revise: ['Plan tasks → recruit 5–8 → don\'t help → observe → ask why → record → iterate'],
  },

  'pdt.u5.dfv': {
    oneLine: 'The best design-thinking solutions sit where three circles overlap: desirable (people want it), feasible (it can be built) and viable (it makes business sense).',
    blocks: [
      { img: 'pdt-f1' },
      { table: { head: ['Lens', 'Question', 'Example check (college food-ordering app)'], rows: [
        ['**Desirable** (people)', 'Do users want it? Does it solve a real need?', 'Students hate the queue — they want to pre-order'],
        ['**Feasible** (technology)', 'Can we build it with available tech and skills?', 'Simple app + canteen tablet; UPI payment API exists'],
        ['**Viable** (business)', 'Can it sustain itself financially?', 'Small fee per order or canteen subscription covers costs'],
      ] } },
      'Desirability is checked first in design thinking (human-centred). An idea that is only feasible and viable but not desirable fails in the market; one that is desirable but not viable can\'t last.',
    ],
    terms: [['Innovation sweet spot', 'Overlap of desirability, feasibility and viability.']],
    exam: 'Draw the three-circle Venn, define each lens with a question, and check one example product against all three.',
    revise: ['Desirable = people; feasible = technology; viable = business', 'Innovation = all three'],
  },

  'pdt.u5.iterate': {
    oneLine: 'Iteration is going round the design-thinking loop again — using what testing taught you to redefine, re-ideate and re-prototype — until the solution truly works for users.',
    blocks: [
      'Design thinking is **not linear**. After testing you may go back to any earlier phase: re-empathise if you misunderstood users, redefine the problem, ideate new options, or improve the prototype.',
      { h: 'Why iterate' },
      { ul: ['First solutions are rarely right.', 'Each cycle reduces uncertainty and risk.', 'Small, fast improvements are cheaper than one big redesign.', 'Keeps the solution aligned with changing user needs.'] },
      { h: 'Real-world example' },
      'Airbnb\'s early listings weren\'t getting bookings. The founders visited hosts (empathise), noticed the photos were poor (define), tried professional photography (prototype) in New York, saw bookings double (test), and then rolled it out — a classic test-and-iterate loop.',
      { h: 'Significance of the last phase' },
      'The final phase (test → iterate, then implement) is where ideas meet reality: it validates the solution with evidence, decides whether to scale, refine or drop it, and feeds learning back into the next cycle.',
    ],
    terms: [['Iteration', 'Repeating the cycle with improvements each time.']],
    exam: 'Explain non-linear design thinking, reasons to iterate, and one real-world example with the phases labelled.',
    revise: ['Test → learn → loop back to any phase', 'Airbnb photos example'],
  },
}
