/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('../mongoose/index');
const { client: redisClient } = require('../../../redis/index');
const logger = require('../../../log/index')('mongo/operations/region-ops');

// SCHEMA
const Region = mongoose.model('Region');

module.exports = {
  getAllRegions() {
    return Region.find({});
  },
  getRegion(regionID) {
    if (!regionID) {
      const err = new Error('Must include a regionID argument');
      logger.error(err);
      return err;
    }

    return Region.findOne({
      _id: regionID,
    })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },
  getRegionByName(name) {
    if (!name) {
      const err = new Error('Must include a name argument');
      logger.error(err);
      return err;
    }

    return Region.findOne({
      name,
    })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },
  // TODO: look at what calls this
  incrementRegionDailyActiveVendorIDs(payload) {
    const { regionID, regionName, vendorID } = payload;
    if ((!regionID && !regionName) || !vendorID) {
      const err = new Error('Must include a regionID or regionName & vendorID properties in params argument');
      logger.error(err);
      return err;
    }

    // If there is no id provided you can use a region name to find a region
    let id = { _id: regionID };
    if (!regionID) {
      id = { name: regionName };
    }
    return Region.updateOne(id, {
      $addToSet: { dailyActiveVendorIDs: vendorID },
    })
      .then(async (res) => {
        await redisClient.hdelAsync('region', `q::method::GET::path::/${regionID}`);
        return res;
      })
      .catch((err) => {
        const errMsg = new Error(err);
        logger.error(errMsg);
        return err;
      });
  },
};
