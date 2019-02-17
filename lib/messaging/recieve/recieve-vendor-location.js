//DEPENDENCIES
const mq = require('../index');
//OPERATIONS
const redisOps = require('../../db/redis/operations/redis-ops');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

//Payload needs to contain
//Location Data
//Origin Data
//Region Info
//hook up to rabbitmq
const updateTweet = async (payload, region, vendor) => {

}

const updateLocation = async _ => {

}

const recieveTweets = async _ => {
  mq.recieve('parsedTweets', async msg => {
    const payload = JSON.parse(msg.content);
    //Formating
    if (payload.tweetID) {
      payload.location = {...payload.location, tweetID: payload.tweetID}
    }

    const region = await regionOps.getRegionByName(process.env.REGION);
    const vendor = await vendorOps.getVendorByTwitterID(region._id, payload.twitterID);

    console.log(payload);

    await updateTweet(payload, region, vendor);
  })


  if (false) {

    await vendorOps.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'locationHistory',  payload: payload.location })
    await vendorOps.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: ['dailyActive', 'consecutiveDaysInactive'],  data: [true, -1] });

    if (!region.dailyActiveVendorIDs.length || !region.dailyActiveVendorIDs.some(id => id.equals(vendor._id))) {
      await regionOps.incrementRegionDailyActiveVendorIDs({regionName: payload.regionName, vendorID: vendor._id})
    }

    await redisOps.resetVendorLocationAndComment();
  }
}



module.exports = {
  recieveTweets
};
