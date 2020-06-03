const router = require('express').Router();
const expressJwt = require('express-jwt');
const { JWT_SECRET } = require('../../config');
const { locationRouteOps, userRouteOps } = require('./middleware/db-operations');

// GET
router.get('/filter', expressJwt({ secret: JWT_SECRET }), userRouteOps.send403IfNoToken, userRouteOps.passUserToNext, userRouteOps.restrictToAdminOrVendor, locationRouteOps.locationSearch);

module.exports = router;
