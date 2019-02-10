//DEPENDENCIES
const chai = require('chai');
const expect = chai.expect;
const tweetParser = require('../../lib/twitter/parse/tweet-parser');

//DATA
const tweets = require('./data.json');

describe('Tweet Parser', function() {
  describe('Scan Address', function() {
    it('Expect tweet with text "Erlich Bachman" to not return a match', function() {
      const result = tweetParser.scanAddress(tweets.formatted1);
      expect(result.match).to.be.false;
    });
    it('Expect tweet with text "Meet us at Union Station" to return a match', function() {
      const result = tweetParser.scanAddress(tweets.formatted2);
      expect(result.location.address).to.equal('50 Massachusetts Ave NE, Washington, DC 20002');
      expect(result.match).to.be.true;
    });
  });
});
