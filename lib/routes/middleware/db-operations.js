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

//Caching data happens on get requests in the middleware, clearing the cache happens in the operations in mongo folder
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
  collectionKey: 'region',
  getRegionId: async function(req, res) {
    const getRegionIdOp = async (req, res, cb = null) => {
      return await getRegion(req.params.id)
      .then(async regions => {
        if (cb !== null){
          await cb(regions);
        }
        return res.status(200).json(regions);
      })
      .catch(err => res.status(500).send(err))
    }

    const payload = {
      collectionKey: this.collectionKey,
      queryKey: `q::method::${req.method}::path::${req.path}`,
      ops: getRegionIdOp
    }
    return checkCache(req, res, payload);
  }
}

const vendorRouteOps = {
  collectionKey: 'vendor',
  getVendors: async (req, res) => {
    let result;

    const hasQS = Object.keys(req.query).length > 0;

    const getVendorsOp = async (req, res, cb = null) => {
      if (hasQS) {
        return await getVendorsByQuery({regionID: req.params.regionID, ...qs.parse(req.query)})
        .then(async vendors => {
          if (cb !== null){
            await cb(vendors);
          }
          return res.status(200).json(vendors);
        })
        .catch(err => res.status(500).send(err))
      } else {
        return await getVendors(req.params.regionID)
        .then(async vendors => {
          if (cb !== null){
            await cb(vendors);
          }
          return res.status(200).json(vendors);
        })
        .catch(err => res.status(500).send(err))
      }
    }

    const payload = {
      collectionKey: this.collectionKey,
      queryKey: hasQS ?
      `q::method::${req.method}::path::${req.path}::query::${JSON.stringify(req.query)}` :`q::method::${req.method}::path::${req.path}`,
      ops: getVendorsOp
    };

    return checkCache(req, res, payload);
  },
  getVendorById: (req, res) => {
    const getVendorByIdOp = async (req, res, cb = null) => {
      return await getVendor(req.params.regionID, req.params.vendorID)
      .then(async vendor => {
        if (cb !== null){
          await cb(vendor);
        }
        res.status(200).json(vendor)
      })
      .catch(err => res.status(500).send(err))
    }

    const payload = {
      collectionKey: this.collectionKey,
      queryKey: `q::method::${req.method}::path::${req.path}`,
      ops: getVendorByIdOp
    };
    console.log('getVendorById');
    console.log(payload.queryKey);
    checkCache(req, res, payload);
  },
  putRegionIdVendorIdLocationTypeLocationIDAccuracy: async (req, res) => {
    updateLocationAccuracy({regionID: req.params.regionID, vendorID: req.params.vendorID, type: req.body.type, locationID: req.body.locationID, amount: req.body.amount})
    .then(update => res.status(200).json(update))
    .catch(err => res.status(500).send(err))
  },

  putRegionIdVendorIdComments: async (req, res) => {
    updateVendorPush({regionID: req.params.regionID, vendorID: req.params.vendorID, field: req.body.field, payload: req.body.payload})
    .then(update => res.status(200).json(update))
    .catch(err => res.status(500).send(err))
  }
}

module.exports = { checkCache, regionRouteOps, vendorRouteOps }
