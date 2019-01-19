//DEPENDENCIES
const mongoose                       = require('mongoose');
const router                         = require('express').Router();

//MIDDLEWARE
const { regionRouteOperations }      = require('./middleware/db-operations');

//GET
//Get a region given an ID
router.get('/:id', regionRouteOperations.getRegionId);

module.exports = router;
