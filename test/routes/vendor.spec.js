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
const Vendor              = mongoose.model('Vendor');

//CHAI ADD-ONS
chai.use(chaiHttp);

//TESTS
describe('Vendor Routes', function() {
  let regionID;
  let vendor;

  beforeEach(function(done){
    seed.runSeed().then(async () => {
      regionID = await Region.collection.findOne().then(region => region._id);
      vendor = await Vendor.collection.findOne({"regionID": await regionID});

      const test = await Vendor.collection.findOne({
        "regionID": regionID
      }).then(yes => console.log(yes));

      done();
    });
  });

  describe('GET', function() {
      it('should get /vendors', function(done) {

//NEXT TIME FIGURE OUT WHY THIS ISN"T WORKING



        chai.request(server)
          .get('/vendor')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.equal(2);
            done();
          });
      });
  });

  afterEach(function(done) {
    seed.emptyRegionsCollection()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
