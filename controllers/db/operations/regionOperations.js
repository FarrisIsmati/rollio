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
  incrementRegionTotalDailyActive: function(regionID) {
    return Region.update({
      "_id": regionID
    }, {
      $inc: { 'totalDailyActive': 1 }
    })
  }
}

//EXPORT
module.exports = regionOperations;
