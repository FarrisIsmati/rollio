/* eslint-disable max-len */
/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('../mongoose/index');
const redis = require('../../../redis/index');
const { client: redisClient } = redis.redisClient;
const logger = require('../../../log/index')('mongo/operations/vendor-ops');
const sharedOps = require('./shared-ops');

// SCHEMA
const Vendor = mongoose.model('Vendor');
const Tweet = mongoose.model('Tweet');
const Location = mongoose.model('Location');
const User = mongoose.model('User');

module.exports = {
  // CREATE
  // Create a vendor
  async createVendor(vendorData, regionID, user) {
    const { type: userType, _id: userID } = user;

    const userIsAVendor = userType === 'vendor';
    const userIsAnAdmin = userType === 'admin';

    if (userIsAVendor) {
      vendorData.twitterID = user.twitterProvider.id;
      vendorData.approved = false;
    } else if (userIsAnAdmin) {
      // Automatically approve a vendor if created by an Admin
      vendorData.approved = true;
    }

    // Populate a vendors tweet history
    const newVendor = await Vendor.create({
      ...vendorData, 
      regionID,
      dailyActive: false, 
      consecutiveDaysInactive: 0, 
    }).then(async (res) => {
      if (redisClient && redisClient.connected) {
        await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${res._id}`);
      }
      logger.error('Redis: Unable to clear vendor cache, no redisClient found');
      return res;
    }).catch((err) => {
      const errMsg = new Error(err);
      logger.error(errMsg);
      throw err;
    });

    // If the user is a vendor update the user's vendorID to match the newVendor._id
    if (userIsAVendor && newVendor) {
      await User.findOneAndUpdate({ _id: userID }, { vendorID: newVendor._id });
    }

    return newVendor;
  },

  // Create a location
  async createNonTweetLocation(vendorID, locationData) {
    try {
      const newLocation = await sharedOps.createLocationAndCorrectConflicts({ ...locationData, vendorID, matchMethod: 'Vendor Input' });

      const { regionID, twitterID } = await Vendor.findOneAndUpdate(
        { _id: vendorID }, {
          $push: {
            locationHistory: {
              $each: [newLocation._id],
              $position: 0,
            },
          },
        },
      ).lean(true);

      await sharedOps.publishLocationUpdateAndClearCache({
        newLocations: [newLocation], vendorID, twitterID, regionID,
      });

      return newLocation;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  },

  // GET
  // Gets all vendors given a regionID
  getVendors(regionID) {
    return Vendor.find({
      regionID, approved: true,
    }).populate('tweetHistory')
      .populate('locationHistory')
      .populate('userLocationHistory')
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },

  // Gets a single vendor given a regionID and vendorID
  // tweetLimit optional argument controls how many tweets are returned
  // in the tweet history
  getVendor(regionID, vendorID, tweetLimit = 10) {
    return Vendor.findOne({
      regionID,
      _id: vendorID,
    }).populate({
      path: 'tweetHistory',
      options: {
        limit: tweetLimit,
        sort: {
          date: -1,
        },
      },
    })
      .populate('locationHistory')
      .populate('userLocationHistory')
      .then(res => res)
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },

  // Gets a single vendor given a regionID and vendor twitterID
  getVendorByTwitterID(regionID, twitterID, tweetLimit = 10) {
    return Vendor.findOne({
      regionID,
      twitterID,
    }).populate({
      path: 'tweetHistory',
      options: {
        limit: tweetLimit,
        sort: {
          date: -1,
        },
      },
    })
      .populate('locationHistory')
      .populate('userLocationHistory')
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },

  // Gets all vendors given a set of Queries
  getVendorsByQuery(params) {
    const { regionID } = params;

    if (!regionID) {
      const err = new Error('Must include a regionID property in params argument');
      logger.error(err);
      return err;
    }

    // Params may contain a query property
    // excludes approved by default, unless explicitly requested
    return Vendor.find({ approved: true, ...params })
      .populate({
        path: 'tweetHistory',
        options: {
          limit: 10,
          sort: {
            date: -1,
          },
        },
      })
      .populate('locationHistory')
      .populate('userLocationHistory')
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },

  // Get list of unapproved vendors
  async getUnapprovedVendors() {
    try {
      const unapprovedVendors = await Vendor.find({ approved: false });

      if (!unapprovedVendors.length) {
        return [];
      }

      const associatedUsers = await User
        .find({vendorID: { $in: unapprovedVendors.map(vendor => vendor._id) } })
        .select('+twitterProvider');

      const twitterLookUp = associatedUsers.reduce((acc, user) => {
        const { twitterProvider = {}, vendorID } = user;
        const { username, displayName } = twitterProvider;
        acc[String(vendorID)] = { username, displayName };
        return acc;
      }, {});

      // We look up and add on the twitter displayName so that we can look at their twitter account before approving
      return unapprovedVendors
        .map(vendor => ({ ...vendor.toObject(), twitterInfo: twitterLookUp[String(vendor._id)] }));
    } catch (err) {
      logger.error(err);
      throw err;
    }
  },

  // UPDATE
  // Sets data to a field given a regionID, vendorID, field, and data
  updateVendorSet(params) {
    const {
      regionID, vendorID, field, data,
    } = params;

    let obj = { [field]: data };

    // If you're updating multiple fields
    if (field.constructor === Array) {
      obj = {};
      for (let i = 0; i < field.length && i < data.length; i += 1) {
        obj[field[i]] = data[i];
      }
    }

    return Vendor.findOneAndUpdate({
      regionID,
      _id: vendorID,
    }, {
      $set: obj,
    }, { new: true }).populate('tweetHistory').populate('locationHistory').populate('userLocationHistory')
      .then(async (res) => {
        if (redisClient && redisClient.connected) {
          // TODO: this busts the cache for the individual vendor, but what about getVendorsAsObject ?
          await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
        }
        logger.error('Redis: Unable to clear vendor cache, no redisClient found');
        return res;
      })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },

  // Pushes a payload to a field of type Array given a regionID, vendorID, field, and payload
  async updateVendorPush(params) {
    const {
      regionID, vendorID, field, payload: originalPayload,
    } = params;

    let payload = originalPayload;

    if (['tweetHistory', 'userLocationHistory'].includes(field)) {
      const createPayload = { ...originalPayload, vendorID };
      const newDocument = field === 'tweetHistory' ? await Tweet.create(createPayload) : await Location.create(createPayload);
      payload = newDocument._id;
    }

    return Vendor.findOneAndUpdate({
        regionID,
        _id: vendorID,
      }, {
        $push: { [field]: payload },
        $set: { updateDate: Date.now() },
      }, { new: true })
      .then(async (res) => {
        if (redisClient && redisClient.connected) {
          await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
        }
        logger.error('Redis: Unable to clear vendor cache, no redisClient found');
        return res;
      })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },

  // Pushes a payload to a field of type Array given a regionID, vendorID, field, and payload
  updateVendorPushPosition(params) {
    const {
      regionID, vendorID, field, payload, position,
    } = params;

    return Vendor.findOneAndUpdate({
        regionID,
        _id: vendorID,
      }, {
        $push: {
          [field]: {
            $each: [payload],
            $position: position,
          },
        },
      }, {
        new: true,
      }).populate('tweetHistory')
        .populate('locationHistory')
        .populate('userLocationHistory')
        .then((res) => {
          if (redisClient && redisClient.connected) {
            redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
          }
          logger.error('Redis: Unable to clear vendor cache, no redisClient found');
          return res;
        })
        .catch((err) => {
          logger.error(err);
          return err;
        });
  },

  // Increments a vendors locationAccuracy by one given a regionID and vendorID
  async updateLocationAccuracy(params) {
    const {
      regionID, vendorID, locationID, amount,
    } = params;

    // Amount can only be 1 or -1
    if (amount === 1 || amount === -1) {
      return Location.findOneAndUpdate({
        _id: locationID,
      }, {
        $inc: { accuracy: amount },
      }, {
        new: true,
      })
        .then(async (res) => {
          if (redisClient && redisClient.connected) {
            await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
          }
          logger.error('Redis: Unable to clear vendor cache, no redisClient found');
          return {
            locationAccuracy: res.accuracy,
          };
        })
        .catch((err) => {
          const errMsg = new Error(err);
          logger.error(errMsg);
          return err;
        });
    }

    const errMsg = new Error('Amount must be either 1 or -1');
    logger.error(errMsg);
    return errMsg;
  },

  // Increments a vendors consecutiveDaysInactive field by 1 given a regionID and vendorID
  async incrementVendorConsecutiveDaysInactive(regionID, vendorID) {
    return Vendor.updateOne({
        regionID,
        _id: vendorID,
      }, {
        $inc: { consecutiveDaysInactive: 1 },
      })
      .then(async (res) => {
        if (redisClient && redisClient.connected) {
          await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
        }
        logger.error('Redis: Unable to clear vendor cache, no redisClient found');
        return res;
      })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },
  
  async updateNonTweetLocation(locationID, vendorID, locationData) {
    try {
      const updatedLocation = await sharedOps.editLocationAndCorrectConflicts(locationID, locationData);
      const { regionID, twitterID } = await Vendor.findOne({ _id: vendorID }).lean(true);
      await sharedOps.publishLocationUpdateAndClearCache({
        newLocations: [updatedLocation], vendorID, twitterID, regionID,
      });
      return updatedLocation;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
};
