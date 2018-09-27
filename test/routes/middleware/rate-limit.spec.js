//TESTS REDIS CONFIG

//DEPENDENCIES
const chai                                = require('chai');
const expect                              = chai.expect;
const redisClient                         = require('../../../controllers/db/redis-config');
const { limitSingleVendorRouteReq }       = require('../../controllers/routes/middleware/rate-limit');

//TESTS
describe('Rate Limit Middleware', function() {
  const keys = [];

  //BRING IN ROUTES AND TEST REDIS DB <- That's an integration TEST
  //Instead try mocking req, res, next
  //READ THIS
  //https://codeburst.io/unit-testing-in-express-with-promise-based-middleware-and-controllers-7d3d59ae61f8

  afterEach(function(done) {
    for (let i = 0; i < keys.length; i++) {
      redisClient.del(keys[i]);)
    }

    done();
  });
});
