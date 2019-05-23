/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');
const redisClient = require('../../db/redis/index');
const config = require('../../../config');

const updateTweet = async (payload, region, vendor) => {
  // Formating
  const tweet = { ...payload };
  delete tweet.twitterID;

  const params = {
    regionID: region._id, vendorID: vendor._id, field: 'tweetHistory', payload,
  };
  await vendorOps.updateVendorPush(params);
};

const updateLocation = async (payload, region, vendor) => {
  const paramsVendor = {
    regionID: region._id, vendorID: vendor._id, field: 'locationHistory', payload,
  };
  await vendorOps.updateVendorPush(paramsVendor);
};

const setVendorActive = async (region, vendor) => {
  // Clear cache for getVendorID route
  await redisClient.hdelAsync('vendor', `q::method::GET::path::/${region._id}/${vendor._id}`);
  // Clear cache for getVendors route
  await redisClient.hdelAsync('vendor', `q::method::GET::path::/${region._id}`);
  // Add vendorID to dailyActiveVendorIDs
  await regionOps.incrementRegionDailyActiveVendorIDs(
    { regionID: region._id, vendorID: vendor._id },
  );
  // Set daily active of vendor to true
  await vendorOps.updateVendorSet({
    regionID: region._id, vendorID: vendor._id, field: 'dailyActive', data: true,
  });
};

const receiveTweets = async () => {
  mq.receive('parsedTweets', async (msg) => {
    const message = JSON.parse(msg.content);
    console.log('Received Tweet');
    console.log(message);

    const region = await regionOps.getRegionByName(config.REGION);
    const vendor = await vendorOps.getVendorByTwitterID(region._id, message.twitterID);
    // Formating
    const tweetPayload = {
      text: message.tweet,
      tweetID: message.tweetID,
      twitterID: message.twitterID,
      date: message.date,
    };
    if (message.match) {
      tweetPayload.location = { ...message.location, tweetID: message.tweetID };
      await updateLocation({ ...tweetPayload.location }, region, vendor);
      await setVendorActive(region, vendor);
    }
    await updateTweet(tweetPayload, region, vendor);
  });
};

module.exports = {
  receiveTweets,
  setVendorActive,
};
