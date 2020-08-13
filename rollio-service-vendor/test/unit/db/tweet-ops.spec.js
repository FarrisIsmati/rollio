/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
const chaid = require('chaid');
const dateTime = require('chai-datetime');
const assertArrays = require('chai-arrays');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../../lib/db/mongo/mongoose/index');
const sinon = require('sinon');
const { pub } = require('../../../lib/redis/index');

const { expect } = chai;

// OPERATIONS
// const vendorOps = require('../../../lib/db/mongo/operations/vendor-ops');
// const regionOps = require('../../../lib/db/mongo/operations/region-ops');
const tweetOps = require('../../../lib/db/mongo/operations/tweet-ops');
// const userOps = require('../../../lib/db/mongo/operations/user-ops');
const sharedOps = require('../../../lib/db/mongo/operations/shared-ops');
const { error } = require('winston');
const { ObjectID } = require('mongodb');
const userOps = require('../../../lib/db/mongo/operations/user-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
const Location = mongoose.model('Location');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

chai.use(chaid);
chai.use(assertArrays);
chai.use(dateTime);

describe('Tweet Operations', () => {
    afterEach(() => {
        sinon.restore();
    });

    const popualte3 = { populate: sinon.stub().returns(Promise.resolve({})) }
    const populate2 = { populate: sinon.stub().returns(popualte3) }
    const populate1 = { populate: sinon.stub().returns(populate2) }

    it('expects createTweetLocation to delete tweet if locationToOverride provided', async () => {
        const tweetID = new ObjectId();
        
        sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({ vendorID: 'vendorID1'}) });

        const didDeleteTweet = sinon.stub(tweetOps, 'deleteTweetLocation').returns(true);

        sinon.stub(sharedOps, 'createLocationAndCorrectConflicts').returns({_id: 'newLocationId'});
        sinon.stub(Vendor, 'findOneAndUpdate').returns({ lean: sinon.stub().returns({ regionID: 'regionId', twitterID: 'twitterId'})});
        sinon.stub(Tweet, 'findOneAndUpdate').returns(populate1);
        sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');

        await tweetOps.createTweetLocation(tweetID, { 
            locationToOverride: {
              _id: new ObjectId()
            },
            newLocationData: {
              exists: true
            }
          });

        sinon.assert.called(didDeleteTweet);
    });

    it('expects createTweetLocation to NOT delete tweet if locationToOverride NOT provided', async () => {
        const tweetID = new ObjectId();
        
        sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({ vendorID: 'vendorID1'}) });

        const didDeleteTweet = sinon.stub(tweetOps, 'deleteTweetLocation').returns(true);

        sinon.stub(sharedOps, 'createLocationAndCorrectConflicts').returns({_id: 'newLocationId'});
        sinon.stub(Vendor, 'findOneAndUpdate').returns({ lean: sinon.stub().returns({ regionID: 'regionId', twitterID: 'twitterId'})});
        sinon.stub(Tweet, 'findOneAndUpdate').returns(populate1);
        sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');

        await tweetOps.createTweetLocation(tweetID, { 
            newLocationData: {
              exists: true
            }
          });

        sinon.assert.notCalled(didDeleteTweet);
    });
    
    it('expects createTweetLocation vendor findOneAndUpdate to be called with correct arguments', async () => {
        const tweetID = new ObjectId();
        
        sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({ vendorID: 'vendorID1'}) });
        sinon.stub(tweetOps, 'deleteTweetLocation').returns(true);
        sinon.stub(sharedOps, 'createLocationAndCorrectConflicts').returns({_id: 'newLocationId'});

        const getRegionIdTwitterId = sinon.stub(Vendor, 'findOneAndUpdate').returns({ lean: sinon.stub().returns({ regionID: 'regionId', twitterID: 'twitterId'})});

        sinon.stub(Tweet, 'findOneAndUpdate').returns(populate1);
        sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');

        const expectedArgument1 = { _id: 'vendorID1' }
        const expectedArgument2 = {
            $push: {
              locationHistory: {
                $each: ['newLocationId'],
                $position: 0,
              },
            },
        }

        await tweetOps.createTweetLocation(tweetID, { 
            locationToOverride: {
              _id: new ObjectId()
            },
            newLocationData: {
              exists: true
            }
          });

        sinon.assert.calledWith(getRegionIdTwitterId, expectedArgument1, expectedArgument2);
    });
});
