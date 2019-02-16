//DEPENDENCIES
const chai = require('chai');
const expect = chai.expect;
const twitter = require('../../lib/twitter/index');

//DATA
const tweets = require('./data.json');

describe('Twitter', function() {
  describe('Connection', function() {
    let connection;
    before(async function() {
      connection = await twitter.streamClient();
    });
    it('Expect Twitter stream to be connected', async function() {
      expect(connection).to.be.an('object');
    });
    it('Expect Twitter Stream to have 2 listening events', function() {
      expect(connection).to.have.property('_eventsCount');
      expect(parseInt(connection._eventsCount)).to.be.equal(2);
    });
  });
  describe('Formatter', function() {
    it ('Expect formatter function to format raw tweet', async function() {
      const formatted = await twitter.tweetFormatter(tweets.raw1);
      expect(formatted).to.deep.equal(tweets.formatted1);
    });
  })
});
