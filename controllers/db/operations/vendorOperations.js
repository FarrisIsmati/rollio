//DEPENDENCIES
const mongoose            = require('../schemas/AllSchemas');

//SCHEMA
const Vendor              = mongoose.model('Vendor');

//DB VENDOR OPERATIONS
const vendorOperations = {
  getVendors: function(regionID) {
    return Vendor.find({
      "regionID": regionID
    })
    .then( vendors => vendors )
    .catch( err => err );
  },
  getVendor: function(regionID, vendorID) {
    return Vendor.findOne({
      "regionID": regionID,
      "_id": vendorID
    })
    .then( vendor => vendor )
    .catch( err => err );
  }
}

//EXPORT
module.exports = vendorOperations;
