// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const { client, pub, sub } = require('../../lib/redis/index');

// CONFIG
const config = require('../../config');

// TESTS
describe('Redis Config', () => {
  it('Expect Redis client to be connected', () => {
    expect(client.connected).to.be.true;
  });

  it('Expect Redis client to have functions that return a promise', () => {
    expect(client.getAsync).to.be.a('function');
  });

  it('Expect Redis publisher to be connected', () => {
    expect(pub.ready).to.be.true;
  });

  it('Expect Redis subscriber to be connected', () => {
    expect(sub.ready).to.be.true;
  });

  it(`Expect Redis subscriber to be subscribed to ${config.REDIS_TWITTER_CHANNEL}`, () => {
    expect(sub.subscription_set[`subscribe_${config.REDIS_TWITTER_CHANNEL}`]).to.be.equal(config.REDIS_TWITTER_CHANNEL);
  });
});
