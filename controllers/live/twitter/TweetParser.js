class TweetParser {
  scanAddress(payload) {
    let result = {
      match: null,
      method: ''
    };
    let place = null;
    let geolocation = null;

    if (payload.place)
      place = payload.place;
    if (payload.geolocation) {
      geolocation = payload.geolocation;
      result.match = geolocation;
      result.method = 'Geolocation';
      //Figure out a proper format for a result (I say full tweet with a modified address obj (dont use place or geolocation))
      return result;
    }


    console.log(place);
    console.log(geolocation);
  }
}

module.exports = TweetParser;
