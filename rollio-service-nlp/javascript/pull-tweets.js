const fs = require('fs');
const Twitter = require('twitter');
const config = require('./config');
const {twitterHandles} = require('./vendors');


const client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN,
    access_token_secret: config.TWITTER_ACCESS_SECRET,
});

// const params = { screen_name: 'AngryBurgerNOW', exclude_replies: true, trim_user: true, count: 200 };

const getVendorTweets = async screen_name => {
    let tweetCount = 200;
    let tweets = [];
    let max_id;
    while (tweetCount === 200) {
        if (tweets.length) {
            max_id = tweets[tweets.length -1]._id
        }
        const newTweets = await client.get('statuses/user_timeline', { screen_name, exclude_replies: true, trim_user: true, max_id });
        tweets = tweets.concat(newTweets.map(tweet => {
            const {created_at, text, geo, coordinates, id} = tweet;
            return {screen_name, created_at, text, geo, coordinates, id}
        }));
        tweetCount = newTweets.length;
    }
    return tweets;
};

twitterHandles.reduce(async (acc, handle) => {
    const existingTweets = await acc;
    const newTweets = await getVendorTweets(handle).catch(err => []);
    return existingTweets.concat(newTweets);
}, Promise.resolve([]))
    .then(res => {
        fs.appendFile('tweets.js', res, function (err) {
            if (err) throw err;
        });
        fs.appendFile('tweets.json', JSON.stringify(res), function (err) {
            if (err) throw err;
        });
    })
    .catch(err => {
        console.error(err);
    });

