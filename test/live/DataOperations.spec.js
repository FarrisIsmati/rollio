//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const DataOperations      = require('../../controllers/live/operations/DataOperations');
const chai                = require('chai');
const expect              = chai.expect;

//OPERATIONS
const vendorOperations    = require('../../controllers/db/operations/vendorOperations');
const regionOperations    = require('../../controllers/db/operations/regionOperations');

//SCHEMAS
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

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

  let dataOps = new DataOperations('WASHINGTONDC');

  //TEST VENDOR ADDRESS UPDATE HERE
  //SAMPLE PAYLOAD DATA
  // { tweetID: 'as6',
  // twitterID: '890432286',
  // date: 2016-05-18T16:00:00.000Z,
  // match: true,
  // certainty: 'partial',
  // rgxMatch: 'Foggy Bottom today',
  // tweet: 'We’re in Foggy Bottom today, DC! Corner of H and 22nd from 11-1:30.',
  // location:
  //  { locationDate: 2016-05-18T16:00:00.000Z,
  //    accuracy: 0,
  //    address: '0079 0064, Washington, DC 20052',
  //    city: 'dc',
  //    neighborhood: 'foggy bottom',
  //    coordinates: [ 38.899291, -77.047859 ],
  //    matchMethod: 'Tweet regex match' } }
});
