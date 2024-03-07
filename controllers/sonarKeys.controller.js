const fetchAndLogMetricValues = require('../services/sonar.keys.service');

const getKeysMetrics = async (_req, res) => {
  try {
    const keysMetricValues = await fetchAndLogMetricValues.sonarKeys();
    res.json(keysMetricValues);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getKeysMetrics,
};
