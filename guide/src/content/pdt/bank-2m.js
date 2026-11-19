// Principles of Design Thinking: a 2-mark question bank for each unit, with full-mark answers.
//   from:  the question this was asked as (class-test questions are shown first); omitted for likely questions.
//   q:     the question as it would be set for 2 marks.
//   a:     the answer: a definition plus the points an examiner looks for (content blocks).
export default [
  {
    unit: 'I',
    items: [
      { id: 'p1-out-of-box', from: 'pdt-mid-out-of-box', q: 'What is meant by out-of-the-box thinking?', a: [
        '**Out-of-the-box thinking** is thinking **beyond conventional assumptions, rules and constraints** to find creative, unconventional solutions, looking at a problem from new perspectives instead of the usual approach (closely related to lateral thinking).',
        'Example: the nine-dots puzzle is solved with four straight lines only by drawing outside the square formed by the dots.',
      ] },
      { id: 'p1-lateral', from: 'pdt-lateral', q: "What is 'lateral thinking'?", a: [
        'A term coined by **Edward de Bono**: solving problems through an **indirect and creative approach**, viewing the problem from new angles and generating alternatives that step-by-step (vertical) logic would not reach. Example: reducing complaints about slow lifts by installing mirrors near them.',
      ] },
      { id: 'p1-applications', from: 'pdt-dt-applications', q: 'Give two examples of applications of design thinking in engineered products or services.', a: [
        { ul: ['**Airbnb**: redesigned listings after empathising with hosts and guests (professional photos), turning the business around.', '**GE Healthcare MRI "Adventure Series"**: scanners redesigned as pirate-ship and space themes after observing frightened children, reducing the need for sedation.', '(Also: Apple products, IDEO\'s shopping cart, UPI payments, the Embrace low-cost infant warmer.)'] },
      ] },
      { id: 'p1-dt', q: 'Define design thinking.', a: [
        'Design thinking is a **human-centred, iterative problem-solving approach** that begins with **empathy** for users, **redefines** the problem, generates many **ideas**, and builds and **tests prototypes** to create solutions that are desirable, feasible and viable.',
      ] },
      { id: 'p1-stages', q: 'List the five stages of design thinking.', a: [
        { flow: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] },
        'The stages are iterative and non-linear (Stanford d.school model).',
      ] },
      { id: 'p1-linear', q: 'What is linear (vertical) thinking?', a: [
        'A **logical, step-by-step, sequential** way of thinking that moves along one path from a problem to a single correct answer, each step following from the previous (analytical and convergent). Example: solving a numerical by applying a formula.',
      ] },
      { id: 'p1-converge', q: 'Differentiate convergent and divergent thinking.', a: [
        '**Divergent thinking** generates **many possible ideas and options** (used in ideation/brainstorming). **Convergent thinking** **evaluates and narrows** them down to the best solution (used in selection and refinement). Design thinking alternates between the two.',
      ] },
      { id: 'p1-science-eng', q: 'Differentiate science and engineering.', a: [
        '**Science** seeks to **understand how the natural world works** (discovers knowledge through observation and experiment). **Engineering** **applies scientific knowledge to design and build solutions** to human problems (e.g. electromagnetism → electric motors).',
      ] },
      { id: 'p1-why-dt', q: 'Why is design thinking important?', a: [
        { ul: ['Keeps the **user at the centre**, so solutions meet real needs.', 'Encourages **creativity and innovation**.', 'Reduces risk through **early prototypes and testing**.', 'Promotes **collaboration** across disciplines and handles ill-defined problems.'] },
      ] },
      { id: 'p1-iterative', q: 'Why is design thinking called iterative?', a: [
        'Because its stages are **repeated in cycles**: insights from testing or prototyping send the team back to earlier stages (redefine, re-ideate, rebuild), refining the solution over several rounds until it fits users\' needs.',
      ] },
      { id: 'p1-bias', q: 'What is functional fixedness?', a: [
        'A **cognitive bias** that limits a person to seeing an object only in its **usual function** (e.g. a coin only as money, not as a screwdriver). It blocks creative solutions; designers counter it by asking "what else could this be used for?"',
      ] },
      { id: 'p1-thinking-types', q: 'Name any four types of thinking.', a: [
        { ul: ['**Linear (vertical)** thinking', '**Lateral** thinking', '**Convergent / divergent** thinking', '**Critical**, **analytical**, **creative** and **systems** thinking'] },
      ] },
    ],
  },
  {
    unit: 'II',
    items: [
      { id: 'p2-emp-sym', from: 'pdt-empathy-sympathy', q: 'Differentiate between empathy and sympathy.', a: [
        { table: { head: ['Empathy', 'Sympathy'], rows: [['Feeling **with** someone: understanding their experience from **their** perspective', 'Feeling **for** someone: pity or concern from **your own** perspective'], ['Builds connection and leads to understanding and action', 'Keeps a distance; can feel patronising'], ['"It sounds hard; tell me more."', '"I feel so sorry for you."']] } },
      ] },
      { id: 'p2-empathy', from: 'pdt-define-empathy', q: "Define 'empathy' in the context of design thinking.", a: [
        '**Empathy** is the ability to **understand the feelings, needs, motivations and experiences of users from their point of view**, setting aside one\'s own assumptions. In design thinking it is the foundation: the Empathize stage observes, engages with and immerses in users\' lives to uncover their real needs.',
      ] },
      { id: 'p2-beginner', q: "What is a beginner's mindset?", a: [
        'Approaching a situation **as if seeing it for the first time**: setting aside assumptions and expertise, being curious, asking "why?" and listening, so that real user needs are noticed rather than filtered by what we think we already know.',
      ] },
      { id: 'p2-immersion', q: 'What is immersion in design thinking?', a: [
        'An empathy technique in which the designer **personally experiences the user\'s environment and activities** (e.g. spending a day using a wheelchair on campus) to gain deep, first-hand understanding of their needs and pain points.',
      ] },
      { id: 'p2-bodystorming', q: 'What is bodystorming?', a: [
        'A technique in which designers **physically act out a scenario or use a product in a real or simulated environment** to experience interactions and discover problems and ideas, e.g. role-playing an airport check-in with mock kiosks.',
      ] },
      { id: 'p2-observe', q: 'What are the three modes of the empathize phase?', a: [
        { ul: ['**Observe**: watch users in their context.', '**Engage**: interview and interact with them.', '**Immerse**: experience what they experience.'] },
      ] },
      { id: 'p2-outputs', q: 'List the outputs of the empathize phase.', a: [
        { ul: ['Interview notes, observations, photos and quotes', 'Empathy maps and user journey maps', 'Insights into user needs and pain points', 'Draft personas for the Define phase'] },
      ] },
      { id: 'p2-latent', q: 'Differentiate explicit and latent needs.', a: [
        '**Explicit needs** are those users **state** directly ("I want a faster app"). **Latent needs** are **unspoken or unrecognised** needs that users cannot articulate but that are revealed through observation and empathy (e.g. anxiety while waiting).',
      ] },
      { id: 'p2-interview', q: 'Give two guidelines for an empathy interview.', a: [
        { ul: ['Ask **open-ended "why" questions** and encourage stories rather than yes/no answers.', 'Listen more than you speak; **avoid leading questions**; note non-verbal cues; ask about specific past experiences.'] },
      ] },
      { id: 'p2-journey', q: 'What is a user journey map?', a: [
        'A visual timeline of **every step a user takes while using a product or service**, showing their actions, thoughts, emotions and pain points at each touchpoint, used to find opportunities for improvement.',
      ] },
      { id: 'p2-user', q: 'Why is understanding user needs important in design?', a: [
        'Products built without understanding users often solve the wrong problem and fail. Understanding needs ensures the solution is **desirable and usable**, reduces costly redesign, and reveals opportunities for innovation.',
      ] },
      { id: 'p2-empathy-steps', q: 'List the steps to develop empathy towards users.', a: [
        { ol: ['Adopt a beginner\'s mindset and drop assumptions.', 'Observe users in their environment.', 'Engage: ask open-ended questions and listen actively.', 'Immerse: experience their situation.', 'Reflect and capture insights (empathy map).'] },
      ] },
    ],
  },
  {
    unit: 'III',
    items: [
      { id: 'p3-hmw', from: 'pdt-m01', q: 'What are "How Might We" (HMW) questions in design thinking?', a: [
        'Short questions starting with **"How might we…?"** that **reframe a problem statement as an opportunity** for ideation: "how" assumes a solution exists, "might" allows any idea, and "we" makes it collaborative. Example: "How might we make the canteen wait under five minutes?"',
      ] },
      { id: 'p3-persona-role', from: 'pdt-persona-role', q: 'What is the role of a persona in the design thinking process?', a: [
        'A **persona** is a fictional but research-based profile of a typical user. It **summarises research into a relatable person**, keeps the team **focused on real user needs and goals**, helps write the problem statement (POV), **guides ideation and decisions**, and is used to evaluate whether solutions fit the user.',
      ] },
      { id: 'p3-ps', from: 'pdt-ps-what', q: "What is meant by 'problem statement' in the define phase?", a: [
        'A **concise, human-centred statement of the problem to be solved** from the user\'s point of view, without prescribing a solution, e.g. POV format "[User] needs [need] because [insight]". It guides the ideation phase.',
      ] },
      { id: 'p3-define', q: 'What is the Define phase?', a: [
        'The second stage of design thinking: the team **synthesises the empathy findings** (affinity maps, empathy maps, personas) to **define the core user problem** as a problem statement/POV and HMW questions.',
      ] },
      { id: 'p3-pov', q: 'What is a Point of View (POV) statement? Give the format.', a: [
        'A POV is a **meaningful, actionable problem statement** combining the user, their need and an insight: **[User] needs [need] because [insight]**. E.g. "A first-year hostel student needs a quick breakfast because the mess closes before his first class."',
      ] },
      { id: 'p3-affinity', q: 'What is affinity mapping?', a: [
        'Organising research findings by writing each observation on a **sticky note** and **grouping related notes into clusters**, then labelling each cluster with a **theme**, to reveal patterns and user needs (KJ method).',
      ] },
      { id: 'p3-empathy-map', q: 'What are the four quadrants of an empathy map?', a: [
        { ul: ['**Says**: what the user says aloud.', '**Thinks**: what they think but may not say.', '**Does**: their actions and behaviour.', '**Feels**: their emotions.', '(Often with **Pains** and **Gains** below.)'] },
      ] },
      { id: 'p3-analysis-synthesis', q: 'Differentiate analysis and synthesis.', a: [
        '**Analysis** **breaks** complex information into smaller parts to understand it. **Synthesis** **combines** pieces of information and insights into a coherent whole, identifying patterns and meaning. The Define phase relies mainly on synthesis.',
      ] },
      { id: 'p3-why-how', q: 'What is why–how laddering?', a: [
        'A technique to adjust the scope of a problem: asking **"why?"** moves up to broader, more abstract needs; asking **"how?"** moves down to more specific, concrete solutions. It helps find the right level for the problem statement.',
      ] },
      { id: 'p3-persona-types', q: 'Name the types of personas.', a: [
        { ul: ['**Goal-directed** persona (what the user wants to achieve)', '**Role-based** persona (the user\'s role in an organisation)', '**Engaging** persona (rich, story-based)', '**Fictional** persona (based on team assumptions)'] },
      ] },
      { id: 'p3-good-ps', q: 'List two characteristics of a good problem statement.', a: [
        { ul: ['**Human-centred**: framed around the user and their need.', '**Broad enough** for creative freedom, but **narrow enough** to be manageable; it does not suggest a specific solution.'] },
      ] },
    ],
  },
  {
    unit: 'IV',
    items: [
      { id: 'p4-doodling', from: 'pdt-m02', q: 'What is the use of doodling in expressing creative ideas?', a: [
        '**Doodling** (quick, simple drawings) helps **visualise ideas faster than words**, makes abstract thoughts concrete, stimulates new associations and creativity, improves focus and memory, and makes ideas easy to share and discuss with the team.',
      ] },
      { id: 'p4-methods', from: 'pdt-methods', q: 'Name ideation methods other than brainstorming.', a: [
        { ul: ['Mind mapping', 'Six Thinking Hats', 'SCAMPER', 'Brainwriting', 'Worst possible idea', 'Storyboarding, sketching and doodling', 'Bodystorming'] },
      ] },
      { id: 'p4-ideation', q: 'What is ideation?', a: [
        'The third stage of design thinking in which the team **generates a large number of diverse ideas** for the defined problem, deferring judgement, and then **selects the most promising** ones to prototype.',
      ] },
      { id: 'p4-brainstorm', q: 'What is brainstorming?', a: [
        'A **group creativity technique** (Alex Osborn) for generating **as many ideas as possible** on a specific problem in a short time, in a non-judgemental atmosphere, building on others\' ideas; evaluation comes later.',
      ] },
      { id: 'p4-rules', q: 'List four rules of brainstorming.', a: [
        { ul: ['**Defer judgement** (no criticism)', '**Go for quantity**', '**Encourage wild ideas**', '**Build on the ideas of others**', '(Also: stay focused on the topic, one conversation at a time, be visual.)'] },
      ] },
      { id: 'p4-hats', q: 'Name the Six Thinking Hats and their roles.', a: [
        { ul: ['**White**: facts and information', '**Red**: feelings and intuition', '**Black**: caution and risks', '**Yellow**: benefits and optimism', '**Green**: creativity and new ideas', '**Blue**: process control and summary'] },
      ] },
      { id: 'p4-mindmap', q: 'What is a mind map?', a: [
        'A **radial diagram** with the central topic in the middle and related ideas branching out in levels, using keywords, colours and images, to explore associations and organise ideas.',
      ] },
      { id: 'p4-scamper', q: 'Expand SCAMPER.', a: [
        '**S**ubstitute, **C**ombine, **A**dapt, **M**odify (magnify/minify), **P**ut to other uses, **E**liminate, **R**everse (rearrange): prompts for generating new ideas from an existing product.',
      ] },
      { id: 'p4-games', q: 'What are ideation games? Name two.', a: [
        'Playful, structured activities that break mental blocks and encourage participation during ideation. Examples: **Worst Possible Idea**, **Crazy 8s**, SCAMPER cards, "What if…?" role play.',
      ] },
      { id: 'p4-mind-vs-doodle', q: 'Differentiate mind maps and doodling.', a: [
        'A **mind map** is a **structured, radial** organisation of related ideas around a central topic (good for exploring and organising). **Doodling** is **free, spontaneous sketching** to express and spark ideas visually (good for quick visual thinking).',
      ] },
      { id: 'p4-diverge', q: 'Why should judgement be deferred during ideation?', a: [
        'Criticism early **discourages people from sharing** ideas and narrows thinking. Deferring judgement keeps the session **divergent**, producing many ideas, including unusual ones that can lead to breakthrough solutions; evaluation comes later in a convergent step.',
      ] },
    ],
  },
  {
    unit: 'V',
    items: [
      { id: 'p5-iteration', from: 'pdt-m03', q: 'State the significance of the Iteration phase in the design thinking process.', a: [
        '**Iteration** repeats the cycle of **prototype → test → learn → refine**, using user feedback to improve the solution step by step. It **reduces risk**, catches problems early and cheaply, adapts to new insights (even redefining the problem) and leads to a solution that truly fits users\' needs.',
      ] },
      { id: 'p5-proto-importance', from: 'pdt-proto-importance', q: 'List two reasons why prototyping is important.', a: [
        { ul: ['Makes ideas **tangible** so users can react to them and give real **feedback**.', 'Reveals problems **early and cheaply**, reducing the risk and cost of building the wrong product.'] },
      ] },
      { id: 'p5-prototype', q: 'What is a prototype?', a: [
        'An **early, simple, tangible model** of a product or service (sketch, cardboard model, mock-up, role-play) built to **test ideas with users** and learn before investing in the final solution.',
      ] },
      { id: 'p5-fidelity', q: 'Differentiate low-fidelity and high-fidelity prototypes.', a: [
        '**Low-fidelity**: quick, cheap, rough (paper sketches, cardboard, storyboards); used early to test concepts. **High-fidelity**: detailed and close to the final product (interactive digital mock-ups, working models); used later to test usability and details.',
      ] },
      { id: 'p5-dfv', q: 'Explain desirable, feasible and viable.', a: [
        { ul: ['**Desirable**: users want it; it meets their needs.', '**Feasible**: it can be built with available technology and resources.', '**Viable**: it is financially sustainable for the business.'] },
        'Innovation lies where all three overlap.',
      ] },
      { id: 'p5-value-prop', q: 'Define value proposition.', a: [
        'A clear statement of **what benefits a product or service delivers, which customer problems it solves and gains it creates, and why it is better than alternatives**, for a specific customer segment.',
      ] },
      { id: 'p5-test', q: 'Why is testing necessary in design thinking?', a: [
        'Testing with real users **validates whether the solution meets their needs**, reveals usability problems and wrong assumptions, provides feedback for iteration, and reduces the risk of launching a product that fails.',
      ] },
      { id: 'p5-storytelling', q: 'Why is storytelling used in design thinking?', a: [
        'Stories **connect emotionally** with stakeholders and users, make insights and solutions **memorable and easy to understand**, show how a solution fits into users\' lives, and help gain buy-in for ideas.',
      ] },
      { id: 'p5-user-test', q: 'Name two user-testing methods.', a: [
        { ul: ['**Think-aloud testing**: users speak their thoughts while using the prototype.', '**A/B testing**: compare two versions with different users.', '(Also: usability tasks with observation, interviews, surveys.)'] },
      ] },
      { id: 'p5-guidelines', q: 'State two guidelines for prototyping.', a: [
        { ul: ['**Start building quickly**; keep it simple and cheap.', '**Build with the user in mind** and a clear question to test; fail fast, learn and iterate; don\'t get attached to one prototype.'] },
      ] },
      { id: 'p5-proto-types', q: 'Name the types of prototypes.', a: [
        { ul: ['**Paper / sketch** prototypes', '**Physical models** (cardboard, foam, 3-D printed)', '**Digital mock-ups / wireframes**', '**Storyboards** and **role-play**', '**Wizard-of-Oz** prototypes'] },
      ] },
    ],
  },
]
