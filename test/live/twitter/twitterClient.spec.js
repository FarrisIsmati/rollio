//DEPENDENCIES
const mongoose            = require('../../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const expect              = chai.expect;
const TwitterClient       = require('../../../controllers/live/twitter/TwitterClient');

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
    before(async function(done) {
      //SEED MOCK DATA INTO TEST DB
      // twitterClient.getUserIds('WASHINGTONDC');
      done();
    });

    it('Expect getUserIds to be a string', function(done) {
      done();
    });

    after(function(done) {
      //REMOVE DATA FROM TEST DB
    })
  });
  //
  // describe('streamClient', function() {
  //
  // });
});
