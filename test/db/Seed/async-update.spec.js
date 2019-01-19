//TESTS THE EXTERNAL API FUNCTIONS CALLED WHEN SEEDING IN DATA TO DB

//DEPENDENCIES
const mongoose            = require('../../../lib/db/schemas/AllSchemas');
const chai                = require('chai');
const expect              = chai.expect;

//SCHEMAS
const Region              = mongoose.model('Region');
const Vendor              = mongoose.model('Vendor');

//SEED
const seed                = require('../../../lib/db/seeds/developmentSeed');

//TESTS
describe('Asynchronous Vendor Update Operations', function() {
  describe('Yelp', function() {
    let regionID;

    before(async () => {
      await seed.seedRegions();
      regionID = await Region.findOne({name: 'WASHINGTONDC'}).then(res => res._id);
    });

    it('Expect asyncUpdateVendor to return yelp rating, and yelp price in payload', async function() {
      //PEPE FOODTRUCK ID
      const vendor = {name: "PEPE", yelpId: "xF5cphbxvMKNdMRNSWAzkQ"};
      const payload = await seed.asyncUpdateVendor({vendor, regionID, isTestEnv: false});
      expect(payload.yelpRating).to.exist;
      expect(payload.price).to.exist;
      expect(payload.yelpRating).to.equal(4);
      expect(payload.price).to.equal('$$');
    });

    after(done => { seed.emptyRegions().then(() => seed.emptyVendors()).then(() => done()) });
  });

});
