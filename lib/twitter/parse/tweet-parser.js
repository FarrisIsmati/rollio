// DEPENDENCIES
const googlePlaces = require('../../bin/google-places');
const knownLocationKeys = require('../data/known-location-keys');

const tweetParser = {
  async scanAddress(payload) {
    // await this.promfunc();
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
  async googlePlacesResolve(googlePlacesPayload) {
    const {
      payload, rgxMatchLocation, city, searchAddress,
    } = googlePlacesPayload;
    const address = await googlePlaces.search(searchAddress);

    // find neighborhood from coordinates
    const neighborhood = await googlePlaces.neighborhoodFromCoords(
      address[0].geometry.location.lat, address[0].geometry.location.lng,
    );

    let matchedPayload;
    if (address.length) {
      matchedPayload = {
        ...payload,
        match: true,
        rgxMatch: rgxMatchLocation[0],
        certainty: 'partial',
        location: {
          locationDate: payload.date,
          accuracy: 0,
          address: address[0].formatted_address,
          city,
          neighborhood,
          coordinates: [address[0].geometry.location.lat, address[0].geometry.location.lng],
          matchMethod: 'Tweet regex match',
        },
      };
    }
    return matchedPayload;
  },
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
            const googlePlacesPayload = {
              payload,
              rgxMatchLocation,
              city,
              searchAddress: `${rgxMatchLocation[0]}, ${knownLocationKeys[city]}`,
            };
            googlePromises.push(this.googlePlacesResolve(googlePlacesPayload));
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

    // If google places resolved an address from the tweet set that to matchedKnownLocation
    const searchedAddressResults = await Promise.all(googlePromises);
    if (searchedAddressResults.length) {
      const searchedAddress = searchedAddressResults[0];
      matchedPayload = searchedAddress;
    }

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
