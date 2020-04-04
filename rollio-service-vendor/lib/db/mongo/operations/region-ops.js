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
};
