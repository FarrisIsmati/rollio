const router = require('express').Router();
const expressJwt = require('express-jwt');
const { JWT_SECRET } = require('../../config');
const { tweetRouteOps, userRouteOps } = require('./middleware/db-operations');

router.get('/filter', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.tweetSearch);
router.get('/usetweet/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.getTweetWithPopulatedVendorAndLocation);
router.get('/vendors', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.vendorsForFiltering);
router.patch('/deletelocation/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.deleteLocation);
router.post('/createnewlocation/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.createNewLocation);


module.exports = router;
