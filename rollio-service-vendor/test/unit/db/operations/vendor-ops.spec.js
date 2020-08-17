/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../../../lib/db/mongo/mongoose/index');
const sinon = require('sinon');

const { expect } = chai;

// OPERATIONS
const vendorOps = require('../../../../lib/db/mongo/operations/vendor-ops');
const sharedOps = require('../../../../lib/db/mongo/operations/shared-ops');
const { ObjectID } = require('mongodb');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Location = mongoose.model('Location');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

describe('Vendor Operations', () => {
  afterEach(() => {
    sinon.restore();
  });

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

  it('expects updateVendorSet to take in arguments given one field being updated', async () => {
    const vendorFindOneAndUpdateStub = sinon.stub(Vendor, 'findOneAndUpdate').returns(populate1);

    const result = await vendorOps.updateVendorSet({regionID: 'regionID123', vendorID: 'vendorID123', field: ['field1'], data: ['data1']});

    const expectedArgument1 = {
      regionID: 'regionID123',
      _id: 'vendorID123'
    }

    const expectedArgument2 = {
      $set: {
        field1: 'data1'
      }
    }

    const expectedArgument3 = { new: true }

    sinon.assert.calledWith(vendorFindOneAndUpdateStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects updateVendorSet to take in arguments given multiple field being updated', async () => {
    const vendorFindOneAndUpdateStub = sinon.stub(Vendor, 'findOneAndUpdate').returns(populate1);

    await vendorOps.updateVendorSet({regionID: 'regionID123', vendorID: 'vendorID123', field: ['field1', 'field2'], data: ['data1', 'data2']});

    const expectedArgument1 = {
      regionID: 'regionID123',
      _id: 'vendorID123'
    }

    const expectedArgument2 = {
      $set: {
        field1: 'data1',
        field2: 'data2'
      }
    }

    const expectedArgument3 = { new: true }

    sinon.assert.calledWith(vendorFindOneAndUpdateStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects updateVendorPush to take in arguments given tweetHistory', async () => {
    const vendorFindOneAndUpdateStub = sinon.spy(Vendor, 'findOneAndUpdate');
    sinon.stub(Date, 'now').returns('123');
    sinon.stub(Tweet, 'create').returns({_id: '1122'});

    await vendorOps.updateVendorPush({regionID: 'regionID123', vendorID: 'vendorID123', field: 'tweetHistory', payload: {'tst': '123'}});

    const expectedArgument1 = {
      regionID: 'regionID123',
      _id: 'vendorID123'
    }

    const expectedArgument2 = {
      $push: { tweetHistory: '1122' },
      $set: { updateDate: '123' },
    }

    const expectedArgument3 = { new: true }

    sinon.assert.calledWith(vendorFindOneAndUpdateStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects updateVendorPush to take in arguments given userLocationHistory', async () => {
    const vendorFindOneAndUpdateStub = sinon.spy(Vendor, 'findOneAndUpdate');
    sinon.stub(Date, 'now').returns('123');
    sinon.stub(Location, 'create').returns({_id: 'location1'});

    await vendorOps.updateVendorPush({regionID: 'regionID123', vendorID: 'vendorID123', field: 'userLocationHistory', payload: {'tst': '123'}});
    
    const expectedArgument1 = {
      regionID: 'regionID123',
      _id: 'vendorID123'
    }

    const expectedArgument2 = {
      $push: { userLocationHistory: 'location1' },
      $set: { updateDate: '123' },
    }

    const expectedArgument3 = { new: true }

    sinon.assert.calledWith(vendorFindOneAndUpdateStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects updateVendorPushPosition to update arguments with userLocationHistory field', async () => {
    const vendorFindOneAndUpdateStub = sinon.spy(Vendor, 'findOneAndUpdate');

    await vendorOps.updateVendorPushPosition({regionID: 'regionID123', vendorID: 'vendorID123', field: 'userLocationHistory', payload: {'tst': '123'}, position: '123'});

    const expectedArgument1 = {
      regionID: 'regionID123',
      _id: 'vendorID123'
    }

    const expectedArgument2 = {
      $push: {
        'userLocationHistory': {
          $each: [{'tst': '123'}],
          $position: '123',
        },
      },
    }

    const expectedArgument3 = { new: true }

    sinon.assert.calledWith(vendorFindOneAndUpdateStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects updateLocationAccuracy to fail given an incorrect amount string \'1\'', async () => {
    const result = await vendorOps.updateLocationAccuracy({regionID: 'regionID123', vendorID: 'vendorID123', locationID: 'location123', amount: '1'});

    expect(result.level).to.equal('error');
  });

  it('expects updateLocationAccuracy to fail given an incorrect amount 2', async () => {
    const result = await vendorOps.updateLocationAccuracy({regionID: 'regionID123', vendorID: 'vendorID123', locationID: 'location123', amount: 2});

    expect(result.level).to.equal('error');
  });

  it('expects updateLocationAccuracy to fail given an incorrect amount -2', async () => {
    const result = await vendorOps.updateLocationAccuracy({regionID: 'regionID123', vendorID: 'vendorID123', locationID: 'location123', amount: -2});

    expect(result.level).to.equal('error');
  });

  it('expects updateLocationAccuracy to fail given an incorrect amount 0', async () => {
    const result = await vendorOps.updateLocationAccuracy({regionID: 'regionID123', vendorID: 'vendorID123', locationID: 'location123', amount: 0});

    expect(result.level).to.equal('error');
  });

  it('expects updateLocationAccuracy to be called with proper arguments', async () => {
    const locationFindOneAndUpdateStub = sinon.stub(Location, 'findOneAndUpdate').resolves(Promise.resolve());

    await vendorOps.updateLocationAccuracy({regionID: 'regionID123', vendorID: 'vendorID123', locationID: 'location123', amount: 1});

    const expectedArgument1 = {
      _id: 'location123',
    }

    const expectedArgument2 = {
      $inc: { accuracy: 1 },
    }

    const expectedArgument3 = { new: true }

    sinon.assert.calledWith(locationFindOneAndUpdateStub, expectedArgument1, expectedArgument2, expectedArgument3);
  });

  it('expects incrementVendorConsecutiveDaysInactive to be called with proper arguments', async () => {
    const vendorUpdateOneStub = sinon.stub(Vendor, 'updateOne').resolves(Promise.resolve());

    await vendorOps.incrementVendorConsecutiveDaysInactive('regionID123', 'vendorID123');

    const expectedArgument1 = {
      regionID: 'regionID123',
      _id: 'vendorID123',
    }

    const expectedArgument2 = {
      $inc: { consecutiveDaysInactive: 1 },
    }

    sinon.assert.calledWith(vendorUpdateOneStub, expectedArgument1, expectedArgument2);
  });

  it('expects updateNonTweetLocation to call all methods with proper arguments', async () => {
    const locationID = new ObjectID();
    const vendorID = new ObjectID();
    await sinon.stub(sharedOps, 'editLocationAndCorrectConflicts').returns({ lat: '123', long: '223'});
    await sinon.stub(Vendor, 'findOne').returns({ lean: sinon.stub().returns({ regionID: 'regionID123', twitterID: 'twitterID123'}) });
    const sharedOpsPublishLocationUpdateAndClearCacheStub = await sinon.spy(sharedOps, 'publishLocationUpdateAndClearCache');

    await vendorOps.updateNonTweetLocation(locationID, vendorID, {data: '123'});

    const expectedArgument1 = {
      newLocations: [{ lat: '123', long: '223'}], vendorID: vendorID, twitterID: 'twitterID123', regionID: 'regionID123',
    }

    sinon.assert.calledWith(sharedOpsPublishLocationUpdateAndClearCacheStub, expectedArgument1);
  });
});
