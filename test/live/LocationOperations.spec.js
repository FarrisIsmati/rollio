//DEPENDENCIES
const mongoose            = require('../../lib/db/schemas/AllSchemas');
const LocationOperations  = require('../../lib/live/location/LocationOperations');
const chai                = require('chai');
const expect              = chai.expect;

//LIVE DATA OPERATIONS
describe('DataOperations', function() {
  const twitterOutput = {
    id_str: '1059635881387192320',
    created_at: 'Tue Nov 06 02:37:35 +0000 2018',
    text: 'test tweet',
    user: {
      id: 1053649707493404700,
      id_str: '1053649707493404678',
      name: 'dcfoodtrucks',
      screen_name: 'dcfoodtrucks1'
    },
    geo: {
      coordinates: [38.88441446,-77.09551149]
    }
  }

  const twitterOutputGeo = {
    locationDate: 'Tue Nov 06 01:56:36 +0000 2018',
    address: '3114 10th St N, Arlington, VA 22201, USA',
    coordinates: [38.88441446,-77.09551149]
  }

  let locationOperation = new LocationOperations();

  describe('getGeolocation', function() {
    it('Expect getGeolocation to be a function', function(done) {
      expect(locationOperation.getGeolocation).to.be.a('function');
      done();
    });

    it('Expect getGeolocation to return a geocoded address given the proper payload', async function() {
      const twOutGeo = Object.assign({...twitterOutput, geo: {
        coordinates: [...twitterOutputGeo.coordinates]
      }});
      const res = await locationOperation.getGeolocation(twOutGeo);
      expect(res.address).to.be.equal(twitterOutputGeo.address);
    });
  })
});
