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

  before(function(done){
    seed.runSeed().then(async () => {
      regionID = await Region.collection.findOne().then(region => region._id);
      vendor = await Vendor.collection.findOne({"regionID": await regionID});
      done();
    });
  });

  describe('GET', function() {
    it('should get /vendor/:regionID', function(done) {
      chai.request(server)
        .get(`/vendor/${regionID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.be.equal(2);
          done();
        });
    });

    it('should get /vendor/:regionID with a complicated query string', function(done) {
      chai.request(server)
        .get(`/vendor/${regionID}/?price=$$$$&categories[]=Mexican&categories[]=Chinese`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body[0].categories).to.include('Mexican');
          expect(res.body.length).to.be.equal(1);
          done();
        });
    });

    it('should get /vendor/:regionID/:vendorID', function(done) {
      chai.request(server)
        .get(`/vendor/${regionID}/${vendor._id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body._id).to.have.same.id(vendor._id);
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
