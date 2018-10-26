//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');

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

    this.runOperations();
  }

  runOperations() {
    this.twitterClient.streamClient(e => {
      this.vendorTweetUpdate(e);
    });
  }

  async vendorTweetUpdate(e) {
    const region = await regionOperations.getRegionByName(this.regionName);
    const vendor = await vendorOperations.getVendorByTwitterID(region._id, e.user.id_str);
    // const payload = {
    //   tweetID: e.id_str,
    //   createdAt: e.created_at,
    //   text : e.text,
    //   userID: e.user.id_str,
    //   userName: e.user.name,
    //   userScreenName: e.user.screen_name,
    // }
    //
    // let geo = null;
    // if (e.geo !== null) {
    //   geo = {
    //     coordinatesDate: e.created_at,
    //     address: 'temp',//https://www.npmjs.com/package/node-geocoder THIRD REVERSE GEOCODE
    //     coordinates: [...geo.coordinates]
    //   }
    //
    //   payload.geo = geo;
    // }
    //
    // await vendorOperations.updateVendorPush({ regionID, vendorID, field: 'tweetsDaily', payload}); //FOURTH PASS IN NEW REGIONID AND VENDORID
    //
    // return geo;
  }
}

module.exports = DataOperations;
