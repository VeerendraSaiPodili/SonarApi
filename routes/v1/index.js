const express = require("express");

const SonarRoute = require("./sonar.route");
const SonarKeyRoute = require("./sonarKeys.route");
const router = express.Router();
router.use("/sonarreport", SonarRoute);
router.use("/sonarkeys", SonarKeyRoute);

module.exports = router;
