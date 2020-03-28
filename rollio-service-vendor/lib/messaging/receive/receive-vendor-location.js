/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');
const { client: redisClient, pub } = require('../../redis/index');
const config = require('../../../config');
const logger = require('../../log/index')('messaging/receive/receive-vendor-location');

// SOCKET
const { io } = require('../../sockets/index');

const updateTweet = async (payload, region, vendor) => {
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
  // Clear cache for getVendors route & getRegion route
  try {
    await redisClient.hdelAsync('vendor', `q::method::GET::path::/${region._id}/object`);
  } catch (err) {
    logger.error(err);
  }

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

// TODO: look here
const setVendorActive = async (region, vendor) => {
  // Add vendorID to dailyActiveVendorIDs
  try {
    await regionOps.incrementRegionDailyActiveVendorIDs(
      { regionID: region._id, vendorID: vendor._id },
    );
  } catch (err) {
    logger.error(err);
  }

  // Set daily active of vendor to true AND reset consecutive days inactive of vendor
  // TODO: here
  try {
    await vendorOps.updateVendorSet({
      regionID: region._id, vendorID: vendor._id, field: ['dailyActive', 'consecutiveDaysInactive'], data: [true, -1],
    });
  } catch (err) {
    logger.error(err);
  }
};

const receiveTweets = async () => {
  mq.receive(config.AWS_SQS_PARSED_TWEETS, async (msg) => {
    const message = JSON.parse(msg.content);
    logger.info('Recieved tweet');
    logger.info(msg.content);

    const region = await regionOps.getRegionByName(config.REGION);
    const vendor = await vendorOps.getVendorByTwitterID(region._id, message.twitterID);
    // Formating
    const tweetPayload = {
      text: message.tweet,
      tweetID: message.tweetID,
      twitterID: message.twitterID,
      date: message.date,
    };

    let newLocation = null;

    // TODO: here!!!!!
    if (message.match) {
      newLocation = await vendorOps.createLocation({ ...message.location, tweetID: message.tweetID });
      tweetPayload.location = newLocation._id;
      await updateLocation(newLocation._id, region, vendor);
      await setVendorActive(region, vendor);
    }

    try {
      await updateTweet(tweetPayload, region, vendor);
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(tweetPayload); }

      const tweetPayloadLocationUpdate = { ...tweetPayload };

      // Change location from id to full location body
      if (newLocation) {
        tweetPayloadLocationUpdate.location = newLocation;
      }
      // Send the tweetPayload to all subscribed instances
      const redisTwitterChannelMessage = {
        serverID: config.SERVER_ID,
        tweetPayload: tweetPayloadLocationUpdate,
        vendorID: vendor._id,
        regionID: region._id,
      };

      try {
        pub.publish(config.REDIS_TWITTER_CHANNEL, JSON.stringify(redisTwitterChannelMessage));
      } catch (err) {
        logger.error(err);
      }

      // eslint-disable-next-line max-len
      // Send tweet data, location data, only, everything else will be updated on a get req (comments, ratings, etc)
      io.sockets.emit('TWITTER_DATA', { tweet: tweetPayloadLocationUpdate, vendorID: vendor._id, regionID: region._id });
    } catch (err) {
      logger.error('Failed to emit socket: twitter payload');
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
