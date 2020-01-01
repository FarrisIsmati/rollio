const moment = require('moment');
const mongoose = require('../mongoose/index');
const Tweet = mongoose.model('Tweet');
const Vendor = mongoose.model('Vendor');
const Location = mongoose.model('Location');

const deleteTweetLocation = async _id => {
    // look up tweet
    const originalTweet = await Tweet.findById(_id).lean(true);
    // set previously used location to overriden
    await Location.findOneAndUpdate({_id: originalTweet.location }, { $set: { overriden: true } });
    // pull location from vendor's location history, set usedForLocation to false, and if tweet is from today, set dailyActive to false
    const tweetIsFromToday = moment(Date.now()).isSame(moment(originalTweet.date), 'days');
    const dailyActiveUpdate = tweetIsFromToday ? { $set: { dailyActive: false }} : {};
    // update vendor
    await Vendor.findOneAndUpdate({ _id: originalTweet.vendorID }, { ...dailyActiveUpdate, $pull: { locationHistory: { _id: originalTweet.location } } });
    // delete the old location and set usedForLocation to false
    return Tweet.findOneAndUpdate({ _id }, { $unset: { location: 1 }, $set: { usedForLocation: false }}).populate('vendorID').populate('location').lean(true);
};

module.exports = {
    async getAllTweets(query = {}) {
        const {startDate, endDate, vendorID } = query;
        const vendorIDQuery = vendorID ? {vendorID} : {};
        return Tweet.find({date: { $gte: startDate, $lte: endDate }, ...vendorIDQuery}).sort([['date', -1]]).populate('location')
    },
    async getVendorsForFiltering() {
        return Vendor.find({}).select('name _id').sort([['name', 1]]);
    },
    async getTweetWithPopulatedVendorAndLocation(id) {
        return Tweet.findById(id).populate('vendorID').populate('location');
    },
    deleteTweetLocation,
    async createTweetLocation(id, newLocationData) {
        const originalTweet = await Tweet.findById(id).lean(true);
        if (originalTweet.location) {
            await deleteTweetLocation(id)
        }
        const tweetIsFromToday = moment(Date.now()).isSame(moment(newLocationData.locationDate), 'days');
        const newLocation = await Location.create({ ...newLocationData, matchMethod: 'Manual from Tweet' });
        const dailyActiveUpdate = tweetIsFromToday ? { $set: { dailyActive: true } } : {};
        await Vendor.findOneAndUpdate({ _id: originalTweet.vendorID }, {
            $push: {
                locationHistory: {
                    $each: [newLocation._id],
                    $position: 0
                }
            },
            ...dailyActiveUpdate
        });
        return Tweet.findOneAndUpdate({ _id: id }, { $set: { location: newLocation._id, usedForLocation: true } }).populate('vendorID').populate('location');
    }
};
