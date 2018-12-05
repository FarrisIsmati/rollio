const tweetParser = {
  scanAddress: function(payload) {
    let result = {
      tweetID: payload.tweetID,
      twitterID: payload.twitterID,
      date: payload.createdAt,
      match: false,
      certainty: 'none',
      rgxMatch: '',
      tweet: payload.text,
      location: {}
    };
    // if (payload.place) Currently not using this data
    //   let place = payload.place;
    if (payload.geolocation) {
      let geolocation = payload.geolocation;
      result.match = true;
      result.certainty = 'certain';
      result.location = {
        locationDate: payload.createdAt,
        accuracy: 0,
        address: payload.geolocation.address,
        city: payload.geolocation.city, //confirm this matches up with city/neighborhood checker
        neighborhood: payload.geolocation.neighborhood, //confirm this matches up with city/neighborhood checker
        coordinates: payload.geolocation.coordinates,
        matchMethod: 'Tweet Geolocation'
      }
      return result;
    }
    //match a known location, then match a phrase with that known location
    result = this.matchPhrase(this.matchKnownLocation(Object.assign({}, result)));
    if (result.match) {
      result.location.locationDate = payload.createdAt;
    }
    // console.log(result);
    // console.log();
    return result;
  },
  matchKnownLocation: function(result) {
    const knownLocations = require('../data/knownLocations');
    //Match known locations
    for (let key in knownLocations) {
      if (result.match)
        break;
      let city = knownLocations[key];
      for (let i = 0; i < city.length; i++) {
        let curNbhd = city[i];
        let rgxMatchNbhd = curNbhd.regex.exec(result.tweet);
        if (rgxMatchNbhd !== null) {
          result = {
            ...result,
            match: true,
            rgxMatch: rgxMatchNbhd[0],
            certainty: 'partial',
            location: {
              locationDate: result.date,
              accuracy: 0,
              address: curNbhd.location.address,
              city: key,
              neighborhood: curNbhd.neighborhood,
              coordinates: curNbhd.location.coordinates,
              matchMethod: 'Tweet regex match'
            }
          }
          break;
        }
      }
    }
    return result;
  },
  matchPhrase: function(result) { //Think through this logic and break it out
    const tweetPhrases = require('../data/phrases');
    //Pre/Post Address Phrases
    let rgxMatchPhraseFull = '';
    for (let i = 0; i < tweetPhrases.length; i++) {
      let rgxMatchPhrase = tweetPhrases[i].regex.exec(result.tweet);
      //If matched a phrase & known location
      if (rgxMatchPhrase && result.rgxMatch) {
        let rgxPrefixMatch = new RegExp(`((${rgxMatchPhrase[0]}).{0,3}\\s*(${result.rgxMatch}))`, 'i').exec(result.tweet);
        let rgxPostfixMatch = new RegExp(`((${result.rgxMatch}).{0,3}\\s*(${rgxMatchPhrase[0]}))`, 'i').exec(result.tweet);
        if (tweetPhrases[i].prefix && rgxPrefixMatch) {
          result.rgxMatch = rgxPrefixMatch[0];
        } else if (tweetPhrases[i].postfix && rgxPostfixMatch) {
          result.rgxMatch = rgxPostfixMatch[0];
        }
        if ((rgxPrefixMatch || rgxPostfixMatch) && tweetPhrases[i].negation) {
          result.match = false;
          result.certainty = 'certain';
          result.location = {};
        }
        break;
      }
    }
    return result;
  }
}

module.exports = tweetParser;
