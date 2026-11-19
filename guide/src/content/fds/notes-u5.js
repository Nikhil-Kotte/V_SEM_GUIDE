// Fundamentals of Data Science, Unit V: regression, dimensionality reduction and clustering.
// Follows the FDS unit slides and notes.
export default {
  'fds.u5.linear': {
    oneLine: 'Regression predicts a continuous number; linear regression fits a straight line y = β₀ + β₁x, and multiple linear regression uses several inputs y = β₀ + β₁x₁ + … + βₙxₙ.',
    blocks: [
      { def: "Linear regression", text: "A supervised learning method that models the **linear relationship between a dependent variable y and one (simple) or more (multiple) independent variables x** by fitting the line (or hyperplane) that minimises the sum of squared residuals (least squares): y = β₀ + β₁x (+ β₂x₂ + …) + ε." },
      { img: 'fds-linreg' },
      { ul: ['**Simple linear regression**: one input (e.g. study hours → marks).', '**Multiple linear regression**: many inputs (hours, attendance, past GPA → marks).', 'Coefficients are chosen by **least squares**: minimise Σ(yᵢ − ŷᵢ)².', 'β₁ = how much y changes when x increases by 1 (others fixed).'] },
      { h: 'Assumptions' },
      'Linear relationship, independent errors, constant error variance (homoscedasticity), normally distributed errors, and no strong multicollinearity.',
      { code: `from sklearn.linear_model import LinearRegression
X = df[["hours", "attendance"]]; y = df["marks"]
model = LinearRegression().fit(X, y)
model.intercept_, model.coef_
model.predict([[6, 90]])` },
      { formula: 'β₁ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²        β₀ = ȳ − β₁ x̄' },
    ],
    terms: [['Least squares', 'Fit that minimises the sum of squared errors.'], ['Coefficient', 'Effect of one input on the output.']],
    exam: 'Define regression, write both equations, explain least squares and assumptions, sklearn code.',
    revise: ['y = β₀ + β₁x (+ …)', 'Least squares minimises Σ(y − ŷ)²'],
  },
  'fds.u5.multicollinearity': {
    oneLine: 'Multicollinearity is when input variables are strongly correlated with each other, which makes regression coefficients unstable and hard to interpret.',
    blocks: [
      { def: "Multicollinearity", text: "A situation in multiple regression where **two or more independent variables are highly correlated** with each other, making coefficient estimates unstable and hard to interpret. Detected with a correlation matrix or the **variance inflation factor (VIF > 5–10)**; removed by dropping or combining variables, PCA or regularisation." },
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
      { def: "Dummy variable", text: "A **binary (0/1) variable created to represent a category** of a categorical feature in regression. A feature with k categories needs **k − 1 dummies** (one reference category dropped) to avoid the **dummy-variable trap** (perfect multicollinearity)." },
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
      { def: "Developing a regression model", text: "The end-to-end process of **preparing data, splitting it into training and test sets, fitting the model, predicting and evaluating** it, and iterating (feature engineering, checking assumptions) until performance is acceptable." },
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
      { h: 'Worked example (Class Test II, question 7a): study hours vs marks' },
      { table: { head: ['Student', 'Hours x', 'Marks y', 'x − x̄', 'y − ȳ', '(x − x̄)(y − ȳ)', '(x − x̄)²'], rows: [['S1', '1', '35', '−2', '−14', '28', '4'], ['S2', '2', '40', '−1', '−9', '9', '1'], ['S3', '3', '50', '0', '1', '0', '0'], ['S4', '4', '55', '1', '6', '6', '1'], ['S5', '5', '65', '2', '16', '32', '4'], ['', 'x̄ = 3', 'ȳ = 49', '', '', '**75**', '**10**']] } },
      { formula: 'β₁ = 75 / 10 = 7.5      β₀ = 49 − 7.5 × 3 = 26.5      ŷ = 26.5 + 7.5x' },
      { table: { head: ['x', 'y', 'ŷ', 'Error y − ŷ', '|e|', 'e²'], rows: [['1', '35', '34.0', '1.0', '1.0', '1.00'], ['2', '40', '41.5', '−1.5', '1.5', '2.25'], ['3', '50', '49.0', '1.0', '1.0', '1.00'], ['4', '55', '56.5', '−1.5', '1.5', '2.25'], ['5', '65', '64.0', '1.0', '1.0', '1.00'], ['', '', '', 'Σ', '**6.0**', '**7.50**']] } },
      { ul: ['**MAE** = 6.0 / 5 = **1.2** marks', '**MSE** = 7.5 / 5 = **1.5**', '**RMSE** = √1.5 ≈ **1.22** marks', 'R² = 1 − 7.5 / 570 ≈ **0.987**: the model explains about 98.7% of the variation in marks; predictions are off by about 1.2 marks on average.'] },
      { img: 'fds-regression-ct' },
      { code: 'from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error\nimport numpy as np\nX = np.array([[1], [2], [3], [4], [5]]); y = np.array([35, 40, 50, 55, 65])\nmodel = LinearRegression().fit(X, y)       # intercept 26.5, slope 7.5\npred = model.predict(X)\nmae = mean_absolute_error(y, pred)          # 1.2\nmse = mean_squared_error(y, pred)           # 1.5\nrmse = np.sqrt(mse)                         # 1.22' },
    ],
    terms: [['Train/test split', 'Fit on one part of the data, evaluate on unseen data.']],
    exam: 'Write the numbered pipeline with code for each step.',
    revise: ['Load → clean → encode → X/y → split → fit → predict → evaluate'],
  },
  'fds.u5.metrics': {
    oneLine: 'Regression models are judged by how close predictions are to real values: MAE, MSE and RMSE measure the average error, R² measures how much of the variation the model explains.',
    blocks: [
      { def: "Regression evaluation metrics", text: "Measures of how well predictions ŷ match actual values y: **MAE** = mean |y − ŷ| (average error), **MSE** = mean (y − ŷ)² (penalises large errors), **RMSE** = √MSE (in the units of y), and **R²** = 1 − SS_res / SS_tot (proportion of variance explained)." },
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
      { def: "Polynomial regression", text: "A form of regression that models a **non-linear relationship by adding powers of the predictor** (x², x³, …) as features: y = β₀ + β₁x + β₂x² + … + βₙxⁿ; it is still linear in the coefficients and is fitted by least squares." },
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
      { def: "Logistic regression", text: "A **supervised classification algorithm** that predicts the **probability** that an observation belongs to a class by passing a linear combination of the features through the **sigmoid (logistic) function** σ(z) = 1 / (1 + e⁻ᶻ), and assigning the class by a threshold (e.g. 0.5)." },
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
      { h: 'Choosing the type of logistic regression (Class Test II, question 6b)' },
      { table: { head: ['Scenario', 'Type', 'Justification'], rows: [['(i) Email: Spam or Not Spam', '**Binary (binomial) logistic regression**', 'The target has exactly **two** classes; the sigmoid gives P(spam); if ≥ 0.5 → Spam'], ['(ii) News article: Sports, Politics or Entertainment', '**Multinomial logistic regression**', '**Three or more unordered** classes; softmax gives a probability for each category; the highest wins'], ['(iii) Customer satisfaction: Low, Medium or High', '**Ordinal logistic regression**', 'Three classes with a **natural order** (Low < Medium < High); the model uses the ordering (cumulative probabilities)']] } },
      { code: 'from sklearn.linear_model import LogisticRegression\nLogisticRegression()                                   # binary\nLogisticRegression(multi_class="multinomial")          # multinomial (softmax)\n# ordinal: mord.LogisticAT() or statsmodels OrderedModel' },
    ],
    terms: [['Sigmoid', 'σ(z) = 1/(1 + e^(−z)), maps to (0, 1).'], ['Log-odds', 'log(p/(1 − p)), the logit.'], ['Confusion matrix', 'Table of TP, FP, FN, TN.']],
    exam: 'Define, sigmoid formula and graph, log-odds, types, pros/cons, linear vs logistic table and sklearn code.',
    revise: ['p = 1/(1 + e^−z); logit = log(p/(1−p)) is linear', 'Binary, multinomial, ordinal', 'Classification, not continuous prediction'],
  },
  'fds.u5.pca': {
    oneLine: 'PCA reduces many correlated features to a few new uncorrelated ones (principal components) that keep as much of the data\'s variation as possible.',
    blocks: [
      { def: "Principal component analysis (PCA)", text: "An unsupervised **dimensionality-reduction technique that transforms correlated features into a smaller set of uncorrelated variables called principal components**, ordered so that the first few retain most of the variance in the data." },
      { img: 'fds-pca' },
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
      { h: 'How PCA reduces dimensionality (Class Test II, question 3)' },
      'PCA standardises the data, computes the covariance matrix and its **eigenvectors (directions) and eigenvalues (variance along them)**, sorts the components by variance, **keeps only the top k components** that explain most of the variance (e.g. 95%), and **projects the data onto them**. So n correlated features become k < n uncorrelated components with little information loss, which reduces noise, storage and computation and removes multicollinearity.',
    ],
    terms: [['Principal component', 'New axis = linear combination of original features.'], ['Explained variance ratio', 'Share of total variance captured by a component.']],
    exam: 'Why dimensionality reduction, the 6 PCA steps, formula and sklearn code with explained variance.',
    revise: ['Standardise → covariance → eigen → sort → choose k → project', 'Components are uncorrelated'],
  },
  'fds.u5.num-clusters': {
    oneLine: 'Two common ways to choose k for clustering: the elbow method (where adding clusters stops reducing WCSS much) and the silhouette method (k with the highest average silhouette score).',
    blocks: [
      { def: "Finding the number of clusters", text: "Choosing the value of k for clustering: the **elbow method** (plot within-cluster sum of squares WCSS against k and pick the \"elbow\" where adding clusters stops helping much) and the **silhouette method** (pick the k with the highest average silhouette score)." },
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
      { def: "K-means clustering", text: "A **partitioning (centroid-based) clustering algorithm** that divides n points into **k clusters**, each point belonging to the cluster with the **nearest mean (centroid)**, by iteratively assigning points to the nearest centroid and recomputing centroids until they stop changing; it minimises the within-cluster sum of squares." },
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
      { h: 'Worked example (Class Test II, question 7b): K = 3' },
      'Points P1(2,3), P2(3,3), P3(3,4), P4(8,7), P5(9,8), P6(8,9). Choose initial centroids **C1 = P1 (2,3), C2 = P4 (8,7), C3 = P5 (9,8)**.',
      { table: { head: ['Point', 'd to C1 (2,3)', 'd to C2 (8,7)', 'd to C3 (9,8)', 'Cluster'], rows: [['P1 (2,3)', '0', '7.21', '8.60', 'C1'], ['P2 (3,3)', '1.00', '6.40', '7.81', 'C1'], ['P3 (3,4)', '1.41', '5.83', '7.21', 'C1'], ['P4 (8,7)', '7.21', '0', '1.41', 'C2'], ['P5 (9,8)', '8.60', '1.41', '0', 'C3'], ['P6 (8,9)', '8.49', '2.00', '1.41', 'C3']] } },
      { ul: ['New centroids: C1 = mean(P1, P2, P3) = **(2.67, 3.33)**; C2 = P4 = **(8, 7)**; C3 = mean(P5, P6) = **(8.5, 8.5)**.', 'Iteration 2: recompute distances with the new centroids; every point keeps its cluster (e.g. P5: 1.41 to C2 vs 0.71 to C3; P6: 2.00 vs 0.71), so the centroids do not change: **converged**.', 'Final clusters: **C1 = {P1, P2, P3}, C2 = {P4}, C3 = {P5, P6}**.'] },
      { img: 'fds-kmeans-ct' },
      { note: 'k-means results depend on the initial centroids; with different starting points, P4 might join P5 or P6. Always state the initial centroids you chose.' },
    ],
    terms: [['Centroid', 'Mean point of a cluster.'], ['k-means++', 'Smarter initialisation that spreads out the first centres.']],
    exam: 'Algorithm steps, a small numeric example, strengths and weaknesses, and sklearn code `KMeans(n_clusters=k).fit(X)`.',
    revise: ['Assign to nearest centroid → recompute means → repeat', 'Need k; sensitive to init/outliers'],
  },
  'fds.u5.hierarchical': {
    oneLine: 'Hierarchical clustering builds a tree of clusters (a dendrogram): agglomerative merges the closest clusters bottom-up, divisive splits top-down.',
    blocks: [
      { def: "Hierarchical clustering", text: "A clustering method that **builds a hierarchy (tree) of clusters**, shown as a **dendrogram**: **agglomerative** (bottom-up: start with each point as a cluster and repeatedly merge the closest pair, using single, complete, average or Ward linkage) or **divisive** (top-down splitting)." },
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
      { def: "DBSCAN", text: "**Density-Based Spatial Clustering of Applications with Noise**: groups points that are **closely packed** (at least MinPts neighbours within radius ε) into clusters, marks points in low-density regions as **noise (outliers)**, finds arbitrarily shaped clusters and does not need k in advance." },
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
      { def: "Spectral clustering", text: "A clustering technique that builds a **similarity graph** of the data, computes the **eigenvectors of its graph Laplacian** to embed the points in a low-dimensional space, and then clusters them (usually with k-means); it finds non-convex clusters that k-means misses." },
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
      { def: "Clustering evaluation metrics", text: "Measures of clustering quality: **internal** (no labels: silhouette coefficient, Davies–Bouldin index, Calinski–Harabasz) and **external** (compare with true labels: Rand index, adjusted Rand, Jaccard, F1/purity, Fowlkes–Mallows, mutual information)." },
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
