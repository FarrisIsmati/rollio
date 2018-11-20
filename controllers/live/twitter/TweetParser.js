//DEPENDENCIES
const knownLocations    = require('../data/knownLocations');
const tweetPhrases           = require('../data/phrases');

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
        let rgx = curNbhd.regex;
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
    //console.log(result);

    //step 2. Pre/Post Address Identifier Phrases

    for (let i = 0; i < tweetPhrases.length; i++) {
      let rgx = tweetPhrases[i].regex;
      //Prefix
      if (tweetPhrases[i].prefix) {
        if (rgx && rgx.exec(payload.text) !== null) {
          console.log(result.tweet);
          console.log(rgx.exec(payload.text));
          console.log(rgx.lastIndex);
        }
      }
    }
    console.log();
  },
}

module.exports = tweetParser;
