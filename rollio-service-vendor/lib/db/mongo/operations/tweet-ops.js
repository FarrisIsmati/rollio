const mongoose = require('../mongoose/index');
const Tweet = mongoose.model('Tweet');

module.exports = {
    async getAllTweets(query) {
        return Tweet.find();
    }
};
