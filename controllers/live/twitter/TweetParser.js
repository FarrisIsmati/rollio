//DEPENDENCIES
const knownLocations = require('../data/knownLocations');

class TweetParser {
  scanAddress(payload) {
    let result = {
      match: false,
      method: '',
      location: {}
    };
    let place = null;
    let geolocation = null;

    if (payload.place)
      place = payload.place;
    if (payload.geolocation) {
      geolocation = payload.geolocation;
      result.match = true;
      result.method = 'Tweet Geolocation';
      result.location = {
        locationDate: payload.createdAt,
        accuracy: 0,
        address: payload.geolocation.address,
        city: payload.geolocation.city, //confirm this matches up with city/neighborhood checker
        neighborhood: payload.geolocation.neighborhood, //confirm this matches up with city/neighborhood checker
        coordinates: payload.geolocation.coordinates
      }
      return result;
    }

  }

  getKnownLocations(input) {

  }
}

module.exports = TweetParser;
