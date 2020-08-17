// DEPENDENCIES
const mongoose = require('../../../lib/db/mongo/mongoose/index');
const { ObjectId } = require('mongoose').Types;
const sinon = require('sinon');

// OPERATIONS
const locationOps = require('../../../lib/db/mongo/operations/location-ops');

// SCHEMAS
const Location = mongoose.model('Location');

describe('Location Operations', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects getAllLocations to be called without vendorID query if not given', async () => {        
        const locationFindSpy = sinon.spy(Location, 'find');

        const rest = { id: 'rest1' };

        const expectedArgument1 = { rest };

        await locationOps.getAllLocations({ rest });

        sinon.assert.calledWith(locationFindSpy, expectedArgument1);
    });

    it('expects getAllLocations to be called with a vendorID query if given', async () => {        
        const locationFindSpy = sinon.stub(Location, 'find').returns({ sort: sinon.stub().returns() });

        const rest = { id: 'rest1' };
        const vendorID = new ObjectId();

        const expectedArgument1 = { rest, vendorID };

        await locationOps.getAllLocations({ rest, vendorID });

        sinon.assert.calledWith(locationFindSpy, expectedArgument1);
    });
});



