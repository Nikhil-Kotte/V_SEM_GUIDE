// FDS Unit V (regression, classification, PCA, clustering) model answers. Keyed by PYQ id.
const U51 = 'FDS Unit-5.1 slides (regression)'
const U52 = 'FDS Unit-5.2 slides (dimensionality reduction)'
const U53 = 'FDS Unit-5.3 slides (clustering)'
const REL = 'Related course 22ADC09 (asked in R)'

export default {
  // ---------------- Regression ----------------
  'fds-lin-vs-log': {
    blocks: [
      { table: { head: ['Basis', 'Linear regression', 'Logistic regression'], rows: [
        ['Problem type', '**Regression**: predicts a continuous value', '**Classification**: predicts the probability of a class'],
        ['Output', 'Any real number (−∞ to +∞)', 'Between 0 and 1 (via the sigmoid), then a class by threshold'],
        ['Equation', 'y = β₀ + β₁x₁ + … + βₙxₙ', 'p = 1 / (1 + e^−(β₀ + β₁x₁ + …)); log(p/(1−p)) is linear'],
        ['Curve', 'Straight line / plane', 'S-shaped (sigmoid) curve'],
        ['Fitting', 'Ordinary least squares (minimise squared error)', 'Maximum likelihood (minimise log-loss)'],
        ['Target variable', 'Continuous (marks, price)', 'Categorical (yes/no, pass/fail)'],
        ['Assumptions', 'Linear relation, normal homoscedastic residuals', 'Linear relation with the log-odds; no normality needed'],
        ['Evaluation', 'R², MSE, RMSE, MAE', 'Accuracy, precision, recall, F1, confusion matrix, ROC-AUC'],
        ['Example', 'Predict marks from study hours', 'Predict pass/fail from study hours'],
      ] } },
      { img: 'fds-linreg' },
      { img: 'fds-sigmoid' },
    ],
    sources: [`${U51} slides 13–66`, REL],
  },

  'fds-linear-predict': {
    blocks: [
      '**Linear regression** models a **continuous** target y as a linear function of one or more inputs:',
      { formula: 'y = β₀ + β₁x₁ + β₂x₂ + … + βₙxₙ + ε' },
      'β₀ is the intercept, βᵢ are the slopes (how much y changes when xᵢ rises by 1), ε is the error. The coefficients are chosen by **ordinary least squares**: minimise Σ(y − ŷ)². For one feature: β₁ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)², β₀ = ȳ − β₁x̄. The fitted equation then predicts y for new x.',
      { img: 'fds-linreg' },
      { h: 'Implementation on a sample dataset' },
      { code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

df = pd.DataFrame({"hours": [1, 2, 3, 4, 5, 6, 7, 8],
                   "marks": [35, 42, 50, 55, 63, 70, 74, 85]})
X, y = df[["hours"]], df["marks"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=1)

model = LinearRegression().fit(X_tr, y_tr)
print(model.intercept_, model.coef_)        # about 28 and 6.9
pred = model.predict(X_te)
print(r2_score(y_te, pred), mean_squared_error(y_te, pred) ** 0.5)
print(model.predict(pd.DataFrame({"hours": [9]})))   # predicted marks for 9 hours` },
      { h: 'Interpretation' },
      { ul: ['**Slope ≈ 6.9**: each extra hour of study adds about 7 marks.', '**Intercept ≈ 28**: expected marks with zero hours (baseline).', '**R²** close to 1: hours explain most of the variation in marks.', '**RMSE**: typical prediction error in marks.', 'Check residual plots for linearity and constant variance.'] },
      'With several features (hours, attendance, previous CGPA) it becomes **multiple linear regression**, used the same way.',
    ],
    sources: [`${U51} slides 13–46`, REL],
  },

  'fds-p-multicollinearity': {
    blocks: [
      '**Multicollinearity** occurs when two or more **independent variables in a regression model are highly correlated** with each other, so one can be predicted from the others (e.g. height in cm and height in inches; total marks and percentage).',
      { h: 'Why it is a problem' },
      { ul: ['Coefficients become **unstable**: small data changes flip their size or sign.', '**Standard errors inflate**, so significant variables look insignificant.', 'Individual coefficients **cannot be interpreted** ("effect of x₁ holding x₂ fixed" is meaningless).', 'Overall predictions may still be fine, but the model is hard to trust and explain.'] },
      { h: 'Detection' },
      { ul: ['**Correlation matrix / heatmap**: |r| > 0.8 between predictors.', '**Variance Inflation Factor (VIF)**: VIFᵢ = 1 / (1 − Rᵢ²), where Rᵢ² is from regressing xᵢ on the other predictors. VIF = 1 none; > 5 moderate; **> 10 serious**.', 'Large changes in coefficients when a variable is added or removed.'] },
      { code: `from statsmodels.stats.outliers_influence import variance_inflation_factor
import statsmodels.api as sm
X = sm.add_constant(df[["hours", "attendance", "prev_cgpa", "internal"]])
vif = pd.DataFrame({"feature": X.columns,
                    "VIF": [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]})
print(vif)` },
      { h: 'Removing it' },
      { ol: ['**Drop** one of the highly correlated variables (the one with the highest VIF), then recompute VIF.', '**Combine** them into one feature (average, ratio, total).', 'Use **PCA** to replace correlated variables with uncorrelated components.', 'Use **regularisation** (Ridge regression) which shrinks correlated coefficients.', 'Collect more data; centre variables (for polynomial/interaction terms).', 'Avoid the **dummy variable trap** (drop one dummy).'] },
    ],
    sources: [`${U51} slides 25–34`],
  },

  'fds-p-dummy': {
    blocks: [
      'Regression needs numeric inputs. A **dummy variable** is a **0/1 variable created for each category** of a categorical feature, indicating whether the observation belongs to that category.',
      { table: { head: ['dept', 'dept_ECE', 'dept_IT'], rows: [['CSE', '0', '0'], ['ECE', '1', '0'], ['IT', '0', '1']] } },
      'For a variable with k categories, we create **k − 1 dummies**; the omitted category (CSE) becomes the **reference (baseline)**. The coefficient of dept_ECE then means "difference in the target for ECE compared with CSE".',
      { code: `df = pd.get_dummies(df, columns=["dept"], drop_first=True, dtype=int)
# model: salary = b0 + b1*cgpa + b2*dept_ECE + b3*dept_IT` },
      { h: 'Dummy variable trap' },
      'If we create **all k dummies** and keep the intercept, the dummies always add up to 1 (dept_CSE + dept_ECE + dept_IT = 1 = the intercept column). This is **perfect multicollinearity**: the coefficients cannot be uniquely estimated (the matrix XᵀX is singular).',
      '**Avoid it** by dropping one dummy (`drop_first=True`) or removing the intercept.',
    ],
    sources: [`${U51} slides 35–40`],
  },

  'fds-p-model-dev': {
    blocks: [
      { h: 'Steps to develop a regression model in Python' },
      { steps: [
        '**Define the problem**: target (e.g. house price) and candidate features.',
        '**Load and explore** the data: head(), info(), describe(), plots, correlation heatmap.',
        '**Clean**: handle missing values, outliers, duplicates; fix types.',
        '**Encode categorical variables**: dummy variables (drop_first=True).',
        '**Select features**: remove irrelevant ones; check **multicollinearity** with VIF.',
        '**Split** into training and test sets (e.g. 80/20).',
        '**Scale** features if needed (StandardScaler), fitting on the training set only.',
        '**Train** the model (LinearRegression / statsmodels OLS).',
        '**Interpret** coefficients, p-values, R² (statsmodels summary).',
        '**Evaluate** on the test set: R², MSE, RMSE, MAE; check residual plots.',
        '**Improve**: add polynomial terms, remove weak features, try regularisation.',
        '**Predict** new data / deploy.',
      ] },
      { code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

df = pd.read_csv("housing.csv").dropna()
df = pd.get_dummies(df, columns=["location"], drop_first=True, dtype=int)
X = df.drop(columns="price"); y = df["price"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression().fit(X_tr, y_tr)
pred = model.predict(X_te)
print("R2  :", r2_score(y_te, pred))
print("RMSE:", mean_squared_error(y_te, pred) ** 0.5)
print("MAE :", mean_absolute_error(y_te, pred))
print(dict(zip(X.columns, model.coef_.round(2))))

import statsmodels.api as sm                      # detailed statistics
print(sm.OLS(y_tr, sm.add_constant(X_tr)).fit().summary())` },
    ],
    sources: [`${U51} slides 40–48`],
  },

  'fds-p-metrics': {
    blocks: [
      'With actual values yᵢ, predictions ŷᵢ and n observations:',
      { table: { head: ['Metric', 'Formula', 'Meaning', 'Best'], rows: [
        ['**MAE** (mean absolute error)', '(1/n) Σ|yᵢ − ŷᵢ|', 'Average size of errors, in y\'s units; robust to outliers', '0'],
        ['**MSE** (mean squared error)', '(1/n) Σ(yᵢ − ŷᵢ)²', 'Penalises large errors heavily; units squared', '0'],
        ['**RMSE** (root MSE)', '√MSE', 'Typical error in y\'s units; sensitive to large errors', '0'],
        ['**R²** (coefficient of determination)', '1 − SS_res/SS_tot = 1 − Σ(y − ŷ)² / Σ(y − ȳ)²', 'Fraction of the variance in y explained by the model', '1'],
      ] } },
      'Adjusted R² = 1 − (1 − R²)(n − 1)/(n − p − 1) penalises adding useless features. R² can be negative if the model is worse than predicting the mean; it is undefined if y is constant.',
      { h: 'Worked example' },
      'y = [3, 5, 7], ŷ = [2, 5, 9] → errors 1, 0, −2.',
      { ul: ['MAE = (1 + 0 + 2)/3 = **1.0**', 'MSE = (1 + 0 + 4)/3 = **1.67**', 'RMSE = √1.67 = **1.29**', 'ȳ = 5, SS_tot = 4 + 0 + 4 = 8, SS_res = 5 → R² = 1 − 5/8 = **0.375**'] },
      { code: `from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
mae = mean_absolute_error(y, y_hat); mse = mean_squared_error(y, y_hat)
rmse = mse ** 0.5; r2 = r2_score(y, y_hat)` },
      { tip: 'Check your own numbers with the metrics calculator on the Numericals tab.' },
    ],
    sources: [`${U51} slides 43–48`, 'Verified with the metrics calculator'],
  },

  'fds-p-polynomial': {
    blocks: [
      '**Polynomial regression** models a **non-linear (curved)** relationship by adding powers of the input as extra features, while the model stays **linear in its coefficients** (so least squares still works):',
      { formula: 'y = β₀ + β₁x + β₂x² + … + βₙxⁿ + ε' },
      { h: 'When it is better than linear regression' },
      { ul: ['When the scatter plot or residual plot shows a **curve** (residuals form a U shape under linear regression).', 'Examples: growth curves, speed vs fuel consumption, salary vs experience level, temperature effects.', 'It gives a higher R² / lower RMSE on test data than a straight line.'] },
      { h: 'Cautions' },
      { ul: ['**Overfitting** with high degrees: the curve wiggles through training points and predicts badly; choose the degree with a validation set or cross-validation.', 'Poor **extrapolation** outside the data range.', 'Features x, x², x³ are correlated: scale or centre them.'] },
      { code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
import numpy as np
X = np.array([1, 2, 3, 4, 5, 6, 7]).reshape(-1, 1)
y = np.array([2.1, 3.9, 9.2, 15.8, 25.1, 36.3, 48.9])     # roughly x²
lin  = LinearRegression().fit(X, y)
poly = make_pipeline(PolynomialFeatures(degree=2), LinearRegression()).fit(X, y)
print(lin.score(X, y), poly.score(X, y))                # R²: ~0.95 vs ~0.999` },
    ],
    sources: [`${U51} slides 49–52`],
  },

  'fds-p-logistic': {
    blocks: [
      '**Logistic regression** is a supervised **classification** algorithm (despite its name). It computes a linear score z = β₀ + β₁x₁ + … + βₙxₙ and passes it through the **sigmoid** function to get the probability of the positive class.',
      { formula: 'p = σ(z) = 1 / (1 + e^(−z)),   log(p / (1 − p)) = z  (log-odds / logit)' },
      { img: 'fds-logcurve' },
      { img: 'fds-sigmoid' },
      'If p ≥ 0.5 (threshold) predict class 1, else class 0. Coefficients are estimated by **maximum likelihood** (minimising log-loss).',
      { note: 'Your slides call this "linear regression" in places and call the log "the odds"; the standard statement is that logistic regression is linear in the **log-odds**, and p/(1 − p) itself is the odds.' },
      { h: 'Regression models for classification' },
      'A linear regression line can output values below 0 or above 1 and is distorted by outliers, so it is a poor classifier; the sigmoid squeezes outputs into (0, 1), making them valid probabilities.',
      { h: 'Characteristics' },
      { ul: ['Output in (0, 1): a probability.', 'S-shaped curve; decision boundary is linear in the features.', 'Linear in the log-odds; each coefficient changes the log-odds (e^β is the odds ratio).', 'No normality assumption; needs independent observations and little multicollinearity.'] },
      { h: 'Types' },
      { ul: ['**Binary**: two classes (spam / not spam, pass / fail).', '**Multinomial**: three or more unordered classes (dept: CSE / ECE / IT), using softmax.', '**Ordinal**: three or more ordered classes (rating low / medium / high).'] },
      { compare: [
        { title: 'Advantages', items: ['Simple, fast, easy to implement', 'Interpretable coefficients (odds ratios)', 'Outputs probabilities', 'Works well when classes are linearly separable', 'Less prone to overfitting with regularisation'] },
        { title: 'Disadvantages', items: ['Assumes a linear decision boundary', 'Weak on complex, non-linear relationships', 'Sensitive to outliers and multicollinearity', 'Needs fairly large samples', 'Can be affected by class imbalance'] },
      ] },
      { h: 'Implementation in scikit-learn' },
      { code: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

X = df[["hours", "attendance"]]; y = df["passed"]          # 1 = pass, 0 = fail
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression().fit(X_tr, y_tr)
y_pred = clf.predict(X_te)
print(clf.predict_proba(X_te)[:5])                         # probabilities
print(accuracy_score(y_te, y_pred))
print(confusion_matrix(y_te, y_pred))
print(classification_report(y_te, y_pred))` },
    ],
    sources: [`${U51} slides 53–66`],
  },

  // ---------------- PCA ----------------
  'fds-p-pca': {
    blocks: [
      '**Dimensionality reduction** reduces the number of input features while keeping most of the useful information. It is needed because of the **curse of dimensionality**: with many features, data becomes sparse, models overfit, training is slow, and data cannot be visualised. Two approaches: **feature selection** (keep a subset of original features) and **feature extraction** (create new, fewer features, e.g. **PCA**, LDA).',
      { h: 'Principal Component Analysis (PCA)' },
      'PCA finds new axes, the **principal components**, which are uncorrelated linear combinations of the original features, ordered by how much **variance** they capture. Keeping the first few components keeps most of the information.',
      { h: 'Steps' },
      { steps: ['**Standardise** the data (mean 0, variance 1) so all features are on the same scale.', 'Compute the **covariance matrix** of the features.', 'Compute its **eigenvalues and eigenvectors** (eigenvectors = directions of the components, eigenvalues = variance along them).', '**Sort** eigenvectors by eigenvalue, largest first.', '**Choose k** components: e.g. those explaining 95% of total variance (scree plot / cumulative explained variance).', 'Form the projection matrix W from the top k eigenvectors and **transform** the data: Z = X·W.'] },
      { code: `from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
X_scaled = StandardScaler().fit_transform(X)
pca = PCA(n_components=0.95)            # keep 95% of the variance
X_reduced = pca.fit_transform(X_scaled)
print(pca.n_components_, pca.explained_variance_ratio_.round(3))
# e.g. 30 features -> 8 components` },
      { h: 'Advantages and limitations' },
      'Removes multicollinearity, speeds up models, reduces noise, enables 2-D/3-D plots. But components are hard to interpret, it captures only linear structure, and it is sensitive to scaling and outliers.',
    ],
    sources: [`${U52} slides 1–14`],
  },

  // ---------------- Clustering ----------------
  'fds-kmeans-sample': {
    blocks: [
      '**K-means** partitions n points into **k clusters** so that each point belongs to the cluster with the nearest centroid, minimising the within-cluster sum of squares (WCSS / inertia).',
      { img: 'fds-kmeans' },
      { steps: ['Choose k (elbow / silhouette method).', 'Initialise k centroids (k-means++ chooses spread-out starting points).', 'Assign each point to the nearest centroid (Euclidean distance).', 'Recompute each centroid as the mean of its points.', 'Repeat until assignments stop changing (or max iterations).'] },
      { code: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

df = pd.DataFrame({"marks": [88, 72, 94, 56, 81, 45, 91, 67, 78, 85],
                   "attendance": [95, 82, 98, 68, 91, 60, 96, 76, 88, 92]})
X = StandardScaler().fit_transform(df)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
df["cluster"] = km.labels_
print(df.groupby("cluster").mean())
print("inertia:", km.inertia_, "silhouette:", silhouette_score(X, km.labels_))` },
      { h: 'Interpreting the results' },
      'Two groups appear: **high marks + high attendance** (≈ 84 marks, 92% attendance) and **low marks + low attendance** (≈ 56 marks, 68%). The cluster means describe each group; the **inertia** measures how compact the clusters are; a **silhouette** of about 0.60 here indicates well-separated clusters. Action: target the second cluster for attendance and academic support.',
      { tip: 'Run k-means step by step on the Numericals tab.' },
    ],
    sources: [`${U53} slides 4–14`, REL],
  },

  'fds-p-elbow': {
    blocks: [
      'K-means and similar algorithms need the number of clusters **k** in advance. Two common methods to choose it:',
      { h: '1. Elbow method' },
      { steps: ['Run k-means for k = 1, 2, …, 10.', 'Record the **WCSS** (within-cluster sum of squares, `inertia_`) for each k: WCSS = Σ over clusters Σ ‖x − cᵢ‖².', 'Plot WCSS against k.', 'WCSS always decreases as k increases; choose the k at the **"elbow"**, where the decrease sharply slows: adding more clusters stops giving much improvement.'] },
      { img: 'elbow' },
      { h: '2. Silhouette method' },
      'For each point i: **a(i)** = average distance to the other points in its own cluster (cohesion); **b(i)** = average distance to points in the nearest other cluster (separation).',
      { formula: 's(i) = (b(i) − a(i)) / max(a(i), b(i)),   −1 ≤ s ≤ 1' },
      { img: 'fds-silhouette' },
      { ul: ['s ≈ 1: well clustered; s ≈ 0: on the boundary; s < 0: probably in the wrong cluster.', 'Compute the **average silhouette** for k = 2, 3, …; choose the k with the **highest** average.'] },
      { code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
wcss, sil = [], []
for k in range(2, 11):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    wcss.append(km.inertia_)
    sil.append(silhouette_score(X, km.labels_))
import matplotlib.pyplot as plt
plt.plot(range(2, 11), wcss, "o-"); plt.xlabel("k"); plt.ylabel("WCSS")
best_k = range(2, 11)[sil.index(max(sil))]` },
      'The elbow can be ambiguous; the silhouette gives a number to compare. Domain knowledge also matters.',
    ],
    sources: [`${U53} slides 15–22`],
  },

  'fds-p-hier': {
    blocks: [
      '**Hierarchical clustering** builds a **hierarchy (tree) of clusters** instead of a single partition. It does not need k in advance; the tree is cut at the desired level.',
      { img: 'fds-agglo' },
      { h: 'Two types' },
      { compare: [
        { title: 'Agglomerative (bottom-up)', items: ['Start with each point as its own cluster', 'Repeatedly **merge the two closest clusters**', 'Stop when one cluster remains', 'Most common'] },
        { title: 'Divisive (top-down)', items: ['Start with all points in one cluster', 'Repeatedly **split** a cluster into two', 'Stop when each point is alone', 'Computationally heavier'] },
      ] },
      { h: 'Agglomerative algorithm' },
      { steps: ['Compute the distance matrix between all points.', 'Treat each point as a cluster.', 'Merge the two closest clusters.', 'Update the distances between the new cluster and the others using a **linkage** criterion.', 'Repeat until one cluster remains; record merges in a dendrogram.'] },
      { h: 'Linkage criteria' },
      { ul: ['**Single**: distance between the closest pair of points (can form long chains).', '**Complete**: farthest pair (compact clusters).', '**Average**: average of all pairwise distances.', '**Ward**: merge that least increases total within-cluster variance (default in scikit-learn).'] },
      { h: 'Dendrogram' },
      'A tree diagram showing the order and distance at which clusters merge: leaves are points, the height of each join is the merge distance. **Cutting** the dendrogram with a horizontal line gives clusters; cut where the vertical gap is largest.',
      { code: `from scipy.cluster.hierarchy import linkage, dendrogram, fcluster
from sklearn.cluster import AgglomerativeClustering
Z = linkage(X, method="ward")
dendrogram(Z)                               # plot
labels = fcluster(Z, t=3, criterion="maxclust")
labels2 = AgglomerativeClustering(n_clusters=3, linkage="ward").fit_predict(X)` },
      'Pros: no k needed, dendrogram is informative, any shape with suitable linkage. Cons: O(n²) memory/time, merges cannot be undone, sensitive to noise.',
    ],
    sources: [`${U53} slides 23–28`],
  },

  'fds-p-dbscan': {
    blocks: [
      '**DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) groups points that are **closely packed** and marks points in low-density regions as **noise**. It finds clusters of **arbitrary shape** and does not need k.',
      { h: 'Parameters' },
      { ul: ['**eps (ε)**: radius of the neighbourhood around a point.', '**minPts** (min_samples): minimum number of points (including itself) within eps for a point to be a core point.'] },
      { h: 'Types of points' },
      { ul: ['**Core point**: has at least minPts points within eps.', '**Border point**: has fewer than minPts neighbours but lies within eps of a core point.', '**Noise (outlier)**: neither core nor border.'] },
      { h: 'Algorithm' },
      { steps: ['Pick an unvisited point and find its eps-neighbourhood.', 'If it is a core point, start a new cluster and add all density-reachable points (neighbours of core points, recursively).', 'If not, mark it as noise for now (it may later become a border point).', 'Repeat until all points are visited.'] },
      { code: `from sklearn.cluster import DBSCAN
db = DBSCAN(eps=0.5, min_samples=5).fit(X_scaled)
labels = db.labels_            # -1 = noise
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)` },
      { compare: [
        { title: 'Advantages', items: ['No need to specify k', 'Finds arbitrarily shaped clusters (rings, moons)', 'Robust to outliers: labels them as noise'] },
        { title: 'Disadvantages', items: ['Sensitive to eps and minPts (use a k-distance plot)', 'Struggles with clusters of very different densities', 'Distance becomes less meaningful in high dimensions'] },
      ] },
    ],
    sources: [`${U53} slides 29–31`],
  },

  'fds-p-spectral': {
    blocks: [
      '**Spectral clustering** treats clustering as a **graph-partitioning** problem. It uses the **eigenvectors (spectrum) of a similarity graph\'s Laplacian** to embed the data in a few dimensions where clusters become easy to separate, then applies k-means there. It works well for **non-convex** clusters (concentric circles, moons) where k-means fails.',
      { img: 'fds-spectral' },
      { h: 'Steps' },
      { steps: ['Build a **similarity matrix** W: wᵢⱼ = exp(−‖xᵢ − xⱼ‖² / 2σ²) (RBF), or a k-nearest-neighbour graph.', 'Compute the **degree matrix** D (dᵢᵢ = Σⱼ wᵢⱼ) and the **graph Laplacian** L = D − W (or a normalised version).', 'Compute the **first k eigenvectors** of L (smallest eigenvalues).', 'Stack them as columns to form a new n × k feature matrix; normalise rows.', 'Run **k-means** on these rows; assign each original point the cluster of its row.'] },
      { code: `from sklearn.cluster import SpectralClustering
from sklearn.datasets import make_moons
X, _ = make_moons(n_samples=300, noise=0.05, random_state=0)
sc = SpectralClustering(n_clusters=2, affinity="nearest_neighbors", random_state=0)
labels = sc.fit_predict(X)        # separates the two moons correctly; k-means would not` },
      { compare: [
        { title: 'Advantages', items: ['Handles complex, non-convex shapes', 'Only needs a similarity measure', 'Strong theoretical basis (graph cuts)'] },
        { title: 'Disadvantages', items: ['Expensive for large n (eigen-decomposition of an n × n matrix)', 'Needs k and a similarity parameter (σ or neighbours)', 'Sensitive to the graph construction'] },
      ] },
    ],
    sources: [`${U53} slides 32–34`],
  },

  'fds-p-cluster-metrics': {
    blocks: [
      'Clustering metrics are **internal** (use only the data and labels found) or **external** (compare with true labels).',
      { h: 'Internal metrics' },
      { ul: ['**Silhouette coefficient**: mean of s(i) = (b − a)/max(a, b); range −1 to 1; **higher is better**.', '**Davies-Bouldin index**: average, over clusters, of the worst ratio (σᵢ + σⱼ)/d(cᵢ, cⱼ), i.e. within-cluster scatter vs distance between centroids; **lower is better** (0 is ideal).'] },
      { formula: 'DB = (1/k) Σᵢ maxⱼ≠ᵢ (σᵢ + σⱼ) / d(cᵢ, cⱼ)' },
      { h: 'External metrics (pair counting)' },
      'Consider every pair of points: **TP** = same cluster and same true class; **FP** = same cluster, different class; **FN** = different cluster, same class; **TN** = different cluster, different class.',
      { table: { head: ['Metric', 'Formula', 'Best'], rows: [
        ['**Rand score**', '(TP + TN) / (TP + FP + FN + TN)', '1 (adjusted Rand corrects for chance)'],
        ['**Jaccard score**', 'TP / (TP + FP + FN)', '1'],
        ['**F1-score**', '2PR / (P + R), with P = TP/(TP + FP), R = TP/(TP + FN)', '1'],
        ['**Fowlkes-Mallows score**', 'TP / √((TP + FP)(TP + FN)) = √(P·R)', '1'],
      ] } },
      { h: 'Worked example' },
      'TP = 20, FP = 5, FN = 10, TN = 65 (100 pairs):',
      { ul: ['Rand = (20 + 65)/100 = **0.85**', 'Jaccard = 20/35 = **0.571**', 'P = 20/25 = 0.8, R = 20/30 = 0.667 → F1 = **0.727**', 'FMI = 20/√(25 × 30) = **0.730**'] },
      { code: `from sklearn.metrics import (silhouette_score, davies_bouldin_score,
    rand_score, adjusted_rand_score, fowlkes_mallows_score)
silhouette_score(X, labels); davies_bouldin_score(X, labels)
rand_score(y_true, labels); fowlkes_mallows_score(y_true, labels)` },
    ],
    sources: [`${U53} slides 35–44`],
  },
}
