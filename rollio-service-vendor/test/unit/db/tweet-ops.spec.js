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
// const sharedOps = require('../../../lib/db/mongo/operations/shared-ops');
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

describe('Shared Operations', () => {
    afterEach(() => {
        // Restore sinon spies,stubs,mocks,etc.
        sinon.restore();
    });

    const popualte3 = { populate: sinon.stub().returns(Promise.resolve({})) }
    const populate2 = { populate: sinon.stub().returns(popualte3) }
    const populate1 = { populate: sinon.stub().returns(populate2) }

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
    
});
