// DEPENDENCIES
const googlePlaces = require('../../bin/google-places');

const tweetParser = {
  async scanAddress(payload) {
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
    result = this.matchPhrase(await this.matchKnownLocation(Object.assign({}, result)));
    if (result.match) {
      result.location.locationDate = payload.createdAt;
    }
    return result;
  },

  // //TONS OF WORK TO BE DONE HERE!
  // async googlePlacesResolve(payload, promise) {
  //   const address = await promise;
  //   let matchedPayload = {};
  //   if (address.length) {
  //     matchedPayload = {
  //       ...payload,
  //       match: true,
  //       rgxMatch: rgxMatchLocation[0],
  //       certainty: 'partial',
  //       location: {
  //         locationDate: payload.date,
  //         accuracy: 0,
  //         address: curLocation.location.address,
  //         city,
  //         neighborhood: curLocation.neighborhood,
  //         coordinates: curLocation.location.coordinates,
  //         matchMethod: 'Tweet regex match',
  //       },
  //     };
  //   }
  //   return matchedPayload;
  // },


  async matchKnownLocation(payload) {
    // eslint-disable-next-line global-require
    const knownLocations = require('../data/tweet-data-known-locations');
    // Match known locations
    const cities = Object.keys(knownLocations);
    let matchedPayload;

    // Store promises to be resolved
    const googlePromises = [];

    for (let i = 0; i < cities.length; i += 1) {
      const city = cities[i];
      const neighboorhoods = Object.keys(knownLocations[city]);

      for (let x = 0; x < neighboorhoods.length; x += 1) {
        const location = neighboorhoods[x];
        const curLocation = knownLocations[city][location];
        const rgxMatchLocation = curLocation.regex.exec(payload.tweet);
        if (rgxMatchLocation !== null) {
          if (curLocation.neighborhood === '') {
            console.log('--------------');
            console.log(rgxMatchLocation[0]);
            console.log('--------------');

            const searchAddress = `${rgxMatchLocation[0]}, ${city}`;
            console.log(searchAddress);
            // WANT TO PLACE AN ASYNC ACTION HERE
            // FIGURE OUT GOOD WORK FLOW HERE TO PASS DATA AROUND NEEDS WORK
            // googlePromises.push(this.googlePlacesResolve(payload, googlePlaces.search(searchAddress)));
          } else {
            matchedPayload = {
              ...payload,
              match: true,
              rgxMatch: rgxMatchLocation[0],
              certainty: 'partial',
              location: {
                locationDate: payload.date,
                accuracy: 0,
                address: curLocation.location.address,
                city,
                neighborhood: curLocation.neighborhood,
                coordinates: curLocation.location.coordinates,
                matchMethod: 'Tweet regex match',
              },
            };
            break;
          }
        }
      }
    }

    // const searchedAddressResults = await Promise.all(googlePromises);

    return matchedPayload !== undefined ? matchedPayload : payload;
  },
  matchPhrase(payload) {
    const result = { ...payload };
    if (payload.rgxMatch) {
      // eslint-disable-next-line global-require
      const tweetPhrases = require('../data/tweet-data-phrases');
      for (let i = 0; i < tweetPhrases.length; i += 1) {
        const rgxMatchPhrase = tweetPhrases[i].regex.exec(payload.tweet);
        // If matched a phrase & known location
        if (rgxMatchPhrase) {
          const rgxPrefixMatch = new RegExp(`((${rgxMatchPhrase[0]}).{0,3}\\s*(${payload.rgxMatch}))`, 'i').exec(payload.tweet);
          const rgxPostfixMatch = new RegExp(`((${payload.rgxMatch}).{0,3}\\s*(${rgxMatchPhrase[0]}))`, 'i').exec(payload.tweet);
          if (tweetPhrases[i].prefix && rgxPrefixMatch) {
            const [prefixMatch] = rgxPrefixMatch;
            result.rgxMatch = prefixMatch;
          } else if (tweetPhrases[i].postfix && rgxPostfixMatch) {
            const [postfixMatch] = rgxPostfixMatch;
            result.rgxMatch = postfixMatch;
          }
          if ((rgxPrefixMatch || rgxPostfixMatch) && tweetPhrases[i].negation) {
            result.match = false;
            result.certainty = 'certain';
            result.location = {};
          }
          break;
        }
      }
    }
    return result;
  },
};

module.exports = tweetParser;
