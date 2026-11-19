// Fundamentals of Data Science, Unit III: NumPy and pandas.
// Follows the FDS unit slides and notes.
export default {
  'fds.u3.numpy-arrays': {
    oneLine: 'A NumPy array (ndarray) is a fast, fixed-type, multi-dimensional grid of numbers; its dtype (int64, float64, bool…) sets how each element is stored.',
    blocks: [
      { def: "NumPy", text: "**Numerical Python**: the fundamental Python library for scientific computing, providing the **ndarray**, a fast, fixed-type, multidimensional array, with vectorised operations, broadcasting, linear algebra and random numbers." },
      { def: "ndarray", text: "A **homogeneous, n-dimensional array** of elements of the same data type (dtype) stored in contiguous memory, with attributes **shape, ndim, size, dtype and itemsize**." },
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
      { def: "Array shape manipulation", text: "Changing the **dimensions (shape) of an array without changing its data**: reshape(), ravel()/flatten(), transpose()/T, resize(), and adding/removing axes (np.newaxis, squeeze)." },
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
      { def: "Stacking and splitting", text: "**Stacking** joins arrays along an axis (hstack, vstack, dstack, column_stack, concatenate); **splitting** divides an array into sub-arrays (hsplit, vsplit, dsplit, split)." },
      { code: "a = np.array([[1, 2], [3, 4]]); b = np.array([[5, 6], [7, 8]])\nnp.hstack((a, b))     # [[1 2 5 6] [3 4 7 8]]\nnp.vstack((a, b))     # [[1 2] [3 4] [5 6] [7 8]]\nnp.dstack((a, b)).shape   # (2, 2, 2)\nnp.concatenate((a, b), axis=0)  # same as vstack\n\nc = np.arange(12).reshape(3, 4)\nnp.hsplit(c, 2)       # two arrays of shape (3, 2)\nnp.vsplit(c, 3)       # three arrays of shape (1, 4)\nnp.split(c, [1], axis=1)  # split after column 1" },
    ],
    terms: [['hstack / vstack', 'Join arrays horizontally / vertically.'], ['hsplit / vsplit', 'Split arrays into column / row blocks.']],
    exam: 'Show each stacking and splitting function with input and output arrays.',
    revise: ['hstack, vstack, dstack, concatenate', 'hsplit, vsplit, split'],
  },
  'fds.u3.dtype-views': {
    oneLine: 'astype() converts an array to a new data type (a new copy); a view shares the same data as the original, while copy() makes an independent array.',
    blocks: [
      { def: "View and copy", text: "A **view** is a new array object that **shares the same data** with the original (slicing, reshape), so changes are reflected in both; a **copy** (arr.copy()) **duplicates the data**, so changes are independent." },
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
      { def: "Indexing and slicing", text: "Selecting elements of an array: **basic indexing** (A[i, j]), **slicing** (A[start:stop:step], returns a view), **Boolean indexing** (A[A > 50], selects where a condition is True) and **fancy indexing** (A[[0, 2]], selects with integer arrays; returns a copy)." },
      { code: "a = np.arange(12).reshape(3, 4)\n# [[ 0  1  2  3]\n#  [ 4  5  6  7]\n#  [ 8  9 10 11]]\na[1, 2]        # 6\na[0:2, 1:3]    # [[1 2] [5 6]]\na[:, 0]        # first column [0 4 8]\na[::-1]        # rows reversed\n\na[a > 5]       # boolean indexing: [ 6  7  8  9 10 11]\na[a % 2 == 0] = 0   # set all even values to 0\n\na[[0, 2]]      # fancy indexing: rows 0 and 2\na[[0, 2], [1, 3]]   # elements (0,1) and (2,3): [1 11]" },
      { tip: 'Slicing returns a **view**; boolean and fancy indexing return **copies**.' },
      { h: 'Class Test I, question 7(b)' },
      { img: 'fds-indexing' },
      { code: 'import numpy as np\nA = np.array([[10, 20, 30],\n              [40, 50, 60],\n              [70, 80, 90]])\nprint(A[1])        # second row      -> [40 50 60]\nprint(A[:, 2])     # third column    -> [30 60 90]\nprint(A[1:, 1:])   # sub-array       -> [[50 60] [80 90]]\nprint(A[A > 50])   # Boolean mask    -> [60 70 80 90]' },
    ],
    terms: [['Boolean indexing', 'Selecting elements with a True/False mask.'], ['Fancy indexing', 'Selecting elements with arrays or lists of indices.']],
    exam: 'Show 2-D slicing, boolean indexing and fancy indexing on a small array with outputs, and note view vs copy.',
    revise: ['a[r, c], a[r1:r2, c1:c2]', 'a[a > 5]', 'a[[0, 2]]'],
  },
  'fds.u3.broadcasting': {
    oneLine: 'Broadcasting lets NumPy do maths on arrays of different shapes by stretching the smaller one along dimensions of size 1, without copying data.',
    blocks: [
      { def: "Broadcasting", text: "The set of rules by which NumPy **performs arithmetic on arrays of different shapes**: the smaller array is (virtually) \"stretched\" across the larger one without copying data. Shapes are compared from the trailing dimension; two dimensions are compatible if they are **equal or one of them is 1**." },
      { img: 'fds-broadcast' },
      { h: 'Rules (compare shapes from the right)' },
      { steps: ['If the arrays have different numbers of dimensions, pad the smaller shape with 1s on the left.', 'Two dimensions are compatible if they are equal or one of them is 1.', 'Size-1 dimensions are stretched to match. Otherwise: error.'] },
      { code: "a = np.arange(12).reshape(3, 4)\na + 10                    # scalar broadcast to every element\na + np.array([1, 2, 3, 4])        # (3,4) + (4,) → each row\na + np.array([[10], [20], [30]])  # (3,4) + (3,1) → each column\nnp.ones((3, 1)) + np.arange(4)    # (3,1) + (4,) → (3,4)\n# np.ones((3, 4)) + np.ones(3)    # error: 4 vs 3" },
      { table: { head: ['Shape A', 'Shape B', 'Result'], rows: [['(3, 4)', '(4,)', '(3, 4)'], ['(3, 4)', '(3, 1)', '(3, 4)'], ['(3, 1)', '(1, 4)', '(3, 4)'], ['(3, 4)', '(3,)', 'Error']] } },
      { h: 'Class Test I, question 3' },
      { code: 'A = np.array([10, 20, 30])\nB = np.array([1, 2, 3])\nprint(A + B)       # [11 22 33]' },
      'Output **[11 22 33]**. Concept: **vectorised element-wise operation** (a universal function, ufunc): arrays of the same shape are added element by element without a Python loop. (With different but compatible shapes, the same works through **broadcasting**.)',
    ],
    terms: [['Broadcasting', 'Automatic stretching of arrays with compatible shapes in arithmetic.']],
    exam: 'State the broadcasting rules, show three valid examples with result shapes and one that fails.',
    revise: ['Compare from the right', 'Equal or 1 is compatible'],
  },
  'fds.u3.dataframes': {
    oneLine: 'A DataFrame is pandas\' table: rows with an index, named columns, and each column can hold a different type — like a spreadsheet you can program.',
    blocks: [
      { def: "pandas DataFrame", text: "A **two-dimensional, size-mutable, labelled tabular data structure** with rows (index) and columns, where each column can have a different data type; like a spreadsheet or SQL table. Created from dictionaries, lists, NumPy arrays, CSV/Excel files." },
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
      { h: 'Creating a Series and a DataFrame (Class Test II, question 1)' },
      { code: 'import pandas as pd\n# Series: one-dimensional labelled array\ns = pd.Series([85, 92, 78], index=["Asha", "Ravi", "Kiran"], name="Marks")\n\n# DataFrame: two-dimensional labelled table\ndf = pd.DataFrame({"Name": ["Asha", "Ravi", "Kiran"],\n                   "Dept": ["CSE", "IT", "CSE"],\n                   "Marks": [85, 92, 78]})\nprint(s)\nprint(df)' },
    ],
    terms: [['Index', 'Row labels of a DataFrame.'], ['loc / iloc', 'Select by label / by integer position.']],
    exam: 'Show 4–5 creation methods with code, then loc/iloc and filtering.',
    revise: ['pd.DataFrame(dict | list of dicts | list of lists | ndarray)', 'loc = labels, iloc = positions'],
  },
  'fds.u3.series': {
    oneLine: 'A Series is a single labelled column of data — a one-dimensional array with an index; a DataFrame is a collection of Series sharing the same index.',
    blocks: [
      { def: "pandas Series", text: "A **one-dimensional labelled array** capable of holding any data type, with an associated **index** of labels; each column of a DataFrame is a Series." },
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
      { def: "Quandl", text: "A platform (now Nasdaq Data Link) providing **financial, economic and alternative datasets through an API**; the quandl Python package reads a dataset directly into a pandas DataFrame (quandl.get(\"code\")), which can then be queried and filtered." },
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
      { def: "Describing a DataFrame", text: "Summarising a DataFrame's structure and statistics: **df.describe()** (count, mean, std, min, quartiles, max for numeric columns), **df.info()** (columns, dtypes, non-null counts, memory), df.shape, df.head()/tail(), value_counts()." },
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
      { def: "Grouping (group by)", text: "The **split–apply–combine** operation: split the rows into groups by one or more keys, apply a function (sum, mean, count) to each group independently, and combine the results into a new DataFrame." },
      { def: "Joining (merge)", text: "Combining two DataFrames on **common key columns** (pd.merge) or on the index (df.join) using **inner, left, right or outer** joins, like SQL joins." },
      { img: 'fds-groupby' },
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
      { h: 'Class Test II, question 4(a): DataFrames A (Dept, Emp id, Salary) and B (Emp id, Name, Experience)' },
      { code: 'import pandas as pd\nA = pd.DataFrame({"Dept": ["Accounts", "Sales", "Accounts", "Sales", "HR"],\n                  "Emp id": [1, 2, 3, 4, 5],\n                  "Salary": [30000, 40000, 35000, 45000, 46000]})\nB = pd.DataFrame({"Emp id": [1, 2, 3, 4, 5],\n                  "Name": ["Surya", "Arha", "Syam", "Radha", "John"],\n                  "Experience": [2, 3, None, 3, 4]})\n\n# (i) group by Department and average salary\nprint(A.groupby("Dept")["Salary"].mean())\n# Accounts 32500.0, HR 46000.0, Sales 42500.0\n\n# (ii) join on the common column Emp id\nmerged = pd.merge(A, B, on="Emp id", how="inner")\n\n# (iii) find missing values and replace with the column mean\nprint(merged.isnull().sum())          # Experience: 1 (Syam)\nmerged["Experience"] = merged["Experience"].fillna(merged["Experience"].mean())\nprint(merged)                         # Syam gets (2+3+3+4)/4 = 3.0' },
    ],
    terms: [['groupby', 'Split-apply-combine operation.'], ['merge', 'SQL-style join on columns.']],
    exam: 'Explain split-apply-combine with a groupby example, then the 4 join types with a small two-table example and outputs.',
    revise: ['groupby(col).agg(...)', 'merge how = inner / left / right / outer', 'concat stacks'],
  },
  'fds.u3.missing-pandas': {
    oneLine: 'pandas marks missing data as NaN (or None/NaT); you find it with isnull(), remove it with dropna(), or fill it with fillna().',
    blocks: [
      { def: "Missing values in pandas", text: "Missing data is represented by **NaN** (or None/NaT). pandas detects it with **isnull()/isna(), notnull()**, removes it with **dropna()** and replaces it with **fillna()** (a constant, mean/median/mode, forward fill ffill, backward fill bfill) or **interpolate()**." },
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
      { def: "Pivot table", text: "A table that **summarises data by grouping rows into categories and aggregating values**, reorganising a long table into a cross-tabulation: pd.pivot_table(df, values=…, index=…, columns=…, aggfunc=…)." },
      { code: `pd.pivot_table(df, values="marks", index="department",
               columns="gender", aggfunc="mean", fill_value=0, margins=True)` },
      { img: 'fds-pivot' },
      { ul: ['`values`: what to aggregate.', '`index`: rows.', '`columns`: column headers.', '`aggfunc`: mean (default), sum, count, max, or a list.', '`margins=True`: adds an "All" total row and column.'] },
      'Related: `df.pivot()` reshapes without aggregation (needs unique index/column pairs); `pd.crosstab()` counts frequencies; `melt()` does the reverse (wide → long).',
      { h: 'Class Test II, question 4(b): average salary per department (DataFrame A)' },
      { code: 'pivot = pd.pivot_table(A, values="Salary", index="Dept", aggfunc="mean")\nprint(pivot)\n#             Salary\n# Dept\n# Accounts   32500.0\n# HR         46000.0\n# Sales      42500.0' },
      'values = the column to aggregate, index = the rows (one per department), aggfunc = the aggregation (mean). margins=True would add an overall average row (39200).',
    ],
    terms: [['Pivot table', 'Aggregated summary grid of one variable by two others.'], ['melt', 'Unpivot: wide → long format.']],
    exam: 'Write the pivot_table call with each argument explained and show the output grid.',
    revise: ['pivot_table(values, index, columns, aggfunc)', 'pivot (no aggregation), crosstab (counts), melt (reverse)'],
  },
  'fds.u3.dates': {
    oneLine: 'pandas turns text dates into real datetime values so you can extract parts (year, month, weekday), filter by date ranges, and resample time series.',
    blocks: [
      { def: "Dates and times in pandas", text: "pandas represents dates with **Timestamp/datetime64**, ranges with **date_range()**, and converts strings with **pd.to_datetime()**; the **.dt accessor** extracts parts (year, month, day, weekday), and a DatetimeIndex enables resampling and time-based slicing." },
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
}
