// Principles of Design Thinking in simple words: a short summary, a picture of the idea, the key
// points, an everyday comparison and one example for every topic. Keys are syllabus ids.
export default {
  // ======================= UNIT I =======================
  'pdt.u1.impact': {
    summary: '**Science** finds out how things work; **engineering** uses that to solve people\'s problems. Together they changed health, travel, communication and daily life.',
    picture: [{ flow: ['Science discovers', 'Engineering builds', 'Society benefits'] }],
    points: [
      'Engineering gave us clean water, phones, power, roads and medical devices.',
      'It also brings problems: pollution, e-waste, job loss.',
      'Design thinking makes sure engineering solves the right problem for real people.',
    ],
    analogy: 'Science is learning how fire works; engineering is building a stove so families can cook safely.',
    example: 'Mobile networks let farmers check crop prices on their phones and sell at better rates.',
  },
  'pdt.u1.thinking-behaviour': {
    summary: 'How we **think** decides how we **act**. Our habits and biases make us repeat old solutions, so changing our thinking helps us find new ones.',
    picture: [{ flow: ['Beliefs', 'Feelings', 'Actions', 'Results'], loop: 'Results strengthen the beliefs' }],
    points: [
      'Habits save time but block new ideas.',
      'Functional fixedness: seeing an object only in its usual use.',
      'Designers stay curious and open-minded on purpose.',
    ],
    analogy: 'If you believe "I am bad at maths", you avoid practice, score low, and the belief gets stronger.',
    example: 'Seeing a bottle cap only as a lid, versus using caps as game pieces or plant pots.',
  },
  'pdt.u1.thinking-types': {
    summary: '**Linear thinking** goes step by step to one answer. **Lateral thinking** finds clever, indirect solutions. **Design thinking** mixes both and starts from people\'s needs.',
    picture: [{ table: { head: ['Type', 'Like'], rows: [['Linear', 'Following a recipe exactly'], ['Lateral', 'Inventing a new dish from leftovers'], ['Design', 'Asking guests what they like, then cooking for them']] } }],
    points: [
      'Divergent thinking creates many ideas; convergent thinking picks the best one.',
      'Lateral thinking was named by Edward de Bono.',
    ],
    analogy: 'Linear is walking straight down a road; lateral is finding a shortcut through a side street.',
    example: 'People complained a lift was slow. Linear fix: a faster motor. Lateral fix: mirrors beside the lift, so the wait felt shorter.',
  },
  'pdt.u1.importance': {
    summary: '**Design thinking** matters because it starts with **people**: understand them first, then design and test with them, so the solution is something they actually want.',
    picture: [{ tree: { root: 'A good solution is', kids: ['Desirable: people want it', 'Feasible: it can be built', 'Viable: it can last as a business'] } }],
    points: [
      'Solves the right problem, not just any problem.',
      'Cheap prototypes catch mistakes before they become costly.',
      'Brings people from different fields together.',
    ],
    analogy: 'Like a tailor who measures you before stitching, instead of selling one size to everyone.',
    example: 'A banking app designed with elderly users has bigger buttons and simpler steps.',
  },
  'pdt.u1.phases': {
    summary: 'Design thinking has **five phases**: understand users (**Empathize**), state their problem (**Define**), come up with ideas (**Ideate**), build quick models (**Prototype**) and try them (**Test**).',
    picture: [{ flow: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] }],
    points: [
      'The first two phases understand the problem; the last three find the solution.',
      'Each phase has its own question and output.',
    ],
    analogy: 'Like a doctor: listen to the patient, diagnose, consider treatments, try one, check if it works.',
    example: 'Designing a school bag: talk to students, define "bags hurt shoulders", sketch ideas, make a cardboard model, let students try it.',
  },
  'pdt.u1.five-stage': {
    summary: 'The five stages are **not a straight line**. If testing shows a problem, the team goes back to an earlier stage. That looping is what makes design thinking **iterative**.',
    picture: [{ flow: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'], loop: 'Go back to any stage when you learn something new' }],
    points: [
      'Linear problem solving assumes you know the problem at the start.',
      'Design thinking keeps improving the problem and the solution.',
    ],
    analogy: 'Like writing an essay: draft, get feedback, rewrite, get feedback again, until it is good.',
    example: 'A canteen app works for students, but testing shows staff miss orders, so the team goes back to understand the staff.',
  },
  'pdt.u1.applications': {
    summary: 'Design thinking is used everywhere: **products**, **apps**, **hospitals**, **schools**, **banks** and **social problems**.',
    picture: [{ tree: { root: 'Used in', kids: ['Engineered products', 'Software', 'Healthcare', 'Education', 'Business services', 'Social sector'] } }],
    points: [
      'Embrace infant warmer: a cheap warmer for premature babies in places without incubators.',
      'Oral-B made fatter toothbrush handles after watching how children hold them.',
    ],
    analogy: 'Like a universal key: the same method opens problems in many different fields.',
    example: 'Airbnb grew after its founders visited hosts and learned their listing photos were poor.',
  },

  // ======================= UNIT II =======================
  'pdt.u2.user-needs': {
    summary: 'Every user has **unique needs**. Some they **say** (explicit), and some they never mention but clearly have (**latent**). Designers find both by watching, not just asking.',
    picture: [{ compare: [{ title: 'Explicit need', items: ['What users say', '"I want a cheaper phone"'] }, { title: 'Latent need', items: ['What users really need', '"I fear losing my photos when I switch"'] }] }],
    points: [
      'Needs depend on age, ability, place and money.',
      'Workarounds (taped notes, home-made fixes) reveal unmet needs.',
    ],
    analogy: 'A customer asks for a faster horse; what they really need is to get there quicker.',
    example: 'Students tie strings to their ID cards so they do not lose them: a hidden need for an easy-to-carry ID.',
  },
  'pdt.u2.empathize': {
    summary: '**Empathizing** means understanding users\' feelings and experiences from **their** point of view, by watching them, talking with them and trying their world yourself.',
    picture: [{ tree: { root: 'Empathize by', kids: ['Observe', 'Engage (interview)', 'Immerse (experience it)'] } }],
    points: [
      '**Empathy** is feeling with someone; **sympathy** is feeling sorry for them.',
      'Outputs: interview notes, observations, insights, empathy maps.',
      'Empathy is needed but not enough on its own: you still need to define, ideate and test.',
    ],
    analogy: 'Empathy is walking in someone\'s shoes; sympathy is watching them walk and feeling sorry.',
    example: 'A designer of a hospital app sits in the waiting room for a day and learns patients mainly want to know how long the wait is.',
  },
  'pdt.u2.steps': {
    summary: 'The **Empathize phase** has steps: choose whom to study, prepare, observe them, interview them, experience their life, and write down what you learn.',
    picture: [{ flow: ['Choose users', 'Prepare questions', 'Observe', 'Interview', 'Immerse', 'Record insights'] }],
    points: [
      'Ask open questions ("Tell me about your day") and keep asking "why?".',
      'Watch what people do, not only what they say.',
    ],
    analogy: 'Like a journalist researching a story: visit the place, talk to people, live it a little, then write.',
    example: 'For street vendors: watch them through a rainy day, ask about payments, help at a stall; insights include no shade and trouble with change.',
  },
  'pdt.u2.developing-empathy': {
    summary: 'You **develop empathy** by listening carefully, dropping your assumptions, asking "why?", watching closely and experiencing the user\'s situation yourself.',
    picture: [{ flow: ['Listen', 'Ask why', 'Drop assumptions', 'Observe', 'Experience it'] }],
    points: [
      'Immersive learning: do the user\'s task yourself.',
      'Look for the gap between what people say and what they do.',
    ],
    analogy: 'Like learning what a farmer\'s life is like by spending a day in the fields, not by reading about it.',
    example: 'Designers who used a wheelchair for a day noticed how many college doors were too heavy to open.',
  },
  'pdt.u2.beginners-mind': {
    summary: 'A **beginner\'s mindset** means acting as if you know nothing: no assumptions, lots of curiosity, and asking "what?" and "why?" again and again.',
    picture: [{ flow: ['What is happening?', 'Why?', 'Why does that matter?', 'Root need'] }],
    points: [
      'Experts often miss details because they assume.',
      'The 5 Whys technique digs to the root cause.',
    ],
    analogy: 'Like a curious child who keeps asking "but why?" until the real reason comes out.',
    example: 'Why do students skip the library? Too far. Why does that matter? No time between classes. Real need: study spaces near classrooms.',
  },
  'pdt.u2.immersion': {
    summary: 'An **immersion activity** puts you inside the user\'s world to experience it first-hand: plan it, go there, take part, observe, reflect and record.',
    picture: [{ flow: ['Plan', 'Get permission', 'Take part', 'Observe', 'Reflect', 'Record'] }],
    points: [
      'Keep a journal of feelings and problems.',
      'Ask permission before taking photos or notes.',
    ],
    analogy: 'Like an actor preparing for a role by living like the character for a few days.',
    example: 'To improve city buses, the team rides the busiest route at rush hour every day for a week.',
  },
  'pdt.u2.bodystorming': {
    summary: '**Bodystorming** means acting out a situation with props, so the team **feels** what users would experience and spots problems early.',
    picture: [{ flow: ['Set up props', 'Play the roles', 'Act it out', 'Spot problems', 'Change and act again'] }],
    points: [
      'Brainstorming uses talk; bodystorming uses movement and space.',
      'Cheap and quick: chairs, tables and cardboard are enough.',
    ],
    analogy: 'Like a drama rehearsal: you only find awkward moments when you actually act them out.',
    example: 'Acting out a hospital check-in shows the counter is too high for a patient on crutches.',
  },

  // ======================= UNIT III =======================
  'pdt.u3.define': {
    summary: 'The **Define phase** makes sense of what you learned while empathizing and turns it into a **clear statement of the user\'s real problem**.',
    picture: [{ flow: ['Research findings', 'Patterns', 'Core need', 'Problem statement'] }],
    points: [
      'The problem should be about the user, not about a technology.',
      'Not too broad, not too narrow.',
      'Tools: affinity diagrams, empathy maps, personas, "How might we…?".',
    ],
    analogy: 'Like a doctor turning the patient\'s many symptoms into one clear diagnosis.',
    example: '"Students need a quick way to find free study seats between classes, because walking to the library wastes their break."',
  },
  'pdt.u3.analysis-synthesis': {
    summary: '**Analysis** breaks the research into small pieces. **Synthesis** puts the pieces together into patterns and insights.',
    picture: [{ flow: ['Raw notes', 'Analysis: break down', 'Synthesis: group into themes', 'Insights'] }],
    points: [
      'Analysis asks "what did we see?"; synthesis asks "what does it mean?".',
      'You need both to reach a good problem statement.',
    ],
    analogy: 'Analysis is taking apart a LEGO model into bricks; synthesis is building something new from them.',
    example: '40 interview quotes are split into notes, then grouped into 4 themes: cost, time, safety, comfort.',
  },
  'pdt.u3.persona-perspectives': {
    summary: 'Personas can be made from **four perspectives**: **goal-directed** (what users want to do), **role-based** (their role), **engaging** (a rich story) and **fictional** (the team\'s guesses).',
    picture: [{ tree: { root: 'Persona perspectives', kids: ['Goal-directed', 'Role-based', 'Engaging', 'Fictional'] } }],
    points: [
      'Goal-directed and role-based use real data.',
      'Engaging personas add story and emotion so the team cares.',
      'Fictional personas are quick but risky: check them with real users.',
    ],
    analogy: 'Like describing a friend by their goals, their job, their life story, or just your guess about them.',
    example: '"Priya, 20, a hosteller who wants to save money on food" is a goal-directed persona.',
  },
  'pdt.u3.persona-steps': {
    summary: 'A **persona** is a made-up character based on real research, who stands for a group of users. You build it step by step from the data you collected.',
    picture: [{ flow: ['Collect user data', 'Find patterns', 'Group similar users', 'Write the persona (name, photo, goals, pains)', 'Share and use it'] }],
    points: [
      'It keeps the team focused on real people.',
      'Include goals, frustrations, behaviours and a short story.',
    ],
    analogy: 'Like a character in a novel written from interviews with many real people.',
    example: '"Ravi, 19, day scholar, travels 1 hour by bus, wants notes he can read on his phone."',
  },
  'pdt.u3.problem-statement': {
    summary: 'A **problem statement** (point of view) clearly says **who** the user is, **what** they need, and **why**, framed around the user.',
    picture: [{ flow: ['User', 'needs', 'because (insight)'] }],
    points: [
      'Format: [User] needs [need] because [insight].',
      'Turn it into "How might we…?" questions for ideation.',
      'Why-How laddering moves up (why?) to broaden and down (how?) to make it concrete.',
    ],
    analogy: 'Like a clear question on an exam paper: a fuzzy question gets fuzzy answers.',
    example: '"An elderly person living alone needs an easy way to call for help, because they fear falling with no one around."',
  },
  'pdt.u3.affinity': {
    summary: 'An **affinity diagram** turns a messy pile of research notes into clear themes: write each observation on a sticky note, then group similar notes together.',
    picture: [{ flow: ['One note per observation', 'Put all notes on a wall', 'Group similar notes', 'Name each group'] }],
    points: [
      'Done silently at first so no one dominates.',
      'Themes become insights for the problem statement.',
    ],
    analogy: 'Like sorting a heap of laundry into shirts, trousers and socks.',
    example: '60 notes about the canteen become themes: queues, prices, menu variety, hygiene.',
  },
  'pdt.u3.empathy-map': {
    summary: 'An **empathy map** is a one-page picture of a user split into four parts: what they **say**, **think**, **do** and **feel**, often with pains and gains.',
    picture: [{ table: { head: ['Says', 'Thinks'], rows: [['"The bus is always late"', '"I will miss my first class"'], ['Does: leaves home at 6:30', 'Feels: stressed, tired']] } }],
    points: [
      'Built from interviews and observations.',
      'Gaps between says and does reveal hidden needs.',
    ],
    analogy: 'Like a quick sketch of a person\'s day from the inside.',
    example: 'A first-year student says "I am fine", but does skip meals and feels homesick.',
  },

  // ======================= UNIT IV =======================
  'pdt.u4.ideation': {
    summary: '**Ideation** is the phase where the team comes up with lots of possible solutions. Get many ideas first and judge them later.',
    picture: [{ flow: ['"How might we…?"', 'Many ideas (go wide)', 'Group and vote', 'Pick the best few'] }],
    points: [
      'Quantity leads to quality.',
      'Wild ideas are welcome; they can be tamed later.',
    ],
    analogy: 'Like fishing with a big net: catch a lot, then keep the best fish.',
    example: '"How might we reduce canteen queues?" yields 50 ideas, including pre-orders, more counters and a token app.',
  },
  'pdt.u4.methods': {
    summary: '**Ideation methods** help teams get more and better ideas: brainstorming, mind maps, SCAMPER, worst possible idea, storyboards and Six Thinking Hats.',
    picture: [{ tree: { root: 'Ideation tools', kids: ['Brainstorming', 'Mind mapping', 'SCAMPER', 'Worst possible idea', 'Storyboarding', 'Six Thinking Hats'] } }],
    points: [
      'SCAMPER: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse.',
      'Different tools suit different teams and problems.',
    ],
    analogy: 'Like having different kitchen tools: a whisk, a knife and a blender each help in different ways.',
    example: 'SCAMPER on an umbrella: combine it with a torch for night walks.',
  },
  'pdt.u4.brainstorming': {
    summary: '**Brainstorming** is a group session to produce as many ideas as possible on one question, following rules that keep criticism out until later.',
    picture: [{ tree: { root: 'Brainstorming rules', kids: ['Defer judgement', 'Go for quantity', 'Encourage wild ideas', 'Build on others\' ideas', 'One conversation at a time', 'Stay on topic', 'Be visual'] } }],
    points: [
      'Time-box it (15 to 30 minutes).',
      'A facilitator keeps it moving.',
    ],
    analogy: 'Like a popcorn machine: let all the ideas pop first, then pick the good ones.',
    example: '"How to improve campus security?" yields ideas like better lighting, an SOS app and student patrols.',
  },
  'pdt.u4.mind-maps': {
    summary: 'A **mind map** starts with one central idea and branches out into related ideas and keywords, so you can see connections at a glance.',
    picture: [{ tree: { root: 'Healthy campus', kids: ['Food', 'Exercise', 'Sleep', 'Mental health'] } }],
    points: [
      'Use keywords, colours and small pictures.',
      'Good for organising thoughts and finding new links.',
    ],
    analogy: 'Like a tree: the trunk is the main idea, branches are topics, and leaves are details.',
    example: 'A mind map on "reduce plastic" branches into home, college, shops and events, each with ideas.',
  },
  'pdt.u4.games': {
    summary: '**Ideation games** turn idea generation into play, with rules, time limits or random prompts, so people relax and get more creative.',
    picture: [{ tree: { root: 'Ideation games', kids: ['Worst possible idea', 'Random word', 'Crazy 8s', 'Role-play'] } }],
    points: [
      'Crazy 8s: sketch 8 ideas in 8 minutes.',
      'Worst possible idea: invert bad ideas into good ones.',
    ],
    analogy: 'Like warm-up games before a match: they loosen people up.',
    example: '"Worst way to run a library": no books allowed. Inverted: a library with books delivered to your desk.',
  },
  'pdt.u4.six-hats': {
    summary: '**Six Thinking Hats** (Edward de Bono) make a group look at a problem from six angles, one at a time.',
    picture: [{ table: { head: ['Hat', 'Focus'], rows: [['White', 'Facts'], ['Red', 'Feelings'], ['Black', 'Risks'], ['Yellow', 'Benefits'], ['Green', 'New ideas'], ['Blue', 'Process control']] } }],
    points: [
      'Everyone wears the same hat at the same time, so there are no arguments.',
      'The blue hat runs the meeting.',
    ],
    analogy: 'Like looking at a house from every side before deciding to buy it.',
    example: 'Campus security: white (theft numbers), red (students feel unsafe at night), black (cost), yellow (safer campus), green (an SOS app), blue (next steps).',
  },
  'pdt.u4.doodling': {
    summary: '**Doodling**, quick rough drawings, helps you think, remember and share ideas visually, even if you "cannot draw".',
    picture: [{ compare: [{ title: 'Mind map', items: ['Words and branches', 'Organises ideas'] }, { title: 'Doodling', items: ['Quick pictures', 'Sparks and shares ideas'] }] }],
    points: [
      'Stick figures, arrows and boxes are enough.',
      'Pictures are remembered better than words.',
    ],
    analogy: 'Like drawing a quick map on a napkin to explain directions.',
    example: 'A three-panel doodle shows a student, a long queue, and a phone ordering app, explaining the idea in seconds.',
  },

  // ======================= UNIT V =======================
  'pdt.u5.prototype-types': {
    summary: 'Prototypes range from **low-fidelity** (paper sketches, cardboard) to **high-fidelity** (realistic, working models). Use the cheapest one that answers your question.',
    picture: [{ flow: ['Sketch', 'Paper / cardboard', 'Clickable mock-up', 'Working model'], label: 'Low to high fidelity' }],
    points: [
      'Low-fidelity: fast, cheap, easy to change.',
      'High-fidelity: realistic, but costly and slow.',
      'Other kinds: storyboard, role-play, Wizard of Oz.',
    ],
    analogy: 'Like trying clothes: a paper sketch, then a cheap cloth sample, then the final stitched dress.',
    example: 'A paper app sketch tests the flow; a Figma clickable mock-up tests the look.',
  },
  'pdt.u5.prototype-guidelines': {
    summary: 'Good prototyping: **start quickly and cheaply**, build just enough to test one question, keep the user in mind, and be ready to throw it away.',
    picture: [{ tree: { root: 'Prototyping guidelines', kids: ['Just start building', 'Do not spend too long', 'Test one question', 'Think of the user', 'Build to think', 'Fail fast'] } }],
    points: [
      'A prototype is for learning, not for showing off.',
      'Do not get attached to it.',
    ],
    analogy: 'Like a rough draft of an essay: write it fast to see if the idea works.',
    example: 'A cardboard model of a smart dustbin tests whether people use the foot pedal.',
  },
  'pdt.u5.storytelling': {
    summary: '**Storytelling** presents an idea as a story about a real user\'s problem and how their life gets better, which makes people understand and remember it.',
    picture: [{ flow: ['Meet the character', 'Their problem', 'The solution arrives', 'Life is better'] }],
    points: [
      'Good stories have a relatable character, conflict, a clear message and emotion.',
      'Use them to pitch ideas and to test reactions with users.',
    ],
    analogy: 'Like an advertisement that shows a family\'s problem and how the product fixes it.',
    example: '"Meena misses her bus every day because the timetable is wrong; with the live-tracking app, she reaches college on time."',
  },
  'pdt.u5.prototype-importance': {
    summary: '**Prototypes** turn ideas into something people can see and use, so you learn what works before spending real time and money.',
    picture: [{ flow: ['Idea', 'Quick prototype', 'User feedback', 'Improve or drop'] }],
    points: [
      'Catches mistakes early when they are cheap to fix.',
      'Makes ideas easy to discuss.',
      'Helps users react to something real.',
    ],
    analogy: 'Like a test drive before buying a car.',
    example: 'A cardboard ATM mock-up shows users cannot see the screen in sunlight, before any machine is built.',
  },
  'pdt.u5.value-prop': {
    summary: 'A **value proposition** is a clear statement of the benefit your solution gives a specific customer, and why it beats the alternatives.',
    picture: [{ flow: ['For (target customer)', 'who (need)', 'our product (what it is)', 'gives (key benefit)', 'unlike (alternatives)'] }],
    points: [
      'Keep it short, clear and specific.',
      'Focus on the benefit, not the features.',
    ],
    analogy: 'Like a shop\'s signboard that tells you in one line why to come in.',
    example: '"For busy students, our app delivers hot canteen food to your classroom in 10 minutes, unlike the 25-minute queue."',
  },
  'pdt.u5.test-need': {
    summary: '**Testing** puts the prototype in front of real users to learn what works and what does not, because the designer\'s guesses are often wrong.',
    picture: [{ flow: ['Prototype', 'Real users try it', 'Watch and listen', 'Learn and improve'] }],
    points: [
      'Reveals problems the team never imagined.',
      'Saves money by fixing things early.',
    ],
    analogy: 'Like tasting your dish before serving it to guests.',
    example: 'Testing a ticket app shows elderly users cannot find the "pay" button.',
  },
  'pdt.u5.user-test': {
    summary: 'A **user test** is a planned session where real users try your prototype on realistic tasks while you watch, ask "why?" and record what happens.',
    picture: [{ flow: ['Plan tasks', 'Recruit users', 'Let them try (do not help)', 'Ask why', 'Record and learn'] }],
    points: [
      'Show, do not tell: let users explore.',
      'Note where they get stuck or confused.',
    ],
    analogy: 'Like watching a friend play a board game you invented to see which rules confuse them.',
    example: 'Users found the wallet prototype too bulky, so the next version used a thinner material and fewer card slots.',
  },
  'pdt.u5.dfv': {
    summary: 'The best solutions are **desirable** (people want it), **feasible** (it can be built) and **viable** (it can make money or be sustained).',
    picture: [{ tree: { root: 'Sweet spot', kids: ['Desirable: people want it', 'Feasible: we can build it', 'Viable: it can last'] } }],
    points: [
      'Missing any one circle means the idea fails.',
      'Testing checks all three.',
    ],
    analogy: 'Like a good restaurant dish: tasty (desirable), possible to cook (feasible) and priced so the restaurant profits (viable).',
    example: 'A flying car may be desirable but not yet feasible or viable for most people.',
  },
  'pdt.u5.iterate': {
    summary: '**Iteration** means going round the design loop again, using what testing taught you to redefine, re-ideate and re-prototype.',
    picture: [{ flow: ['Test', 'Learn', 'Change', 'Test again'], loop: 'Repeat until users are happy' }],
    points: [
      'Each round makes the solution better.',
      'Skipping iteration leads to products nobody wants.',
    ],
    analogy: 'Like a sculptor who keeps chipping and checking until the statue looks right.',
    example: 'WhatsApp added "delete for everyone" after users kept asking to undo mistakes.',
  },
}
