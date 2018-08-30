//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const expect              = chai.expect;

//SCHEMAS
const Region              = mongoose.model('Region');
const Vendor              = mongoose.model('Vendor');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

//TESTS
describe('Testing Seed file with the TEST DB', function() {
  before(function (done) {
    seed.runSeed().then(() => done());
  });

  describe('Region Collection', function() {
    describe('Washington DC', function() {
      let region;

      before(function(done) {
        Region.collection.findOne({ name: 'WASHINGTONDC'})
        .then(dc => {
          region = dc;
          done();
        })
      })

      it('should exist', function(done) {
        expect(region).to.exist;
        done();
      });

      it('should have region name WASHINGTONDC', function(done) {
        expect(region.name).to.equal('WASHINGTONDC');
        done();
      });

      it('should have timezone EST', function(done) {
        expect(region.timezone).to.equal('EST');
        done();
      });
    });
  });

  describe('Vendor Collection', function() {
    let vendor;

    describe('Yummies', function() {
      before(function(done) {
        Vendor.collection.findOne({ name: 'Yummies'})
        .then(yummies => {
          vendor = yummies;
          done();
        })
      })

      it('should exist', function(done) {
        expect(vendor).to.exist;
        done();
      })

      it('should have vendor name Yummies', function(done) {
        expect(vendor.name).to.equal('Yummies');
        done();
      });

      it('should have vendor menu', function(done) {
        expect(vendor.menu).to.exist;
        done();
      });

      it('should have vendor tweetsDaily', function(done) {
        expect(vendor.tweetsDaily).to.exist;
        expect(vendor.tweetsDaily).to.be.array();
        done();
      });

      it('should have vendor coordinatesHistory', function(done) {
        expect(vendor.coordinatesHistory).to.exist;
        expect(vendor.coordinatesHistory).to.be.array();
        done();
      });

      it('should have vendor categories', function(done) {
        expect(vendor.categories).to.exist;
        done();
      });
    })
  });

  after(function(done) {
    seed.emptyRegionsCollection()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
