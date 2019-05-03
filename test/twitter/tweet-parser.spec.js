// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const tweetParser = require('../../lib/twitter/parse/tweet-parser');

// DATA
const tweets = require('./data.json');

describe('Tweet Parser', () => {
  describe('Scan Address', () => {
    it('Expect tweet with text "Erlich Bachman" to not return a match', async () => {
      const result = await tweetParser.scanAddress(tweets.formatted1);
      expect(result.match).to.be.false;
    });
    it('Expect tweet with text "Meet us at Union Station" to return a match', async () => {
      const result = await tweetParser.scanAddress(tweets.formatted2);
      expect(result.location.address).to.equal('50 Massachusetts Ave NE, Washington, DC 20002');
      expect(result.match).to.be.true;
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
