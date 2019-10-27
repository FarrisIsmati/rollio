const db = require('../db/mongo/mongoose');
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const User = db.model('User');
const { TWITTER_CONFIG } = require('../../config');

passport.use(new TwitterTokenStrategy({
    consumerKey: TWITTER_CONFIG.consumerKey,
    consumerSecret: TWITTER_CONFIG.consumerSecret,
    includeEmail: true
},
function (token, tokenSecret, profile, done) {
    User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
    });
}));

module.exports = passport;
