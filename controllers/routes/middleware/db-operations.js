//DEPENDENCIES
const mongoose              = require('mongoose');
const router                = require('express').Router();
const MongoQS               = require('mongo-querystring');
const qs                    = new MongoQS();   //MongoQS takes req.query and converts it into MongoQuery

//OPERATIONS
//REGION
const { getRegion }         = require('../../db/operations/regionOperations');
//VENDOR
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPush
}                            = require('../../db/operations/vendorOperations');

//REGION ROUTE MIDDLEWARE
const regionRouteOperations = {
  getRegionId: (req, res) => getRegion(req.params.id)
  .then(region => res.status(200).json(region))
}

//VENDOR ROUTE MIDDLEWARE
const vendorRouteOperations = {
  getRegionId: async (req, res) => {
      let result;
      //If there is a query string
      if ( Object.keys(req.query).length > 0 ) {
        result = await getVendorsByQuery({regionID: req.params.regionID, ...qs.parse(req.query)})
        .then(vendors => {res.status(200).json(vendors)})
      } else {
        result = await getVendors(req.params.regionID)
        .then(vendors => res.status(200).json(vendors))
      }
      return result;
    },

  getRegionVendorId: (req, res) => getVendor(req.params.regionID, req.params.vendorID)
  .then(vendor => res.status(200).json(vendor)),

  putRegionIdVendorIdLocationAccuracy: async (req, res) => updateLocationAccuracy({regionID: req.params.regionID, vendorID: req.params.vendorID, amount: req.body.amount})
  .then(update => res.status(200).json(update)),

  putRegionIdVendorIdComments: async (req, res) => updateVendorPush({regionID: req.params.regionID, vendorID: req.params.vendorID, field: req.body.field, payload: req.body.payload})
  .then(update => res.status(200).json(update))
}

module.exports = { regionRouteOperations, vendorRouteOperations }
