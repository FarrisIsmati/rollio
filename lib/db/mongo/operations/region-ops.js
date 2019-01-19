//DEPENDENCIES
const mongoose = require('../mongoose/index');
//SCHEMA
const Region = mongoose.model('Region');

module.exports = {
  getRegion: function(regionID) {
    return Region.findOne({
      "_id": regionID
    })
    .catch( err => err);
  },
  getRegionByName: function(name) {
    return Region.findOne({
      "name": name
    })
    .catch(err => err);
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
    .catch( err => err);
  }
};
