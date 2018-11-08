//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const DataOperations      = require('../../controllers/live/operations/DataOperations');
const chai                = require('chai');
const expect              = chai.expect;

//OPERATIONS
const vendorOperations    = require('../../controllers/db/operations/vendorOperations');
const regionOperations    = require('../../controllers/db/operations/regionOperations');

//SCHEMAS
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

//LIVE DATA OPERATIONS
describe('DataOperations', function() {
  const twitterOutput = {
    id_str: '1059635881387192320',
    created_at: 'Tue Nov 06 02:37:35 +0000 2018',
    text: 'test tweet',
    user: {
      id: 1053649707493404700,
      id_str: '1053649707493404678',
      name: 'dcfoodtrucks',
      screen_name: 'dcfoodtrucks1'
    },
    geo: {
      coordinates: [38.88441446,-77.09551149]
    }
  }

  const twitterOutputGeo = {
    locationDate: 'Tue Nov 06 01:56:36 +0000 2018',
    address: '3114 10th St N, Arlington, VA 22201, USA',
    coordinates: [38.88441446,-77.09551149]
  }

  let dataOps = new DataOperations('WASHINGTONDC');

  describe('getGeolocation', function() {
    it('Expect getGeolocation to be a function', function(done) {
      expect(dataOps.getGeolocation).to.be.a('function');
      done();
    });

    it('Expect getGeolocation to return a geocoded address given the proper payload', async function() {
      const twOutGeo = Object.assign({...twitterOutput, geo: {
        coordinates: [...twitterOutputGeo.coordinates]
      }});
      const res = await dataOps.getGeolocation(twOutGeo);
      expect(res.address).to.be.equal(twitterOutputGeo.address);
    });
  })

  describe('vendorTweetUpdate', function() {
    let regionID;
    let vendor;

    before(async function(){
      await seed.runSeed().then(async () => {
        regionID = await Region.findOne({name: 'WASHINGTONDC'}).then(region => region._id);
        vendorID = await Vendor.findOne({regionID: regionID, twitterID: '1053649707493404678'}).then(vendor => vendor._id);
      });
    });

    it('Expect vendorTweetUpdate to return an object with properties', async function() {
      const res = await dataOps.vendorTweetUpdate(twitterOutput);
      expect(res).to.have.property('geolocation');
      expect(res).to.have.property('place');
    })

    it('Expect vendorTweetUpdate update vendor tweetsDaily', async function() {
      const tweetsDailyCount = await vendorOperations.getVendor(regionID, vendorID)
      .then(res => res.tweetsDaily.length);
      await dataOps.vendorTweetUpdate(twitterOutput);
      const tweetsDailyCountNew = await vendorOperations.getVendor(regionID, vendorID)
      .then(res => res.tweetsDaily.length);
      expect(tweetsDailyCountNew).to.be.equal(tweetsDailyCount + 1);
    })

    after(function(done) {
      seed.emptyRegions()
      .then(() => seed.emptyVendors())
      .then(() => done());
    });
  })
});
