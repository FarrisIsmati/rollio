//DEPENDENCIES
const mongoose                       = require('mongoose');
const router                         = require('express').Router();
const MongoQS                        = require('mongo-querystring');
const redisClient                    = require('../db/redis-config');

//MIDDLEWARE
const { vendorRouteOperations }      = require('./middleware/db-operations');
const { routeLimitVendor }           = require('./middleware/rate-limit');

//GET
//All vendors or all vendors by query string
router.get('/:regionID', vendorRouteOperations.getRegionId);
//A vendor given an ID
router.get('/:regionID/:vendorID', vendorRouteOperations.getRegionVendorId);

//PUT
//Update a Vendor's locationAccuracy by amount (1 or -1)
router.put('/:regionID/:vendorID/locationaccuracy', routeLimitVendor, vendorRouteOperations.putRegionIdVendorIdLocationTypeLocationIDAccuracy);
//Update push a comment to a Vendor
router.put('/:regionID/:vendorID/comments', routeLimitVendor, vendorRouteOperations.putRegionIdVendorIdComments);

module.exports = router;
