// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const tweetParser = require('../../../lib/twitter/parse/tweet-parser');

// DATA
const tweets = require('./test-data/data.json');

describe('Tweet Parser', () => {
  describe('Scan Address', () => {
    it('Expect tweet with text "Erlich Bachman" to not return a match', async () => {
      const result = await tweetParser.scanAddress(tweets.formatted1);
      expect(result.match).to.be.false;
    });

    // this test should pass whether or not you have the nlp service running;
    it('Expect tweet with text "Meet us at Union Station" to return a match', async () => {
      const result = await tweetParser.scanAddress(tweets.formatted2);
      const { match, location } = result;
      const { address, city, coordinates, neighborhood } = location;
      expect(address).to.include('50 Massachusetts Ave NE, Washington, DC 20002');
      expect(city).to.equal('washington');
      // nlp returns 'noma'; matchKnownLocation return 'union station'...is that a problem?
      expect(['noma', 'union station'].includes(neighborhood)).to.be.true;
      expect(Math.floor(coordinates[0])).to.equal(38);
      expect(Math.floor(coordinates[1])).to.equal(-78);
      expect(match).to.be.true;
    });
  });
  describe('Match Known Location', () => {
    it('Expect tweet with text "Find us at roslyn today." to return a match', async () => {
      const result = await tweetParser.matchKnownLocation(tweets.formatted4);
      expect(result.location.address).to.equal('Rosslyn, Virginia  22209');
      expect(result.match).to.be.true;
    });
  });
  describe('Match Phrase', () => {
    it('Expect tweet with text "Find us at roslyn tomorrow." not to return a match', () => {
      const result = tweetParser.matchPhrase(tweets.formatted3);
      expect(result.match).to.be.false;
    });
  });
});
