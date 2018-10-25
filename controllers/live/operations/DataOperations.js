//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');

//OPERATIONS
const getRegion           = require('../../db/operations/regionOperations').getRegion;
const updateVendorPush    = require('../../db/operations/vendorOperations').updateVendorPush;

class DataOperations {
  constructor() {
    this.twitterClient = new Twitter({
      c_key: process.env.TWITTER_CONSUMER_KEY,
      c_secret: process.env.TWITTER_CONSUMER_SECRET,
      a_key: process.env.TWITTER_ACCESS_TOKEN,
      a_secret: process.env.TWITTER_ACCESS_SECRET,
      regionName: 'WASHINGTONDC'
    });

    this.runOperations();
  }

  runOperations() {
    this.twitterClient.streamClient(e => {
      console.log(e);
      //this.vendorTweetUpdate(e);
    });
  }

  async vendorTweetUpdate(e) {
    console.log(e);

    //FIRST FIND BEST WAY TO GET CURRENT REGION
    const regionID = getRegion()
    //SECOND FIND BEST WAY TO GET VENDOR ID FROM TWEET

    const payload = {
      tweetID: e.id_str,
      createdAt: e.created_at,
      text : e.text,
      userID: e.user.id_str,
      userName: e.user.name,
      userScreenName: e.user.screen_name,
    }

    let geo = null;
    if (e.geo !== null) {
      geo = {
        coordinatesDate: e.created_at,
        address: 'temp',//https://www.npmjs.com/package/node-geocoder THIRD REVERSE GEOCODE
        coordinates: [...geo.coordinates
      }

      payload.geo = geo;
    }

    await updateVendorPush({ regionID, vendorID, field: 'tweetsDaily', payload}); //FOURTH PASS IN NEW REGIONID AND VENDORID

    return geo;
  }
}

module.exports = DataOperations;
