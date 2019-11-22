/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('../mongoose/index');
const redisClient = require('../../../db/redis/index');
const logger = require('../../../log/index');

// SCHEMA
const Vendor = mongoose.model('Vendor');
const Tweet = mongoose.model('Tweet');
const Location = mongoose.model('Location');

module.exports = {
  // Gets all vendors given a regionID
  getVendors(regionID) {
    if (!arguments.length) {
      const err = new Error('Must include regionID argument');
      logger.error(err);
      return err;
    }

    return Vendor.find({
      regionID,
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
  getVendor(regionID, vendorID) {
    if (arguments.length !== 2) {
      const err = new Error('Must include a regionID and vendorID as arguments');
      logger.error(err);
      return err;
    }

    return Vendor.findOne({
      regionID,
      _id: vendorID,
    }).populate('tweetHistory')
      .populate('locationHistory')
      .populate('userLocationHistory')
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
    });
  },
  // Gets a single vendor given a regionID and vendor twitterID
  getVendorByTwitterID(regionID, twitterID) {
    if (arguments.length !== 2) {
      const err = new Error('Must include a regionID and twitterID as arguments');
      logger.error(err);
      return err;
    }

    return Vendor.findOne({
      regionID,
      twitterID,
    }).populate('tweetHistory')
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
    return Vendor.find(params)
      .populate('tweetHistory')
      .populate('locationHistory')
      .populate('userLocationHistory')
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
    });
  },
  // Sets data to a field given a regionID, vendorID, field, and data
  updateVendorSet(params) {
    const {
      regionID, vendorID, field, data,
    } = params;
    if (!regionID || !vendorID || !field || !data) {
      const err = new Error('Must include a regionID, vendorID, field, & data properties in params argument');
      logger.error(err);
      return err;
    }

    let obj = { [field]: data };
    // If you're updating multiple fields
    if (field.constructor === Array) {
      obj = {};
      for (let i = 0; i < field.length && i < data.length; i += 1) {
        obj[field[i]] = data[i];
      }
    }
    return Vendor.update({
      regionID,
      _id: vendorID,
    }, {
      $set: obj,
    })
      .then(async (res) => {
        await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
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
    if (!regionID || !vendorID || !field || !originalPayload) {
      const err = new Error('Must include a regionID, vendorID, field, & payload properties in params');
      logger.error(err);
      return err;
    }
    let payload = originalPayload;
    if (['tweetHistory', 'locationHistory', 'userLocationHistory'].includes(field)) {
        const createPayload = { ...originalPayload, vendorID };
        const newDocument = field === 'tweetHistory' ? await Tweet.create(createPayload) : await Location.create(createPayload);
        payload = newDocument._id;
    }
    return Vendor.update({
      regionID,
      _id: vendorID,
    }, {
      $push: { [field]: payload },
    })
      .then(async (res) => {
        await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
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

    if (!regionID || !vendorID || !field || !payload || position === undefined) {
      const err = new Error('Must include a regionID, vendorID, field, payload, & position properties in params');
      logger.error('Must include a regionID, vendorID, field, payload, & position properties in params');
      return err;
    }

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
        redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
        return res;
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
  },
  // Increments a vendors locationAccuracy by one given a regionID and vendorID
  updateLocationAccuracy(params) {
    const {
      regionID, vendorID, type, locationID, amount,
    } = params;
    if (!regionID || !vendorID || !type || !locationID || !amount) {
      const err = new Error('Must include a regionID, vendorID, type, locationID, & amount properties in params argument');
      logger.error(err);
      return err;
    }
    // Amount can only be 1 or -1
    if (amount === 1 || amount === -1) {
      return Location.updateOne({
        _id: locationID
      }, {
        $inc: { accuracy: amount },
      })
        .then(async (res) => {
          await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
          return res;
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
  incrementVendorConsecutiveDaysInactive(regionID, vendorID) {
    if (arguments.length !== 2) {
      const err = new Error('Must include regionID and vendorID');
      logger.error(err);
      return err;
    }

    return Vendor.update({
      regionID,
      _id: vendorID,
    }, {
      $inc: { consecutiveDaysInactive: 1 },
    })
      .then(async (res) => {
        await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${vendorID}`);
        return res;
      })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },
};
