const router = require('express').Router();
const { JWT_SECRET } = require('../../config');
const expressJwt = require('express-jwt');
const { tweetRouteOps } = require('./middleware/db-operations');

router.get('/all', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.tweetSearch);

module.exports = router;
