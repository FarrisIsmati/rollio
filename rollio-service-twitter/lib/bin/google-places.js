/* eslint-disable no-console */
// DEPENDENCIES
const axios = require('axios');
const config = require('../../config');
const logger = require('../log/index');

module.exports = {
  async search(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${config.GOOGLE_PLACES_API_KEY}&input=${address}&inputtype=textquery&fields=formatted_address,geometry/location`)
      .then(res => res.data.candidates)
      .catch((err) => {
        logger.error(`Google Places API Failure: ${err}`);
        return err;
      });
  },
  async neighborhoodFromCoords(lat, lng) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=neighborhood&key=${config.GOOGLE_PLACES_API_KEY}`)
      .then(res => res.data.results[0].address_components[0].long_name.toLowerCase())
      .catch((err) => {
        logger.error(`Google Places API Failure: ${err}`);
        return err;
      });
  },
};
