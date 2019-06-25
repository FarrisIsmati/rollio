// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
// LIB
const googlePlaces = require('../../lib/bin/google-places');

describe('Google Places', async () => {
  describe('Search Method', () => {
    it('expect googlePlaces search return a promise', async () => {
      const res = googlePlaces.search('');
      expect(res).to.be.a('promise');
    });

    it('expect googlePlaces search to resolve an array', async () => {
      const res = await googlePlaces.search('');
      expect(res).to.be.an('array');
    });

    it('expect googlePlaces search to resolve an array of length 1 given the address h and 22nd, dc', async () => {
      const res = await googlePlaces.search('h and 22nd, dc');
      expect(res.length).to.be.equal(1);
    });

    it('expect googlePlaces search to resolve the address "2401 H St NW, Washington, DC 20037, USA"', async () => {
      const res = await googlePlaces.search('h and 22nd, dc');
      expect(res[0].formatted_address).to.be.equal('2401 H St NW, Washington, DC 20037, USA');
    });
  });

  describe('Neighborhood from coordinates', () => {
    it('expect googlePlaces neighborhoodFromCoords to return a promise', async () => {
      const res = googlePlaces.neighborhoodFromCoords(38.906483, -77.005863);
      expect(res).to.be.a('promise');
    });

    it('expect googlePlaces neighborhoodFromCoords to resolve the neighborhood noma from coordinates 38.906483, -77.005863', async () => {
      const res = await googlePlaces.neighborhoodFromCoords(38.906483, -77.005863);
      expect(res).to.be.equal('noma');
    });
  });
});
