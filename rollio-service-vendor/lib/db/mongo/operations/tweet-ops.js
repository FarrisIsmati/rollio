const mongoose = require('../mongoose/index');

const Tweet = mongoose.model('Tweet');
const Vendor = mongoose.model('Vendor');
const Location = mongoose.model('Location');
const { client: redisClient, pub } = require('./../../../redis');
const { io } = require('../../../sockets/index');
const { REDIS_TWITTER_CHANNEL, SERVER_ID } = require('../../../../config');
const logger = require('../../../log/index')('db/mongo/operations/tweet-ops');
const vendorOps = require('./vendor-ops');

const clearVendorCache = async ({ regionID, vendorID }) => {
  try {
    await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/object`);
    await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
  } catch (err) {
    logger.error(err);
  }
};


const publishLocationUpdate = async ({
  updatedTweet, newLocations, vendorID, twitterID, regionID,
}) => {
  let tweet = null;
  if (updatedTweet) {
    const { text, tweetID, date } = updatedTweet;
    tweet = {
      text,
      tweetID,
      twitterID,
      date,
    };
  }

  const allLocations = await vendorOps.getVendorLocations(vendorID);
  const twitterData = {
    tweet, newLocations, allLocations, vendorID, regionID,
  };
  try {
    pub.publish(REDIS_TWITTER_CHANNEL, JSON.stringify({ ...twitterData, messageType: 'NEW_LOCATIONS', serverID: SERVER_ID }));
    io.sockets.emit('NEW_LOCATIONS', twitterData);
  } catch (err) {
    logger.error(err);
  }
};

const publishLocationUpdateAndClearCache = async ({
  updatedTweet, newLocations, vendorID, twitterID, regionID,
}) => {
  await publishLocationUpdate({
    updatedTweet, newLocations, vendorID, twitterID, regionID,
  });
  return clearVendorCache({ regionID, vendorID });
};


const deleteTweetLocation = async (tweetId, locationId, publishData = true) => {
  // look up tweet
  const originalTweet = await Tweet.findById(tweetId).lean(true);
  // set previously used location to overridden
  await Location.updateOne({ _id: locationId }, { $set: { overridden: true } });
  const { twitterID, regionID, _id: vendorID } = await Vendor.findOneAndUpdate({ _id: originalTweet.vendorID }, { $pull: { locationHistory: locationId } }, { new: true });
  // delete the old location and set usedForLocation to false
  const updatedTweet = await Tweet.findOneAndUpdate({ _id: tweetId }, { $pull: { locations: locationId }, $set: { usedForLocation: originalTweet.locations.length > 1 } }, { new: true }).populate('vendorID').populate('locations').lean(true);
  if (publishData) {
    await publishLocationUpdateAndClearCache({
      updatedTweet, newLocations: [], vendorID, twitterID, regionID,
    });
  }
  return updatedTweet;
};

module.exports = {
  async getTweet(_id) {
    return Tweet.findOne({ _id });
  },
  async getAllTweets(query = {}) {
    const { startDate, endDate, vendorID } = query;
    const vendorIDQuery = vendorID ? { vendorID } : {};
    return Tweet.find({ date: { $gte: startDate, $lte: endDate }, ...vendorIDQuery }).sort([['date', -1]]).populate('locations');
  },
  async getVendorsForFiltering(query = {}) {
    const { vendorID } = query;
    const finalQuery = vendorID ? { _id: vendorID } : { };
    return Vendor.find(finalQuery).select('name _id tweetHistory').populate('tweetHistory').sort([['name', 1]]);
  },
  async getTweetWithPopulatedVendorAndLocations(id) {
    return Tweet.findById(id).populate('vendorID').populate('locations');
  },
  deleteTweetLocation,
  async createTweetLocation(id, data) {
    let updatedTweet;
    const { locationToOverride, ...newLocationData } = data;
    try {
      const originalTweet = await Tweet.findById(id).lean(true);
      const { vendorID } = originalTweet;
      if (locationToOverride) {
        await deleteTweetLocation(id, locationToOverride._id, false);
      }
      const newLocation = await vendorOps.createLocationAndCorrectConflicts({ ...newLocationData, vendorID, matchMethod: 'Manual from Tweet' });
      const { regionID, twitterID } = await Vendor.findOneAndUpdate(
        { _id: vendorID }, {
          $push: {
            locationHistory: {
              $each: [newLocation._id],
              $position: 0,
            },
          },
        },
      ).lean(true);
      updatedTweet = await Tweet.findOneAndUpdate({ _id: id }, { $push: { locations: newLocation._id }, $set: { usedForLocation: true } }, { new: true }).populate('vendorID').populate('locations');
      await publishLocationUpdateAndClearCache({
        updatedTweet, newLocations: [newLocation], vendorID, twitterID, regionID,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
    return updatedTweet;
  },
  publishLocationUpdateAndClearCache,
};
