/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
const chaid = require('chaid');
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

describe('User Operations', () => {
    afterEach(() => {
        // Restore sinon spies,stubs,mocks,etc.
        sinon.restore();
    });

    const popualte3 = { populate: sinon.stub().returns(Promise.resolve({})) }
    const populate2 = { populate: sinon.stub().returns(popualte3) }
    const populate1 = { populate: sinon.stub().returns(populate2) }

    it('expects findUserById to return \'result1\'', async () => {
        const userFindByIdStub = sinon.stub(User, 'findById').returns({ select: sinon.stub().returns('result1') });
        const userId = new ObjectId()

        const result = await userOps.findUserById(userId, true);

        sinon.assert.called(userFindByIdStub);
        expect(result).to.be.equal('result1');
    });

    it('expects findUserById to return \'result2\'', async () => {
        const userFindByIdStub = sinon.stub(User, 'findById').returns('result2');
        const userId = new ObjectId()

        const result = await userOps.findUserById(userId, false);

        sinon.assert.called(userFindByIdStub);
        expect(result).to.be.equal('result2');
    });

    it('expects patchUser to include arguments for unset data if user is not a vendor and not to include vendorID', async () => {
        const userFindOneAndUpdate = sinon.stub(User, 'findOneAndUpdate').returns('result2');
        const userId = new ObjectId()

        const patchUserData = { vendorID: 'vendor123', type: 'notVendor' };
        await userOps.patchUser(userId, patchUserData);

        const expectedArgument1 = {
            _id: userId,
          }
      
          const expectedArgument2 = { $set: { ...patchUserData }, $unset: { vendorID: 1 } }
      
          const expectedArgument3 = { new: true }
      
        sinon.assert.calledWith(userFindOneAndUpdate, expectedArgument1, expectedArgument2, expectedArgument3);
    });

    it('expects patchUser to not include unset arguments if user is a vendor', async () => {
        const userFindOneAndUpdate = sinon.stub(User, 'findOneAndUpdate').returns('result2');
        const userId = new ObjectId()

        const patchUserData = { vendorID: 'vendor123', type: 'vendor' };
        await userOps.patchUser(userId, patchUserData);

        const expectedArgument1 = {
            _id: userId,
          }
      
          const expectedArgument2 = { $set: { ...patchUserData } }
      
          const expectedArgument3 = { new: true }
      
        sinon.assert.calledWith(userFindOneAndUpdate, expectedArgument1, expectedArgument2, expectedArgument3);
    });

    it('expects upsertTwitterUser to return an existing user', async () => {
        const returnedUser = {_id: 'user123'};
        sinon.stub(User, 'findOne').returns(returnedUser);

        const result = await userOps.upsertTwitterUser('token123', 'secret123', {id: 'id1', username: 'user1', displayName: 'name1', emails: 'email1'}, 'type1');

        expect(result).to.haveOwnProperty('user');
        expect(result.user).to.haveOwnProperty('_id');
        expect(result.user._id).to.equal(returnedUser._id);
    });

    it('expects upsertTwitterUser to return an ', async () => {
        const returnedUser = null;
        const vendorId = new ObjectId();
        sinon.stub(User, 'findOne').returns(returnedUser);
        const vendorFindOneStub = sinon.stub(Vendor, 'findOne').returns({ vendorID: vendorId });
        sinon.stub(User.prototype, 'save').returns({ toJSON: () => { return {id: 'user1', twitterProvider: 'tweet1'}} });

        const result = await userOps.upsertTwitterUser('token123', 'secret123', {id: 'id1', username: 'user1', displayName: 'name1', emails: 'email1'}, 'type1');

        expect(result.user).to.haveOwnProperty('id');
        expect(result.user).to.not.haveOwnProperty('twitterProvider');
        expect(result.user.id).to.be.equal('user1');
    });
});
