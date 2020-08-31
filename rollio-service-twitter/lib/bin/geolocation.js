// DEPENDENCIES
const NodeGeocoder = require('node-geocoder');
const config = require('../../config');

const geolocationOps = {
  geocoder: () => NodeGeocoder({
    provider: 'google',
    httpAdapter: 'https',
    apiKey: config.GOOGLE_MAPS_API_KEY,
    formatter: null,
  }),
  reverseGeolocation: async (e) => {
    const NodeGeocoder = await geolocationOps.geocoder();
    const reverseGeocode = await NodeGeocoder.reverse({ lat: e.geo.coordinates[0], lon: e.geo.coordinates[1] });

    const geolocation = {
      locationDate: e.created_at,
      address: reverseGeocode[0].formattedAddress,
      city: reverseGeocode[0].city,
      neighborhood: reverseGeocode[0].extra.neighborhood,
      coordinates: [...e.geo.coordinates],
    };

    return geolocation;
  }
};

module.exports = geolocationOps;
