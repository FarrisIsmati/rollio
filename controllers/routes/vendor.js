//DEPENDENCIES
const mongoose                       = require('mongoose');
const router                         = require('express').Router();
const MongoQS                          = require('mongo-querystring');

//OPERATIONS
const {
  getVendors,
  getVendor,
  getVendorsByQuery
}                                    = require('../db/operations/vendorOperations');

//INSTANTIATE MONGO QUERY STRING
const qs = new MongoQS();

//VENDORS
//Gets all vendors
router.get('/:regionID', (req, res) => {
  //MongoQS takes req.query and converts it into MongoQuery
  const query = qs.parse(req.query);
  return Object.keys(req.query).length > 0 ?
  getVendorsByQuery({regionID: req.params.regionID, ...query}).then(vendors => {res.status(200).json(vendors)}) :
  getVendors(req.params.regionID).then(vendors => {res.status(200).json(vendors)});
});
router.get('/:regionID/:vendorID', (req, res) => getVendor(req.params.regionID, req.params.vendorID).then(vendor => {res.status(200).json(vendor)}));



module.exports = router;
