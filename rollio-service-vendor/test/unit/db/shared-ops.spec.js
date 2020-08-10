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

describe('Shared Operations', () => {
    afterEach(() => {
        // Restore sinon spies,stubs,mocks,etc.
        sinon.restore();
    });

    const popualte3 = { populate: sinon.stub().returns(Promise.resolve({})) }
    const populate2 = { populate: sinon.stub().returns(popualte3) }
    const populate1 = { populate: sinon.stub().returns(populate2) }

    it('expects updateConflictingLocationDates to work?', async () => {
        const locationFindOneAndUpdate = sinon.spy(Location, 'findOneAndUpdate');
        const locationId = new ObjectId()

        await sharedOps.updateConflictingLocationDates({ _id: locationId, existingStartDate: '2020-01-10', existingEndDate: '2020-01-11' }, '2020-01-12', '2020-01-13');

        const expectedArgument1 = {
            _id: locationId
        }

        const expectedArgument2 = { startDate: '2020-01-13' }

        sinon.assert.calledWith(locationFindOneAndUpdate, expectedArgument1, expectedArgument2);
    });
});
