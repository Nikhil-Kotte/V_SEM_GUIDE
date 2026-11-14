import { Q, Predict } from '../pyq-helpers.js'

// Units I, II and the NumPy half of Unit III. 22CSC59 has no past papers, so these are the 22ADC09
// (Intro to Data Science, Dec 2024) questions that fall in these units, plus predicted questions
// built from the syllabus. Predicted questions have no repeat count.
const R = (id, syl, q) => Q(id, syl, q, ['fds-ids-dec24'], { kind: 'related-course', note: 'Asked in 22ADC09 (R). Answer it in Python.' })

export default [
  R('fds-lifecycle', 'fds.u1.what', 'Explain the life cycle of a data science project with a neat sketch.'),
  R('fds-roles', 'fds.u1.skills-tools', 'Discuss the key roles and responsibilities in a data science project.'),
  R('fds-normalise-impact', 'fds.u1.transformation', 'How do normalisation and rescaling affect the modelling process in data science?'),
  R('fds-sample-column', 'fds.u2.sampling-tests', 'Explain the process of creating a sample group column in a dataset for random sampling.'),

  // ---------------- Unit I: predicted ----------------
  Predict('fds-p-what-ds', 'fds.u1.what', 'What is data science? How does it combine statistics, computer science and domain knowledge?'),
  Predict('fds-p-where-ds', 'fds.u1.where', 'Where do we see data science? Explain its use in finance, healthcare, public policy and education with examples.'),
  Predict('fds-p-related', 'fds.u1.related-fields', 'How does data science relate to statistics, computer science, engineering and business analytics?'),
  Predict('fds-p-info-science', 'fds.u1.info-science', 'Explain the relationship between data science and information science. What is the difference between data and information?'),
  Predict('fds-p-comp-thinking', 'fds.u1.computational-thinking', 'What is computational thinking? Explain its components with an example.'),
  Predict('fds-p-skills', 'fds.u1.skills-tools', 'What skills does a data scientist need? List the common tools used in data science.'),
  Predict('fds-p-ethics', 'fds.u1.ethics', 'Discuss the issues of ethics, bias and privacy in data science.'),
  Predict('fds-p-data-types', 'fds.u1.data-types', 'Differentiate structured, semi-structured and unstructured data. What are the challenges with unstructured data?'),
  Predict('fds-p-collections', 'fds.u1.collections', 'Explain open data, social media data and multimodal data. How is data stored and presented?'),
  Predict('fds-p-preprocessing', 'fds.u1.cleaning', 'What is data pre-processing? Explain data cleaning, integration, transformation, reduction and discretisation.'),
  Predict('fds-p-integration', 'fds.u1.integration', 'What are the issues in data integration? How are they resolved?'),
  Predict('fds-p-minmax-z', 'fds.u1.transformation', 'Explain min-max normalisation and z-score normalisation with a numerical example.'),
  Predict('fds-p-reduction', 'fds.u1.reduction', 'Explain data reduction strategies: dimensionality reduction, numerosity reduction and compression.'),
  Predict('fds-p-discretize', 'fds.u1.discretization', 'What is discretisation? Compare equal-width and equal-frequency binning with an example.'),

  // ---------------- Unit II: predicted ----------------
  Predict('fds-p-analytics-types', 'fds.u2.analysis-analytics', 'Differentiate data analysis and data analytics. Explain descriptive, diagnostic, predictive and prescriptive analytics.'),
  Predict('fds-p-freq-dist', 'fds.u2.descriptive', 'Explain descriptive analysis: types of variables and frequency distributions with an example.'),
  Predict('fds-p-diagnostic', 'fds.u2.diagnostic', 'What is diagnostic analytics? Explain the role of correlation. Why is correlation not causation?'),
  Predict('fds-p-pred-presc', 'fds.u2.predictive-prescriptive', 'Compare predictive and prescriptive analytics with examples.'),
  Predict('fds-p-eda-regression', 'fds.u2.exploratory-mechanistic', 'Explain exploratory analysis and mechanistic analysis. Fit a simple linear regression line to given data.'),
  Predict('fds-p-attributes', 'fds.u2.attributes', 'Explain the types of attributes (nominal, binary, ordinal, interval, ratio) and discrete vs continuous attributes.'),
  Predict('fds-p-central', 'fds.u2.central-tendency', 'Find the mean, median and mode of the given data. When is the median preferred over the mean?'),
  Predict('fds-p-dispersion', 'fds.u2.dispersion', 'Compute the range, variance, standard deviation and IQR of the given data. Explain the box plot.'),
  Predict('fds-p-skew', 'fds.u2.skew-kurtosis', 'Explain skewness and kurtosis with diagrams.'),
  Predict('fds-p-pearson-spearman', 'fds.u2.covariance-correlation', "Explain covariance, Pearson's correlation coefficient and Spearman's rank correlation with numerical examples."),
  Predict('fds-p-sampling', 'fds.u2.sampling-tests', 'Explain sampling methods and parametric tests with their assumptions.'),
  Predict('fds-p-distributions', 'fds.u2.distributions', 'Explain the uniform, normal, exponential and binomial distributions with examples.'),
  Predict('fds-p-cdf', 'fds.u2.cdf', 'What is a cumulative distribution function? Explain descriptive statistics.'),

  // ---------------- Unit III (NumPy): predicted ----------------
  Predict('fds-p-ndarray', 'fds.u3.numpy-arrays', 'What is a NumPy array? How is it different from a Python list? Explain the NumPy numerical data types.'),
  Predict('fds-p-reshape', 'fds.u3.shapes', 'Explain how to manipulate array shapes in NumPy (reshape, ravel, flatten, transpose).'),
  Predict('fds-p-stack', 'fds.u3.stacking-splitting', 'Explain stacking and splitting of NumPy arrays with examples.'),
  Predict('fds-p-view-copy', 'fds.u3.dtype-views', 'How do you change the data type of a NumPy array? Explain views and copies with an example.'),
  Predict('fds-p-indexing', 'fds.u3.slicing-indexing', 'Explain slicing, boolean indexing and fancy indexing in NumPy with examples.'),
  Predict('fds-p-broadcast', 'fds.u3.broadcasting', 'What is broadcasting in NumPy? State its rules with examples.'),
]
