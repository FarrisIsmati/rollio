const db = require('../db/mongo/mongoose');
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const { TWITTER_CONFIG } = require('../../config');
const { upsertTwitterUser } = require('../db/mongo/operations/user-ops');


passport.use(new TwitterTokenStrategy({
    consumerKey: TWITTER_CONFIG.consumerKey,
    consumerSecret: TWITTER_CONFIG.consumerSecret,
    includeEmail: true
},
function (token, tokenSecret, profile, done) {
    upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
    });
}));

module.exports = passport;
