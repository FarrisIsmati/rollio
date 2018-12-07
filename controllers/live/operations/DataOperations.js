//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');
const tweetParser         = require('../twitter/tweetParser');
const NodeGeocoder        = require('node-geocoder');
const moment              = require('moment');

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

  async runOperations() {
    // const self = this;
    // this.twitterClient.streamClient(async e => {
    //   const vendorTweet = await this.vendorTweetUpdate(e);
    //   console.log(e);
    //   const tweetAddress = tweetParser.scanAddress(vendorTweet);
    //   vendorAddressUpdate(tweetAddress);
    // });

    //While testing tweetParser to the sampleData comment out above code in this method
    //Match one word locations e.g(ballston, union station, etc.)
    const region = await regionOperations.getRegionByName(this.regionName);
    const sampleData = require('../data/sampledata');
    for ( let i = 0; i < sampleData.length; i++ ) {
      let tweet = sampleData[i];
      let vendor = await vendorOperations.getVendorByTwitterID(region._id, tweet.twitterID);
      await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'tweetsDaily', payload: tweet});
      let tweetAddress = tweetParser.scanAddress(tweet);
      this.vendorAddressUpdate(tweetAddress);
    }
  }

  async vendorTweetUpdate(e) {
    const region = await regionOperations.getRegionByName(this.regionName);
    const vendor = await vendorOperations.getVendorByTwitterID(region._id, e.user.id_str);
    let payload = {
      tweetID: e.id_str,
      createdAt: e.created_at,
      text : e.text,
      screenName: e.user.screen_name,
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
    return {...payload, place, twitterID: e.user.id_str};
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

  async vendorAddressUpdate(payload) {
    if (payload.match) {
      if (payload.tweetID) {
        payload.location = {...payload.location, tweetID: payload.tweetID}
      }
      const region = await regionOperations.getRegionByName(this.regionName);
      const vendor = await vendorOperations.getVendorByTwitterID(region._id, payload.twitterID);
      await vendorOperations.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: 'dailyActive',  data: true });
      await vendorOperations.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: 'consecutiveDaysInactive',  data: -1 });

      const prevHistoryArr = await vendorOperations.getVendor(region._id, vendor._id).then( res => res.locationHistory);

      if (prevHistoryArr.length) {
        const prevHistoryDate = prevHistoryArr[prevHistoryArr.length - 1].locationDate;
        const isSameDay = moment(prevHistoryDate).isSame(payload.date, 'day');
        if (!isSameDay) {
          //inc regionDailyActive
        }
      } else {

        //increment regionDailyActive
      }

      //Update Region Daily Active
      //Get previous location history date
      //Compare to current location history date using moment JS
      //If current location date is different than previous
        //Increment reigon daily active
      await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'locationHistory',  payload: payload.location});

      // Does the Redis Key exist in the db
      //   REDIS KEY (SADD) <- Saved as a set
      //   vendor/comment/(truckid): 127.0.0.1, 198.23,1.9
      //   vendor/locationAccuracy/(truckid): 127.0.0.1, 198.23,1.9
      //   Yes
      //     Delete the key
    }
  }
}

module.exports = DataOperations;
