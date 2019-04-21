/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// DEPENDENCIES
const chai = require('chai');
const mongoose = require('../../../lib/db/mongo/mongoose/index');

const { expect } = chai;
// SCHEMAS
const Region = mongoose.model('Region');
const Vendor = mongoose.model('Vendor');
// SEED
const seed = require('../../../lib/db/mongo/seeds/dev-seed');

describe('Development Seed Operations', () => {
  const seedDB = (done) => { seed.runSeed().then(() => done()); };
  // eslint-disable-next-line max-len
  const emptyDB = (done) => { seed.emptyRegions().then(() => seed.emptyVendors()).then(() => done()); };

  describe('Empty Regions', () => {
    before(done => seedDB(done));

    it('Expect region collection to be empty', async () => {
      await seed.emptyRegions();
      const regionsAfter = await Region.find({});
      expect(regionsAfter.length).to.equal(0);
    });

    after(done => emptyDB(done));
  });

  describe('Empty Vendors', () => {
    before(done => seedDB(done));

    it('Expect vendor collection to be empty', async () => {
      await seed.emptyVendors();
      const vendorsAfter = await Vendor.find({});
      expect(vendorsAfter.length).to.equal(0);
    });

    after(done => emptyDB(done));
  });

  describe('Seed Regions', () => {
    it('Expect region collection length to be equal to 1', async () => {
      await seed.seedRegions();
      const regionsAfter = await Region.find({});
      expect(regionsAfter.length).to.equal(1);
    });

    after(done => emptyDB(done));
  });

  describe('Seed Vendors', () => {
    let regionID;

    before(async () => {
      await seed.seedRegions();
      regionID = await Region.findOne({ name: 'WASHINGTONDC' }).then(res => res._id);
    });

    it('Expect vendors in WASHINGTONDC to be length to be equal to 5', async () => {
      await seed.seedVendors('WASHINGTONDC');
      const vendorsAfter = await Vendor.find({ regionID });
      expect(vendorsAfter.length).to.equal(5);
    });

    after(done => emptyDB(done));
  });
});
