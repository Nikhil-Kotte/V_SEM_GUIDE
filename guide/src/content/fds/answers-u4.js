// FDS Unit IV (cleaning, correlation, hypothesis testing) model answers. Keyed by PYQ id.
const U4 = 'FDS Unit-IV slides (Unit-IV-FDS-copy.pptx)'

export default {
  'fds-summary-problems': {
    blocks: [
      'Looking at summary statistics (`describe()`, `info()`, `value_counts()`) often reveals data problems before modelling:',
      { table: { head: ['Problem', 'How the summary shows it', 'Example'], rows: [
        ['**Missing values**', 'count lower than the number of rows; info() non-null counts', 'cgpa count 118 of 120'],
        ['**Invalid / impossible values**', 'min or max outside the valid range', 'age = −3 or 250; attendance = 120%'],
        ['**Outliers**', 'max far above the 75th percentile; large std', 'salary max 9,00,00,000 when Q3 = 9,00,000'],
        ['**Sentinel values**', 'suspicious repeated min/max', '−1 or 9999 used for "unknown"'],
        ['**Wrong data types**', 'numbers stored as object/text', '"marks" column dtype object because of "AB" (absent)'],
        ['**Skewed distributions**', 'mean very different from median', 'income mean ≫ median'],
        ['**Inconsistent categories / typos**', 'value_counts shows near-duplicates', '"CSE", "cse", "C.S.E"'],
        ['**Imbalanced classes**', 'one category dominates', '95% "not fraud", 5% "fraud"'],
        ['**Constant or near-constant columns**', 'std = 0, one unique value', 'college = "CBIT" for every row'],
        ['**Unit mismatches**', 'two clusters of magnitudes', 'heights in cm and m mixed'],
        ['**Duplicates**', 'count of unique IDs < rows', 'same roll number twice'],
      ] } },
      'Each finding leads to a cleaning step: impute or drop, cap or remove outliers, fix types, standardise categories, rebalance classes.',
    ],
    sources: [`${U4} slides 3–10`, 'Related course 22ADC09 (asked in R)'],
  },

  'fds-missing-methods': {
    blocks: [
      { h: 'First, detect and understand' },
      '`df.isnull().sum()` per column; check **why** data is missing: **MCAR** (completely at random), **MAR** (depends on other observed variables), **MNAR** (depends on the missing value itself, e.g. high earners hiding income). The mechanism decides which method is safe.',
      { h: 'Methods and their impact' },
      { table: { head: ['Method', 'How', 'Effect on analysis'], rows: [
        ['Listwise deletion', '`df.dropna()`', 'Simple; reduces sample size and power; biased unless MCAR'],
        ['Pairwise deletion', 'Use available values per calculation', 'Keeps more data; statistics based on different subsets'],
        ['Drop column', '`df.drop(columns=…)`', 'Loses a whole variable; OK if it is mostly empty'],
        ['Mean imputation', '`fillna(mean)`', 'Keeps the mean but **reduces variance** and weakens correlations'],
        ['Median imputation', '`fillna(median)`', 'Robust to outliers; also reduces spread'],
        ['Mode imputation', '`fillna(mode)`', 'For categories; inflates the most common class'],
        ['Constant / "Unknown" category', '`fillna("Unknown")`', 'Keeps rows; model can treat missing as its own group'],
        ['Forward/backward fill', '`ffill()`, `bfill()`', 'For time series; assumes values persist'],
        ['Interpolation', '`interpolate()`', 'Smooth estimates for ordered data'],
        ['Model-based (KNN, regression, MICE)', '`KNNImputer`, `IterativeImputer`', 'Preserves relationships best; more effort; can understate uncertainty'],
        ['Missing-indicator column', 'add `col_missing` 0/1', 'Lets the model learn that missingness is informative'],
      ] } },
      { code: `df = df.dropna(subset=["marks"])                       # target must exist
df["age"]  = df["age"].fillna(df["age"].median())
df["dept"] = df["dept"].fillna(df["dept"].mode()[0])
from sklearn.impute import KNNImputer
df[num_cols] = KNNImputer(n_neighbors=3).fit_transform(df[num_cols])` },
      'Rule of thumb: if < 5% of rows are missing at random, deletion is fine; otherwise impute, and compare results with and without imputation.',
    ],
    sources: [`${U4} slides 19–23`, 'Unit-3.2-Pandas(FDS).pptx slides 33–37', 'Related course 22ADC09 (asked in R)'],
  },

  'fds-p-cleaning': {
    blocks: [
      '**Data cleaning** is the process of detecting and correcting (or removing) **inaccurate, incomplete, duplicated, inconsistent or irrelevant** data so that analysis and models are reliable ("garbage in, garbage out"). It usually takes most of a data scientist\'s time.',
      { img: 'fds-iv4' },
      { h: 'Steps' },
      { steps: ['**Explore the data**: head(), info(), describe(), value_counts(), plots.', 'Handle **missing values** (drop or fill).', 'Remove **duplicates**: `df.drop_duplicates()`.', 'Handle **outliers** (IQR, Z-score).', 'Fix **formats and types**: `astype()`, `to_datetime()`, consistent units and spellings (`str.strip().str.upper()`).', '**Filter noise**: remove irrelevant columns and invalid rows.', '**Encode** categorical variables; scale if needed.', 'Validate the result.'] },
      { h: 'Filtering to weed out noise' },
      '**Noise** = data that does not help the analysis: irrelevant columns, invalid or erroneous rows, test records, extreme errors.',
      { h: 'Column-wise filtration' },
      'Keep only the **columns (features)** that are relevant; drop identifiers, constant columns, columns with too many missing values, or duplicates of others.',
      { code: `df = df[["name", "dept", "cgpa", "attendance"]]          # select needed columns
df = df.drop(columns=["phone", "remarks"])                # drop irrelevant ones
df = df.loc[:, df.isnull().mean() < 0.5]                  # drop columns > 50% missing
df = df.loc[:, df.nunique() > 1]                          # drop constant columns` },
      { h: 'Row-wise filtration' },
      'Keep only the **rows (records)** that meet conditions; remove invalid, out-of-range, duplicate or irrelevant records.',
      { code: `df = df[df["cgpa"].between(0, 10)]                       # valid range
df = df[df["dept"].isin(["CSE", "ECE", "IT"])]            # valid categories
df = df[df["attendance"] >= 0]
df = df.drop_duplicates(subset="roll")
df = df.query("year >= 2020 and status != 'test'")` },
    ],
    sources: [`${U4} slides 3–18`],
  },

  'fds-p-outliers': {
    blocks: [
      'An **outlier** is a value that lies far from the other observations. It may be a data-entry error (age 250) or a genuine rare value (a billionaire\'s income). Outliers distort means, standard deviations and regression lines.',
      { h: 'Detection' },
      { img: 'fds-iv26' },
      { ul: ['**Box plot**: the box spans Q1–Q3; whiskers extend to 1.5 × IQR; points beyond are outliers.', '**IQR rule**: IQR = Q3 − Q1; outlier if x < Q1 − 1.5·IQR or x > Q3 + 1.5·IQR.', '**Z-score**: z = (x − μ)/σ; outlier if |z| > 3 (for roughly normal data).', '**Scatter plots / histograms** for visual checks; domain rules (marks must be 0–100).'] },
      { code: `Q1, Q3 = df["salary"].quantile([0.25, 0.75])
IQR = Q3 - Q1
low, high = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
outliers = df[(df["salary"] < low) | (df["salary"] > high)]

from scipy import stats
z = stats.zscore(df["salary"])
df_z = df[abs(z) <= 3]` },
      { h: 'Example' },
      'Marks: 45, 52, 58, 60, 62, 65, 68, 70, 72, 98, 200. Q1 = 58, Q3 = 72 → IQR = 14 → limits 37 and 93 → **98 and 200** are outliers (200 is clearly an error; 98 may be a genuine topper).',
      { h: 'Handling' },
      { table: { head: ['Method', 'When'], rows: [['**Remove** rows', 'Clear errors; few outliers'], ['**Cap / winsorise** to the limits (`clip(low, high)`)', 'Keep the row but limit its influence'], ['**Transform** (log, square root)', 'Right-skewed data like income'], ['**Impute** with median', 'Value is an error but the row is useful'], ['**Keep** and use robust methods (median, tree models)', 'Genuine extreme values'], ['**Treat separately**', 'Fraud detection: outliers are the interest']] } },
    ],
    sources: [`${U4} slides 24–36`],
  },

  'fds-p-encoding': {
    blocks: [
      'Machine-learning models need numbers, so **categorical features** must be converted to numeric form: **feature encoding**.',
      { table: { head: ['dept', 'One-hot → dept_ECE', 'dept_IT', 'Label encoded'], rows: [['CSE', '0', '0', '0'], ['ECE', '1', '0', '1'], ['IT', '0', '1', '2']] } },
      { h: '1. One-hot encoding' },
      'Creates **one binary (0/1) column per category**; a row has 1 in its category\'s column and 0 elsewhere. No false order is implied. Drop one column (`drop_first=True`) to avoid the **dummy variable trap** in linear models. Use for **nominal** data with few categories (dept, city, colour). Drawback: many columns for high-cardinality features.',
      { h: '2. Label encoding' },
      'Assigns **each category an integer** (alphabetical: CSE 0, ECE 1, IT 2). Compact, but implies an order that doesn\'t exist, which can mislead linear/distance models. Use for the **target variable** of a classifier or with **tree-based models**.',
      { h: '3. Ordinal encoding' },
      'Assigns integers that **follow a meaningful order**: Low = 0 < Medium = 1 < High = 2; grades O > A > B. Use for **ordinal** data (education level, size, rating).',
      { code: `pd.get_dummies(df, columns=["dept"], drop_first=True)        # one-hot
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, OrdinalEncoder
OneHotEncoder(handle_unknown="ignore").fit_transform(df[["dept"]])
df["placed"] = LabelEncoder().fit_transform(df["placed"])      # Yes/No -> 1/0
enc = OrdinalEncoder(categories=[["Low", "Medium", "High"]])
df["level"] = enc.fit_transform(df[["level"]])
df["size"] = df["size"].map({"S": 0, "M": 1, "L": 2})          # manual ordinal` },
      { table: { head: ['Data type', 'Use'], rows: [['Nominal, few categories', 'One-hot'], ['Ordinal (ordered)', 'Ordinal'], ['Target labels / tree models', 'Label'], ['High-cardinality nominal', 'Target/frequency encoding (beyond syllabus)']] } },
    ],
    sources: [`${U4} slides 37–49`],
  },

  'fds-p-analysis': {
    blocks: [
      { h: 'Types of analysis (by number of variables)' },
      { table: { head: ['Type', 'Variables', 'Purpose', 'Tools'], rows: [
        ['**Univariate**', 'One', 'Describe a single variable: centre, spread, shape, outliers', 'mean, median, mode, std; histogram, box plot, bar chart (value_counts)'],
        ['**Bivariate**', 'Two', 'Relationship between two variables', 'Scatter plot, correlation coefficient, crosstab, grouped box plots, t-test, chi-square'],
        ['**Multivariate**', 'Three or more', 'Relationships among many variables together; control for confounders', 'Pair plots, correlation heatmap, grouped pivot tables, multiple regression, PCA'],
      ] } },
      'Example (students): univariate: distribution of CGPA; bivariate: CGPA vs attendance; multivariate: CGPA vs attendance and study hours by department.',
      { h: 'Correlation' },
      '**Correlation** measures the **strength and direction of the linear relationship** between two numeric variables. **Pearson\'s r** ranges from −1 to +1:',
      { ul: ['**r = +1**: perfect positive (both increase together).', '**r = −1**: perfect negative (one increases, the other decreases).', '**r ≈ 0**: no linear relationship.', '|r| > 0.7 strong, 0.3–0.7 moderate, < 0.3 weak.'] },
      { formula: 'r = Σ(x − x̄)(y − ȳ) / √[Σ(x − x̄)² · Σ(y − ȳ)²]' },
      { img: 'fds-iv52' },
      { code: `df["cgpa"].corr(df["attendance"])           # e.g. 0.72
df.corr(numeric_only=True)                     # correlation matrix
import seaborn as sns
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")` },
      { img: 'fds-iv64' },
      { note: 'Correlation is not causation; Spearman\'s rank correlation handles monotonic non-linear relationships and outliers.' },
    ],
    sources: [`${U4} slides 50–64`],
  },

  'fds-p-titanic': {
    blocks: [
      'The **Titanic dataset** (891 passengers) has columns such as Survived, Pclass, Sex, Age, SibSp, Parch, Fare, Embarked. Multivariate analysis looks at **several variables together** to explain survival.',
      { code: `import seaborn as sns, pandas as pd
df = sns.load_dataset("titanic")

# clean
df["age"] = df["age"].fillna(df["age"].median())
df["embarked"] = df["embarked"].fillna(df["embarked"].mode()[0])

# survival by sex and class together
print(pd.pivot_table(df, values="survived", index="sex", columns="pclass", aggfunc="mean"))
# pclass      1     2     3
# female   0.97  0.92  0.50
# male     0.37  0.16  0.14

# age groups x sex
df["age_group"] = pd.cut(df["age"], [0, 12, 18, 40, 60, 80])
print(df.groupby(["age_group", "sex"], observed=True)["survived"].mean())

# correlations among numeric variables
print(df[["survived", "pclass", "age", "fare", "sibsp", "parch"]].corr())

sns.catplot(data=df, x="pclass", y="survived", hue="sex", kind="bar")
sns.pairplot(df[["survived", "age", "fare", "pclass"]], hue="survived")` },
      { h: 'Insights' },
      { ol: ['**Sex**: about 74% of females survived vs 19% of males ("women and children first").', '**Class**: survival fell from about 63% (1st) to 47% (2nd) to 24% (3rd); class and fare are strongly linked.', '**Sex × class**: almost all 1st- and 2nd-class women survived, but only half of 3rd-class women; 2nd/3rd-class men had the lowest chance.', '**Age**: children (< 12) had higher survival, especially in 1st and 2nd class.', '**Fare** is positively correlated with survival (r ≈ 0.26) and negatively with Pclass (r ≈ −0.55).', '**Family size**: passengers with 1–3 relatives survived more than those alone or in very large families.', '**Embarked**: passengers from Cherbourg survived more, largely because more of them were 1st class (a confounder shown only by multivariate analysis).'] },
      'These combinations would be missed by looking at one variable at a time.',
    ],
    sources: [`${U4} slides 65–70`],
  },

  'fds-p-hypothesis': {
    blocks: [
      '**Hypothesis testing** is a statistical method to decide, from **sample data**, whether there is enough evidence to reject an assumption about a **population**.',
      { h: 'Principle' },
      { ul: ['**Null hypothesis H₀**: no effect / no difference (status quo): μ = 4 min.', '**Alternative hypothesis H₁**: the effect we want evidence for: μ ≠ 4 (two-tailed), μ > 4 or μ < 4 (one-tailed).', 'Assume H₀ is true and ask: how likely is data at least this extreme? That probability is the **p-value**.', 'If the p-value is smaller than the **significance level α** (usually 0.05), the data is unlikely under H₀ → **reject H₀**; otherwise **fail to reject H₀** (not the same as proving it).'] },
      { h: 'Steps' },
      { steps: ['State H₀ and H₁.', 'Choose α (e.g. 0.05).', 'Choose the test (z, t, chi-square, ANOVA) based on data type and sample size.', 'Compute the test statistic from the sample.', 'Find the p-value (or compare with the critical value).', 'Decide and interpret in context.'] },
      { h: 'Errors' },
      { table: { head: ['', 'H₀ true', 'H₀ false'], rows: [['Reject H₀', '**Type I error** (false positive), probability α', 'Correct decision (power = 1 − β)'], ['Fail to reject H₀', 'Correct decision', '**Type II error** (false negative), probability β']] } },
      { h: 'Types of hypothesis tests' },
      { ul: ['**One-tailed vs two-tailed**.', '**Z-test**: large samples, known σ.', '**t-test**: small samples, unknown σ (one-sample, two-sample, paired).', '**Chi-square test**: categorical variables (independence, goodness of fit).', '**ANOVA**: compare means of 3+ groups.'] },
      { h: 'statsmodels example: average reading time' },
      'A blog claims readers spend on average 4 minutes on an article. A sample of reading times is collected; test H₀: μ = 4 vs H₁: μ ≠ 4.',
      { code: `import numpy as np
from statsmodels.stats.weightstats import ztest, DescrStatsW
times = np.array([4.5, 3.8, 5.2, 4.9, 4.1, 5.5, 4.7, 3.9, 5.0, 4.8])
t_stat, p, dof = DescrStatsW(times).ttest_mean(value=4)
print(t_stat, p)      # t ≈ 3.60, p ≈ 0.006 < 0.05 -> reject H0` },
      'Conclusion: the average reading time differs from 4 minutes (it is higher, about 4.6 min).',
    ],
    sources: [`${U4} slides 71–89`],
  },

  'fds-p-ttest': {
    blocks: [
      'A **t-test** compares means when the **sample is small** (n < 30) and the **population standard deviation is unknown**. It uses the t-distribution (with heavier tails than the normal).',
      { h: 'Types' },
      { table: { head: ['Type', 'Compares', 'Example', 'Python'], rows: [
        ['**One-sample t-test**', 'A sample mean with a known/claimed value μ₀', 'Is the average reading time 4 minutes?', '`stats.ttest_1samp(x, 4)`'],
        ['**Independent (two-sample) t-test**', 'Means of two independent groups', 'CSE vs ECE average marks', '`stats.ttest_ind(a, b)` (equal_var=False for Welch)'],
        ['**Paired t-test**', 'Means of the same subjects measured twice', 'Marks before vs after coaching', '`stats.ttest_rel(before, after)`'],
      ] } },
      { formula: 'One-sample: t = (x̄ − μ₀) / (s / √n),   degrees of freedom = n − 1' },
      { h: 'Assumptions' },
      'Data roughly normally distributed; observations independent; for two-sample, similar variances (or use Welch\'s test).',
      { h: 'Worked example: average reading time' },
      'Sample reading times (minutes): 4.5, 3.8, 5.2, 4.9, 4.1, 5.5, 4.7, 3.9, 5.0, 4.8 (n = 10). H₀: μ = 4, H₁: μ ≠ 4, α = 0.05.',
      { ul: ['x̄ = 46.4 / 10 = **4.64**', 's ≈ **0.562**', 't = (4.64 − 4) / (0.562/√10) = 0.64 / 0.178 ≈ **3.60**', 'df = 9; critical t (two-tailed, 0.05) = 2.262; |t| > 2.262 → **reject H₀**'] },
      { code: `from scipy import stats
times = [4.5, 3.8, 5.2, 4.9, 4.1, 5.5, 4.7, 3.9, 5.0, 4.8]
t, p = stats.ttest_1samp(times, popmean=4)
print(round(t, 2), round(p, 4))     # 3.6, 0.0057 -> p < 0.05, reject H0

# statsmodels equivalent
from statsmodels.stats.weightstats import DescrStatsW
print(DescrStatsW(times).ttest_mean(4))` },
      'Conclusion: readers spend significantly more than 4 minutes on average.',
    ],
    sources: [`${U4} slides 80–89`],
  },
}
