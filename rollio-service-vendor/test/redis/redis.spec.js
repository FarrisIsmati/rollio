// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const { client, pub, sub } = require('../../lib/redis/index');

// TESTS
describe('Redis Config', () => {
  it('Expect Redis client to be connected', () => {
    expect(client.connected).to.be.true;
  });

  it('Expect Redis client to be connected', () => {
    expect(client.ready).to.be.true;
  });

  it('Expect Redis client to have functions that return a promise', () => {
    expect(client.getAsync).to.be.a('function');
  });
});
