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
// const sharedOps = require('../../../lib/db/mongo/operations/shared-ops');

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
      let findOneStub = null;
      let findStub = null;

      const vendorObject = {};
      const popualte3 = { populate: sinon.stub().returns(Promise.resolve(vendorObject)) }
      const populate2 = { populate: sinon.stub().returns(popualte3) }
      const populate1 = { populate: sinon.stub().returns(populate2) }


      beforeEach(() => {
        findOneStub = sinon.stub(Vendor, 'findOne').returns(populate1);
        findStub = sinon.stub(Vendor, 'find').returns(populate1);
      })

      it('expects getVendors to pass argument to Vendor.find method', (done) => {
        const expectedArgument = {
          regionID: 'regionID1',
          approved: true
        };

        vendorOps.getVendors('regionID1');
        sinon.assert.calledWith(findStub, expectedArgument);
        done();
      });

      it('expects getVendor to pass arguments to Vendor.findOne & populate method', (done) => {
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
