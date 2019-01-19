//DEPENDENCIES
const redisOps     = require('../../db/redis/redis-ops');

//OPERATIONS
const regionOps     = require('../../db/operations/region-ops');
const vendorOperations     = require('../../db/operations/vendorOperations');

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
      const vendor = await vendorOperations.getVendorByTwitterID(region._id, payload.twitterID);

      await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'locationHistory',  payload: payload.location })
      await vendorOperations.updateVendorSet({ regionID: region._id, vendorID: vendor._id, field: ['dailyActive', 'consecutiveDaysInactive'],  data: [true, -1] });

      if (!region.dailyActiveVendorIDs.length || !region.dailyActiveVendorIDs.some(id => id.equals(vendor._id))) {
        await regionOps.incrementRegionDailyActiveVendorIDs({regionName: this.regionName, vendorID: vendor._id})
      }

      await redisOps.resetVendorLocationAndComment();
    }
  }
}

module.exports = DataOperations;
