//DEPENDENCIES
const mongoose                       = require('mongoose');
const router                         = require('express').Router();
const MongoQS                        = require('mongo-querystring');

//OPERATIONS
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy
}                                    = require('../db/operations/vendorOperations');

//MongoQS takes req.query and converts it into MongoQuery
const qs = new MongoQS();

//GET
//All vendors or all vendors by query string
router.get('/:regionID', async (req, res) => {
    let result;
    //If there is a query string
    if ( Object.keys(req.query).length > 0 ) {
      result = await getVendorsByQuery({regionID: req.params.regionID, ...qs.parse(req.query)}).then(vendors => {res.status(200).json(vendors)})
    } else {
      result = await getVendors(req.params.regionID).then(vendors => res.status(200).json(vendors))
    }
    return result;
  }
);
//A vendor given an ID
router.get('/:regionID/:vendorID', (req, res) => getVendor(req.params.regionID, req.params.vendorID).then(vendor => res.status(200).json(vendor)));

//PUT
router.put('/:regionID/:vendorID/locationaccuracy', async (req, res) => updateLocationAccuracy(req.params.regionID, req.params.vendorID, req.body.amount).then(update => res.status(200).json(update)));

module.exports = router;
