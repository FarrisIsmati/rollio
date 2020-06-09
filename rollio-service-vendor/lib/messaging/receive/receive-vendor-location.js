/* eslint-disable max-len */
/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');
const sharedOps = require('../../db/mongo/operations/shared-ops');
const { sendEmailToAdminAccount } = require('../../email/send-email');
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
    const { tweetHistory } = await vendorOps.updateVendorPush(params);
    return tweetHistory.pop();
  } catch (err) {
    logger.error(err);
  }

  return null;
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

const receiveTweets = async () => {
  mq.receive(config.AWS_SQS_PARSED_TWEETS, async (msg) => {
    const message = JSON.parse(msg.content);
    logger.info('Received tweet');
    logger.info(msg.content);

    const region = await regionOps.getRegionByName(config.REGION);
    const vendor = await vendorOps.getVendorByTwitterID(region._id, message.twitterID);
    const vendorID = vendor._id;

    const {
      tweet: text, tweetID, date, match, newLocations: tweetLocations,
    } = message;

    let allLocations = [];
    let newLocations = [];

    if (match) {
      newLocations = await Promise.all(tweetLocations.map(location => sharedOps.createLocationAndCorrectConflicts({ ...location, tweetID, vendorID })));
      await Promise.all(newLocations.map(newLocation => updateLocation(newLocation._id, region, vendor)));
      allLocations = await sharedOps.getVendorLocations(vendorID);
    }

    // Format tweet as it is stored in Tweet History in Redux
    const tweetPayload = {
      date,
      locations: newLocations.map(location => location._id),
      text,
      tweetID,
      usedForLocation: !!tweetLocations.length,
      vendorID,
    };

    try {
      const newTweetId = await updateTweet({ ...tweetPayload, locations: newLocations.map(loc => loc._id), usedForLocation: !!newLocations.length }, region, vendor);
      const link = `${config.CLIENT_DOMAIN}/tweets/vendor/${vendorID}/tweet/${newTweetId}`;
      sendEmailToAdminAccount({
        subject: `${vendor.name} sent a new tweet`,
        template: 'admin.new-location',
        context: {
          text, newLocations, link, vendor,
        },
      });
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(tweetPayload); }

      const twitterData = {
        tweet: tweetPayload, newLocations, allLocations, vendorID, regionID: region._id,
      };

      try {
        // Send the tweetPayload to all subscribed instances
        pub.publish(config.REDIS_TWITTER_CHANNEL, JSON.stringify({ ...twitterData, messageType: 'NEW_LOCATIONS', serverID: config.SERVER_ID }));
      } catch (err) {
        logger.error(err);
      }

      // eslint-disable-next-line max-len
      // Send tweet data, location data, only, everything else will be updated on a get req (comments, ratings, etc)
      io.sockets.emit('NEW_LOCATIONS', twitterData);
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
  updateLocation,
};
