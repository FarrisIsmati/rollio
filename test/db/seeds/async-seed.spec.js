// DEPENDENCIES
const chai = require('chai');
const mongoose = require('../../../lib/db/mongo/mongoose/index');

const { expect } = chai;

// SCHEMAS
const Region = mongoose.model('Region');

// SEED
const seed = require('../../../lib/db/mongo/seeds/dev-seed');

describe('Asynchronous Vendor Update Operations', () => {
  describe('Yelp', () => {
    let regionID;

    before(async () => {
      await seed.seedRegions();
      regionID = await Region.findOne({ name: 'WASHINGTONDC' }).then(res => res._id);
    });

    it('Expect asyncUpdateVendor to return yelp rating, and yelp price in payload', async () => {
      // PEPE FOODTRUCK ID
      const vendor = { name: 'PEPE', yelpId: 'xF5cphbxvMKNdMRNSWAzkQ' };
      const payload = await seed.asyncUpdateVendor({ vendor, regionID, isTestEnv: false });
      expect(payload.yelpRating).to.exist;
      expect(payload.price).to.exist;
      expect(payload.yelpRating).to.equal(4);
      expect(payload.price).to.equal('$$');
    });

    after((done) => { seed.emptyRegions().then(() => seed.emptyVendors()).then(() => done()); });
  });
});
