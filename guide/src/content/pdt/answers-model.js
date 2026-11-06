// Simple answers to the Mid-2 model questions (PYQs/PDT Model questions for 2 mid.docx). Keyed by question id.
const U3 = 'PDT Unit-3 slides (FDT-Unit 3.pptx)'
const I = 'DT Unit-3 Ideate(New).pdf'
const P = 'DT UNIT-4 Final.pdf'
const F = 'DT Unit-5 FINAL.pdf'
const BB = 'Stanford d.school Bootcamp Bootleg'

export default {
  // ---------------- Short answers ----------------
  'pdt-m01': {
    blocks: [
      '**"How Might We" (HMW) questions** turn a problem statement into short, open questions that start the Ideation phase. They begin with the words "How might we…".',
      { ul: ['**How**: we assume a solution exists.', '**Might**: any idea is allowed, it may or may not work.', '**We**: the team works on it together.'] },
      'They are not too broad and not too narrow, so they invite many different ideas.',
      '**Example:** Problem: "Students miss lunch because canteen queues are long." HMW: *How might we get students their lunch in under 10 minutes?*',
    ],
    sources: [BB, `${U3} (problem statement)`],
  },

  'pdt-m02': {
    blocks: [
      '**Doodling** means making quick, rough drawings while thinking. It helps express creative ideas because:',
      { ul: ['A picture shows an idea **faster and more clearly** than many words.', 'Drawing **sparks new ideas**: one sketch leads to another.', 'It needs **no art skill**: stick figures and boxes are enough, so everyone can share ideas.', 'Rough doodles later become **storyboards and prototypes**.'] },
      '**Example:** a doodle of a student on a crowded bus listening to headphones quickly gives the idea of "10-minute audio lessons".',
    ],
    sources: [`${I}`, 'Sunni Brown, The Doodle Revolution'],
  },

  'pdt-m03': {
    blocks: [
      'In the **Iteration** phase the team repeats the design steps (empathise, define, ideate, prototype, test) using what users said in testing, improving the solution each time.',
      { h: 'Significance' },
      { ul: ['The first idea is **rarely perfect**; each round makes it better.', 'Mistakes are found **early, when they are cheap** to fix.', 'The final product is based on **real user feedback**, not guesses.', 'It keeps the product **useful as user needs change**.'] },
      '**Example:** Airbnb kept testing its listing pages; adding professional photos (one iteration) doubled bookings.',
    ],
    sources: [`${P} (iteration)`, `${F}`],
  },

  'pdt-m04': {
    blocks: [
      'The **purpose of doodling** in design thinking is to **think and communicate visually**:',
      { ol: ['**Generate ideas**: free drawing helps the mind make new connections.', '**Explain ideas quickly** to the team without long explanations.', '**Stay focused** and remember discussions better.', '**Move towards a prototype**: doodles become sketches, storyboards and paper prototypes.'] },
      'It is used mostly in the **Ideation** phase. Rough is fine: the aim is clarity, not art.',
    ],
    sources: [`${I}`],
  },

  'pdt-m05': {
    blocks: [
      '**Iteration** is the process of **repeating the design cycle** (prototype → test → learn → improve) again and again until the solution meets the users\' needs.',
      'Design thinking is **not a straight line**: after testing, the team can go back to any earlier phase (empathise, define, ideate) with what it has learnt.',
      '**Example:** a wallet prototype is "too bulky" → the team makes it slimmer → tests again → users are happy.',
    ],
    sources: [`${P} (iteration)`],
  },

  'pdt-m06': {
    blocks: [
      '**Value proposition:** a short, clear statement of **what benefit a product gives to a specific customer, which problem it solves, and why it is better than other options**.',
      '*Example: "For busy students, CanteenGo lets you pre-order lunch and skip the queue."*',
      { h: 'Desirable, feasible and viable solutions' },
      { ul: ['**Desirable**: people **want** it; it meets a real need.', '**Feasible**: it **can be built** with the technology and skills available.', '**Viable**: it **makes business sense**; it can earn enough to keep going.'] },
      'A good solution is all three at once: the "sweet spot" of innovation.',
      { img: 'pdt-f1' },
    ],
    sources: [`${F}`, 'IDEO three lenses of innovation'],
  },

  // ---------------- Long answers ----------------
  'pdt-m07': {
    blocks: [
      { h: 'What is Ideation?' },
      '**Ideation** is the third phase of design thinking. The team **generates as many ideas as possible** to solve the problem (the How-Might-We question), then **picks the best ones** to prototype.',
      { ul: ['**Divergent thinking** (going wide): lots of ideas, no judging.', '**Convergent thinking** (narrowing down): choose the most promising ideas.'] },
      { h: 'Ideation techniques' },
      { table: { head: ['Technique', 'In simple words'], rows: [
        ['**Brainstorming**', 'A group shares many ideas quickly without criticising'],
        ['**Mind mapping**', 'Write the problem in the centre and branch out related ideas'],
        ['**SCAMPER**', 'Change an existing idea: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse'],
        ['**Six Thinking Hats**', 'Look at the idea from six different angles, one at a time'],
        ['**Storyboarding**', 'Draw the user\'s experience as a comic strip'],
        ['**Doodling / sketching**', 'Quick drawings to think visually'],
        ['**Worst possible idea**', 'Suggest bad ideas on purpose, then flip them into good ones'],
        ['**Dot voting / bingo selection**', 'Ways to pick the best ideas fairly'],
      ] } },
      { h: 'Six Thinking Hats (Edward de Bono, 1985)' },
      'The whole group "wears" **one coloured hat at a time**, so everyone thinks in the same direction together. This stops arguments and makes sure every side of an idea is looked at.',
      { img: 'six-hats' },
      { table: { head: ['Hat', 'Thinking style', 'Why it matters in problem-solving'], rows: [
        ['**White**', 'Facts and data', 'Starts from what we actually know and what information is missing'],
        ['**Red**', 'Feelings and gut reaction', 'Brings out emotions and user feelings without needing reasons'],
        ['**Black**', 'Caution and risks', 'Finds weak points and dangers before money is spent'],
        ['**Yellow**', 'Benefits and optimism', 'Shows the value and advantages of the idea'],
        ['**Green**', 'Creativity and new ideas', 'Creates alternatives and improvements'],
        ['**Blue**', 'Control of the process', 'Sets the agenda, keeps order, sums up and decides next steps (used by the facilitator first and last)'],
      ] } },
      '**Example:** "Improve campus security": White = 3 thefts last term; Red = students feel unsafe at night; Black = cameras are costly; Yellow = parents will trust the college more; Green = QR gate entry, motion lights, SOS button in the app; Blue = pilot QR entry for one month.',
    ],
    sources: [`${I} (ideation methods, six thinking hats)`],
  },

  'pdt-m08': {
    blocks: [
      'Apply the five phases of design thinking to **plastic waste on a college campus**.',
      { h: '1. Empathise: understand the users' },
      { ul: ['**Users**: students, canteen staff, housekeeping staff, hostel residents, management.', '**Methods**: interviews, observation of bins and the canteen, a short survey, counting waste for a week.', '**Findings**: "Bins are far from the canteen", "Nobody knows which bin is for plastic", "Water bottles and snack wrappers are most of the waste", "Housekeeping has to separate waste by hand".'] },
      { h: '2. Define: state the problem' },
      'Group the findings with an affinity diagram and an empathy map, then write the problem statement:',
      '*"Students need an easy and quick way to dispose of plastic correctly near where they eat, because bins are far away and unclearly marked, so plastic gets mixed with other waste."*',
      'HMW questions: *How might we make correct disposal effortless? How might we reduce single-use plastic in the canteen?*',
      { h: '3. Ideate: generate ideas' },
      'Brainstorming and Six Thinking Hats give ideas such as: colour-coded bins with pictures at every canteen table area, a water-bottle refill station, discounts for bringing your own bottle or box, a plastic-bottle "reverse vending machine" that gives reward points, a student "green team", posters and app reminders. Dot voting picks **colour-coded bins + refill station + reward points**.',
      { h: '4. Prototype: make it cheaply' },
      { ul: ['Cardboard bins painted blue (plastic), green (food) and black (other) with picture labels, placed near the canteen.', 'One temporary water refill point with a sign.', 'A simple Google Form or paper card for reward points.'] },
      { h: '5. Test: try it with real users' },
      { ul: ['Run the pilot for two weeks; observe how people use the bins; weigh the plastic collected; ask students and staff for feedback.', 'Example feedback: "Pictures help", "Bins fill too fast at lunch", "Rewards are motivating".'] },
      { h: 'Iterate' },
      'Add bigger bins at peak times, move one bin closer to the hostel, and turn the reward card into an app feature. Test again, then roll out across the campus.',
      'The final solution is **desirable** (easy for students), **feasible** (cheap bins and a refill station) and **viable** (less cleaning work and lower bottle purchases).',
    ],
    sources: [`${U3}`, `${I}`, `${P}`],
  },

  'pdt-m09': {
    blocks: [
      { h: 'Role of user feedback' },
      { ul: ['Shows **what really works** and what does not, instead of the team guessing.', 'Reveals **hidden needs and problems** users never mentioned in interviews.', 'Helps **choose between alternatives** (A/B testing).', 'Builds a product people **actually want to use**.'] },
      'Feedback can be collected with a simple grid: **Likes · Criticisms · Questions · New ideas**.',
      { h: 'Role of continuous iteration' },
      'Each round of feedback leads to changes, and the changed version is tested again. Small, repeated improvements are **cheaper and safer** than one big redesign at the end.',
      { h: 'From first prototype to final product' },
      { steps: [
        '**Low-fidelity prototype**: a rough paper sketch or cardboard model to test the basic idea.',
        '**Test with users**: watch them use it, ask what they like and dislike.',
        '**Modify**: fix the main problems, drop features nobody used, add what users asked for.',
        '**Mid-fidelity prototype**: a clickable mock-up or a working model with the improvements.',
        '**Test again** with more users and more realistic tasks.',
        '**High-fidelity prototype**: looks and works almost like the real product.',
        '**Final testing** (performance, reliability) and **launch**.',
        '**Keep collecting feedback** after launch for future versions.',
      ] },
      { img: 'pdt-p5' },
      { h: 'Example: a college canteen pre-order app' },
      'Paper screens → students found the menu confusing → grouped items by category → clickable Figma prototype → students wanted pickup-time slots → added slots → working beta in one canteen → payment was slow → added UPI → launched to the whole college.',
    ],
    sources: [`${P} (testing, iteration)`],
  },

  'pdt-m10': {
    blocks: [
      'IDEO\'s **three lenses of innovation**. A successful product must pass all three.',
      { img: 'pdt-f1' },
      { table: { head: ['Lens', 'Question it asks', 'In simple words'], rows: [
        ['**Desirability** (people)', 'Do people **want** it?', 'It solves a real problem users care about. Checked by empathy research and user testing.'],
        ['**Feasibility** (technology)', 'Can we **build** it?', 'The technology, skills, time and materials exist to make it.'],
        ['**Viability** (business)', 'Should we build it, does it **make business sense**?', 'It can earn enough money (or save enough) to survive and grow.'],
      ] } },
      { h: 'How they lead to a successful product' },
      { ul: ['**Only desirable**: people love it but it cannot be built, or it loses money.', '**Only feasible**: easy to build but nobody needs it.', '**Only viable**: looks profitable on paper but users do not want it.', '**All three together** = a product people use, that works, and that lasts. Design thinking starts with desirability, then checks feasibility and viability.'] },
      { h: 'Examples' },
      { ul: ['**Uber/Ola**: desirable (easy rides), feasible (smartphones + GPS), viable (commission per ride).', '**Google Glass (consumer)**: feasible but not desirable (privacy worries, odd looks) and not viable at its price, so it failed for the public.', '**Campus food pre-order app**: desirable (no queues), feasible (simple app + UPI), viable (small fee per order).'] },
    ],
    sources: [`${F} page 1`, 'IDEO three lenses of innovation'],
  },

  'pdt-m11': {
    blocks: [
      '**Affinity mapping** (affinity diagram, KJ method) is a Define-phase tool that **sorts a large amount of research data into groups of related ideas**, so that common patterns and themes become visible.',
      { img: 'affinity' },
      { h: 'Steps to organise and group user insights' },
      { steps: [
        '**Write one observation per sticky note**: quotes, problems and behaviours from interviews and observation.',
        '**Put all notes on a wall** in random order.',
        '**Group silently**: team members move notes that seem related next to each other, without discussing at first.',
        '**Discuss and refine**: split big groups, merge similar ones, move notes that do not fit.',
        '**Name each group**: write a header (theme) that sums it up.',
        '**Link related groups** and arrange them; mark the biggest or most important themes.',
        '**Write insights and needs** from the themes; they feed the problem statement.',
      ] },
      { h: 'Example: survey about the college library' },
      { table: { head: ['Theme', 'Notes'], rows: [['Space', '"No free seats at 4 pm", "Too noisy near the door"'], ['Timings', '"Closes before evening classes end", "Closed on Sundays"'], ['Books', '"Only 2 copies of the OS textbook"'], ['Digital', '"Can\'t find e-books", "Slow Wi-Fi"']] } },
      'Insight: *students need quiet study space and books in the evening, when the library is closed or full.*',
      { h: 'Benefits' },
      'Makes messy data easy to understand, involves the whole team, and shows patterns that one person might miss.',
    ],
    sources: [`${U3} (affinity diagrams)`],
  },

  'pdt-m12': {
    blocks: [
      'In the **Prototyping** phase the team builds **quick, simple, cheap versions** of the chosen ideas, so that users can see and use them and give feedback. A prototype can be a paper sketch, a cardboard model, a role-play or a clickable app screen.',
      { h: 'Objectives' },
      { ul: ['Make ideas **real and testable**.', '**Learn quickly** what works and what does not.', '**Find problems early**, before spending a lot.', '**Communicate** the idea clearly to the team, users and sponsors.', '**Compare** different solutions.'] },
      { h: 'Guidelines' },
      { ol: ['**Just start building**; do not over-think.', '**Keep it rough and cheap** at first (low fidelity).', '**Build to answer a question**: know what you want to learn.', '**Keep the user in mind**.', '**Don\'t get attached**; be ready to throw it away.', '**Fail early, fail cheap**.', '**Make a few alternatives** to compare.', '**Raise fidelity step by step** as the idea improves.', '**Always test** it with users.'] },
      { img: 'pdt-p3' },
      { h: 'Advantages' },
      { ul: ['Saves time and money.', 'Gives real user feedback early.', 'Reduces the risk of failure.', 'Encourages creativity and teamwork.', 'Helps win support from stakeholders.'] },
      { h: 'Challenges' },
      { ul: ['Rough prototypes may be misunderstood by users.', 'Polished prototypes take time, and teams get attached to them.', 'Users may give polite rather than honest feedback.', 'Some ideas (e.g. electronics) are hard to prototype cheaply.', 'Deciding the right level of detail is not easy.'] },
      { h: 'Example' },
      'For a smart dustbin idea: a cardboard bin with a paper "screen" (low fidelity) → users said the lid was confusing → a 3-D printed lid with a foot pedal (mid fidelity) → a working model with a sensor (high fidelity).',
    ],
    sources: [`${P} pages 1–5`],
  },

  'pdt-m13': {
    blocks: [
      '**Brainstorming** (Alex Osborn) is a group method to **generate a large number of ideas** on one focused question in a short time, without judging them.',
      { h: 'Rules' },
      { ol: ['**Defer judgement**: no criticism during the session.', '**Encourage wild ideas**: crazy ideas can lead to great ones.', '**Build on others\' ideas**: say "yes, and…".', '**Stay focused on the topic**.', '**One conversation at a time**.', '**Be visual**: use sticky notes and sketches.', '**Go for quantity**: more ideas, more chances of a good one.'] },
      '**Example:** "How might we reduce canteen queues?" gives pre-ordering, more counters, snack vending machines, staggered breaks…',
    ],
    sources: [`${I} pages 3–7`],
  },

  'pdt-m14': {
    blocks: [
      '**Brainstorming**, developed by **Alex Osborn**, is a group ideation method where people share as many ideas as possible on one problem, without judging them, in a short time.',
      { h: 'Principles' },
      { ul: ['**Quantity breeds quality**: the more ideas, the better the chance of a great one.', '**Suspend judgement**: criticism kills creativity, so evaluation comes later.'] },
      { h: 'Rules of effective brainstorming' },
      { ol: ['Defer judgement.', 'Encourage wild ideas.', 'Build on the ideas of others.', 'Stay focused on the topic.', 'One conversation at a time.', 'Be visual.', 'Go for quantity.'] },
      { h: 'How to run a session' },
      { steps: ['Write a clear **How-Might-We** question.', 'Gather a **mixed group of 5–8 people** and a facilitator.', 'Do a short **warm-up**.', 'Everyone writes ideas on **sticky notes** for 15–20 minutes and shares them; use **SCAMPER** if ideas slow down.', '**Group** similar ideas.', '**Vote** (dot voting) to pick the best ones for prototyping.'] },
      { img: 'pdt-i7' },
      { h: 'How it helps solve real-world problems' },
      { ul: ['People from different backgrounds see the problem differently, so ideas are **varied**.', 'One idea **triggers another**, leading to new combinations.', 'The no-criticism rule lets **unusual, innovative ideas** come out.', 'Everyone takes part, so the team **owns the solution**.', 'It is **fast and cheap**.'] },
      '**Example:** a city brainstorming "How might we reduce traffic near schools?" came up with walking school buses, staggered school timings, and drop-off zones a short walk away, all simple and cheap.',
    ],
    sources: [`${I} pages 3–7`],
  },

  'pdt-m15': {
    blocks: [
      'In the **Define** phase the team turns everything it learnt while empathising into a clear problem statement. **Empathy mapping is the bridge** between the two phases.',
      { img: 'pdt-empathy-map' },
      { h: 'What an empathy map is' },
      'A board divided into **Says, Thinks, Does, Feels** (sometimes also Sees, Hears, Pains and Gains). The team fills it with sticky notes from interviews and observations of one user or persona.',
      { h: 'How it fits into the Define phase' },
      { ol: ['**Organises research data** about one user in one place.', '**Reveals contradictions**: what users *say* vs. what they *feel* or *do*. These gaps are the **insights**.', '**Shows needs**: pains and gains point to what the user really needs.', '**Builds shared understanding** in the team.', '**Feeds the problem statement**: user + need + insight come straight from the map.'] },
      { h: 'Example: a day-scholar student' },
      { table: { head: ['Says', 'Thinks'], rows: [['"I don\'t mind the bus."', '"I waste 2 hours every day."'], ['**Does**', '**Feels**'], ['Leaves at 6:30 am, tries to study on the bus', 'Tired and stressed before exams']] } },
      'Insight: the student *says* it is fine but *feels* stressed. Problem statement: *"Day-scholar students need to use their commute time to study, because they have no quiet time at home before exams."*',
    ],
    sources: ['FDT Unit-2 Empathy Phase.pptx slides 38–40', `${U3}`],
  },

  'pdt-m16': {
    blocks: [
      { h: 'What is Ideation?' },
      '**Ideation** is the phase of design thinking where the team **generates many ideas** for the problem (How-Might-We question) and then **selects the best ones** for prototyping. First think wide (many ideas, no judging), then narrow down.',
      'Common methods: brainstorming, mind maps, SCAMPER, Six Thinking Hats, storyboarding, doodling.',
      { h: 'Six Thinking Hats' },
      'A method by **Edward de Bono**. The group looks at an idea from **six angles, one at a time**: everyone "wears" the same hat together.',
      { img: 'six-hats' },
      { ul: ['**White hat**: facts and data. *What do we know?*', '**Red hat**: feelings and gut reactions. *How do we feel about it?*', '**Black hat**: risks and problems. *What could go wrong?*', '**Yellow hat**: benefits. *Why will it work?*', '**Green hat**: creativity. *What new ideas or alternatives are there?*', '**Blue hat**: managing the process. *What is the plan and the next step?*'] },
      { h: 'Why it is useful' },
      'Avoids arguments, covers all viewpoints, includes everyone and makes meetings faster.',
      '**Example:** for "a new canteen app", the black hat raises payment security, the green hat suggests group orders, and the blue hat decides to test a basic version first.',
    ],
    sources: [`${I} pages 15–18`],
  },

  'pdt-m17': {
    blocks: [
      '**Prototyping** means building an **early, simple version** of an idea so that users can try it and give feedback before the real product is made. It can be a paper sketch, a cardboard model, a role-play or a clickable screen.',
      { h: 'Guidelines for prototyping' },
      { ol: ['**Just start building**: make something users can react to.', '**Keep it simple and cheap**: paper, cardboard, sticky notes.', '**Know what you want to learn** from each prototype.', '**Think about the user** while building.', '**Don\'t fall in love with it**: be ready to change or discard it.', '**Fail early, fail fast, fail cheap**.', '**Build a few versions** to compare.', '**Add detail step by step** (low → mid → high fidelity).', '**Make it something users can use**, not just look at.', '**Test it with users** and improve.'] },
      { img: 'pdt-p3' },
      '**Example:** before building a library-seat booking app, draw the screens on paper and ask five students to "book a seat" by tapping the paper.',
    ],
    sources: [`${P} pages 1–5`],
  },

  'pdt-m18': {
    blocks: [
      'A **value proposition** says clearly **who the product is for, what problem it solves, and why it is better** than other options. It keeps the whole team focused on the user.',
      { img: 'value-prop' },
      { h: 'How it helps build a user-centred product' },
      { ol: [
        '**Starts from the user**: the value proposition canvas lists the customer\'s **jobs** (what they want to do), **pains** (problems) and **gains** (what they hope for).',
        '**Matches features to needs**: every feature must relieve a pain or create a gain, so useless features are dropped.',
        '**Guides decisions**: when the team is unsure, it asks "does this support our value proposition?"',
        '**Sets success measures**: e.g. "lunch in under 10 minutes" can be tested with users.',
        '**Shows the difference from competitors**, so the product has a clear reason to exist.',
        '**Communicates value** clearly in marketing and pitches.',
        '**Is tested and improved** with user feedback, like the product itself.',
      ] },
      { h: 'Example' },
      '*"For hostel students who are short on time, CanteenGo lets you pre-order meals and skip the queue."* Pain: long queues; gain: more time. Features kept: pre-order, pickup slots, UPI. Features dropped: social sharing (no user need).',
    ],
    sources: [`${F}`, 'Strategyzer value proposition canvas'],
  },

  'pdt-m19': {
    blocks: [
      { h: 'Why test? (necessity of testing)' },
      { ul: ['**Our assumptions may be wrong**: testing checks them with real users.', '**Finds problems early**, when they are cheap to fix.', '**Shows what users really do**, not just what they say.', '**Improves the design** through feedback and iteration.', '**May show the problem was framed wrongly**, sending the team back to Define.', '**Reduces risk** before launching.', '**Gives evidence** to convince stakeholders.'] },
      'Ways to test: concept testing, A/B testing, usability testing, first-click and tree testing. Feedback is captured with a Likes / Criticisms / Questions / Ideas grid.',
      { h: 'Desirable, feasible and viable solutions' },
      { img: 'pdt-f1' },
      { ul: ['**Desirable**: users **want** it and it meets their need (checked by user testing).', '**Feasible**: it **can be built** with today\'s technology, skills and budget.', '**Viable**: it **makes business sense**; it earns or saves enough to last.'] },
      'A good solution is all three; testing checks desirability most of all.',
      '**Example:** a campus food pre-order app: students want it (desirable), it is simple to build (feasible), and a small fee per order pays for it (viable).',
    ],
    sources: [`${P} pages 6–11`, `${F}`],
  },

  'pdt-m20': {
    blocks: [
      { h: '1. By what they are (types in your notes)' },
      { table: { head: ['Type', 'What it is', 'Example'], rows: [
        ['**Physical**', 'A real object people can touch and use', 'Cardboard model of a kiosk, 3-D printed phone stand'],
        ['**Analytical**', 'A maths or computer model, not a physical object', 'Simulation of crowd flow in a canteen'],
        ['**Comprehensive**', 'Has most or all features: close to the final product', 'Full working pre-production model'],
        ['**Focused**', 'Tests only one or two features', 'Foam block to test only grip and size'],
      ] } },
      { h: '2. By level of detail (fidelity)' },
      { img: 'pdt-p5' },
      { ul: ['**Low fidelity**: paper sketches, sticky notes, cardboard, storyboards, role-play. Fast and cheap; good for early ideas.', '**Mid fidelity**: wireframes, clickable mock-ups (e.g. Figma), rough working models. Shows layout and flow.', '**High fidelity**: looks and works almost like the real product. Good for final testing, but slow and costly.'] },
      { h: '3. Other common forms' },
      { ul: ['**Storyboard**: comic strip of the user\'s experience.', '**Role-play / bodystorming**: act out a service.', '**Wizard of Oz**: a person secretly performs what the system will later do automatically.', '**Digital / clickable prototype** for apps and websites.'] },
      'Rule of thumb: use the **simplest prototype that answers your current question**.',
    ],
    sources: [`${P} pages 2–5`],
  },
}
