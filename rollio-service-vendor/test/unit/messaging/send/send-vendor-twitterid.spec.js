/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../../../../lib/messaging/index');
const send = require('../../../../lib/messaging/send/send-vendor-twitterid');
const sinon = require('sinon');
const config = require('../../../../config');

// OPERATIONS
const regionOps = require('../../../../lib/db/mongo/operations/region-ops');
const vendorOps = require('../../../../lib/db/mongo/operations/vendor-ops');

describe('Send', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('Send', () => {
        it('expects sendVendorTwitterIDs to ...', async () => {     
            const regionID = 'regionID1'
            const twitterConnection = 'www.rollio.io';

            sinon.stub(config, 'AWS_SQS_TWITTER_IDS').value(twitterConnection);
            sinon.stub(regionOps, 'getRegionByName').returns(Promise.resolve(regionID));
            sinon.stub(vendorOps, 'getVendors').returns(Promise.resolve([{twitterID: 'tid1'}, {twitterID: 'tid2'}]));

            const mqSendStub = sinon.stub(mq, 'send');

            const expectedArgument1 = twitterConnection;
            const expectedArgument2 = 'tid1,tid2';

            await send.sendVendorTwitterIDs();

            sinon.assert.calledWith(mqSendStub, expectedArgument1, expectedArgument2);
        });
    })
});
