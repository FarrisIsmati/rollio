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

      it('Expect region to exist', function(done) {
        expect(region).to.exist;
        done();
      });

      it('Expect region name to be \'WASHINGTONDC\'', function(done) {
        expect(region.name).to.equal('WASHINGTONDC');
        done();
      });

      it('Expect totalDailyActive to be 2', function(done) {
        expect(region.totalDailyActive).to.exist
        expect(region.totalDailyActive).to.equal(2);
        done();
      });

      it('Expect timezone to equal \'EST\'', function(done) {
        expect(region.timezone).to.exist;
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

      it('Expect Vendor Yummies to exist', function(done) {
        expect(vendor).to.exist;
        done();
      })

      it('Expect Vendor Yummies to have name \'Yummies\'', function(done) {
        expect(vendor.name).to.exist;
        expect(vendor.name).to.equal('Yummies');
        done();
      });

      it('Expect Vendor to have a menu', function(done) {
        expect(vendor.menu).to.exist;
        done();
      });

      it('Expect vendor to have tweets daily', function(done) {
        expect(vendor.tweetsDaily).to.exist;
        expect(vendor.tweetsDaily).to.be.array();
        done();
      });

      it('Expect vendor coordinatesHistory to be an array', function(done) {
        expect(vendor.coordinatesHistory).to.exist;
        expect(vendor.coordinatesHistory).to.be.array();
        done();
      });

      it('Expect vendor categories to exist', function(done) {
        expect(vendor.categories).to.exist;
        done();
      });
    })

    describe('Sammies', function() {
      before(function(done) {
        Vendor.collection.findOne({ name: 'Sammies'})
        .then(sammies => {
          vendor = sammies;
          done();
        })
      })

      it('should exist', function(done) {
        expect(vendor).to.exist;
        done();
      })

      it('should have vendor name Sammies', function(done) {
        expect(vendor.name).to.equal('Sammies');
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
