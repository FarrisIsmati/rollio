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
const sharedOps = require('../../../lib/db/mongo/operations/shared-ops');

// SCHEMAS
const Location = mongoose.model('Location');

chai.use(chaid);
chai.use(assertArrays);
chai.use(dateTime);

describe('Shared Operations', () => {
    afterEach(() => {
        sinon.restore();
    });

    // SKIPPING UPDATECONFLICTINGLOCATIONDATES method (Do not understnad this logic)
    // it('expects updateConflictingLocationDates', async () => {
    //     const locationFindOneAndUpdate = sinon.spy(Location, 'findOneAndUpdate');
    //     const locationId = new ObjectId()

    //     await sharedOps.updateConflictingLocationDates({ _id: locationId, existingStartDate: '2020-01-10', existingEndDate: '2020-01-11' }, '2020-01-12', '2020-01-13');

    //     const expectedArgument1 = {
    //         _id: locationId
    //     }

    //     const expectedArgument2 = { endDate: '2020-01-13' }

    //     sinon.assert.calledWith(locationFindOneAndUpdate, expectedArgument1, expectedArgument2);
    // });

    it('expects correctLocationConflicts to return an empty array if overriden', async () => {
        const locationData = {
            vendorID: new ObjectId(),
            startDate: 'Date123',
            endDate: 'EndDate123',
            truckNum: 1,
            _id: new ObjectId(),
            overridden: true,
        }

        const result = await sharedOps.correctLocationConflicts(locationData);

        expect(result).to.be.an('array');
        expect(result.length).to.be.equal(0);
    });
    
    it('expects correctLocationConflicts to call location.find with correct arguments', async () => {
        const locationData = {
            vendorID: new ObjectId(),
            startDate: 'Date123',
            endDate: 'EndDate123',
            truckNum: 1,
            _id: new ObjectId(),
            overridden: false,
        }

        const locationFindStub = sinon.stub(Location, 'find').returns([]);

        const expectedArgument1 = {
            _id: { $ne: locationData._id }, vendorID: locationData.vendorID, startDate: { $lte: locationData.endDate }, endDate: { $gte: locationData.startDate }, truckNum: locationData.truckNum, overridden: false,
        }

        await sharedOps.correctLocationConflicts(locationData);

        sinon.assert.calledWith(locationFindStub, expectedArgument1);
    });

    it('expects correctLocationConflicts to call promise.all if conflicting truck locations found', async () => {
        const locationData = {
            vendorID: new ObjectId(),
            startDate: '2020-01-01',
            endDate: '2020-01-02',
            truckNum: 1,
            _id: new ObjectId(),
            overridden: false,
        }

        sinon.stub(Location, 'find').returns([{}]);
        const promiseStub = sinon.stub(Promise, 'all');

        const expectedArgument1 = {
            _id: { $ne: locationData._id }, vendorID: locationData.vendorID, startDate: { $lte: locationData.endDate }, endDate: { $gte: locationData.startDate }, truckNum: locationData.truckNum, overridden: false,
        }

        await sharedOps.correctLocationConflicts(locationData);

        sinon.assert.called(promiseStub);
    });

    it('expects publishLocationUpdate to call pub.publish with correct arguments', async () => {
        const publishLocationUpdateData = {
            updatedTweet: { text: '123', tweetID: new ObjectId(), date: '2020-01-01' }, newLocations: [], vendorID: new ObjectId(), twitterID: new ObjectId(), regionID: new ObjectId(),
        }

        sinon.stub(sharedOps, 'getVendorLocations').returns([{}]);
        const pubStub = sinon.stub(pub, 'publish');

        const expectedArgument1 = 'test_twitter'

        const expectedArgument2 = JSON.stringify({
            tweet:{
                text:"123",
                tweetID: publishLocationUpdateData.updatedTweet.tweetID,
                twitterID: publishLocationUpdateData.twitterID,
                date:"2020-01-01"
            },
            newLocations:[],
            allLocations:[{}],
            vendorID: publishLocationUpdateData.vendorID,
            regionID: publishLocationUpdateData.regionID,
            messageType:"NEW_LOCATIONS",
            serverID:"server1"
        })

        await sharedOps.publishLocationUpdate(publishLocationUpdateData);

        sinon.assert.calledWith(pubStub, expectedArgument1, expectedArgument2);
    });
});
