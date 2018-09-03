//DEPENDENCIES
const mongoose              = require('mongoose');
const router                = require('express').Router();

//OPERATIONS
const { getVendors }      = require('../db/operations/vendorOperations');

//VENDORS
//Gets all vendors
router.get('/', (req, res) => getVendors(req.params.id).then(vendors => {res.status(200).json(vendors)}))

module.exports = router;
