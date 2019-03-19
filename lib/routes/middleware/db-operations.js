//DEPENDENCIES
const mongoose = require('mongoose');
const router = require('express').Router();
const MongoQS = require('mongo-querystring');
const qs = new MongoQS(); //MongoQS takes req.query and converts it into MongoQuery
const client = require('../../db/redis/index');

//OPERATIONS
const { getRegion } = require('../../db/mongo/operations/region-ops');
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPush
} = require('../../db/mongo/operations/vendor-ops');

const checkCache = async (req, res, payload) => {
  const value = await client.hgetAsync(payload.collectionKey, payload.queryKey)
  .catch(() => false);

  if (client.connected) {
    if (value !== undefined && value !== null) {
      console.log('FOUND IN CACHE');
      return res.status(200).json(JSON.parse(value));
    } else {
      console.log('NOT FOUND IN CACHE');
      return await payload.ops(req, res, async data => {
        await client.hsetAsync(payload.collectionKey, payload.queryKey, JSON.stringify(data));
      });
    }
  }
  console.log('NO REDIS CLIENT FOUND');
  return await payload.ops(req, res);
}

const regionRouteOps = {
  getRegionId : async function(req, res) {
    const getRegionIdOp = async (req, res, cb = null) => {
      return await getRegion(req.params.id)
      .then(async data => {
        if (cb !== null){
          await cb(data);
        }
        return res.status(200).json(data);
      })
      .catch(err => res.status(500).send(err))
    }

    const payload = {
      collectionKey: 'region',
      queryKey: `q::method::${req.method}::regionID::${req.path}`,
      ops: getRegionIdOp
    }
    return checkCache(req, res, payload);
  }
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
  getRegionIdVendorId: (req, res) => getVendor(req.params.regionID, req.params.vendorID)
  .then(vendor => res.status(200).json(vendor))
  .catch(err => res.status(500).send(err)),
  putRegionIdVendorIdLocationTypeLocationIDAccuracy: async (req, res) => updateLocationAccuracy({regionID: req.params.regionID, vendorID: req.params.vendorID, type: req.body.type, locationID: req.body.locationID, amount: req.body.amount})
  .then(update => res.status(200).json(update))
  .catch(err => res.status(500).send(err)),
  putRegionIdVendorIdComments: async (req, res) => updateVendorPush({regionID: req.params.regionID, vendorID: req.params.vendorID, field: req.body.field, payload: req.body.payload})
  .then(update => res.status(200).json(update))
  .catch(err => res.status(500).send(err))
}

module.exports = { checkCache, regionRouteOps, vendorRouteOps }
