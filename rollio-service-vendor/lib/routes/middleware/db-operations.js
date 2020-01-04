/* eslint-disable no-shadow */
/* eslint-disable no-console */
// DEPENDENCIES
const MongoQS = require('mongo-querystring');
const logger = require('../../log/index')('routes/middleware/db-operations');

const qs = new MongoQS(); // MongoQS takes req.query and converts it into MongoQuery
const { client: redisClient } = require('../../redis/index');

// OPERATIONS
const { getRegion, getRegionByName } = require('../../db/mongo/operations/region-ops');
const {
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPushPosition,
} = require('../../db/mongo/operations/vendor-ops');

const {
  findUserById,
} = require('../../db/mongo/operations/user-ops');

const {
  getAllTweets,
  getVendorsForFiltering,
} = require('../../db/mongo/operations/tweet-ops');

// Caching data happens on get requests in the middleware,
// clearing the cache happens in the operations in mongo folder
const checkCache = async (req, res, payload) => {
  const value = await redisClient.hgetAsync(payload.collectionKey, payload.queryKey)
    .catch(() => false);

  if (redisClient.connected) {
    if (value !== undefined && value !== null) {
      logger.info('Cache Hit');
      return res.status(200).json(JSON.parse(value));
    }
    return payload.ops(req, res, async (data) => {
      await redisClient.hsetAsync(payload.collectionKey, payload.queryKey, JSON.stringify(data));
    });
  }
  logger.error('Redis: No redisClient found');
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
  async getRegionName(req, res) {
    const getRegionNameOp = async (req, res, cb = null) => getRegionByName(req.params.name)
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
      ops: getRegionNameOp,
    };

    return checkCache(req, res, payload);
  },
};

// Utility function for vendorRouteOps
// Helper functions not placed in vendorRouteOps because every method is for a route
const vendorRouteOpsUtil = {
  // Returned a remapped vendor
  // Data is used to format the get all vendors calls
  formatData: (vendor) => {
    let location = null;

    // Check to see if the vendor was updated and has a location history
    // If so set the location
    if (vendor.dailyActive && vendor.locationHistory.length) {
      const vendorLocation = vendor.locationHistory[vendor.locationHistory.length - 1];
      location = {
        id: vendorLocation._id,
        coordinates: {
          lat: vendorLocation.coordinates[0],
          long: vendorLocation.coordinates[1],
        },
        address: vendorLocation.address,
        neighborhood: vendorLocation.neighborhood,
        municipality: vendorLocation.city,
        accuracy: vendorLocation.accuracy,
        matchMethod: vendorLocation.matchMethod,
        tweetID: vendorLocation.tweetID,
      };
    }

    return {
      id: vendor._id,
      name: vendor.name,
      description: vendor.description,
      categories: vendor.categories,
      consecutiveDaysInactive: vendor.consecutiveDaysInactive,
      profileImageLink: vendor.profileImageLink,
      location,
      selected: false,
      isActive: vendor.dailyActive,
      lastUpdated: vendor.updateDate,
    };
  },
};

const vendorRouteOps = {
  getVendors: async (req, res) => {
    const hasQS = Object.keys(req.query).length > 0;

    // Update the data to have only the vendor properties needed on the front end
    const formatArray = data => data.map(vendorRouteOpsUtil.formatData);

    if (hasQS) {
      // No caching of vendors by query
      return getVendorsByQuery({ regionID: req.params.regionID, ...qs.parse(req.query) })
        .then(async vendors => res.status(200).json(formatArray(vendors)))
        .catch(err => res.status(500).send(err));
    }

    const getVendorsOp = async (req, res, cb = null) => getVendors(req.params.regionID)
      .then(async (vendors) => {
        const formattedVendors = formatArray(vendors);

        if (cb !== null) {
          await cb(formattedVendors);
        }

        return res.status(200).json(formattedVendors);
      })
      .catch(err => res.status(500).send(err));

    const payload = {
      collectionKey: 'vendor',
      queryKey: `q::method::${req.method}::path::${req.path}`,
      ops: getVendorsOp,
    };

    return checkCache(req, res, payload, formatArray);
  },

  // Gets all vendors however formats the result as an object with the _id as the key
  getVendorsAsObject: async (req, res) => {
    const hasQS = Object.keys(req.query).length > 0;

    const formatObject = (data) => {
      const result = {};

      for (let i = 0; i < data.length; i += 1) {
        result[data[i]._id] = vendorRouteOpsUtil.formatData(data[i]);
      }

      return result;
    };

    if (hasQS) {
      // No caching of vendors by query
      return getVendorsByQuery({ regionID: req.params.regionID, ...qs.parse(req.query) })
        .then(async vendors => res.status(200).json(formatObject(vendors)))
        .catch(err => res.status(500).send(err));
    }

    const getVendorsOp = async (req, res, cb = null) => getVendors(req.params.regionID)
      .then(async (vendors) => {
        const formattedVendors = formatObject(vendors);

        if (cb !== null) {
          await cb(formattedVendors);
        }

        return res.status(200).json(formattedVendors);
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

    // If the comment body is empty clear out the rate limit cache
    // so posting an empty comment wont count towards your rate limit
    if (req.body.text === '') {
      try {
        await redisClient.sremAsync(`rl::method::${req.method}::path::${req.path}::regionID::${req.params.regionID}::vendorID::${req.params.vendorID}`, req.connection.remoteAddress);
        res.status(403).send('Comment body cannot be empty');
      } catch (err) {
        res.status(500).send(err);
      }
    }

    return updateVendorPushPosition({
      regionID: req.params.regionID,
      vendorID: req.params.vendorID,
      field: 'comments',
      payload: {
        name: req.body.name,
        text: req.body.text,
      },
      position: 0,
    })
      .then(update => res.status(200).json(update.comments[0]))
      .catch(err => res.status(500).send(err));
  },
};

const userRouteOps = {
  getUser: async (req, res) => {
    findUserById(req.user.id).then((user) => {
      if (user) {
        res.json({ user });
      } else {
        res.send(401, 'User Not Authenticated');
      }
    }).catch((err) => {
      console.error(err);
      res.send(401, 'User Not Authenticated');
    });
  },
};

const tweetRouteOps = {
  tweetSearch: async (req, res) => {
    // TODO: limit to not just any user, but only an admin!
    if (!req.user) {
      res.send(401, 'User Not Authenticated');
    }
    getAllTweets(req.query).then((tweets) => {
      res.json({ tweets });
    }).catch((err) => {
      console.error(err);
      res.send(401, 'Error fetching tweets');
    });
  },
  vendorsForFiltering: async (req, res) => {
    // TODO: limit to not just any user, but only an admin!
    if (!req.user) {
      res.send(401, 'User Not Authenticated');
    }
    getVendorsForFiltering(req.query).then((vendors) => {
      res.json({ vendors });
    }).catch((err) => {
      console.error(err);
      res.send(401, 'Error fetching vendors');
    });
  },
};

module.exports = {
  checkCache, regionRouteOps, vendorRouteOps, userRouteOps, tweetRouteOps,
};
