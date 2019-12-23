const mongoose = require('../mongoose/index');
const Tweet = mongoose.model('Tweet');
const Vendor = mongoose.model('Vendor');

module.exports = {
    async getAllTweets(query = {}) {
        const {startDate, endDate, vendorID } = query;
        const vendorIDQuery = vendorID ? {vendorID} : {};
        return Tweet.find({date: { $gte: startDate, $lt: endDate }, ...vendorIDQuery}).sort([['date', -1]])
    },
    async getVendorsForFiltering() {
        return Vendor.find({}).select('name _id').sort([['name', 1]]);
    },
    async getTweetWithPopulatedVendor(id) {
        return Tweet.findById(id).populate('vendorID');
    },
    async deleteTweetLocation(id) {
        // TODO
        /*
            1. remove location from locationHistory
            2. set overriden key to true on the location (or some other key...need to add it)
            3. set dailyActive to false on the tweet (if it is today)
         */
        return Tweet.updateOne({_id: id}, { location: null }).populate('vendorID');
    },
    async createTweetLocation(id, newLocationData) {
        // TODO
        /*
            1. deleteTweetLocation (if necessary)
            2. create location
            3. add location reference to the top of tweetLocationHistory
            4. set dailyActive to true (if necessary)
         */
        return Tweet.updateOne({_id: id}, { location: null }).populate('vendorID');
    }
};
