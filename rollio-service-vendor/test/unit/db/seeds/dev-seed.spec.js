// DEPENDENCIES
const sinon = require('sinon');
const mongoose = require('../../../../lib/db/mongo/mongoose/index');
const { ObjectId } = require('mongoose').Types;
const seedObj = require('../../../../lib/db/mongo/seeds/dev-seed.js');

// SCHEMAS
const Region = mongoose.model('Region');
const Vendor = mongoose.model('Vendor');

// DATA
const {
    vendors: vendorsData,
    regions: regionsData,
    tweets: tweetData,
    locations: locationData,
    users: usersData,
  } = require('../../../../lib/db/mongo/data/dev');

describe('Dev Seed', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects seedVendors to be called with proper', async () => {    
        const { seedVendors } = seedObj;
        const regionID = new ObjectId();

        const regionStub = sinon.stub(Region, 'findOne').returns({ _id: regionID });
        const vendorInsertManyStub = sinon.stub(Vendor, 'insertMany').returns(Promise.resolve());

        const expectedArgument1 = vendorsData.map((vendor) => { return {...vendor, regionID} })

        await seedObj.seedVendors('WASHINGTONDC');

        sinon.assert.calledWith(vendorInsertManyStub, expectedArgument1);
    });
});
