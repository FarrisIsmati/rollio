const tweetParser = {
  scanAddress(payload) {
    let result = {
      tweetID: payload.tweetID,
      twitterID: payload.twitterID,
      date: payload.createdAt,
      match: false,
      certainty: 'none',
      rgxMatch: '',
      tweet: payload.text,
      location: {},
    };
    if (payload.geolocation) {
      const { geolocation } = payload;
      result.match = true;
      result.certainty = 'certain';
      result.location = {
        locationDate: payload.createdAt,
        accuracy: 0,
        address: geolocation.address,
        // confirm this matches up with city/neighborhood checker
        city: geolocation.city,
        // confirm this matches up with city/neighborhood checker
        neighborhood: geolocation.neighborhood,
        coordinates: geolocation.coordinates,
        matchMethod: 'Tweet Geolocation',
      };
      return result;
    }
    // match a known location, then match a phrase with that known location
    result = this.matchPhrase(this.matchKnownLocation(Object.assign({}, result)));
    if (result.match) {
      result.location.locationDate = payload.createdAt;
    }
    return result;
  },
  matchKnownLocation(payload) {
    // eslint-disable-next-line global-require
    const knownLocations = require('../data/tweet-data-known-locations');
    // Match known locations
    const cities = Object.keys(knownLocations);
    let matchedPayload;

    for (let i = 0; i < cities.length; i += 1) {
      const city = cities[i];
      const neighboorhoods = Object.keys(knownLocations[city]);

      for (let x = 0; x < neighboorhoods.length; x += 1) {
        const nbhd = neighboorhoods[x];
        const curNbhd = knownLocations[city][nbhd];
        const rgxMatchNbhd = curNbhd.regex.exec(payload.tweet);
        if (rgxMatchNbhd !== null) {
          matchedPayload = {
            ...payload,
            match: true,
            rgxMatch: rgxMatchNbhd[0],
            certainty: 'partial',
            location: {
              locationDate: payload.date,
              accuracy: 0,
              address: curNbhd.location.address,
              city,
              neighborhood: curNbhd.neighborhood,
              coordinates: curNbhd.location.coordinates,
              matchMethod: 'Tweet regex match',
            },
          };
          break;
        }
      }
    }
    return matchedPayload !== undefined ? matchedPayload : payload;
  },
  matchPhrase(result) {
    const tweetPhrases = require('../data/tweet-data-phrases');
    // Pre/Post Address Phrases
    const rgxMatchPhraseFull = '';
    for (let i = 0; i < tweetPhrases.length; i++) {
      const rgxMatchPhrase = tweetPhrases[i].regex.exec(result.tweet);
      // If matched a phrase & known location
      if (rgxMatchPhrase && result.rgxMatch) {
        const rgxPrefixMatch = new RegExp(`((${rgxMatchPhrase[0]}).{0,3}\\s*(${result.rgxMatch}))`, 'i').exec(result.tweet);
        const rgxPostfixMatch = new RegExp(`((${result.rgxMatch}).{0,3}\\s*(${rgxMatchPhrase[0]}))`, 'i').exec(result.tweet);
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
  },
};

module.exports = tweetParser;
