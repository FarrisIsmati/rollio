//ENV
require('dotenv').config();
//LIB
const mq = require('../index');
const redisOps = require('../../db/redis/operations/redis-ops');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

//Payload needs to contain
//Location Data
//Origin Data
//Region Info
//hook up to rabbitmq
const updateTweet = async (payload, region, vendor) => {
  console.log(payload);
  //Formating
  const tweet = {...payload};
  delete tweet.twitterID;

  const params = { regionID: region._id, vendorID: vendor._id, field: 'tweetHistory', payload };
  await vendorOps.updateVendorPush(params);
}

const updateLocation = async (payload, region, vendor) => {
  const paramsVendor = { regionID: region._id, vendorID: vendor._id, field: 'locationHistory', payload };
  await vendorOps.updateVendorPush(paramsVendor);
  // const paramsRegion = { regionID: region._id, vendorID: vendor._id };
  // await regionOps.incrementRegionDailyActiveVendorIDs(paramsRegion);
}

const recieveTweets = async _ => {
  mq.recieve('parsedTweets', async msg => {
    const message = JSON.parse(msg.content);
    const region = await regionOps.getRegionByName(process.env.REGION);
    const vendor = await vendorOps.getVendorByTwitterID(region._id, message.twitterID);

    //Formating
    const tweetPayload = {
      text: message.tweet,
      tweetID: message.tweetID,
      twitterID: message.twitterID,
      date: message.date
    };

    if (message.match) {
      tweetPayload.location = { ...message.location, tweetID: message.tweetID }
      await updateLocation({ ...tweetPayload.location }, region, vendor);
    }

    await updateTweet(tweetPayload, region, vendor);
  });
}

module.exports = {
  recieveTweets
};
