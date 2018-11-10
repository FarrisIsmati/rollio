//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const expect              = chai.expect;
const TwitterClient       = require('../../controllers/live/twitter/TwitterClient');
const seed                = require('../../controllers/db/seeds/developmentSeed');

//SCHEMAS
const Region              = mongoose.model('Region');
const Vendor              = mongoose.model('Vendor');

//TESTS
describe('Twitter Client', function() {
  const twitterClient = new TwitterClient({
    c_key: process.env.TWITTER_CONSUMER_KEY,
    c_secret: process.env.TWITTER_CONSUMER_SECRET,
    a_key: process.env.TWITTER_ACCESS_TOKEN,
    a_secret: process.env.TWITTER_ACCESS_SECRET,
    regionName: 'WASHINGTONDC'
  });

  describe('constructor', function() {
    it('Expect TwitterClient to be a function', function(done) {
      expect(TwitterClient).to.be.a('function');
      done();
    });

    it('Expect TwitterClient to have property client', function(done) {
      expect(twitterClient).to.have.property('client');
      expect(twitterClient.client).to.be.an('object');
      done();
    });

    it('Expect TwitterClient to have property regionName named WASHINGTONDC', function(done) {
      expect(twitterClient).to.have.property('regionName');
      expect(twitterClient.regionName).to.be.equal('WASHINGTONDC');
      done();
    });
  });

  describe('getUserIds', function() {
    let ids;
    let length;

    before(function(done){
      seed.runSeed().then(async () => {
        ids = await twitterClient.getUserIds('WASHINGTONDC');
        length = await Vendor.countDocuments();
        done();
      });
    });

    it('Expect getUserIds to be a string with a length as long as the collection count', function(done) {
      expect(ids).to.be.a('string');
      expect(ids.split(',').length).to.be.equal(length);
      done();
    });

    after(function(done) {
      seed.emptyRegions()
      .then(() => seed.emptyVendors())
      .then(() => done());
    });
  });

  describe('streamClient', function() {
    let streamRes;

    before(async function() {
      streamRes = await twitterClient.streamClient();
    })

    it('Expect streamClient to be an object', async function() {
      expect(streamRes).to.be.an('object');
    });

    it('Expect streamClient to have two connected streams', async function() {
      expect(streamRes._eventsCount).to.be.equal(2);
    });
  });
});
