// Model answers for the FDS class-test (mid-term) questions, written for the marks given.
// Every numerical was computed by script (statistics, NumPy, pandas, least squares, k-means) and
// checked by hand. The 2-mark class-test questions take their answers from bank-2m.js.
const N = 'FDS unit notes'
const MID = 'FDS class tests (PYQs/FDS MIDS.pdf)'
const RUN = 'Verified by running the code / calculation'

export default {
  'fds-mid-smart-city': {
    blocks: [
      'A smart-city system that integrates **traffic, public transport, healthcare and social-media data** needs four fields working together:',
      { img: 'fds-venn' },
      { table: { head: ['Field', 'Contribution'], rows: [
        ['**Data science**', 'Frames the questions (reduce congestion, speed up emergency response), integrates and cleans the heterogeneous data, builds predictive models (traffic and bus-demand forecasts, hospital-load prediction), detects events from social media, and presents insights on dashboards for decisions'],
        ['**Statistics**', 'Sampling and summary statistics, correlation (rain vs accidents), regression and time-series forecasting, hypothesis tests to judge whether an intervention (new signal timing) really helped, confidence intervals and uncertainty'],
        ['**Computer science**', 'Algorithms and machine learning (clustering accident hotspots, NLP sentiment on posts, route optimisation), databases and big-data frameworks (Hadoop/Spark), real-time stream processing, security, privacy and access control'],
        ['**Engineering**', 'IoT sensors, cameras and GPS devices; networks and data pipelines; cloud storage and computing infrastructure; deploying control systems that act on results (adaptive signals, ambulance green corridors)'],
      ] } },
      'Engineering **collects** the data, computer science **processes** it at scale, statistics makes the conclusions **reliable**, and data science **integrates** everything into decisions for the city.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'fds-mid-ethics': {
    blocks: [
      'Data that contains **personal information and biased observations** raises three groups of ethical issues:',
      { table: { head: ['Issue', 'Risk', 'Responsible practice'], rows: [
        ['**Privacy**', 'Health records, locations and posts identify people; breaches or misuse cause harm; "anonymous" data can be re-identified by combining datasets', 'Collect only what is needed, take informed consent, anonymise or pseudonymise, encrypt and restrict access, follow laws (DPDP Act 2023, GDPR)'],
        ['**Bias**', 'Unrepresentative samples (sensors only in some areas, social media used mostly by the young), historical bias and labelling bias make models unfair to some groups', 'Check representativeness, re-sample or re-weight, audit models for fairness across groups, document limitations'],
        ['**Responsible use**', 'Using data for purposes people did not agree to (surveillance), opaque automated decisions, misleading charts', 'Purpose limitation, transparency and explainability, human oversight, accountability, honest reporting of uncertainty'],
      ] } },
      'In short: protect individuals, treat all groups fairly, and use data only in ways that are transparent and accountable.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'fds-mid-edu-data': {
    blocks: [
      { img: 'fds-data-types' },
      { table: { head: ['Data', 'Classification', 'Reason'], rows: [['Examination marks', 'Structured', 'Fixed fields (roll no, subject, marks) in tables'], ['Attendance', 'Structured', 'Roll no, date, present/absent'], ['Student feedback', 'Semi-structured', 'Ratings are structured; free-text comments are unstructured'], ['Handwritten answer-script images', 'Unstructured', 'Images with no schema'], ['Social-media comments', 'Unstructured', 'Free text, emojis, slang']] } },
      { h: 'Challenges in handling the unstructured data' },
      { ul: ['**No fixed schema**: cannot be stored in tables or queried with SQL; needs data lakes / NoSQL stores.', '**Large volume**: scanned scripts and images need a lot of storage and processing power.', '**Extraction is hard**: handwriting needs OCR (varied handwriting, poor scans); comments need NLP (spelling, slang, mixed languages, sarcasm).', '**Noise and quality**: spam, irrelevant or fake posts.', '**Integration**: linking a comment or a script image to the right student record is difficult.', '**Privacy**: images and comments may expose personal information.', 'Needs specialised tools and skills (ML, computer vision), so it is slow and costly.'] },
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'fds-mid-preprocess': {
    blocks: [
      { img: 'fds-preprocess' },
      { steps: ['**Data cleaning**: remove duplicate records; fill missing marks or attendance (mean/median or flag); correct invalid values (attendance > 100%); smooth noise; clean feedback text (spam, encoding); treat outliers.', '**Data integration**: merge marks, attendance, feedback and OCR text on a common key (roll number); resolve schema conflicts (RollNo vs Student_ID), unit/scale conflicts (marks out of 50 vs 100) and redundancy.', '**Data transformation**: normalise numeric attributes (min-max or z-score); encode categorical attributes (one-hot, label); convert comments to sentiment scores; construct new attributes (attendance %).', '**Data reduction**: drop irrelevant attributes, select important features or apply PCA; aggregate (per-student averages) or sample to reduce volume.', '**Data discretization**: convert continuous values into intervals: marks → grades, attendance % → Low/Medium/High, using binning or concept hierarchies.'] },
      'The order matters: clean first so errors are not merged; integrate before transforming so scales are consistent; reduce and discretize last to prepare compact, analysis-ready data.',
    ],
    sources: [`${N} (Unit 1)`, MID],
  },

  'fds-num-complaints': {
    blocks: [
      'Data: 12, 15, 18, 15, 20, 25, 15 (n = 7). Sorted: 12, 15, 15, 15, 18, 20, 25.',
      { ul: ['**Mean** = (12 + 15 + 18 + 15 + 20 + 25 + 15) / 7 = 120 / 7 = **17.14**', '**Median** = 4th value of the sorted data = **15**', '**Mode** = **15** (occurs three times)', '**Range** = max − min = 25 − 12 = **13**'] },
      { h: 'Comment on the distribution' },
      'Mean (17.14) > median (15) = mode (15), so the distribution is **positively (right) skewed**: on most days there are about 15 complaints, but a few days with many complaints (20, 25) pull the mean up. The median (15) is the better measure of a typical day, and the range of 13 shows moderate variability.',
      { img: 'fds-boxplot' },
    ],
    sources: [`${N} (Unit 2)`, MID, RUN],
  },

  'fds-mid-sd': {
    blocks: [
      'The **standard deviation** measures how far, on average, the values lie from their mean:',
      { formula: 'σ = √( Σ(xᵢ − μ)² / N )      (sample s = √( Σ(xᵢ − x̄)² / (n − 1) ))' },
      { steps: ['For each month, compute the mean daily complaints.', 'Compute each day\'s deviation from the mean, square it, average the squares (variance) and take the square root (SD).', 'Compare the two SDs (and, if the means differ much, the coefficient of variation CV = σ / μ × 100%).'] },
      'SD is in the same units as the data (complaints per day), so it is directly interpretable; e.g. for 12, 15, 18, 15, 20, 25, 15 the mean is 17.14 and σ ≈ 3.98.',
      { h: 'What a higher standard deviation indicates' },
      'A **higher SD** means the daily complaint counts are **more spread out from the mean**: complaints are **inconsistent and less predictable**, with more extreme days (spikes or very quiet days). A **lower SD** means complaints are steady around the average, so service is more consistent. The month with the higher SD needs investigation of the unusual days.',
    ],
    sources: [`${N} (Unit 2)`, MID],
  },

  'fds-mid-pearson': {
    blocks: [
      "**Pearson's correlation coefficient r** measures the strength and direction of the **linear** relationship between two continuous variables, here x = online-learning time and y = exam marks.",
      { formula: 'r = Σ(x − x̄)(y − ȳ) / √( Σ(x − x̄)² · Σ(y − ȳ)² ),   −1 ≤ r ≤ +1' },
      { steps: ['Collect paired observations (hours, marks) for a sample of students.', 'Plot a scatter diagram to check the relationship is roughly linear and to spot outliers.', 'Compute r (e.g. df["hours"].corr(df["marks"]) or scipy.stats.pearsonr, which also gives a p-value).', 'Interpret: sign gives direction; |r| near 1 = strong, near 0 = weak; check significance (p < 0.05).'] },
      { img: 'fds-correlation' },
      { h: 'Interpreting a strong positive correlation (e.g. r = 0.85)' },
      { ul: ['Students who spend **more time** learning online **tend to score higher** marks; the points lie close to an upward-sloping line.', 'r² = 0.72: about 72% of the variation in marks is linearly associated with online-learning time.', '**Correlation is not causation**: motivation or prior ability may drive both; a controlled study would be needed to claim online learning causes higher marks.'] },
    ],
    sources: [`${N} (Unit 2)`, MID],
  },

  'fds-num-numpy-index': {
    blocks: [
      { img: 'fds-indexing' },
      { code: `import numpy as np
A = np.array([[10, 20, 30],
              [40, 50, 60],
              [70, 80, 90]])

A[1]          # second row          -> array([40, 50, 60])
A[:, 2]       # third column        -> array([30, 60, 90])
A[1:, 1:]     # sub-array           -> array([[50, 60], [80, 90]])
A[A > 50]     # elements > 50       -> array([60, 70, 80, 90])` },
      { ul: ['Indexing is zero-based: row index 1 is the second row, column index 2 the third column.', 'A[:, 2] uses ":" for all rows; A[1:, 1:] slices rows and columns from index 1 to the end (a view).', 'A > 50 builds a Boolean mask; A[mask] returns the matching elements as a 1-D array (a copy).'] },
    ],
    sources: [`${N} (Unit 3)`, MID, RUN],
  },

  'fds-num-pandas-ct2': {
    blocks: [
      { code: `import pandas as pd
A = pd.DataFrame({"Dept": ["Accounts", "Sales", "Accounts", "Sales", "HR"],
                  "Emp id": [1, 2, 3, 4, 5],
                  "Salary": [30000, 40000, 35000, 45000, 46000]})
B = pd.DataFrame({"Emp id": [1, 2, 3, 4, 5],
                  "Name": ["Surya", "Arha", "Syam", "Radha", "John"],
                  "Experience": [2, 3, None, 3, 4]})

# (i) group by Department, average salary
A.groupby("Dept")["Salary"].mean()
# Accounts 32500.0 | HR 46000.0 | Sales 42500.0

# (ii) join on the common column Emp id
merged = pd.merge(A, B, on="Emp id")          # inner join; 5 rows, 5 columns

# (iii) identify missing values and replace with the column mean
merged.isnull().sum()                         # Experience: 1 (Syam)
merged["Experience"] = merged["Experience"].fillna(merged["Experience"].mean())
# mean = (2 + 3 + 3 + 4) / 4 = 3.0, so Syam's Experience becomes 3.0` },
      { img: 'fds-groupby' },
    ],
    sources: [`${N} (Unit 3)`, MID, RUN],
  },

  'fds-num-pivot-ct2': {
    blocks: [
      { code: `import pandas as pd
A = pd.DataFrame({"Dept": ["Accounts", "Sales", "Accounts", "Sales", "HR"],
                  "Emp id": [1, 2, 3, 4, 5],
                  "Salary": [30000, 40000, 35000, 45000, 46000]})

pivot = pd.pivot_table(A, values="Salary", index="Dept", aggfunc="mean")
print(pivot)` },
      { table: { head: ['Dept', 'Salary (mean)'], rows: [['Accounts', '32500.0'], ['HR', '46000.0'], ['Sales', '42500.0']] } },
      { ul: ['**values**: the column to aggregate (Salary).', '**index**: the row groups (one row per department).', '**aggfunc**: the aggregation function (mean; others: sum, count, max).', 'Optional: columns= to cross-tabulate by another field; margins=True adds an "All" row (overall mean 39200); fill_value= replaces empty cells.'] },
    ],
    sources: [`${N} (Unit 3)`, MID, RUN],
  },

  'fds-mid-encoding': {
    blocks: [
      '**Feature encoding** converts categorical values into numbers that machine-learning models can use.',
      { table: { head: ['Technique', 'How it works', 'Example', 'Best for'], rows: [
        ['**One-hot encoding**', 'One new binary column per category; 1 in the row\'s category, 0 elsewhere', 'City {Delhi, Mumbai, Chennai} → Delhi [1,0,0], Mumbai [0,1,0], Chennai [0,0,1]', 'Nominal data with no order and few categories'],
        ['**Label encoding**', 'Each category gets a unique integer', 'Chennai → 0, Delhi → 1, Mumbai → 2', 'Target labels or tree-based models (may imply a false order)'],
        ['**Ordinal encoding**', 'Integers assigned in a meaningful, defined order', 'Education: High school → 0, Graduate → 1, Postgraduate → 2', 'Ordered categories (grades, sizes, ratings)'],
      ] } },
      { code: `pd.get_dummies(df["City"])                                    # one-hot
from sklearn.preprocessing import LabelEncoder, OrdinalEncoder
LabelEncoder().fit_transform(df["City"])                      # label
OrdinalEncoder(categories=[["High school", "Graduate", "Postgraduate"]]
               ).fit_transform(df[["Education"]])             # ordinal` },
    ],
    sources: [`${N} (Unit 4)`, MID],
  },

  'fds-mid-uni-bi-multi': {
    blocks: [
      { img: 'fds-analysis-types' },
      { table: { head: ['Aspect', 'Univariate', 'Bivariate', 'Multivariate'], rows: [
        ['Number of variables', 'One', 'Two', 'Three or more'],
        ['Purpose', 'Describe one variable: centre, spread, shape', 'Study the relationship between two variables', 'Study interactions among many variables together'],
        ['Techniques', 'Mean, median, mode, SD, frequency tables, skewness', 'Correlation, covariance, cross-tabs, simple regression, t-test, chi-square', 'Multiple regression, PCA, clustering, correlation matrix, MANOVA'],
        ['Visualisation', 'Histogram, box plot, bar or pie chart', 'Scatter plot, line chart, grouped bar chart', 'Pair plot, heat map, colour/size-coded scatter, 3-D plot'],
        ['Example (Titanic)', 'Distribution of passenger ages', 'Fare vs survival', 'Survival by sex, class and age together'],
        ['Insight', 'Describes; no relationships', 'Association between two variables', 'Joint effects; controls for other variables'],
      ] } },
      { compare: [{ title: 'Similarities', items: ['All are parts of exploratory data analysis', 'All use descriptive statistics and plots', 'Done in sequence: uni → bi → multi'] }, { title: 'Differences', items: ['Number of variables and complexity grow', 'Only bivariate/multivariate reveal relationships', 'Multivariate needs more data and computation'] }] },
    ],
    sources: [`${N} (Unit 4)`, MID],
  },

  'fds-mid-ttest': {
    blocks: [
      'A **t-test** compares means using the t-distribution when the population standard deviation is unknown (and samples are small).',
      { table: { head: ['Type', 'What it compares', 'Example'], rows: [['**One-sample t-test**', 'A sample mean with a hypothesised population mean', 'Is the mean reading time 4 minutes?'], ['**Independent two-sample t-test**', 'Means of two independent groups', 'Section A vs Section B marks'], ['**Paired t-test**', 'Means of the same subjects measured twice', 'Marks before vs after coaching']] } },
      { formula: 'One-sample: t = (x̄ − μ₀) / (s / √n),   df = n − 1' },
      { h: 'Assumptions' },
      { ol: ['**Continuous (interval/ratio) data**.', '**Approximately normal distribution** of the data (or of the paired differences); check with a Q–Q plot or Shapiro–Wilk test.', '**Random sampling and independent observations**.', '**Equal variances** (homogeneity) for the independent two-sample test (Levene\'s test; otherwise use Welch\'s t-test).', 'No extreme **outliers**.'] },
    ],
    sources: [`${N} (Unit 4)`, MID],
  },

  'fds-mid-logistic-types': {
    blocks: [
      '**Logistic regression** predicts class probabilities; its type depends on the number and nature of the classes.',
      { table: { head: ['Scenario', 'Type', 'Justification and example'], rows: [
        ['(i) Email: Spam / Not Spam', '**Binary (binomial)**', 'Exactly two classes. The sigmoid gives P(spam) from features (word counts, links, sender); if P ≥ 0.5 → Spam. Similar: pass/fail, fraud/genuine'],
        ['(ii) News: Sports / Politics / Entertainment', '**Multinomial**', 'Three or more classes with **no order**. Softmax gives a probability for each topic (e.g. 0.7, 0.2, 0.1); the highest is chosen. Similar: classifying fruit type'],
        ['(iii) Satisfaction: Low / Medium / High', '**Ordinal**', 'Three classes with a **natural order** (Low < Medium < High). The model uses cumulative probabilities P(y ≤ k). Similar: movie ratings 1–5 stars'],
      ] } },
      { img: 'fds-sigmoid' },
    ],
    sources: [`${N} (Unit 5)`, MID],
  },

  'fds-num-linreg-ct2': {
    blocks: [
      'x = study hours, y = marks. x̄ = 3, ȳ = 49.',
      { table: { head: ['x', 'y', 'x − x̄', 'y − ȳ', '(x − x̄)(y − ȳ)', '(x − x̄)²'], rows: [['1', '35', '−2', '−14', '28', '4'], ['2', '40', '−1', '−9', '9', '1'], ['3', '50', '0', '1', '0', '0'], ['4', '55', '1', '6', '6', '1'], ['5', '65', '2', '16', '32', '4'], ['', '', '', 'Σ', '**75**', '**10**']] } },
      { formula: 'b₁ = 75 / 10 = 7.5      b₀ = 49 − 7.5 × 3 = 26.5      ŷ = 26.5 + 7.5x' },
      { table: { head: ['x', 'y', 'ŷ', 'e = y − ŷ', '|e|', 'e²'], rows: [['1', '35', '34.0', '1.0', '1.0', '1.00'], ['2', '40', '41.5', '−1.5', '1.5', '2.25'], ['3', '50', '49.0', '1.0', '1.0', '1.00'], ['4', '55', '56.5', '−1.5', '1.5', '2.25'], ['5', '65', '64.0', '1.0', '1.0', '1.00'], ['', '', '', 'Σ', '6.0', '7.50']] } },
      { ul: ['**MAE** = 6.0 / 5 = **1.2**', '**MSE** = 7.5 / 5 = **1.5**', '**RMSE** = √1.5 = **1.22**', '(R² = 1 − 7.5 / 570 = 0.987)'] },
      'Interpretation: each extra hour of study adds about 7.5 marks; predictions are off by about 1.2 marks on average, so the model fits very well.',
      { img: 'fds-regression-ct' },
    ],
    sources: [`${N} (Unit 5)`, MID, RUN],
  },

  'fds-num-kmeans-ct2': {
    blocks: [
      'K = 3. **Initial centroids** (chosen from the data): C1 = P1 (2, 3), C2 = P4 (8, 7), C3 = P5 (9, 8). Distances are Euclidean.',
      { h: 'Iteration 1: assign points' },
      { table: { head: ['Point', 'd(C1)', 'd(C2)', 'd(C3)', 'Cluster'], rows: [['P1 (2,3)', '0', '7.21', '8.60', 'C1'], ['P2 (3,3)', '1.00', '6.40', '7.81', 'C1'], ['P3 (3,4)', '1.41', '5.83', '7.21', 'C1'], ['P4 (8,7)', '7.21', '0', '1.41', 'C2'], ['P5 (9,8)', '8.60', '1.41', '0', 'C3'], ['P6 (8,9)', '8.49', '2.00', '1.41', 'C3']] } },
      { h: 'Update centroids' },
      { ul: ['C1 = ((2 + 3 + 3)/3, (3 + 3 + 4)/3) = **(2.67, 3.33)**', 'C2 = **(8, 7)**', 'C3 = ((9 + 8)/2, (8 + 9)/2) = **(8.5, 8.5)**'] },
      { h: 'Iteration 2' },
      'Recomputing distances with the new centroids, every point stays in the same cluster (P5: 1.41 to C2 vs 0.71 to C3; P6: 2.00 vs 0.71; P4: 0 to C2), so the centroids no longer change: the algorithm has **converged**.',
      { table: { head: ['Cluster', 'Points', 'Centroid'], rows: [['C1', 'P1, P2, P3', '(2.67, 3.33)'], ['C2', 'P4', '(8, 7)'], ['C3', 'P5, P6', '(8.5, 8.5)']] } },
      { img: 'fds-kmeans-ct' },
      { code: `from sklearn.cluster import KMeans
import numpy as np
X = np.array([[2, 3], [3, 3], [3, 4], [8, 7], [9, 8], [8, 9]])
km = KMeans(n_clusters=3, init=X[[0, 3, 4]], n_init=1).fit(X)
km.labels_            # [0 0 0 1 2 2]
km.cluster_centers_   # [[2.67 3.33] [8. 7.] [8.5 8.5]]` },
      { note: 'k-means depends on the initial centroids; state them clearly. Other starting points can give a different (also valid) split of P4, P5, P6.' },
    ],
    sources: [`${N} (Unit 5)`, MID, RUN],
  },
}
