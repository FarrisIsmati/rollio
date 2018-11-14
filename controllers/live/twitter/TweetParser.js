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
        city: 'tbd', //reverse search
        neighborhood: 'tbd', //reverse search
        coordinates: payload.geolocation.coordinates
      }
      console.log(result);
      return result;
    }

  }
}

module.exports = TweetParser;
