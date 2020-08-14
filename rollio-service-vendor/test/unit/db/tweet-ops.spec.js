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

    it('expects getAllTweets to pass in a vendorID query if given a vendorID', async () => {
        const tweetFindStub = sinon.stub(Tweet, 'find').returns({ sort: sinon.stub().returns({ populate: sinon.stub().returns(Promise.resolve()) }) });

        const vendorID = new ObjectId();

        await tweetOps.getAllTweets({startDate: '2020-01-01', endDate: '2020-01-02', vendorID});

        const expectedArgument = { date: { $gte: '2020-01-01', $lte: '2020-01-02' }, vendorID }

        sinon.assert.calledWith(tweetFindStub, expectedArgument);
    });

    it('expects getAllTweets to not pass in a vendorID query if not given a vendorID', async () => {
      const tweetFindStub = sinon.stub(Tweet, 'find').returns({ sort: sinon.stub().returns({ populate: sinon.stub().returns(Promise.resolve()) }) });

      await tweetOps.getAllTweets({startDate: '2020-01-01', endDate: '2020-01-02'});

      const expectedArgument = { date: { $gte: '2020-01-01', $lte: '2020-01-02' } }

      sinon.assert.calledWith(tweetFindStub, expectedArgument);
  });

  it('expects getVendorsForFiltering to query for vendorID if given', async () => {
    const vendorFindStub = sinon.stub(Vendor, 'find').returns({ 
      lean: sinon.stub().returns({ 
        select: sinon.stub().returns({ 
          populate: sinon.stub().returns({
            sort: sinon.stub().returns('vendor')
          })
        })
      })
    });

    const vendorID = new ObjectId();

    await tweetOps.getVendorsForFiltering({ vendorID });

    const expectedArgument = { _id: vendorID }

    sinon.assert.calledWith(vendorFindStub, expectedArgument);
  });

  it('expects getVendorsForFiltering to query nothing if no vendorID given', async () => {
    const vendorFindStub = sinon.stub(Vendor, 'find').returns({ 
      lean: sinon.stub().returns({ 
        select: sinon.stub().returns({ 
          populate: sinon.stub().returns({
            sort: sinon.stub().returns('vendor')
          })
        })
      })
    });

    await tweetOps.getVendorsForFiltering();

    const expectedArgument = { };

    sinon.assert.calledWith(vendorFindStub, expectedArgument);
  });

  // ~~~~~~~~~~~~~~~~~~REVIEW~~~~~~~~~~~~~~~ tweetOps.editTweetLocation method updatedTweetRes formatting is very wrong ~~~~~~~~~~~~~~~~~~~~~~~

  it('expects editTweetLocation to pass proper arguments to PublishLocationAndUpdateAndClearCache method | REVIEW IMPLEMENT CODE DOESN\'T SEEM RIGHT', async () => {
    const updatedLocationRes = {locationID: 'location1'};
    sinon.stub(Location, 'findOneAndUpdate').returns({ lean: sinon.stub().returns(updatedLocationRes) });

    sinon.stub(sharedOps, 'correctLocationConflicts').returns();

    const updatedTweetRes = { vendorID: { twitterID: 'tweet1', regionID: 'region1'} };
    sinon.stub(Tweet, 'findOne').returns({ 
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({ 
          lean: sinon.stub().returns(updatedTweetRes)
        }) 
      }) 
    });
    const sharedOpsPublishLocationUpdateAndClearCacheStub = sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache').returns();    

    await tweetOps.editTweetLocation('tweetFirst', 'locationFirst', { data: true } );

    const expectedArgument = {
      updatedTweet: updatedTweetRes, 
      newLocations: [updatedLocationRes], 
      vendorID: updatedTweetRes, 
      twitterID: updatedTweetRes.vendorID.twitterID, 
      regionID: updatedTweetRes.vendorID.regionID,
    };

    sinon.assert.calledWith(sharedOpsPublishLocationUpdateAndClearCacheStub, expectedArgument);
  });

  it('expects deleteTweetLocation to publish location if publish locaiton option added', async () => {
    sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({locations: ['1', '2']}) });
    sinon.stub(Location, 'updateOne').returns();
    
    const vendorFindOneAndUpdateRes = {
      twitterID: new ObjectId(), 
      regionID: new ObjectId(), 
      _id: new ObjectId()
    }
    sinon.stub(Vendor, 'findOneAndUpdate').returns(vendorFindOneAndUpdateRes);
    
    const updatedTweet = {tweetID: new ObjectId() }
    sinon.stub(Tweet, 'findOneAndUpdate').returns({ 
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({ 
          lean: sinon.stub().returns(updatedTweet)
        }) 
      }) 
    });
    const sharedOpsPublishLocationUpdateAndClearCacheStub = sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');
    
    await tweetOps.deleteTweetLocation('tweetId', 'locationId');

    sinon.assert.called(sharedOpsPublishLocationUpdateAndClearCacheStub);
  });

  it('expects deleteTweetLocation to not publish location if publish locaiton option not added', async () => {
    sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({locations: ['1', '2']}) });
    sinon.stub(Location, 'updateOne').returns();
    
    const vendorFindOneAndUpdateRes = {
      twitterID: new ObjectId(), 
      regionID: new ObjectId(), 
      _id: new ObjectId()
    }
    sinon.stub(Vendor, 'findOneAndUpdate').returns(vendorFindOneAndUpdateRes);
    
    const updatedTweet = {tweetID: new ObjectId() }
    sinon.stub(Tweet, 'findOneAndUpdate').returns({ 
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({ 
          lean: sinon.stub().returns(updatedTweet)
        }) 
      }) 
    });
    const sharedOpsPublishLocationUpdateAndClearCacheStub = sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');
    
    await tweetOps.deleteTweetLocation('tweetId', 'locationId', false);

    sinon.assert.notCalled(sharedOpsPublishLocationUpdateAndClearCacheStub);
  });


  it('expects deleteTweetLocation to call updatedTweet method with proper args given returned locations have length greater than 1', async () => {
    sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({locations: ['1', '2']}) });
    sinon.stub(Location, 'updateOne').returns();
    
    const vendorFindOneAndUpdateRes = {
      twitterID: new ObjectId(), 
      regionID: new ObjectId(), 
      _id: new ObjectId()
    }
    sinon.stub(Vendor, 'findOneAndUpdate').returns(vendorFindOneAndUpdateRes);
    
    const updatedTweet = {tweetID: new ObjectId() }
    const updatedTweetStub = sinon.stub(Tweet, 'findOneAndUpdate').returns({ 
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({ 
          lean: sinon.stub().returns(updatedTweet)
        }) 
      }) 
    });
    sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');
    
    await tweetOps.deleteTweetLocation('tweetId', 'locationId');

    const expectedArgument1 = { _id: 'tweetId' };
    const expectedArgument2 = { $pull: { locations: 'locationId' }, $set: { usedForLocation: true } };
    const expectedArgument3 = { new: true };

    sinon.assert.calledWith(updatedTweetStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects deleteTweetLocation to call updatedTweet method with proper args given returned locations have length less than or equal to 1', async () => {
    sinon.stub(Tweet, 'findById').returns({ lean: sinon.stub().returns({locations: ['1']}) });
    sinon.stub(Location, 'updateOne').returns();
    
    const vendorFindOneAndUpdateRes = {
      twitterID: new ObjectId(), 
      regionID: new ObjectId(), 
      _id: new ObjectId()
    }
    sinon.stub(Vendor, 'findOneAndUpdate').returns(vendorFindOneAndUpdateRes);
    
    const updatedTweet = {tweetID: new ObjectId() }
    const updatedTweetStub = sinon.stub(Tweet, 'findOneAndUpdate').returns({ 
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({ 
          lean: sinon.stub().returns(updatedTweet)
        }) 
      }) 
    });
    sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');
    
    await tweetOps.deleteTweetLocation('tweetId', 'locationId');

    const expectedArgument1 = { _id: 'tweetId' };
    const expectedArgument2 = { $pull: { locations: 'locationId' }, $set: { usedForLocation: false } };
    const expectedArgument3 = { new: true };

    sinon.assert.calledWith(updatedTweetStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });
});



