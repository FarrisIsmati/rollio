/* eslint-disable no-console */
// DEPENDENCIES
const redis = require('redis');
const bluebird = require('bluebird');
const lodash = require('lodash');
const config = require('../../../config');
const util = require('../../../lib/util/util');
const { redisConnect } = require('../../../lib/redis/index');
const sinon = require('sinon');

// SOCKET
const socket = require('../../../lib/sockets/index');

describe('Redis', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects redisConnect.connect to ...', async () => {
        const createClientStub = sinon.stub(redis, 'createClient').returns({
            on: (state, cb) => {
              console.log('ON')
              if (state === 'error') {
                console.log('lol error');
              } else {
                console.log('nah not an error');
              }
            },
            subscribe: (channel) => {
              console.log(`Subscription Channel ${channel}`)
            }
        });

        const socketStub = sinon.stub(socket, 'socketIO').returns({ sockets: 
            sinon.stub().returns({
            emit: sinon.stub().returns(
                (arg1, arg2, arg3) => {
                    return 'Test'
                })
            })
        });
        
        const lodashStub = sinon.stub(lodash, 'omit');

        await redisConnect.connect();

        sinon.assert.called(createClientStub);
    });
});