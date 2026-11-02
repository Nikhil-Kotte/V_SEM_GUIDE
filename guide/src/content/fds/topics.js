// Fundamentals of Data Science — Mid-2 notes. Keys are syllabus ids from content/syllabus.js.
export default {
  // ======================= UNIT III (rest) — pandas =======================
  'fds.u3.dataframes': {
    oneLine: 'A DataFrame is pandas\' table: rows with an index, named columns, and each column can hold a different type — like a spreadsheet you can program.',
    blocks: [
      { h: 'Ways to create a DataFrame' },
      { code: `import pandas as pd
import numpy as np

# 1. from a dictionary of lists (keys become columns)
df = pd.DataFrame({"name": ["Megha", "Anil", "Sneha"], "marks": [88, 56, 81]})

# 2. from a list of dictionaries (one per row)
df = pd.DataFrame([{"name": "Megha", "marks": 88}, {"name": "Anil", "marks": 56}])

# 3. from a list of lists with column names
df = pd.DataFrame([["Megha", 88], ["Anil", 56]], columns=["name", "marks"])

# 4. from a NumPy array
df = pd.DataFrame(np.random.randint(0, 100, (3, 2)), columns=["maths", "physics"])

# 5. from a file
df = pd.read_csv("students.csv")      # also read_excel, read_json, read_sql` },
      { h: 'Working with it' },
      { code: `df["grade"] = np.where(df["marks"] >= 40, "PASS", "FAIL")   # new column
df.loc[0, "marks"]          # by label
df.iloc[0, 1]               # by position
df[df["marks"] > 80]        # boolean filter
df.sort_values("marks", ascending=False)` },
    ],
    terms: [['Index', 'Row labels of a DataFrame.'], ['loc / iloc', 'Select by label / by integer position.']],
    exam: 'Show 4–5 creation methods with code, then loc/iloc and filtering.',
    revise: ['pd.DataFrame(dict | list of dicts | list of lists | ndarray)', 'loc = labels, iloc = positions'],
  },

  'fds.u3.series': {
    oneLine: 'A Series is a single labelled column of data — a one-dimensional array with an index; a DataFrame is a collection of Series sharing the same index.',
    blocks: [
      { code: `s = pd.Series([88, 56, 81], index=["Megha", "Anil", "Sneha"], name="marks")
s["Anil"]            # 56   (label access)
s[s > 60]            # boolean filtering
s.mean(), s.max()    # vectorised statistics
s + 5                # applies to every element
pd.Series({"a": 1, "b": 2})   # from a dict` },
      { table: { head: ['', 'NumPy array', 'Series', 'DataFrame'], rows: [['Dimensions', 'n-D', '1-D', '2-D'], ['Labels', 'Positions only', 'Index labels', 'Index + column names'], ['Types', 'One dtype', 'One dtype', 'One dtype per column'], ['Missing data', 'Only NaN for floats', 'NaN aware', 'NaN aware']] } },
      'Selecting one column of a DataFrame (`df["marks"]`) gives a Series; operations between Series align automatically by index label.',
    ],
    terms: [['Series', 'Labelled 1-D array.'], ['Index alignment', 'Operations match values by label, not position.']],
    exam: 'Define Series, create one from a list and a dict, show label access and vector operations, then compare with NumPy arrays and DataFrames.',
    revise: ['Series = 1-D labelled; DataFrame = dict of Series'],
  },

  'fds.u3.quandl': {
    oneLine: 'Quandl (now Nasdaq Data Link) is an online source of financial and economic datasets that you can pull straight into a pandas DataFrame with an API call, then query like any other DataFrame.',
    blocks: [
      { code: `# pip install quandl   (newer package: nasdaqdatalink)
import quandl
quandl.ApiConfig.api_key = "YOUR_KEY"

df = quandl.get("WIKI/AAPL", start_date="2016-01-01", end_date="2016-12-31")
df.head()                     # Open, High, Low, Close, Volume …, indexed by Date
df.shape, df.columns
df["Close"].describe()

# querying
df[df["Close"] > 115]                         # boolean condition
df.query("Volume > 50_000_000 and Close < 100")
df.loc["2016-06"]                             # all rows in June 2016 (date index)
df["Close"].resample("M").mean()              # monthly average` },
      'The returned DataFrame has a **DatetimeIndex**, so date slicing and resampling work directly.',
      { note: 'Quandl\'s free WIKI dataset is no longer updated; in practice, save a CSV and use `pd.read_csv(..., parse_dates=["Date"], index_col="Date")` the same way.' },
    ],
    terms: [['API key', 'Personal token that authorises data downloads.'], ['query()', 'Filter rows using a string expression.']],
    exam: 'Show the import, quandl.get with a dataset code and dates, then 3–4 query examples.',
    revise: ['quandl.get("DB/CODE", start_date, end_date) → DataFrame with date index', 'Query with boolean masks, query(), loc[date]'],
  },

  'fds.u3.describe': {
    oneLine: 'Describing a DataFrame means quickly summarising it — its size, column types, missing values and basic statistics — before any analysis.',
    blocks: [
      { table: { head: ['Method', 'Tells you'], rows: [
        ['`df.shape`', '(rows, columns)'], ['`df.head(n)` / `df.tail(n)`', 'First / last n rows'], ['`df.info()`', 'Column names, dtypes, non-null counts, memory'],
        ['`df.describe()`', 'count, mean, std, min, 25%, 50%, 75%, max for numeric columns'], ['`df.describe(include="object")`', 'count, unique, top, freq for text columns'],
        ['`df.dtypes`, `df.columns`', 'Types and names'], ['`df["col"].value_counts()`', 'Frequency of each value'], ['`df.isnull().sum()`', 'Missing values per column'], ['`df.nunique()`', 'Distinct values per column'],
      ] } },
      { code: `df.describe()
#          marks      gpa  attendance
# count  10.000   10.000      10.000
# mean   75.700    7.570      84.600
# std    15.847    1.585      12.851
# min    45.000    4.500      60.000
# 50%    79.500    7.950      89.500
# max    94.000    9.400      98.000` },
    ],
    terms: [['describe()', 'Summary statistics of each column.'], ['info()', 'Structure: types and non-null counts.']],
    exam: 'List the methods in a table and show sample describe() output with what each row means.',
    revise: ['shape, head, info, describe, dtypes, value_counts, isnull().sum()'],
  },

  'fds.u3.group-join': {
    oneLine: 'groupby splits rows into groups, applies a calculation to each and combines the results; merge/join combines two DataFrames on matching keys like SQL joins.',
    blocks: [
      { h: 'Grouping: split → apply → combine' },
      { code: `df.groupby("department")["marks"].mean()
df.groupby("department").agg(students=("name", "count"),
                             avg_marks=("marks", "mean"),
                             top=("marks", "max"))
df.groupby(["department", "gender"])["marks"].mean()` },
      { h: 'Joining' },
      { code: `pd.merge(left, right, on="EmpNr", how="inner")   # only matching keys
pd.merge(left, right, on="EmpNr", how="outer")   # all keys, NaN where missing
pd.merge(left, right, on="EmpNr", how="left")    # all rows of left
pd.merge(left, right, on="EmpNr", how="right")   # all rows of right
left.join(right, how="left")                     # join on index
pd.concat([df1, df2])                            # stack rows (axis=1 for columns)` },
      { img: 'fds-inner' },
      { img: 'fds-outer' },
      { table: { head: ['how=', 'Keeps'], rows: [['inner', 'Keys in both'], ['left', 'All keys of the left table'], ['right', 'All keys of the right table'], ['outer', 'All keys of both']] } },
    ],
    terms: [['groupby', 'Split-apply-combine operation.'], ['merge', 'SQL-style join on columns.']],
    exam: 'Explain split-apply-combine with a groupby example, then the 4 join types with a small two-table example and outputs.',
    revise: ['groupby(col).agg(...)', 'merge how = inner / left / right / outer', 'concat stacks'],
  },

  'fds.u3.missing-pandas': {
    oneLine: 'pandas marks missing data as NaN (or None/NaT); you find it with isnull(), remove it with dropna(), or fill it with fillna().',
    blocks: [
      { code: `df.isnull()              # True where missing
df.isnull().sum()        # count per column
df.notnull()

df.dropna()                      # drop rows with any NaN
df.dropna(how="all")             # only rows where everything is NaN
df.dropna(subset=["marks"])      # only check some columns
df.dropna(axis=1)                # drop columns instead
df.dropna(thresh=3)              # keep rows with at least 3 non-NaN values

df.fillna(0)                                  # constant
df["marks"].fillna(df["marks"].mean())        # mean / median
df["dept"].fillna(df["dept"].mode()[0])       # most frequent
df.fillna(method="ffill")                     # copy previous value (ffill/bfill)
df.interpolate()                              # estimate between neighbours` },
    ],
    terms: [['NaN', 'Not a Number: pandas\' missing-value marker.'], ['ffill', 'Forward fill: use the previous valid value.']],
    exam: 'Detect → drop → fill, with code for each.',
    revise: ['isnull().sum() → dropna() / fillna()', 'Fill with mean, median, mode, ffill, interpolate'],
  },

  'fds.u3.pivot': {
    oneLine: 'A pivot table reshapes data into a grid: one column\'s values become rows, another\'s become columns, and the cells hold an aggregate such as the mean.',
    blocks: [
      { code: `pd.pivot_table(df, values="marks", index="department",
               columns="gender", aggfunc="mean", fill_value=0, margins=True)` },
      { img: 'fds-pivot' },
      { ul: ['`values`: what to aggregate.', '`index`: rows.', '`columns`: column headers.', '`aggfunc`: mean (default), sum, count, max, or a list.', '`margins=True`: adds an "All" total row and column.'] },
      'Related: `df.pivot()` reshapes without aggregation (needs unique index/column pairs); `pd.crosstab()` counts frequencies; `melt()` does the reverse (wide → long).',
    ],
    terms: [['Pivot table', 'Aggregated summary grid of one variable by two others.'], ['melt', 'Unpivot: wide → long format.']],
    exam: 'Write the pivot_table call with each argument explained and show the output grid.',
    revise: ['pivot_table(values, index, columns, aggfunc)', 'pivot (no aggregation), crosstab (counts), melt (reverse)'],
  },

  'fds.u3.dates': {
    oneLine: 'pandas turns text dates into real datetime values so you can extract parts (year, month, weekday), filter by date ranges, and resample time series.',
    blocks: [
      { code: `df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y")
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month_name()
df["weekday"] = df["date"].dt.day_name()

pd.date_range("2026-01-01", periods=7, freq="D")   # generate dates
df.set_index("date", inplace=True)
df.loc["2026-03"]                                   # all of March
df.loc["2026-01-01":"2026-01-31"]                   # a range
df["sales"].resample("M").sum()                     # monthly totals
df["sales"].rolling(7).mean()                       # 7-day moving average
(df.index[1] - df.index[0]).days                    # Timedelta arithmetic` },
      'Key types: **Timestamp** (one moment), **DatetimeIndex** (index of dates), **Timedelta** (a duration), **Period** (a span like a month).',
    ],
    terms: [['to_datetime', 'Parse strings into datetime values.'], ['resample', 'Group a time series by time periods.']],
    exam: 'Parse with to_datetime, extract parts with .dt, generate with date_range, filter by date index and resample.',
    revise: ['to_datetime, .dt.year/.month/.day_name()', 'date_range, resample("M"), rolling'],
  },

  // ======================= UNIT IV =======================
  'fds.u4.cleaning': {
    oneLine: 'Data cleaning turns raw, messy data into reliable data — exploring it first, then filtering out noise row-wise and column-wise, fixing formats, duplicates, missing values and outliers.',
    blocks: [
      { img: 'fds-iv4' },
      { h: 'Exploring the data first' },
      '`head()`, `info()`, `describe()`, `value_counts()`, `isnull().sum()`, `duplicated().sum()`, quick plots — to see what is wrong before changing anything.',
      { h: 'Filtering to weed out noise' },
      { compare: [
        { title: 'Column-wise filtration', items: ['Drop columns that are irrelevant (IDs, free text)', 'Drop columns with too many missing values', 'Drop constant or near-constant columns', '`df.drop(columns=[...])`, `df.loc[:, df.isnull().mean() < 0.5]`'] },
        { title: 'Row-wise filtration', items: ['Remove duplicate rows: `drop_duplicates()`', 'Remove impossible values: `df[df["age"].between(0, 100)]`', 'Remove rows with critical missing values', 'Filter by conditions: `df.query("marks >= 0")`'] },
      ] },
      { h: 'Other cleaning steps' },
      'Fix data types (`astype`, `to_datetime`), standardise text (`str.strip().str.lower()`), correct inconsistent labels ("CSE" vs "cse"), handle missing values and outliers, encode categorical data.',
    ],
    terms: [['Noise', 'Errors or irrelevant variation in data.'], ['Duplicate', 'A repeated record.']],
    exam: 'Define data cleaning, list the steps (figure), then column-wise vs row-wise filtration with code.',
    revise: ['Explore → filter columns → filter rows → fix types → missing → outliers → encode'],
  },

  'fds.u4.missing': {
    oneLine: 'Missing values are handled by dropping them (if few and random) or filling them (imputation) with a sensible value — each choice changes the analysis in different ways.',
    blocks: [
      { h: 'Why values go missing' },
      '**MCAR** (completely at random), **MAR** (depends on other observed data), **MNAR** (depends on the missing value itself, e.g. high earners skip "income").',
      { table: { head: ['Method', 'When to use', 'Effect on analysis'], rows: [
        ['Drop rows (`dropna`)', 'Few missing, MCAR', 'Loses data; can bias results if not random'],
        ['Drop column', 'Mostly missing', 'Loses a variable'],
        ['Mean imputation', 'Numeric, roughly symmetric', 'Keeps mean; **shrinks variance** and weakens correlations'],
        ['Median imputation', 'Numeric, skewed or with outliers', 'Robust; still reduces spread'],
        ['Mode imputation', 'Categorical', 'Over-represents the most common category'],
        ['Forward/backward fill', 'Time series', 'Assumes values persist'],
        ['Interpolation', 'Ordered/time data', 'Smooth estimates'],
        ['Model-based (KNN, regression)', 'When patterns exist', 'Most accurate, more complex'],
      ] } },
      { code: `df["age"].fillna(df["age"].median(), inplace=True)
df["dept"].fillna(df["dept"].mode()[0], inplace=True)
from sklearn.impute import SimpleImputer, KNNImputer
df[["marks"]] = SimpleImputer(strategy="mean").fit_transform(df[["marks"]])` },
    ],
    terms: [['Imputation', 'Replacing missing values with estimates.'], ['MCAR', 'Missing completely at random.']],
    exam: 'Types of missingness, then a table of methods with their effect on the analysis, plus code.',
    revise: ['Drop if few/random; fill with mean/median/mode/ffill/model', 'Mean imputation reduces variance'],
  },

  'fds.u4.outliers': {
    oneLine: 'Outliers are values far away from the rest; find them with box plots, the IQR rule or Z-scores, then remove, cap or keep them depending on whether they are errors or real.',
    blocks: [
      { img: 'fds-iv26' },
      { h: 'IQR rule' },
      { formula: 'IQR = Q3 − Q1   •   outlier if x < Q1 − 1.5·IQR or x > Q3 + 1.5·IQR' },
      'Example: Q1 = 60, Q3 = 85 → IQR = 25 → fences 22.5 and 122.5 → a mark of 10 is an outlier.',
      { h: 'Z-score rule' },
      { formula: 'z = (x − μ) / σ   •   outlier if |z| > 3' },
      { code: `q1, q3 = df["marks"].quantile([0.25, 0.75])
iqr = q3 - q1
mask = df["marks"].between(q1 - 1.5 * iqr, q3 + 1.5 * iqr)
clean = df[mask]

from scipy import stats
df[(abs(stats.zscore(df["marks"])) < 3)]` },
      { h: 'Handling' },
      { ul: ['**Remove** if they are data-entry errors.', '**Cap / winsorise** at the fences (`clip`).', '**Transform** (log) to reduce skew.', '**Keep** if genuine (e.g. fraud cases are exactly what you want to find).'] },
    ],
    terms: [['IQR', 'Interquartile range Q3 − Q1.'], ['Z-score', 'Number of standard deviations from the mean.']],
    exam: 'Define outliers, explain box plot, IQR and Z-score methods with formulas and a numeric example, then handling options.',
    revise: ['IQR fences: Q1 − 1.5·IQR, Q3 + 1.5·IQR', '|z| > 3 → outlier', 'Remove / cap / transform / keep'],
  },

  'fds.u4.encoding': {
    oneLine: 'Machine-learning models need numbers, so categorical columns are encoded: one-hot for unordered categories, label/ordinal encoding when categories have an order.',
    blocks: [
      { table: { head: ['Method', 'How', 'Use when', 'Example'], rows: [
        ['**One-hot**', 'One 0/1 column per category', 'Nominal (no order): city, department', 'dept=CSE → CSE=1, ECE=0, IT=0'],
        ['**Label**', 'Each category → an integer (alphabetical)', 'Target labels, tree models', 'CSE→0, ECE→1, IT→2'],
        ['**Ordinal**', 'Integers in a meaningful order you choose', 'Ordered categories', 'Low→0, Medium→1, High→2'],
      ] } },
      { code: `pd.get_dummies(df, columns=["gender"], drop_first=True, dtype=int)   # one-hot

from sklearn.preprocessing import LabelEncoder, OrdinalEncoder, OneHotEncoder
df["dept_code"] = LabelEncoder().fit_transform(df["dept"])
enc = OrdinalEncoder(categories=[["Low", "Medium", "High"]])
df[["risk"]] = enc.fit_transform(df[["risk"]])` },
      { warn: 'Label-encoding a nominal feature (CSE=0, ECE=1, IT=2) makes a linear model think IT > ECE > CSE. Use one-hot for unordered categories.' },
    ],
    terms: [['Nominal', 'Categories with no order.'], ['Ordinal', 'Categories with a natural order.']],
    exam: 'Explain all three with a small before/after table and code; state when to use each.',
    revise: ['One-hot: nominal; label: targets/trees; ordinal: ordered', 'get_dummies(drop_first=True)'],
  },

  'fds.u4.correlation': {
    oneLine: 'Correlation measures how strongly two numeric variables move together (−1 to +1); univariate, bivariate and multivariate analysis study one, two or many variables at a time.',
    blocks: [
      { h: 'Types of analysis' },
      { table: { head: ['Analysis', 'Studies', 'Tools'], rows: [
        ['**Univariate**', 'One variable: its distribution, centre, spread', 'Mean, median, mode, std, histogram, box plot, value_counts'],
        ['**Bivariate**', 'Relationship between two variables', 'Scatter plot, correlation, cross-tab, grouped bar chart'],
        ['**Multivariate**', 'Three or more variables together', 'Correlation heatmap, pair plot, grouped analysis, PCA, regression'],
      ] } },
      { h: 'Correlation' },
      { img: 'fds-iv52' },
      { ul: ['**Pearson r**: linear relationship between numeric variables.', '**Spearman ρ**: monotonic relationship using ranks (robust to outliers).', 'r = +1 perfect positive, −1 perfect negative, 0 no linear relationship.', '**Correlation is not causation.**'] },
      { code: `df["marks"].corr(df["attendance"])     # one pair
df.corr(numeric_only=True)              # matrix
import seaborn as sns
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")` },
      { img: 'fds-iv64' },
    ],
    terms: [['Pearson r', 'Linear correlation coefficient.'], ['Heatmap', 'Colour-coded correlation matrix.']],
    exam: 'Define the three types of analysis with tools each, then correlation (range, types, scatter patterns) and a heatmap snippet.',
    revise: ['Uni = one; bi = two; multi = many', 'r in [−1, 1]; correlation ≠ causation'],
  },

  'fds.u4.titanic': {
    oneLine: 'The Titanic dataset is the classic example for multivariate analysis: survival is studied together with sex, class, age and fare to find which factors mattered.',
    blocks: [
      { code: `import seaborn as sns
titanic = sns.load_dataset("titanic")

titanic["survived"].mean()                                   # univariate: ~38% survived
titanic.groupby("sex")["survived"].mean()                    # bivariate: female ~74%, male ~19%
titanic.groupby("pclass")["survived"].mean()                 # 1st ~63%, 2nd ~47%, 3rd ~24%
pd.pivot_table(titanic, values="survived", index="sex",
               columns="pclass", aggfunc="mean")             # multivariate: sex × class
sns.heatmap(titanic.select_dtypes("number").corr(), annot=True)
sns.catplot(data=titanic, x="pclass", y="survived", hue="sex", kind="bar")` },
      { h: 'Insights' },
      { ul: ['Women survived far more than men ("women and children first").', 'First-class passengers survived more than third class.', 'Combining both: almost all first-class women survived; most third-class men did not.', 'Fare is positively correlated with survival (it reflects class).', 'Children had higher survival than adults.'] },
      'Multivariate analysis shows how factors **interact**: class alone or sex alone hides how strong the combined effect is.',
    ],
    terms: [['Pair plot', 'Grid of scatter plots for every pair of variables.']],
    exam: 'Load, show 3–4 analyses (univariate, bivariate, a pivot by two factors, heatmap) and write 4–5 insights.',
    revise: ['Sex and class drive survival', 'Pivot sex × pclass shows interaction'],
  },

  'fds.u4.hypothesis': {
    oneLine: 'Hypothesis testing uses sample data to decide whether there is enough evidence to reject a default assumption (the null hypothesis) about a population.',
    blocks: [
      { h: 'The principle' },
      { steps: ['State **H₀** (null: no effect / no difference) and **H₁** (alternative: there is an effect).', 'Choose the significance level **α** (usually 0.05).', 'Pick the test (z, t, chi-square, ANOVA…) and compute the **test statistic** from the sample.', 'Find the **p-value**: the probability of seeing a result this extreme if H₀ were true.', '**Decide**: p ≤ α → reject H₀; p > α → fail to reject H₀.'] },
      { h: 'Errors' },
      { table: { head: ['', 'H₀ true', 'H₀ false'], rows: [['Reject H₀', '**Type I error** (false positive), probability α', 'Correct'], ['Fail to reject H₀', 'Correct', '**Type II error** (false negative), probability β']] } },
      { h: 'Types of hypothesis tests' },
      { ul: ['**One-tailed** (H₁: μ > 10) vs **two-tailed** (H₁: μ ≠ 10).', '**z-test**: large samples, known σ.', '**t-test**: small samples, unknown σ (one-sample, independent two-sample, paired).', '**Chi-square test**: association between categorical variables.', '**ANOVA**: compare means of 3+ groups.'] },
      { h: 'Average reading time example (statsmodels)' },
      'Claim: the average time to read an article is **10 minutes**. We record 30 readers and test it.',
      { code: `import numpy as np
from statsmodels.stats.weightstats import ztest, DescrStatsW

times = np.array([...])                       # 30 observed reading times
z, p = ztest(times, value=10)                 # H0: mean = 10
t, p_t, dof = DescrStatsW(times).ttest_mean(10)
print(p)
if p < 0.05: print("Reject H0: mean reading time differs from 10 min")
else:        print("Fail to reject H0")` },
      '`statsmodels` is a Python library for statistical models and tests: regression (OLS, logistic), t/z tests, ANOVA, time series, with detailed summary tables.',
    ],
    terms: [['p-value', 'Probability of the observed (or more extreme) result if H₀ is true.'], ['α', 'Significance level: the accepted risk of a Type I error.']],
    exam: 'Write the 5 steps, the error table, test types, and a worked example with the decision rule.',
    revise: ['p ≤ α → reject H₀', 'Type I = false positive (α); Type II = false negative (β)', 'z (large n), t (small n), chi-square (categories), ANOVA (3+ means)'],
  },

  'fds.u4.ttest': {
    oneLine: 'A t-test checks whether a mean (or the difference between two means) is significantly different, when samples are small and the population standard deviation is unknown.',
    blocks: [
      { table: { head: ['Type', 'Question', 'scipy'], rows: [
        ['**One-sample**', 'Is the sample mean different from a known value?', '`ttest_1samp(x, popmean)`'],
        ['**Independent two-sample**', 'Do two separate groups have different means?', '`ttest_ind(a, b)`'],
        ['**Paired**', 'Did the same subjects change (before/after)?', '`ttest_rel(before, after)`'],
      ] } },
      { formula: 'One-sample: t = (x̄ − μ₀) / (s / √n),  degrees of freedom = n − 1' },
      { h: 'Worked example' },
      'A teacher claims the class average is 70. A sample of 9 students: mean 74, s = 6. t = (74 − 70) / (6/√9) = 4 / 2 = **2.0**, df = 8. Critical t (two-tailed, α = 0.05) ≈ 2.306. Since 2.0 < 2.306, **fail to reject H₀**: no significant difference.',
      { code: `from scipy import stats
stats.ttest_1samp(marks, 70)
stats.ttest_ind(cse_marks, ece_marks, equal_var=False)   # Welch's t-test
stats.ttest_rel(before, after)` },
      'Assumptions: roughly normal data (or n ≥ 30), independent observations, and for the classic two-sample test, similar variances.',
    ],
    terms: [['Degrees of freedom', 'n − 1 for a one-sample t-test.'], ['Paired t-test', 'Compares two measurements on the same subjects.']],
    exam: 'Types table, formula, and a numeric one-sample example with the decision.',
    revise: ['t = (x̄ − μ₀)/(s/√n), df = n − 1', 'One-sample, independent, paired'],
  },

  // ======================= UNIT V =======================
  'fds.u5.linear': {
    oneLine: 'Regression predicts a continuous number; linear regression fits a straight line y = β₀ + β₁x, and multiple linear regression uses several inputs y = β₀ + β₁x₁ + … + βₙxₙ.',
    blocks: [
      { img: 'fds-linreg' },
      { ul: ['**Simple linear regression**: one input (e.g. study hours → marks).', '**Multiple linear regression**: many inputs (hours, attendance, past GPA → marks).', 'Coefficients are chosen by **least squares**: minimise Σ(yᵢ − ŷᵢ)².', 'β₁ = how much y changes when x increases by 1 (others fixed).'] },
      { h: 'Assumptions' },
      'Linear relationship, independent errors, constant error variance (homoscedasticity), normally distributed errors, and no strong multicollinearity.',
      { code: `from sklearn.linear_model import LinearRegression
X = df[["hours", "attendance"]]; y = df["marks"]
model = LinearRegression().fit(X, y)
model.intercept_, model.coef_
model.predict([[6, 90]])` },
    ],
    terms: [['Least squares', 'Fit that minimises the sum of squared errors.'], ['Coefficient', 'Effect of one input on the output.']],
    exam: 'Define regression, write both equations, explain least squares and assumptions, sklearn code.',
    revise: ['y = β₀ + β₁x (+ …)', 'Least squares minimises Σ(y − ŷ)²'],
  },

  'fds.u5.multicollinearity': {
    oneLine: 'Multicollinearity is when input variables are strongly correlated with each other, which makes regression coefficients unstable and hard to interpret.',
    blocks: [
      { h: 'Detecting it' },
      { ul: ['**Correlation matrix / heatmap**: |r| > 0.8 between inputs is a warning.', '**VIF (variance inflation factor)** for each input: VIF = 1 / (1 − R²ᵢ), where R²ᵢ comes from regressing that input on all the others. VIF > 5 (or 10) means serious multicollinearity.'] },
      { code: `from statsmodels.stats.outliers_influence import variance_inflation_factor
X = df[["size", "rooms", "age"]].assign(const=1)
vif = {c: variance_inflation_factor(X.values, i) for i, c in enumerate(X.columns)}` },
      { h: 'Removing it' },
      { ul: ['Drop one of each highly correlated pair.', 'Combine them into one feature (e.g. average, ratio).', 'Use **PCA** to create uncorrelated components.', 'Use **regularisation** (Ridge/Lasso).', 'Collect more data.'] },
      'It doesn\'t necessarily hurt prediction accuracy, but coefficients may flip sign or have huge standard errors, so you can\'t trust "which input matters".',
    ],
    terms: [['VIF', 'Variance inflation factor: 1 / (1 − R²) of an input on the other inputs.']],
    exam: 'Define, effects, detection (correlation + VIF formula), and removal methods.',
    revise: ['VIF = 1/(1 − R²ᵢ); > 5–10 is a problem', 'Fix: drop, combine, PCA, ridge'],
  },

  'fds.u5.dummy': {
    oneLine: 'Dummy variables turn a categorical input into 0/1 columns so it can be used in regression; drop one category to avoid the dummy variable trap.',
    blocks: [
      'A category with k values becomes **k − 1** dummy columns; the dropped one is the **reference** (baseline) category.',
      { code: `pd.get_dummies(df, columns=["city"], drop_first=True, dtype=int)
# city ∈ {Hyderabad, Chennai, Pune} → city_Hyderabad, city_Pune (Chennai = reference)` },
      { table: { head: ['City', 'city_Hyderabad', 'city_Pune'], rows: [['Chennai', '0', '0'], ['Hyderabad', '1', '0'], ['Pune', '0', '1']] } },
      { h: 'Dummy variable trap' },
      'If all k dummies are kept, they always add up to 1, which duplicates the intercept: perfect multicollinearity, and the regression can\'t be solved uniquely. Dropping one column (`drop_first=True`) fixes it.',
      'Interpretation: the coefficient of city_Pune = how much higher (or lower) y is in Pune compared with Chennai, all else equal.',
    ],
    terms: [['Reference category', 'The dropped category everything is compared with.'], ['Dummy trap', 'Perfect multicollinearity from keeping all k dummies.']],
    exam: 'Define dummies, show the table, explain the trap and drop_first.',
    revise: ['k categories → k − 1 dummies', 'Trap = perfect multicollinearity'],
  },

  'fds.u5.model-dev': {
    oneLine: 'Developing a regression model follows a fixed pipeline: load and clean data, choose features, split train/test, fit, predict and evaluate.',
    blocks: [
      { code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

df = pd.read_csv("housing.csv")                          # 1. load
df = df.dropna()                                         # 2. clean
df = pd.get_dummies(df, drop_first=True)                 # 3. encode
X = df.drop(columns="price"); y = df["price"]            # 4. features / target
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)  # 5. split
model = LinearRegression().fit(X_tr, y_tr)               # 6. fit
pred = model.predict(X_te)                               # 7. predict
print(r2_score(y_te, pred), mean_squared_error(y_te, pred) ** 0.5)  # 8. evaluate` },
      'Also: explore and visualise relationships first, check multicollinearity, and with `statsmodels.api.OLS` you get a summary table with coefficients, p-values and R².',
    ],
    terms: [['Train/test split', 'Fit on one part of the data, evaluate on unseen data.']],
    exam: 'Write the numbered pipeline with code for each step.',
    revise: ['Load → clean → encode → X/y → split → fit → predict → evaluate'],
  },

  'fds.u5.metrics': {
    oneLine: 'Regression models are judged by how close predictions are to real values: MAE, MSE and RMSE measure the average error, R² measures how much of the variation the model explains.',
    blocks: [
      { table: { head: ['Metric', 'Formula', 'Meaning'], rows: [
        ['**MAE**', '(1/n) Σ |yᵢ − ŷᵢ|', 'Average absolute error, in the same units as y'],
        ['**MSE**', '(1/n) Σ (yᵢ − ŷᵢ)²', 'Squares errors → punishes big mistakes; units squared'],
        ['**RMSE**', '√MSE', 'Typical error size in y\'s units; sensitive to outliers'],
        ['**R²**', '1 − SS_res / SS_tot = 1 − Σ(y − ŷ)² / Σ(y − ȳ)²', 'Share of variance explained (1 = perfect, 0 = no better than the mean, can be negative)'],
        ['Adjusted R²', '1 − (1 − R²)(n − 1)/(n − k − 1)', 'Penalises adding useless features'],
      ] } },
      { h: 'Worked example' },
      'Actual y = [3, 5, 7], predicted ŷ = [2, 5, 9]. Errors = [1, 0, −2].',
      { ul: ['MAE = (1 + 0 + 2)/3 = **1.0**', 'MSE = (1 + 0 + 4)/3 = **1.67**', 'RMSE = √1.67 = **1.29**', 'ȳ = 5 → SS_tot = 4 + 0 + 4 = 8; SS_res = 5 → R² = 1 − 5/8 = **0.375**'] },
      { sim: 'fds-metrics' },
      { note: 'If every actual value is the same, SS_tot = 0 and R² is undefined.' },
    ],
    terms: [['Residual', 'y − ŷ, the prediction error.'], ['SS_tot', 'Total variation of y around its mean.']],
    exam: 'Write all four formulas, explain each in one line, and compute them for a small example.',
    revise: ['MAE avg |e|; MSE avg e²; RMSE √MSE', 'R² = 1 − SS_res/SS_tot'],
  },

  'fds.u5.polynomial': {
    oneLine: 'Polynomial regression fits a curve by adding powers of x (x², x³…) as extra inputs, so a linear model can follow non-linear patterns.',
    blocks: [
      { formula: 'y = β₀ + β₁x + β₂x² + … + βₙxⁿ + ε' },
      'It is still **linear in the coefficients**, so ordinary least squares fits it.',
      { code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
model.fit(X, y)` },
      { compare: [
        { title: 'Use it when', items: ['Scatter plot shows a curve', 'Residuals of a linear fit show a pattern', 'e.g. speed vs braking distance, growth curves'] },
        { title: 'Watch out', items: ['High degree → **overfitting** (wiggly curve, poor test score)', 'Extrapolation outside the data is unreliable', 'Pick degree by validation (test R²/RMSE)'] },
      ] },
    ],
    terms: [['Degree', 'Highest power of x in the model.'], ['Overfitting', 'Fitting noise; great on training data, poor on new data.']],
    exam: 'Equation, why it is still linear regression, sklearn code, and when it beats linear regression vs overfitting risk.',
    revise: ['Add x², x³… as features', 'Too high degree → overfit'],
  },

  'fds.u5.logistic': {
    oneLine: 'Logistic regression is a classification method: it passes a linear combination of inputs through the sigmoid function to predict the probability of a class (e.g. pass/fail).',
    blocks: [
      { img: 'fds-logcurve' },
      { formula: 'p = σ(z) = 1 / (1 + e^(−z)),  z = β₀ + β₁x₁ + … + βₙxₙ' },
      'The model is linear in the **log-odds**: log(p / (1 − p)) = z. Predict class 1 if p ≥ 0.5 (threshold can be tuned).',
      { img: 'fds-sigmoid' },
      { fix: 'Your slides call logistic regression "a type of linear regression" and label log(p/(1−p)) as the "odds". More precisely: it is a **classification** algorithm (it outputs probabilities, not continuous values), and p/(1−p) is the **odds** while log(p/(1−p)) is the **log-odds (logit)**. It is called "regression" because the log-odds are modelled with a linear equation.' },
      { h: 'Characteristics' },
      'Output between 0 and 1; S-shaped curve; fitted by maximum likelihood (not least squares); coefficients show how each input changes the log-odds; linear decision boundary.',
      { h: 'Types' },
      { ul: ['**Binary**: two classes (spam / not spam).', '**Multinomial**: 3+ unordered classes (CSE / ECE / IT).', '**Ordinal**: 3+ ordered classes (low / medium / high).'] },
      { compare: [
        { title: 'Advantages', items: ['Simple, fast, interpretable', 'Gives probabilities', 'Works well when classes are linearly separable', 'Less prone to overfitting with regularisation'] },
        { title: 'Disadvantages', items: ['Assumes a linear boundary in log-odds', 'Struggles with complex non-linear relationships', 'Sensitive to outliers and multicollinearity', 'Needs reasonably large samples'] },
      ] },
      { h: 'Linear vs logistic regression' },
      { table: { head: ['', 'Linear', 'Logistic'], rows: [['Task', 'Regression (continuous y)', 'Classification (categorical y)'], ['Output', 'Any real number', 'Probability 0–1'], ['Curve', 'Straight line', 'S-shaped sigmoid'], ['Fitting', 'Least squares', 'Maximum likelihood'], ['Metrics', 'R², MSE, RMSE', 'Accuracy, precision, recall, F1, confusion matrix']] } },
      { h: 'scikit-learn' },
      { code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
clf = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
pred = clf.predict(X_te)
proba = clf.predict_proba(X_te)[:, 1]
print(accuracy_score(y_te, pred)); print(confusion_matrix(y_te, pred))` },
    ],
    terms: [['Sigmoid', 'σ(z) = 1/(1 + e^(−z)), maps to (0, 1).'], ['Log-odds', 'log(p/(1 − p)), the logit.'], ['Confusion matrix', 'Table of TP, FP, FN, TN.']],
    exam: 'Define, sigmoid formula and graph, log-odds, types, pros/cons, linear vs logistic table and sklearn code.',
    revise: ['p = 1/(1 + e^−z); logit = log(p/(1−p)) is linear', 'Binary, multinomial, ordinal', 'Classification, not continuous prediction'],
  },

  'fds.u5.pca': {
    oneLine: 'PCA reduces many correlated features to a few new uncorrelated ones (principal components) that keep as much of the data\'s variation as possible.',
    blocks: [
      { h: 'Why reduce dimensions' },
      'Fewer features → faster models, less overfitting, removes multicollinearity, and lets you visualise high-dimensional data in 2-D/3-D (the "curse of dimensionality").',
      { h: 'Steps of PCA' },
      { steps: ['**Standardise** each feature (mean 0, std 1).', 'Compute the **covariance matrix**.', 'Find its **eigenvectors** (directions) and **eigenvalues** (variance along each).', 'Sort components by eigenvalue (largest variance first).', 'Choose the top k components (e.g. enough to explain 90–95% of variance).', '**Project** the data onto those k components.'] },
      { formula: 'PCⱼ = w₁ⱼX₁ + w₂ⱼX₂ + … + wₚⱼXₚ' },
      { code: `from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
Xs = StandardScaler().fit_transform(X)
pca = PCA(n_components=2)
X2 = pca.fit_transform(Xs)
pca.explained_variance_ratio_      # e.g. [0.73, 0.23] → 96% kept` },
      'Each component is a weighted mix of the original features; PC1 captures the most variance, PC2 the most of what\'s left, and so on.',
    ],
    terms: [['Principal component', 'New axis = linear combination of original features.'], ['Explained variance ratio', 'Share of total variance captured by a component.']],
    exam: 'Why dimensionality reduction, the 6 PCA steps, formula and sklearn code with explained variance.',
    revise: ['Standardise → covariance → eigen → sort → choose k → project', 'Components are uncorrelated'],
  },

  'fds.u5.num-clusters': {
    oneLine: 'Two common ways to choose k for clustering: the elbow method (where adding clusters stops reducing WCSS much) and the silhouette method (k with the highest average silhouette score).',
    blocks: [
      { h: 'Elbow method' },
      { img: 'elbow' },
      'Run k-means for k = 1…10, record **WCSS** (within-cluster sum of squares, `inertia_`), plot it, and pick the k at the "elbow" of the curve.',
      { h: 'Silhouette method' },
      { img: 'fds-silhouette' },
      { formula: 's(i) = (b(i) − a(i)) / max(a(i), b(i))' },
      'a(i) = average distance to points in the same cluster; b(i) = average distance to the nearest other cluster. s ranges from −1 to +1: near **+1** well clustered, **0** on a boundary, negative = probably in the wrong cluster. Choose k with the highest mean silhouette.',
      { code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
wcss, sil = [], []
for k in range(2, 11):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    wcss.append(km.inertia_)
    sil.append(silhouette_score(X, km.labels_))` },
    ],
    terms: [['WCSS / inertia', 'Sum of squared distances of points to their cluster centre.'], ['Silhouette score', 'How well each point fits its cluster vs the next one.']],
    exam: 'Explain both methods with the plot sketch and formula, plus code.',
    revise: ['Elbow: WCSS vs k, pick the bend', 'Silhouette: (b − a)/max(a, b), pick the highest'],
  },

  'fds.u5.kmeans': {
    oneLine: 'K-means groups data into k clusters by repeatedly assigning each point to its nearest centre and moving each centre to the mean of its points.',
    blocks: [
      { img: 'fds-clustering' },
      { img: 'fds-ctypes' },
      { h: 'Algorithm' },
      { steps: ['Choose k.', 'Initialise k centroids (randomly or with k-means++).', '**Assign** each point to the nearest centroid (Euclidean distance).', '**Update** each centroid to the mean of its assigned points.', 'Repeat assign/update until assignments stop changing (or max iterations).'] },
      { img: 'fds-kmeans' },
      { h: 'Worked mini example (1-D)' },
      'Points 2, 4, 10, 12, 3, 20, 30, 11, 25 with k = 2, initial centres 2 and 4 → after a few rounds centres settle near 7 (2, 3, 4, 10, 11, 12) and 25 (20, 25, 30).',
      { sim: 'fds-kmeans' },
      { compare: [
        { title: 'Strengths', items: ['Simple and fast', 'Scales to large data', 'Easy to interpret'] },
        { title: 'Weaknesses', items: ['Must choose k', 'Sensitive to initial centres and outliers', 'Assumes round, similar-size clusters', 'Needs scaled numeric features'] },
      ] },
    ],
    terms: [['Centroid', 'Mean point of a cluster.'], ['k-means++', 'Smarter initialisation that spreads out the first centres.']],
    exam: 'Algorithm steps, a small numeric example, strengths and weaknesses, and sklearn code `KMeans(n_clusters=k).fit(X)`.',
    revise: ['Assign to nearest centroid → recompute means → repeat', 'Need k; sensitive to init/outliers'],
  },

  'fds.u5.hierarchical': {
    oneLine: 'Hierarchical clustering builds a tree of clusters (a dendrogram): agglomerative merges the closest clusters bottom-up, divisive splits top-down.',
    blocks: [
      { img: 'fds-agglo' },
      { h: 'Agglomerative steps' },
      { steps: ['Start with every point as its own cluster.', 'Compute the distance matrix.', 'Merge the two closest clusters.', 'Update distances using a **linkage** rule.', 'Repeat until one cluster remains; cut the dendrogram at a height to get k clusters.'] },
      { table: { head: ['Linkage', 'Distance between clusters'], rows: [['Single', 'Closest pair of points (can chain)'], ['Complete', 'Farthest pair of points (compact clusters)'], ['Average', 'Average of all pairs'], ['Ward', 'Increase in within-cluster variance (similar-size clusters)']] } },
      { code: `from scipy.cluster.hierarchy import linkage, dendrogram
Z = linkage(X, method="ward"); dendrogram(Z)
from sklearn.cluster import AgglomerativeClustering
labels = AgglomerativeClustering(n_clusters=3, linkage="ward").fit_predict(X)` },
      'No need to choose k up front; the dendrogram shows structure at every level. But it is slow for large datasets (O(n²) memory) and merges can\'t be undone.',
    ],
    terms: [['Dendrogram', 'Tree diagram of merges/splits.'], ['Linkage', 'Rule for distance between clusters.']],
    exam: 'Agglomerative vs divisive, steps, linkage table, dendrogram sketch.',
    revise: ['Agglomerative bottom-up; divisive top-down', 'Single, complete, average, Ward'],
  },

  'fds.u5.dbscan': {
    oneLine: 'DBSCAN finds clusters as dense regions of points, using a radius eps and a minimum number of neighbours; it discovers any shape of cluster and labels sparse points as noise.',
    blocks: [
      { ul: ['**eps (ε)**: neighbourhood radius.', '**minPts**: minimum points within ε to be dense.', '**Core point**: has ≥ minPts neighbours within ε.', '**Border point**: within ε of a core point but not core itself.', '**Noise point**: neither — an outlier.'] },
      { steps: ['Pick an unvisited point; find its ε-neighbours.', 'If it is a core point, start a cluster and add all density-reachable points.', 'Otherwise mark it as noise (it may later become a border point).', 'Repeat until all points are visited.'] },
      { code: `from sklearn.cluster import DBSCAN
labels = DBSCAN(eps=0.5, min_samples=5).fit_predict(X)   # -1 = noise` },
      { compare: [
        { title: 'Pros', items: ['No need to choose k', 'Finds arbitrary shapes', 'Handles outliers (noise)'] },
        { title: 'Cons', items: ['Sensitive to eps and minPts', 'Struggles with varying densities', 'Distance issues in high dimensions'] },
      ] },
    ],
    terms: [['Core point', 'Point with at least minPts neighbours within eps.'], ['Noise', 'Point not reachable from any core point.']],
    exam: 'Define eps, minPts, core/border/noise, the algorithm, pros and cons.',
    revise: ['eps + minPts; core, border, noise', 'Any shape, no k, label -1 = noise'],
  },

  'fds.u5.spectral': {
    oneLine: 'Spectral clustering builds a similarity graph of the points, uses eigenvectors of the graph Laplacian to re-embed them, and then runs k-means in that new space — good for non-convex clusters.',
    blocks: [
      { img: 'fds-spectral' },
      { steps: ['Build a **similarity (affinity) matrix** W (e.g. Gaussian/RBF or k-nearest-neighbours).', 'Form the **graph**; compute the degree matrix D.', 'Compute the **Laplacian** L = D − W (or a normalised version).', 'Take the **k eigenvectors** with the smallest eigenvalues → new features.', 'Run **k-means** on those rows to form the clusters.'] },
      { code: `from sklearn.cluster import SpectralClustering
labels = SpectralClustering(n_clusters=2, affinity="nearest_neighbors").fit_predict(X)` },
      'Works where k-means fails (e.g. two interleaving moons or concentric circles) because it clusters by connectivity, not distance to a centre. It is expensive for large n and needs k and a similarity choice.',
    ],
    terms: [['Graph Laplacian', 'L = D − W, encodes graph connectivity.'], ['Affinity matrix', 'Pairwise similarities between points.']],
    exam: 'The 5 steps, why it handles non-convex shapes, and code.',
    revise: ['Similarity → graph → Laplacian → eigenvectors → k-means'],
  },

  'fds.u5.cluster-metrics': {
    oneLine: 'Clustering is evaluated internally (how compact and separated clusters are — Davies-Bouldin, silhouette) or externally against true labels (Rand, Jaccard, F1, Fowlkes-Mallows).',
    blocks: [
      { h: 'Internal (no labels needed)' },
      { table: { head: ['Metric', 'Formula / idea', 'Better'], rows: [
        ['**Davies-Bouldin index**', 'DBI = (1/n) Σ maxⱼ (σᵢ + σⱼ) / d(cᵢ, cⱼ) — average worst-case ratio of within-cluster scatter to between-centre distance', 'Lower (0 is best)'],
        ['**Silhouette coefficient**', 'mean of (b − a)/max(a, b)', 'Higher (max 1)'],
      ] } },
      { h: 'External (compare with true labels)' },
      'Look at every **pair** of points: TP = same cluster & same class, FP = same cluster but different class, FN = different cluster but same class, TN = different in both.',
      { table: { head: ['Metric', 'Formula', 'Range'], rows: [
        ['**Rand index**', '(TP + TN) / (TP + FP + FN + TN)', '0–1 (adjusted Rand: −1 to 1, 0 = random)'],
        ['**Jaccard score**', 'TP / (TP + FP + FN)', '0–1'],
        ['**F1-score**', '2PR / (P + R), with P = TP/(TP+FP), R = TP/(TP+FN)', '0–1'],
        ['**Fowlkes-Mallows**', 'TP / √((TP + FP)(TP + FN)) = √(P × R)', '0–1'],
      ] } },
      { code: `from sklearn.metrics import (davies_bouldin_score, silhouette_score,
    rand_score, adjusted_rand_score, fowlkes_mallows_score, jaccard_score, f1_score)
davies_bouldin_score(X, labels); silhouette_score(X, labels)
rand_score(y_true, labels); fowlkes_mallows_score(y_true, labels)` },
      'Worked example: if TP = 20, FP = 5, FN = 10, TN = 65 → Rand = 85/100 = **0.85**, Jaccard = 20/35 = **0.57**, P = 0.8, R = 0.667, F1 = **0.727**, FMI = √(0.8 × 0.667) = **0.730**.',
    ],
    terms: [['Internal metric', 'Uses only the data and the clusters.'], ['External metric', 'Compares clusters with known true labels.']],
    exam: 'Split into internal vs external, give each formula and "higher/lower is better", then a small pair-count example.',
    revise: ['DBI lower better; silhouette higher better', 'Rand = (TP+TN)/all; Jaccard = TP/(TP+FP+FN); FMI = √(P·R)'],
  },
}
