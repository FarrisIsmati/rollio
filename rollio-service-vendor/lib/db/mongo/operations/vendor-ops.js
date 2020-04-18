/* eslint-disable no-console */
// DEPENDENCIES
const moment = require('moment');
const mongoose = require('../mongoose/index');
const { client: redisClient } = require('../../../redis/index');
const logger = require('../../../log/index')('mongo/operations/vendor-ops');

// SCHEMA
const Vendor = mongoose.model('Vendor');
const Tweet = mongoose.model('Tweet');
const Location = mongoose.model('Location');
const User = mongoose.model('User');

module.exports = {
  async createLocationAndCorrectConflicts(locationData) {
    const {
      vendorID, startDate = new Date(), endDate = moment(new Date()).endOf('day').toDate(), truckNum = 1,
    } = locationData;
    const newStartDate = moment(startDate);
    const newEndDate = moment(endDate);
    const conflictingTruckLocations = await Location.find({
      vendorID, startDate: { $lte: endDate }, endDate: { $gte: startDate }, truckNum,
    });
    return Promise.all([...conflictingTruckLocations.map((existingLocation) => {
      const { _id, startDate: existingStartDate, endDate: existingEndDate } = existingLocation;
      const existingStartsBeforeNewStart = moment(existingStartDate).isSameOrBefore(newStartDate);
      const existingEndsBeforeNewEnd = moment(existingEndDate).isSameOrBefore(newEndDate);
      let update = {};
      // 1. if loc E start date is before loc N start date and loc E end date is before loc N end date,
      // set loc E end date to loc N start date
      if (existingStartsBeforeNewStart && existingEndsBeforeNewEnd) {
        update = { endDate: startDate };
        // 2. if local E start date is before loc N end date and loc E end date is after loc N end date,
        // set local E start date to loc N end date
      } if (!existingEndsBeforeNewEnd) {
        update = { startDate: endDate };
        // 3. if local E start date is after loc N's start date and local E end date is before loc N end date,
        // then nullify it (overridden = true);
      } else {
        update = { overridden: true };
      }
      return Location.findOneAndUpdate({ _id }, update, { returnNewDocument: true });
    }), Location.create(locationData)]);
  },
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
  async createVendor(vendorData, regionID, user) {
    const { type: userType, _id: userID } = user;
    const userIsAVendor = userType === 'vendor';
    const userIsAnAdmin = userType === 'admin';
    /* eslint-disable no-param-reassign */
    if (userIsAVendor) {
      vendorData.twitterID = user.twitterProvider.id;
      vendorData.approved = false;
    } else if (userIsAnAdmin) {
      vendorData.approved = true;
    }
    /* eslint-disable no-param-reassign */

    // theoretically, the client expects that we populate tweetHistory,
    // locationHistory, and userLocationHistory, but those all should be blank, so no need
    const newVendor = await Vendor.create({
      dailyActive: false, consecutiveDaysInactive: 0, ...vendorData, regionID,
    }).then(async (res) => {
      await redisClient.hdelAsync('vendor', `q::method::GET::path::/${regionID}/${res._id}`);
      return res;
    })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        throw err;
      });
    // if the user is a vendor, update the user's vendorID to match the newVendor._id
    if (userIsAVendor && newVendor) {
      await User.findOneAndUpdate({ _id: userID }, { vendorID: newVendor._id });
    }
    return newVendor;
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
      .then(res => res)
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
    return Vendor.findOneAndUpdate({
      regionID,
      _id: vendorID,
    }, {
      $set: obj,
    }, { new: true }).populate('tweetHistory').populate('locationHistory').populate('userLocationHistory')
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
    if (['tweetHistory', 'userLocationHistory'].includes(field)) {
      const createPayload = { ...originalPayload, vendorID };
      const newDocument = field === 'tweetHistory' ? await Tweet.create(createPayload) : await Location.create(createPayload);
      payload = newDocument._id;
    }
    return Vendor.updateOne({
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
        _id: locationID,
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

    return Vendor.updateOne({
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
