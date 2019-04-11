//DEPENDENCIES
const mongoose = require('../mongoose/index');
const redisClient = require('../../../db/redis/index');
//SCHEMA
const Region = mongoose.model('Region');

module.exports = {
  getRegion: function(regionID) {
    return Region.findOne({
      "_id": regionID
    })
    .catch( err => {
      const errMsg = new Error(err);
      console.error(errMsg);
      return err;
    });
  },
  getRegionByName: function(name) {
    return Region.findOne({
      "name": name
    })
    .catch(err => {
      const errMsg = new Error(err);
      console.error(errMsg);
      return err;
    });
  },
  incrementRegionDailyActiveVendorIDs: function(payload) {
    const { regionID, regionName, vendorID } = payload;
    //If there is no id provided you can use a region name to find a region
    let id = { "_id": regionID }
    if (!regionID) {
      id = { "name": regionName }
    }
    return Region.update(id, {
      $push: { 'dailyActiveVendorIDs': vendorID }
    })
    .then(async res => {
      await redisClient.hdelAsync('region', `q::method::GET::path::/${regionID}`);
      return res;
    })
    .catch( err => {
      const errMsg = new Error(err);
      console.error(errMsg);
      return err;
    });
  }
};
