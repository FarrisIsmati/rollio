// DEPENDENCIES
const router = require('express').Router();
const { generateToken, sendToken, getTwitterUser, passportTwitterAuthenticate, setRequestAuth, requestTwitterToken } = require('../util/token.utils');
const expressJwt = require('express-jwt');
const { JWT_SECRET } = require('../../config');

// MIDDLEWARE
// any time we want to use passport, just import it from here instead of using require('passport')
const { userRouteOps } = require('./middleware/db-operations');

// POST
router.post('/auth/twitter/reverse', requestTwitterToken);
router.post('/auth/twitter/:type', 
    getTwitterUser,
    passportTwitterAuthenticate,
    setRequestAuth,
    generateToken,
    sendToken
);
router.get('/auth/users', expressJwt({ secret: JWT_SECRET }), userRouteOps.getUser);
router.post('/auth/users', expressJwt({ secret: JWT_SECRET }), userRouteOps.updateUser);


module.exports = router;
