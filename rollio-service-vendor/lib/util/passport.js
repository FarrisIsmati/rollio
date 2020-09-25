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

    // Login Workflow vs Signup Workflow
    if (action === constants.LOGIN) {
        const {user, err} =  await getExistingTwitterUser(profile.id)
            .catch(err => {
                logger.error(err);
            });
    } else if (action === constants.SIGNUP) {
        const {user, err} = await upsertTwitterUser(token, tokenSecret, profile, type)
            .catch(err => {
                logger.error(err);
            });
        
    } else {
        console.log("BREAK");
    }

    // Check if user has been approved
        // Yes
            // Return token stuff
        // No 
            // Send response that will state so
        // Pending
            // Send response that will state so
            done(err, user);

}));

module.exports = passport;

// Think workflow on login vs signup