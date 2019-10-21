const router = require('express').Router();
const { generateToken, sendToken } = require('../util/token.utils');
const passport = require('passport');
const {TWITTER_CONFIG} = require('../../config');
const request = require('request');
require('../util/passport')();

router.route('/auth/twitter/reverse')
    .post(function(req, res) {
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: {
                oauth_callback: TWITTER_CONFIG.callbackURL,
                consumer_key: TWITTER_CONFIG.consumerKey,
                consumer_secret: TWITTER_CONFIG.consumerSecret
            }
        }, function (err, r, body) {
            if (err) {
                return res.send(500, { message: e.message });
            }
            const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            res.send(JSON.parse(jsonStr));
        });
    });

router.route('/auth/twitter')
    .post((req, res, next) => {
        request.post({
            url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
            oauth: {
                consumer_key: TWITTER_CONFIG.consumerKey,
                consumer_secret: TWITTER_CONFIG.consumerSecret,
                token: req.query.oauth_token
            },
            form: { oauth_verifier: req.query.oauth_verifier }
        }, function (err, r, body) {
            if (err) {
                return res.send(500, { message: err.message });
            }

            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            const parsedBody = JSON.parse(bodyString);
            req.body['oauth_token'] = parsedBody.oauth_token;
            req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;
            next();
        });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        return next();
    }, generateToken, sendToken);

// router.route('/auth/facebook')
//     .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
//         if (!req.user) {
//             return res.send(401, 'User Not Authenticated');
//         }
//         req.auth = {
//             id: req.user.id
//         };
//
//         next();
//     }, generateToken, sendToken);

// router.route('/auth/google')
//     .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
//         if (!req.user) {
//             return res.send(401, 'User Not Authenticated');
//         }
//         req.auth = {
//             id: req.user.id
//         };
//
//         next();
//     }, generateToken, sendToken);

module.exports = router;
