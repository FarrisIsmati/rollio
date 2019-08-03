/* eslint-disable no-shadow */
/* eslint-disable no-console */
// DEPENDENCIES
const MongoQS = require('mongo-querystring');
const logger = require('../../log/index');

const qs = new MongoQS(); // MongoQS takes req.query and converts it into MongoQuery
const client = require('../../db/redis/index');
// OPERATIONS
const { getRegion } = require('../../db/mongo/operations/region-ops');
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPush,
} = require('../../db/mongo/operations/vendor-ops');

// Caching data happens on get requests in the middleware,
// clearing the cache happens in the operations in mongo folder
const checkCache = async (req, res, payload) => {
  const value = await client.hgetAsync(payload.collectionKey, payload.queryKey)
    .catch(() => false);

  if (client.connected) {
    if (value !== undefined && value !== null) {
      logger.info('Cache Hit');
      return res.status(200).json(JSON.parse(value));
    }
    return payload.ops(req, res, async (data) => {
      await client.hsetAsync(payload.collectionKey, payload.queryKey, JSON.stringify(data));
    });
  }
  logger.error('Redis: No client found');
  return payload.ops(req, res);
};

const regionRouteOps = {
  async getRegionId(req, res) {
    const getRegionIdOp = async (req, res, cb = null) => getRegion(req.params.id)
      .then(async (regions) => {
        if (cb !== null) {
          await cb(regions);
        }
        return res.status(200).json(regions);
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send(err);
      });

    const payload = {
      collectionKey: 'region',
      queryKey: `q::method::${req.method}::path::${req.path}`,
      ops: getRegionIdOp,
    };

    return checkCache(req, res, payload);
  },
};

const vendorRouteOps = {
  getVendors: async (req, res) => {
    const hasQS = Object.keys(req.query).length > 0;

    if (hasQS) {
      // No caching of vendors by query
      return getVendorsByQuery({ regionID: req.params.regionID, ...qs.parse(req.query) })
        .then(async vendors => res.status(200).json(vendors))
        .catch(err => res.status(500).send(err));
    }

    const getVendorsOp = async (req, res, cb = null) => getVendors(req.params.regionID)
      .then(async (vendors) => {
        if (cb !== null) {
          await cb(vendors);
        }
        return res.status(200).json(vendors);
      })
      .catch(err => res.status(500).send(err));

    const payload = {
      collectionKey: 'vendor',
      queryKey: `q::method::${req.method}::path::${req.path}`,
      ops: getVendorsOp,
    };
    return checkCache(req, res, payload);
  },
  getVendorById: (req, res) => {
    // eslint-disable-next-line max-len
    const getVendorByIdOp = async (req, res, cb = null) => getVendor(req.params.regionID, req.params.vendorID)
      .then(async (vendor) => {
        if (cb !== null) {
          await cb(vendor);
        }
        res.status(200).json(vendor);
      })
      .catch(err => res.status(500).send(err));

    const payload = {
      collectionKey: 'vendor',
      queryKey: `q::method::${req.method}::path::${req.path}`,
      ops: getVendorByIdOp,
    };
    return checkCache(req, res, payload);
  },
  putRegionIdVendorIdLocationTypeLocationIDAccuracy: async (req, res) => updateLocationAccuracy({
    regionID: req.params.regionID,
    vendorID: req.params.vendorID,
    type: req.body.type,
    locationID: req.body.locationID,
    amount: req.body.amount,
  })
    .then(update => res.status(200).json(update))
    .catch(err => res.status(500).send(err)),

  putRegionIdVendorIdComments: async (req, res) => {
    // If no name is given poster becomes Some Dude
    if (req.body.name === '' || req.body.name === undefined || req.body.name === null) {
      req.body.name = 'Some Dude';
    }

    return updateVendorPush({
      regionID: req.params.regionID,
      vendorID: req.params.vendorID,
      field: 'comments',
      payload: {
        name: req.body.name,
        text: req.body.text,
      },
    })
      .then(update => res.status(200).json(update))
      .catch(err => res.status(500).send(err));
  },
};

module.exports = { checkCache, regionRouteOps, vendorRouteOps };
