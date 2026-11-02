// PDT Unit V (prototyping, testing, iterate) model answers. Keyed by PYQ id.
const P = 'DT UNIT-4 Final.pdf'
const F = 'DT Unit-5 FINAL.pdf'

export default {
  'pdt-proto-importance': {
    blocks: [
      { ol: ['**Makes ideas tangible so they can be tested with users early and cheaply**: problems are found before money is spent on full development ("fail early, fail cheap").', '**Improves communication and learning**: a prototype lets the team, users and stakeholders see and interact with the idea, giving concrete feedback and revealing needs that discussion alone misses.'] },
      'Other reasons: compare alternatives, reduce risk, refine the problem statement, build stakeholder buy-in.',
    ],
    sources: [`${P} pages 1–3`],
  },

  'pdt-value-prop': {
    blocks: [
      'A **value proposition** is a clear statement of the **benefit** a product or service gives a **specific customer**, the **problem it solves**, and **why it is better** than the alternatives. It answers the customer\'s question "Why should I choose this?"',
      { img: 'value-prop' },
      { h: 'Guidelines for crafting a good value proposition' },
      { ol: [
        '**Know the customer**: use the value proposition canvas: the customer\'s **jobs** (what they try to do), **pains** (frustrations, risks) and **gains** (desired outcomes).',
        '**Match the offer to them**: show which **pain relievers** and **gain creators** the product provides.',
        '**Lead with the single most important benefit**, not a list of features.',
        '**Be specific and measurable**: "Delivery in 10 minutes" beats "fast delivery".',
        '**Show differentiation**: why it is better than competitors or the current way.',
        '**Use the customer\'s language**: simple, jargon-free, understandable in about 5 seconds.',
        '**Keep it concise**: headline + sub-headline + 3 bullet points + a visual.',
        '**Be credible**: back claims with proof (ratings, numbers, testimonials).',
        '**Test and refine** it with real users (A/B tests of messages).',
      ] },
      { formula: 'For [target customer] who [need], [product] is a [category] that [key benefit]. Unlike [alternative], it [differentiator].' },
      { h: 'Example' },
      'For **college students who are short on time**, **CanteenGo** is a **pre-order app** that **gets your lunch ready in 10 minutes without queuing**. Unlike standing in line, you **order from class and just pick up**.',
    ],
    sources: [`${P} (pitching)`, `${F}`, 'Strategyzer value proposition canvas'],
  },

  'pdt-value-ads': {
    blocks: [
      'Example: **a food-delivery app (e.g. Swiggy/Zomato)**.',
      { h: 'Its value proposition' },
      '"Your favourite food from nearby restaurants, delivered to your door in about 30 minutes (or groceries in 10), with live tracking and easy payment."',
      { h: 'How advertisements communicate it' },
      { ul: [
        '**Dramatise the pain**: ads show a hungry person stuck at work late at night or guests arriving unexpectedly.',
        '**Show the product as the solution**: a few taps, the order is placed.',
        '**Highlight the gain** in concrete, measurable terms: "delivery in 10 minutes", "live tracking", "no minimum order".',
        '**Emotional appeal**: humour, family moments, festivals ("celebrate without cooking").',
        '**Proof and trust**: ratings, number of restaurants, safety badges (masks/contactless delivery during COVID).',
        '**Targeting**: different ads for students (offers, late-night delivery) and families (bulk orders).',
        '**Call to action and offers**: "first order free", coupon codes.',
      ] },
      { h: 'User feedback that improved the product' },
      { table: { head: ['User feedback', 'Improvement', 'New message'], rows: [
        ['"I don\'t know where my order is"', 'Live map tracking, delivery-partner contact', '"Track your order live"'],
        ['"Delivery fees are too high for frequent use"', 'Subscription (Swiggy One / Zomato Gold) with free delivery', '"Unlimited free deliveries"'],
        ['"Food arrives cold"', 'Insulated bags, faster nearby restaurants, delivery time estimates', '"Hot and fresh"'],
        ['"Hard to find healthy options"', 'Filters for veg/healthy, ratings for hygiene', '"Eat healthy"'],
        ['"Need groceries quickly"', 'Instamart / Blinkit 10-minute grocery delivery', '"Groceries in 10 minutes"'],
        ['Safety concerns (COVID)', 'Contactless delivery, temperature checks', '"Safe and contactless"'],
      ] } },
      'This shows the loop: **test with users → feedback → improve product → refine and re-advertise the value proposition**.',
    ],
    sources: [`${F}`, `${P} (testing and feedback)`],
  },

  'pdt-wallet': {
    blocks: [
      'Feedback: the wallet prototype is **too bulky**. To make it more desirable, I would analyse:',
      { h: 'Factors to consider' },
      { table: { head: ['Factor', 'Questions / analysis'], rows: [
        ['**Why it feels bulky** (root cause)', 'Too many card slots? Thick leather? Coin pocket? Stitching layers? Ask "why" in follow-up interviews'],
        ['**User needs and usage**', 'What do users actually carry daily? (2–4 cards, little cash, mostly UPI) Where do they keep it: front pocket, back pocket, bag?'],
        ['**Comfort**', 'Sitting with it in a back pocket, fitting in a front pocket or slim jeans'],
        ['**Capacity vs size trade-off**', 'Which compartments can be removed or made optional (modular)?'],
        ['**Materials**', 'Thinner leather, synthetic fabric, aluminium/carbon card holders, elastic bands'],
        ['**Functionality**', 'Quick access to the most-used card, RFID blocking, phone-case wallet, AirTag slot'],
        ['**Aesthetics and identity**', 'Minimal, modern look; colour options; gender-neutral'],
        ['**Target segments**', 'Students, office-goers, travellers may need different versions'],
        ['**Feasibility and viability**', 'Can it be manufactured at the target price? Will margins still work?'],
      ] } },
      { h: 'Process (using the feedback)' },
      { steps: ['**Understand** the feedback in depth (interviews, observe users emptying their wallets).', '**Redefine**: "Daily commuters need a wallet that carries only essentials comfortably in a front pocket."', '**Ideate**: card-only slim sleeve, detachable coin pouch, elastic-band design, phone-case wallet, modular inserts.', '**Prototype** 2–3 low-fidelity versions quickly (paper, cardboard, fabric).', '**Re-test** with the same users; measure thickness, comfort, ease of access, preference.', '**Iterate** on the preferred design while checking it stays feasible and viable.'] },
      'Result: a slimmer, user-driven design that is more **desirable**, without losing **feasibility** or **viability**.',
    ],
    sources: [`${P} pages 6–11`, `${F}`],
  },

  'pdt-testing-need': {
    blocks: [
      'The **testing phase** puts prototypes in front of **real users** to learn whether the solution works for them and why. It is necessary because:',
      { ol: [
        '**Assumptions can be wrong**: testing validates or disproves them with evidence instead of opinion.',
        '**Finds problems early**, when changes are cheap; fixing a flaw after launch is far more expensive.',
        '**Deepens empathy**: watching people use a prototype reveals needs and behaviours they never mention in interviews.',
        '**Refines the problem statement**: sometimes testing shows the problem itself was framed wrongly.',
        '**Compares alternatives** objectively (A/B testing).',
        '**Improves usability** and user satisfaction.',
        '**Reduces risk and cost** before full implementation.',
        '**Builds stakeholder confidence**: decisions are backed by user data.',
        '**Drives iteration**: results tell the team what to change next.',
      ] },
      { h: 'How testing is done' },
      { steps: ['Decide what to test (questions/assumptions).', 'Recruit representative users.', 'Let them use the prototype in a realistic scenario; ask them to think aloud; observe rather than explain.', 'Capture feedback (e.g. a **Likes / Criticisms / Questions / Ideas** grid).', 'Analyse and decide what to improve; iterate.'] },
      'User-testing methods from the notes: **concept testing, A/B testing, usability testing, first-click testing, tree testing**.',
    ],
    sources: [`${P} pages 6–11`],
  },

  'pdt-dfv': {
    blocks: [
      'IDEO\'s **three lenses of innovation**: when testing a solution, it should be checked against all three. A successful innovation lies where they overlap: the **sweet spot**.',
      { img: 'pdt-f1' },
      { table: { head: ['Lens', 'Question', 'How it is tested', 'Example (campus food pre-order app)'], rows: [
        ['**Desirable** (human)', 'Do people **want** it? Does it meet a real need?', 'Empathy research, user testing, usage and satisfaction data', 'Students hate queues; 80% in a test said they would use it'],
        ['**Feasible** (technical)', 'Can it be **built** with available technology, skills and time?', 'Technical prototypes, expert review, pilot', 'Simple app + UPI payment API + kitchen display: buildable in 2 months'],
        ['**Viable** (business)', 'Is it **sustainable**? Do revenues cover costs; does it fit the organisation\'s strategy?', 'Business model, cost–revenue analysis, pilots', 'Small convenience fee per order + reduced canteen waste covers costs'],
      ] } },
      'A solution that is only desirable may be impossible to build or lose money; one that is feasible and viable but not desirable will not be used. Design thinking starts with **desirability** and then checks feasibility and viability.',
    ],
    sources: [`${F} page 1`, 'IDEO three lenses of innovation'],
  },

  'pdt-iterate': {
    blocks: [
      '**Iteration** means **repeating** the design-thinking phases with improvements based on what testing revealed. Design thinking is **cyclic, not linear**: test results can send the team back to empathise, define, ideate or prototype.',
      { h: 'Importance of iteration in the last phase' },
      { ul: ['Initial ideas rarely meet user needs perfectly; each cycle **reduces uncertainty**.', 'Small, early changes are **cheaper** than late redesigns.', 'Each round **refines** the solution and sometimes the problem statement.', 'Users\' needs and contexts **change over time**; products must keep evolving.', 'Builds a **culture of learning** from failure.'] },
      { h: 'Real-world example: Airbnb (iteration helped)' },
      'In 2009 bookings in New York were stuck. The founders visited hosts (empathise), found that listing photos were poor (define), tried taking professional photos themselves (ideate/prototype), saw weekly revenue double (test), then scaled the photography programme and kept iterating on the listing experience.',
      { h: 'Example of lack of iteration: Google Glass (2013)' },
      'Launched to the public as an expensive explorer edition without enough testing of social acceptance; privacy concerns ("Glassholes"), awkward looks and unclear everyday use made it fail as a consumer product. Google later iterated it into an enterprise tool for factory workers, where it fitted a real need.',
      { h: 'Significance of the last phase' },
      'Testing and iterating **validates the solution with evidence**, decides whether to **implement, refine or drop** it, and feeds learning into the next design cycle.',
    ],
    sources: [`${P} pages 9–11 (iteration)`, `${F}`],
  },

  'pdt-pred-proto-types': {
    blocks: [
      'A **prototype** is an early, simple version of a product used to test ideas with users. Prototypes can be classified in two ways.',
      { h: 'Types of prototypes (by nature)' },
      { table: { head: ['Type', 'Description', 'Example'], rows: [
        ['**Physical prototypes**', 'Tangible models that people can touch and use', 'Cardboard model of a kiosk, 3-D printed phone stand'],
        ['**Analytical prototypes**', 'Non-physical mathematical or computer models to analyse behaviour', 'Simulation of traffic flow, CAD stress analysis'],
        ['**Comprehensive prototypes**', 'Implement most or all attributes of the product; close to the final version', 'Full working pre-production car'],
        ['**Focused prototypes**', 'Implement one or a few attributes to answer a specific question', 'A foam model to test only grip and size'],
      ] } },
      { h: 'Fidelity' },
      { img: 'pdt-p5' },
      { table: { head: ['Fidelity', 'What', 'Pros', 'Cons'], rows: [
        ['**Low**', 'Paper sketches, sticky notes, cardboard, role-play, storyboards', 'Fast, cheap, easy to change; users comment freely', 'Limited realism; hard to test details'],
        ['**Mid**', 'Wireframes, clickable mock-ups (Figma), rough functional models', 'Shows layout and flow; some interaction', 'More effort'],
        ['**High**', 'Close to the final look and function', 'Realistic testing of usability and performance', 'Expensive, slow; users hesitate to criticise; team gets attached'],
      ] } },
      { img: 'pdt-p3' },
      'Rule: use the **lowest fidelity that answers the current question**; increase fidelity as the idea matures.',
    ],
    sources: [`${P} pages 2–5`],
  },

  'pdt-pred-storytelling': {
    blocks: [
      '**Storytelling** in design thinking is communicating insights, ideas and solutions through stories about real users, so that people understand and feel the problem and the value of the solution.',
      { h: 'Characteristics of a good story' },
      { ul: ['**A relatable character** (the user/persona) with a goal.', '**A clear conflict or problem** that creates tension.', '**A journey**: beginning (situation), middle (struggle), end (resolution with the solution).', '**Emotion**: makes people care; we remember feelings more than facts.', '**Authenticity**: based on real research and quotes.', '**Simplicity and focus**: one main message.', '**Visual and concrete details**: images, storyboards, specific moments.', '**A takeaway / call to action**.'] },
      { h: 'Reaching users through stories' },
      { ul: ['Stories make abstract ideas **concrete and memorable**.', 'They build **empathy** in the team and stakeholders for the user.', 'They help **pitch** ideas and win support.', 'In **testing**, scenarios and storyboards let users imagine using the product and give better feedback.', 'In **marketing**, stories show the product in the user\'s life (value proposition).'] },
      'Example: "Meet Ravi, a day-scholar who loses 3 hours a day on buses and fails to revise before exams. With 10-minute offline lessons he now revises on the way and passed with a distinction."',
    ],
    sources: [`${P} (pitching)`, 'Standard textbook coverage'],
  },

  'pdt-pred-user-test': {
    blocks: [
      { h: 'Conducting a user test' },
      { steps: ['**Define the goal**: which assumptions or questions the test should answer.', '**Prepare the prototype** and a realistic **scenario/tasks** ("order lunch for pick-up at 1:10").', '**Recruit** 5–8 representative users (matching the personas).', '**Run the session**: introduce briefly, let users act; ask them to **think aloud**; **observe, don\'t explain or defend** the design; ask open questions ("what did you expect here?").', '**Capture feedback**: notes, video, the **Likes / Criticisms / Questions / Ideas** feedback grid.', '**Analyse**: patterns across users, severity of problems, surprises.', '**Decide next steps** and **iterate**; benchmark against existing products.'] },
      { h: 'User-testing methods' },
      { table: { head: ['Method', 'What it tests'], rows: [['**Concept testing**', 'Whether users understand and want the idea before building it'], ['**A/B testing**', 'Which of two versions performs better with real users'], ['**Usability testing**', 'Whether users can complete tasks easily; where they struggle'], ['**First-click testing**', 'Whether users\' first click on a page is the right one'], ['**Tree testing**', 'Whether the menu/navigation structure lets users find items']] } },
      { h: 'Limitations to plan for' },
      'User time commitment, scope of the project, biased feedback when users want to be polite.',
    ],
    sources: [`${P} pages 6–9`],
  },

  'pdt-pred-proto-guidelines': {
    blocks: [
      { ol: [
        '**Just start building**: do not over-think; make something users can react to.',
        '**Keep it rough and cheap** (low fidelity first): paper, cardboard, sticky notes; spend minimal time and money.',
        '**Build to answer a question**: decide what you want to learn from each prototype.',
        '**Keep the user in mind**: build what the user will experience; test assumptions about them.',
        '**Do not get attached**: prototypes are meant to be thrown away or changed.',
        '**Fail early, fail fast, fail cheap**: learn from what does not work.',
        '**Make several alternatives** to compare.',
        '**Raise fidelity gradually** as the idea becomes clearer (just enough fidelity).',
        '**Make it interactive** so users can use it, not just look at it.',
        '**Test and iterate**: every prototype should end with user feedback.',
      ] },
      { img: 'pdt-p3' },
    ],
    sources: [`${P} pages 1–5`, 'Stanford d.school Bootcamp Bootleg'],
  },
}
