const router = require('express').Router();
const { generateToken, sendToken, getTwitterUser, setRequestAuth, requestTwitterToken } = require('../util/token.utils');
const { JWT_SECRET } = require('../../config');
const expressJwt = require('express-jwt');
// any time we want to use passport, just import it from here instead of using require('passport')
const passport = require('../util/passport');
const { userRouteOps } = require('./middleware/db-operations');

router.post('/auth/twitter/reverse', requestTwitterToken);
router.post('/auth/twitter/:type', getTwitterUser,
    function (req, res, next) {
        passport.authenticate('twitter-token', { session: false, state: req.params.type  })(req, res, next)
    },
    setRequestAuth, generateToken, sendToken);
router.get('/auth/users', expressJwt({ secret: JWT_SECRET }), userRouteOps.getUser);

module.exports = router;
