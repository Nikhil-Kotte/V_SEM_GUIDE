// Fundamentals of Data Science: a 2-mark question bank for each unit, with full-mark answers.
//   from:  the question this was asked as (class-test questions are shown first); omitted for likely questions.
//   q:     the question as it would be set for 2 marks.
//   a:     the answer: a definition plus the points an examiner looks for (content blocks).
// FDS has no past university papers of its own, so apart from the class-test questions these are the
// short questions most likely to be set, drawn from the syllabus and the unit slides.
export default [
  {
    unit: 'I',
    items: [
      { id: 'f1-city', from: 'fds-mid-city-data', q: 'A city collects traffic-sensor data, social-media posts and hospital records. Classify these as structured or unstructured and justify.', a: [
        { ul: ['**Traffic-sensor data: structured**: fixed fields (sensor ID, timestamp, vehicle count, speed) that fit rows and columns.', '**Social-media posts: unstructured**: free text, images, hashtags and emojis with no predefined schema.', '**Hospital records: structured**: patient ID, age, diagnosis codes, dates in database tables (notes and scans inside them are unstructured).'] },
      ] },
      { id: 'f1-ds', q: 'Define data science.', a: [
        '**Data science** is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to **extract knowledge and insights from structured and unstructured data** and to support decisions. It combines **statistics/mathematics, computer science and domain knowledge**.',
      ] },
      { id: 'f1-lifecycle', q: 'List the stages of the data science life cycle.', a: [
        { flow: ['Define the problem', 'Collect data', 'Prepare / clean', 'Explore (EDA)', 'Model', 'Evaluate', 'Communicate and deploy'] },
        'The cycle is iterative: results raise new questions.',
      ] },
      { id: 'f1-roles', from: 'fds-roles', q: 'Mention the key roles in a data science project.', a: [
        { ul: ['**Project sponsor**: represents the business interest; defines success.', '**Client / end user**: uses the results and supplies domain knowledge.', '**Data scientist**: sets the analytical strategy, builds and evaluates models.', '**Data architect / engineer**: manages data sources, storage and pipelines.', '**Operations**: manages infrastructure and deploys the results.'] },
      ] },
      { id: 'f1-ds-stats', q: 'How does data science differ from statistics?', a: [
        '**Statistics** provides the theory of collecting, analysing and inferring from data (sampling, estimation, hypothesis tests), often on small, clean samples. **Data science** uses statistics **together with computing** (programming, databases, machine learning) and domain knowledge to handle **large, messy, varied data** end to end, from collection to deployment.',
      ] },
      { id: 'f1-ct', q: 'What is computational thinking? Name its components.', a: [
        '**Computational thinking** is a problem-solving approach that formulates problems and solutions so a computer (or person) can carry them out. Components: **decomposition**, **pattern recognition**, **abstraction** and **algorithm design**.',
      ] },
      { id: 'f1-dikw', q: 'Differentiate data and information.', a: [
        '**Data**: raw, unorganised facts and figures with no meaning on their own (e.g. 72, 65, 80). **Information**: data that has been **processed, organised and given context** so it is meaningful (e.g. "the average mark of Section A is 72"). Data → information → knowledge → wisdom (DIKW).',
      ] },
      { id: 'f1-semi', q: 'What is semi-structured data? Give examples.', a: [
        'Data that does not fit a rigid relational schema but has **tags, keys or markers** that separate elements and give some structure (self-describing). Examples: **JSON, XML, CSV, e-mail** (headers + body), web server logs, NoSQL documents.',
      ] },
      { id: 'f1-bias', q: 'What is bias in data? Give an example.', a: [
        '**Bias** is a systematic error that makes data or results unrepresentative or unfair to some group. Example: a survey conducted only online (**sampling bias**) misses people without internet; hiring data reflecting past discrimination (**historical bias**) makes a model unfair.',
      ] },
      { id: 'f1-privacy', q: 'How can privacy be protected in data science?', a: [
        { ul: ['Collect only necessary data with **informed consent**.', '**Anonymise / pseudonymise** personal identifiers; aggregate where possible.', '**Encrypt** and restrict access; secure storage.', 'Follow laws such as India\'s **DPDP Act 2023** and the EU\'s **GDPR**.'] },
      ] },
      { id: 'f1-preprocess', q: 'What is data preprocessing? List its major tasks.', a: [
        '**Data preprocessing** prepares raw data for analysis by improving its quality. Major tasks: **data cleaning, data integration, data transformation, data reduction and data discretization**.',
      ] },
      { id: 'f1-cleaning', q: 'What is data cleaning?', a: [
        'The process of **detecting and correcting or removing inaccurate, incomplete, inconsistent, duplicate or noisy data**: filling missing values, smoothing noise (binning, regression), removing outliers and duplicates, and resolving inconsistencies.',
      ] },
      { id: 'f1-normalise', from: 'fds-normalise-impact', q: 'Why are normalisation and rescaling important for modelling?', a: [
        'Features on different scales (salary in lakhs vs age in years) let large-valued features **dominate distance-based and gradient-based models** (k-NN, k-means, SVM, neural networks, regularised regression). Normalising (min-max to 0–1, or z-score) puts features on a **comparable scale**, speeds up convergence and makes coefficients comparable. Tree-based models are largely unaffected.',
      ] },
      { id: 'f1-minmax', q: 'Normalise the value 60 from the range 20–100 using min-max normalisation to [0, 1].', a: [
        { formula: "v′ = (v − min) / (max − min) = (60 − 20) / (100 − 20) = 40 / 80 = 0.5" },
      ] },
      { id: 'f1-discretize', q: 'What is data discretization?', a: [
        'Converting **continuous values into a small number of intervals (bins) or labels**, e.g. age → child (0–12), teen (13–19), adult (20–59), senior (60+). Methods: equal-width and equal-frequency binning, histogram analysis, clustering, entropy-based splitting, concept hierarchies.',
      ] },
    ],
  },
  {
    unit: 'II',
    items: [
      { id: 'f2-analytics', from: 'fds-mid-analytics-types', q: 'A retail manager wants to know what happened to sales, why they changed and what may happen next month. Identify the types of analytics.', a: [
        { ul: ['**What happened** → **descriptive analytics** (sales totals, dashboards).', '**Why sales changed** → **diagnostic analytics** (drill-down, correlation with price, season, promotions).', '**What may happen next month** → **predictive analytics** (forecasting, regression).'] },
        '(Recommending what to do about it would be prescriptive analytics.)',
      ] },
      { id: 'f2-analysis-analytics', q: 'Differentiate data analysis and data analytics.', a: [
        '**Data analysis** inspects, cleans and models data to understand **what has happened** (a subset). **Data analytics** is the broader discipline that includes analysis plus tools and techniques to **predict outcomes and recommend actions** (descriptive, diagnostic, predictive, prescriptive).',
      ] },
      { id: 'f2-attr', q: 'Name the types of attributes with an example each.', a: [
        { ul: ['**Nominal**: categories without order (eye colour).', '**Binary**: two states (smoker yes/no).', '**Ordinal**: ordered categories (grade A > B > C).', '**Interval**: numeric, no true zero (temperature in °C).', '**Ratio**: numeric with a true zero (height, salary).'] },
      ] },
      { id: 'f2-mean-median', q: 'When is the median preferred to the mean?', a: [
        'When the data are **skewed or contain outliers**, because the median depends only on the middle value while the mean is pulled by extreme values. Example: incomes 20k, 25k, 30k, 35k, 10 lakh: mean is misleadingly high; the median (30k) is typical.',
      ] },
      { id: 'f2-range-iqr', q: 'Define range and interquartile range.', a: [
        '**Range** = maximum − minimum. **Interquartile range (IQR)** = Q3 − Q1, the spread of the middle 50% of the data; it is robust to outliers and is used to detect them (beyond Q1 − 1.5·IQR or Q3 + 1.5·IQR).',
      ] },
      { id: 'f2-sd', q: 'What is standard deviation?', a: [
        'The **square root of the variance**: a measure of how much values deviate from the mean, in the same units as the data. σ = √(Σ(x − μ)² / N). A small SD means values are close to the mean; a large SD means they are spread out.',
      ] },
      { id: 'f2-cv', q: 'What is the coefficient of variation?', a: [
        '**CV = (σ / μ) × 100%**: the SD relative to the mean. It compares variability of datasets with **different units or means**; the dataset with the higher CV is more variable (less consistent).',
      ] },
      { id: 'f2-skew', q: 'Define skewness. How are mean and median placed in a positively skewed distribution?', a: [
        '**Skewness** measures the asymmetry of a distribution. In a **positively (right) skewed** distribution the long tail is on the right and **mode < median < mean**; in a negatively skewed one, mean < median < mode.',
      ] },
      { id: 'f2-kurt', q: 'What is kurtosis? Name its types.', a: [
        'A measure of the **tailedness/peakedness** of a distribution compared with the normal: **leptokurtic** (heavy tails, sharp peak, kurtosis > 3), **mesokurtic** (normal, = 3), **platykurtic** (light tails, flat, < 3).',
      ] },
      { id: 'f2-cov-corr', q: 'Differentiate covariance and correlation.', a: [
        '**Covariance** shows the direction of the joint variation of two variables but its value depends on their units (unbounded). **Correlation** is covariance divided by the product of SDs, a **unit-free** measure of strength and direction bounded between **−1 and +1**.',
      ] },
      { id: 'f2-spearman', q: "When is Spearman's rank correlation used instead of Pearson's?", a: [
        "When data are **ordinal (ranks)**, not normally distributed, have outliers, or the relationship is **monotonic but not linear**. Spearman's ρ is Pearson's r computed on ranks: ρ = 1 − 6Σd² / (n(n² − 1)).",
      ] },
      { id: 'f2-sampling', q: 'Name the probability sampling methods.', a: [
        { ul: ['**Simple random** sampling', '**Stratified** sampling (random within subgroups)', '**Systematic** sampling (every k-th item)', '**Cluster** sampling (randomly chosen whole groups)'] },
      ] },
      { id: 'f2-parametric', q: 'What are parametric tests? Give two examples.', a: [
        'Tests that assume the data come from a distribution with fixed parameters (usually **normal**, with known form of mean and variance). Examples: **t-test, z-test, ANOVA, Pearson correlation**. Non-parametric alternatives: Mann–Whitney U, chi-square.',
      ] },
      { id: 'f2-normal', q: 'State the empirical rule for the normal distribution.', a: [
        'About **68%** of values lie within μ ± 1σ, **95%** within μ ± 2σ and **99.7%** within μ ± 3σ. The normal curve is symmetric and bell-shaped with mean = median = mode.',
      ] },
      { id: 'f2-cdf', q: 'Define the cumulative distribution function.', a: [
        'F(x) = **P(X ≤ x)**, the probability that the random variable is at most x. It is non-decreasing from 0 to 1, and P(a < X ≤ b) = F(b) − F(a).',
      ] },
    ],
  },
  {
    unit: 'III',
    items: [
      { id: 'f3-add', from: 'fds-mid-numpy-add', q: 'For A = np.array([10, 20, 30]) and B = np.array([1, 2, 3]), what is A + B? Which NumPy concept is involved?', a: [
        { code: 'A + B   # array([11, 22, 33])' },
        'Concept: **vectorised element-wise operation** (a universal function / ufunc): arrays of the same shape are added element by element without a Python loop. With different but compatible shapes, the same works through **broadcasting**.',
      ] },
      { id: 'f3-series-df', from: 'fds-mid-series-df', q: 'Write Python code to create a pandas Series and a DataFrame.', a: [
        { code: 'import pandas as pd\ns = pd.Series([85, 92, 78], index=["Asha", "Ravi", "Kiran"])\ndf = pd.DataFrame({"Name": ["Asha", "Ravi"], "Marks": [85, 92]})\nprint(s); print(df)' },
        'A **Series** is a one-dimensional labelled array; a **DataFrame** is a two-dimensional labelled table of columns.',
      ] },
      { id: 'f3-ndarray-list', q: 'How is a NumPy array different from a Python list?', a: [
        { ul: ['An ndarray is **homogeneous** (one dtype); a list can mix types.', 'ndarrays use **contiguous memory**, so they are much **faster** and smaller.', 'ndarrays support **vectorised** operations and broadcasting (A * 2 multiplies every element); lists do not.', 'ndarrays are multidimensional with shape/ndim attributes.'] },
      ] },
      { id: 'f3-attrs', q: 'List the attributes of a NumPy array.', a: [
        { ul: ['**ndim**: number of dimensions', '**shape**: size along each dimension', '**size**: total number of elements', '**dtype**: element data type', '**itemsize**: bytes per element'] },
      ] },
      { id: 'f3-reshape', q: 'Differentiate reshape() and resize().', a: [
        '**reshape()** returns a new view with a different shape; the total number of elements must stay the same (np.arange(6).reshape(2, 3)). **resize()** changes the array **in place** (ndarray.resize) or returns a new array (np.resize) and can change the total size, repeating or padding elements.',
      ] },
      { id: 'f3-view-copy', q: 'Differentiate a view and a copy in NumPy.', a: [
        'A **view** shares the original data (slicing, reshape): modifying it changes the original. A **copy** (arr.copy(), fancy indexing) owns new data: changes do not affect the original.',
      ] },
      { id: 'f3-stack', q: 'What do hstack() and vstack() do?', a: [
        '**np.hstack((a, b))** joins arrays **horizontally** (column-wise, along axis 1 for 2-D); **np.vstack((a, b))** joins them **vertically** (row-wise, along axis 0). E.g. [1,2] and [3,4]: hstack → [1,2,3,4]; vstack → [[1,2],[3,4]].',
      ] },
      { id: 'f3-bool', q: 'What is Boolean indexing? Give an example.', a: [
        'Selecting elements with a **Boolean mask** produced by a condition: A[A > 50] returns all elements greater than 50; A[A % 2 == 0] returns even elements.',
      ] },
      { id: 'f3-broadcast-rule', q: 'State the broadcasting rule.', a: [
        'Compare the shapes **from the trailing (rightmost) dimension**; two dimensions are compatible if they are **equal or one of them is 1**. The size-1 (or missing) dimension is stretched. E.g. (3, 3) + (3,) works; (3, 2) + (3,) fails.',
      ] },
      { id: 'f3-describe', q: 'What does df.describe() return?', a: [
        'Summary statistics of the numeric columns: **count, mean, std, min, 25%, 50% (median), 75% and max**. With include="all" it also gives count, unique, top and freq for categorical columns.',
      ] },
      { id: 'f3-joins', q: 'Name the types of joins in pandas merge().', a: [
        { ul: ['**inner**: only keys in both DataFrames (default)', '**left**: all keys of the left DataFrame', '**right**: all keys of the right DataFrame', '**outer**: all keys of both, with NaN where missing'] },
      ] },
      { id: 'f3-missing', q: 'How does pandas detect and handle missing values?', a: [
        'Detect with **isnull() / isna()** (and notnull()); count with df.isnull().sum(). Handle with **dropna()** (remove rows/columns) or **fillna()** (constant, mean, median, ffill, bfill) or interpolate().',
      ] },
      { id: 'f3-pivot', q: 'What is a pivot table?', a: [
        'A summary table that **groups data by one or more keys and aggregates values**, e.g. pd.pivot_table(df, values="Salary", index="Dept", aggfunc="mean") gives the average salary of each department.',
      ] },
      { id: 'f3-dates', q: 'How do you convert a column of strings to dates in pandas?', a: [
        { code: 'df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y")\ndf["date"].dt.year      # extract parts with the .dt accessor' },
      ] },
      { id: 'f3-groupby', q: 'Explain split–apply–combine.', a: [
        'groupby() **splits** the rows into groups by a key, **applies** a function (sum, mean, count) to each group, and **combines** the results into a new DataFrame/Series: df.groupby("Dept")["Salary"].mean().',
      ] },
    ],
  },
  {
    unit: 'IV',
    items: [
      { id: 'f4-null-alt', from: 'fds-mid-null-alt', q: 'Differentiate between the null hypothesis and the alternative hypothesis.', a: [
        { table: { head: ['Null hypothesis H₀', 'Alternative hypothesis H₁'], rows: [['States **no effect / no difference / no relationship**', 'States **an effect / difference / relationship** exists'], ['Contains equality (=, ≤, ≥)', 'Contains ≠, > or <'], ['Assumed true; tested directly', 'Accepted only if H₀ is rejected'], ['e.g. mean reading time = 4 min', 'e.g. mean reading time ≠ 4 min']] } },
      ] },
      { id: 'f4-pvalue', q: 'What is a p-value?', a: [
        'The **probability of obtaining a result at least as extreme as the observed one, assuming H₀ is true**. If p ≤ α (e.g. 0.05), the result is statistically significant and H₀ is rejected.',
      ] },
      { id: 'f4-errors', q: 'Define Type I and Type II errors.', a: [
        '**Type I error (α)**: rejecting a **true** null hypothesis (false positive). **Type II error (β)**: failing to reject a **false** null hypothesis (false negative). Power = 1 − β.',
      ] },
      { id: 'f4-alpha', q: 'What is the level of significance?', a: [
        'The **threshold probability α** (commonly 0.05 or 0.01) of rejecting H₀ when it is true (Type I error); it defines the rejection region of the test.',
      ] },
      { id: 'f4-one-two', q: 'Differentiate one-tailed and two-tailed tests.', a: [
        'A **two-tailed** test checks for a difference in **either direction** (H₁: μ ≠ μ₀), splitting α between both tails. A **one-tailed** test checks a **specific direction** (H₁: μ > μ₀ or μ < μ₀), with all of α in one tail.',
      ] },
      { id: 'f4-ttypes', q: 'Name the types of t-tests.', a: [
        { ul: ['**One-sample**: sample mean vs a known value.', '**Independent two-sample**: means of two independent groups.', '**Paired**: means of the same subjects measured twice (before/after).'] },
      ] },
      { id: 'f4-onehot', q: 'What is one-hot encoding?', a: [
        'Representing a categorical variable with **one binary column per category**: 1 for the row\'s category, 0 elsewhere. Colour {Red, Green, Blue}: Red → [1, 0, 0]. In pandas: pd.get_dummies(df["Colour"]).',
      ] },
      { id: 'f4-label-ordinal', q: 'Differentiate label encoding and ordinal encoding.', a: [
        '**Label encoding** gives each category an arbitrary integer (Blue 0, Green 1, Red 2), which can suggest a false order. **Ordinal encoding** assigns integers in a **meaningful order** (Low 0, Medium 1, High 2) for ordered categories.',
      ] },
      { id: 'f4-outlier', q: 'How are outliers detected using the IQR method?', a: [
        'Compute Q1, Q3 and **IQR = Q3 − Q1**; values **below Q1 − 1.5·IQR or above Q3 + 1.5·IQR** are outliers. E.g. Q1 = 15, Q3 = 20, IQR = 5 → bounds 7.5 and 27.5.',
      ] },
      { id: 'f4-zscore', q: 'How is the z-score used to find outliers?', a: [
        'z = (x − μ) / σ measures how many SDs a value is from the mean; values with **|z| > 3** (sometimes 2.5) are treated as outliers.',
      ] },
      { id: 'f4-drop-fill', q: 'When should missing values be dropped and when filled?', a: [
        '**Drop** when very few rows are affected (and missing at random) or a column is mostly empty. **Fill (impute)** when dropping would lose much data: mean (symmetric numeric), median (skewed numeric), mode (categorical), forward/backward fill (time series).',
      ] },
      { id: 'f4-univariate', q: 'What is univariate analysis? Give two plots used.', a: [
        'Analysis of a **single variable** to describe its distribution (centre, spread, shape) without considering relationships. Plots: **histogram**, **box plot** (also bar or pie charts for categories).',
      ] },
      { id: 'f4-bivariate', q: 'What is bivariate analysis?', a: [
        'Analysis of **two variables together** to find the relationship between them: scatter plots and correlation (numeric–numeric), grouped box plots or t-tests (numeric–categorical), cross-tabulation or chi-square (categorical–categorical).',
      ] },
      { id: 'f4-filter', q: 'Differentiate row-wise and column-wise filtration.', a: [
        '**Row-wise** filtration keeps only the rows (records) that satisfy conditions, e.g. df[df["Age"] > 18]. **Column-wise** filtration keeps or drops columns (features), e.g. removing irrelevant or mostly-empty columns with df.drop(columns=[...]).',
      ] },
      { id: 'f4-statsmodels', q: 'Which Python functions perform a one-sample t-test?', a: [
        'scipy.stats.**ttest_1samp(data, popmean)** or statsmodels.stats.weightstats.**ztest / DescrStatsW(data).ttest_mean(value)**. They return the t-statistic and p-value; reject H₀ if p ≤ α.',
      ] },
    ],
  },
  {
    unit: 'V',
    items: [
      { id: 'f5-pca', from: 'fds-mid-pca', q: 'How does PCA help in reducing the dimensionality of a dataset?', a: [
        'PCA transforms the (standardised) correlated features into **new uncorrelated variables (principal components)** along the directions of maximum variance (eigenvectors of the covariance matrix), ordered by variance (eigenvalues). Keeping only the **top k components** that explain most of the variance (e.g. 95%) and projecting the data onto them reduces n features to k with little information loss.',
      ] },
      { id: 'f5-lin-log', from: 'fds-lin-vs-log', q: 'Differentiate linear and logistic regression.', a: [
        { table: { head: ['Linear regression', 'Logistic regression'], rows: [['Predicts a **continuous** value (price, marks)', 'Predicts a **class / probability** (spam or not)'], ['Straight line ŷ = β₀ + β₁x', 'Sigmoid σ(β₀ + β₁x), output 0–1'], ['Least squares (MSE)', 'Maximum likelihood (log-loss)'], ['Evaluated by R², MAE, RMSE', 'Evaluated by accuracy, precision, recall, AUC']] } },
      ] },
      { id: 'f5-metrics', q: 'Define MAE, MSE and RMSE.', a: [
        { formula: 'MAE = (1/n) Σ|y − ŷ|      MSE = (1/n) Σ(y − ŷ)²      RMSE = √MSE' },
        'MAE is the average absolute error; MSE penalises large errors more; RMSE is in the same units as y.',
      ] },
      { id: 'f5-r2', q: 'What does R² indicate?', a: [
        '**R² = 1 − SS_res / SS_tot**: the proportion of the variance in the dependent variable explained by the model, from 0 to 1 (higher is better). R² = 0.98 means 98% of the variation is explained.',
      ] },
      { id: 'f5-multicol', q: 'What is multicollinearity? How is it detected?', a: [
        'A situation where **independent variables are highly correlated with each other**, making regression coefficients unstable. Detected with a **correlation matrix** or the **variance inflation factor (VIF > 5–10)**; removed by dropping/combining variables, PCA or regularisation.',
      ] },
      { id: 'f5-dummy', q: 'What is the dummy variable trap?', a: [
        'Including a dummy for **every** category of a feature makes the dummies sum to 1, causing **perfect multicollinearity** with the intercept. Avoid it by using **k − 1 dummies** (drop one reference category; pd.get_dummies(drop_first=True)).',
      ] },
      { id: 'f5-poly', q: 'What is polynomial regression?', a: [
        'Regression that models a **curved relationship** by adding powers of x as features: y = β₀ + β₁x + β₂x² + … + βₙxⁿ. It is still linear in the coefficients; too high a degree causes overfitting.',
      ] },
      { id: 'f5-sigmoid', q: 'What is the sigmoid function?', a: [
        'σ(z) = **1 / (1 + e⁻ᶻ)**: an S-shaped function that maps any real number to (0, 1), so logistic regression can output a probability; σ(0) = 0.5 is the usual decision threshold.',
      ] },
      { id: 'f5-logtypes', q: 'Name the types of logistic regression.', a: [
        { ul: ['**Binary**: two classes (spam / not spam).', '**Multinomial**: three or more unordered classes (sports / politics / entertainment).', '**Ordinal**: three or more ordered classes (low / medium / high).'] },
      ] },
      { id: 'f5-kmeans', q: 'State the steps of k-means clustering.', a: [
        { ol: ['Choose k and initialise k centroids.', 'Assign each point to the nearest centroid (Euclidean distance).', 'Recompute each centroid as the mean of its points.', 'Repeat steps 2–3 until the assignments (centroids) stop changing.'] },
      ] },
      { id: 'f5-elbow', q: 'What is the elbow method?', a: [
        'A way to choose k: plot the **within-cluster sum of squares (WCSS/inertia)** against k; WCSS falls as k grows, and the **"elbow"** where the decrease slows sharply gives a good k.',
      ] },
      { id: 'f5-silhouette', q: 'Define the silhouette coefficient.', a: [
        's = (b − a) / max(a, b), where a = mean distance to points in the same cluster and b = mean distance to the nearest other cluster. It ranges from −1 to +1; values near **+1** mean well-separated, compact clusters.',
      ] },
      { id: 'f5-dendrogram', q: 'What is a dendrogram?', a: [
        'A **tree diagram** produced by hierarchical clustering that shows the order and distance at which clusters are merged (agglomerative) or split (divisive); cutting it at a chosen height gives the clusters.',
      ] },
      { id: 'f5-dbscan', q: 'Define core, border and noise points in DBSCAN.', a: [
        { ul: ['**Core point**: has at least MinPts points within radius ε.', '**Border point**: within ε of a core point but has fewer than MinPts neighbours.', '**Noise point**: neither core nor border; treated as an outlier.'] },
      ] },
      { id: 'f5-db-index', q: 'What is the Davies–Bouldin index?', a: [
        'An internal clustering metric: the average, over all clusters, of the maximum ratio of **within-cluster scatter to between-cluster separation**. **Lower values (closer to 0) indicate better** clustering.',
      ] },
    ],
  },
]
