// Model answers keyed by PYQ id. Every answer lists its sources.
const U3 = 'PDT Unit-3 slides (FDT-Unit 3.pptx)'
const I = 'DT Unit-3 Ideate(New).pdf'
const P = 'DT UNIT-4 Final.pdf'

export default {
  'pdt-problem-statement': {
    blocks: [
      'A **problem statement** (point of view) is a short, clear description of the user, their need and the insight behind it. It is the output of the Define phase and the starting question for ideation.',
      { formula: '[User] needs [need] because [insight].' },
      { h: 'An ideal problem definition is…' },
      { ul: ['**Human-centred**: framed around a specific user and their need.', '**Not a solution**: it leaves room for many ideas.', '**Broad enough** for creativity, **narrow enough** to be workable.', '**Grounded in research** insights, not assumptions.', '**Actionable and inspiring**.'] },
      { img: 'pdt-s14' },
      { h: 'How to know it\'s well defined' },
      'Check: does it name a real user group from research? Does it state a need (verb), not a feature? Does the insight explain *why*? Does it satisfy **impact, constraint and equifinality**? Would the team and users agree with it?',
      { h: 'How it guides ideation' },
      'It is rewritten as "**How might we…?**" questions that focus brainstorming, and it becomes the criterion for selecting ideas: the best idea is the one that best meets the stated need.',
      'Example: "First-year hostel students need affordable, flexible meals because fixed mess timings clash with labs" → *How might we let students eat well when lab hours change?*',
    ],
    sources: [`${U3} slides 13–15`, 'Stanford d.school Bootcamp Bootleg (POV)'],
  },

  'pdt-pov': {
    blocks: [
      { h: 'Point-of-view statement' },
      'An **elderly person living alone** needs **a simple, reliable way to get help quickly when they feel unwell or fall at home**, because **they may not be able to reach or operate a phone in an emergency, and they value their independence and don\'t want to feel constantly watched**.',
      { h: 'Why it\'s a good POV' },
      { ul: ['Specific user (elderly, living alone).', 'Need stated as a verb ("get help quickly"), not a product.', 'Insight explains the tension: needs help *and* wants independence.', 'Leaves many solutions open: wearable button, voice assistant, neighbour network, smart sensors.'] },
      { h: 'HMW questions' },
      { ul: ['How might we make calling for help effortless?', 'How might we keep family informed without feeling intrusive?', 'How might we detect a fall without a camera?'] },
    ],
    sources: [`${U3} slides 13–15`],
  },

  'pdt-personas': {
    blocks: [
      'A **user persona** is a fictional but research-based character representing a group of users with similar goals and behaviour.',
      { h: 'Role' },
      'Keeps design user-centred, aligns the team, helps prioritise features, and makes needs memorable.',
      { h: 'Types' },
      { ul: ['**Goal-directed**: what the user wants to do and why.', '**Role-based**: the user\'s role in an organisation, from data.', '**Engaging**: rich, story-like characters that create empathy.', '**Fictional**: based on the team\'s assumptions (use with caution).'] },
      { h: 'Steps (10 steps to personas)' },
      { img: 'pdt-persona-steps' },
      'Collect data → form hypothesis → accept → decide number → describe → prepare situations → organisational acceptance → share → create scenarios → ongoing adjustment.',
      { img: 'pdt-s16' },
    ],
    sources: [`${U3} slides 16–37`],
  },

  'pdt-empathy-map': {
    blocks: [
      'An **empathy map** organises what we learnt about a user into four quadrants, to see their world from their point of view and spot needs and insights.',
      { img: 'pdt-empathy-map' },
      { table: { head: ['Says', 'Thinks'], rows: [['"I don\'t mind the bus."', '"I waste 2 hours daily commuting."'], ['**Does**', '**Feels**'], ['Leaves at 6:30 am, studies on the bus', 'Tired, stressed before exams']] } },
      'Example user: a day-scholar engineering student. **Pains**: long commute, no time to revise. **Gains**: more study time, less fatigue.',
      { h: 'Using it' },
      'Gaps between what they *say* ("don\'t mind") and *feel* (stressed) point to the real need: *students need to use commute time productively and arrive less tired.*',
    ],
    sources: ['FDT Unit-2 Empathy Phase.pptx slides 38–40', `${U3}`],
  },

  'pdt-six-hats': {
    blocks: [
      '**Six Thinking Hats** (Edward de Bono) is a parallel-thinking technique: the whole group "wears" one hat at a time, so everyone looks at the problem from the same angle together.',
      { img: 'six-hats' },
      { ul: ['**White** — facts and information.', '**Red** — feelings and intuition.', '**Black** — caution, risks, weaknesses.', '**Yellow** — benefits, optimism.', '**Green** — creativity, alternatives.', '**Blue** — managing the process, summarising, next steps.'] },
      { h: 'Applied: improving campus security' },
      { table: { head: ['Hat', 'Discussion'], rows: [
        ['White', 'Thefts last semester, number of gates, CCTV coverage, guard shifts'],
        ['Red', 'Students feel unsafe near the hostel road at night'],
        ['Black', 'Cost of guards/cameras, privacy concerns, queues at gates'],
        ['Yellow', 'Safer campus, parents\' trust, fewer losses'],
        ['Green', 'QR/ID gate entry, motion lights, SOS button in app, student volunteer patrols, visitor pre-registration'],
        ['Blue', 'Choose QR entry + lighting; pilot at main gate for one month; measure incidents; review'],
      ] } },
      'Benefits: avoids arguments, covers all perspectives, saves meeting time, includes everyone.',
    ],
    sources: [`${I} pages 15–18`],
  },

  'pdt-brainstorming': {
    blocks: [
      '**Brainstorming** is a group ideation technique to generate a large number of ideas on a focused question in a short time.',
      { h: 'Rules for an effective session' },
      { ol: ['Defer judgement.', 'Encourage wild ideas.', 'Build on the ideas of others.', 'Stay focused on the topic.', 'One conversation at a time.', 'Be visual.', 'Go for quantity.'] },
      { h: 'Process' },
      { steps: ['Define a clear "How might we…?" question.', 'Gather a diverse group (5–8) and a facilitator.', 'Warm up.', 'Generate ideas on sticky notes, time-boxed.', 'Cluster related ideas.', 'Vote and shortlist for prototyping.'] },
      { h: 'Why it helps ideation' },
      'Many perspectives produce variety, ideas trigger more ideas, and the no-criticism rule lets unusual ideas surface. Aids such as **SCAMPER** keep ideas flowing.',
      { img: 'pdt-i7' },
    ],
    sources: [`${I} pages 3–7`],
  },

  'pdt-mind-maps': {
    blocks: [
      'A **mind map** is a visual diagram that radiates related ideas from one central concept using branches, keywords, colours and images.',
      { img: 'pdt-i21' },
      { h: 'Importance' },
      { ul: ['Captures the whole problem space on one page.', 'Encourages free association → many ideas.', 'Shows connections between ideas.', 'Easier to remember and share than lists.', 'Useful in both ideation and planning.'] },
      { h: 'Guidelines' },
      'Landscape page; central idea in the middle; main branches for themes; one keyword per branch; sub-branches for details; colours and pictures; arrows for links.',
      { h: 'Mind maps vs doodling' },
      { table: { head: ['', 'Mind map', 'Doodling'], rows: [['Structure', 'Hierarchical, radial', 'Free-form'], ['Content', 'Keywords + images', 'Mostly drawings'], ['Purpose', 'Organise and expand ideas', 'Visual thinking, spark ideas, focus'], ['Output', 'Structured idea map', 'Rough sketches leading to concepts']] } },
    ],
    sources: [`${I} pages 19–21`],
  },

  'pdt-testing-need': {
    blocks: [
      'The **testing** phase puts prototypes in front of real users to learn whether the solution works and why. It is necessary because:',
      { ol: ['**Assumptions can be wrong** — testing validates or disproves them with evidence.', '**Finds problems early**, when changes are cheap.', '**Deepens empathy** — watching use reveals needs users never mention.', '**Refines the problem statement** — sometimes the problem itself was framed wrongly.', '**Compares alternatives** objectively.', '**Reduces risk and cost** before full implementation.', '**Builds stakeholder confidence** through real user data.'] },
      'Users\' feedback is captured (e.g. with a Likes / Criticisms / Questions / Ideas grid) and fed back into the next iteration.',
    ],
    sources: [`${P} pages 6–11`],
  },

  'pdt-value-prop': {
    blocks: [
      'A **value proposition** clearly states what benefit the product gives to a specific customer, which problem it solves, and why it is better than alternatives.',
      { img: 'value-prop' },
      { h: 'Guidelines' },
      { ol: ['Understand the customer\'s jobs, pains and gains.', 'Lead with the single most important benefit.', 'Be specific and measurable.', 'Show differentiation from competitors.', 'Use simple customer language.', 'Keep it concise: headline + sub-headline + 3 bullets (+ visual).', 'Test and refine it with users.'] },
      { formula: 'For [customer] who [need], [product] is a [category] that [benefit]. Unlike [competitor], it [difference].' },
      { h: 'How ads communicate it' },
      'Ads dramatise the **pain** ("Late again?"), show the product as the **solution**, and highlight the **gain** ("Delivery in 10 minutes"). They add proof (ratings, testimonials) and emotion. Feedback from users (e.g. "the app is confusing") often changes the message or the product, e.g. a food app simplifying checkout and advertising "order in 3 taps".',
    ],
    sources: [`${P} (pitch/value)`, 'Strategyzer value proposition canvas'],
  },

  'pdt-dfv': {
    blocks: [
      'IDEO\'s three lenses of innovation: a good solution must be all three.',
      { img: 'pdt-f1' },
      { ul: ['**Desirable** (human): people want it; it meets a real need. Checked by empathy and user testing.', '**Feasible** (technical): can be built with existing or near-future technology and skills.', '**Viable** (business): sustainable — revenue covers costs, fits the organisation\'s strategy.'] },
      'Example: a campus food pre-order app is desirable (no queues), feasible (simple app + payment API) and viable (small fee per order). Innovation happens in the overlap: the "sweet spot".',
    ],
    sources: ['DT Unit-5 FINAL.pdf page 1', 'IDEO three lenses of innovation'],
  },

  'pdt-iterate': {
    blocks: [
      '**Iteration** means repeating the design-thinking phases with improvements based on what testing revealed. Design thinking is cyclic, not linear: test results can send you back to empathise, define, ideate or prototype.',
      { h: 'Why iterate' },
      { ul: ['Initial ideas rarely meet user needs perfectly.', 'Each cycle reduces uncertainty.', 'Small changes are cheaper than late redesigns.', 'Users\' needs and contexts change over time.'] },
      { h: 'Real-world example — Airbnb' },
      'Bookings in New York were stuck. The team visited hosts (empathise), found photos were poor (define), tried professional photos (ideate/prototype), saw revenue double (test), then scaled it and kept iterating.',
      { h: 'Significance of the last phase' },
      'Testing and iterating validates the solution with evidence, decides whether to implement, refine or drop it, and feeds learning into the next design cycle.',
    ],
    sources: [`${P} pages 6–11`, 'DT Unit-5 FINAL.pdf'],
  },

  'pdt-wallet': {
    blocks: [
      { steps: [
        '**Understand the feedback**: ask why bulk is a problem — doesn\'t fit front pocket, uncomfortable when sitting, carries cards users rarely use.',
        '**Observe** what users actually carry daily (2–4 cards, little cash, phone payments).',
        '**Redefine**: "Daily commuters need a wallet that carries only essentials comfortably in a front pocket."',
        '**Ideate**: card-only slim sleeve, detachable coin pouch, elastic band design, thinner material, phone-case wallet.',
        '**Prototype** 2–3 low-fidelity versions quickly (paper/cardboard/fabric).',
        '**Re-test** with the same users; compare comfort and capacity.',
        '**Iterate** on the preferred design, checking it stays feasible to make and viable to price.',
      ] },
      'Result: a more **desirable** product driven by user feedback, without losing feasibility or viability.',
    ],
    sources: [`${P} pages 6–11`],
  },
}
