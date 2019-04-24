// ENV
require('dotenv').config();

// DEPENDENCIES
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  formatter: null,
});

module.exports = {
  reverseGeolocation: async (e) => {
    const reverseGeocode = await geocoder
      .reverse({ lat: e.geo.coordinates[0], lon: e.geo.coordinates[1] });
    const geolocation = {
      locationDate: e.created_at,
      address: reverseGeocode[0].formattedAddress,
      city: reverseGeocode[0].city,
      neighborhood: reverseGeocode[0].extra.neighborhood,
      coordinates: [...e.geo.coordinates],
    };
    return geolocation;
  },
};
