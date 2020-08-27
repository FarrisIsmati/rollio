// DEPENDENCIES
const chai = require('chai');
const twitter = require('../../../lib/twitter/index');
const locationOps = require('../../../lib/bin/location-ops');
const sinon = require('sinon');

const { expect } = chai;

describe('Twitter', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects tweetFormatter to return a payload with correct properties', async () => {
        sinon.stub(locationOps, 'reverseGeolocation').returns('location1')

        const payload = {
            id_str: 'id1',
            created_at: Date.now(),
            text: 'txt1',
            user: {
                id_str: 'userid1',
                screen_name: 'screen1',
                name: 'username1',
                screen_name: 'userscreen1'
            },
            geo: 'geo'
        };

        const expectedResult = {
            twitterID: payload.user.id_str,
            tweetID: payload.id_str,
            createdAt: payload.created_at,
            text: payload.text,
            screenName: payload.user.screen_name,
            userName: payload.user.name,
            userScreenName: payload.user.screen_name,
            geolocation: 'location1',
            place: null
        };

        const result = await twitter.tweetFormatter(payload);

        expect(result.twitterID).to.be.equal(expectedResult.twitterID);
        expect(result.tweetID).to.be.equal(expectedResult.tweetID);
        expect(result.createdAt).to.be.equal(expectedResult.createdAt);
        expect(result.text).to.be.equal(expectedResult.text);
        expect(result.screenName).to.be.equal(expectedResult.screenName);
        expect(result.geolocation).to.be.equal(expectedResult.geolocation);
        expect(result.place).to.be.equal(expectedResult.place);
    });

    it('expects tweetFormatter to call locationOps.reverseGelocation if given a geo field', async () => {
        const locationOpsSpy = sinon.stub(locationOps, 'reverseGeolocation');

        const payload = {
            id_str: 'id1',
            created_at: Date.now(),
            text: 'txt1',
            user: {
                id_str: 'userid1',
                screen_name: 'screen1',
                name: 'username1',
                screen_name: 'userscreen1'
            },
            geo: 'geo'
        };

        twitter.tweetFormatter(payload);

        sinon.assert.called(locationOpsSpy);
    });

    it('expects tweetFormatter to not call locationOps.reverseGelocation if not given a geo field', async () => {
        const locationOpsSpy = sinon.stub(locationOps, 'reverseGeolocation');

        const payload = {
            id_str: 'id1',
            created_at: Date.now(),
            text: 'txt1',
            user: {
                id_str: 'userid1',
                screen_name: 'screen1',
                name: 'username1',
                screen_name: 'userscreen1'
            }
        };

        twitter.tweetFormatter(payload);

        sinon.assert.notCalled(locationOpsSpy);
    });

});



// const tweetID = new ObjectId();
        
// sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({ vendorID: 'vendorID1'}) });

// const didDeleteTweet = sinon.stub(tweetOps, 'deleteTweetLocation').returns(true);

// sinon.stub(sharedOps, 'createLocationAndCorrectConflicts').returns({_id: 'newLocationId'});
// sinon.stub(Vendor, 'findOneAndUpdate').returns({ lean: sinon.stub().returns({ regionID: 'regionId', twitterID: 'twitterId'})});
// sinon.stub(Tweet, 'findOneAndUpdate').returns(populate1);
// sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');

// await tweetOps.createTweetLocation(tweetID, { 
//     locationToOverride: {
//       _id: new ObjectId()
//     },
//     newLocationData: {
//       exists: true
//     }
//   });

// sinon.assert.called(didDeleteTweet);