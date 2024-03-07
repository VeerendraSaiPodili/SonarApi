const axios = require("axios");
// const logger = require('../config/logger');

// https://codeinspect.codehub.cognizantproducts.com/project/issues?resolved=false&severities=CRITICAL,BLOCKER&types=BUG&id=IPR001161_Flowsource

const sonar = async (componentName) => {
  console.log("Fetching sonar Summary");

  const apiUrl = `https://${process.env.SONAR_ORGANIZATION_URL}/api/measures/component?component=${componentName}&metricKeys=bugs%2Ccomment_lines_density%2Ccoverage%2Cduplicated_lines_density%2Cncloc%2Creliability_rating%2Csqale_rating%2Cncloc_language_distribution%2Calert_status`;

  const authHeader = {
    username: `${process.env.SONAR_TOKEN}`,
    password: null,
  };

  let lines;
  let duplication;
  let comments;
  let coverage;
  let reliability;
  let maintainability;
  let bugs;
  let language;
  let qualityGateStatus;

  try {
    const response = await axios.get(apiUrl, { auth: authHeader });
    if (response.status === 200) {
      const data = response.data.component;
      const { measures } = data;
      measures.forEach((measure) => {
        const metricName = measure.metric;
        const metricValue = measure.value;
        if (metricName === "ncloc") {
          lines = metricValue;
        } else if (metricName === "duplicated_lines_density") {
          duplication = metricValue;
        } else if (metricName === "bugs") {
          bugs = metricValue;
        } else if (metricName === "comment_lines_density") {
          comments = metricValue;
        } else if (metricName === "coverage") {
          coverage = metricValue;
        } else if (metricName === "ncloc_language_distribution") {
          language = metricValue;
        } else if (metricName === "alert_status") {
          if (metricValue === "OK") {
            qualityGateStatus = "Passed";
          } else if (metricValue === "ERROR") {
            qualityGateStatus = "Failed";
          }
        } else if (metricName === "reliability_rating") {
          if (metricValue === "1.0") {
            reliability = "A";
          } else if (metricValue === "2.0") {
            reliability = "B";
          } else if (metricValue === "3.0") {
            reliability = "C";
          } else if (metricValue === "4.0") {
            reliability = "D";
          } else if (metricValue === "5.0") {
            reliability = "E";
          }
        } else if (metricName === "sqale_rating") {
          if (metricValue === "1.0") {
            maintainability = "A";
          } else if (metricValue === "2.0") {
            maintainability = "B";
          } else if (metricValue === "3.0") {
            maintainability = "C";
          } else if (metricValue === "4.0") {
            maintainability = "D";
          } else if (metricValue === "5.0") {
            maintainability = "E";
          }
        }
      });
    }
  } catch (error) {
    connsole.log("Error:", error);
  }
  return {
    componentName,
    lines,
    duplication,
    comments,
    coverage,
    reliability,
    maintainability,
    bugs,
    language,
    qualityGateStatus,
  };
};

const sonarBugs = async (componentName) => {
  console.log("Fetching sonarBugs Summary");
  const apiUrl = `https://${process.env.SONAR_ORGANIZATION_URL}/api/issues/search?componentKeys=${componentName}&s=FILE_LINE&resolved=false&types=BUG&ps=100&facets=severities`;
  const authHeader = {
    username: `${process.env.SONAR_TOKEN}`,
    password: null,
  };
  let minor;
  let major;
  let critical;
  let blocker;
  let info;
  try {
    const response = await axios.get(apiUrl, { auth: authHeader });
    if (response.status === 200) {
      const { data } = response;
      const { facets } = data;
      facets.forEach((facet) => {
        if (facet.property === "severities") {
          facet.values.forEach((value) => {
            if (value.val === "MAJOR") {
              major = value.count;
            } else if (value.val === "MINOR") {
              minor = value.count;
            } else if (value.val === "BLOCKER") {
              blocker = value.count;
            } else if (value.val === "CRITICAL") {
              critical = value.count;
            } else if (value.val === "INFO") {
              info = value.count;
            }
          });
        }
      });

      // console.log(
      //   "MAJOR, MINOR, BLOCKER,CRITICAL, INFO",
      //   major,
      //   minor,
      //   blocker,
      //   critical,
      //   info
      // );
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  return {
    major,
    minor,
    blocker,
    critical,
    info,
  };
};

const sonarCodeSmells = async (componentName) => {
  console.log("Fetching sonar code smells Summary");
  const apiUrl = `https://${process.env.SONAR_ORGANIZATION_URL}/api/issues/search?componentKeys=${componentName}&s=FILE_LINE&resolved=false&types=CODE_SMELL&ps=100&facets=severities`;
  const authHeader = {
    username: `${process.env.SONAR_TOKEN}`,
    password: null,
  };
  let totalCountCodeSmell;
  try {
    const response = await axios.get(apiUrl, { auth: authHeader });
    if (response.status === 200) {
      const { data } = response;
      totalCountCodeSmell = data.total;
      // console.log("Total codesmells", totalCountCodeSmell);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  return {
    totalCountCodeSmell,
  };
};

const sonarScannedDate = async (componentName) => {
  console.log("Fetching sonar scanned date");
  const apiUrl = `https://${process.env.SONAR_ORGANIZATION_URL}/api/components/show?component=${componentName}`;
  const authHeader = {
    username: `${process.env.SONAR_TOKEN}`,
    password: null,
  };
  let date;

  try {
    const response = await axios.get(apiUrl, { auth: authHeader });
    if (response.status === 200) {
      const { data } = response;
      const { component } = data;
      date = component.analysisDate;
      // console.log("Sonar Scanned Date", date);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  return { date };
};

module.exports = {
  sonar,
  sonarBugs,
  sonarCodeSmells,
  sonarScannedDate,
};
