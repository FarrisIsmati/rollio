//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');
const TweetParser         = require('../twitter/tweetParser');
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
    this.tweetParser = new TweetParser();
    this.geocoder = NodeGeocoder({
      provider: 'google',
      httpAdapter: 'https',
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      formatter: null
    });
  }

  runOperations() {
    const self = this;
    this.twitterClient.streamClient(async e => {
      const vendorTweet = await this.vendorTweetUpdate(e);
      const tweetAddress = this.tweetParser.scanAddress(vendorTweet);
      //if tweetAddress.match != null
        //vendorAddressUpdate();
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
      payload.geolocation = await this.getGeolocation(e);
    }

    await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'tweetsDaily', payload});

    //WEBSOCKETS FUNTIONALITY HERE
    return {...payload, place};
  }

  async getGeolocation(e) {
    const reverseGeocode = await this.geocoder.reverse({lat: e.geo.coordinates[0], lon: e.geo.coordinates[1]});
    let geolocation = {
      locationDate: e.created_at,
      address: reverseGeocode[0].formattedAddress,
      city: reverseGeocode[0].city,
      neighborhood: reverseGeocode[0].extra.neighborhood,
      coordinates: [...e.geo.coordinates]
    }
    return geolocation
  }
}

module.exports = DataOperations;
