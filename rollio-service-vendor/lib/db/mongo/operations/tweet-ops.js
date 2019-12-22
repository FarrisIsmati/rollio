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
        // TODO: also do logic to update the Vendor to dailyActive false and remove the location from the locationHistory
        return Tweet.updateOne({_id: id}, { location: null }).populate('vendorID');
    }
};
