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
describe('Testing DB to the Seed File', function() {
  before(function (done) {
    seed.runSeed().then(() => done());
  });

  describe('Region Collection', function() {
      it('should have region name WASHINGTONDC', function(done) {
        const washingtonName = "WASHINGTONDC";
        Region.collection.findOne({ name: washingtonName})
        .then(regionDC => {
          expect(regionDC).to.exist;
          expect(regionDC.name).to.equal(washingtonName);
          done();
        })
      });
  });
  
  after(function(done) {
    seed.emptyRegionsCollection()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
