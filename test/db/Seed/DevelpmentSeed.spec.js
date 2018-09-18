//TEST DEVELOPMENT SEED OPERATIONS

//DEPENDENCIES
const mongoose            = require('../../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const expect              = chai.expect;

//SCHEMAS
const Region              = mongoose.model('Region');
const Vendor              = mongoose.model('Vendor');

//SEED
const seed                = require('../../../controllers/db/seeds/developmentSeed');

//TESTS
describe('Development Seed Operations', function() {
  const seedDB = done => { seed.runSeed().then(() => done()) };
  const emptyDB = done => { seed.emptyRegions().then(() => seed.emptyVendors()).then(() => done()) };

  describe('Empty Regions', function() {
    before(done => seedDB(done));

    it('Expect region collection to be empty', async function() {
      await seed.emptyRegions();
      const regionsAfter = await Region.find({});
      expect(regionsAfter.length).to.equal(0);
    });

    after(done => emptyDB(done));
  });

  describe('Empty Vendors', function() {
    before(done => seedDB(done));

    it('Expect vendor collection to be empty', async function() {
      await seed.emptyVendors();
      const vendorsAfter = await Vendor.find({});
      expect(vendorsAfter.length).to.equal(0);
    });

    after(done => emptyDB(done));
  });

  describe('Seed Regions', function() {
    it('Expect region collection length to be equal to 1', async function() {
      await seed.seedRegions();
      const regionsAfter = await Region.find({});
      expect(regionsAfter.length).to.equal(1);
    });

    after(done => emptyDB(done));
  });

  describe('Seed Vendors', function() {
    let regionID;

    before(async () => {
      await seed.seedRegions();
      regionID = await Region.collection.findOne({name: 'WASHINGTONDC'}).then(res => res._id);
    });

    it('Expect vendors in WASHINGTONDC to be length to be equal to 3', async function() {
      await seed.seedVendors('WASHINGTONDC');
      const vendorsAfter = await Vendor.find({regionID});
      expect(vendorsAfter.length).to.equal(3);
    });

    after(done => emptyDB(done));
  });

});
