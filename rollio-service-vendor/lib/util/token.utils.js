// DEPENDENCIES
const jwt = require('jsonwebtoken');
const request = require('request');
const passport = require('./passport');
const constants = require('./constants');
const logger = require('../log/index')('routes/util/token.utils');
const { JWT_SECRET } = require('../../config');
const { TWITTER_CONFIG } = require('../../config');

const createToken = function (auth) {
  return jwt.sign({
    id: auth.id,
  }, 
  JWT_SECRET,
  {
    expiresIn: 60 * 120,
  });
};

module.exports = {  
  // 0
  // Get token from Twitter
  requestTwitterToken: async (req, res) => {
    try {
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: TWITTER_CONFIG.callbackURL,
          consumer_key: TWITTER_CONFIG.consumerKey,
          consumer_secret: TWITTER_CONFIG.consumerSecret,
        },
      }, (err, r, body) => {
        if (err) {
          logger.error(err);
          return res.status(403).send({ message: err.message });
        }
        const jsonStr = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
        res.status(403).send(JSON.parse(jsonStr));
      });
    } catch(error) {
      logger.error(error);
      return res.status(500).json({
        body: {},
        message: 'Internal server error',
        status: constants.INACTIVE
      })
    }
  },
  // 1
  // Get Twitter user
  getTwitterUser(req, res, next) {
    try {
      // Send request for user oauth twitter credentials
      request.post({
        url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
        oauth: {
          consumer_key: TWITTER_CONFIG.consumerKey,
          consumer_secret: TWITTER_CONFIG.consumerSecret,
          token: req.query.oauth_token,
        },
        form: { oauth_verifier: req.query.oauth_verifier },
      }, (err, r, body) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        // Format users oauth body
        const bodyString = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
        const parsedBody = JSON.parse(bodyString);

        req.body.oauth_token = parsedBody.oauth_token;
        req.body.oauth_token_secret = parsedBody.oauth_token_secret;
        req.body.user_id = parsedBody.user_id;

        next();
      });
    } catch(error) {
      logger.error(error);
      return res.status(500).json({
        status: constants.INACTIVE
      })
    }
  },
  // 2
  // Option to authenticate type, either a vendor or user, CURRENTLY ONLY AUTHENTICATING VENDORS
  passportTwitterAuthenticate(req, res, next) {
    passport.authenticate('twitter-token', { session: false, state: req.params.type })(req,res,next);
  },
  // 3
  // Set req authorization
  setRequestAuth(req, res, next) {
    try {
      // If user is inactive, or user is pending
      if (req.user.status === constants.INACTIVE || req.user.status === constants.REQUESTED) {
        return res.status(401).json(req.user);
      }

      req.auth = {
        id: req.user.id,
      };

      return next();
    } catch(error) {
      logger.error(error);
      return res.status(500).json({
        status: constants.INACTIVE
      })
    }
  },
  // 4
  // Create a token
  generateToken(req, res, next) {
    try {
      req.token = createToken(req.auth);
      return next();
    } catch(error) {
      logger.error(error);
      return res.status(500).json({
        status: constants.INACTIVE
      });
    }
  },
  // 5
  // Send user successful auth token
  sendToken(req, res) {
    try {
      res.setHeader('x-auth-token', req.token);
      return res.status(200).json(req.user);
    } catch(error) {
      logger.error(error);
      return res.status(500).json({
        status: constants.INACTIVE
      });
    }
  }
};
