const db = require('../db/mongo/mongoose');
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const User = db.model('User');
/*const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;*/
const { TWITTER_CONFIG } = require('../../config');

module.exports = function () {

    passport.use(new TwitterTokenStrategy({
            consumerKey: TWITTER_CONFIG.callbackURL,
            consumerSecret: TWITTER_CONFIG.consumerSecret,
            includeEmail: true
        },
        function (token, tokenSecret, profile, done) {
            console.log('upsert twitter user', profile);
            User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
                return done(err, user);
            });
        }));

    // passport.use(new FacebookTokenStrategy({
    //         clientID: config.facebookAuth.clientID,
    //         clientSecret: config.facebookAuth.clientSecret
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
    //             return done(err, user);
    //         });
    //     }));
    //
    // passport.use(new GoogleTokenStrategy({
    //         clientID: config.googleAuth.clientID,
    //         clientSecret: config.googleAuth.clientSecret
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
    //             return done(err, user);
    //         });
    //     }));
};
