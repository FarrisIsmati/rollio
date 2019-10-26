const router = require('express').Router();
const { generateToken, sendToken, getTwitterUser, setRequestAuth, requestTwitterToken } = require('../util/token.utils');
const passport = require('passport');
const { SECRET } = require('../../config');
const expressJwt = require('express-jwt');
require('../util/passport')();
const { userRouteOps } = require('./middleware/db-operations');

router.post('/auth/twitter/reverse', requestTwitterToken);
router.post('/auth/twitter', getTwitterUser, passport.authenticate('twitter-token', {session: false}), setRequestAuth, generateToken, sendToken);
router.get('/auth/users', expressJwt({ secret: SECRET }), userRouteOps.getUser);

module.exports = router;
