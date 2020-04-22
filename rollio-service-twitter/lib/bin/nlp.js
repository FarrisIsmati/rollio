/* eslint-disable no-console */
// DEPENDENCIES
const axios = require('axios');
const config = require('../../config');
const logger = require('../log/index')('nlp');

module.exports = {
  async parse(text) {
    return axios.post(`${config.NLP_API}/parse-location`, { text })
      .then(res => res.data)
      .catch((err) => {
        logger.error(`NLP API Failure: ${err}`);
        throw err;
      });
  },
};
