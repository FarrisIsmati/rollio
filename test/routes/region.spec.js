//DEPENDENCIES
const mongoose = require('../../lib/db/mongo/mongoose/index');
const server = require('../../index');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
//SEED
const seed                = require('../../lib/db/mongo/seeds/dev-seed');
//SCHEMAS
const Region = mongoose.model('Region');

chai.use(chaiHttp);

describe('Region Routes', function() {
  let regionID;

  before(function(done){
    seed.runSeed().then(async () => {
      regionID = await Region.findOne().then(region => region._id);
      done();
    });
  });

  describe('GET', function() {
    describe('/region/:id', function() {
      it('expect to get a region', function(done) {
        chai.request(server)
          .get('/region/' + regionID)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body._id).to.have.same.id(regionID);
            done();
          });
      });
    });
  });

  after(function(done) {
    seed.emptyRegions()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
