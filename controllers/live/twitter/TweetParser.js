//DEPENDENCIES
const knownLocations = require('../data/knownLocations');

const tweetParser = {
  scanAddress: payload => {
    let result = {
      match: false,
      method: '',
      tweet: payload.text,
      location: {}
    };
    let place = null;
    let geolocation = null;
    let tweet = payload.text;

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

    //step 1. Cross Reference known locations
    for (let key in knownLocations) {
      if (result.match)
        break;
      let city = knownLocations[key];
      for (let i = 0; i < city.length; i++) {
        let curNbhd = city[i];
        let rgx = city[i].regex;
        if (rgx && rgx.exec(tweet) !== null) {
          result = {
            ...result,
            match: true,
            method: 'Regex known location match',
            location: {
              locationDate: payload.createdAt,
              accuracy: 0,
              address: curNbhd.location.address,
              city: key,
              neighborhood: curNbhd.neighborhood,
              coordinates: curNbhd.location.coordinates
            }
          }
          break;
        }
      }
    }

    console.log(result);
    //step 2. Pre/Post Address Identifier Phrases
    console.log();
  },

  getKnownLocations: input => {

  }
}

module.exports = tweetParser;
