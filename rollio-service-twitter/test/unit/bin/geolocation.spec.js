// DEPENDENCIES
const chai = require('chai');
const geolocationOps = require('../../../lib/bin/geolocation');
const sinon = require('sinon');

const { expect } = chai;

describe('Geolocation', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects reverseGeolocation to return an object with correct properties', async () => {
        const reverseGeocodeResult = {formattedAddress: 'address1', city: 'city1', extra: { neighborhood: 'neighborhood1' }};
        
        sinon.stub(geolocationOps, 'geocoder').returns({ reverse: sinon.stub().returns(
            [reverseGeocodeResult]
        )})

        const payload = {
            created_at: '01/01/20',
            geo: {
                coordinates: ['1.00', '-1.00']
            }
        };

        const expectedResult = {
            locationDate: payload.created_at,
            address: reverseGeocodeResult.formattedAddress,
            city: reverseGeocodeResult.city,
            neighborhood: reverseGeocodeResult.extra.neighborhood,
            coordinates: [...payload.geo.coordinates],
          };

        const result = await geolocationOps.reverseGeolocation(payload);

        expect(result.locationDate).to.be.equal(expectedResult.locationDate);
        expect(result.address).to.be.equal(expectedResult.address);
        expect(result.city).to.be.equal(expectedResult.city);
        expect(result.neighborhood).to.be.equal(expectedResult.neighborhood);
        expect(result.coordinates[0]).to.be.equal(expectedResult.coordinates[0]);
        expect(result.coordinates[1]).to.be.equal(expectedResult.coordinates[1]);
    });

});
