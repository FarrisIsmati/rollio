// DEPENDENCIES
const mongoose = require('../mongoose/index');
const logger = require('../../../log/index')('mongo/operations/region-ops');

// SCHEMA
const Region = mongoose.model('Region');

module.exports = {
  getAllRegions() {
    return Region.find({});
  },
  getRegion(regionID) {
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
    return Region.findOne({
      name
    })
    .then((res) => {
      if (res) {
        return res;
      }

      logger.error('Region Ops: No region found');
      return null;
    })
    .catch((err) => {
      const errMsg = new Error(err);
      logger.error(errMsg);
      return err;
    });
  }
};
