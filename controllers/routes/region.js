//DEPENDENCIES
const mongoose              = require('mongoose');
const router                = require('express').Router();

//OPERATIONS
const { getRegion }      = require('../db/operations/regionOperations');

//Region Route Middleware
const regionMw = {
  getRegionId: (req, res) => getRegion(req.params.id).then(region => res.status(200).json(region))
}

//GET
//Get a region given an ID
router.get('/:id', regionMw.getRegionId);

module.exports = router;
