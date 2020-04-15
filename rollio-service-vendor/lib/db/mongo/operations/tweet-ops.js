const mongoose = require('../mongoose/index');

const Tweet = mongoose.model('Tweet');
const Vendor = mongoose.model('Vendor');
const Location = mongoose.model('Location');
const { pub } = require('./../../../redis');
const { REDIS_TWITTER_CHANNEL, SERVER_ID } = require('../../../../config');
const logger = require('../../../log/index')('db/mongo/operations/tweet-ops');

const deleteTweetLocation = async (_id) => {
  // TODO: figure out a way to publish that the old location was deleted
  // look up tweet
  const originalTweet = await Tweet.findById(_id).lean(true);
  // set previously used location to overridden
  await Location.updateOne({ _id: originalTweet.location }, { $set: { overridden: true } });
  await Vendor.updateOne({ _id: originalTweet.vendorID }, { $pull: { locationHistory: { _id: originalTweet.location } } });
  // delete the old location and set usedForLocation to false
  return Tweet.findOneAndUpdate({ _id }, { $unset: { location: 1 }, $set: { usedForLocation: false } }, { new: true }).populate('vendorID').populate('location').lean(true);
};

module.exports = {
  async getAllTweets(query = {}) {
    const { startDate, endDate, vendorID } = query;
    const vendorIDQuery = vendorID ? { vendorID } : {};
    return Tweet.find({ date: { $gte: startDate, $lte: endDate }, ...vendorIDQuery }).sort([['date', -1]]).populate('location');
  },
  async getVendorsForFiltering() {
    return Vendor.find({}).select('name _id').sort([['name', 1]]);
  },
  async getTweetWithPopulatedVendorAndLocation(id) {
    return Tweet.findById(id).populate('vendorID').populate('location');
  },
  deleteTweetLocation,
  async createTweetLocation(id, newLocationData) {
    let updatedTweet;
    try {
      const originalTweet = await Tweet.findById(id).lean(true);
      if (originalTweet.location) {
        await deleteTweetLocation(id);
      }
      const newLocation = await Location.create({ ...newLocationData, matchMethod: 'Manual from Tweet' });
      const { _id: vendorID, regionID, twitterID } = await Vendor.findOneAndUpdate(
        { _id: originalTweet.vendorID }, {
          $push: {
            locationHistory: {
              $each: [newLocation._id],
              $position: 0,
            },
          },
        },
      ).lean(true);
      updatedTweet = await Tweet.findOneAndUpdate({ _id: id }, { $set: { location: newLocation._id, usedForLocation: true } }, { new: true }).populate('vendorID').populate('location');
      const { text, tweetID, date } = updatedTweet;
      const tweetPayloadLocationUpdate = {
        text,
        tweetID,
        twitterID,
        date,
        location: newLocation,
      };
      const redisTwitterChannelMessage = {
        serverID: SERVER_ID,
        tweetPayload: tweetPayloadLocationUpdate,
        vendorID,
        regionID,
      };
      pub.publish(REDIS_TWITTER_CHANNEL, JSON.stringify(redisTwitterChannelMessage));
    } catch (err) {
      logger.error(err);
      throw err;
    }
    return updatedTweet;
  },
};
