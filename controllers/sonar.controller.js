const fetchAndLogMetricValues = require("../services/sonar.metrix");

const getMetrics = async (req, res) => {
  try {
    const dynamicUrl = req.query;
    const id = dynamicUrl.id;
    const componentName = id;
    const metricValues = await fetchAndLogMetricValues.sonar(componentName);
    const bugMetricValues = await fetchAndLogMetricValues.sonarBugs(
      componentName
    );
    const codeSmellMetricValues = await fetchAndLogMetricValues.sonarCodeSmells(
      componentName
    );
    const dateMetric = await fetchAndLogMetricValues.sonarScannedDate(
      componentName
    );

    const combinedMetrics = {
      ...metricValues,
      ...bugMetricValues,
      ...codeSmellMetricValues,
      ...dateMetric,
    };

    res.json(combinedMetrics);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getMetrics,
};
