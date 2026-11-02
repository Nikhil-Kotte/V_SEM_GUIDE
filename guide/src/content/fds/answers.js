// Model answers keyed by PYQ id. Every answer lists its sources.
const U4 = 'FDS Unit-IV slides (Unit-IV-FDS-copy.pptx)'
const U51 = 'FDS Unit-5.1 slides'
const U52 = 'FDS Unit-5.2 slides'
const U53 = 'FDS Unit-5.3 slides'

export default {
  'fds-lin-vs-log': {
    blocks: [
      { table: { head: ['Basis', 'Linear regression', 'Logistic regression'], rows: [
        ['Problem type', 'Regression: predicts a continuous value', 'Classification: predicts a class probability'],
        ['Output', 'Any real number', 'Between 0 and 1 (via sigmoid)'],
        ['Equation', 'y = β₀ + β₁x + …', 'p = 1 / (1 + e^−(β₀ + β₁x + …))'],
        ['Curve', 'Straight line', 'S-shaped curve'],
        ['Fitting', 'Least squares', 'Maximum likelihood'],
        ['Evaluation', 'R², MSE, RMSE, MAE', 'Accuracy, precision, recall, F1, confusion matrix'],
        ['Example', 'Predict marks from study hours', 'Predict pass/fail from study hours'],
      ] } },
    ],
    sources: [`${U51} slides 13–66`],
  },

  'fds-linear-predict': {
    blocks: [
      '**Linear regression** models a continuous target as a straight-line function of inputs: y = β₀ + β₁x₁ + … + βₙxₙ + ε. The coefficients are chosen to minimise the sum of squared errors (least squares); the fitted equation then predicts y for new inputs.',
      { img: 'fds-linreg' },
      { code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

df = pd.DataFrame({"hours": [1, 2, 3, 4, 5, 6, 7, 8],
                   "marks": [35, 42, 50, 55, 63, 70, 74, 85]})
X, y = df[["hours"]], df["marks"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=1)
model = LinearRegression().fit(X_tr, y_tr)
print(model.intercept_, model.coef_)        # marks ≈ 28 + 6.9 × hours
pred = model.predict(X_te)
print(r2_score(y_te, pred), mean_squared_error(y_te, pred) ** 0.5)
print(model.predict([[9]]))                  # predicted marks for 9 hours` },
      'Interpretation: each extra hour of study adds about β₁ marks; R² tells how much of the variation in marks is explained.',
    ],
    sources: [`${U51} slides 13–46`, 'Related course 22ADC09 (asked in R)'],
  },

  'fds-kmeans-sample': {
    blocks: [
      { steps: ['Choose k (elbow/silhouette).', 'Initialise k centroids.', 'Assign each point to the nearest centroid.', 'Recompute each centroid as the mean of its points.', 'Repeat until assignments don\'t change.'] },
      { code: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
df = pd.DataFrame({"marks": [88, 72, 94, 56, 81, 45, 91, 67, 78, 85],
                   "attendance": [95, 82, 98, 68, 91, 60, 96, 76, 88, 92]})
X = StandardScaler().fit_transform(df)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
df["cluster"] = km.labels_
print(df.groupby("cluster").mean())` },
      { h: 'Interpreting the result' },
      'Two groups appear: high marks + high attendance (≈ 85 marks, 93% attendance) and low marks + low attendance (≈ 56 marks, 68%). The cluster means describe each group, the inertia (WCSS) measures compactness, and silhouette ≈ 0.6+ indicates well-separated clusters. Action: target the second cluster for attendance support.',
      { img: 'fds-kmeans' },
    ],
    sources: [`${U53} slides 4–14`, 'Related course 22ADC09 (asked in R)'],
  },

  'fds-missing-methods': {
    blocks: [
      { h: 'Detect' },
      '`df.isnull().sum()` per column; understand why data is missing (MCAR, MAR, MNAR).',
      { table: { head: ['Method', 'Effect on analysis'], rows: [
        ['Listwise deletion (`dropna`)', 'Simple; reduces sample size; biased if data isn\'t missing at random'],
        ['Drop column', 'Removes a whole variable if mostly empty'],
        ['Mean imputation', 'Keeps the mean but lowers variance and weakens correlations'],
        ['Median imputation', 'Robust to outliers; also reduces spread'],
        ['Mode imputation', 'For categories; inflates the most common class'],
        ['Forward/backward fill', 'For time series; assumes continuity'],
        ['Interpolation', 'Smooth estimates for ordered data'],
        ['Model-based (KNN, regression)', 'Preserves relationships best; more effort, risk of overconfidence'],
        ['Missing-indicator column', 'Lets the model learn that missingness itself is informative'],
      ] } },
      { code: `df.dropna(subset=["marks"])
df["age"] = df["age"].fillna(df["age"].median())
df["dept"] = df["dept"].fillna(df["dept"].mode()[0])
from sklearn.impute import KNNImputer
df[num_cols] = KNNImputer(n_neighbors=3).fit_transform(df[num_cols])` },
    ],
    sources: [`${U4} slides 19–23`, 'Unit-3.2-Pandas(FDS).pptx slides 33–37'],
  },

  'fds-p-logistic': {
    blocks: [
      '**Logistic regression** is a supervised **classification** algorithm. It computes a linear score z = β₀ + β₁x₁ + … and passes it through the **sigmoid** to get a probability.',
      { formula: 'p = 1 / (1 + e^(−z)),   log(p / (1 − p)) = z' },
      { img: 'fds-sigmoid' },
      { ul: ['**Characteristics**: output in (0, 1); S-curve; linear in log-odds; fitted by maximum likelihood; threshold (0.5) gives the class.', '**Types**: binary, multinomial (3+ unordered classes), ordinal (ordered classes).', '**Advantages**: simple, fast, interpretable, gives probabilities, works well on linearly separable data.', '**Disadvantages**: assumes linear decision boundary, weak with complex non-linear data, sensitive to outliers and multicollinearity.'] },
      { code: `from sklearn.linear_model import LogisticRegression
clf = LogisticRegression().fit(X_train, y_train)
y_pred = clf.predict(X_test)
from sklearn.metrics import accuracy_score, confusion_matrix
print(accuracy_score(y_test, y_pred), confusion_matrix(y_test, y_pred))` },
    ],
    sources: [`${U51} slides 53–66`],
  },

  'fds-p-hypothesis': {
    blocks: [
      { steps: ['State H₀ (no effect) and H₁ (effect).', 'Choose α (e.g. 0.05).', 'Select a test and compute the test statistic.', 'Compute the p-value.', 'Reject H₀ if p ≤ α; otherwise fail to reject.'] },
      { table: { head: ['', 'H₀ true', 'H₀ false'], rows: [['Reject H₀', 'Type I error (α)', 'Correct (power)'], ['Fail to reject', 'Correct', 'Type II error (β)']] } },
      'Example: a college introduces a new teaching method. H₀: it does not improve exam scores. H₁: it does. If a t-test on the scores gives p = 0.01 < 0.05, reject H₀ and conclude the method helps.',
    ],
    sources: [`${U4} slides 71–89`],
  },

  'fds-p-encoding': {
    blocks: [
      { table: { head: ['dept', 'One-hot → dept_ECE', 'dept_IT', 'Label', ''], rows: [['CSE', '0', '0', '0', ''], ['ECE', '1', '0', '1', ''], ['IT', '0', '1', '2', '']] } },
      { ul: ['**One-hot**: one binary column per category (drop one to avoid the dummy trap). Use for nominal data.', '**Label**: each category gets an integer. Use for target labels or tree models.', '**Ordinal**: integers following a meaningful order (Low < Medium < High).'] },
      { code: `pd.get_dummies(df, columns=["dept"], drop_first=True)
from sklearn.preprocessing import LabelEncoder, OrdinalEncoder
LabelEncoder().fit_transform(df["dept"])
OrdinalEncoder(categories=[["Low", "Medium", "High"]]).fit_transform(df[["level"]])` },
    ],
    sources: [`${U4} slides 37–49`],
  },

  'fds-p-metrics': {
    blocks: [
      { ul: ['**MAE** = (1/n) Σ|y − ŷ| — average absolute error.', '**MSE** = (1/n) Σ(y − ŷ)² — penalises large errors.', '**RMSE** = √MSE — error in y\'s units.', '**R²** = 1 − Σ(y − ŷ)² / Σ(y − ȳ)² — fraction of variance explained.'] },
      'Example: y = [3, 5, 7], ŷ = [2, 5, 9] → MAE 1.0, MSE 1.67, RMSE 1.29, R² 0.375.',
    ],
    sources: [`${U51} slides 43–48`, 'Verified with the metrics calculator'],
  },

  'fds-p-pca': {
    blocks: [
      'Dimensionality reduction keeps the information in many features using fewer new ones, to fight the curse of dimensionality, speed up models and allow visualisation.',
      { steps: ['Standardise the data.', 'Compute the covariance matrix.', 'Compute eigenvalues and eigenvectors.', 'Sort by eigenvalue (variance).', 'Keep the top k components (e.g. 95% explained variance).', 'Project the data onto them.'] },
      { code: `from sklearn.decomposition import PCA
pca = PCA(n_components=0.95).fit(X_scaled)
X_reduced = pca.transform(X_scaled)
pca.explained_variance_ratio_` },
    ],
    sources: [`${U52} slides 5–14`],
  },

  'fds-p-cluster-metrics': {
    blocks: [
      { table: { head: ['Metric', 'Type', 'Formula / idea', 'Best'], rows: [
        ['Davies-Bouldin', 'Internal', '(1/n) Σ max (σᵢ + σⱼ)/d(cᵢ, cⱼ)', 'Lower'],
        ['Silhouette', 'Internal', 'mean (b − a)/max(a, b)', 'Higher (≤ 1)'],
        ['Rand', 'External', '(TP + TN)/total pairs', 'Higher (≤ 1)'],
        ['Jaccard', 'External', 'TP/(TP + FP + FN)', 'Higher'],
        ['F1', 'External', '2PR/(P + R)', 'Higher'],
        ['Fowlkes-Mallows', 'External', 'TP/√((TP + FP)(TP + FN))', 'Higher'],
      ] } },
      'Example: TP 20, FP 5, FN 10, TN 65 → Rand 0.85, Jaccard 0.57, F1 0.727, FMI 0.730.',
    ],
    sources: [`${U53} slides 32–44`],
  },
}
