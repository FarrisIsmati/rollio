// DEPENDENCIES
const router = require('express').Router();
// MIDDLEWARE
const { regionRouteOps } = require('./middleware/db-operations');

// GET
// Get all the regions; putting before getRegionId that it doesn't think 'all' is an :id
router.get('/all', regionRouteOps.getAllRegions);
// Get a region given an ID
router.get('/:id', regionRouteOps.getRegionId);
// Get a region given a name
router.get('/name/:name', regionRouteOps.getRegionName);

module.exports = router;
