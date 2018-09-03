//DEPENDENCIES
const mongoose              = require('mongoose');
const router                = require('express').Router();

//OPERATIONS
const { getRegion }      = require('../db/operations/regionOperations');

//REGION
router.get('/:id', (req, res) => getRegion(req.params.id).then(region => res.status(200).json(region)))

module.exports = router;
