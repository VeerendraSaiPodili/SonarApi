const express = require('express');

const router = express.Router();

const controller = require('../../controllers/sonar.controller');

router.get('/sonarmetrics', controller.getMetrics);

module.exports = router;
