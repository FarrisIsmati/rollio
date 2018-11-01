//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');
var NodeGeocoder          = require('node-geocoder');

//OPERATIONS
const regionOperations     = require('../../db/operations/regionOperations');
const vendorOperations     = require('../../db/operations/vendorOperations');

class DataOperations {
  constructor(regionName) {
    this.regionName = regionName;
    this.twitterClient = new Twitter({
      c_key: process.env.TWITTER_CONSUMER_KEY,
      c_secret: process.env.TWITTER_CONSUMER_SECRET,
      a_key: process.env.TWITTER_ACCESS_TOKEN,
      a_secret: process.env.TWITTER_ACCESS_SECRET,
      regionName: this.regionName
    });
    this.geocoder = NodeGeocoder({
      provider: 'google',
      httpAdapter: 'https',
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      formatter: null
    });

    this.runOperations();
  }

  runOperations() {
    this.twitterClient.streamClient(async e => {
      const vendorTweetResponse = await this.vendorTweetUpdate(e);
      console.log(vendorTweetResponse);
    });
  }

  async vendorTweetUpdate(e) {
    const region = await regionOperations.getRegionByName(this.regionName);
    const vendor = await vendorOperations.getVendorByTwitterID(region._id, e.user.id_str);
    const payload = {
      tweetID: e.id_str,
      createdAt: e.created_at,
      text : e.text,
      userID: e.user.id_str,
      userName: e.user.name,
      userScreenName: e.user.screen_name
    }

    let place = null;
    if (e.place !== null) {
      place = {...e.place};
    }

    if (e.geo !== null) {
      const reverseGeocode = await this.geocoder.reverse({lat: e.geo.coordinates[0], lon: e.geo.coordinates[1]});
      let geolocation = {
        coordinatesDate: e.created_at,
        address: reverseGeocode[0].formattedAddress,
        coordinates: [...e.geo.coordinates]
      }
      payload.geolocation = geolocation;
    }

    await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'tweetsDaily', payload});

    //WEBSOCKETS FUNTIONALITY HERE

    return {...payload, place};
  }
}

module.exports = DataOperations;
