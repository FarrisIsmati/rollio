/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../../../../lib/messaging/index');
const send = require('../../../../lib/messaging/send/send-vendor-twitterid');
const receive = require('../../../../lib/messaging/receive/receive-vendors-request');
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
        it('expects _receiveVendorRequestProcess to call sendVendorTwitterIDs if given a message with content ', async () => {     
            const sendStub = sinon.stub(send, 'sendVendorTwitterIDs');

            const message = {content: 'hi'};
    
            await receive._receiveVendorRequestProcess(message);
    
            sinon.assert.called(sendStub);
        });

        it('expects _receiveVendorRequestProcess to NOT call sendVendorTwitterIDs if NOT given a message with content ', async () => {     
            const sendStub = sinon.stub(send, 'sendVendorTwitterIDs');

            const message = {};
    
            await receive._receiveVendorRequestProcess(message);
    
            sinon.assert.notCalled(sendStub);
        });
    })
});