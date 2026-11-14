// Fundamentals of Data Science in simple words: a short summary, a picture of the idea, the key
// points, an everyday comparison and one example for every topic. Keys are syllabus ids.
export default {
  // ======================= UNIT I =======================
  'fds.u1.what': {
    summary: '**Data science** means using data to answer questions and make better decisions. It mixes **statistics**, **programming** and knowledge of the **subject** the data is about.',
    picture: [{ flow: ['Ask a question', 'Collect data', 'Clean it', 'Explore', 'Build a model', 'Share the answer'] }],
    points: [
      'It works with huge, messy, real data, not just neat tables.',
      'The goal is a useful decision, not just a number.',
      'Every project follows the same life cycle, and often loops back with new questions.',
    ],
    analogy: 'Like a detective: collect clues (data), throw away the useless ones (cleaning), spot patterns (analysis) and name the culprit (conclusion).',
    example: 'A food app studies past orders to predict how many biryanis each restaurant will sell on Friday night.',
  },
  'fds.u1.where': {
    summary: 'Data science is used almost everywhere: banks, hospitals, governments, elections, cities, schools and libraries.',
    picture: [{ tree: { root: 'Data science is used in', kids: ['Finance', 'Healthcare', 'Public policy', 'Politics', 'Urban planning', 'Education', 'Libraries'] } }],
    points: [
      'Finance: catching fraud and deciding loans.',
      'Healthcare: predicting disease and hospital demand.',
      'Education: finding students who need help early.',
    ],
    analogy: 'Like electricity: it is not one industry, it powers all of them.',
    example: 'A bank blocks a card when a ₹50,000 purchase suddenly happens in another country at 3 a.m.',
  },
  'fds.u1.related-fields': {
    summary: 'Data science borrows from **statistics** (theory), **computer science** (algorithms and code), **engineering** (big systems), **business analytics** (decisions) and **social science** (people).',
    picture: [{ table: { head: ['Field', 'Gives data science'], rows: [['Statistics', 'How to infer from data'], ['Computer science', 'How to compute at scale'], ['Engineering', 'Pipelines and systems'], ['Business', 'Decisions and value'], ['Social science', 'Understanding people']] } }],
    points: [
      'Statistics on small clean data + computing on big messy data = data science.',
      'Computational social science studies society with social media data.',
    ],
    analogy: 'Like a fusion dish: it takes the best ingredients from several cuisines.',
    example: 'Studying election mood from millions of tweets uses statistics, programming and social science together.',
  },
  'fds.u1.info-science': {
    summary: '**Data** is raw facts; **information** is data with meaning. Information science studies how **people** find and use information; data science provides the tools to analyse it.',
    picture: [{ flow: ['Data: 72, 65, 80', 'Information: class average is 72', 'Knowledge: Section B needs help', 'Wisdom: add extra classes'] }],
    points: [
      'Information science focuses on users and how they search.',
      '**iSchools** teach information, data and technology together.',
    ],
    analogy: 'Data is a heap of bricks; information is the bricks arranged into a wall you can use.',
    example: 'A library looks at what students search for but cannot find, then buys those books.',
  },
  'fds.u1.computational-thinking': {
    summary: '**Computational thinking** is solving problems like a computer scientist: break the problem down, spot patterns, ignore unneeded detail, and write clear steps.',
    picture: [{ flow: ['Decompose', 'Find patterns', 'Abstract', 'Write the algorithm'] }],
    points: [
      'Decomposition: split a big problem into small ones.',
      'Abstraction: keep only what matters.',
      'Useful even without a computer.',
    ],
    analogy: 'Like planning a wedding: split it into tasks (food, hall, cards), notice repeated jobs, skip details that do not matter, and make a checklist.',
    example: 'Finding the topper: compare each student\'s total with the best so far and keep the higher one.',
  },
  'fds.u1.skills-tools': {
    summary: 'A data scientist needs **maths and statistics**, **programming**, **data cleaning**, **visualisation**, **machine learning** and the ability to **explain** results, using tools like Python, R and SQL.',
    picture: [{ tree: { root: 'Toolbox', kids: ['Python (pandas, NumPy)', 'R', 'SQL', 'Excel', 'Jupyter', 'Tableau / Power BI'] } }],
    points: [
      'Communication matters: a result nobody understands is useless.',
      'Projects have roles: sponsor, client, data scientist, data architect, operations.',
    ],
    analogy: 'Like a chef: knife skills (programming), recipes (statistics), tasting (analysis) and plating (presentation) all matter.',
    example: 'An analyst pulls data with SQL, cleans it in pandas, models it with scikit-learn and presents a Power BI dashboard.',
  },
  'fds.u1.ethics': {
    summary: 'Data science must be **fair** (no bias), **private** (protect personal data) and **honest** (do not mislead). Biased data leads to unfair decisions.',
    picture: [{ tree: { root: 'Be careful about', kids: ['Bias in the data', 'Privacy of people', 'Honest reporting'] } }],
    points: [
      'Sampling bias: the data misses some groups.',
      'Ask for consent and remove names (anonymise).',
      'Follow laws like India\'s DPDP Act and the EU\'s GDPR.',
    ],
    analogy: 'Like a judge who has heard only one side of the story: the decision will be unfair however clever the judge is.',
    example: 'A hiring model trained on past hires that were mostly men may unfairly reject women, repeating the old bias.',
  },
  'fds.u1.data-types': {
    summary: '**Structured** data fits in tables. **Semi-structured** data has labels but no fixed table (JSON). **Unstructured** data has no format at all (text, photos, videos).',
    picture: [{ table: { head: ['Type', 'Example'], rows: [['Structured', 'Marks spreadsheet'], ['Semi-structured', 'JSON from an app'], ['Unstructured', 'WhatsApp photos, voice notes']] } }],
    points: [
      'Most of the world\'s data (about 80%) is unstructured.',
      'Unstructured data is hard to search and needs special tools (NLP, computer vision).',
    ],
    analogy: 'Structured data is a well-labelled filing cabinet; unstructured data is a big box of loose photos and letters.',
    example: 'A shop\'s sales table is structured; customer reviews written in their own words are unstructured.',
  },
  'fds.u1.collections': {
    summary: 'Data comes from **open data** portals, **social media**, and **multimodal** sources that mix text, images and sound. It is then **stored** and **presented** clearly.',
    picture: [{ flow: ['Collect (open data, APIs)', 'Store (CSV, database, cloud)', 'Present (charts, tables)'] }],
    points: [
      'Open data: free public datasets like data.gov.in.',
      'Social media data is collected through APIs and is fast and messy.',
      'Pick the right chart: bar to compare, line for trends, scatter for relationships.',
    ],
    analogy: 'Like cooking: buy ingredients (collect), keep them in the fridge (store), and serve them nicely on a plate (present).',
    example: 'Rainfall data from data.gov.in is saved as CSV and shown as a line chart of monthly rain.',
  },
  'fds.u1.cleaning': {
    summary: '**Data cleaning** fixes mistakes in raw data: fills missing values, smooths noise, removes duplicates and makes formats consistent.',
    picture: [{ table: { head: ['Problem', 'Fix'], rows: [['Missing value', 'Fill with mean or median'], ['Noise', 'Smooth with binning'], ['Duplicates', 'Remove'], ['"Hyd" vs "Hyderabad"', 'Make the same']] } }],
    points: [
      'Dirty data gives wrong answers ("garbage in, garbage out").',
      'Cleaning often takes most of a project\'s time.',
    ],
    analogy: 'Like washing and cutting vegetables before cooking: skip it and the dish is ruined.',
    example: 'Prices 4, 8, 15 in one bin are smoothed to their mean 9, 9, 9.',
  },
  'fds.u1.integration': {
    summary: '**Data integration** combines data from different sources into one dataset, matching columns that mean the same thing and fixing conflicts.',
    picture: [{ flow: ['Shop database', 'Website CSV', 'Match columns and IDs', 'One clean table'] }],
    points: [
      '"cust_id" and "customer_no" may be the same field.',
      'Remove duplicate records of the same customer.',
      'Fix conflicts: rupees vs dollars, different date formats.',
    ],
    analogy: 'Like merging two class attendance registers where one writes names in capitals and the other uses roll numbers.',
    example: 'Joining online and in-store sales into one table to see each customer\'s total spending.',
  },
  'fds.u1.transformation': {
    summary: '**Data transformation** changes data into a better form for analysis, especially **scaling** numbers to similar ranges so no column dominates.',
    picture: [{ flow: ['Raw value', 'Min-max: (v − min)/(max − min)', 'Value between 0 and 1'] }],
    points: [
      'Z-score: (value − mean) / standard deviation.',
      'Other transformations: aggregation (daily to monthly), generalisation (street to city), new columns (area = length × width).',
      'Scaling matters for distance-based models like k-means.',
    ],
    analogy: 'Like converting marks out of 50 and out of 100 to percentages so you can compare them fairly.',
    example: 'Marks 40 with min 20 and max 100 becomes (40 − 20) / 80 = 0.25.',
  },
  'fds.u1.reduction': {
    summary: '**Data reduction** makes data smaller but keeps its meaning: fewer columns, fewer rows, or compressed storage.',
    picture: [{ tree: { root: 'Make data smaller', kids: ['Fewer columns (PCA)', 'Fewer rows (sampling)', 'Compression'] } }],
    points: [
      'Faster analysis and less storage.',
      'A good sample represents the whole data.',
    ],
    analogy: 'Like writing short notes from a textbook: much shorter, but the key ideas remain.',
    example: 'Analysing a 10% random sample of a million transactions gives nearly the same averages, much faster.',
  },
  'fds.u1.discretization': {
    summary: '**Discretisation** turns continuous numbers into groups (bins), like turning exact ages into "child", "adult" and "senior".',
    picture: [{ flow: ['Age 5, 25, 67', 'Bins: 0–18, 18–60, 60+', 'child, adult, senior'] }],
    points: [
      '**Equal-width**: every bin covers the same range.',
      '**Equal-frequency**: every bin has the same number of values.',
      'pandas does it with pd.cut().',
    ],
    analogy: 'Like grading: exact marks become A, B, C bands.',
    example: 'Marks 0–100 split into 5 equal-width bins of 20 marks each.',
  },

  // ======================= UNIT II =======================
  'fds.u2.analysis-analytics': {
    summary: '**Data analysis** studies data to understand what happened. **Data analytics** is the bigger field that also predicts what will happen and suggests what to do.',
    picture: [{ flow: ['Descriptive: what happened?', 'Diagnostic: why?', 'Predictive: what next?', 'Prescriptive: what to do?'] }],
    points: [
      'Each step gives more value and is harder.',
      'Analysis looks back; analytics also looks forward.',
    ],
    analogy: 'Like a doctor: describe the symptoms, find the cause, predict how the illness will go, and prescribe medicine.',
    example: 'Sales fell (descriptive) because of a competitor\'s sale (diagnostic); they will fall 5% more (predictive); so give a discount (prescriptive).',
  },
  'fds.u2.descriptive': {
    summary: '**Descriptive analysis** summarises data: what kinds of variables there are, how often each value occurs (frequency distribution), and the typical value and spread.',
    picture: [{ table: { head: ['Marks', 'Students'], rows: [['0–40', '7'], ['40–60', '8'], ['60–80', '4'], ['80–100', '1']] } }],
    points: [
      'Categorical variables: nominal (colour) or ordinal (grade).',
      'Numerical variables: discrete (count) or continuous (height).',
      'Frequency tables become histograms and bar charts.',
    ],
    analogy: 'Like a cricket scorecard: it summarises the whole match in a few numbers.',
    example: 'In a class of 20, 8 students scored between 40 and 60, the most common band.',
  },
  'fds.u2.diagnostic': {
    summary: '**Diagnostic analytics** asks **why** something happened, by digging into details and finding things that change together (correlation).',
    picture: [{ flow: ['Sales dropped', 'Break down by city and product', 'Find related factors', 'Explain the cause'] }],
    points: [
      'Correlation goes from −1 (opposite) to +1 (together).',
      'Correlation is **not** causation: two things can move together because of a third.',
    ],
    analogy: 'Like a mechanic finding why the car will not start: check battery, fuel and spark plugs one by one.',
    example: 'Ice-cream sales and sunburns rise together, but hot weather causes both.',
  },
  'fds.u2.predictive-prescriptive': {
    summary: '**Predictive analytics** guesses what will happen next using past data. **Prescriptive analytics** recommends what to do about it.',
    picture: [{ flow: ['Past data', 'Model predicts', 'Optimiser recommends action'] }],
    points: [
      'Predictive: regression, classification, forecasting.',
      'Prescriptive: optimisation, simulation.',
    ],
    analogy: 'A weather forecast is predictive; "carry an umbrella" is prescriptive.',
    example: 'The model says a customer will likely cancel; the system suggests offering a free month.',
  },
  'fds.u2.exploratory-mechanistic': {
    summary: '**Exploratory analysis** looks at data with summaries and plots to find patterns. **Mechanistic analysis** finds the exact relationship, usually with **regression** (a best-fit line).',
    picture: [{ flow: ['Plot and summarise (EDA)', 'Spot a pattern', 'Fit y = b₀ + b₁x', 'Explain how x changes y'] }],
    points: [
      'EDA tools: describe(), histogram, box plot, scatter plot.',
      'Regression slope b₁ tells how much y changes when x goes up by 1.',
    ],
    analogy: 'EDA is looking around a new city; mechanistic analysis is measuring exactly how long each road takes.',
    example: 'x = 1..5, y = 2, 4, 5, 4, 5 gives the line y = 2.2 + 0.6x.',
  },
  'fds.u2.attributes': {
    summary: 'An **attribute** is a property of something, like a student\'s name, grade or height. Attributes can be **nominal**, **binary**, **ordinal**, or **numeric** (interval, ratio).',
    picture: [{ table: { head: ['Type', 'Example'], rows: [['Nominal', 'City'], ['Binary', 'Pass / fail'], ['Ordinal', 'Grade A, B, C'], ['Interval', 'Temperature °C'], ['Ratio', 'Height, salary']] } }],
    points: [
      'Ordinal has order but unknown gaps.',
      'Ratio has a true zero, so "twice as much" makes sense.',
      'Discrete = countable; continuous = any value in a range.',
    ],
    analogy: 'Like a student ID card: name (nominal), year (ordinal), height (ratio).',
    example: 'A salary of ₹40,000 is twice ₹20,000 (ratio), but 40 °C is not "twice as hot" as 20 °C (interval).',
  },
  'fds.u2.central-tendency': {
    summary: 'The **centre** of data is its typical value: the **mean** (average), the **median** (middle value) or the **mode** (most common value).',
    picture: [{ table: { head: ['Data: 2 4 4 4 5 5 7 9', 'Value'], rows: [['Mean', '5'], ['Median', '4.5'], ['Mode', '4']] } }],
    points: [
      'The mean is pulled by outliers; the median is not.',
      'Use the median for salaries and house prices.',
      'Use the mode for categories (most popular colour).',
    ],
    analogy: 'If Mukesh Ambani walks into a tea stall, the average wealth jumps, but the median customer is still the same.',
    example: 'Adding 100 to the data 2, 4, 4, 4, 5, 5, 7, 9 moves the mean from 5 to 15.6, but the median only from 4.5 to 5.',
  },
  'fds.u2.dispersion': {
    summary: '**Dispersion** tells how spread out the data is: **range**, **interquartile range (IQR)**, **variance** and **standard deviation**.',
    picture: [{ flow: ['Min', 'Q1', 'Median', 'Q3', 'Max'], label: 'A box plot in words' }],
    points: [
      'Standard deviation = typical distance from the mean.',
      'IQR = Q3 − Q1, the spread of the middle half.',
      'Outliers lie beyond 1.5 × IQR from the box.',
    ],
    analogy: 'Two classes can both average 60, but one has everyone near 60 and the other has 20s and 100s. Dispersion shows the difference.',
    example: 'For 2, 4, 4, 4, 5, 5, 7, 9: range 7, variance 4, standard deviation 2, IQR 2.',
  },
  'fds.u2.skew-kurtosis': {
    summary: '**Skewness** says whether data leans to one side. **Kurtosis** says how many extreme values (heavy tails) there are compared with a normal bell curve.',
    picture: [{ table: { head: ['Shape', 'Mean vs median'], rows: [['Right-skewed (long right tail)', 'Mean > median'], ['Symmetric', 'Equal'], ['Left-skewed (long left tail)', 'Mean < median']] } }],
    points: [
      'Income is right-skewed: most earn a little, a few earn a lot.',
      'Heavy tails (high kurtosis) mean more extreme events.',
    ],
    analogy: 'Skewness is like a seesaw tilted to one side; kurtosis is how fat the ends of the seesaw are.',
    example: 'In a very easy exam most students score 80 to 100, so the marks are left-skewed.',
  },
  'fds.u2.covariance-correlation': {
    summary: '**Covariance** shows if two things move together. **Correlation** measures how strongly, from −1 to +1: **Pearson** for straight-line links, **Spearman** for ranks.',
    picture: [{ flow: ['−1: perfect opposite', '0: no link', '+1: perfect together'] }],
    points: [
      'Pearson needs numeric, roughly normal data and is hurt by outliers.',
      'Spearman uses ranks, so it suits ordered data and outliers.',
      'Spearman: ρ = 1 − 6Σd² / (n(n² − 1)).',
    ],
    analogy: 'Like two friends\' moods: if they are always happy and sad together, their correlation is close to +1.',
    example: 'x = 1..5 and y = 2, 4, 5, 4, 5 give Pearson r ≈ 0.77; rank differences with Σd² = 4 for 5 students give Spearman ρ = 0.8.',
  },
  'fds.u2.sampling-tests': {
    summary: 'A **sample** is a small group chosen to represent everyone. **Parametric tests** (t-test, z-test, ANOVA) compare averages, assuming the data is roughly normal.',
    picture: [{ tree: { root: 'Sampling methods', kids: ['Simple random', 'Stratified', 'Systematic', 'Cluster'] } }],
    points: [
      'A random sample avoids bias.',
      'A random number column (0 to 1) can split data into groups, such as 80% train and 20% test.',
      'If data is not normal, use non-parametric tests.',
    ],
    analogy: 'Like tasting one spoon of soup to judge the whole pot: stir well first (random sampling).',
    example: 'df.sample(frac=0.2) picks a random 20% of rows for testing.',
  },
  'fds.u2.distributions': {
    summary: 'A **distribution** describes how values are spread. Four common ones: **uniform** (all equal), **normal** (bell curve), **exponential** (waiting times), **binomial** (number of successes).',
    picture: [{ table: { head: ['Distribution', 'Everyday example'], rows: [['Uniform', 'Rolling a fair die'], ['Normal', 'Heights of students'], ['Exponential', 'Waiting for the next bus'], ['Binomial', 'Heads in 5 coin tosses']] } }],
    points: [
      'Normal: 68% within 1 SD, 95% within 2 SD, 99.7% within 3 SD.',
      'Binomial: P(k) = C(n, k) p^k (1 − p)^(n − k).',
      'Exponential: P(wait > t) = e^(−λt).',
    ],
    analogy: 'Distributions are like shapes of crowds: evenly spread (uniform), bunched in the middle (normal), or mostly near the door (exponential).',
    example: 'Probability of exactly 2 heads in 5 tosses = 10/32 = 0.3125.',
  },
  'fds.u2.cdf': {
    summary: 'The **CDF** gives the chance of getting a value **up to** x: F(x) = P(X ≤ x). It rises from 0 to 1. **Descriptive statistics** summarise data by centre, spread and shape.',
    picture: [{ flow: ['F(1) = 1/6', 'F(3) = 3/6', 'F(6) = 1'], label: 'CDF of a fair die' }],
    points: [
      'P(a < X ≤ b) = F(b) − F(a).',
      'The median is where F(x) = 0.5.',
      'df.describe() gives count, mean, std, min, quartiles and max.',
    ],
    analogy: 'Like a running total of marks: it only goes up, and reaches the full total at the end.',
    example: 'For a die, P(X ≤ 3) = 0.5.',
  },

  // ======================= UNIT III =======================
  'fds.u3.numpy-arrays': {
    summary: 'A **NumPy array** is a fast grid of numbers, all of the same type. It does maths on whole arrays at once, much faster than Python lists.',
    picture: [{ table: { head: ['Create with', 'Gives'], rows: [['np.array([1, 2, 3])', '[1 2 3]'], ['np.zeros((2, 3))', '2 × 3 of zeros'], ['np.arange(0, 10, 2)', '[0 2 4 6 8]'], ['np.linspace(0, 1, 5)', '5 evenly spaced numbers']] } }],
    points: [
      'Attributes: ndim, shape, size, dtype.',
      'Types: int64, float64, bool, complex…',
      'One type per array keeps it compact and fast.',
    ],
    analogy: 'A list is a bag of mixed items; a NumPy array is an egg tray where every slot holds the same kind of thing.',
    example: 'np.array([1, 2, 3]) * 2 gives [2 4 6] with no loop.',
  },
  'fds.u3.shapes': {
    summary: 'You can change an array\'s **shape** without changing its data: reshape it into rows and columns, flatten it back to one line, or transpose it.',
    picture: [{ flow: ['arange(12)', 'reshape(3, 4)', 'transpose → (4, 3)', 'ravel → 12 again'] }],
    points: [
      'The total number of elements must stay the same.',
      'reshape(2, -1) lets NumPy work out the missing size.',
      'ravel gives a view; flatten gives a copy.',
    ],
    analogy: 'Like rearranging 12 chairs into 3 rows of 4 or 4 rows of 3: same chairs, new layout.',
    example: 'np.arange(12).reshape(3, 4) makes a 3 × 4 table of 0 to 11.',
  },
  'fds.u3.stacking-splitting': {
    summary: '**Stacking** joins arrays together (side by side or on top). **Splitting** cuts an array into pieces.',
    picture: [{ table: { head: ['Function', 'Does'], rows: [['hstack', 'Join side by side'], ['vstack', 'Join on top'], ['dstack', 'Join in depth'], ['hsplit / vsplit', 'Cut into column / row blocks']] } }],
    points: [
      'concatenate(axis=0) is the same as vstack.',
      'Arrays must have matching sizes along the joined edge.',
    ],
    analogy: 'Like joining sheets of paper side by side or piling them up, and cutting a sheet into strips.',
    example: 'hstack of [[1,2],[3,4]] and [[5,6],[7,8]] gives [[1,2,5,6],[3,4,7,8]].',
  },
  'fds.u3.dtype-views': {
    summary: '**astype()** changes an array\'s number type. A **view** shares the same data (changing it changes the original); a **copy** is fully separate.',
    picture: [{ compare: [{ title: 'View', items: ['Same data', 'Changes affect original', 'Slicing makes one'] }, { title: 'Copy', items: ['Own data', 'Changes stay separate', 'copy() makes one'] }] }],
    points: [
      'astype(int) cuts off decimals: 1.7 → 1.',
      'Slicing gives a view; fancy indexing gives a copy.',
    ],
    analogy: 'A view is a window into the same room; a copy is a photo of the room that you can draw on freely.',
    example: 'v = b[1:4]; v[0] = 99 also changes b[1] to 99.',
  },
  'fds.u3.slicing-indexing': {
    summary: 'Pick parts of an array by **slicing** (ranges of rows and columns), by a **condition** (boolean indexing), or by a **list of positions** (fancy indexing).',
    picture: [{ table: { head: ['Code', 'Picks'], rows: [['a[1, 2]', 'Row 1, column 2'], ['a[0:2, 1:3]', 'A block'], ['a[a > 5]', 'Values above 5'], ['a[[0, 2]]', 'Rows 0 and 2']] } }],
    points: [
      'a[:, 0] gives the whole first column.',
      'a[a % 2 == 0] = 0 sets every even value to 0.',
    ],
    analogy: 'Slicing is cutting a slice of cake; boolean indexing is picking only the pieces with cherries; fancy indexing is choosing pieces 1 and 3 by number.',
    example: 'For a = arange(12).reshape(3, 4), a[a > 5] gives [6 7 8 9 10 11].',
  },
  'fds.u3.broadcasting': {
    summary: '**Broadcasting** lets NumPy add or multiply arrays of different shapes by stretching the smaller one, as long as the shapes are compatible.',
    picture: [{ flow: ['(3, 4) array', '+ (4,) row', '= row added to every row'] }],
    points: [
      'Compare shapes from the right: sizes must be equal or 1.',
      'A scalar works with any array.',
      '(3, 4) + (3,) fails: 4 and 3 do not match.',
    ],
    analogy: 'Like a teacher adding 5 grace marks to every student\'s score at once instead of one by one.',
    example: 'np.ones((3, 1)) + np.arange(4) gives a 3 × 4 array.',
  },
  'fds.u3.dataframes': {
    summary: 'A **DataFrame** is a pandas table: rows with an index and named columns, each column possibly a different type. It is like a spreadsheet you control with code.',
    picture: [{ table: { head: ['', 'name', 'marks', 'pass'], rows: [['0', 'Ravi', '78', 'True'], ['1', 'Anu', '64', 'True']] } }],
    points: [
      'Create from a dict, list of lists, CSV (read_csv) or Excel.',
      'df.head(), df.shape, df.columns show its structure.',
    ],
    analogy: 'Like an Excel sheet that also does maths and filtering when you tell it to.',
    example: "pd.DataFrame({'name': ['Ravi', 'Anu'], 'marks': [78, 64]}) makes a 2-row table.",
  },
  'fds.u3.series': {
    summary: 'A **Series** is one labelled column of data. A DataFrame is several Series sharing the same index.',
    picture: [{ table: { head: ['Index', 'Value'], rows: [['a', '10'], ['b', '20'], ['c', '30']] } }],
    points: [
      'Like a NumPy array with labels.',
      'df["marks"] returns a Series.',
    ],
    analogy: 'A Series is one column of a register; a DataFrame is the whole register.',
    example: "pd.Series([10, 20, 30], index=['a', 'b', 'c'])['b'] gives 20.",
  },
  'fds.u3.quandl': {
    summary: '**Quandl** (now Nasdaq Data Link) provides financial and economic datasets that can be loaded straight into a pandas DataFrame and then queried.',
    picture: [{ flow: ['API key', 'quandl.get("dataset")', 'DataFrame', 'Filter and analyse'] }],
    points: [
      'Data usually comes indexed by date.',
      'Query with conditions, date ranges and column selection.',
    ],
    analogy: 'Like a library of financial data that delivers any book (dataset) to your desk on request.',
    example: "df = quandl.get('WIKI/AAPL'); df[df['Close'] > 150] shows the days Apple closed above 150.",
  },
  'fds.u3.describe': {
    summary: '**Describing** a DataFrame means quickly checking its size, column types, missing values and basic statistics before analysing it.',
    picture: [{ table: { head: ['Method', 'Tells you'], rows: [['shape', 'Rows and columns'], ['info()', 'Types and missing values'], ['describe()', 'Mean, std, min, quartiles, max'], ['head()', 'First rows']] } }],
    points: [
      'Summary statistics reveal errors (negative ages), outliers and missing data.',
      'value_counts() summarises categories.',
    ],
    analogy: 'Like reading a book\'s back cover and contents page before reading it.',
    example: 'describe() shows min age −1, revealing a data-entry error.',
  },
  'fds.u3.group-join': {
    summary: '**groupby** splits rows into groups and summarises each (split, apply, combine). **merge/join** combines two tables on a common key, like SQL joins.',
    picture: [{ flow: ['Split rows by city', 'Apply mean to each group', 'Combine into one result'] }],
    points: [
      'Joins: inner (matches only), left, right, outer (everything).',
      'concat stacks tables on top of each other or side by side.',
    ],
    analogy: 'groupby is sorting students by section and averaging each section\'s marks; merge is matching the marks list with the address list by roll number.',
    example: "df.groupby('city')['sales'].sum() gives total sales per city.",
  },
  'fds.u3.missing-pandas': {
    summary: 'pandas marks missing data as **NaN**. Find it with isnull(), remove it with dropna(), or fill it with fillna().',
    picture: [{ flow: ['isnull().sum()', 'dropna() or fillna()', 'Clean data'] }],
    points: [
      'fillna(df.mean()) fills with the column average.',
      'ffill copies the previous value forward.',
    ],
    analogy: 'Like an attendance sheet with blank boxes: you either drop those days or fill them with a reasonable guess.',
    example: "df['age'].fillna(df['age'].median()) fills missing ages with the median age.",
  },
  'fds.u3.pivot': {
    summary: 'A **pivot table** reshapes data into a grid: one column\'s values become rows, another\'s become columns, and the cells show a summary like the average.',
    picture: [{ table: { head: ['', 'Q1', 'Q2'], rows: [['North', '120', '150'], ['South', '90', '110']] } }],
    points: [
      "pd.pivot_table(df, values='sales', index='region', columns='quarter', aggfunc='sum').",
      'Great for quick cross-tab summaries.',
    ],
    analogy: 'Like turning a long shopping receipt into a neat table of "what was bought in which month".',
    example: 'Sales by region (rows) and quarter (columns), with total sales in each cell.',
  },
  'fds.u3.dates': {
    summary: 'pandas turns text dates into real **datetime** values so you can pull out the year or weekday, filter by date, and **resample** (daily to monthly).',
    picture: [{ flow: ['"2025-11-14" (text)', 'pd.to_datetime', 'dt.month, dt.day_name()', 'resample("M").sum()'] }],
    points: [
      'pd.date_range makes a sequence of dates.',
      'A date index makes time-series analysis easy.',
    ],
    analogy: 'Like converting "next Friday" in a note into an actual calendar date you can count from.',
    example: "df.resample('M')['sales'].sum() gives monthly totals from daily sales.",
  },

  // ======================= UNIT IV =======================
  'fds.u4.cleaning': {
    summary: '**Data cleaning** turns messy data into reliable data: explore it, filter out noisy rows and useless columns, and fix formats and duplicates.',
    picture: [{ flow: ['Explore (head, describe)', 'Column-wise filtering', 'Row-wise filtering', 'Fix types and duplicates'] }],
    points: [
      'Column-wise: drop columns that are mostly empty or useless.',
      'Row-wise: drop rows with impossible values.',
    ],
    analogy: 'Like sorting a pile of exam papers: remove blank ones, fix wrongly filled names, and drop duplicates.',
    example: 'Dropping rows where age > 120 removes data-entry errors.',
  },
  'fds.u4.missing': {
    summary: 'Missing values are either **dropped** (if few) or **filled** (imputed) with something sensible like the mean, median or most common value.',
    picture: [{ tree: { root: 'Missing value?', kids: ['Drop the row', 'Drop the column', 'Fill with mean / median / mode', 'Fill forward / backward', 'Predict it'] } }],
    points: [
      'Dropping too much loses information.',
      'Filling with the mean reduces variation.',
    ],
    analogy: 'Like a missing piece in a jigsaw: leave the gap, or cut a piece that roughly fits.',
    example: '5 of 1000 rows missing income: drop them. 40% missing: fill or drop the column.',
  },
  'fds.u4.outliers': {
    summary: '**Outliers** are values far from the rest. Find them with box plots, the **IQR rule** or **z-scores**, then decide whether they are errors or real.',
    picture: [{ flow: ['Q1 − 1.5 IQR', 'normal range', 'Q3 + 1.5 IQR', 'outside = outlier'] }],
    points: [
      'z-score above 3 or below −3 is often treated as an outlier.',
      'Errors are removed; real extremes may be kept or capped.',
    ],
    analogy: 'Like one 7-foot student in a class photo: either a mistake in the record, or a genuinely tall basketball player.',
    example: 'Q1 = 4, Q3 = 6, IQR = 2: anything below 1 or above 9 is an outlier.',
  },
  'fds.u4.encoding': {
    summary: 'Models need numbers, so text categories are **encoded**: **one-hot** makes a 0/1 column per category, **label/ordinal** encoding gives each category a number.',
    picture: [{ table: { head: ['City', 'Hyd', 'Delhi', 'Mumbai'], rows: [['Hyd', '1', '0', '0'], ['Delhi', '0', '1', '0']] } }],
    points: [
      'One-hot for categories with no order (city).',
      'Ordinal encoding for ordered categories (low = 1, medium = 2, high = 3).',
    ],
    analogy: 'Like turning "small, medium, large" T-shirt sizes into 1, 2, 3 for a vending machine.',
    example: 'pd.get_dummies(df["city"]) makes one column per city.',
  },
  'fds.u4.correlation': {
    summary: '**Correlation** measures how two numbers move together. **Univariate** analysis studies one variable, **bivariate** two, and **multivariate** many at once.',
    picture: [{ flow: ['Univariate: histogram', 'Bivariate: scatter plot', 'Multivariate: heatmap'] }],
    points: [
      'df.corr() gives a correlation matrix.',
      'A heatmap shows strong links in bright colours.',
    ],
    analogy: 'Univariate is studying one student; bivariate is comparing two friends; multivariate is understanding the whole class.',
    example: 'Hours studied and marks show r = 0.8: strongly related.',
  },
  'fds.u4.titanic': {
    summary: 'The **Titanic dataset** is the classic practice set for multivariate analysis: who survived, and did sex, class, age or fare matter?',
    picture: [{ table: { head: ['Group', 'Survival'], rows: [['Women', 'About 74%'], ['Men', 'About 19%'], ['1st class', 'About 63%'], ['3rd class', 'About 24%']] } }],
    points: [
      'Group by sex and class together to see combined effects.',
      'Women in 1st class had the best chance.',
    ],
    analogy: 'Like asking which factors helped students pass: attendance, coaching, or both together.',
    example: "df.groupby(['Sex', 'Pclass'])['Survived'].mean() shows survival by sex and class.",
  },
  'fds.u4.hypothesis': {
    summary: '**Hypothesis testing** uses a sample to decide if there is enough evidence against a default claim (the **null hypothesis**).',
    picture: [{ flow: ['State H₀ and H₁', 'Choose α (0.05)', 'Compute test statistic and p-value', 'p < α: reject H₀'] }],
    points: [
      'Type I error: rejecting a true H₀. Type II: keeping a false H₀.',
      'A small p-value means the result is unlikely if H₀ were true.',
    ],
    analogy: 'Like a court: assume innocent (H₀) unless the evidence is strong enough (p < 0.05).',
    example: 'H₀: average reading time is 30 minutes. A sample gives p = 0.02, so reject H₀.',
  },
  'fds.u4.ttest': {
    summary: 'A **t-test** checks whether a mean, or the difference between two means, is significant, when samples are small.',
    picture: [{ tree: { root: 't-tests', kids: ['One-sample', 'Independent two-sample', 'Paired'] } }],
    points: [
      'One-sample: compare with a known value.',
      'Two-sample: two separate groups.',
      'Paired: the same people before and after.',
    ],
    analogy: 'Like checking whether a new coaching class really improved marks, or the change was just luck.',
    example: 'stats.ttest_1samp(times, 30) tests whether the average reading time differs from 30 minutes.',
  },

  // ======================= UNIT V =======================
  'fds.u5.linear': {
    summary: '**Linear regression** predicts a number by fitting a straight line: y = β₀ + β₁x. **Multiple** linear regression uses several inputs.',
    picture: [{ flow: ['Inputs x', 'Fit the best line', 'Predict y'] }],
    points: [
      'The line minimises the squared errors (least squares).',
      'β₁ = how much y changes when x increases by 1.',
    ],
    analogy: 'Like estimating a taxi fare from distance: a fixed start charge plus a rate per km.',
    example: 'Predicting house price from area: price = 5 lakh + 4,000 × square feet.',
  },
  'fds.u5.multicollinearity': {
    summary: '**Multicollinearity** is when input variables are strongly related to each other, which makes the regression coefficients unstable.',
    picture: [{ flow: ['Check correlation / VIF', 'VIF > 5 or 10 = problem', 'Drop or combine one variable'] }],
    points: [
      'VIF (variance inflation factor) measures it.',
      'Fix: remove a variable, combine them, or use PCA.',
    ],
    analogy: 'Like two witnesses who always say the same thing: you cannot tell which one actually saw it.',
    example: 'Height in cm and height in inches together in one model are perfectly collinear.',
  },
  'fds.u5.dummy': {
    summary: '**Dummy variables** turn a category into 0/1 columns for regression. Drop one category to avoid the **dummy variable trap**.',
    picture: [{ table: { head: ['City', 'is_Delhi', 'is_Mumbai'], rows: [['Hyd', '0', '0'], ['Delhi', '1', '0'], ['Mumbai', '0', '1']] } }],
    points: [
      'With k categories, use k − 1 dummies.',
      'The dropped one is the baseline.',
    ],
    analogy: 'Like a light switch board where "all off" also means something: you do not need a separate switch for it.',
    example: 'pd.get_dummies(df, drop_first=True).',
  },
  'fds.u5.model-dev': {
    summary: 'Building a regression model follows fixed steps: load and clean data, choose features, split into train and test, fit, predict and evaluate.',
    picture: [{ flow: ['Load', 'Clean', 'Pick features', 'Train/test split', 'Fit', 'Predict', 'Evaluate'] }],
    points: [
      'Never evaluate on the training data alone.',
      'scikit-learn: train_test_split, LinearRegression().fit().',
    ],
    analogy: 'Like preparing for an exam with practice papers (training) and checking yourself on a new paper (testing).',
    example: 'An 80/20 split trains on 800 rows and tests on 200.',
  },
  'fds.u5.metrics': {
    summary: 'Regression is judged by how close predictions are to real values: **MAE**, **MSE** and **RMSE** measure error; **R²** measures how much of the variation the model explains.',
    picture: [{ table: { head: ['Metric', 'Meaning'], rows: [['MAE', 'Average absolute error'], ['MSE', 'Average squared error'], ['RMSE', '√MSE, in original units'], ['R²', '0 to 1, higher is better']] } }],
    points: [
      'MSE punishes big errors more than MAE.',
      'R² = 0.8 means 80% of the variation is explained.',
    ],
    analogy: 'Like checking how far your guesses of people\'s ages were: on average, and with big misses counted extra.',
    example: 'Errors 2, −2, 4: MAE = 2.67, MSE = 8, RMSE ≈ 2.83.',
  },
  'fds.u5.polynomial': {
    summary: '**Polynomial regression** fits a curve by adding x², x³… as extra inputs, so a linear model can follow a bend.',
    picture: [{ flow: ['x', 'Add x², x³', 'Linear regression on these', 'A curved fit'] }],
    points: [
      'Too high a degree overfits (wiggly curve).',
      'PolynomialFeatures(degree=2) in scikit-learn.',
    ],
    analogy: 'Like bending a straight ruler into a flexible curve to trace a hill.',
    example: 'Car fuel use vs speed is U-shaped: a degree-2 polynomial fits it well.',
  },
  'fds.u5.logistic': {
    summary: '**Logistic regression** predicts a yes/no class. It squeezes a linear score through the **sigmoid** function to get a probability between 0 and 1.',
    picture: [{ flow: ['Score = b₀ + b₁x', 'Sigmoid 1/(1 + e^(−score))', 'Probability', '≥ 0.5 → class 1'] }],
    points: [
      'Types: binary, multinomial, ordinal.',
      'Simple and interpretable, but assumes a linear boundary.',
    ],
    analogy: 'Like a dimmer that turns any score into a percentage chance, then a switch at 50%.',
    example: 'Predicting pass/fail from hours studied: 6 hours gives 0.85, so "pass".',
  },
  'fds.u5.pca': {
    summary: '**PCA** turns many related columns into a few new ones (principal components) that keep most of the data\'s variation.',
    picture: [{ flow: ['Standardise', 'Covariance matrix', 'Eigenvectors and eigenvalues', 'Keep top components', 'Project data'] }],
    points: [
      'Components are uncorrelated.',
      'The first component captures the most variation.',
    ],
    analogy: 'Like taking a photo of a 3-D object from the angle that shows the most detail.',
    example: '50 survey questions reduced to 5 components that still explain 85% of the variation.',
  },
  'fds.u5.num-clusters': {
    summary: 'To choose the number of clusters k: the **elbow method** looks for where adding clusters stops helping much; the **silhouette method** picks the k with the best separation score.',
    picture: [{ flow: ['Try k = 1 to 10', 'Plot WCSS', 'Find the elbow', 'Choose k'] }],
    points: [
      'Silhouette ranges from −1 to 1; higher is better.',
      'Both are guides, not exact answers.',
    ],
    analogy: 'Like deciding how many sections a class needs: add sections until splitting further barely helps.',
    example: 'WCSS drops sharply until k = 3 and then flattens, so k = 3.',
  },
  'fds.u5.kmeans': {
    summary: '**K-means** groups data into k clusters: assign each point to its nearest centre, move each centre to the average of its points, repeat until nothing changes.',
    picture: [{ flow: ['Pick k centres', 'Assign each point to the nearest', 'Move centres to the mean'], loop: 'Repeat until the centres stop moving' }],
    points: [
      'Needs k in advance.',
      'Sensitive to the starting centres and to scaling.',
    ],
    analogy: 'Like placing 3 ice-cream stalls in a park: people go to the nearest, then each stall moves to the middle of its customers.',
    example: 'Customers grouped by spending and visits into 3 segments: budget, regular, premium.',
  },
  'fds.u5.hierarchical': {
    summary: '**Hierarchical clustering** builds a tree of clusters (a **dendrogram**). **Agglomerative** starts with every point alone and merges; **divisive** starts with one group and splits.',
    picture: [{ flow: ['Each point is a cluster', 'Merge the two closest', 'Repeat', 'Cut the tree at the chosen height'] }],
    points: [
      'No need to choose k in advance.',
      'Linkage: single, complete, average, Ward.',
    ],
    analogy: 'Like a family tree: individuals join into families, families into clans.',
    example: 'Grouping animals by features gives a tree where cats and lions join before cats and dogs.',
  },
  'fds.u5.dbscan': {
    summary: '**DBSCAN** finds clusters as crowded areas of points. It uses a radius (eps) and a minimum number of neighbours, and marks lonely points as noise.',
    picture: [{ tree: { root: 'DBSCAN points', kids: ['Core: enough neighbours', 'Border: near a core', 'Noise: alone'] } }],
    points: [
      'Finds clusters of any shape.',
      'No need to give k; handles outliers.',
    ],
    analogy: 'Like spotting groups of friends at a party by who is standing close together, while people standing alone are not in any group.',
    example: 'GPS points of taxis reveal busy pickup zones; stray points are noise.',
  },
  'fds.u5.spectral': {
    summary: '**Spectral clustering** builds a "who is similar to whom" graph, uses its eigenvectors to re-arrange the points, then runs k-means in that new space.',
    picture: [{ flow: ['Similarity graph', 'Graph Laplacian', 'Eigenvectors', 'k-means on them'] }],
    points: [
      'Handles curved, non-round clusters.',
      'Costly for very large data.',
    ],
    analogy: 'Like grouping people by friendship links instead of by where they stand.',
    example: 'Two interlocking half-moon shapes are separated correctly, which k-means fails at.',
  },
  'fds.u5.cluster-metrics': {
    summary: 'Clusters are judged **internally** (are they tight and well separated? Davies-Bouldin, silhouette) or **externally** against true labels (Rand, Jaccard, Fowlkes-Mallows).',
    picture: [{ table: { head: ['Metric', 'Better when'], rows: [['Silhouette', 'Higher (near 1)'], ['Davies-Bouldin', 'Lower'], ['Rand / Jaccard', 'Higher (match true labels)']] } }],
    points: [
      'Internal metrics need no labels.',
      'External metrics need the true groups.',
    ],
    analogy: 'Like grading group seating: are friends sitting together and apart from strangers (internal), and does it match the teacher\'s seating plan (external)?',
    example: 'Silhouette 0.7 means clusters are well separated.',
  },
}
