//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');
const tweetParser         = require('../twitter/tweetParser');
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
  }

  runOperations() {
    // const self = this;
    // this.twitterClient.streamClient(async e => {
    //   const vendorTweet = await this.vendorTweetUpdate(e);
    //   const tweetAddress = tweetParser.scanAddress(vendorTweet);
    // });

    //While testing tweetParser to the sampleData comment out above code in this method
    //Match one word locations e.g(ballston, union station, etc.)
    const sampleData = require('../data/sampledata');
    for ( let i = 0; i < sampleData.length; i++ ) {
      let tweet = sampleData[i].text;
      //Setup regex to scan the tweet for the key words
      console.log(tweet);
      console.log();
    }
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
