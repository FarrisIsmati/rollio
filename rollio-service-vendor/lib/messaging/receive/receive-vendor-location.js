/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');
const redisClient = require('../../db/redis/index');
const config = require('../../../config');
const logger = require('../../log/index')('messaging/receive/receive-vendor-location');

// SOCKET
const { io } = require('../../sockets/index');

const updateTweet = async (payload, region, vendor) => {
  // Formating
  const tweet = { ...payload };
  delete tweet.twitterID;

  const params = {
    regionID: region._id, vendorID: vendor._id, field: 'tweetHistory', payload,
  };
  try {
    await vendorOps.updateVendorPush(params);
  } catch (err) {
    logger.error(err);
  }
};

// Update the locationHistory property
// Update the updateDate timestamp
const updateLocation = async (payload, region, vendor) => {
  const paramsVendorPush = {
    regionID: region._id, vendorID: vendor._id, field: 'locationHistory', payload,
  };

  try {
    await vendorOps.updateVendorPush(paramsVendorPush);
  } catch (err) {
    logger.error(err);
  }

  const paramsVendorSet = {
    regionID: region._id, vendorID: vendor._id, field: 'updateDate', data: Date.now(),
  };

  try {
    await vendorOps.updateVendorSet(paramsVendorSet);
  } catch (err) {
    logger.error(err);
  }
};

const setVendorActive = async (region, vendor) => {
  // Clear cache for getVendors route
  try {
    await redisClient.hdelAsync('vendor', `q::method::GET::path::/${region._id}`);
  } catch (err) {
    logger.error(err);
  }

  // Add vendorID to dailyActiveVendorIDs
  try {
    await regionOps.incrementRegionDailyActiveVendorIDs(
      { regionID: region._id, vendorID: vendor._id },
    );
  } catch (err) {
    logger.error(err);
  }

  // Set daily active of vendor to true AND reset consecutive days inactive of vendor
  try {
    await vendorOps.updateVendorSet({
      regionID: region._id, vendorID: vendor._id, field: ['dailyActive', 'consecutiveDaysInactive'], data: [true, -1],
    });
  } catch (err) {
    logger.error(err);
  }
};

const receiveTweets = async () => {
  mq.receive('parsedTweets', async (msg) => {
    const message = JSON.parse(msg.content);
    logger.info('Recieved tweet');
    logger.info(message);

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

    try {
      await updateTweet(tweetPayload, region, vendor);
      console.log(tweetPayload);
      // eslint-disable-next-line max-len
      // Send tweet data, location data, only, everything else will be updated on a get req (comments, ratings, etc)
      io.sockets.emit('TWITTER_DATA', { tweet: tweetPayload, vendorID: vendor._id, regionID: region._id });
    } catch (err) {
      logger.error(err);
    }

    // Clear cache for getVendorID route
    try {
      await redisClient.hdelAsync('vendor', `q::method::GET::path::/${region._id}/${vendor._id}`);
    } catch (err) {
      logger.error(err);
    }
  });
};

module.exports = {
  receiveTweets,
  setVendorActive,
  updateLocation,
};
