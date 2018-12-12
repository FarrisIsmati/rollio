//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');
const tweetParser         = require('../twitter/tweetParser');
const NodeGeocoder        = require('node-geocoder');

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

    const updateData = async tweet => {
      //Update tweet first
      let vendor = await vendorOperations.getVendorByTwitterID(region._id, tweet.twitterID);
      await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'tweetsDaily', payload: tweet});
      //Check if tweet has an address
      let tweetAddress = tweetParser.scanAddress(tweet);
      await this.vendorAddressUpdate(tweetAddress);
    }

    //Run through sample data in an async for loop
    for (let i = 0, p = Promise.resolve(); i < sampleData.length; i++) {
      p = p.then(_ => new Promise(async resolve => {
          let tweet = sampleData[i];
          //Update tweet first
          let vendor = await vendorOperations.getVendorByTwitterID(region._id, tweet.twitterID);
          await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'tweetsDaily', payload: tweet});
          //Check if tweet has an address
          let tweetAddress = tweetParser.scanAddress(tweet);
          await this.vendorAddressUpdate(tweetAddress);
          resolve();
        }
      ));
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

      await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'locationHistory',  payload: payload.location })
      await vendorOperations.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: 'dailyActive',  data: true });
      await vendorOperations.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: 'consecutiveDaysInactive',  data: -1 });

      if (!region.dailyActiveVendorIDs.length || !region.dailyActiveVendorIDs.some(id => id.equals(vendor._id))) {
        await regionOperations.incrementRegionDailyActiveVendorIDs({regionName: this.regionName, vendorID: vendor._id})
      }

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
