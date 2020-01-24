// DEPENDENCIES
const router = require('express').Router();
const expressJwt = require('express-jwt');
// MIDDLEWARE
const { vendorRouteOps, userRouteOps } = require('./middleware/db-operations');
const { routeLimitVendor } = require('./middleware/rate-limit');
const { JWT_SECRET } = require('../../config');
// GET
// All vendors or all vendors by query string
router.get('/:regionID', vendorRouteOps.getVendors);
// All vendors or all vendors by query string
router.get('/:regionID/object', vendorRouteOps.getVendorsAsObject);
// A vendor given an ID
router.get('/:regionID/:vendorID', vendorRouteOps.getVendorById);
// PUT
// Update a Vendor's locationAccuracy by amount (1 or -1)
router.put('/:regionID/:vendorID/locationaccuracy', routeLimitVendor, vendorRouteOps.putRegionIdVendorIdLocationTypeLocationIDAccuracy);
// Update push a comment to a Vendor
router.put('/:regionID/:vendorID/comments', vendorRouteOps.putRegionIdVendorIdComments);
router.put('/:regionID/:vendorID/update', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.passVendorToNext, vendorRouteOps.updateVendor);

// POST
router.post('/:regionID/new', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, vendorRouteOps.createVendor);

module.exports = router;
