/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('../mongoose/index');
const redisClient = require('../../../db/redis/index');

// SCHEMA
const Region = mongoose.model('Region');

module.exports = {
  getRegion(regionID) {
    if (!regionID) {
      const err = new Error('Must include a regionID argument');
      console.error(err);
      return err;
    }

    return Region.findOne({
      _id: regionID,
    })
      .catch((err) => {
        const errMsg = new Error(err);
        console.error(errMsg);
        return err;
      });
  },
  getRegionByName(name) {
    if (!name) {
      const err = new Error('Must include a name argument');
      console.error(err);
      return err;
    }

    return Region.findOne({
      name,
    })
      .catch((err) => {
        const errMsg = new Error(err);
        console.error(errMsg);
        return err;
      });
  },
  incrementRegionDailyActiveVendorIDs(payload) {
    const { regionID, regionName, vendorID } = payload;
    if ((!regionID && !regionName) || !vendorID) {
      const err = new Error('Must include a regionID or regionName & vendorID properties in params argument');
      console.error(err);
      return err;
    }

    // If there is no id provided you can use a region name to find a region
    let id = { _id: regionID };
    if (!regionID) {
      id = { name: regionName };
    }
    return Region.update(id, {
      $addToSet: { dailyActiveVendorIDs: vendorID },
    })
      .then(async (res) => {
        await redisClient.hdelAsync('region', `q::method::GET::path::/${regionID}`);
        return res;
      })
      .catch((err) => {
        const errMsg = new Error(err);
        console.error(errMsg);
        return err;
      });
  },
};
