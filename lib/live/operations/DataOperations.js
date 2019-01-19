//DEPENDENCIES
const redisOps = require('../../db/redis/operations/redis-ops');
//OPERATIONS
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');



class DataOperations {
  constructor(regionName) {
    this.regionName = regionName;
  }

  async vendorAddressUpdate(payload) {
    if (payload.match) {
      if (payload.tweetID) {
        payload.location = {...payload.location, tweetID: payload.tweetID}
      }
      const region = await regionOps.getRegionByName(this.regionName);
      const vendor = await vendorOps.getVendorByTwitterID(region._id, payload.twitterID);

      await vendorOps.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'locationHistory',  payload: payload.location })
      await vendorOps.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: ['dailyActive', 'consecutiveDaysInactive'],  data: [true, -1] });

      if (!region.dailyActiveVendorIDs.length || !region.dailyActiveVendorIDs.some(id => id.equals(vendor._id))) {
        await regionOps.incrementRegionDailyActiveVendorIDs({regionName: this.regionName, vendorID: vendor._id})
      }

      await redisOps.resetVendorLocationAndComment();
    }
  }
}

module.exports = DataOperations;
