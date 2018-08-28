//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const expect              = chai.expect;

//OPERATIONS
const vendorOperations    = require('../../controllers/db/operations/vendorOperations');

//SCHEMAS
const Vendor              = mongoose.model('Vendor');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

describe('Vendor DB Operations', function() {
  let testVendorObj;

  //HERE IM RESEEDING DB FINDING A DB PIECE THEN CHECKING GET OPERATIONS
  //THINK IF THERES A BETTER WAY TO TEST YOUR OPERATIONS
  before(function(done){
    seed.runSeed().then(() => {
      Vendor.collection.findOne()
      .then(vendor => {
        testVendorObj = vendor;
        done();
      })
    });
  });

  it('should return a vendor given an objectID', function(done) {
    vendorOperations.getVendor(testVendorObj._id)
    .then(res => {
      expect(res._id).to.equal(testVendorObj._id);
      done();
    })
    .catch(err => console.log(err));
  });

});
