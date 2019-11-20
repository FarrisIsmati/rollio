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
    }
};
