// DEPENDENCIES
const router = require('express').Router();
const expressJwt = require('express-jwt');

// MIDDLEWARE
const { vendorRouteOps, userRouteOps } = require('./middleware/db-operations');
const { routeLimitVendor } = require('./middleware/rate-limit');
const { JWT_SECRET } = require('../../config');

// GET
// All unapproved vendors
router.get('/unapproved-vendors', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdmins, vendorRouteOps.getUnapprovedVendors);
// All vendors or all vendors by query string as an array
router.get('/:regionID', vendorRouteOps.getVendors);
// All vendors or all vendors by query string as an object
router.get('/:regionID/object', vendorRouteOps.getVendorsAsObject);
// A vendor given an ID
router.get('/:regionID/:vendorID', vendorRouteOps.getVendorById);

// PUT
// Update a Vendor's locationAccuracy by amount (1 or -1)  routeLimitVendor,
router.put('/:regionID/:vendorID/locationaccuracy', routeLimitVendor, vendorRouteOps.putRegionIdVendorIdLocationTypeLocationIDAccuracy);
// Update push a comment to a Vendor
router.put('/:regionID/:vendorID/comments', routeLimitVendor, vendorRouteOps.putRegionIdVendorIdComments);
// Update a given vendor, authenticated route
router.put('/:regionID/:vendorID/update', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.passVendorToNext, vendorRouteOps.updateVendor);
router.patch('/:vendorID/editlocation/location/:locationID', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, vendorRouteOps.editLocation);


// POST
// Create a new vendor, authenticated route
router.post('/:regionID/new', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, vendorRouteOps.createVendor);
router.post('/:vendorID/newlocation', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, vendorRouteOps.createLocation);

module.exports = router;
