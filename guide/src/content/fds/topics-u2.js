// Fundamentals of Data Science, Unit II (analytics techniques, statistics) and the start of Unit III
// (NumPy). Keys are syllabus ids.
export default {
  'fds.u2.analysis-analytics': {
    oneLine: 'Data analysis examines past data to find what happened and why; data analytics is the broader practice that also predicts and recommends, using tools and automation.',
    blocks: [
      { compare: [
        { title: 'Data analysis', items: ['Inspect, clean and model data to answer a question', 'Mostly looks at the past', '"Why did sales fall in March?"'] },
        { title: 'Data analytics', items: ['The whole discipline, including analysis', 'Also forecasts and recommends', '"What will sales be next quarter, and what should we do?"'] },
      ] },
      { flow: ['Descriptive: what happened?', 'Diagnostic: why did it happen?', 'Predictive: what will happen?', 'Prescriptive: what should we do?'], label: 'Four types of analytics, rising in value and difficulty' },
    ],
    terms: [['Data analysis', 'Examining data to draw conclusions.'], ['Data analytics', 'The science of analysing data, including prediction and recommendation.']],
    exam: 'Differentiate analysis and analytics, then draw the four types of analytics with the question each answers.',
    revise: ['Descriptive, diagnostic, predictive, prescriptive'],
  },

  'fds.u2.descriptive': {
    oneLine: 'Descriptive analysis summarises data: identify the variables, build frequency distributions, and measure centre (mean, median, mode) and spread.',
    blocks: [
      { h: 'Variables' },
      { tree: { root: 'Variables', kids: ['Categorical: nominal (colour), ordinal (grade A/B/C)', 'Numerical: discrete (count of children), continuous (height)'] } },
      { h: 'Frequency distribution' },
      { table: { head: ['Marks', 'Frequency', 'Relative frequency', 'Cumulative'], rows: [['0–20', '2', '0.10', '2'], ['20–40', '5', '0.25', '7'], ['40–60', '8', '0.40', '15'], ['60–80', '4', '0.20', '19'], ['80–100', '1', '0.05', '20']] } },
      'Shown as a histogram (numerical) or bar chart (categorical).',
      { code: "df['grade'].value_counts()          # frequency of each category\npd.cut(df['marks'], bins=5).value_counts().sort_index()" },
    ],
    terms: [['Frequency distribution', 'A table of how often each value or range occurs.'], ['Relative frequency', 'Frequency divided by the total count.']],
    exam: 'Classify variables, build a frequency table with relative and cumulative columns, and name the measures of centre and spread.',
    revise: ['Nominal, ordinal, discrete, continuous', 'Frequency, relative, cumulative'],
  },

  'fds.u2.diagnostic': {
    oneLine: 'Diagnostic analytics asks why something happened, by drilling down into data and finding correlations between variables.',
    blocks: [
      { flow: ['Notice a change (sales fell)', 'Drill down by region, product, time', 'Find correlated factors', 'Test the explanation'] },
      { ul: ['Techniques: drill-down, data discovery, correlation analysis, comparisons.', 'Correlation measures how strongly two variables move together, from −1 to +1.', '**Correlation is not causation**: ice-cream sales and drownings both rise in summer, because of heat.'] },
    ],
    terms: [['Drill-down', 'Breaking a total into finer parts to locate the cause.'], ['Correlation', 'A measure of how two variables vary together.']],
    exam: 'Define diagnostic analytics, list its techniques, explain correlation and give the "correlation is not causation" warning with an example.',
    revise: ['Why did it happen?', 'Drill-down, correlation'],
  },

  'fds.u2.predictive-prescriptive': {
    oneLine: 'Predictive analytics forecasts what is likely to happen using models trained on past data; prescriptive analytics recommends the best action to take.',
    blocks: [
      { compare: [
        { title: 'Predictive', items: ['What will happen?', 'Regression, classification, time-series forecasting', '"This customer has a 70% chance of leaving"'] },
        { title: 'Prescriptive', items: ['What should we do?', 'Optimisation, simulation, decision rules', '"Offer this customer a 10% discount"'] },
      ] },
      { flow: ['Past data', 'Train a model', 'Predict the future', 'Optimise the decision', 'Act'] },
    ],
    terms: [['Predictive analytics', 'Using past data to forecast future outcomes.'], ['Prescriptive analytics', 'Recommending actions to achieve the best outcome.']],
    exam: 'Explain both with techniques and a business example each, showing how prescriptive builds on predictive.',
    revise: ['Predictive: forecast', 'Prescriptive: recommend'],
  },

  'fds.u2.exploratory-mechanistic': {
    oneLine: 'Exploratory analysis looks at data with summaries and plots to find patterns before forming hypotheses; mechanistic analysis explains exactly how variables affect each other, typically with regression.',
    blocks: [
      { h: 'Exploratory data analysis (EDA)' },
      { ul: ['Summary statistics (describe()).', 'Plots: histogram, box plot, scatter plot, heatmap.', 'Look for patterns, outliers, missing values, relationships.', 'Goal: understand the data and form questions, not prove anything.'] },
      { h: 'Mechanistic analysis: regression' },
      'Mechanistic analysis seeks the exact relationship: how much y changes when x changes. **Simple linear regression** fits y = b₀ + b₁x.',
      { formula: 'b₁ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²    b₀ = ȳ − b₁x̄' },
      'Example: x = 1, 2, 3, 4, 5 and y = 2, 4, 5, 4, 5. x̄ = 3, ȳ = 4, Σ(x − x̄)(y − ȳ) = 6, Σ(x − x̄)² = 10, so b₁ = **0.6** and b₀ = 4 − 0.6 × 3 = **2.2**: y = 2.2 + 0.6x.',
    ],
    terms: [['EDA', 'Exploratory data analysis: summarising and plotting data to understand it.'], ['Regression', 'Modelling how a dependent variable changes with independent variables.']],
    exam: 'Explain EDA with its tools, then mechanistic analysis with the least-squares formulas and a small worked example.',
    revise: ['EDA: summaries and plots', 'b₁ = Sxy / Sxx; b₀ = ȳ − b₁x̄'],
  },

  'fds.u2.attributes': {
    oneLine: 'An attribute is a property of an object; attributes are nominal, binary, ordinal or numeric (interval, ratio), and either discrete or continuous.',
    blocks: [
      { table: { head: ['Type', 'Meaning', 'Example', 'Allowed operations'], rows: [
        ['Nominal', 'Names or labels, no order', 'Colour, city', '=, ≠ (mode)'],
        ['Binary', 'Two states', 'Pass/fail, smoker yes/no', 'Mode'],
        ['Ordinal', 'Ordered categories, gaps unknown', 'Grade A/B/C, size S/M/L', 'Order, median'],
        ['Interval', 'Numeric, equal gaps, no true zero', 'Temperature in °C, year', '+, −, mean'],
        ['Ratio', 'Numeric with a true zero', 'Height, salary, age', 'All, including ×, ÷'],
      ] } },
      { compare: [
        { title: 'Discrete', items: ['Countable values', 'Number of students, goals scored'] },
        { title: 'Continuous', items: ['Any value in a range', 'Height, weight, time'] },
      ] },
      { tip: 'Binary attributes are **symmetric** if both states are equally important (gender) and **asymmetric** if one matters more (a positive test result).' },
    ],
    terms: [['Nominal attribute', 'Categories with no order.'], ['Ordinal attribute', 'Categories with a meaningful order.'], ['Ratio attribute', 'A numeric attribute with a true zero point.']],
    exam: 'Classify attribute types in a table with examples and operations, and differentiate discrete and continuous.',
    revise: ['Nominal, binary, ordinal, interval, ratio', 'Discrete vs continuous'],
  },

  'fds.u2.central-tendency': {
    oneLine: 'Central tendency describes the typical value: the mean (average), the median (middle value) and the mode (most frequent value).',
    blocks: [
      { table: { head: ['Measure', 'How', 'Best for'], rows: [['Mean', 'Sum ÷ count', 'Symmetric numeric data'], ['Median', 'Middle of sorted data', 'Skewed data or outliers (salaries)'], ['Mode', 'Most frequent value', 'Categorical data']] } },
      { h: 'Worked example' },
      'Data: 2, 4, 4, 4, 5, 5, 7, 9 (n = 8).',
      { ul: ['Mean = 40 / 8 = **5**.', 'Median = average of 4th and 5th values = (4 + 5) / 2 = **4.5**.', 'Mode = **4** (appears three times).'] },
      { tip: 'One outlier pulls the mean but not the median: add 100 to the data and the mean jumps to 15.6 while the median only moves to 5.' },
      { code: "s = pd.Series([2, 4, 4, 4, 5, 5, 7, 9])\ns.mean(), s.median(), s.mode()[0]   # 5.0, 4.5, 4" },
    ],
    terms: [['Mean', 'The arithmetic average.'], ['Median', 'The middle value of sorted data.'], ['Mode', 'The most frequent value.']],
    exam: 'Define the three measures, compute them on a small data set, and state when to prefer each.',
    revise: ['Mean = sum/n', 'Median = middle', 'Mode = most frequent'],
  },

  'fds.u2.dispersion': {
    oneLine: 'Dispersion measures how spread out data is: range, quartiles and IQR, variance and standard deviation.',
    blocks: [
      { formula: 'Variance σ² = Σ(x − x̄)² / n  (sample: divide by n − 1)    SD = √variance    IQR = Q3 − Q1' },
      { h: 'Worked example (2, 4, 4, 4, 5, 5, 7, 9)' },
      { ul: ['Range = 9 − 2 = **7**.', 'Deviations from mean 5: −3, −1, −1, −1, 0, 0, 2, 4; squares sum to **32**.', 'Population variance = 32 / 8 = **4**, SD = **2**. Sample variance = 32 / 7 ≈ 4.57, SD ≈ 2.14.', 'Q1 = 4, Q3 = 6, IQR = **2**. Outlier fences: Q1 − 1.5 × IQR = 1 and Q3 + 1.5 × IQR = 9.'] },
      { tip: 'A **box plot** draws min, Q1, median, Q3 and max, so it shows centre, spread and outliers at a glance.' },
    ],
    terms: [['Variance', 'Average squared distance from the mean.'], ['Standard deviation', 'Square root of the variance, in the data\'s own units.'], ['IQR', 'Interquartile range: Q3 − Q1, the spread of the middle half.']],
    exam: 'Give the formulas, compute range, variance, SD and IQR on a small data set, and explain the box plot.',
    revise: ['Range, IQR, variance, SD', 'Sample variance divides by n − 1'],
  },

  'fds.u2.skew-kurtosis': {
    oneLine: 'Skewness measures how lopsided a distribution is; kurtosis measures how heavy its tails are (how many extreme values) compared with a normal distribution.',
    blocks: [
      { table: { head: ['Skew', 'Shape', 'Order of mean, median, mode'], rows: [['Positive (right)', 'Long tail to the right', 'Mean > median > mode'], ['Zero', 'Symmetric', 'All equal'], ['Negative (left)', 'Long tail to the left', 'Mean < median < mode']] } },
      'Income is right-skewed (a few very high earners); marks in an easy exam are left-skewed (most score high).',
      { formula: 'Pearson\'s skewness ≈ 3 (mean − median) / SD' },
      { table: { head: ['Kurtosis', 'Tails', 'Excess kurtosis'], rows: [['Mesokurtic', 'Normal', '0'], ['Leptokurtic', 'Heavy tails, sharp peak', '> 0'], ['Platykurtic', 'Light tails, flat top', '< 0']] } },
      { code: 's.skew(), s.kurt()   # pandas gives excess kurtosis' },
    ],
    terms: [['Skewness', 'A measure of asymmetry of a distribution.'], ['Kurtosis', 'A measure of tail heaviness of a distribution.']],
    exam: 'Draw the three skew shapes with mean, median and mode marked, give the formula, and explain the three kurtosis types.',
    revise: ['Right skew: mean > median', 'Leptokurtic: heavy tails'],
  },

  'fds.u2.covariance-correlation': {
    oneLine: 'Covariance shows whether two variables move together; Pearson\'s r measures the strength of a straight-line relationship from −1 to +1, and Spearman\'s ρ does the same for ranks.',
    blocks: [
      { formula: 'cov(x, y) = Σ(x − x̄)(y − ȳ) / (n − 1)    r = Σ(x − x̄)(y − ȳ) / √(Σ(x − x̄)² Σ(y − ȳ)²)' },
      { h: 'Pearson example' },
      'x = 1, 2, 3, 4, 5; y = 2, 4, 5, 4, 5. Σ(x − x̄)(y − ȳ) = 6, Σ(x − x̄)² = 10, Σ(y − ȳ)² = 6. Covariance = 6 / 4 = **1.5**; r = 6 / √60 ≈ **0.77** (fairly strong positive).',
      { h: 'Spearman\'s rank correlation' },
      { formula: 'ρ = 1 − 6Σd² / (n(n² − 1))' },
      { table: { head: ['Student', 'Maths rank', 'Physics rank', 'd', 'd²'], rows: [['A', '1', '2', '−1', '1'], ['B', '2', '1', '1', '1'], ['C', '3', '4', '−1', '1'], ['D', '4', '3', '1', '1'], ['E', '5', '5', '0', '0']] } },
      'Σd² = 4, n = 5: ρ = 1 − 24 / 120 = **0.8**.',
      { compare: [
        { title: 'Pearson', items: ['Linear relationship', 'Numeric, roughly normal data', 'Sensitive to outliers'] },
        { title: 'Spearman', items: ['Monotonic relationship (ranks)', 'Ordinal or skewed data', 'Robust to outliers'] },
      ] },
      { code: "df['x'].cov(df['y']); df['x'].corr(df['y']); df['x'].corr(df['y'], method='spearman')" },
    ],
    terms: [['Covariance', 'The joint variability of two variables; its sign shows direction.'], ['Pearson\'s r', 'Correlation for linear relationships, from −1 to 1.'], ['Spearman\'s ρ', 'Rank-based correlation for monotonic relationships.']],
    exam: 'Give the formulas, compute covariance and r on small data, compute Spearman\'s ρ from ranks, and compare the two.',
    revise: ['r between −1 and 1', 'ρ = 1 − 6Σd²/(n(n²−1))'],
  },

  'fds.u2.sampling-tests': {
    oneLine: 'A sample is a subset that represents a population; parametric tests (t-test, z-test, ANOVA) assume the data follows a distribution such as the normal and compare means.',
    blocks: [
      { tree: { root: 'Sampling methods', kids: ['Simple random', 'Stratified (sample within groups)', 'Systematic (every k-th)', 'Cluster (pick whole groups)', 'Convenience (non-random)'] } },
      { h: 'Making a random sample group column (asked)' },
      { code: "import numpy as np\ndf['sample_group'] = np.random.uniform(0, 1, len(df))   # one random number per row\ntrain = df[df['sample_group'] <= 0.8]                   # about 80%\ntest = df[df['sample_group'] > 0.8]                     # about 20%\n# or: df.sample(frac=0.8, random_state=1)" },
      { h: 'Parametric tests' },
      { table: { head: ['Test', 'Use'], rows: [['z-test', 'Compare a mean when σ is known or n is large'], ['One-sample t-test', 'Sample mean vs a known value'], ['Two-sample t-test', 'Means of two independent groups'], ['Paired t-test', 'Before and after on the same people'], ['ANOVA', 'Means of three or more groups']] } },
      'Assumptions: data roughly normal, independent observations, similar variances. If they fail, use non-parametric tests (Mann-Whitney, Wilcoxon).',
    ],
    terms: [['Population', 'The whole group of interest.'], ['Sample', 'A subset of the population used for study.'], ['Parametric test', 'A test that assumes a distribution, usually normal.']],
    exam: 'List sampling methods, show how to create a random sample column, and list the parametric tests with their assumptions.',
    revise: ['Random, stratified, systematic, cluster', 't-test, z-test, ANOVA assume normality'],
  },

  'fds.u2.distributions': {
    oneLine: 'Four common distributions: uniform (all values equally likely), normal (bell curve), exponential (waiting times) and binomial (number of successes in n trials).',
    blocks: [
      { table: { head: ['Distribution', 'Shape and use', 'Key formula'], rows: [
        ['Uniform (a, b)', 'Flat: every value equally likely (a fair die, random number)', 'Mean = (a + b)/2'],
        ['Normal (μ, σ)', 'Symmetric bell; heights, exam scores', '68% within 1σ, 95% within 2σ, 99.7% within 3σ'],
        ['Exponential (λ)', 'Waiting time between events', 'P(X > t) = e^(−λt), mean = 1/λ'],
        ['Binomial (n, p)', 'Count of successes in n yes/no trials', 'P(X = k) = C(n, k) p^k (1 − p)^(n − k)'],
      ] } },
      { h: 'Worked examples' },
      { ul: ['Binomial: 5 coin tosses, P(exactly 2 heads) = C(5, 2) × 0.5⁵ = 10 / 32 = **0.3125**.', 'Normal: marks with mean 60 and SD 10: about 95% of students score between 40 and 80.', 'Exponential: buses every 10 minutes on average (λ = 0.1): P(wait > 5 min) = e^(−0.5) ≈ **0.61**.'] },
      { code: 'from scipy import stats\nstats.binom.pmf(2, 5, 0.5)     # 0.3125\nstats.norm.cdf(80, 60, 10)     # P(X <= 80)\nstats.expon.sf(5, scale=10)    # P(X > 5)' },
    ],
    terms: [['Normal distribution', 'A symmetric bell-shaped distribution set by mean and SD.'], ['Binomial distribution', 'The number of successes in n independent yes/no trials.'], ['Exponential distribution', 'The time between events that occur at a constant rate.']],
    exam: 'Describe each distribution with its shape, use and formula, and solve one numeric example for each.',
    revise: ['68-95-99.7 rule', 'Binomial: C(n,k)p^k(1−p)^(n−k)', 'Exponential: P(X>t) = e^(−λt)'],
  },

  'fds.u2.cdf': {
    oneLine: 'The cumulative distribution function F(x) = P(X ≤ x) gives the probability of a value up to x; descriptive statistics summarise data with centre, spread and shape.',
    blocks: [
      { formula: 'F(x) = P(X ≤ x)    P(a < X ≤ b) = F(b) − F(a)' },
      { ul: ['F rises from 0 to 1 and never goes down.', 'For a die: F(3) = P(X ≤ 3) = 3/6 = **0.5**.', 'For a normal distribution, F(μ) = 0.5.', 'Percentiles come from the CDF: the median is where F(x) = 0.5.'] },
      { h: 'Descriptive statistics' },
      { tree: { root: 'Descriptive statistics', kids: ['Centre: mean, median, mode', 'Spread: range, IQR, SD', 'Shape: skewness, kurtosis', 'Position: percentiles, quartiles'] } },
      { code: "df['marks'].describe()   # count, mean, std, min, 25%, 50%, 75%, max" },
    ],
    terms: [['CDF', 'Cumulative distribution function: P(X ≤ x).'], ['Percentile', 'The value below which a given percentage of data falls.']],
    exam: 'Define the CDF with its properties and an example, then summarise what descriptive statistics measure and show describe().',
    revise: ['F(x) = P(X ≤ x), from 0 to 1', 'Centre, spread, shape, position'],
  },

  'fds.u3.numpy-arrays': {
    oneLine: 'A NumPy array (ndarray) is a fast, fixed-type, multi-dimensional grid of numbers; its dtype (int64, float64, bool…) sets how each element is stored.',
    blocks: [
      { code: "import numpy as np\na = np.array([1, 2, 3])            # from a list\nb = np.zeros((2, 3)); c = np.ones(4); d = np.arange(0, 10, 2)\ne = np.linspace(0, 1, 5)          # 5 evenly spaced values\na.ndim, a.shape, a.size, a.dtype  # 1, (3,), 3, int64" },
      { compare: [
        { title: 'Python list', items: ['Any mix of types', 'Slow loops', 'More memory'] },
        { title: 'NumPy array', items: ['One fixed type', 'Fast vectorised maths (written in C)', 'Compact memory'] },
      ] },
      { h: 'Numerical data types' },
      { table: { head: ['Type', 'Meaning'], rows: [['int8, int16, int32, int64', 'Signed integers of 8 to 64 bits'], ['uint8…', 'Unsigned integers'], ['float16, float32, float64', 'Decimal numbers'], ['complex64, complex128', 'Complex numbers'], ['bool', 'True / False']] } },
    ],
    terms: [['ndarray', 'NumPy\'s n-dimensional array object.'], ['dtype', 'The data type of every element in an array.'], ['Vectorisation', 'Applying an operation to a whole array without a Python loop.']],
    exam: 'Show ways to create arrays, list the attributes (ndim, shape, size, dtype), compare with lists, and list the numeric dtypes.',
    revise: ['array, zeros, ones, arange, linspace', 'ndim, shape, size, dtype'],
  },

  'fds.u3.shapes': {
    oneLine: 'Array shapes are changed with reshape (new shape, same data), ravel/flatten (to 1-D), transpose (swap axes) and resize.',
    blocks: [
      { code: "a = np.arange(12)          # [0 ... 11]\nb = a.reshape(3, 4)        # 3 rows, 4 columns\nb.ravel()                  # back to 1-D (a view if possible)\nb.flatten()                # 1-D copy\nb.T.shape                  # (4, 3) transpose\na.reshape(2, -1).shape     # (2, 6): -1 means 'work it out'\nb.shape = (6, 2)           # change shape in place" },
      { tip: 'The total number of elements must stay the same: 12 elements can be (3, 4), (2, 6), (12,) but not (5, 3).' },
    ],
    terms: [['reshape', 'Return the same data with a new shape.'], ['ravel', 'Flatten to 1-D, returning a view when possible.'], ['Transpose', 'Swap rows and columns.']],
    exam: 'Explain reshape, ravel vs flatten, transpose and resize with a small example each.',
    revise: ['reshape keeps size', 'ravel = view, flatten = copy'],
  },

  'fds.u3.stacking-splitting': {
    oneLine: 'Stacking joins arrays (hstack side by side, vstack on top, dstack in depth, concatenate along an axis); partitioning splits them (hsplit, vsplit, split).',
    blocks: [
      { code: "a = np.array([[1, 2], [3, 4]]); b = np.array([[5, 6], [7, 8]])\nnp.hstack((a, b))     # [[1 2 5 6] [3 4 7 8]]\nnp.vstack((a, b))     # [[1 2] [3 4] [5 6] [7 8]]\nnp.dstack((a, b)).shape   # (2, 2, 2)\nnp.concatenate((a, b), axis=0)  # same as vstack\n\nc = np.arange(12).reshape(3, 4)\nnp.hsplit(c, 2)       # two arrays of shape (3, 2)\nnp.vsplit(c, 3)       # three arrays of shape (1, 4)\nnp.split(c, [1], axis=1)  # split after column 1" },
    ],
    terms: [['hstack / vstack', 'Join arrays horizontally / vertically.'], ['hsplit / vsplit', 'Split arrays into column / row blocks.']],
    exam: 'Show each stacking and splitting function with input and output arrays.',
    revise: ['hstack, vstack, dstack, concatenate', 'hsplit, vsplit, split'],
  },

  'fds.u3.dtype-views': {
    oneLine: 'astype() converts an array to a new data type (a new copy); a view shares the same data as the original, while copy() makes an independent array.',
    blocks: [
      { code: "a = np.array([1.7, 2.2, 3.9])\na.astype(int)          # [1 2 3] new array, values truncated\n\nb = np.arange(5)\nv = b.view()           # or slicing: v = b[1:4]\nv[0] = 99              # b changes too (shared data)\nc = b.copy()\nc[0] = -1              # b does NOT change\nv.base is b            # True: v is a view" },
      { compare: [
        { title: 'View', items: ['Shares memory with the original', 'Changing it changes the original', 'Fast; made by slicing, view(), reshape'] },
        { title: 'Copy', items: ['Its own memory', 'Changes stay separate', 'Made by copy(), fancy indexing, astype()'] },
      ] },
    ],
    terms: [['View', 'A new array object looking at the same data.'], ['Copy', 'An independent array with its own data.'], ['astype', 'Converts the array to another dtype.']],
    exam: 'Explain astype with an example, then views vs copies with code showing that changing a view changes the original.',
    revise: ['Slices are views', 'copy() and fancy indexing make copies'],
  },

  'fds.u3.slicing-indexing': {
    oneLine: 'NumPy arrays are sliced like lists (start:stop:step, per axis), filtered with boolean masks (a[a > 5]) and picked with lists of indices (fancy indexing).',
    blocks: [
      { code: "a = np.arange(12).reshape(3, 4)\n# [[ 0  1  2  3]\n#  [ 4  5  6  7]\n#  [ 8  9 10 11]]\na[1, 2]        # 6\na[0:2, 1:3]    # [[1 2] [5 6]]\na[:, 0]        # first column [0 4 8]\na[::-1]        # rows reversed\n\na[a > 5]       # boolean indexing: [ 6  7  8  9 10 11]\na[a % 2 == 0] = 0   # set all even values to 0\n\na[[0, 2]]      # fancy indexing: rows 0 and 2\na[[0, 2], [1, 3]]   # elements (0,1) and (2,3): [1 11]" },
      { tip: 'Slicing returns a **view**; boolean and fancy indexing return **copies**.' },
    ],
    terms: [['Boolean indexing', 'Selecting elements with a True/False mask.'], ['Fancy indexing', 'Selecting elements with arrays or lists of indices.']],
    exam: 'Show 2-D slicing, boolean indexing and fancy indexing on a small array with outputs, and note view vs copy.',
    revise: ['a[r, c], a[r1:r2, c1:c2]', 'a[a > 5]', 'a[[0, 2]]'],
  },

  'fds.u3.broadcasting': {
    oneLine: 'Broadcasting lets NumPy do maths on arrays of different shapes by stretching the smaller one along dimensions of size 1, without copying data.',
    blocks: [
      { h: 'Rules (compare shapes from the right)' },
      { steps: ['If the arrays have different numbers of dimensions, pad the smaller shape with 1s on the left.', 'Two dimensions are compatible if they are equal or one of them is 1.', 'Size-1 dimensions are stretched to match. Otherwise: error.'] },
      { code: "a = np.arange(12).reshape(3, 4)\na + 10                    # scalar broadcast to every element\na + np.array([1, 2, 3, 4])        # (3,4) + (4,) → each row\na + np.array([[10], [20], [30]])  # (3,4) + (3,1) → each column\nnp.ones((3, 1)) + np.arange(4)    # (3,1) + (4,) → (3,4)\n# np.ones((3, 4)) + np.ones(3)    # error: 4 vs 3" },
      { table: { head: ['Shape A', 'Shape B', 'Result'], rows: [['(3, 4)', '(4,)', '(3, 4)'], ['(3, 4)', '(3, 1)', '(3, 4)'], ['(3, 1)', '(1, 4)', '(3, 4)'], ['(3, 4)', '(3,)', 'Error']] } },
    ],
    terms: [['Broadcasting', 'Automatic stretching of arrays with compatible shapes in arithmetic.']],
    exam: 'State the broadcasting rules, show three valid examples with result shapes and one that fails.',
    revise: ['Compare from the right', 'Equal or 1 is compatible'],
  },
}
