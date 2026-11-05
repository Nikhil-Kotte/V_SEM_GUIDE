// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default {
  "fds.u3.dataframes": {
    "summary": "A **DataFrame** is a table made using **pandas**, a Python library for working with data. It has rows and named columns. Different columns can store different types of data, such as names and marks.",
    "points": [
      "The **index** contains the row labels. If you do not provide labels, pandas normally uses 0, 1, 2, and so on.",
      "To create a table, use **pd.DataFrame()** after importing pandas as pd. With a **dictionary of lists**, each key becomes a column name. Its list supplies that column’s values. These lists must have equal lengths.",
      "With a **list of dictionaries**, each dictionary describes one row. With a **list of lists**, each inner list describes one row; use columns to supply column names.",
      "You can also create a DataFrame from a two-dimensional **NumPy array**, which arranges values in rows and columns. To load a CSV file, use **pd.read_csv()**.",
      "**loc** selects data using labels. **iloc** selects data using integer positions, counted from zero. A row label and its position are not always the same.",
      "You can add columns, select rows using a condition called a **boolean filter**, and arrange rows with **sort_values()**."
    ],
    "analogy": "Think of a DataFrame as a class marks register. Each row represents a student. Columns hold details such as name, marks, and grade.",
    "example": "Suppose df contains Megha with 88 marks and Anil with 56. The filter df[df[\"marks\"] > 80] returns only Megha’s row."
  },
  "fds.u3.dates": {
    "summary": "A date stored as text is just a label to pandas. **to_datetime** converts it into a **datetime** value, so pandas can work with its year, month, day, and time.",
    "points": [
      "**Parsing** means reading text using a date pattern. In **%d-%m-%Y**, %d means day, %m means month, and %Y means a four-digit year. So 05-03-2026 means 5 March 2026.",
      "The **.dt** accessor lets you get parts of dates in a column. For example, you can extract the year, month name, or weekday name.",
      "**date_range** generates a sequence of dates. Seven periods with a daily frequency gives seven consecutive dates.",
      "Make the date column the **index**, which labels the rows, and sort it by date. Then **.loc** can select a whole month or a date range. Date slices include both endpoints.",
      "**resample** groups observations into time intervals, such as months. You can then calculate totals. **rolling(7).mean()** averages seven consecutive observations; it represents seven days when there is one observation per day.",
      "**Timestamp** represents one moment. **DatetimeIndex** holds datetime values used as an index. **Timedelta** represents a duration, such as the difference between two dates. **Period** represents a time span, such as one month."
    ],
    "analogy": "Think of organising receipts in a calendar: you can find a day's receipts or add up a month's spending.",
    "example": "Suppose sales are 100 on 1 March and 200 on 2 March, with no other March entries. Resampling into monthly totals gives 300 for March."
  },
  "fds.u3.describe": {
    "summary": "A **DataFrame** is a table with rows and columns. **Describing a DataFrame** means checking its size, contents, missing values and basic statistics before analysing it.",
    "points": [
      "**df.shape** gives (number of rows, number of columns). **df.head(n)** shows the first n rows. **df.tail(n)** shows the last n rows.",
      "**df.info()** shows column names, data types, non-null counts and memory use. A **data type** tells you what kind of values a column holds. **Non-null** means not missing.",
      "**df.dtypes** lists column data types. **df.columns** gives column names.",
      "**df.describe()** usually summarises numeric columns. **count** counts non-missing values. **mean** is the average. **std**, or standard deviation, measures how spread out the values are. **min** and **max** are the smallest and largest values.",
      "**25%, 50% and 75%** are quartiles. They mark the quarter, halfway and three-quarter positions in ordered data. **50%** is the **median**, or middle value.",
      "**df.describe(include=\"object\")** summarises object columns, commonly used for text. It shows **count**, **unique** (number of distinct values), **top** (most common value) and **freq** (how often that value appears).",
      "**df[\"col\"].value_counts()** counts occurrences of each value. **df.isnull().sum()** counts missing values per column. **df.nunique()** counts distinct values per column. By default, value_counts() and nunique() exclude missing values."
    ],
    "analogy": "It is like checking a class register: its size, empty entries and overall marks.",
    "example": "For marks 60, 70 and 80, **count** is 3, **mean** is 70, **min** is 60 and **max** is 80."
  },
  "fds.u3.group-join": {
    "summary": "A **DataFrame** is a table with rows and columns. **Grouping** helps you calculate results for sets of rows. **Joining** brings information from two tables together.",
    "points": [
      "**groupby** follows **split–apply–combine**. Split rows into groups, apply a calculation to each group, and combine the answers. Grouping by department lets you find each department’s average marks.",
      "**Aggregation** means turning several values into a summary, such as a mean (average), maximum (highest value), or count. Use **agg** to calculate several summaries together. A count of names counts only non-missing names.",
      "You can group by multiple columns. Grouping by department and gender gives a separate result for each department–gender combination.",
      "**merge** combines tables using matching **keys**, such as an employee number. An **inner join** keeps matches only. A **left join** keeps every left-table row; a **right join** keeps every right-table row.",
      "An **outer join** keeps all keys from both tables. Where no match exists, the missing information appears as **NaN**, a marker for a missing value.",
      "**join** uses the **index** (row labels) by default. **concat** stacks tables vertically by default. With axis=1, it places them side by side, aligning rows by their index."
    ],
    "analogy": "Grouping is like sorting students into department queues and finding each queue’s average score. Joining is like matching attendance and marks sheets using roll numbers.",
    "example": "CSE students score 60 and 80; an ECE student scores 90. Grouping by department and finding the mean gives CSE: 70, ECE: 90."
  },
  "fds.u3.missing-pandas": {
    "summary": "**Missing values** are entries where data is unavailable, such as a student’s marks left blank. pandas can represent them as **NaN** (Not a Number), **None**, or **NaT** (Not a Time, for dates and times). You can find, remove, or fill these gaps.",
    "points": [
      "**isnull()** gives True for missing entries and False for others. **isnull().sum()** counts missing entries in each column. **notnull()** gives True where data is present.",
      "**dropna()** removes rows containing any missing value. With **how=\"all\"**, it removes a row only when every entry is missing.",
      "Use **subset=[\"marks\"]** to check only the marks column when dropping rows. **axis=1** drops columns containing missing values. **thresh=3** keeps rows with at least three non-missing entries.",
      "**fillna()** replaces missing entries. You can use a constant such as 0, the **mean** (average), the **median** (middle value after sorting), or the **mode** (most frequent value). Choose a replacement that makes sense for the data.",
      "**Forward fill**, or **ffill**, copies the previous available value into a gap. **Backward fill**, or **bfill**, uses the next available value.",
      "**interpolate()** estimates missing numerical values using surrounding values. For equally spaced entries, linear interpolation fills gaps along a straight line between known values."
    ],
    "analogy": "Think of an attendance sheet with empty boxes. You can locate the blanks, remove incomplete records, or fill the blanks using a suitable rule.",
    "example": "Suppose marks are 60, missing, and 80. The mean of the available marks is 70. Filling the gap with this mean gives 60, 70, and 80."
  },
  "fds.u3.pivot": {
    "summary": "A **pivot table** turns a long list of records into a small summary grid. It groups similar records and uses an **aggregate**, meaning a summary calculation such as an average, to fill each cell.",
    "points": [
      "Use **pd.pivot_table()** to create it. For student marks, you can put departments down the side and genders across the top. Each cell shows the average marks for that department and gender.",
      "**values** chooses the data to calculate, such as marks. **index** chooses the row groups, such as departments. **columns** chooses the column groups, such as genders.",
      "**aggfunc** chooses the calculation. **mean**, meaning average, is the default. Other choices include sum, count, and max. A list lets you use several calculations.",
      "**fill_value=0** displays zero in missing result cells. **margins=True** adds an **All** row and column. These use the chosen calculation: with mean, they show overall averages, not sums.",
      "**df.pivot()** rearranges data without calculating a summary. Each row-group and column-group pair must be unique. **pd.crosstab()** counts how often combinations occur by default.",
      "**melt()** changes **wide format**, where values occupy several columns, into **long format**, where those values occupy more rows. This is called **unpivoting**."
    ],
    "analogy": "Think of sorting shopping receipts into a grid by shop and month, then adding the amounts in each group.",
    "example": "Suppose CSE boys scored 60 and 80, while CSE girls scored 90. With department as rows, gender as columns, and mean as the calculation, the CSE row shows boys: 70 and girls: 90."
  },
  "fds.u3.quandl": {
    "summary": "**Quandl**, now called **Nasdaq Data Link**, provides financial and economic data online. You can download this data into a **pandas DataFrame**, a table of rows and columns in Python, and then select the information you need.",
    "points": [
      "An **API** lets your Python program request data from a service. An **API key** is your personal token that authorises access to downloads.",
      "**quandl.get()** requests a dataset. The dataset code identifies the data you want. **start_date** and **end_date** choose the time period.",
      "First, inspect the table. **head()** shows its first few rows. **shape** gives the row and column counts. **columns** lists column names. **describe()** gives summary statistics, such as the average and minimum.",
      "**Boolean filtering** keeps rows where a condition is true. **query()** also filters rows, but you write the condition as a string expression.",
      "The returned table has a **DatetimeIndex**, meaning dates label its rows. **loc** selects dates or months. **resample()** groups values into time periods, allowing calculations such as monthly averages.",
      "The free **WIKI dataset** is no longer updated. For a saved CSV file, use **pd.read_csv()** with parse_dates=[\"Date\"] and index_col=\"Date\" to make dates the row labels."
    ],
    "analogy": "Think of Quandl as a library. You request a book of records, then find the entries you need.",
    "example": "In historical Apple data, df[df[\"Close\"] > 115] keeps only days when the **Close**, or closing share price, was above 115."
  },
  "fds.u3.series": {
    "summary": "A **pandas Series** stores one column of data with a label for each value. It is **one-dimensional (1-D)**, which means it has one direction, like a single list.",
    "points": [
      "The **index** is the set of labels attached to the values. Labels help you find data. For example, a student's name can label their marks.",
      "You can create a Series from a list and supply index labels. You can also use a **dictionary**, which stores key-value pairs. Its keys become the index labels.",
      "A Series has one **dtype**, meaning the data type used to store its values. pandas also supports **missing values**, often shown as NaN.",
      "**Boolean filtering** selects values using a condition that is true or false. For example, you can keep only marks above 60.",
      "**Vectorised operations** work across the values without you writing a loop. Adding 5 updates every value in the result. Functions such as mean() and max() find the average and highest value.",
      "**Index alignment** means calculations between Series match labels, not positions. A **DataFrame** is a two-dimensional table whose columns share an index. Selecting one column, such as df[\"marks\"], gives a Series."
    ],
    "analogy": "Think of a Series as a labelled row of lockers. Each locker holds a value, and its label helps you find it.",
    "example": "Suppose s stores marks: Megha: 88, Anil: 56, Sneha: 81. Then s[\"Anil\"] gives 56. Filtering with s[s > 60] keeps Megha: 88 and Sneha: 81, including their labels."
  },
  "fds.u4.cleaning": {
    "summary": "**Data cleaning** means finding and fixing problems in raw data so it becomes reliable for analysis. Explore the data first, then decide what to fix or remove.",
    "points": [
      "**Exploring data** means checking what you have. In Python’s pandas library, head() shows the first rows. info() shows column types and non-missing counts. describe() gives a statistical summary.",
      "Use value_counts() to count each value, isnull().sum() to count **missing values**, and duplicated().sum() to count repeated rows. Quick plots can help you spot unusual values.",
      "**Noise** means errors or irrelevant variation. **Column-wise filtration** removes whole columns, such as irrelevant details, columns with too many missing values, or columns whose values hardly change. Keep IDs if they are useful.",
      "**Row-wise filtration** removes unwanted records. A **duplicate** is a repeated record; drop_duplicates() removes repeated rows. You can also filter out impossible ages, negative marks, or rows missing essential information.",
      "Fix **data types** so numbers and dates are stored correctly. **Standardise text** by removing extra spaces and using consistent letter case. This makes labels such as CSE and cse match.",
      "Handle missing values by filling them suitably or removing affected data. Investigate **outliers**, unusually high or low values, before removing them. **Encoding** represents categories using numbers."
    ],
    "analogy": "Cleaning data is like checking groceries: remove repeated entries from your shopping list, correct wrong quantities, and check suspicious items.",
    "example": "In a student table, remove a repeated record, standardise “ cse ” to “CSE”, and reject age −5. Check an unusually high mark before deciding whether it is wrong."
  },
  "fds.u4.correlation": {
    "summary": "**Correlation** tells us how strongly two numeric variables move together and in which direction. A variable is something that can change, such as marks or attendance. **Types of analysis** describe whether we study one, two, or several variables.",
    "points": [
      "**Univariate analysis** studies one variable. For marks alone, we can find the **mean** (average), **median** (middle value), and **standard deviation** (how spread out the marks are). A **histogram** shows how often different ranges of marks occur.",
      "**Bivariate analysis** studies two variables, such as attendance and marks. A **scatter plot** shows each student's two values as one dot, helping us spot a relationship.",
      "**Multivariate analysis** studies three or more variables, such as marks, attendance, and study hours. A **correlation heatmap** uses colours to show correlations between pairs of numeric variables.",
      "**Pearson r** measures a **linear relationship**: how closely the points follow a straight line. It ranges from −1 to +1. +1 means perfect positive correlation; −1 means perfect negative correlation; 0 means no linear relationship.",
      "**Spearman ρ** uses **ranks**, or positions in sorted order. It measures a **monotonic relationship**: values generally move in one direction as the other variable increases. It is less sensitive to extreme values than Pearson.",
      "**Correlation is not causation**. Two things changing together does not prove that one causes the other."
    ],
    "analogy": "Think of correlation as two walkers: their movements may match, oppose each other, or show no clear pattern.",
    "example": "If students with higher attendance generally have higher marks, the two variables have **positive correlation**."
  },
  "fds.u4.encoding": {
    "summary": "**Feature encoding** means changing category names into numbers so a machine-learning model can use them. The main question is whether the categories have a meaningful order.",
    "points": [
      "**Nominal** categories have no natural order. For example, CSE, ECE and IT are department names. None is automatically higher or lower than another.",
      "**One-hot encoding** creates a separate column for each category. A value of 1 means “this category applies.” A value of 0 means “it does not apply.” Use it for unordered input categories.",
      "**Label encoding** gives each category an integer, such as CSE → 0, ECE → 1 and IT → 2. It is commonly used for **target labels**, meaning the categories the model must predict. These numbers act as category IDs.",
      "**Ordinal** categories have a meaningful order. **Ordinal encoding** assigns numbers that follow that order, such as Low → 0, Medium → 1 and High → 2.",
      "Choose carefully. Label-encoding an unordered input can make a **linear model** treat the codes as numerical amounts. One-hot encoding avoids suggesting this false order."
    ],
    "analogy": "Think of departments as students wearing numbered jerseys. Jersey 2 does not mean someone is better than jersey 1. Likewise, a department’s code does not give it a rank.",
    "example": "For departments CSE, ECE and IT, one-hot encoding represents an ECE student as CSE = 0, ECE = 1, IT = 0. Only the matching department gets 1."
  },
  "fds.u4.hypothesis": {
    "summary": "**Hypothesis testing** uses a **sample**, a smaller group, to check a claim about a **population**, the whole group. It asks whether the evidence is strong enough to reject a starting assumption.",
    "points": [
      "State **H₀ (null hypothesis)**, the starting claim, such as “the average is 10 minutes.” State **H₁ (alternative hypothesis)**, the competing claim, such as “the average differs from 10 minutes.”",
      "Choose **α (significance level)** before testing, usually 0.05. This sets the risk of rejecting H₀ when it is actually true.",
      "Choose a suitable test. Calculate its **test statistic**, a number measuring how far the sample result is from what H₀ predicts.",
      "The **p-value** is the probability of a result this extreme or more extreme, assuming H₀ is true. It is not the probability that H₀ is true.",
      "If **p ≤ α**, **reject H₀**. Otherwise, **fail to reject H₀**. This does not prove H₀. Rejecting a true H₀ is a **Type I error**; failing to reject a false H₀ is a **Type II error**.",
      "A **one-tailed test** checks one direction, such as greater than 10. A **two-tailed test** checks either direction.",
      "Use a **z-test** for means when population spread is known and conditions fit; a **t-test** when it is estimated. **Chi-square** checks association between categories. **ANOVA** compares means across groups."
    ],
    "analogy": "Think of a smoke alarm: smoke provides evidence of fire, but silence does not prove safety.",
    "example": "For 30 readers, suppose a suitable two-tailed test gives **p = 0.03**. With **α = 0.05**, reject H₀: there is evidence that average reading time differs from 10 minutes."
  },
  "fds.u4.missing": {
    "summary": "**Missing values** are blanks in your data, such as a student’s age left unanswered. You can **drop** the affected rows or columns, or **fill** the blanks with sensible estimates. Filling is called **imputation**, and your choice can change the results.",
    "points": [
      "**MCAR** means missing completely at random. **MAR** means missingness depends on other recorded data. **MNAR** means it depends on the missing value itself, such as high earners skipping income.",
      "**Dropping rows** with **dropna** is reasonable when few rows have missing values and missingness is MCAR. It loses data and can introduce bias if missingness is not random. Dropping a mostly empty column removes a variable.",
      "**Mean imputation** fills with the average. It suits roughly symmetric numeric data. It preserves the observed mean but reduces **variance**, meaning spread, and can weaken correlations.",
      "**Median imputation** uses the middle value. It suits skewed data or data with extreme values, called **outliers**. It still reduces spread.",
      "**Mode imputation** uses the most common category. This makes that category appear more often.",
      "**Forward fill** uses the previous value; **backward fill** uses the next. Both assume values persist. **Interpolation** estimates between known values in ordered data.",
      "**Model-based imputation**, such as KNN or regression, uses patterns to estimate missing values. It is more complex and is not always best."
    ],
    "analogy": "Think of an incomplete attendance sheet: remove incomplete entries or estimate their blanks using available information.",
    "example": "Marks are 60, 80, and missing. Mean imputation fills the blank with 70."
  },
  "fds.u4.outliers": {
    "summary": "**Outliers** are values that are much higher or lower than most other values. They can affect your analysis, so check why they occur before deciding what to do with them.",
    "points": [
      "A **box plot** shows how values are spread out. Points beyond its whiskers help you spot possible outliers.",
      "The **IQR (interquartile range)** measures the spread of the middle 50% of values. Calculate it as **IQR = Q3 − Q1**. Q1 and Q3 are the 25th and 75th percentiles.",
      "The **IQR rule** flags values below **Q1 − 1.5 × IQR** or above **Q3 + 1.5 × IQR**. These limits are called **fences**.",
      "A **Z-score** tells you how many standard deviations a value is from the mean. The mean is the average; standard deviation measures spread. Use **z = (x − μ) / σ**, where μ is the mean and σ is the standard deviation. **|z| > 3** flags a possible outlier.",
      "**Correct or remove** data-entry errors. **Cap** extreme values by replacing them with chosen limits, such as the fences. A **log transformation** can reduce skew, or unevenness in the distribution. **Keep** genuine unusual values when they matter."
    ],
    "analogy": "An outlier is like one unusually tall student in a class. Standing out does not mean something is wrong.",
    "example": "If Q1 = 60 and Q3 = 85, IQR = 25. The fences are 22.5 and 122.5. A mark of 10 is flagged, but it could still be genuine."
  },
  "fds.u4.titanic": {
    "summary": "The Titanic dataset contains information about passengers, such as sex, ticket class, age, fare and survival. **Multivariate analysis** studies several variables together to understand patterns in survival. A **variable** is simply a recorded detail about each passenger.",
    "points": [
      "**Univariate analysis** looks at one variable. Studying survival alone shows that about 38% of passengers in this dataset survived.",
      "**Bivariate analysis** looks at two variables together. Comparing sex and survival shows that about 74% of women survived, compared with 19% of men.",
      "**Multivariate analysis** combines more details. Looking at sex, class and survival together shows that almost all first-class women survived, while most third-class men did not.",
      "A **pivot table** summarises groups in rows and columns. Here, rows can represent sex, columns can represent class, and each cell can show the survival rate. A **bar plot** makes these groups easy to compare.",
      "**Correlation** describes how two numerical variables vary together. Higher fares were associated with higher survival, and fare also relates to class. A **heatmap** displays correlations using colours. Correlation alone does not prove cause.",
      "Age also matters: children generally had higher survival than adults. A **pair plot** is a grid of plots showing relationships between pairs of numerical variables."
    ],
    "analogy": "It is like studying exam marks alongside both attendance and study time. Looking at several details together gives a fuller picture.",
    "example": "Because **survived** uses 1 for survival and 0 otherwise, its **mean** gives the survival rate. If 8 of 10 passengers in a group survived, its mean is 0.8, or 80%."
  },
  "fds.u4.ttest": {
    "summary": "A **t-test** helps us decide whether a difference in averages is convincing or could reasonably come from random sampling. We use it when the **population standard deviation**, the spread in the whole population, is unknown; it works with small samples when its assumptions hold.",
    "points": [
      "The **null hypothesis (H₀)** says there is no difference in the means being compared. The **alternative hypothesis (H₁)** says there is a difference.",
      "A **one-sample t-test** compares one group’s mean with a claimed value. An **independent two-sample t-test** compares two separate groups.",
      "A **paired t-test** compares linked measurements, such as the same students’ marks before and after training.",
      "For one sample, **t = (x̄ − μ₀) / (s / √n)**. Here, x̄ is the sample mean, μ₀ the claimed mean, s the sample standard deviation, and n the sample size. **Degrees of freedom** are n − 1.",
      "Observations must be independent across subjects. Small samples should come from roughly normal populations; for paired tests, this applies to the differences. Larger samples help, but n ≥ 30 is not a guarantee.",
      "The classic independent test assumes equal population variances, meaning equal spread. **Welch’s t-test** does not require equal variances."
    ],
    "analogy": "It is like deciding whether a slightly heavier grocery bag really contains more, allowing for ordinary variation between bags.",
    "example": "A teacher claims a mean of 70. For 9 students, mean = 74 and s = 6. Thus, t = 4/2 = 2 and df = 8. At the **5% significance level**, a **two-tailed test**, checking either direction, has critical values ±2.306. Since |2| < 2.306, **fail to reject H₀**. The evidence is insufficient; it does not prove the mean is 70."
  },
  "fds.u5.cluster-metrics": {
    "summary": "**Clustering** means putting similar data points into groups. **Evaluating clustering performance** means checking how good those groups are. We use **internal metrics** when true labels are unavailable, or **external metrics** to compare groups with known correct labels.",
    "points": [
      "**Internal metrics** use the data and its clusters. They check whether points within each group are close together and different groups are far apart.",
      "**Davies-Bouldin index (DBI)** compares spread inside clusters with distances between their centres. It averages each cluster’s worst comparison. Lower is better; 0 is best.",
      "**Silhouette coefficient** uses a, the average distance to points in the same cluster, and b, the smallest average distance to another cluster. Its formula is (b − a)/max(a, b), averaged across points. Values near 1 are good; negative values suggest poor placement.",
      "**External metrics** check pairs of points. **TP**: together in both clustering and true classes. **FP**: together only in clustering. **FN**: together only in true classes. **TN**: separate in both.",
      "**Rand index** = (TP + TN)/all pairs. **Jaccard score** = TP/(TP + FP + FN). Both reward correct pair decisions, but Jaccard ignores TN.",
      "**Precision (P)** = TP/(TP + FP). **Recall (R)** = TP/(TP + FN). **F1-score** = 2PR/(P + R). **Fowlkes-Mallows index** = √(P × R). Higher is better for these scores."
    ],
    "analogy": "Think of sorting laundry. Internal checks judge similarity within piles. External checks compare the piles with known clothing categories.",
    "example": "If TP = 20, FP = 5, FN = 10 and TN = 65, **Rand = 0.85**, **Jaccard ≈ 0.57**, **F1 ≈ 0.727** and **Fowlkes-Mallows ≈ 0.730**."
  },
  "fds.u5.dbscan": {
    "summary": "**DBSCAN** stands for **Density-Based Spatial Clustering of Applications with Noise**. It groups nearby, tightly packed points into **clusters**, meaning groups. Points away from these dense groups are labelled **noise**.",
    "points": [
      "**eps (ε)** is the radius used to look around a point. **minPts** is the minimum number of points needed inside that radius. Count the point itself too.",
      "A **core point** has at least minPts points within its eps radius, including itself. It can help grow a cluster.",
      "A **border point** is within eps of a core point but does not have enough nearby points to be core itself.",
      "A **noise point** is neither core nor border. In Python’s scikit-learn, noise gets the label **-1**.",
      "Start with an unvisited point. If it is core, build a cluster by following neighbouring core points and including their border points. Otherwise, mark it as noise for now; it may later become border. Repeat until every point is visited.",
      "DBSCAN needs no preset **k**, or number of clusters. It finds irregular cluster shapes and identifies outliers.",
      "Results depend on eps and minPts. It struggles when clusters have different densities, or when many features make distances less useful."
    ],
    "analogy": "Think of people in a park: crowded groups form clusters, people at their edges are border points, and isolated people are noise.",
    "example": "Take points at 0, 0.1, 0.2, and 5. With **eps = 0.15** and **minPts = 3**, 0.1 is core; 0 and 0.2 are border. These three form one cluster. The point at 5 is noise."
  },
  "fds.u5.dummy": {
    "summary": "**Dummy variables** turn categories, such as city names, into columns containing only 0 and 1. This lets us use categories in **regression**, a method for predicting a numerical value. Each dummy column answers a simple question: “Does this row belong to this category?”",
    "points": [
      "A value of **1** means “yes, it belongs.” A value of **0** means “no, it does not.”",
      "For a category with **k** possible values, use **k − 1 dummy columns** when the regression includes an **intercept**, its constant term.",
      "The category whose column is dropped becomes the **reference category**, or baseline. Its rows have 0 in all the remaining dummy columns.",
      "Keeping all k columns creates the **dummy variable trap** when an intercept is included. The columns always add up to 1, repeating the intercept’s information.",
      "This is **perfect multicollinearity**: one input is an exact combination of others. The regression coefficients cannot be determined uniquely. Dropping one dummy column fixes this particular problem.",
      "A dummy variable’s **coefficient**, the number multiplying it in the regression equation, tells us the predicted difference from the reference category, keeping other inputs unchanged."
    ],
    "analogy": "Think of labelled switches. Each city switches on its own indicator. The reference city is recognised because every remaining switch is off.",
    "example": "Use Chennai as the reference. With columns city_Hyderabad and city_Pune, Chennai becomes (0, 0), Hyderabad (1, 0), and Pune (0, 1). If city_Pune’s coefficient is 5, Pune’s predicted y is 5 units higher than Chennai’s, all else equal."
  },
  "fds.u5.hierarchical": {
    "summary": "**Hierarchical clustering** groups similar data points and builds a tree of groups called a **dendrogram**. It helps you see small groups joining into bigger ones. **Agglomerative clustering** builds from the bottom by merging groups. **Divisive clustering** starts with one big group and splits it into smaller groups.",
    "points": [
      "In **agglomerative clustering**, start with each data point as a separate **cluster**, meaning a group of points.",
      "Calculate a **distance matrix**: a table showing how far each point is from every other point. Merge the two closest clusters.",
      "Use a **linkage** rule to measure distance between clusters. **Single linkage** uses the closest pair of points. It can form long chains. **Complete linkage** uses the farthest pair and tends to produce compact groups.",
      "**Average linkage** uses the average distance across all pairs between two clusters. **Ward linkage** chooses the merge that causes the smallest increase in the total squared distances of points from their cluster centres.",
      "Update cluster distances and keep merging until one cluster remains. Cut the **dendrogram** across a chosen height to get separate clusters.",
      "You do not need to choose **k**, the number of clusters, before building the tree.",
      "It can be slow for large datasets. Storing the full distance matrix needs **O(n²) memory**. Once clusters merge, that merge cannot be undone."
    ],
    "analogy": "Think of nearby students forming pairs, then pairs joining into groups, until the whole class becomes one group.",
    "example": "For values 1, 2, 8, and 9, nearby pairs form {1, 2} and {8, 9}. Cutting the dendrogram before their final merge gives two clusters."
  },
  "fds.u5.kmeans": {
    "summary": "**K-Means Clustering** puts similar data points into groups called **clusters**. You choose the number of groups, called **k**, and the algorithm finds a centre for each group. It helps you spot patterns in data.",
    "points": [
      "Choose **k** first. For example, k = 2 means you want two clusters.",
      "Pick starting centres called **centroids**. These can be chosen randomly. **k-means++** is a smarter starting method that tends to spread the centres apart.",
      "**Assign** each point to its nearest centroid using **Euclidean distance**. This means straight-line distance.",
      "**Update** each centroid by finding the **mean**, or average, of its assigned points. Repeat assign and update until the groups stop changing or the maximum number of rounds is reached.",
      "**Strengths:** It is simple, fast, easy to understand, and useful for large datasets.",
      "**Weaknesses:** You must choose k. Starting centres and **outliers**, unusually far-away points, can affect the result. It works best with roughly round, similarly sized clusters. Numeric features need **scaling**, which puts their values on comparable scales."
    ],
    "analogy": "Imagine students gathering around k meeting spots. Each student chooses the nearest spot. Each spot then moves to the average position of its students. This repeats until the groups settle.",
    "example": "Take 2, 4, 10, 12, 3, 20, 30, 11, 25. With **k = 2** and starting centres 2 and 4, repeated rounds give clusters {2, 3, 4, 10, 11, 12} and {20, 25, 30}. Their final **centroids** are 7 and 25."
  },
  "fds.u5.linear": {
    "summary": "**Regression analysis** predicts a number, such as marks, from given information. **Linear regression** describes this relationship using a straight-line equation.",
    "points": [
      "**Simple linear regression** uses one input, such as study hours. Its equation is ŷ = β₀ + β₁x. Here, x is the input and ŷ is the predicted output.",
      "**Multiple linear regression** uses several inputs, such as hours and attendance. Its equation is ŷ = β₀ + β₁x₁ + … + βₙxₙ.",
      "The **intercept**, β₀, is the prediction when all inputs are zero. A **coefficient**, such as β₁, tells us how much the prediction changes when its input increases by one unit, keeping other inputs fixed.",
      "**Least squares** chooses coefficients that minimise Σ(yᵢ − ŷᵢ)². In simple words: subtract each prediction from the actual value, square each difference, and add them. Each difference is a **residual**.",
      "Assumptions include a **linear relationship**, **independent errors** that do not depend on one another, and **homoscedasticity**, meaning the error spread stays constant.",
      "**Normally distributed errors** means errors follow a bell-shaped distribution; this assumption supports statistical tests. Avoid **strong multicollinearity**, where inputs are so closely related that their separate coefficients become difficult to estimate reliably."
    ],
    "analogy": "Think of estimating a taxi fare: start with a base charge, then add amounts for distance and waiting time.",
    "example": "Suppose predicted marks = 10 + 5 × hours + 0.5 × attendance percentage. For 6 hours and 90% attendance, the prediction is 85 marks. Actual marks may differ."
  },
  "fds.u5.logistic": {
    "summary": "**Logistic regression** predicts which category something belongs to, such as pass or fail. It performs **classification**, meaning choosing a category, by first estimating its probability.",
    "points": [
      "First, it combines inputs into a score: z = β₀ + β₁x₁ + … + βₙxₙ. Here, x values are inputs, β values are learned weights, and β₀ is the starting value.",
      "The **sigmoid function**, p = 1/(1 + e^(−z)), converts this score into a probability between 0 and 1. Its graph is S-shaped. Usually, p ≥ 0.5 means class 1. This cutoff is called the **threshold** and can be changed.",
      "**Odds** are p/(1−p). **Log-odds**, or the **logit**, are log(p/(1−p)). Logistic regression models log-odds with a linear equation.",
      "**Binary** means two classes. **Multinomial** means three or more unordered classes. **Ordinal** means three or more ordered classes, such as low, medium and high.",
      "Training uses **maximum likelihood**: choosing weights that make the observed class labels most likely. **Linear regression** instead usually uses **least squares** and predicts numerical amounts.",
      "The model is simple, fast and easy to interpret. Its basic **decision boundary**, which separates predicted classes, is linear. Complex patterns can be difficult. **Regularisation** discourages large weights and helps reduce overfitting.",
      "Check predictions using **accuracy**, **precision**, **recall** and **F1**. A **confusion matrix** counts correct and incorrect predictions for each class."
    ],
    "analogy": "Think of a probability meter followed by a gate: the meter estimates the chance, and the threshold decides which category gets selected.",
    "example": "For pass = 1, a predicted probability of 0.8 means an estimated 80% chance of passing. With a 0.5 threshold, the prediction is pass."
  },
  "fds.u5.metrics": {
    "summary": "A **regression model** predicts a number, such as a house price. We check its performance by comparing predictions with actual values. **MAE**, **MSE**, and **RMSE** measure prediction errors. **R²** compares the model with simply predicting the mean.",
    "points": [
      "A **residual** is actual value minus predicted value: y − ŷ. It can be positive, negative, or zero. Here, ŷ means the predicted value.",
      "**MAE (Mean Absolute Error)**: ignore each error’s sign, then take the average. It tells you how far predictions are off, on average, in the original units.",
      "**MSE (Mean Squared Error)**: square each error, then take the average. Squaring gives bigger mistakes more weight. Its units are squared.",
      "**RMSE (Root Mean Squared Error)**: take the square root of MSE. This returns the error measure to the original units. Large errors still strongly affect it. Lower MAE, MSE, and RMSE are better; zero means perfect predictions.",
      "**R²** = 1 − SS_res/SS_tot. **SS_res** is the sum of squared prediction errors. **SS_tot** is the sum of squared distances from the actual mean. R² = 1 means perfect predictions; 0 matches predicting the mean; negative means worse. It is undefined when all actual values are identical.",
      "**Adjusted R²** accounts for the number of input features. It penalises adding features that do not improve the model enough."
    ],
    "analogy": "Think of predicting travel times: error metrics measure how far your guesses miss the actual times.",
    "example": "Actual: [3, 5, 7]. Predicted: [2, 5, 9]. Residuals: [1, 0, −2]. **MAE = 1**, **MSE ≈ 1.67**, **RMSE ≈ 1.29**. The actual mean is 5, so **R² = 1 − 5/8 = 0.375**."
  },
  "fds.u5.model-dev": {
    "summary": "**Regression** predicts a number, such as a house price, using other information. Developing a **regression model** means preparing data, learning a relationship, and checking how well it predicts new cases.",
    "points": [
      "First, **load** the data. Here, pandas reads housing.csv into a table. **Explore and visualise** it to spot patterns, missing values, and possible relationships.",
      "**Clean** the data. In these notes, dropna() removes rows with missing values. This is one cleaning method; it is not always the best choice.",
      "**Encode** categories by turning labels into numeric columns. For example, get_dummies() can represent house types using 0 and 1.",
      "Choose **features**, the inputs used for prediction, and a **target**, the number to predict. Check **multicollinearity**, where input features are strongly related to each other.",
      "Use a **train/test split**. Here, 80% of the rows train the model. The remaining 20% test it on data it has not learned from.",
      "**Fit** LinearRegression on the training data. It learns coefficients, or weights, for the features. Then **predict** prices using the test features.",
      "**Evaluate** predictions against actual prices. **R²** measures performance relative to predicting the target’s mean. **RMSE** measures prediction error in the target’s units; lower is better. **statsmodels OLS** also reports coefficients, p-values for statistical tests, and R²."
    ],
    "analogy": "It is like studying solved problems, then checking your learning with unseen questions.",
    "example": "Use house area and bedroom count to predict price. If the actual price is ₹50 lakh and the prediction is ₹48 lakh, the absolute error is ₹2 lakh."
  },
  "fds.u5.multicollinearity": {
    "summary": "**Multicollinearity** happens when two or more inputs in a regression carry very similar information. Regression predicts an outcome using inputs. It becomes hard to separate each input’s effect, so its **coefficient**—the weight assigned to it—can change a lot when the data changes slightly.",
    "points": [
      "Prediction may still be accurate. But coefficients can switch signs or have large **standard errors**, meaning their estimated values are uncertain.",
      "A **correlation matrix** lists relationships between pairs of inputs. A **heatmap** shows them using colours. **|r| > 0.8** is a warning, whether the relationship is positive or negative. Pairwise checks can miss relationships involving several inputs.",
      "**VIF (Variance Inflation Factor)** checks how well the other inputs explain one input. **VIF = 1 / (1 − R²ᵢ)**. Here, **R²ᵢ** is the fraction of that input’s variation explained by the others. Values above **5 or 10** are common warning thresholds.",
      "**Drop one input** from a highly correlated pair, or **combine inputs** into a meaningful feature.",
      "**PCA (Principal Component Analysis)** replaces the inputs with new, uncorrelated combinations called components.",
      "**Regularisation**, such as **Ridge** or **Lasso**, limits coefficient sizes. It manages the problem; it does not make the original inputs uncorrelated.",
      "**Collecting more varied data** may help. More observations alone will not necessarily fix it."
    ],
    "analogy": "It is like two teammates always working together. Separating each person’s contribution becomes difficult.",
    "example": "When predicting house price, **size** and **rooms** may overlap strongly. Keeping size and dropping rooms is one possible solution."
  },
  "fds.u5.num-clusters": {
    "summary": "**Clustering** means putting similar data points into groups. In **k-means**, we choose the number of groups, called **k**. The **Elbow method** and **Silhouette method** help us choose a suitable k.",
    "points": [
      "**WCSS**, also called **inertia**, measures how spread out the groups are. It adds the squared distances from every point to its own cluster centre. Smaller values mean tighter groups.",
      "For the **Elbow method**, try k = 1 to 10. Plot k against WCSS. WCSS usually falls as k increases. Choose the bend, or **elbow**, where adding more clusters gives only a small improvement. Sometimes there is no clear bend.",
      "The **Silhouette score** checks whether a point fits its own group better than another group. **a(i)** is its average distance to the other points in its own cluster. **b(i)** is the smallest average distance to points in any other cluster.",
      "The formula is **s(i) = (b(i) − a(i)) / max(a(i), b(i))**. Scores range from **−1 to +1**. Near +1 means well grouped. Near 0 means near a boundary. Negative means possibly assigned to the wrong group.",
      "For the **Silhouette method**, compare the average scores for different k values, starting at 2. Choose the k with the **highest average silhouette score**."
    ],
    "analogy": "Think of seating friends at tables: people should sit close to their own group and apart from other groups.",
    "example": "If average silhouette scores for k = 2, 3, and 4 are 0.45, 0.68, and 0.52, choose **k = 3** among these options."
  },
  "fds.u5.pca": {
    "summary": "**Dimensionality reduction** means using fewer features, or measured properties, to describe data. **Principal Component Analysis (PCA)** does this by creating new features that keep as much **variance**, or spread in the data, as possible.",
    "points": [
      "Fewer features can make models faster and may reduce **overfitting**, where a model learns training details that do not generalise. Reducing data to two or three features also helps us draw and explore it.",
      "Each **principal component** is a weighted sum of the original features. This means multiplying each feature by a chosen number, then adding the results. PCA creates new features rather than simply selecting old ones.",
      "First, **standardise** features, usually to mean 0 and standard deviation 1. This puts different measurement scales on a comparable footing.",
      "Next, calculate the **covariance matrix**, a table showing how features vary together. Its **eigenvectors** give component directions. Its **eigenvalues** tell us the variance along those directions.",
      "**PC1** captures the most variance. **PC2** captures the most remaining variance in a perpendicular direction. The components are **uncorrelated**, meaning they have no linear correlation.",
      "Rank components by eigenvalue. Keep the top **k**, then **project** the data: express each record using these new axes. The **explained variance ratio** tells us each component’s share of total variance."
    ],
    "analogy": "PCA is like choosing a camera angle that shows the most spread in a group, then keeping that view.",
    "example": "For four related test scores, suppose two components explain 73% and 23% of variance. Keeping both preserves 96% using just two new features."
  },
  "fds.u5.polynomial": {
    "summary": "**Polynomial regression** helps us fit a curve when a straight line does not describe the data well. It uses powers of an input, such as x² and x³, as extra inputs to predict an output.",
    "points": [
      "The **degree** is the highest power of x. Degree 2 uses x and x². Degree 3 also includes x³.",
      "The model is **linear in the coefficients**: the numbers multiplying x, x², and other powers are not squared or multiplied together. **Ordinary least squares** finds these numbers by minimizing the sum of squared prediction errors.",
      "Try it when a scatter plot looks curved. Another clue is a pattern in **residuals**, which are actual values minus predicted values.",
      "In Python, **PolynomialFeatures** creates the extra inputs. **LinearRegression** then fits their coefficients. A **pipeline** joins these steps.",
      "A high degree can cause **overfitting**. The curve follows random noise too closely, so it performs well on training data but poorly on new data.",
      "**Extrapolation** means predicting beyond the input range used for training. Polynomial predictions there can be unreliable.",
      "Choose the degree using **validation** data. **RMSE** measures prediction error; lower is better. **R²** measures performance relative to predicting the mean; higher is better. Keep separate test data for the final check."
    ],
    "analogy": "Imagine fitting a flexible ruler along plotted dots. A gentle bend may follow the overall shape; too many bends may chase every tiny irregularity.",
    "example": "Suppose a fitted model is y = 2 + 3x + x². At x = 2, it predicts y = 12. Its **degree** is 2."
  },
  "fds.u5.spectral": {
    "summary": "**Spectral clustering** groups points by how strongly they connect to one another. It can find curved or ring-shaped groups that ordinary **k-means**, which groups points around centres, may miss.",
    "points": [
      "Build an **affinity matrix W**, a table showing how similar each pair of points is. You can use **Gaussian/RBF similarity**, which decreases as distance increases, or **nearest neighbours**, which connects nearby points.",
      "Treat the points as a **graph**: points become nodes, and connections become edges. Stronger connections mean greater similarity.",
      "Create the **degree matrix D**. Each diagonal entry contains the total connection weight for one point. All other entries are zero.",
      "Calculate the **graph Laplacian**, L = D − W. This matrix describes the graph’s connectivity. A **normalised Laplacian** adjusts for differences in node degrees.",
      "Choose the **k eigenvectors** with the smallest **eigenvalues**. These are mathematical patterns in the Laplacian; their eigenvalues indicate how much they vary across connected points. Each point’s entries become its new features.",
      "Run **k-means** on these new features to make k clusters. You must choose **k**, the number of clusters, and the similarity method. The calculation can be expensive for large datasets."
    ],
    "analogy": "Imagine finding friendship groups by following strong friendship links, rather than checking who sits closest to each table’s centre.",
    "example": "For two interleaving moon-shaped groups, nearby connections can follow each moon’s curve. **Spectral clustering** can therefore separate the moons even when ordinary k-means cuts across them."
  }
}
