const router = require('express').Router();
const { JWT_SECRET } = require('../../config');
const expressJwt = require('express-jwt');
const { tweetRouteOps } = require('./middleware/db-operations');

router.get('/filter', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.tweetSearch);
router.get('/vendors', expressJwt({ secret: JWT_SECRET }), tweetRouteOps.vendorsForFiltering);


module.exports = router;
