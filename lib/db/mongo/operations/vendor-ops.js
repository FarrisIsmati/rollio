//DEPENDENCIES
const mongoose = require('../mongoose/index');
const redisClient = require('../../../db/redis/index');
//SCHEMA
const Vendor = mongoose.model('Vendor');

module.exports = {
  collectionKey: 'vendor',
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
    let obj = { [field]: data };
    //If you're updating multiple fields
    if (field.constructor === Array) {
      obj = {};
      for (let i = 0; i < field.length && i < data.length; i++) {
        obj[field[i]] = data[i];
      }
    }
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $set: obj
    })
    .then( async res => {
      await redisClient.hdelAsync(this.collectionKey, `q::method::GET::path::/${regionID}/${vendorID}`);
      return res;
    })
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
    .then( async res => {
      await redisClient.hdelAsync(this.collectionKey, `q::method::GET::path::/${regionID}/${vendorID}`);
      return res
    })
    .catch( err => err );
  },
  //Increments a vendors locationAccuracy by one given a regionID and vendorID
  updateLocationAccuracy: function(params) {
    const { regionID, vendorID, type, locationID, amount } = params;
    const locationIDQuery = type + "._id";
    const updateString = type + ".$.accuracy";
    //Amount can only be 1 or -1
    if (amount === 1 || amount === -1) {
      return Vendor.update({
        "regionID": regionID,
        "_id": vendorID,
        [locationIDQuery]: locationID
      }, {
        $inc: { [updateString]: amount }
      })
      .then( async res => {
        await redisClient.hdelAsync(this.collectionKey, `q::method::GET::path::/${regionID}/${vendorID}`);
        return res;
      })
      .catch( err => err );
    } else {
      return Promise.reject(new Error('Amount must be either 1 or -1'));
    }
  },
  //Increments a vendors consecutiveDaysInactive field by 1 given a regionID and vendorID
  incrementVendorConsecutiveDaysInactive : function(regionID, vendorID) {
    return Vendor.update({
      "regionID": regionID,
      "_id": vendorID
    }, {
      $inc: { 'consecutiveDaysInactive': 1 }
    })
    .then( async res => {
      await redisClient.hdelAsync(this.collectionKey, `q::method::GET::path::/${regionID}/${vendorID}`);
      return res;
    })
    .catch( err => err );
  }
};
