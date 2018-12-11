//DEPENDENCIES
const mongoose            = require('../schemas/AllSchemas');

//SCHEMA
const Region              = mongoose.model('Region');

//DB REGION OPERATIONS
const regionOperations = {
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
    let id = { "_id": regionID }
    if (!regionID) {
      id = { "name": regionName }
    }
    return Region.update(id, {
      $push: { 'dailyActiveVendorIDs': vendorID }
    })
  }
}

//EXPORT
module.exports = regionOperations;
