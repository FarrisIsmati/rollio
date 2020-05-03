const router = require('express').Router();
const expressJwt = require('express-jwt');
const { JWT_SECRET } = require('../../config');
const { tweetRouteOps, userRouteOps } = require('./middleware/db-operations');

// GET
router.get('/filter', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.tweetSearch);
router.get('/usetweet/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.getTweetWithPopulatedVendorAndLocations);
router.get('/vendors', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.vendorsForFiltering);

// PATCH
router.patch('/deletelocation/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.deleteLocation);

// POST
router.post('/createnewlocation/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, tweetRouteOps.createNewLocation);


module.exports = router;
