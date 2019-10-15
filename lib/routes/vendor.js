// DEPENDENCIES
const router = require('express').Router();
// MIDDLEWARE
const { vendorRouteOps } = require('./middleware/db-operations');
const { routeLimitVendor } = require('./middleware/rate-limit');

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

module.exports = router;
