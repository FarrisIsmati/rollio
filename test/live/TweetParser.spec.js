//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const tweetParser         = require('../../controllers/live/twitter/TweetParser');
const chai                = require('chai');
const expect              = chai.expect;

//LIVE DATA OPERATIONS
describe('TweetParser', function() {
  const parseResult = tweet => {
    return {
      match: false,
      certainty: 'none',
      rgxMatch: '',
      matchMethod: '',
      tweet: tweet,
      location: {}
    }
  }
  // const expectedMatch = (match, tweet, ) => {
  //   return {
  //     match: true,
  //     certainty: 'partial',
  //     rgxMatch: 'Ballston',
  //     matchMethod: 'Regex known location match',
  //     tweet: 'Good morning Jammin family.  We are at L’Enfant Plaza today on 6th Street by 6th & Maryland.',
  //     location: {
  //       accuracy: 0,
  //       address: '10th St SW, Washington, DC 20024',
  //       city: 'dc',
  //       neighborhood: 'lenfant plaza',
  //       coordinates: [ 38.8842, -77.025811 ]
  //     }
  //   }
  // }

  describe('matchKnownLocation', function() {
    it('Expect matchKnownLocation to return an object with properties', function(done) {
      const matchKnownLocationResult = tweetParser.matchKnownLocation(parseResult('Eat in franklin sqr'));
      expect(matchKnownLocationResult).to.have.property('match');
      expect(matchKnownLocationResult).to.have.property('certainty');
      expect(matchKnownLocationResult).to.have.property('rgxMatch');
      expect(matchKnownLocationResult).to.have.property('location');
      expect(matchKnownLocationResult.location).to.have.property('address');
      expect(matchKnownLocationResult.location).to.have.property('coordinates');
      done();
    })

    it('Expect matchKnownLocation to match a tweet with Ballston in it', function(done) {
      const matchKnownLocationResult = tweetParser.matchKnownLocation(parseResult('We are in Ballston today'));
      expect(matchKnownLocationResult.match).to.be.true;
      expect(matchKnownLocationResult.rgxMatch).to.be.equal('Ballston');
      expect(matchKnownLocationResult.location.address).to.be.equal('Virginia Square Arlington, VA 22201');
      done();
    })

    it('Expect matchKnownLocation to match a tweet with Ballston misspelt in it', function(done) {
      const matchKnownLocationResult = tweetParser.matchKnownLocation(parseResult('We are in blstn today'));
      expect(matchKnownLocationResult.match).to.be.true;
      expect(matchKnownLocationResult.rgxMatch).to.be.equal('blstn');
      expect(matchKnownLocationResult.location.address).to.be.equal('Virginia Square Arlington, VA 22201');
      done();
    })

    it('Expect matchKnownLocation to match a tweet with noma in it', function(done) {
      const matchKnownLocationResult = tweetParser.matchKnownLocation(parseResult('noma for lunch'));
      expect(matchKnownLocationResult.match).to.be.true;
      expect(matchKnownLocationResult.rgxMatch).to.be.equal('noma');
      expect(matchKnownLocationResult.location.address).to.be.equal('H St NW, Washington, DC 20001');
      done();
    })

    it('Expect matchKnownLocation not to match a tweet with bellstown in it', function(done) {
      const matchKnownLocationResult = tweetParser.matchKnownLocation(parseResult('We are in bellstown'));
      expect(matchKnownLocationResult.match).to.be.false;
      expect(matchKnownLocationResult.location).to.be.deep.equal({});
      done();
    })
  })

  describe('matchPhrase', function() {
    it('Expect matchPhrase to return an object with properties', function(done) {
      const matchPhraseResult = tweetParser.matchPhrase(tweetParser.matchKnownLocation(parseResult('we are at noma for lunch')));
      expect(matchPhraseResult).to.have.property('match');
      expect(matchPhraseResult).to.have.property('certainty');
      expect(matchPhraseResult).to.have.property('rgxMatch');
      expect(matchPhraseResult).to.have.property('location');
      expect(matchPhraseResult.location).to.have.property('address');
      expect(matchPhraseResult.location).to.have.property('coordinates');
      done();
    })

    it('Expect matchPhrase to match a phrase with a location noma', function(done) {
      const matchPhraseResult = tweetParser.matchPhrase(tweetParser.matchKnownLocation(parseResult('we are at noma for lunch')));
      expect(matchPhraseResult.match).to.be.true;
      expect(matchPhraseResult.rgxMatch).to.be.equal('we are at noma');
      expect(matchPhraseResult.location.address).to.be.equal('H St NW, Washington, DC 20001');
      done();
    })

    it('Expect matchPhrase to match a postfixed phrase with a location', function(done) {
      const matchPhraseResult = tweetParser.matchPhrase(tweetParser.matchKnownLocation(parseResult('Eat at franklin square today!')));
      expect(matchPhraseResult.match).to.be.true;
      expect(matchPhraseResult.rgxMatch).to.be.equal('franklin square today');
      expect(matchPhraseResult.location.address).to.be.equal('Franklin Square Fountain, 950 13th St NW, Washington, DC 20005');
      done();
    })

    it('Expect matchPhrase to not match a negated phrase with a location', function(done) {
      const matchPhraseResult = tweetParser.matchPhrase(tweetParser.matchKnownLocation(parseResult('l\'enfant plaza tomorrow! #food')));
      console.log(matchPhraseResult)
      expect(matchPhraseResult.match).to.be.false;
      expect(matchPhraseResult.rgxMatch).to.be.equal('l\'enfant plaza tomorrow');
      expect(matchPhraseResult).to.not.have.property('location');
      done();
    })
  })

  describe('scanAddress', function() {
    it('Expect scanAddress to return an object with properties', function(done) {
    })
    it('Expect scanAddress with geolocated payload to return a result with that payloads data', function(done) {
    })
    it('Expect scanAddress to match ballston', function(done) {
    })
    it('Expect scanAddress to match noma', function(done) {
    })
    it('Expect scanAddress not to match a negated phrase', function(done) {
    })
    it('Expect scanAddress not to match a random phrase', function(done) {
    })
  })
})
