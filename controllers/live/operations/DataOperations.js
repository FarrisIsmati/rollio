//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');
const tweetParser         = require('../twitter/tweetParser');
const redisOperations     = require('../../db/redis/redisOperations');

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
  }

  async runOperations() {
    // const self = this;
    // this.twitterClient.streamClient(async e => {
    //   const vendorTweet = await this.vendorTweetUpdate(e);
    //   console.log(e);
    //   const tweetAddress = tweetParser.scanAddress(vendorTweet);
    //   vendorAddressUpdate(tweetAddress);
    // });

    //Strictly for testing sample twitter data (make sure you comment out the above code)
    this.testRunOperations();
  }

  //Strictly for testing sample twitter data
  async testRunOperations() {
    const region = await regionOperations.getRegionByName(this.regionName);
    const sampleData = require('../data/sampledata');

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

  async vendorAddressUpdate(payload) {
    if (payload.match) {
      if (payload.tweetID) {
        payload.location = {...payload.location, tweetID: payload.tweetID}
      }
      const region = await regionOperations.getRegionByName(this.regionName);
      const vendor = await vendorOperations.getVendorByTwitterID(region._id, payload.twitterID);

      await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'locationHistory',  payload: payload.location })
      await vendorOperations.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: ['dailyActive', 'consecutiveDaysInactive'],  data: [true, -1] });

      if (!region.dailyActiveVendorIDs.length || !region.dailyActiveVendorIDs.some(id => id.equals(vendor._id))) {
        await regionOperations.incrementRegionDailyActiveVendorIDs({regionName: this.regionName, vendorID: vendor._id})
      }

      await redisOperations.resetVendorLocationAndComment();
    }
  }
}

module.exports = DataOperations;
