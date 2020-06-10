/* eslint-disable no-shadow */
/* eslint-disable no-console */
// DEPENDENCIES
const moment = require('moment');
const MongoQS = require('mongo-querystring');
const logger = require('../../log/index')('routes/middleware/db-operations');
const config = require('../../../config');

// MESSAGING
const sendVendorTwitterIDs = require('../../messaging/send/send-vendor-twitterid');

const qs = new MongoQS(); // MongoQS takes req.query and converts it into MongoQuery
const { client: redisClient, pub } = require('../../redis/index');
// SOCKET
const { io } = require('../../sockets/index');


// OPERATIONS
const { getAllRegions, getRegion, getRegionByName } = require('../../db/mongo/operations/region-ops');
const {
  createVendor,
  getVendors,
  getVendor,
  getVendorsByQuery,
  updateLocationAccuracy,
  updateVendorPushPosition,
  updateVendorSet,
  createNonTweetLocation,
  getUnapprovedVendors,
} = require('../../db/mongo/operations/vendor-ops');

const {
  findUserById,
  patchUser,
} = require('../../db/mongo/operations/user-ops');

const {
  getAllTweets,
  getVendorsForFiltering,
  getTweetWithPopulatedVendorAndLocations,
  deleteTweetLocation,
  createTweetLocation,
  getTweet,
} = require('../../db/mongo/operations/tweet-ops');

const {
  getAllLocations,
} = require('../../db/mongo/operations/location-ops');

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
  async getAllRegions(req, res) {
    getAllRegions().then(regions => res.status(200).json({ regions }));
  },
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
    const locations = vendor.locationHistory.reduce((acc, location) => {
      const {
        _id: id,
        coordinates,
        address,
        neighborhood,
        city,
        accuracy,
        matchMethod,
        tweetId,
        startDate,
        endDate,
        truckNum,
        overridden,
      } = location;
      if (moment().isBefore(endDate)) {
        acc.push({
          // eslint-disable-next-line max-len
          id, coordinates, address, neighborhood, city, accuracy, matchMethod, tweetId, startDate, endDate, truckNum, overridden,
        });
      }
      return acc;
    }, []);

    const {
      _id: id, name, description, categories, consecutiveDaysInactive, profileImageLink, updateDate: lastUpdated, approved,
    } = vendor;
    return {
      id,
      name,
      description,
      categories,
      consecutiveDaysInactive,
      profileImageLink,
      locations,
      selected: false,
      lastUpdated,
      approved,
    };
  },
};

const publishUpdatedVendor = (vendor) => {
  const updatedVendor = vendorRouteOpsUtil.formatData(vendor);
  const messageType = 'UPDATED_VENDOR';
  try {
    // Send the tweetPayload to all subscribed instances
    pub.publish(config.REDIS_TWITTER_CHANNEL, JSON.stringify({ ...updatedVendor, messageType, serverID: config.SERVER_ID }));
    io.sockets.emit(messageType, updatedVendor);
  } catch (err) {
    logger.error(err);
  }
};

