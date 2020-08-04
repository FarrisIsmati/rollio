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
        const { publishLocationUpdateAndClearCache, createLocationAndCorrectConflicts, editLocationAndCorrectConflicts } = sharedOps;
        createLocationAndCorrectConflictsStub = sinon.stub(createLocationAndCorrectConflicts).resolves(Promise.resolve({}));

        const vendorObjectID = new ObjectId();
        const expectedArgument = { vendorID: vendorObjectID, matchMethod: 'Vendor Input' };

        vendorOps.createNonTweetLocation(vendorObjectID);
        sinon.assert.calledWith(createLocationAndCorrectConflictsStub, expectedArgument);
        done();
      });

      it('expects getVendors to pass argument to Vendor.find method', (done) => {
        findStub = sinon.stub(Vendor, 'find').returns(populate1);

        const expectedArgument = {
          regionID: 'regionID1',
          approved: true
        };

        vendorOps.getVendors('regionID1');
        sinon.assert.calledWith(findStub, expectedArgument);
        done();
      });

      it('expects getVendor to pass arguments to Vendor.findOne & populate method', (done) => {
        findOneStub = sinon.stub(Vendor, 'findOne').returns(populate1);

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
        findOneStub = sinon.stub(Vendor, 'findOne').returns(populate1);

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
        findStub = sinon.stub(Vendor, 'find').returns(populate1);

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

      it('expect to return a vendor given a regionID and a vendor twitterID', (done) => {
        done();
      });

      it('expect a vendor given an object with a set of mongo query parameters, expect number of consecuitve days inactive vendors 7', (done) => {
        done();
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
