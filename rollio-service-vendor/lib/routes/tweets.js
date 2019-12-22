const router = require('express').Router();
const { JWT_SECRET } = require('../../config');
const expressJwt = require('express-jwt');
const { tweetRouteOps } = require('./middleware/db-operations');

router.get('/filter', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.tweetSearch);
router.get('/usetweet/:tweetId', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.getTweetWithPopulatedVendor);
router.patch('/deletelocation/:tweetId', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.deleteLocation);
router.get('/vendors', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.vendorsForFiltering);


module.exports = router;
