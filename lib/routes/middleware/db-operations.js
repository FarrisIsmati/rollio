//DEPENDENCIES
const mongoose = require('mongoose');
const router = require('express').Router();
const MongoQS = require('mongo-querystring');
const qs = new MongoQS(); //MongoQS takes req.query and converts it into MongoQuery
//OPERATIONS
const { getRegion } = require('../../db/mongo/operations/region-ops');
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPush
} = require('../../db/mongo/operations/vendor-ops');

const regionRouteOps = {
  getRegionId : (req, res) => getRegion(req.params.id)
  .then(region => res.status(200).json(region))
  .catch(err => res.status(500).send(err))
}
const vendorRouteOps = {
  getRegionId : async (req, res) => {
    let result;
    //If there is a query string
    if (Object.keys(req.query).length > 0) {
      result = await getVendorsByQuery({regionID: req.params.regionID, ...qs.parse(req.query)})
      .then(vendors => {res.status(200).json(vendors)})
      .catch(err => res.status(500).send(err));
    } else {
      result = await getVendors(req.params.regionID)
      .then(vendors => res.status(200).json(vendors))
      .catch(err => res.status(500).send(err));
    }
    return result;
  },
  getRegionVendorId: (req, res) => getVendor(req.params.regionID, req.params.vendorID)
  .then(vendor => res.status(200).json(vendor))
  .catch(err => res.status(500).send(err)),
  putRegionIdVendorIdLocationTypeLocationIDAccuracy: async (req, res) => updateLocationAccuracy({regionID: req.params.regionID, vendorID: req.params.vendorID, type: req.body.type, locationID: req.body.locationID, amount: req.body.amount})
  .then(update => res.status(200).json(update))
  .catch(err => res.status(500).send(err)),
  putRegionIdVendorIdComments: async (req, res) => updateVendorPush({regionID: req.params.regionID, vendorID: req.params.vendorID, field: req.body.field, payload: req.body.payload})
  .then(update => res.status(200).json(update))
  .catch(err => res.status(500).send(err))
}

module.exports = { regionRouteOps, vendorRouteOps }
