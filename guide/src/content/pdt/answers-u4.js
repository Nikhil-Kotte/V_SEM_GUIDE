// PDT Unit IV (ideation) model answers. Keyed by PYQ id.
const I = 'DT Unit-3 Ideate(New).pdf'

export default {
  'pdt-methods': {
    blocks: [
      'Ideation methods and tools other than brainstorming:',
      { ul: ['**Mind mapping**: radiate ideas from a central topic.', '**SCAMPER**: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse.', '**Six Thinking Hats**: look at an idea from six perspectives.', '**Storyboarding**: sketch the user\'s experience as a comic strip.', '**Brainwriting (6-3-5)**: 6 people write 3 ideas in 5 minutes, then pass them on.', '**Worst possible idea / reverse brainstorming**.', '**Doodling and sketching**.', '**Bingo selection and dot (post-it) voting** to select ideas.', '**Bodystorming / role-play**, **Crazy 8s**, analogies.'] },
    ],
    sources: [`${I} pages 3–20`],
  },

  'pdt-brainstorming': {
    blocks: [
      '**Brainstorming**, developed by **Alex Osborn**, is the most common group ideation method: a team generates a **large number of ideas** on a focused question in a short time, without judging them. Quantity leads to quality: some of the many ideas will be good, and odd ideas trigger better ones.',
      { h: 'Rules for an effective session (IDEO / d.school)' },
      { ol: ['**Defer judgement**: no criticism; there are no bad ideas at this stage.', '**Encourage wild ideas**: unusual ideas can lead to breakthroughs.', '**Build on the ideas of others**: "yes, and…", not "no, but…".', '**Stay focused on the topic**: keep the How-might-we question visible.', '**One conversation at a time**: listen to each idea.', '**Be visual**: sketch and use sticky notes.', '**Go for quantity**: aim for 100 ideas in an hour.'] },
      { h: 'How to use it for effective ideation' },
      { steps: ['Frame a clear **"How might we…?"** question from the problem statement.', 'Form a **diverse group of 5–8** people with a **facilitator** who enforces the rules and keeps time.', '**Warm up** with a quick fun exercise.', '**Diverge**: generate ideas individually on sticky notes, then share aloud, time-boxed (15–30 min); use the **SCAMPER** checklist when ideas slow down.', '**Cluster** similar ideas and build on them.', '**Converge**: select the most promising ideas with **dot voting** or **bingo selection**.', 'Take the chosen ideas into **prototyping**; keep the rest for later.'] },
      { img: 'pdt-i7' },
      { h: 'Why it works' },
      'Many perspectives produce variety; ideas trigger more ideas; the no-criticism rule lets unusual ideas surface; everyone participates.',
      { h: 'Example' },
      'HMW reduce lunch queues in the canteen? → pre-order app, more counters, grab-and-go packs, staggered breaks, vending machines, student volunteers at peak time, token system, food trucks at the hostel gate…',
    ],
    sources: [`${I} pages 3–7`],
  },

  'pdt-six-hats': {
    blocks: [
      '**Six Thinking Hats**, developed by **Edward de Bono (1985)**, is a **parallel-thinking** technique: the whole group "wears" the same coloured hat at the same time, so everyone looks at an idea from the same angle together instead of arguing from different sides. Each hat represents one thinking style.',
      { img: 'six-hats' },
      { table: { head: ['Hat', 'Thinking', 'Typical questions'], rows: [
        ['**White**', 'Facts, data, information: neutral', 'What information do we have? What is missing? How do we get it?'],
        ['**Red**', 'Feelings, intuition, gut reaction', 'How do I feel about this? How will users feel?'],
        ['**Black**', 'Caution, risks, weaknesses', 'What could go wrong? Why might it not work?'],
        ['**Yellow**', 'Optimism, benefits, value', 'Why will this work? What are the advantages?'],
        ['**Green**', 'Creativity, alternatives, new ideas', 'What else could we do? Can we combine ideas?'],
        ['**Blue**', 'Process control: organising, summarising', 'Why are we here? What next? (worn by the facilitator, first and last)'],
      ] } },
      { h: 'How it helps ideation' },
      { ul: ['**Separates thinking modes**: creativity (green) is not killed by early criticism (black).', '**Covers all perspectives** systematically: facts, emotions, risks, benefits, alternatives.', '**Reduces conflict and ego**: people criticise as a role, not personally.', '**Includes everyone**, also quieter members.', '**Saves time**: meetings are focused and structured.', 'Helps **evaluate and improve** ideas before prototyping.'] },
      { h: 'Applied: "How to improve campus security"' },
      { table: { head: ['Hat', 'Discussion'], rows: [
        ['Blue (start)', 'Goal: shortlist two measures to pilot this semester; order: white, red, green, yellow, black, blue'],
        ['White', 'Two bike thefts and one laptop theft last semester; 3 gates, 18 CCTV cameras (6 not working), 4 guards per shift; poor lighting on the hostel road'],
        ['Red', 'Students feel unsafe on the hostel road at night; parents are worried; guards feel overworked'],
        ['Green', 'QR/ID-card gate entry, motion-sensor lights, SOS button in the college app, student volunteer patrols, visitor pre-registration, bike-lock stands near CCTV'],
        ['Yellow', 'QR entry is cheap and logs visitors; lights reduce dark spots; the SOS button gives quick help'],
        ['Black', 'Cost of cameras, privacy concerns, queues at gates during rush hour, app adoption'],
        ['Blue (end)', 'Pilot QR entry at the main gate and motion lights on the hostel road for one month; measure incidents and feedback; review'],
      ] } },
    ],
    sources: [`${I} pages 15–18`],
  },

  'pdt-games': {
    blocks: [
      '**Ideation games** are structured, playful exercises that help teams generate and develop ideas. The game format (rules, time limits, roles, points) lowers inhibition, energises the group and makes everyone participate.',
      { h: 'Examples' },
      { ol: [
        '**Worst Possible Idea (reverse brainstorming)**: the team deliberately suggests the worst ideas for the problem ("make the canteen queue longer by having one cashier"). It is fun, removes fear of judgement, and reversing the bad ideas reveals good ones ("add more counters").',
        '**Crazy 8s**: each person folds a sheet into 8 panels and sketches **8 different ideas in 8 minutes**. Speed pushes past the obvious first ideas.',
        '**Brainwriting 6-3-5**: 6 participants each write 3 ideas in 5 minutes, then pass the sheet; others build on them. 108 ideas in 30 minutes, and quiet people contribute equally.',
        '**SCAMPER card game**: draw a SCAMPER card (Substitute, Combine, Adapt…) and apply it to the product.',
        '**Role-storming**: brainstorm as someone else (a child, a competitor, Steve Jobs).',
        '**Bingo selection / dot voting**: a game-like way to pick ideas for physical, digital and experience prototypes.',
      ] },
      'Games are used in the divergent phase to warm up and generate many ideas, and in the convergent phase to select them.',
    ],
    sources: [`${I} (ideation methods, bingo selection)`, 'Gamestorming (Gray, Brown, Macanufo)'],
  },

  'pdt-mind-maps': {
    blocks: [
      'A **mind map** is a visual diagram that radiates related ideas from one **central concept** using branches, keywords, colours and images (Tony Buzan). It mirrors how the brain makes associations.',
      { img: 'pdt-i21' },
      { h: 'Importance in design thinking' },
      { ul: ['**Generates many ideas** by free association: each branch suggests new sub-branches (divergent thinking).', '**Shows the whole problem space on one page**: users, needs, constraints, possible solutions.', '**Reveals connections** between ideas that lists hide; links across branches spark new combinations.', '**Organises research findings** (empathy data) into themes.', '**Easier to remember and communicate**: colours and images aid memory.', '**Supports collaboration**: a team can build a mind map together on a whiteboard or Miro.', 'Useful for **planning** (5W1H: why, who, what, where, when, how).'] },
      { img: 'pdt-i20b' },
      { h: 'Guidelines for drawing one' },
      { img: 'pdt-i20a' },
      { ol: ['Use a blank page in **landscape**.', 'Put the **central idea** in the middle, with an image if possible.', 'Draw **main branches** for major themes, thicker near the centre.', 'Use **one keyword per branch**.', 'Add **sub-branches** for details.', 'Use **colours, symbols and pictures**.', 'Use **arrows** to show links between branches.', 'Keep it open: keep adding as ideas come.'] },
    ],
    sources: [`${I} pages 19–21`],
  },

  'pdt-mind-doodle': {
    blocks: [
      { table: { head: ['Basis', 'Mind map', 'Doodling'], rows: [
        ['What it is', 'Radial diagram of keywords branching from a central idea', 'Free, spontaneous sketching of shapes, figures and scenes'],
        ['Structure', '**Structured**, hierarchical: centre → branches → sub-branches', '**Unstructured**, free-form'],
        ['Content', 'Mostly **words** (keywords) with some images', 'Mostly **drawings**, few words'],
        ['Thinking style', 'Associative and **organising**: expands and connects ideas logically', '**Visual and intuitive**: lets the subconscious produce images and metaphors'],
        ['Purpose in ideation', 'Explore the problem space; generate and organise many related ideas; plan', 'Spark new ideas, visualise concepts, stay focused, express ideas that are hard to say in words'],
        ['Output', 'A map of themes and ideas', 'Rough sketches that can become concept or storyboard drafts'],
        ['Best for', 'Breaking a topic into parts; seeing connections; team overview', 'Early, individual creative exploration; communicating concepts quickly'],
        ['Skill needed', 'None special', 'None: stick figures are enough'],
      ] } },
      { h: 'Using them together' },
      'Start with a **mind map** to explore "HMW make the commute productive?" (branches: audio, offline, groups, comfort), then **doodle** concepts on the most promising branch (a student listening to a 10-minute audio lecture on the bus). The mind map organises; the doodles make ideas tangible.',
    ],
    sources: [`${I} pages 19–21`, 'Sunni Brown, The Doodle Revolution'],
  },

  'pdt-pred-ideation': {
    blocks: [
      '**Ideation** is the third phase of design thinking, in which the team **generates a large number of ideas** to address the problem statement (How-might-we questions), and then selects the most promising for prototyping. It combines **divergent** thinking (going wide: many ideas) and **convergent** thinking (narrowing down: choosing).',
      { img: 'pdt-i2' },
      { h: 'Need for ideation' },
      { ul: ['The first idea is rarely the best; many options increase the chance of an innovative solution.', 'Moves the team from the problem to solutions.', 'Brings in diverse perspectives and builds on them.', 'Avoids jumping straight into one solution (functional fixedness).'] },
      { h: 'Uses' },
      { ul: ['Generate ideas for products, services, processes and experiences.', 'Find new uses for existing products (SCAMPER).', 'Combine ideas into stronger concepts.', 'Choose concepts to prototype (dot voting, bingo selection).', 'Build team engagement and creative confidence.'] },
      { img: 'pdt-i6' },
      'Methods: brainstorming, mind maps, SCAMPER, Six Thinking Hats, storyboarding, doodling, ideation games.',
    ],
    sources: [`${I} pages 1–3`],
  },

  'pdt-pred-doodling': {
    blocks: [
      '**Doodling** is making quick, spontaneous drawings (shapes, stick figures, arrows, symbols) while thinking. In design thinking it is a tool for **visual thinking** and creative ideation.',
      { h: 'How it helps express creative ideas' },
      { ul: ['**Activates visual and spatial thinking**, connecting ideas that words alone miss.', '**Improves focus and memory**: research shows doodlers recall more of what they heard.', '**Makes abstract ideas concrete**: a rough sketch of a product or an interaction communicates instantly.', '**Lowers the barrier to share ideas**: no artistic skill needed; stick figures are enough.', '**Sparks new ideas**: drawing one thing suggests another (metaphors, combinations).', '**Leads to storyboards and prototypes**: doodles become frames of a storyboard or a paper prototype.', '**Helps teams align**: everyone sees the same picture.'] },
      { h: 'Tips' },
      'Use simple shapes (circle, square, triangle, line); combine them into people and objects; add arrows and short labels; doodle the user in context; don\'t erase, keep going.',
      'Example: doodling a student on a crowded bus with headphones and a phone leads to the idea of 10-minute audio lectures.',
    ],
    sources: [`${I}`, 'Sunni Brown, The Doodle Revolution'],
  },
}
