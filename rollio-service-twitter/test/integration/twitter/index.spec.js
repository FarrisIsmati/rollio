// DEPENDENCIES
const twitter = require('../../../lib/twitter/index');
const tweetParser = require('../../../lib/twitter/parse/tweet-parser');
const chai = require('chai');
const { expect } = chai;

// DATA
const tweets = require('./test-data/tweets.json');
const sampleData = require('./test-data/tweet-data-sample');

describe('Twitter', () => {
  describe('Connection', () => {
    let connection;

    beforeEach(async () => {
      connection = await twitter.streamClient();
    });

    it('Expect Twitter stream to be connected', async () => {
      expect(connection).to.be.an('object');
    });

    it('Expect Twitter Stream to have 3 listening events stream.on(connected, data, error))', () => {
      expect(connection).to.have.property('_eventsCount');
      expect(parseInt(connection._eventsCount, 10)).to.be.equal(3);
    });
  });

  describe('Formatter', () => {
    it('Expect formatter function to format raw tweet', async () => {
      const formatted = await twitter.tweetFormatter(tweets.raw1);
      expect(formatted).to.deep.equal(tweets.formatted1);
    });
  });

  describe('Backoff', () => {
    it('Expect backoff to take 1 second long when passing one', () => {
      const time = twitter.backoff(1);
      expect(time).to.equal(1000);
      
      // backoff time starts at 6 and is multiplied by 2
      expect(twitter.backoffTime).to.equal(6);
    });
  });

  // Requires NLP server to be running
  describe(`Test general results across a set of ${sampleData.length} sample tweets`, async () => {
    let results;

    before(async () => {
      const resultsPromise = [];
  
      for (let i = 0; i < sampleData.length; i += 1) {
        const tweet = sampleData[i];
        resultsPromise.push(tweetParser.scanAddress(tweet));
      }
  
      results = await Promise.all(resultsPromise);
    });

    it(`expect there to be ${sampleData.length} results`, async () => {
      expect(results.length).to.be.equal(sampleData.length);
    });

    // Modify based on NLP changes
    it('expect there to be 14 matches', async () => {
      let matches = 0;

      for (let i = 0; i < results.length; i += 1) {
        const result = results[i];
        if (result.match) {
          matches += 1;
        }
      }
      expect(matches).to.be.equal(14);
    });
  });
});