const vendorRouteOps = {
  getUnapprovedVendors: async (req, res) => getUnapprovedVendors().then(vendors => res.status(200).json({ vendors })),
  createLocation: async (req, res) => {
    const { type, vendorID } = req.user;
    const isAdmin = type === 'admin';
    const isVendor = type === 'vendor';
    const { vendorID: routeVendorID } = req.params;
    if (isAdmin || (isVendor && String(vendorID) === routeVendorID)) {
      return createNonTweetLocation(routeVendorID, req.body).then((location) => {
        res.status(200).json({ location });
      }).catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    }
    return res.status(403).send('You must be an admin or the vendor to create a new location');
  },
  updateVendor: async (req, res) => {
    const { type, twitterProvider = {} } = req.user;
    const isAdmin = type === 'admin';
    const isVendor = type === 'vendor';
    const { regionID, vendorID } = req.params;

    if (isAdmin || (isVendor && String(twitterProvider.id) === String(req.vendor.twitterID))) {
      const { field, data } = req.body;
      const vendorSetToApproved = Array.isArray(field) ? field.includes('approved') : field === 'approved';
      return updateVendorSet({
        regionID, vendorID, field, data,
      })
        .then(async (vendor) => {
          if (vendor.approved) {
            publishUpdatedVendor(vendor);
            if (vendorSetToApproved) {
              await sendVendorTwitterIDs();
            }
          }
          res.status(200).json({ vendor });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err);
        });
    }
    return res.status(403).send("You must be an admin or the vendor's owner user to update the vendor");
  },
  createVendor: async (req, res) => {
    const { type } = req.user;
    const isAdmin = type === 'admin';
    const isVendor = type === 'vendor';

    if (isAdmin || isVendor) {
      return createVendor(req.body, req.params.regionID, req.user)
        .then(async (vendor) => {
          // Need to tell twitter service to start listening for new vendors
          if (vendor.approved) {
            await sendVendorTwitterIDs();
            publishUpdatedVendor(vendor);
          }
          return res.status(200).json({ vendor });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err);
        });
    }
    return res.status(403).send('You must be an admin or vendor user to create a new vendor');
  },
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
    const getVendorByIdOp = async (req, res, cb = null) => getVendor(req.params.regionID, req.params.vendorID, req.query.tweetLimit ? parseInt(req.query.tweetLimit, 10) : 10)
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
  restrictToAdminOrVendor: async (req, res, next) => {
    const { type, vendorID } = req.user;
    const { tweetId } = req.params;
    if (type === 'admin') {
      next();
    } else if (!tweetId && type === 'vendor') {
      req.query.vendorID = vendorID;
      next();
    } else if (tweetId && type === 'vendor') {
      const tweet = await getTweet(tweetId);
      if (String(tweet.vendorID) === String(vendorID)) {
        next();
      } else {
        return res.status(403).send('You cannot access another vendors data');
      }
    } else {
      return res.status(403).send('You do not have adequate permissions');
    }
  },
  restrictToAdmins: async (req, res, next) => {
    if (req.user.type !== 'admin') {
      return res.status(403).send('You must be an admin');
    }
    next();
  },
  send403IfNoToken: (err, req, res, next) => {
    if (err) {
      if (err.name === 'UnauthorizedError') {
        return res.status(403).send('User must be logged in');
      }

      return res.status(403).send('Something went wrong');
    }
    next();
  },
  passUserToNext: async (req, res, next) => {
    const userID = req.user ? req.user.id : null;
    findUserById(userID, true).then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(401).send('User Not Authenticated');
      }
    }).catch(() => {
      logger.error('Authentication: User not authenticated, passUserToNext func()');
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Authentication: User not authenticated, passUserToNext func()'); }
      res.status(401).send('User Not Authenticated');
    });
  },
  passVendorToNext: async (req, res, next) => {
    const { vendorID, regionID } = req.params;
    const vendor = vendorID && regionID ? await getVendor(regionID, vendorID).catch(() => {
      logger.error('Vendor: Failed to look up vendor, passVendorToNext func()');
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Authentication: User not authenticated, passVendorToNext func()'); }
      res.status(500).send('error looking up vendor');
    }) : null;
    if (vendor) {
      req.vendor = vendor;
      next();
    } else {
      return res.status(404).send('Vendor not found');
    }
  },
  getUser: async (req, res) => {
    findUserById(req.user.id).then((user) => {
      if (user) {
        return res.status(200).json({ user });
      }
      return res.status(401).send('User Not Authenticated');
    }).catch(() => {
      logger.error('Authentication: User not authenticated, getUser func()');
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Authentication: User not authenticated, getUserFunc()'); }
      res.status(401).send('User Not Authenticated');
    });
  },
  updateUser: async (req, res) => {
    patchUser(req.user.id, req.body).then((user) => {
      if (user) {
        return res.status(200).json({ user });
      }

      return res.status(401).send('User Not Authenticated');
    }).catch(() => {
      logger.error('Authentication: User not authenticated, updateUser func()');
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Authentication: User not authenticated, updateUser func()'); }
      res.status(401).send('User Not Authenticated');
    });
  },
};

const tweetRouteOps = {
  tweetSearch: async (req, res) => {
    getAllTweets(req.query).then(tweets => res.status(200).json({ tweets }))
      .catch(() => {
        logger.error('Authentication: User not authenticated, tweetSearch func()');
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Twitter: Error fetching tweets, tweetSearch func()'); }
        res.status(401).send('Error fetching tweets');
      });
  },
  vendorsForFiltering: async (req, res) => {
    getVendorsForFiltering(req.query).then(vendors => res.status(200).json({ vendors }))
      .catch(() => {
        logger.error('Twitter: User not authenticated, vendorsForFiltering func()');
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Twitter: Error fetching tweets, vendorsForFiltering func()'); }
        res.status(401).send('Error fetching vendors');
      });
  },
  getTweetWithPopulatedVendorAndLocations: async (req, res) => {
    getTweetWithPopulatedVendorAndLocations(req.params.tweetId).then(tweet => res.status(200).json({ tweet }))
      .catch(() => {
        logger.error('Twitter: User not authenticated, getTweetWithPopulatedVendorAndLocations func()');
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Twitter: Error fetching tweets, getTweetWithPopulatedVendorAndLocations func()'); }
        res.status(401).send('Error fetching tweet');
      });
  },
  deleteLocation: async (req, res) => {
    deleteTweetLocation(req.params.tweetId, req.params.locationId).then(tweet => res.status(200).json({ tweet }))
      .catch(() => {
        logger.error('Twitter: User not authenticated, deleteTweetLocation func()');
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Twitter: Error fetching tweets, deleteTweetLocation func()'); }
        res.status(401).send('Error deleting location');
      });
  },
  createNewLocation: async (req, res) => {
    createTweetLocation(req.params.tweetId, req.body)
      .then(tweet => res.status(200).json({ tweet }))
      .catch((err) => {
        logger.error(err);
        console.error(err);
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Twitter: Error fetching tweets, createTweetLocation func()'); }
        res.status(401).send('Error creating new location');
      });
  },
};

const locationRouteOps = {
  locationSearch: async (req, res) => {
    getAllLocations(req.query).then(locations => res.status(200).json({ locations }))
      .catch(() => {
        logger.error('Authentication: User not authenticated, locationSearch func()');
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log('Twitter: Error fetching locations, locationSearch func()'); }
        res.status(401).send('Error fetching locations');
      });
  },
};


module.exports = {
  checkCache, regionRouteOps, vendorRouteOps, userRouteOps, tweetRouteOps, locationRouteOps,
};
