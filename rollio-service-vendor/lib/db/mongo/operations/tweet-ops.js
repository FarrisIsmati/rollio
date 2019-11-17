const mongoose = require('../mongoose/index');
const Tweet = mongoose.model('Tweet');

module.exports = {
    async getAllTweets(query = {}) {
        const {startDate, endDate} = query;
        return Tweet.find({date: { $gte: startDate, $lt: endDate }}).populate({ path: 'vendorID', select: 'name _id'}).sort([['date', -1]]);
    }
};
