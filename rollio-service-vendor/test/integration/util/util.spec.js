// DEPENDENCIES
const chai = require('chai');
const util = require('../../../lib/util/util');

const { expect } = chai;

describe('Util', () => {
  describe('Backoff', () => {
    it('Expect backoff to take 1 second long when passing one', () => {
      const time = util.backoff(1);
      expect(time).to.equal(1000);
    });
  });
});
