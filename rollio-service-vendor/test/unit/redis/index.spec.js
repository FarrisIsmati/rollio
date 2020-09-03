/* eslint-disable no-console */
// DEPENDENCIES
const redis = require('redis');
const lodash = require('lodash');
const { redisConnect } = require('../../../lib/redis/index');
const sinon = require('sinon');

// SOCKET
const socket = require('../../../lib/sockets/index');
const { expect } = require('chai');

describe('Redis', () => {
  beforeEach(() => {
    sinon.stub(socket, 'socketIO').returns({ sockets: 
      sinon.stub().returns({
      emit: sinon.stub().returns(
        (arg1, arg2, arg3) => {
            return 'Test'
        })
      })
    });
    
    sinon.stub(lodash, 'omit');
  });

  afterEach(() => {
      sinon.restore();
  });

  it('expects redisConnect.connect to call correct number of client invocations by argument', async () => {
    let errorInvocationCount = 0;
    let readyInvocationCount = 0;
    let messageInvocationCount = 0;

    sinon.stub(redis, 'createClient').returns({
      on: (state, cb) => {
        if (state === 'error') {
          errorInvocationCount++;
        } else if (state === 'ready') {
          readyInvocationCount++;
        } else if (state === 'message') {
          messageInvocationCount++;
        }
      },
      subscribe: (channel) => {
        return true
      }
    });

    await redisConnect.connect();

    expect(readyInvocationCount).to.be.equal(3);
    expect(errorInvocationCount).to.be.equal(3);
    expect(messageInvocationCount).to.be.equal(1);
  });
});