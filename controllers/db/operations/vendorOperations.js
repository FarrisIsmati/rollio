//DEPENDENCIES
const mongoose            = require('../schemas/AllSchemas');

//SCHEMA
const Vendor              = mongoose.model('Vendor');

// !!!!!!!!!!!!!!!!!!!!!!!!!!!
//NEXT STEP REFACTOR FUNCTION PRAMERTIERS IF MORE THAN 2 TO TAKE IN AN OBJECT RATHER THAN MULTIPLE PARAMETERS
// !!!!!!!!!!!!!!!!!!!!!!!!!!!

//DB VENDOR OPERATIONS
const vendorOperations = {
  //Gets all vendors given a regionID
  getVendors: function(regionID) {
    return Vendor.find({
      "regionID": regionID
    })
    .then( vendors => vendors )
    .catch( err => err );
  },
  //Gets a single vendor given a regionID and vendorID
  getVendor: function(regionID, vendorID) {
    return Vendor.findOne({
      "regionID": regionID,
      "_id": vendorID
    })
    .then( vendor => vendor )
    .catch( err => err );
  },
  //Pushes a payload to a field of type Array given a regionID, vendorID, field, and payload
  updateVendorPush: async function(regionID, vendorID, field, payload) {
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $push: { [field]: payload }
    })
    .then( res => res )
    .catch( err => err );
  },
  //Empties a vendors tweetsDaily collection given a regionID and vendorID
  emptyVendorTweets: async function(regionID, vendorID, ) {
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $set: { 'tweetsDaily': [] }
    })
    .then( res => res )
    .catch( err => err );
  }
}

//EXPORT
module.exports = vendorOperations;
