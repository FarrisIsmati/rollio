const mongoose = require('../mongoose/index');

const Tweet = mongoose.model('Tweet');
const Vendor = mongoose.model('Vendor');
const Location = mongoose.model('Location');
const { pub } = require('./../../../redis');
const { REDIS_TWITTER_CHANNEL, SERVER_ID } = require('../../../../config');
const logger = require('../../../log/index')('db/mongo/operations/tweet-ops');
const vendorOps = require('./vendor-ops');

const deleteTweetLocation = async (tweetId, locationId) => {
  // TODO: figure out a way to publish that the old location was deleted
  // look up tweet
  const originalTweet = await Tweet.findById(tweetId).lean(true);
  // set previously used location to overridden
  await Location.updateOne({ _id: locationId }, { $set: { overridden: true } });
  await Vendor.updateOne({ _id: originalTweet.vendorID }, { $pull: { locationHistory: locationId } });
  // delete the old location and set usedForLocation to false
  return Tweet.findOneAndUpdate({ _id: tweetId }, { $pull: { locations: locationId }, $set: { usedForLocation: originalTweet.locations.length > 1 } }, { new: true }).populate('vendorID').populate('locations').lean(true);
};

module.exports = {
  async getAllTweets(query = {}) {
    const { startDate, endDate, vendorID } = query;
    const vendorIDQuery = vendorID ? { vendorID } : {};
    return Tweet.find({ date: { $gte: startDate, $lte: endDate }, ...vendorIDQuery }).sort([['date', -1]]).populate('locations');
  },
  async getVendorsForFiltering() {
    return Vendor.find({}).select('name _id').sort([['name', 1]]);
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
        await deleteTweetLocation(id, locationToOverride._id);
      }
      const newLocation = await vendorOps.createLocationAndCorrectConflicts({ ...newLocationData, vendorID, matchMethod: 'Manual from Tweet' })
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
      const { text, tweetID, date } = updatedTweet;

      const tweetPayload = {
        text,
        tweetID,
        twitterID,
        date,
      };

      const allLocations = await vendorOps.getVendorLocations(vendorID);

      const twitterData = {
        tweet: tweetPayload, newLocations: [newLocation], allLocations, vendorID, regionID,
      };

      pub.publish(REDIS_TWITTER_CHANNEL, JSON.stringify({ ...twitterData, serverID: SERVER_ID }));
    } catch (err) {
      logger.error(err);
      throw err;
    }
    return updatedTweet;
  },
};
