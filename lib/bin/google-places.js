/* eslint-disable no-console */
// ENV
require('dotenv').config();

// DEPENDENCIES
const axios = require('axios');

module.exports = {
  async search(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_PLACES_API_KEY}&input=${address}&inputtype=textquery&fields=formatted_address,geometry/location`)
      .then(res => res.data.candidates)
      .catch((err) => {
        console.error(`Google Places API Failure: ${err}`);
        return err;
      });
  },
  async neighborhoodFromCoords(lat, lng) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=neighborhood&key=${process.env.GOOGLE_PLACES_API_KEY}`)
      .then(res => {
        return res.data.results[0].address_components[0].long_name
      })
      .catch((err) => {
        console.error(`Google Places API Failure: ${err}`);
        return err;
      });
  },
};
