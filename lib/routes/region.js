//DEPENDENCIES
const router = require('express').Router();
//MIDDLEWARE
const { regionRouteOps } = require('./middleware/db-operations');
const { cacheRegionRouteOps } = require('./middleware/cache');

//GET
//Get a region given an ID
router.get('/:id', cacheRegionRouteOps.getRegionId, regionRouteOps.getRegionId);

module.exports = router;
