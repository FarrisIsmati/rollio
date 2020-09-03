// DEPENDENCIES
const chai = require('chai');
const receive = require('../../../../lib/messaging/receive/receive-vendor-list');
const mq = require('../../../../lib//messaging/index');
const twitter = require('../../../../lib/twitter/index');
const config = require('../../../../config');

const sinon = require('sinon');
const Sinon = require('sinon');

const { expect } = chai;

describe('Messaging Receive', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects receive object stream property to be null', async () => {        
        sinon.stub(twitter, 'streamClient').returns({
            destroy: () => 'destroyed'
        })

        expect(receive.stream).to.be.null;
    });

    it('expects receive object stream property to be an object with property destroy after running _mqReceive()', async () => {        
        sinon.stub(twitter, 'streamClient').returns({
            destroy: () => 'destroyed'
        });

        const payload = {
            content: 'id123'
        };

        await receive._mqReceive(payload);

        expect(receive.stream).to.haveOwnProperty('destroy');
    });
});
