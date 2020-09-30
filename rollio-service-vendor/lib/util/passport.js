// DEPENDENCIES
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const { TWITTER_CONFIG } = require('../../config');
const logger = require('../log/index')('routes/util/passport');
const constants = require('./constants');
const { upsertTwitterUser, getExistingTwitterUser } = require('../db/mongo/operations/user-ops');

passport.use(new TwitterTokenStrategy({
    consumerKey: TWITTER_CONFIG.consumerKey,
    consumerSecret: TWITTER_CONFIG.consumerSecret,
    includeEmail: true,
    passReqToCallback: true
}, async function (req, token, tokenSecret, profile, done) {
    const { type } = req.params;
    const { action } = req.headers;

    if (action === constants.LOGIN) {
        // Login, Only lookup user
        try {
            const existingTwitterUser = await getExistingTwitterUser(profile.id)
                .catch(err => {
                    logger.error(err);
                    done(err, user);
                });
            
            // Success pass user
            if (existingTwitterUser.user) {
                done(existingTwitterUser.err, existingTwitterUser.user);
            }

            // Fail
            done(null, { status: constants.INACTIVE });
        } catch(err) {
            logger.error(err);
            done(err, { status: constants.INACTIVE });
        }
    } else if (action === constants.SIGNUP) {
        // Sign up, Create user, set pending status
        try {
            const upsertedTwitterUser = await upsertTwitterUser(token, tokenSecret, profile, type)
                .catch(err => {
                    logger.error(err);
                    done(err, user);
                });

            // Success pass user
            if (upsertedTwitterUser.user) {
                done(upsertedTwitterUser.err, upsertedTwitterUser.user);
            }

            // Fail
            done(null, { status: constants.INACTIVE });
        } catch(err) {
            logger.error(err);
            done(err, { status: constants.INACTIVE });
        }
    };
}));

module.exports = passport;
