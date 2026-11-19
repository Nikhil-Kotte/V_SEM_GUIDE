// Fundamentals of Data Science, Unit IV: data cleaning, exploratory analysis and hypothesis testing.
// Follows the FDS unit slides and notes.
export default {
  'fds.u4.cleaning': {
    oneLine: 'Data cleaning turns raw, messy data into reliable data — exploring it first, then filtering out noise row-wise and column-wise, fixing formats, duplicates, missing values and outliers.',
    blocks: [
      { def: "Data cleaning and filtering", text: "**Exploring** a dataset to find errors and noise, then **filtering**: keeping only the relevant, valid rows (row-wise filtration with conditions) and columns (column-wise filtration, dropping irrelevant or redundant features) to weed out noise before analysis." },
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
      { def: "Handling missing values", text: "Dealing with absent entries by **dropping** (rows or columns with dropna(), when few values are missing or a column is mostly empty) or **filling (imputation)** with a constant, the mean/median/mode, forward/backward fill, interpolation or a model-based estimate." },
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
      { def: "Outlier", text: "A data point that **differs significantly from the other observations**, due to variability or error. Detected with the **IQR rule** (below Q1 − 1.5·IQR or above Q3 + 1.5·IQR), **z-scores** (|z| > 3), box plots and scatter plots; handled by removal, capping (winsorising), transformation or imputation." },
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
      { def: "Feature encoding", text: "Converting **categorical (text) features into numeric form** so machine-learning algorithms can use them: **one-hot encoding** (a 0/1 column per category), **label encoding** (an integer per category) and **ordinal encoding** (integers that respect a meaningful order)." },
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
      { h: 'The three encoders with examples (Class Test II, question 5a)' },
      { table: { head: ['Encoding', 'How it works', 'Example', 'Use when'], rows: [['**One-hot**', 'Creates one binary column per category; 1 for the row\'s category, 0 elsewhere', 'Colour {Red, Green, Blue} → Red = [1,0,0], Green = [0,1,0], Blue = [0,0,1]', 'Nominal data with no order and few categories'], ['**Label**', 'Assigns each category an integer code (alphabetical by default)', 'Blue → 0, Green → 1, Red → 2', 'Target labels, or tree-based models; may imply a false order'], ['**Ordinal**', 'Assigns integers in a defined order', 'Size: Small → 0, Medium → 1, Large → 2', 'Categories with a natural order (grades, ratings)']] } },
      { code: 'pd.get_dummies(df["Colour"])                       # one-hot\nfrom sklearn.preprocessing import LabelEncoder, OrdinalEncoder\nLabelEncoder().fit_transform(df["Colour"])          # label\nOrdinalEncoder(categories=[["Small", "Medium", "Large"]]).fit_transform(df[["Size"]])  # ordinal' },
    ],
    terms: [['Nominal', 'Categories with no order.'], ['Ordinal', 'Categories with a natural order.']],
    exam: 'Explain all three with a small before/after table and code; state when to use each.',
    revise: ['One-hot: nominal; label: targets/trees; ordinal: ordered', 'get_dummies(drop_first=True)'],
  },
  'fds.u4.correlation': {
    oneLine: 'Correlation measures how strongly two numeric variables move together (−1 to +1); univariate, bivariate and multivariate analysis study one, two or many variables at a time.',
    blocks: [
      { def: "Univariate, bivariate and multivariate analysis", text: "Classification of exploratory analysis by the **number of variables examined at once**: one (univariate: distribution of a single variable), two (bivariate: relationship between a pair) or more than two (multivariate: interactions among several variables)." },
      { img: 'fds-analysis-types' },
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
      { h: 'Compare and contrast (Class Test II, question 5b)' },
      { table: { head: ['Aspect', 'Univariate', 'Bivariate', 'Multivariate'], rows: [['Variables', 'One', 'Two', 'Three or more'], ['Purpose', 'Describe the distribution, centre and spread', 'Find the relationship / association between two variables', 'Understand interactions and combined effects; reduce dimensions'], ['Statistics', 'Mean, median, mode, SD, frequency, skewness', 'Correlation, covariance, cross-tabulation, simple regression, chi-square, t-test', 'Multiple regression, PCA, clustering, MANOVA, correlation matrix'], ['Plots', 'Histogram, box plot, bar chart, pie chart', 'Scatter plot, line chart, grouped bars', 'Pair plot, heat map, 3-D/colour-coded scatter'], ['Example', 'Distribution of passenger ages (Titanic)', 'Fare vs survival', 'Survival by sex, class and age together'], ['Causal insight', 'None', 'Association only', 'Can control for other variables']] } },
    ],
    terms: [['Pearson r', 'Linear correlation coefficient.'], ['Heatmap', 'Colour-coded correlation matrix.']],
    exam: 'Define the three types of analysis with tools each, then correlation (range, types, scatter patterns) and a heatmap snippet.',
    revise: ['Uni = one; bi = two; multi = many', 'r in [−1, 1]; correlation ≠ causation'],
  },
  'fds.u4.titanic': {
    oneLine: 'The Titanic dataset is the classic example for multivariate analysis: survival is studied together with sex, class, age and fare to find which factors mattered.',
    blocks: [
      { def: "Multivariate analysis", text: "The analysis of **more than two variables simultaneously** to understand how they jointly relate to an outcome; with the Titanic dataset, how **sex, passenger class, age and fare together** relate to survival." },
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
      { def: "Hypothesis testing", text: "A statistical method that uses **sample data to decide between two competing claims about a population**: the null hypothesis H₀ and the alternative H₁. A test statistic and its **p-value** are computed; if p ≤ significance level α (usually 0.05), H₀ is rejected." },
      { def: "Null and alternative hypotheses", text: "The **null hypothesis (H₀)** states **no effect, no difference or no relationship** (the status quo, e.g. μ = 4 minutes); the **alternative hypothesis (H₁ or Hₐ)** states **what we want to show**: an effect, a difference or a relationship (μ ≠ 4, μ > 4 or μ < 4)." },
      { img: 'fds-hypothesis' },
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
      { h: 'Null vs alternative hypothesis (Class Test II, question 2)' },
      { table: { head: ['Null hypothesis H₀', 'Alternative hypothesis H₁'], rows: [['No effect / no difference / no relationship', 'There is an effect / difference / relationship'], ['Contains equality (=, ≤, ≥)', 'Contains ≠, > or <'], ['Assumed true until evidence against it', 'Accepted only when H₀ is rejected'], ['e.g. mean reading time = 4 min', 'e.g. mean reading time ≠ 4 min']] } },
    ],
    terms: [['p-value', 'Probability of the observed (or more extreme) result if H₀ is true.'], ['α', 'Significance level: the accepted risk of a Type I error.']],
    exam: 'Write the 5 steps, the error table, test types, and a worked example with the decision rule.',
    revise: ['p ≤ α → reject H₀', 'Type I = false positive (α); Type II = false negative (β)', 'z (large n), t (small n), chi-square (categories), ANOVA (3+ means)'],
  },
  'fds.u4.ttest': {
    oneLine: 'A t-test checks whether a mean (or the difference between two means) is significantly different, when samples are small and the population standard deviation is unknown.',
    blocks: [
      { def: "t-test", text: "A **parametric test that compares means** using the t-distribution, used when the population standard deviation is unknown and samples are small: t = (x̄ − μ₀) / (s / √n) for one sample." },
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
      { h: 'Types of t-tests and assumptions (Class Test II, question 6a)' },
      { table: { head: ['Type', 'Compares', 'Example', 'scipy.stats'], rows: [['**One-sample t-test**', 'A sample mean with a known/hypothesised value', 'Is the average reading time 4 minutes?', 'ttest_1samp'], ['**Independent (two-sample) t-test**', 'Means of two independent groups', 'Marks of Section A vs Section B', 'ttest_ind'], ['**Paired t-test**', 'Means of the same subjects measured twice', 'Marks before and after a workshop', 'ttest_rel'], ['Welch\'s t-test', 'Two groups with unequal variances', 'Same as independent, unequal spread', 'ttest_ind(equal_var=False)']] } },
      { h: 'Assumptions before applying a t-test' },
      { ol: ['**Continuous data** measured on an interval or ratio scale.', '**Normality**: the data (or the differences, for paired) are approximately normally distributed (check with a histogram, Q–Q plot or Shapiro–Wilk test).', '**Random sampling and independence**: observations are randomly sampled and independent of each other (except the pairing in a paired test).', '**Homogeneity of variance**: for the independent t-test, the two groups have roughly equal variances (Levene\'s test; otherwise Welch\'s).', 'No significant **outliers**; reasonably small samples (n < 30) where σ is unknown.'] },
    ],
    terms: [['Degrees of freedom', 'n − 1 for a one-sample t-test.'], ['Paired t-test', 'Compares two measurements on the same subjects.']],
    exam: 'Types table, formula, and a numeric one-sample example with the decision.',
    revise: ['t = (x̄ − μ₀)/(s/√n), df = n − 1', 'One-sample, independent, paired'],
  },
}
