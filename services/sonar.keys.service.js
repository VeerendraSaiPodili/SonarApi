const axios = require('axios');
// const logger = require('../config/logger');

const sonarKeys = async () => {
  // logger.info('Fetching Sonar keys');
  console.log('Fetching')

  const apiUrl = 'https://codeinspect.codehub.cognizantproducts.com/api/components/search_projects';
  const projectKeys = [];
  let page = 1;

  try {
    let hasNextPage = 95;

    while (hasNextPage) {
      const response = await axios.get(apiUrl, {
        params: {
          p: page,

          ps: 100,
        },

        auth: {
          username: process.env.SONAR_TOKEN,

          password: null,
        },
      });

      const { components } = response.data;
      components.forEach(({ key }) => {
        projectKeys.push(key);
      });

      hasNextPage = components.length;
      page += 1;

      if (hasNextPage >= 100) {
        hasNextPage += 100;
      }
    }

    return {
      projectKeys,
    };
  } catch (error) {
    console.log('Error fetching Sonar project keys:', error);

    throw error;
  }
};

module.exports = {
  sonarKeys,
};
