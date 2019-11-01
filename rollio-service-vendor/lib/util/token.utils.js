const { JWT_SECRET } = require('../../config');
const jwt = require('jsonwebtoken');
const request = require('request');
const { TWITTER_CONFIG } = require('../../config');

const createToken = function(auth) {
    return jwt.sign({
            id: auth.id
        }, JWT_SECRET,
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
    requestTwitterToken: async (req, res)  => {
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: {
                oauth_callback: TWITTER_CONFIG.callbackURL,
                consumer_key: TWITTER_CONFIG.consumerKey,
                consumer_secret: TWITTER_CONFIG.consumerSecret
            }
        }, function (err, r, body) {
            if (err) {
                console.error(err);
                return res.send(500, { message: err.message });
            }
            const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            res.send(JSON.parse(jsonStr));
        });
    },
    setRequestAuth: function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        return next();
    },
    generateToken: function(req, res, next) {
        req.token = createToken(req.auth);
        return next();
    },
    sendToken: function(req, res) {
        res.setHeader('x-auth-token', req.token);
        return res.status(200).send(JSON.stringify(req.user));
    },
    getTwitterUser: function(req, res, next) {
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
    }
};
