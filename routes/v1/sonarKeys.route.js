const express = require('express');

const router = express.Router();

const controller = require('../../controllers/sonarkeys.controller');

router.get('/sonarkeysmetrics', controller.getKeysMetrics);

module.exports = router;
