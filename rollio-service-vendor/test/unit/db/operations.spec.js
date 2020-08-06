/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
const chaid = require('chaid');
const moment = require('moment');
const { sortBy, omit } = require('lodash');
const dateTime = require('chai-datetime');
const assertArrays = require('chai-arrays');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../../lib/db/mongo/mongoose/index');
const sinon = require('sinon');

const { expect } = chai;

// OPERATIONS
const vendorOps = require('../../../lib/db/mongo/operations/vendor-ops');
// const regionOps = require('../../../lib/db/mongo/operations/region-ops');
// const tweetOps = require('../../../lib/db/mongo/operations/tweet-ops');
// const userOps = require('../../../lib/db/mongo/operations/user-ops');
const sharedOps = require('../../../lib/db/mongo/operations/shared-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
const Location = mongoose.model('Location');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

chai.use(chaid);
chai.use(assertArrays);
chai.use(dateTime);

describe('DB Operations', () => {
  afterEach(() => {
    // Restore sinon spies,stubs,mocks,etc.
    sinon.restore();
  });

  describe('Vendor DB Operations', () => {
    describe('Get Vendor Operations', () => {
      const popualte3 = { populate: sinon.stub().returns(Promise.resolve({})) }
      const populate2 = { populate: sinon.stub().returns(popualte3) }
      const populate1 = { populate: sinon.stub().returns(populate2) }

      it('expects createVendor to recieve arguments as vendor', (done) => {
        const createStub = sinon.stub(Vendor, 'create').resolves(Promise.resolve({}));

        const userID = new ObjectId()

        const expectedArgument = {
          regionID: '123',
          dailyActive: false, 
          consecutiveDaysInactive: 0, 
          twitterID: 'twitterID',
          approved: false
        };

        vendorOps.createVendor({}, '123', { twitterProvider: { id: 'twitterID' }, type: 'vendor', _id: userID });
        sinon.assert.calledWith(createStub, expectedArgument);

        done();
      });

      it('expects createVendor to recieve arguments as admin', (done) => {
        const createStub = sinon.stub(Vendor, 'create').resolves(Promise.resolve({}));

        const userID = new ObjectId()

        const expectedArgument = {
          regionID: '123',
          dailyActive: false, 
          consecutiveDaysInactive: 0, 
          approved: true
        };

        vendorOps.createVendor({}, '123', { twitterProvider: { id: 'twitterID' }, type: 'admin', _id: userID });
        sinon.assert.calledWith(createStub, expectedArgument);

        done();
      });

      it('expects createVendor to update new vendor if user is a vendor', async () => {
        sinon.stub(Vendor, 'create').resolves(Promise.resolve({ _id: new ObjectId() }));
        const findOneAndUpdateStub = sinon.spy(User, 'findOneAndUpdate');

        const userID = new ObjectId()

        await vendorOps.createVendor({}, '123', { twitterProvider: { id: 'twitterID' }, type: 'vendor', _id: userID });
        sinon.assert.called(findOneAndUpdateStub);
      });

      it('expects createVendor to NOT update new vendor if user is an admin', async () => {
        sinon.stub(Vendor, 'create').resolves(Promise.resolve({ _id: new ObjectId() }));
        const findOneAndUpdateStub = sinon.spy(User, 'findOneAndUpdate');

        const userID = new ObjectId()

        await vendorOps.createVendor({}, '123', { type: 'admin', _id: userID });
        sinon.assert.notCalled(findOneAndUpdateStub);
      });

      it('expects createNonTweetLocation all funcs to recieve proper arguments', async () => {
        const createLocationAndCorrectConflictsStub = sinon.stub(sharedOps, 'createLocationAndCorrectConflicts').resolves(Promise.resolve({ _id: '123'}));
        const findOneAndUpdateStub = sinon.stub(Vendor, 'findOneAndUpdate').returns({ lean: sinon.stub().returns({ regionID: 'regionID123', twitterID: 'twitterID123' }) });
        const publishLocationUpdateAndClearCacheStub = sinon.stub(sharedOps, 'publishLocationUpdateAndClearCache');

        const vendorObjectID = new ObjectId();

        const locationData = {
          address: '123',
          coordinates: {
            lat: 1, long: 1
          }
        }
        
        const expectedArgument = { ...locationData, vendorID: vendorObjectID, matchMethod: 'Vendor Input' };
        const expectedArgument2a = 
          { _id: vendorObjectID }
        const expectedArgument2b = {
          $push: {
            locationHistory: {
              $each: ['123'],
              $position: 0,
            },
          }
        }
        const expectedArgument3 = {
          newLocations: [{_id: '123'}], vendorID: vendorObjectID, twitterID: 'twitterID123', regionID: 'regionID123',
        }

        await vendorOps.createNonTweetLocation(vendorObjectID, locationData);

        sinon.assert.calledWith(createLocationAndCorrectConflictsStub, expectedArgument);
        sinon.assert.calledWith(findOneAndUpdateStub, expectedArgument2a, expectedArgument2b);
        sinon.assert.calledWith(publishLocationUpdateAndClearCacheStub, expectedArgument3);
      });

      it('expects getVendors to pass argument to Vendor.find method', (done) => {
        const findStub = sinon.stub(Vendor, 'find').returns(populate1);

        const expectedArgument = {
          regionID: 'regionID1',
          approved: true
        };

        vendorOps.getVendors('regionID1');
        sinon.assert.calledWith(findStub, expectedArgument);
        done();
      });

      it('expects getVendor to pass arguments to Vendor.findOne & populate method', (done) => {
        const findOneStub = sinon.stub(Vendor, 'findOne').returns(populate1);

        const expectedArgumentFindOne = {
          regionID: 'arg1',
          twitterID: 'arg2'
        };

        const expectedArgumentPopulate1 = { 
          options: { limit: 10, sort: { date: -1 } }, 
          path: "tweetHistory" 
        }

        vendorOps.getVendorByTwitterID('arg1', 'arg2');
        sinon.assert.calledWith(findOneStub, expectedArgumentFindOne);
        sinon.assert.calledWith(populate1.populate, expectedArgumentPopulate1);

        done();
      });

      it('expects getVendorByTwitterID to pass arguments to Vendor.findOne & populate method', (done) => {
        const findOneStub = sinon.stub(Vendor, 'findOne').returns(populate1);

        const expectedArgumentFindOne = {
          regionID: 'arg1',
          twitterID: 'arg2'
        };

        const expectedArgumentPopulate1 = { 
          options: { limit: 10, sort: { date: -1 } }, 
          path: "tweetHistory" 
        }

        vendorOps.getVendorByTwitterID('arg1', 'arg2');
        sinon.assert.calledWith(findOneStub, expectedArgumentFindOne);
        sinon.assert.calledWith(populate1.populate, expectedArgumentPopulate1);

        done();
      });
        
      it('expects getVendorsByQuery to pass arguments to Vendor.findOne & populate method', (done) => {
        const findStub = sinon.stub(Vendor, 'find').returns(populate1);

        const expectedArgumentFind = {
          approved: true,
          regionID: '123'
        };

        const expectedArgumentPopulate1 = { 
          options: { limit: 10, sort: { date: -1 } }, 
          path: "tweetHistory" 
        }

        vendorOps.getVendorsByQuery({ regionID: '123' });
        sinon.assert.calledWith(findStub, expectedArgumentFind);
        sinon.assert.calledWith(populate1.populate, expectedArgumentPopulate1);

        done();
      });

      it('expects getUnapprovedVendors to return an empty array if no approved vendors found', async () => {
        sinon.stub(Vendor, 'find').returns([]);

        const results = await vendorOps.getUnapprovedVendors();

        expect(results).to.be.an('array');
        expect(results).to.have.length(0);
      });

      it('expects getUnapprovedVendors to return an array if approved vendors found', async () => {
        sinon.stub(Vendor, 'find').returns([{ _id: 'vendorid123', toObject: ()=>{return {obj: 'obj1'}} }]);
        sinon.stub(User, 'find').returns({ select: sinon.stub().returns({ reduce: sinon.stub().returns({'vendorid123': {twitterID: '123'}}) }) })

        const results = await vendorOps.getUnapprovedVendors();

        expect(results).to.be.an('array');
        expect(results).to.have.length(1);
        expect(results[0]).to.haveOwnProperty('twitterInfo');
        expect(results[0].twitterInfo.twitterID).to.be.equal('123')
      });
    });
  });

  describe('Shared DB Operations', () => {
    const initLocationData = {
      vendorID: new ObjectId(),
      address: '123 street',
      matchMethod: 'Vendor Input',
      truckNum: 1,
      coordinates: { lat: 0, long: 0 },
    };

    it('expect createLocationAndCorrectConflicts to ensure that one truck is not in two places at once', (done) => {
      done();
    });
  });
});
