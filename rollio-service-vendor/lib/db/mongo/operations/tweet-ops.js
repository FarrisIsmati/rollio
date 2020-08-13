// DEPENDENCIES
const mongoose = require('../mongoose/index');
const logger = require('../../../log/index')('db/mongo/operations/tweet-ops');
const sharedOps = require('./shared-ops');
const { ObjectId } = require('mongodb');

// SCHEMA
const Tweet = mongoose.model('Tweet');
const Vendor = mongoose.model('Vendor');
const Location = mongoose.model('Location');

const tweetOps = {
  async createTweetLocation(id, data) {
    let updatedTweet;
    const { locationToOverride, ...newLocationData } = data;

    try {
      const originalTweet = await Tweet.findById(id).lean(true);
      const { vendorID } = originalTweet;
      if (locationToOverride) {
        await tweetOps.deleteTweetLocation(id, locationToOverride._id, false);
      }

      const newLocation = await sharedOps.createLocationAndCorrectConflicts({ ...newLocationData, vendorID, matchMethod: 'Manual from Tweet' });
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

      await sharedOps.publishLocationUpdateAndClearCache({
        updatedTweet, newLocations: [newLocation], vendorID, twitterID, regionID,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }

    return updatedTweet;
  },

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
    return Vendor.find(finalQuery).lean().select('name _id tweetHistory').populate('tweetHistory')
      .sort([['name', 1]]);
  },

  async getTweetWithPopulatedVendorAndLocations(id) {
    return Tweet.findById(id).populate('vendorID').populate('locations');
  },

  async editTweetLocation(tweetId, locationId, data) {
    const updatedLocation = await Location.findOneAndUpdate({ _id: locationId }, { $set: data }, { new: true }).lean(true);
    await sharedOps.correctLocationConflicts(updatedLocation);
    const updatedTweet = await Tweet.findOne({ _id: tweetId }).populate('vendorID').populate('locations').lean();
    const { regionID, twitterID } = updatedTweet.vendorID;
    await sharedOps.publishLocationUpdateAndClearCache({
      updatedTweet, newLocations: [updatedLocation], vendorID: updatedTweet, twitterID, regionID,
    });
    return updatedTweet;
  },

  async deleteTweetLocation(tweetId, locationId, publishData = true) {
    // look up tweet
    const originalTweet = await Tweet.findById(tweetId).lean(true);
    // set previously used location to overridden
    await Location.updateOne({ _id: locationId }, { $set: { overridden: true } });
    const { twitterID, regionID, _id: vendorID } = await Vendor.findOneAndUpdate({ _id: originalTweet.vendorID }, { $pull: { locationHistory: locationId } }, { new: true });
    // delete the old location and set usedForLocation to false
    const updatedTweet = await Tweet.findOneAndUpdate({ _id: tweetId }, { $pull: { locations: locationId }, $set: { usedForLocation: originalTweet.locations.length > 1 } }, { new: true }).populate('vendorID').populate('locations').lean(true);
    if (publishData) {
      await sharedOps.publishLocationUpdateAndClearCache({
        updatedTweet, newLocations: [], vendorID, twitterID, regionID,
      });
    }
    return updatedTweet;
  }
};

module.exports = tweetOps;