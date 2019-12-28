// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const twitter = require('../../lib/twitter/index');

// DATA
const tweets = require('./data.json');
const sampleData = require('../../lib/twitter/data/tweet-data-sample');

describe('Twitter', () => {
  describe('Connection', () => {
    let connection;
    beforeEach(async () => {
      connection = await twitter.streamClient();
    });
    it('Expect Twitter stream to be connected', async () => {
      expect(connection).to.be.an('object');
    });
    it('Expect Twitter Stream to have 3 listening events (stream.on(connected, data, error))', () => {
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
  // describe(`Test general results across a set of ${sampleData.length} sample tweets`, async () => {
  //   let results;

  //   before(async () => {
  //     results = await twitter.test();
  //   });

  //   it(`expect there to be ${sampleData.length} results`, async () => {
  //     expect(results.length).to.be.equal(sampleData.length);
  //   });

  //   it('expect there to be 11 matches', async () => {
  //     let matches = 0;
  //     for (let i = 0; i < results.length; i += 1) {
  //       const result = results[i];
  //       if (result.match) {
  //         matches += 1;
  //       }
  //     }
  //     expect(matches).to.be.equal(11);
  //   });
  // });
});
