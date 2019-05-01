/* eslint-disable no-console */
// ENV
require('dotenv').config();

// DEPENDENCIES
const axios = require('axios');

module.exports = {
  search: async address => axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_PLACES_API_KEY}&input=${address}&inputtype=textquery&fields=formatted_address`)
    .then(res => res.data.candidates)
    .catch((err) => {
      console.error(`Google Places API Failure: ${err}`);
      return err;
    }),
};
