// DEPENDENCIES
const router = require('express').Router();
// MIDDLEWARE
const { regionRouteOps } = require('./middleware/db-operations');

// GET
// Get a region given an ID
router.get('/:id', regionRouteOps.getRegionId);

module.exports = router;
