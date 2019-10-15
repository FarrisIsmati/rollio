// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
// LIB
const locationOps = require('../../lib/bin/location-ops');

describe('Location Ops', async () => {
  it('Expect coordinates 32.8328,-117.2713 to return the address 6903 Fay Ave, La Jolla, CA 92037, USA', async () => {
    const payload = {
      geo: {
        coordinates: [32.8328, -117.2713],
      },
    };
    const expectedRes = {
      locationDate: undefined,
      address: '6903 Fay Ave, La Jolla, CA 92037, USA',
      city: 'San Diego',
      neighborhood: 'La Jolla',
      coordinates: [32.8328, -117.2713],
    };
    const res = await locationOps.reverseGeolocation(payload);
    expect(res).to.be.deep.equal(expectedRes);
  });
});
