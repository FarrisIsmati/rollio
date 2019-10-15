// DEPENDENCIES
const router = require('express').Router();
// MIDDLEWARE
const { regionRouteOps } = require('./middleware/db-operations');

// GET
// Get a region given an ID
router.get('/:id', regionRouteOps.getRegionId);
// Get a region given a name
router.get('/name/:name', regionRouteOps.getRegionName);

module.exports = router;
