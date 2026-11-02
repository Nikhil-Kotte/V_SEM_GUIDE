import { Q, Predict } from '../pyq-helpers.js'

// 22CSC59 has no past papers yet. The only overlap is 22ADC09 (Intro to Data Science, Dec 2024),
// an R-based course, so those questions are tagged 'related-course' and rewritten for Python.
// Everything else is a predicted question built from the syllabus — it has no repeat count.
const R = (id, syl, q) => Q(id, syl, q, ['fds-ids-dec24'], { kind: 'related-course', note: 'Asked in 22ADC09 (R). Answer it in Python.' })

export default [
  R('fds-lin-vs-log', 'fds.u5.logistic', 'Differentiate linear regression and logistic regression.'),
  R('fds-linear-predict', 'fds.u5.linear', 'Explain how linear regression is used to predict a continuous outcome. Implement it on a sample dataset.'),
  R('fds-kmeans-sample', 'fds.u5.kmeans', 'Apply k-means clustering to a sample dataset and interpret the results.'),
  R('fds-summary-stats', 'fds.u3.describe', 'Mention the role of summary statistics in data exploration.'),
  R('fds-summary-problems', 'fds.u4.cleaning', 'Describe typical problems revealed by data summaries.'),
  R('fds-missing-methods', 'fds.u4.missing', 'Explain methods for handling missing data and how each affects the analysis.'),

  // Unit III — pandas
  Predict('fds-p-df-create', 'fds.u3.dataframes', 'Explain different ways of creating a pandas DataFrame with examples.'),
  Predict('fds-p-series', 'fds.u3.series', 'What is a pandas Series? How does it differ from a DataFrame and a NumPy array?'),
  Predict('fds-p-quandl', 'fds.u3.quandl', 'How do you read and query data from Quandl into pandas?'),
  Predict('fds-p-describe', 'fds.u3.describe', 'Explain describe(), info(), head() and shape for summarising a DataFrame.'),
  Predict('fds-p-groupby', 'fds.u3.group-join', 'Explain groupby() and the types of joins (merge/concat/join) in pandas with examples.'),
  Predict('fds-p-missing', 'fds.u3.missing-pandas', 'How does pandas represent and detect missing values (isnull, dropna, fillna)?'),
  Predict('fds-p-pivot', 'fds.u3.pivot', 'What is a pivot table? Create one with pandas pivot_table().'),
  Predict('fds-p-dates', 'fds.u3.dates', 'How does pandas handle dates (to_datetime, date_range, resample, dt accessor)?'),

  // Unit IV
  Predict('fds-p-cleaning', 'fds.u4.cleaning', 'What is data cleaning? Explain column-wise and row-wise filtration to remove noise.'),
  Predict('fds-p-outliers', 'fds.u4.outliers', 'How do you detect and handle outliers (box plot, IQR, Z-score)?'),
  Predict('fds-p-encoding', 'fds.u4.encoding', 'Explain one-hot, label and ordinal encoding with examples. When do you use each?'),
  Predict('fds-p-analysis', 'fds.u4.correlation', 'Explain univariate, bivariate and multivariate analysis. What is correlation?'),
  Predict('fds-p-titanic', 'fds.u4.titanic', 'Perform multivariate analysis on the Titanic dataset. What insights do you find?'),
  Predict('fds-p-hypothesis', 'fds.u4.hypothesis', 'Explain the principle of hypothesis testing: null/alternative hypothesis, p-value, Type I and Type II errors.'),
  Predict('fds-p-ttest', 'fds.u4.ttest', 'Explain the t-test and its types. Perform a one-sample t-test with statsmodels/scipy (e.g., average reading time).'),

  // Unit V
  Predict('fds-p-multicollinearity', 'fds.u5.multicollinearity', 'What is multicollinearity? How do you detect it (VIF) and remove it?'),
  Predict('fds-p-dummy', 'fds.u5.dummy', 'What are dummy variables? What is the dummy variable trap?'),
  Predict('fds-p-metrics', 'fds.u5.metrics', 'Explain R², MSE, MAE and RMSE for evaluating a regression model.'),
  Predict('fds-p-polynomial', 'fds.u5.polynomial', 'What is polynomial regression? When is it better than linear regression?'),
  Predict('fds-p-logistic', 'fds.u5.logistic', 'Explain logistic regression: the sigmoid, its types, advantages and disadvantages, and implementation in scikit-learn.'),
  Predict('fds-p-pca', 'fds.u5.pca', 'What is dimensionality reduction? Explain the steps of PCA.'),
  Predict('fds-p-elbow', 'fds.u5.num-clusters', 'How do you choose the number of clusters (elbow method, silhouette method)?'),
  Predict('fds-p-hier', 'fds.u5.hierarchical', 'Explain hierarchical clustering (agglomerative and divisive) and dendrograms.'),
  Predict('fds-p-dbscan', 'fds.u5.dbscan', 'Explain DBSCAN: eps, minPts, core/border/noise points.'),
  Predict('fds-p-spectral', 'fds.u5.spectral', 'Explain spectral clustering.'),
  Predict('fds-p-cluster-metrics', 'fds.u5.cluster-metrics', 'Explain Davies-Bouldin index, silhouette coefficient, Rand score, Jaccard score, F1-score and Fowlkes-Mallows score.'),
  Predict('fds-p-model-dev', 'fds.u5.model-dev', 'Explain the steps of developing a regression model in Python.'),
]
