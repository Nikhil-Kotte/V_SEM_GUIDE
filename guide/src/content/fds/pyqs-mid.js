import { Q } from '../pyq-helpers.js'

// Questions from the two FDS class tests (mid-terms) of this semester, PYQs/FDS MIDS.pdf:
// Class Test I (3 Sep 2026) and Class Test II (6 Nov 2026), in their original wording.
// FDS (22CSC59) has no past university papers of its own, so these are the only questions actually set
// for this course.
export default [
  // ---- Class Test I ----
  Q('fds-mid-city-data', 'fds.u1.data-types', 'A city collects traffic-sensor data, social-media posts and hospital records. Classify these data as structured or unstructured and justify your classification.', ['fds-ct1:2']),
  Q('fds-mid-analytics-types', 'fds.u2.analysis-analytics', 'A retail manager wants to know what happened to sales, why sales changed, and what may happen next month. Identify the appropriate types of analytics.', ['fds-ct1:2']),
  Q('fds-mid-numpy-add', 'fds.u3.broadcasting', 'For A = np.array([10, 20, 30]) and B = np.array([1, 2, 3]), determine the output of A + B and state the NumPy concept involved.', ['fds-ct1:2']),
  Q('fds-mid-smart-city', 'fds.u1.related-fields', 'A smart-city authority plans to integrate traffic, public transport, healthcare and social-media data. Analyse how Data Science, Statistics, Computer Science and Engineering contribute to such a system.', ['fds-ct1:4']),
  Q('fds-mid-ethics', 'fds.u1.ethics', 'The collected data may contain personal information and biased observations. Explain the ethical issues related to privacy, bias and responsible use of data.', ['fds-ct1:3']),
  Q('fds-mid-edu-data', 'fds.u1.data-types', 'An educational institution collects examination marks, attendance, student feedback, handwritten answer-script images and social-media comments. Classify the data and analyse the challenges in handling the unstructured data.', ['fds-ct1:4']),
  Q('fds-mid-preprocess', 'fds.u1.cleaning', 'Propose a suitable preprocessing sequence using data cleaning, integration, transformation, reduction and discretization for preparing the collected data for analysis.', ['fds-ct1:3']),
  Q('fds-num-complaints', 'fds.u2.central-tendency', 'A company records the daily number of customer complaints as 12, 15, 18, 15, 20, 25 and 15. Calculate the mean, median, mode and range, and comment on the distribution.', ['fds-ct1:4'], { numerical: true }),
  Q('fds-mid-sd', 'fds.u2.dispersion', 'A company wants to compare the number of customer complaints received during two different months. Explain how standard deviation can be used to measure the variability of complaint data. What does a higher standard deviation indicate about the data?', ['fds-ct1:3']),
  Q('fds-mid-pearson', 'fds.u2.covariance-correlation', "A university studies whether online-learning time is related to examination marks. Explain how Pearson's correlation coefficient can be used to analyse the relationship and interpret a strong positive correlation.", ['fds-ct1:4']),
  Q('fds-num-numpy-index', 'fds.u3.slicing-indexing', 'Given A = np.array([[10,20,30],[40,50,60],[70,80,90]]), write NumPy statements to obtain the second row, the third column, the sub-array [[50,60],[80,90]], and all elements greater than 50.', ['fds-ct1:3'], { numerical: true }),
  // ---- Class Test II ----
  Q('fds-mid-series-df', 'fds.u3.dataframes', 'Write Python code to create a pandas Series object and a DataFrame.', ['fds-ct2:2']),
  Q('fds-mid-null-alt', 'fds.u4.hypothesis', 'Differentiate between the null hypothesis and the alternative hypothesis.', ['fds-ct2:2']),
  Q('fds-mid-pca', 'fds.u5.pca', 'How does PCA help in reducing the dimensionality of a dataset?', ['fds-ct2:2']),
  Q('fds-num-pandas-ct2', 'fds.u3.group-join', 'DataFrame A (Dept, Emp id, Salary): Accounts 1 30000, Sales 2 40000, Accounts 3 35000, Sales 4 45000, HR 5 46000. DataFrame B (Emp id, Name, Experience): 1 Surya 2, 2 Arha 3, 3 Syam NaN, 4 Radha 3, 5 John 4. Write pandas code (i) to group the data by Department and calculate the average salary, (ii) to join the two DataFrames on the common column Emp id, (iii) to identify the missing values and replace them with the mean of the same column.', ['fds-ct2:3'], { numerical: true }),
  Q('fds-num-pivot-ct2', 'fds.u3.pivot', 'Write pandas code to create a pivot table that displays the average salary of employees in each department (use DataFrame A above).', ['fds-ct2:4'], { numerical: true }),
  Q('fds-mid-encoding', 'fds.u4.encoding', 'Explain the following feature encoding techniques with examples: (i) one-hot encoding, (ii) label encoding, (iii) ordinal encoder.', ['fds-ct2:3']),
  Q('fds-mid-uni-bi-multi', 'fds.u4.correlation', 'Compare and contrast univariate analysis, bivariate analysis and multivariate analysis.', ['fds-ct2:4']),
  Q('fds-mid-ttest', 'fds.u4.ttest', 'Explain the different types of t-tests and discuss any four assumptions that must be satisfied before applying a t-test.', ['fds-ct2:3']),
  Q('fds-mid-logistic-types', 'fds.u5.logistic', 'Select the appropriate type of logistic regression for the following classification scenarios and justify your selection with suitable examples: (i) predicting whether an email is Spam or Not Spam, (ii) classifying a news article into Sports, Politics or Entertainment, (iii) predicting customer satisfaction as Low, Medium or High.', ['fds-ct2:4']),
  Q('fds-num-linreg-ct2', 'fds.u5.model-dev', 'Develop a linear regression model and evaluate its performance with the metrics MAE, MSE and RMSE for the data: study hours 1, 2, 3, 4, 5 and marks 35, 40, 50, 55, 65 (students S1–S5).', ['fds-ct2:3'], { numerical: true }),
  Q('fds-num-kmeans-ct2', 'fds.u5.kmeans', 'Implement partitioning of the data using k-means clustering with K = 3: P1(2,3), P2(3,3), P3(3,4), P4(8,7), P5(9,8), P6(8,9).', ['fds-ct2:4'], { numerical: true }),
]
