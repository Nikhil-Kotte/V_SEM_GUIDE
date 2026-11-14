// Fundamentals of Data Science, Unit I: introduction, data and pre-processing. Keys are syllabus ids.
export default {
  'fds.u1.what': {
    oneLine: 'Data science is the field of collecting, cleaning, analysing and communicating data to answer questions and make decisions, combining statistics, computing and domain knowledge.',
    blocks: [
      '**Data science** turns raw data into useful knowledge. It sits where **statistics**, **computer science** and **domain (subject) knowledge** meet.',
      { flow: ['Ask a question', 'Collect data', 'Clean and prepare', 'Explore and analyse', 'Model', 'Communicate results', 'Act on them'], loop: 'New questions lead back to the start' },
      { h: 'The data science project life cycle' },
      { table: { head: ['Stage', 'What happens'], rows: [
        ['Define the goal', 'Understand the business problem and what success means'],
        ['Collect and manage data', 'Find sources, load and store the data'],
        ['Prepare (clean, transform)', 'Fix errors, missing values, formats'],
        ['Explore', 'Summaries, plots, patterns'],
        ['Model', 'Build and validate predictive or descriptive models'],
        ['Present and deploy', 'Report to stakeholders, put the model to use, maintain it'],
      ] } },
      { h: 'Why now?' },
      'Huge amounts of data (phones, sensors, the web), cheap storage, fast computers and free tools (Python, R) make it possible for almost every field to learn from data.',
    ],
    terms: [['Data science', 'Extracting knowledge and insight from data using statistics, computing and domain knowledge.'], ['Domain knowledge', 'Understanding of the field the data comes from (medicine, finance…).']],
    exam: 'Define data science, draw the Venn of statistics, computing and domain knowledge, and draw the project life cycle.',
    revise: ['Stats + computing + domain', 'Question, collect, clean, explore, model, communicate'],
  },

  'fds.u1.where': {
    oneLine: 'Data science is used everywhere: finance, public policy, politics, healthcare, urban planning, education and libraries all make better decisions with data.',
    blocks: [
      { table: { head: ['Field', 'How data science helps', 'Example'], rows: [
        ['Finance', 'Fraud detection, credit scoring, algorithmic trading', 'A bank flags an unusual card payment'],
        ['Public policy', 'Evidence-based policies, targeting benefits', 'Choosing villages for a water scheme'],
        ['Politics', 'Voter analysis, campaign targeting, opinion polls', 'Predicting swing constituencies'],
        ['Healthcare', 'Diagnosis support, outbreak tracking, drug trials', 'Predicting hospital bed demand'],
        ['Urban planning', 'Traffic flows, smart cities, utilities', 'Timing traffic lights from sensor data'],
        ['Education', 'Learning analytics, early warning for dropouts', 'Spotting students at risk of failing'],
        ['Libraries', 'Recommending books, managing collections', 'Suggesting books based on borrowing history'],
      ] } },
    ],
    terms: [['Learning analytics', 'Using student data to improve learning and teaching.']],
    exam: 'Make a table of at least five fields with one use and one concrete example each.',
    revise: ['Finance, policy, politics, health, cities, education, libraries'],
  },

  'fds.u1.related-fields': {
    oneLine: 'Data science borrows from and differs from statistics, computer science, engineering, business analytics and social science; it combines their methods to work with large, messy, real-world data.',
    blocks: [
      { table: { head: ['Field', 'Relationship to data science'], rows: [
        ['Statistics', 'Gives the theory (sampling, inference, models); data science adds large-scale computing and messy data'],
        ['Computer science', 'Gives algorithms, databases, programming, machine learning'],
        ['Engineering', 'Gives systems to collect, store and process data at scale (pipelines, sensors)'],
        ['Business analytics', 'Uses data to improve business decisions; data science is broader and more technical'],
        ['Social science', 'Studies people and society; computational social science uses big data (social media) to study behaviour'],
      ] } },
      { tip: 'One line to remember: statistics asks "what can we infer?", computer science asks "how do we compute it?", and data science asks both, for a real decision.' },
    ],
    terms: [['Computational social science', 'Studying social behaviour with large-scale digital data and computing.']],
    exam: 'For each related field write one line on what it gives to data science and how they differ.',
    revise: ['Statistics: inference', 'CS: algorithms', 'Engineering: pipelines', 'Business: decisions', 'Social science: people'],
  },

  'fds.u1.info-science': {
    oneLine: 'Information science studies how information is created, organised and used by people; data science overlaps with it, and iSchools teach both together.',
    blocks: [
      { compare: [
        { title: 'Information', items: ['Data given meaning and context', 'Organised for people to use', '"Average marks in Section A are 72"'] },
        { title: 'Data', items: ['Raw facts and numbers', 'No meaning on its own', '"72, 65, 80, 91"'] },
      ] },
      { flow: ['Data', 'Information', 'Knowledge', 'Wisdom'], label: 'The DIKW pyramid, bottom to top' },
      { h: 'Users in information science' },
      'Information science focuses on **users**: how people search for, find and use information (library catalogues, search engines). Data science brings tools to analyse that behaviour at scale.',
      { h: 'iSchools' },
      '**iSchools** (information schools) are university departments that combine information science, data science, libraries and human-computer interaction, preparing people to work with information in society.',
    ],
    terms: [['Information science', 'The study of how information is collected, organised, retrieved and used.'], ['iSchool', 'A university school focused on information, people and technology.']],
    exam: 'Differentiate data and information with examples, draw the DIKW pyramid, and explain the user focus of information science and the role of iSchools.',
    revise: ['Data → information → knowledge → wisdom', 'Information science = people + information'],
  },

  'fds.u1.computational-thinking': {
    oneLine: 'Computational thinking is solving problems the way a computer scientist would: decompose the problem, recognise patterns, abstract away detail and design an algorithm.',
    blocks: [
      { flow: ['Decomposition: break it into parts', 'Pattern recognition: spot similarities', 'Abstraction: keep only what matters', 'Algorithm design: write clear steps'] },
      { h: 'Example: finding the class topper' },
      { ul: ['Decompose: read each mark, compare, remember the best.', 'Pattern: the same comparison for every student.', 'Abstract: we only need name and total, not addresses.', 'Algorithm: best = first student; for each next student, if total > best, best = this student.'] },
      'It is a way of thinking, not just programming: useful for planning a trip, organising data or designing an experiment.',
    ],
    terms: [['Decomposition', 'Breaking a problem into smaller parts.'], ['Abstraction', 'Ignoring unneeded detail to focus on what matters.'], ['Algorithm', 'A finite sequence of clear steps that solves a problem.']],
    exam: 'Define computational thinking, explain its four parts, and apply them to a simple everyday problem.',
    revise: ['Decompose, pattern, abstract, algorithm'],
  },

  'fds.u1.skills-tools': {
    oneLine: 'A data scientist needs statistics, programming, data wrangling, visualisation, machine learning and communication skills, and uses tools such as Python, R, SQL, spreadsheets and notebooks.',
    blocks: [
      { tree: { root: 'Data science skills', kids: ['Statistics and maths', 'Programming (Python, R)', 'Databases (SQL)', 'Data wrangling', 'Visualisation', 'Machine learning', 'Communication', 'Domain knowledge'] } },
      { table: { head: ['Tool', 'Used for'], rows: [
        ['Python (NumPy, pandas, Matplotlib, scikit-learn)', 'General analysis and ML'],
        ['R', 'Statistics and plotting'],
        ['SQL', 'Querying databases'],
        ['Excel / spreadsheets', 'Quick analysis, small data'],
        ['Jupyter notebooks', 'Code, results and notes together'],
        ['Tableau / Power BI', 'Dashboards and visualisation'],
        ['Hadoop / Spark', 'Very large data'],
      ] } },
      { h: 'Roles in a data science project' },
      { table: { head: ['Role', 'Responsibility'], rows: [['Project sponsor', 'Represents the business interest, decides success'], ['Client / end user', 'Uses the results'], ['Data scientist', 'Sets the strategy, builds and evaluates models'], ['Data architect', 'Manages data and storage'], ['Operations', 'Runs the infrastructure and deploys models']] } },
    ],
    terms: [['Data wrangling', 'Cleaning and reshaping raw data into a usable form.'], ['Jupyter notebook', 'A document mixing live code, output and text.']],
    exam: 'List the skills with one line each, give a table of tools and uses, and add the project roles if asked.',
    revise: ['Stats, programming, SQL, wrangling, visualisation, ML, communication', 'Python, R, SQL, Jupyter'],
  },

  'fds.u1.ethics': {
    oneLine: 'Data science must be fair, private and honest: biased data gives biased results, personal data must be protected, and people should know how their data is used.',
    blocks: [
      { tree: { root: 'Issues', kids: ['Ethics', 'Bias', 'Privacy'] } },
      { h: 'Bias' },
      { ul: ['**Sampling bias**: the data does not represent everyone (a survey only online misses people without internet).', '**Historical bias**: past unfair decisions in the data are repeated by models (hiring data that favoured one group).', '**Confirmation bias**: the analyst looks only for evidence that supports a belief.'] },
      { h: 'Privacy' },
      { ul: ['Collect only what is needed, with **consent**.', '**Anonymise** data, but beware re-identification by combining datasets.', 'Store securely; follow laws (India\'s DPDP Act 2023, the EU\'s GDPR).'] },
      { h: 'Ethics' },
      'Be transparent about methods, avoid harm, report uncertainty honestly, and do not mislead with selective charts or statistics.',
    ],
    terms: [['Bias', 'A systematic error that makes results unfair or wrong for some group.'], ['Anonymisation', 'Removing information that identifies individuals.'], ['Informed consent', 'People agreeing to data use after understanding it.']],
    exam: 'Explain ethics, bias (with types) and privacy, each with an example and a way to reduce the problem.',
    revise: ['Sampling, historical, confirmation bias', 'Consent, anonymise, secure'],
  },

  'fds.u1.data-types': {
    oneLine: 'Structured data fits neatly in rows and columns; unstructured data (text, images, audio, video) has no fixed format and is harder to store, search and analyse.',
    blocks: [
      { table: { head: ['Type', 'Description', 'Examples', 'Stored in'], rows: [
        ['Structured', 'Fixed schema, rows and columns', 'Marks table, bank transactions', 'Relational databases, spreadsheets'],
        ['Semi-structured', 'Has tags or keys but no rigid table', 'JSON, XML, e-mail headers', 'NoSQL stores, files'],
        ['Unstructured', 'No predefined format', 'Text, images, audio, video, social posts', 'Files, data lakes'],
      ] } },
      { h: 'Challenges with unstructured data' },
      { ul: ['Hard to search and query directly.', 'Needs special processing (NLP for text, computer vision for images).', 'Very large volume and storage cost.', 'Meaning depends on context (sarcasm in a review).', 'Quality is uneven (spelling errors, noise).'] },
      'About 80% or more of the world\'s data is unstructured.',
    ],
    terms: [['Structured data', 'Data organised into a fixed schema of rows and columns.'], ['Unstructured data', 'Data with no predefined model, such as text or images.'], ['Semi-structured data', 'Data with tags or keys but no fixed table, such as JSON.']],
    exam: 'Define the three types with examples in a table and list the challenges of unstructured data.',
    revise: ['Structured: tables', 'Semi: JSON, XML', 'Unstructured: text, images, video'],
  },

  'fds.u1.collections': {
    oneLine: 'Data comes from open data portals, social media, and multimodal sources (text plus images plus sensors); it must then be stored (files, databases, cloud) and presented clearly.',
    blocks: [
      { tree: { root: 'Data collections', kids: ['Open data (data.gov.in, Kaggle)', 'Social media (Twitter/X, Reddit APIs)', 'Multimodal (video + audio + text)'] } },
      { ul: [
        '**Open data**: freely available, public datasets from governments and organisations, often in CSV or JSON.',
        '**Social media data**: posts, likes, follows, collected through APIs; large, fast and unstructured.',
        '**Multimodal data**: several types together (a video with audio and captions, a patient record with scans and notes).',
      ] },
      { h: 'Storage and presentation' },
      { table: { head: ['Storage', 'Good for'], rows: [['Flat files (CSV, JSON)', 'Small data, sharing'], ['Relational databases (MySQL)', 'Structured data, SQL queries'], ['NoSQL (MongoDB)', 'Semi-structured, flexible'], ['Cloud storage, data lakes', 'Huge, mixed data']] } },
      'Presentation means choosing the right chart or table so the reader understands the result quickly: bar chart for comparison, line chart for trends, scatter plot for relationships.',
    ],
    terms: [['Open data', 'Data that anyone can freely use and share.'], ['API', 'A programmed interface used to request data from a service.'], ['Multimodal data', 'Data that combines several types, such as text, image and audio.']],
    exam: 'Explain open, social media and multimodal data with an example each, then storage options and presentation.',
    revise: ['Open, social media, multimodal', 'CSV, SQL, NoSQL, cloud'],
  },

  'fds.u1.cleaning': {
    oneLine: 'Data cleaning fixes the problems in raw data: missing values, noise, outliers, duplicates and inconsistent formats, so the analysis is not misled.',
    blocks: [
      { flow: ['Find problems', 'Handle missing values', 'Smooth noise and outliers', 'Remove duplicates', 'Fix inconsistencies'] },
      { table: { head: ['Problem', 'Fix'], rows: [
        ['Missing values', 'Ignore the row, fill with mean/median/mode, predict the value, or use a constant like "Unknown"'],
        ['Noisy data', 'Binning (smooth by bin means), regression, clustering to spot outliers'],
        ['Duplicates', 'Detect and drop repeated records'],
        ['Inconsistent data', 'Standardise formats: "Hyd", "Hyderabad", "HYDERABAD" → one value; dates in one format'],
      ] } },
      { h: 'Binning example' },
      'Sorted prices: 4, 8, 15, 21, 21, 24, 25, 28, 34. Three equal-frequency bins: (4, 8, 15), (21, 21, 24), (25, 28, 34). Smoothing by bin means gives 9, 9, 9 | 22, 22, 22 | 29, 29, 29.',
    ],
    terms: [['Noise', 'Random error or variation in a measured value.'], ['Imputation', 'Filling in missing values with estimates.'], ['Binning', 'Grouping sorted values into bins to smooth them.']],
    exam: 'List the problems in raw data and a fix for each, and work a small binning example.',
    revise: ['Missing, noise, duplicates, inconsistency', 'Fill with mean/median, binning, standardise'],
  },

  'fds.u1.integration': {
    oneLine: 'Data integration combines data from several sources into one consistent dataset, solving schema matching, duplicate records and conflicting values.',
    blocks: [
      { flow: ['Source A (sales DB)', 'Source B (website CSV)', 'Match schemas and keys', 'Resolve conflicts', 'One combined dataset'] },
      { h: 'Issues' },
      { ul: [
        '**Entity identification / schema matching**: "cust_id" in one source and "customer_no" in another mean the same thing.',
        '**Redundancy**: the same attribute twice, or one derived from another (age and date of birth); found with correlation analysis.',
        '**Duplicates**: the same customer recorded twice.',
        '**Value conflicts**: price in rupees in one source and dollars in another; different date formats.',
      ] },
    ],
    terms: [['Data integration', 'Merging data from multiple sources into a coherent store.'], ['Schema matching', 'Working out which fields in different sources mean the same thing.']],
    exam: 'Define data integration, list its issues (schema, redundancy, duplicates, value conflicts) with an example each.',
    revise: ['Schema matching, redundancy, duplicates, value conflicts'],
  },

  'fds.u1.transformation': {
    oneLine: 'Data transformation changes data into a form better for analysis: normalisation and scaling, aggregation, generalisation, attribute construction and encoding.',
    blocks: [
      { h: 'Normalisation' },
      { formula: 'Min-max: v′ = (v − min) / (max − min)    Z-score: v′ = (v − mean) / std' },
      'Example: marks 40 with min 20 and max 100 → (40 − 20) / 80 = **0.25**. Height 170 cm with mean 160 and std 5 → z = **2**.',
      { tip: 'Why it matters (asked): distance-based methods (k-means, KNN) and gradient-based models are dominated by large-scale features (salary in lakhs vs age in years) unless the features are rescaled to similar ranges.' },
      { h: 'Other transformations' },
      { ul: ['**Smoothing**: remove noise (binning, regression).', '**Aggregation**: daily sales → monthly totals.', '**Generalisation**: street → city → state (concept hierarchy).', '**Attribute construction**: area = length × width.', '**Encoding**: turn categories into numbers.'] },
    ],
    terms: [['Normalisation', 'Scaling values into a common range such as 0 to 1.'], ['Z-score', 'How many standard deviations a value is from the mean.'], ['Aggregation', 'Summarising data, such as summing to monthly totals.']],
    exam: 'Give the min-max and z-score formulas with a worked example each, explain why scaling matters for modelling, and list other transformations.',
    revise: ['Min-max to [0, 1]', 'Z-score = (v − mean)/std', 'Smooth, aggregate, generalise, construct'],
  },

  'fds.u1.reduction': {
    oneLine: 'Data reduction makes a dataset smaller while keeping its meaning: fewer attributes (dimensionality reduction), fewer records (numerosity reduction) or compression.',
    blocks: [
      { tree: { root: 'Data reduction', kids: ['Dimensionality reduction: PCA, feature selection', 'Numerosity reduction: sampling, histograms, clustering, regression models', 'Data compression: lossless or lossy'] } },
      { ul: [
        '**Dimensionality reduction**: drop or combine columns. PCA makes a few new columns that keep most of the variation; feature selection keeps only useful columns.',
        '**Numerosity reduction**: represent the data more compactly: a random **sample**, a **histogram** of counts, cluster centres, or a fitted model.',
        '**Compression**: store the same data in fewer bytes.',
      ] },
      'Why: faster analysis, less storage, easier visualisation, and sometimes better models (less noise).',
    ],
    terms: [['Dimensionality reduction', 'Reducing the number of attributes.'], ['Numerosity reduction', 'Replacing the data with a smaller representation.'], ['Sampling', 'Selecting a subset of records to represent the whole.']],
    exam: 'Explain why data is reduced and describe the three strategies with one method each.',
    revise: ['Dimensions, numerosity, compression', 'PCA, sampling, histograms'],
  },

  'fds.u1.discretization': {
    oneLine: 'Discretisation turns a continuous attribute into intervals (bins or labels), such as ages into "child, adult, senior", which simplifies analysis and some algorithms.',
    blocks: [
      { compare: [
        { title: 'Equal-width binning', items: ['Bins of the same range', 'Ages 0–20, 20–40, 40–60', 'Simple, but sensitive to outliers'] },
        { title: 'Equal-frequency binning', items: ['Bins with the same number of values', 'Each bin has 25% of students', 'Handles skewed data better'] },
      ] },
      { h: 'Other methods' },
      { ul: ['**Histogram analysis**.', '**Cluster analysis**: group values that are close.', '**Entropy-based (supervised)** splits that best separate classes.', '**Concept hierarchies**: 23 → "young adult" → "adult".'] },
      { code: 'import pandas as pd\nages = pd.Series([5, 17, 25, 42, 67, 80])\npd.cut(ages, bins=[0, 18, 60, 100], labels=["child", "adult", "senior"])' },
    ],
    terms: [['Discretisation', 'Converting continuous values into a set of intervals.'], ['Concept hierarchy', 'Levels of generalisation, such as city → state → country.']],
    exam: 'Define discretisation, compare equal-width and equal-frequency binning with an example, and list other methods.',
    revise: ['Equal-width vs equal-frequency', 'pd.cut for bins'],
  },
}
