// DEPENDENCIES
const sinon = require('sinon');
const { ObjectId } = require('mongoose').Types;
const seedObj = require('../../../../lib/db/seeds/dev-seed.js');

// DATA
const {
    vendors: vendorsData,
    regions: regionsData,
    tweets: tweetData,
    locations: locationData,
    users: usersData,
  } = require('../../../../lib/db/data/dev');

describe('Dev Seed', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects seedVendors to be called with proper', async () => {    
        const { seedVendors } = seedObj;
        const regionID = new ObjectId();

        const regionStub = sinon.stub(Region, 'findOne').returns('WASHINGTONDC');
        const vendorsAsyncUpdatedStub = sinon.stub(seedObj, 'asyncUpdateVendor').returns((vendor) => { return {...vendor, regionID} });
        const vendorInsertManyStub = sinon.stub(Vendor, 'insertMany');

        const expectedArgument1 = vendorsData.map((vendor) => { return {...vendor, regionID} })

        await seedObj.seedVendors({ rest });

        sinon.assert.calledWith(vendorInsertManyStub, expectedArgument1);
    });
});
