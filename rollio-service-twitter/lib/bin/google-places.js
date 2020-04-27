/* eslint-disable no-console */
// DEPENDENCIES
const axios = require('axios');
const config = require('../../config');
const logger = require('../log/index')('google-places');

module.exports = {
  async search(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${config.GOOGLE_PLACES_API_KEY}&input=${address}&inputtype=textquery&fields=formatted_address,geometry/location`)
      .then((res) => {
        if (res.data.error_message) {
          throw res.data.error_message;
        }
        return res.data.candidates;
      })
      .catch((err) => {
        logger.error(`Google Places API Failure: ${err}`);
        return err;
      });
  },
  async neighborhoodCityStateFromCoords(lat, lng) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=neighborhood&key=${config.GOOGLE_PLACES_API_KEY}`)
      .then((res) => {
        const lowerCaseLongName = addressComponent => (addressComponent ? addressComponent.long_name.toLowerCase() : '');
        const addressComponents = res.data.results[0].address_components;
        const neighborhood = addressComponents.find(component => component.types.includes('neighborhood'));
        const city = addressComponents.find(component => component.types.includes('locality'));
        const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
        return {
          neighborhood: lowerCaseLongName(neighborhood),
          city: lowerCaseLongName(city),
          state: lowerCaseLongName(state),
        };
      })
      .catch((err) => {
        logger.error(`Google Places API Failure: ${err}`);
        return err;
      });
  },
};
