// FDS Unit III (pandas) model answers. Keyed by PYQ id.
const PD = 'FDS Unit-3.2 slides (Unit-3.2-Pandas(FDS).pptx)'

export default {
  'fds-summary-stats': {
    blocks: [
      '**Summary statistics** condense a whole column into a few numbers, giving a quick first picture of the data before any modelling:',
      { ul: ['**Central tendency** (mean, median, mode): the typical value.', '**Spread** (standard deviation, variance, min, max, range, IQR): how varied the data is.', '**Shape** (quartiles, skewness): symmetry and tails.', '**Counts** (count, number unique, missing): completeness and cardinality.'] },
      'They reveal **missing values, outliers, wrong ranges and units, skewed distributions and imbalanced categories**, guiding cleaning and the choice of methods. In pandas: `df.describe()`, `df.info()`, `df["col"].value_counts()`.',
    ],
    sources: [`${PD} (describing DataFrames)`, 'Related course 22ADC09 (asked in R)'],
  },

  'fds-p-df-create': {
    blocks: [
      'A **DataFrame** is pandas\' two-dimensional, labelled table: rows have an **index**, columns have names, and each column can have its own data type. It can be created in many ways:',
      { code: `import pandas as pd
import numpy as np

# 1. from a dictionary of lists (keys become column names)
df1 = pd.DataFrame({"roll": [101, 102, 103],
                    "name": ["Asha", "Ravi", "Megha"],
                    "cgpa": [8.7, 7.9, 9.1]})

# 2. from a list of lists / tuples, giving column names
df2 = pd.DataFrame([[101, "Asha", 8.7], [102, "Ravi", 7.9]],
                   columns=["roll", "name", "cgpa"])

# 3. from a list of dictionaries (one dict per row)
df3 = pd.DataFrame([{"roll": 101, "name": "Asha"}, {"roll": 102, "name": "Ravi"}])

# 4. from a NumPy array
df4 = pd.DataFrame(np.random.randint(40, 100, size=(3, 2)), columns=["OS", "CN"])

# 5. from a dictionary of Series (aligned on index)
df5 = pd.DataFrame({"OS": pd.Series([78, 85], index=["Asha", "Ravi"]),
                    "CN": pd.Series([69, 91], index=["Asha", "Ravi"])})

# 6. from files and other sources
df6 = pd.read_csv("students.csv")          # also read_excel, read_json, read_sql
df7 = pd.read_html("https://...")[0]        # tables from a web page

# custom index
df1 = df1.set_index("roll")` },
      { h: 'Useful checks after creating' },
      '`df.head()`, `df.shape`, `df.columns`, `df.dtypes`, `df.index`.',
    ],
    sources: [`${PD} slides 3–10`],
  },

  'fds-p-series': {
    blocks: [
      'A **pandas Series** is a **one-dimensional labelled array** that can hold any data type (int, float, string, object). It has **values** and an **index** (labels).',
      { code: `import pandas as pd
s = pd.Series([78, 85, 69], index=["OS", "CN", "FDS"], name="marks")
print(s["CN"])        # 85: access by label
print(s.iloc[0])      # 78: access by position
print(s[s > 70])      # boolean filtering
print(s.mean(), s.max())
s2 = pd.Series({"OS": 78, "CN": 85})   # from a dict` },
      { h: 'Series vs DataFrame vs NumPy array' },
      { table: { head: ['Basis', 'NumPy ndarray', 'pandas Series', 'pandas DataFrame'], rows: [
        ['Dimensions', 'n-dimensional', '1-D', '2-D (table)'],
        ['Labels', 'Only integer positions', 'Index labels', 'Row index + column names'],
        ['Data types', 'One dtype for the whole array', 'One dtype', 'Each column its own dtype'],
        ['Missing values', 'No built-in handling (NaN only for floats)', 'NaN handled (isnull, fillna)', 'Same'],
        ['Alignment', 'By position', 'Automatic alignment on index in operations', 'Aligns on rows and columns'],
        ['Relationship', 'Underlying storage', 'A column of a DataFrame', 'A collection of Series sharing an index'],
        ['Use', 'Fast numerical computation', 'A single variable/column', 'A full dataset'],
      ] } },
      'Example: `df["cgpa"]` returns a Series; `df[["cgpa"]]` returns a DataFrame; `s.values` / `s.to_numpy()` returns a NumPy array.',
    ],
    sources: [`${PD} slides 10–14`],
  },

  'fds-p-quandl': {
    blocks: [
      '**Quandl** (now Nasdaq Data Link) is a platform that provides **financial, economic and commercial datasets** (stock prices, interest rates, commodity prices) for analysts. Data can be downloaded through its Python API directly into pandas, or exported as CSV and read with pandas.',
      { h: 'Reading the data' },
      { code: `# Option 1: Quandl / Nasdaq Data Link API (needs a free API key)
import quandl
quandl.ApiConfig.api_key = "YOUR_KEY"
gold = quandl.get("LBMA/GOLD", start_date="2020-01-01", end_date="2024-12-31")
print(gold.head())               # a DataFrame indexed by date

# Option 2: a downloaded CSV (as in the class example)
import pandas as pd
sunspots = pd.read_csv("daily_sunspots_time_series_1850-01_2026-04.csv")
sunspots.head()` },
      { h: 'Querying the data' },
      { code: `# select columns
cols = sunspots[["date", "year", "counts"]]
# filter rows
y1850 = sunspots[sunspots["year"] == 1850]
# boolean filtering with conditions
high = sunspots[sunspots["counts"] > 200]
both = sunspots[(sunspots["year"] >= 2000) & (sunspots["counts"] > 150)]
# query() method
q = sunspots.query("year == 2020 and counts > 100")
# loc / iloc
sunspots.loc[0:4, ["date", "counts"]]
sunspots.iloc[-5:]
# sort and aggregate
sunspots.sort_values("counts", ascending=False).head(10)
sunspots.groupby("year")["counts"].mean()` },
      'The result of every query is a new DataFrame (or Series) that can be analysed further or plotted.',
    ],
    sources: [`${PD} slides 15–19`],
  },

  'fds-p-describe': {
    blocks: [
      'After loading data, the first step is to **describe** the DataFrame to understand its size, columns, types and distributions.',
      { table: { head: ['Method / attribute', 'What it gives'], rows: [
        ['`df.head(n)` / `df.tail(n)`', 'First / last n rows (default 5): a quick look at the data'],
        ['`df.shape`', 'Tuple (rows, columns)'],
        ['`df.info()`', 'Index range, column names, non-null counts, dtypes, memory: reveals missing values and wrong types'],
        ['`df.describe()`', 'For numeric columns: count, mean, std, min, 25%, 50% (median), 75%, max. `include="object"` gives count, unique, top, freq for text columns'],
        ['`df.dtypes`, `df.columns`, `df.index`', 'Types, column names, index'],
        ['`df["col"].value_counts()`', 'Frequency of each category'],
        ['`df.nunique()`, `df.isnull().sum()`', 'Distinct values and missing values per column'],
        ['`df.corr(numeric_only=True)`', 'Correlation between numeric columns'],
      ] } },
      { code: `df = pd.read_csv("students.csv")
print(df.shape)          # (120, 5)
df.info()
print(df.describe())
#             roll        cgpa    attendance
# count  120.000000  118.000000  120.000000
# mean   160.500000    7.84        82.10
# std     34.785054    0.91        10.30
# min    101.000000    5.20        45.00
# 25%    130.750000    7.20        76.00
# 50%    160.500000    7.90        84.00
# 75%    190.250000    8.50        90.00
# max    220.000000    9.80        99.00` },
      'Reading the output: count 118 for cgpa means **2 missing values**; min attendance 45 vs 25% at 76 suggests a possible **outlier**; mean ≈ median shows a roughly symmetric distribution.',
    ],
    sources: [`${PD} slides 20–24`],
  },

  'fds-p-groupby': {
    blocks: [
      { h: 'groupby(): split → apply → combine' },
      '`groupby()` **splits** the rows into groups by one or more keys, **applies** a function (sum, mean, count, custom) to each group, and **combines** the results into a new DataFrame/Series.',
      { code: `df.groupby("dept")["cgpa"].mean()                 # average CGPA per dept
df.groupby(["dept", "gender"])["cgpa"].agg(["mean", "max", "count"])
df.groupby("dept").agg(avg=("cgpa", "mean"), top=("cgpa", "max"))
df.groupby("dept").filter(lambda g: len(g) > 30)   # keep large departments
df.groupby("dept")["cgpa"].transform("mean")       # group mean on every row` },
      { h: 'Combining DataFrames' },
      { ul: ['**merge()**: SQL-style join on common columns (keys).', '**join()**: join on the index.', '**concat()**: stack DataFrames vertically (axis=0) or side by side (axis=1).'] },
      { code: `students = pd.DataFrame({"roll": [1, 2, 3], "name": ["Asha", "Ravi", "Megha"]})
marks    = pd.DataFrame({"roll": [2, 3, 4], "score": [78, 91, 66]})

pd.merge(students, marks, on="roll", how="inner")   # rolls 2, 3
pd.merge(students, marks, on="roll", how="left")    # 1, 2, 3 (1 has NaN score)
pd.merge(students, marks, on="roll", how="right")   # 2, 3, 4 (4 has NaN name)
pd.merge(students, marks, on="roll", how="outer")   # 1, 2, 3, 4
pd.concat([df_2024, df_2025], ignore_index=True)     # append rows
students.set_index("roll").join(marks.set_index("roll"))` },
      { h: 'Types of joins' },
      { table: { head: ['Join', 'Keeps'], rows: [['Inner', 'Only keys present in **both** tables'], ['Left', 'All keys of the left table; NaN where the right has none'], ['Right', 'All keys of the right table'], ['Outer (full)', 'All keys from both; NaN where missing'], ['Cross', 'Every combination of rows']] } },
      { img: 'fds-inner' },
      { img: 'fds-outer' },
    ],
    sources: [`${PD} slides 25–32`],
  },

  'fds-p-missing': {
    blocks: [
      'pandas represents missing data as **NaN** (`np.nan`, a float) for numbers, **None**/NaN for objects, and **NaT** for dates; newer nullable types use `pd.NA`.',
      { h: 'Detecting' },
      { code: `df.isnull()            # True where missing (same as isna())
df.isnull().sum()      # missing count per column
df.notnull()           # opposite
df[df["cgpa"].isnull()]  # rows with missing cgpa
df.info()              # non-null counts` },
      { h: 'Dropping' },
      { code: `df.dropna()                        # drop rows with any missing value
df.dropna(how="all")               # only rows where all values are missing
df.dropna(subset=["cgpa"])         # only if cgpa is missing
df.dropna(axis=1, thresh=100)      # drop columns with fewer than 100 non-null values` },
      { h: 'Filling' },
      { code: `df.fillna(0)                                   # constant
df["cgpa"] = df["cgpa"].fillna(df["cgpa"].mean())   # mean
df["dept"] = df["dept"].fillna(df["dept"].mode()[0]) # most frequent
df.ffill(); df.bfill()                         # forward / backward fill (time series)
df["temp"].interpolate()                       # linear interpolation
df.replace(-1, np.nan)                         # mark sentinel values as missing` },
      'Choice depends on how much is missing and why: drop if few rows and missing at random; fill (mean/median/mode/interpolate) to keep data. Calculations like `mean()` skip NaN by default (`skipna=True`).',
    ],
    sources: [`${PD} slides 33–37`],
  },

  'fds-p-pivot': {
    blocks: [
      'A **pivot table** summarises data by **grouping on one variable as rows and another as columns**, and aggregating a value at each intersection (like Excel pivot tables). It reshapes long data into a compact, readable table.',
      { img: 'fds-pivot' },
      { code: `df = pd.DataFrame({
    "dept":   ["CSE", "CSE", "ECE", "ECE", "IT", "IT"],
    "gender": ["F", "M", "F", "M", "F", "M"],
    "marks":  [86, 78, 74, 70, 81, 77]})

pt = pd.pivot_table(df, values="marks", index="dept", columns="gender",
                    aggfunc="mean", fill_value=0, margins=True)
print(pt)
# gender     F     M    All
# dept
# CSE     86.0  78.0  82.0
# ECE     74.0  70.0  72.0
# IT      81.0  77.0  79.0
# All     80.3  75.0  77.7` },
      { h: 'Parameters' },
      { ul: ['**values**: column to aggregate.', '**index**: row groups.', '**columns**: column groups.', '**aggfunc**: mean (default), sum, count, max, or a list.', '**fill_value**: replace missing cells.', '**margins=True**: add row/column totals ("All").'] },
      '`df.pivot(index, columns, values)` only reshapes (no aggregation; keys must be unique); `pd.crosstab()` counts frequencies; `melt()` does the reverse (wide → long).',
    ],
    sources: [`${PD} slides 38–41`],
  },

  'fds-p-dates': {
    blocks: [
      'pandas has strong support for dates and times through **Timestamp**, **DatetimeIndex**, **Timedelta** and **Period**.',
      { code: `# 1. convert strings to datetime
df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y")   # errors="coerce" makes bad values NaT

# 2. create date ranges
days   = pd.date_range("2025-01-01", periods=7, freq="D")
months = pd.date_range("2025-01-01", "2025-12-31", freq="MS")

# 3. extract parts with the .dt accessor
df["year"]    = df["date"].dt.year
df["month"]   = df["date"].dt.month_name()
df["weekday"] = df["date"].dt.day_name()

# 4. use dates as the index; slice by date
ts = df.set_index("date").sort_index()
ts.loc["2025-03"]                      # all of March 2025
ts.loc["2025-01-01":"2025-01-15"]

# 5. resample (change frequency) and rolling windows
ts["sales"].resample("M").sum()        # monthly totals
ts["sales"].rolling(7).mean()          # 7-day moving average

# 6. date arithmetic
df["due"]  = df["date"] + pd.Timedelta(days=14)
df["late"] = (df["returned"] - df["due"]).dt.days
ts["sales"].shift(1)                   # previous day's value` },
      'Typical uses: time-series analysis (sunspot counts per year, stock prices), computing durations, grouping by month or weekday.',
    ],
    sources: [`${PD} slides 42–46`],
  },
}
