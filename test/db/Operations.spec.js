//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const chaid               = require('chaid');
const assertArrays        = require('chai-arrays');
const expect              = chai.expect;

//OPERATIONS
const vendorOperations    = require('../../controllers/db/operations/vendorOperations');
const regionOperations    = require('../../controllers/db/operations/regionOperations');

//SCHEMAS
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

//CHAI ADD-ONS
chai.use(chaid);
chai.use(assertArrays);

describe('DB Operations', function() {
  describe('Get Vendor Operations', function() {
    let testVendorObj;
    let regionID;

    before(function(done){
      seed.runSeed().then(async () => {
        regionID = await Region.collection.findOne().then(region => region._id);
        testVendorObj = await Vendor.collection.findOne({"regionID": await regionID});
        done();
      });
    });

    it('should return all vendors given a regionID', function(done) {
      vendorOperations.getVendors(regionID)
      .then(res => {
        expect(res).to.be.array();
        expect(res[0].regionID).have.same.id(regionID);
        done();
      })
      .catch(err => console.log(err));
    });

    it('should return a vendor given a regionID and a objectID', function(done) {
      vendorOperations.getVendor(regionID, testVendorObj._id)
      .then(res => {
        expect(res).have.same.id(testVendorObj)
        done();
      })
      .catch(err => console.log(err));
    });

    after(function(done) {
      seed.emptyRegionsCollection()
      .then(() => seed.emptyVendors())
      .then(() => done());
    });
  });

  describe('Get Region Operations', function() {
    let regionID;

    before(function(done){
      seed.runSeed().then(async () => {
        regionID = await Region.collection.findOne().then(region => region._id);
        done();
      });
    });

    it('should return a region given a regionID', function(done) {
      regionOperations.getRegion(regionID)
      .then(res => {
        expect(res._id).have.same.id(regionID);
        done();
      })
      .catch(err => console.log(err));
    });

    after(function(done) {
      seed.emptyRegionsCollection()
      .then(() => seed.emptyVendors())
      .then(() => done());
    });
  });

  describe('Update Vendor Operations', function() {
    let testVendorObj;
    let regionID;

    before(function(done){
      seed.runSeed().then(async () => {
        regionID = await Region.collection.findOne().then(region => region._id);
        testVendorObj = await Vendor.collection.findOne({"regionID": await regionID});
        done();
      });
    });

    it('should testtesttest', function(done) {
      vendorOperations.updateVendorPush(regionID, testVendorObj._id, 'coordinatesHistory', {coordinatesDate: new Date(1/3/2020), coordinates:[1.123,4.523]} )
      .then(res => {
        console.log(res);
        expect(true).to.be.true;
        done();
      })
      .catch(err => console.log(err));
    });

    after(function(done) {
      seed.emptyRegionsCollection()
      .then(() => seed.emptyVendors())
      .then(() => done());
    });
  });
});
