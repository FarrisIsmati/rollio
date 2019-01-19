//TESTS REDIS CONFIG

//DEPENDENCIES
const chai        = require('chai');
const expect      = chai.expect;
const client      = require('../../lib/config/redis');

//TESTS
describe('Redis Config', function() {
  it('Expect Redis client to be connected', function() {
    expect(client.connected).to.be.true;
  });

  it('Expect Redis client to be connected', function() {
    expect(client.ready).to.be.true;
  });

  it('Expect Redis client to have functions that return a promise', function() {
    expect(client.getAsync).to.be.a('function');
  });
});
