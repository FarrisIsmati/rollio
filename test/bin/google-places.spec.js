// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
// LIB
const googlePlaces = require('../../lib/bin/google-places');

describe('Google Places', async () => {
  it('expect googlePlaces to return an array', async () => {
    const res = await googlePlaces.search('');
    expect(res).to.be.an('array');
  });

  it('expect googlePlaces to return an array of length 1', async () => {
    const res = await googlePlaces.search('h and 22nd, dc');
    expect(res.length).to.be.equal(1);
  });

  it('expect googlePlaces to return the address "1025 F St NW, Washington, DC 20005, USA"', async () => {
    const res = await googlePlaces.search('h and 22nd, dc');
    expect(res[0].formatted_address).to.be.equal('1025 F St NW, Washington, DC 20005, USA');
  });
});
