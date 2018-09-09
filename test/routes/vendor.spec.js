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

    it('should get /vendor/:regionID/?price=$$$$&categories[]=Mexican&categories[]=Chinese', function(done) {
      chai.request(server)
        .get(`/vendor/${regionID}/?price=$$$$&categories[]=Mexican&categories[]=Chinese`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body[0].categories).to.include('Mexican');
          expect(res.body[0].categories).to.include('Chinese');
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

  describe('PUT', function() {
    it('should put /vendor/:regionID/:vendorID/locationaccuracy vendor locationAccuracy increased by 1', async function() {
      const prevLocationAccuracy = await Vendor.collection.findOne({ "_id": vendor._id })
      .then(vendor => vendor.locationAccuracy);

      const res = await chai.request(server)
        .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
        .send({
          "amount": 1
        });

      const updatedLocationAccuracy = await Vendor.collection.findOne({ "_id": vendor._id })
      .then(vendor => vendor.locationAccuracy);

      expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy + 1);
      expect(res.body.nModified).to.be.equal(1);
      expect(res).to.have.status(200);
    });

    it('should put /vendor/:regionID/:vendorID/locationaccuracy vendor locationAccuracy decreased by 1', async function() {
      const prevLocationAccuracy = await Vendor.collection.findOne({ "_id": vendor._id })
      .then(vendor => vendor.locationAccuracy);

      const res = await chai.request(server)
        .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
        .send({
          "amount": -1
        });

      const updatedLocationAccuracy = await Vendor.collection.findOne({ "_id": vendor._id })
      .then(vendor => vendor.locationAccuracy);

      expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy - 1);
      expect(res.body.nModified).to.be.equal(1);
      expect(res).to.have.status(200);
    });
  });

  afterEach(function(done) {
    seed.emptyRegionsCollection()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
