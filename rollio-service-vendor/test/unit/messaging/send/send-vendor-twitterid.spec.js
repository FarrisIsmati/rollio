/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../../../../lib/messaging/index');
const recieve = require('../../../../lib/messaging/recieve/receive-vendors-request');
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
        it('expects _recieveVendorRequestProcess to ... ', async () => {     
            // const mqReceiveStub = sinon.stub(mq, 'recieve').returns();

            // const expectedArgument1 = twitterConnection;
            // const expectedArgument2 = 'tid1,tid2';
    
            // await sendVendorTwitterIDs();
    
            // sinon.assert.calledWith(mqSendStub, expectedArgument1, expectedArgument2);
        });
    })
});

