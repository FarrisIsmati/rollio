//DEPENDENCIES
const knownLocations    = require('../data/knownLocations');
const tweetPhrases           = require('../data/phrases');

const tweetParser = {
  scanAddress: function(payload) {
    let result = {
      match: false,
      rgxMatch: '',
      matchMethod: '',
      tweet: payload.text,
      location: {}
    };
    // if (payload.place) Currently not using this data
    //   let place = payload.place;
    if (payload.geolocation) {
      let geolocation = payload.geolocation;
      result.match = true;
      result.matchMethod = 'Tweet Geolocation';
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

    result = this.phraseMatch(this.knownLocationMatch(result));
    if (result.match) {
      result.location.locationDate = payload.createdAt;
    }
    console.log(result);
    console.log();
  },
  knownLocationMatch: function(result) {
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
            matchMethod: 'Regex known location match',
            location: {
              locationDate: '',
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
    return result;
  },
  phraseMatch: function(result) {
    //Pre/Post Address Phrases
    let rgxMatchPhraseFull = '';
    for (let i = 0; i < tweetPhrases.length; i++) {
      let rgxMatchPhrase = tweetPhrases[i].regex.exec(result.tweet);
      if (rgxMatchPhrase && result.rgxMatch) {
        let rgxPrefixMatch = new RegExp(`((${rgxMatchPhrase[0]}).{0,3}\\s*(${result.rgxMatch}))`, 'i').exec(result.tweet);
        let rgxPostfixMatch = new RegExp(`((${result.rgxMatch}).{0,3}\\s*(${rgxMatchPhrase[0]}))`, 'i').exec(result.tweet);
        //Prefix
        if (tweetPhrases[i].prefix && rgxPrefixMatch) {
          result.rgxMatch = rgxPrefixMatch[0];
          if (tweetPhrases[i].negation) {
            result.match = false;
          }
          return result;
        }
        //Postfix
        if (tweetPhrases[i].postfix && rgxPostfixMatch) {
          result.rgxMatch = rgxPostfixMatch[0];
          if (tweetPhrases[i].negation) {
            result.match = false;
          }
          return result;
        }
      }
    }
    return result;
  }
}

module.exports = tweetParser;
