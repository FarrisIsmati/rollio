const router = require('express').Router();
const expressJwt = require('express-jwt');
const { JWT_SECRET } = require('../../config');
const { tweetRouteOps, userRouteOps } = require('./middleware/db-operations');

// GET
router.get('/filter', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, tweetRouteOps.tweetSearch);
router.get('/vendors', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, tweetRouteOps.vendorsForFiltering);
router.get('/usetweet/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, tweetRouteOps.getTweetWithPopulatedVendorAndLocations);

// PATCH
router.patch('/deletelocation/:tweetId/:locationId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, tweetRouteOps.deleteLocation);
router.patch('/editlocation/:tweetId/:locationId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, tweetRouteOps.editLocation);

// POST
router.post('/createnewlocation/:tweetId', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, tweetRouteOps.createNewLocation);


module.exports = router;
