//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const server              = require('../../server');
const chai                = require('chai');
const expect              = chai.expect;
const chaiHttp            = require('chai-http');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

//SCHEMAS
const Region              = mongoose.model('Region');

//CHAI ADD-ONS
chai.use(chaiHttp);

//TESTS
describe('Region Routes', function() {
  let regionID;

  before(function(done){
    seed.runSeed().then(async () => {
      regionID = await Region.collection.findOne().then(region => region._id);
      done();
    });
  });

  describe('GET', function() {
      it('should get /region/:id', function(done) {
        chai.request(server)
          .get('/region/' + regionID)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body._id).to.have.same.id(regionID);
            done();
          });
      });
  });

  after(function(done) {
    seed.emptyRegionsCollection()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
