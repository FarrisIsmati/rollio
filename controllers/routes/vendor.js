//DEPENDENCIES
const mongoose                       = require('mongoose');
const router                         = require('express').Router();
const MongoQS                        = require('mongo-querystring');

//OPERATIONS
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPush
}                                    = require('../db/operations/vendorOperations');

//MongoQS takes req.query and converts it into MongoQuery
const qs = new MongoQS();

//Vendor Route Middleware
const vendorMw = {
  getRegionId: async (req, res) => {
      let result;
      //If there is a query string
      if ( Object.keys(req.query).length > 0 ) {
        result = await getVendorsByQuery({regionID: req.params.regionID, ...qs.parse(req.query)}).then(vendors => {res.status(200).json(vendors)})
      } else {
        result = await getVendors(req.params.regionID).then(vendors => res.status(200).json(vendors))
      }
      return result;
    },
  getRegionVendorId: (req, res) => getVendor(req.params.regionID, req.params.vendorID).then(vendor => res.status(200).json(vendor)),
  putRegionIdVendorIdLocationAccuracy: async (req, res) => updateLocationAccuracy({regionID: req.params.regionID, vendorID: req.params.vendorID, amount: req.body.amount})
  .then(update => res.status(200).json(update)),
  putRegionIdVendorIdComments: async (req, res) => updateVendorPush({regionID: req.params.regionID, vendorID: req.params.vendorID, field: req.body.field, payload: req.body.payload}).then(update => res.status(200).json(update))
}

//GET
//All vendors or all vendors by query string
router.get('/:regionID', vendorMw.getRegionId);
//A vendor given an ID
router.get('/:regionID/:vendorID', vendorMw.getRegionVendorId);

//PUT
//Update a Vendor's locationAccuracy by amount (1 or -1)
router.put('/:regionID/:vendorID/locationaccuracy', vendorMw.putRegionIdVendorIdLocationAccuracy);
//Update push a comment to a Vendor
router.put('/:regionID/:vendorID/comments', vendorMw.putRegionIdVendorIdComments);

module.exports = router;
