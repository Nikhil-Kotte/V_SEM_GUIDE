// Model answers for the PDT Class Test I questions that had none, written for the marks given.
// Class Test II questions were all on the Mid-2 model list and use the answers in answers-model.js.
// The 2-mark class-test questions take their answers from bank-2m.js.
const N = 'PDT unit slides and notes'
const MID = 'PDT class tests (PYQs/PDT MIDS.pdf)'

export default {
  'pdt-mid-five-stage-apply': {
    blocks: [
      'Problem: **long queues in the college canteen during the lunch break**.',
      { img: 'pdt-stages' },
      { table: { head: ['Stage', 'What we do', 'How it contributes'], rows: [
        ['**1. Empathize**', 'Observe the canteen at lunch; interview students, staff and canteen workers; time the queues; stand in line ourselves', 'Reveals the real pain points: 20-minute waits, delays over change for cash, students late for class'],
        ['**2. Define**', 'POV: "Students need a way to get lunch within the short break because long waits make them late for class." HMW: "How might we cut the lunch wait to under 5 minutes?"', 'Focuses the team on the real user need'],
        ['**3. Ideate**', 'Brainstorm: pre-order app, UPI-only express counter, separate snack/meal counters, staggered breaks, token display', 'Many options; the best (pre-order + UPI counter) are selected'],
        ['**4. Prototype**', 'Paper screens of the app; a Google Form for pre-orders; one trial UPI-only counter', 'Makes the idea tangible quickly and cheaply'],
        ['**5. Test**', 'Trial with one class for a week; measure waiting time; collect feedback', 'Wait drops to about 6 minutes; feedback adds pickup-time slots → iterate'],
      ] } },
      'The stages are iterative: test results feed back into ideation and even into the problem definition until the solution works for users.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'pdt-mid-science-engineering': {
    blocks: [
      '**Science** discovers knowledge about how the world works; **engineering** applies that knowledge to design and build solutions. A country develops when the two work together:',
      { table: { head: ['Area', 'Science', 'Engineering', 'Effect on development'], rows: [
        ['Space', 'Orbital mechanics, remote sensing', 'ISRO launch vehicles and satellites', 'Communication, weather forecasting, disaster warning, navigation'],
        ['Agriculture', 'Plant genetics, soil science', 'Irrigation, tractors, fertiliser plants', 'Green Revolution, food security'],
        ['Health', 'Medicine, microbiology', 'Vaccines production, diagnostic devices, hospitals', 'Longer life, lower mortality'],
        ['Energy', 'Physics of solar cells, nuclear energy', 'Power plants, solar parks, grids', 'Electricity for industry and homes'],
        ['Digital', 'Computer science, electronics', 'Telecom networks, UPI, Aadhaar systems', 'Digital economy, inclusion, jobs'],
        ['Infrastructure', 'Materials science', 'Roads, rail, metros, dams, ports', 'Trade, mobility, urbanisation'],
      ] } },
      { ul: ['Engineering creates **industries, jobs and exports**; science creates the **new knowledge and skilled people** that keep them advancing.', 'The relationship is **two-way**: engineering problems inspire research, and engineered instruments enable new discoveries.', 'Responsible development also needs attention to environment and equity, which design thinking supports by centring people.'] },
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'pdt-linear-lateral': {
    blocks: [
      { img: 'pdt-linear-lateral' },
      { compare: [
        { title: 'Linear (vertical) thinking', items: ['Step-by-step, logical, sequential', 'Follows established rules and patterns', 'Converges to one correct answer', 'Example: applying a formula to solve a numerical; troubleshooting a machine part by part'] },
        { title: 'Lateral thinking (Edward de Bono)', items: ['Indirect, creative, looks from new angles', 'Challenges assumptions; breaks patterns', 'Generates many alternative answers', 'Example: complaints about slow hotel lifts solved by putting mirrors near the lifts, so waiting feels shorter'] },
      ] },
      'Design thinking uses both: lateral (divergent) thinking to generate ideas, and linear (convergent) thinking to evaluate and develop them.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'pdt-iterative': {
    blocks: [
      'Design thinking is **iterative** because the stages are repeated in cycles: what is learned in one stage often sends the team back to an earlier one, and solutions are refined over several rounds instead of being designed once.',
      { img: 'pdt-stages' },
      { ul: ['**Testing → Define**: user tests reveal needs that were missed, so the problem statement is reframed.', '**Testing → Ideate/Prototype**: feedback shows what fails, so new ideas and improved prototypes are made.', '**Prototyping → Define**: building a model often clarifies the real problem.', 'Each cycle reduces risk and improves fit, at low cost because early prototypes are cheap.'] },
      { example: 'A team designs a water bottle for cyclists. Prototype 1 (a squeeze bottle) leaks when tested on rough roads → new idea: a valve cap. Prototype 2 is tested; riders say it is hard to open while riding → redefine the need as "one-handed drinking without stopping" → prototype 3 with a bite valve passes the tests. Three iterations led to a solution the first design could not.' },
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'pdt-street-vendors': {
    blocks: [
      'Use the design-thinking stages, starting with deep empathy for the vendors:',
      { steps: ['**Empathize**: observe vendors through a full day at markets and roadsides; interview them about income, weather, space, permits, harassment, payments and wastage; try selling with them (immersion).', '**Define**: synthesise insights with an empathy map and persona; POV: "A vegetable vendor needs to keep produce fresh and accept digital payments because spoilage and lack of change cut daily income." HMW: "How might we reduce spoilage for vendors without electricity?"', '**Ideate**: brainstorm: solar-powered cooling cart, shared cold storage, UPI QR stickers with sound-box confirmation, an app showing vending zones and permit status, group buying from wholesalers, weatherproof foldable stalls.', '**Prototype**: cardboard model of the cooling cart, paper mock-up of the app in the local language, a QR kit.', '**Test**: give prototypes to a few vendors for a week; measure spoilage and sales; observe usability; collect feedback.', '**Iterate**: refine (lighter cart, voice-based app), then scale with municipal bodies, banks or NGOs.'] },
      'Outcome: solutions designed around the vendors\' real constraints (cost, mobility, literacy, no electricity) rather than assumptions.',
    ],
    sources: [`${N} (Unit 2)`, MID],
  },

  'pdt-bodystorming': {
    blocks: [
      '**Bodystorming** is a technique in which designers **physically act out a situation or use a product in a real or simulated environment**, using their bodies to experience the interaction, rather than only discussing ideas. It combines empathy and ideation ("brainstorming with the body").',
      { steps: ['Set up the environment (real place or mock-up with simple props).', 'Assign roles (users, staff) and a scenario.', 'Act it out; others observe.', 'Record what happens: physical difficulties, emotions, delays.', 'Discuss insights and try variations of the design.'] },
      { example: 'Improving an airline check-in: chairs and tables become a mini airport. Team members play a traveller with heavy bags, a parent with a child and an elderly passenger. Acting it out shows the kiosk screen is too high, the bag-drop is far from the kiosks, and the queue blocks the walkway, which leads to lower screens, a combined kiosk-bag-drop and a better queue layout.' },
      'Benefits: reveals physical and emotional aspects that discussions miss, builds empathy, generates ideas fast and costs almost nothing.',
    ],
    sources: [`${N} (Unit 2)`, MID],
  },

  'pdt-mid-immersion': {
    blocks: [
      '**Immersion** means **experiencing the user\'s environment and activities first-hand** to understand their needs deeply.',
      { img: 'pdt-immersion' },
      { steps: ['**Plan**: set the goal and questions; choose users and context; get permission; fix time and place.', '**Prepare**: adopt a beginner\'s mindset; prepare notebook, camera and a discussion guide.', '**Immerse**: enter the user\'s world and do what they do (their routine, tools and constraints).', '**Observe**: actions, workarounds, emotions and pain points; what they do, not just what they say.', '**Engage**: informal conversations; open-ended "why" questions; active listening.', '**Record**: notes, photos, sketches, quotes and your own feelings.', '**Reflect and share**: discuss with the team, extract insights and needs, build empathy maps and personas for the Define phase.'] },
      { example: 'To design for wheelchair users, the team spends a day moving around campus in wheelchairs and finds steep ramps and lift buttons out of reach, insights no survey had revealed.' },
    ],
    sources: [`${N} (Unit 2)`, MID],
  },

  'pdt-mid-define': {
    blocks: [
      'The **Define** phase is the second stage of design thinking: the team **analyses and synthesises the empathy findings to state the core problem in a human-centred way**, as a problem statement / point of view (POV), and reframes it as "How might we…?" questions for ideation.',
      { steps: ['Collect the empathy findings (interviews, observations, empathy maps).', 'Synthesise them: affinity mapping to find patterns and needs.', 'Create a **persona** of the target user.', 'Write the **POV**: [User] needs [need] because [insight].', 'Generate **HMW** questions to begin ideation.'] },
      { example: 'Empathy work shows hostel students skip breakfast. Persona: "Ravi, a first-year hostel student who studies late." POV: "Ravi needs a quick, healthy breakfast he can grab on the way to class because he wakes up late and the mess closes at 8:30." HMW: "How might we make healthy breakfast available to students running late?"' },
      'A good problem statement is human-centred, broad enough for creativity, narrow enough to be manageable, and does not suggest a particular solution.',
    ],
    sources: [`${N} (Unit 3)`, MID],
  },
}
