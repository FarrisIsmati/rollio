//DEPENDENCIES
const mongoose            = require('../schemas/AllSchemas');

//SCHEMA
const Vendor              = mongoose.model('Vendor');

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
  //Gets a single vendor given a regionID and vendor twitterID
  getVendorByTwitterID: function(regionID, twitterID) {
    return Vendor.findOne({
      "regionID": regionID,
      "twitterID": twitterID
    })
    .then( vendor => vendor )
    .catch( err => err );
  },
  //Gets all vendors given a set of Queries
  getVendorsByQuery: function(params) {
    return Vendor.find(params)
    .then( vendors => vendors )
    .catch( err => err );
  },
  //Sets data to a field given a regionID, vendorID, field, and data
  updateVendorSet: function(params) {
    const { regionID, vendorID, field, data } = params;
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $set: { [field]: data }
    })
    .then( res => res )
    .catch( err => err );
  },
  //Pushes a payload to a field of type Array given a regionID, vendorID, field, and payload
  updateVendorPush: function(params) {
    const { regionID, vendorID, field, payload } = params;
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $push: { [field]: payload }
    })
    .then( res => res )
    .catch( err => err );
  },
  //Increments a vendors locationAccuracy by one given a regionID and vendorID
  updateLocationAccuracy: function(params) {
    const { regionID, vendorID, amount } = params;

    //Amount can only be 1 or -1
    if (amount === 1 || amount === -1) {
      return Vendor.update({
        "regionID": regionID,
        "_id": vendorID
      }, {
        $inc: { 'locationAccuracy': amount }
      })
      .then( res => res )
      .catch( err => err );
    } else {
      return Promise.reject(new Error('Amount must be either 1 or -1'));
    }
  },
  //Empties a vendors tweetsDaily collection given a regionID and vendorID
  emptyVendorTweets: function(regionID, vendorID) {
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $set: { 'tweetsDaily': [] }
    })
    .then( res => res )
    .catch( err => err );
  },
  //Increments a vendors consecutiveDaysInactive field by 1 given a regionID and vendorID
  incrementVendorConsecutiveDaysInactive: function(regionID, vendorID) {
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $inc: { 'consecutiveDaysInactive': 1 }
    })
    .then( res => res )
    .catch( err => err );
  }
}

//EXPORT
module.exports = vendorOperations;
