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
    describe('/vendor/:regionID', function() {
      it('Expect to get all food trucks', function(done) {
        chai.request(server)
          .get(`/vendor/${regionID}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.equal(2);
            done();
          });
      });
    });

    describe('/vendor/:regionID/?querystring', function() {
      it('Expect to get a vendor with the specified Query String: ?price=$$$$&categories[]=Mexican&categories[]=Chinese', function(done) {
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
    });

    describe('/vendor/:regionID/:vendorID', function() {
      it('Expect to get a vendor', function(done) {
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
  });

  describe('PUT', function() {
    describe('/vendor/:regionID/:vendorID/locationaccuracy', function() {
      it('Expect vendor locationAccuracy to be increased by 1', async function() {
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

      it('Expect vendor locationAccuracy to be decreased by 1', async function() {
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

    describe('/vendor/:regionID/:vendorID/comments', function() {
      let prevComments;
      let res;
      let updatedComments;
      const commentText = 'new comment';

      beforeEach(async function() {
        prevComments = await Vendor.collection.findOne({ "_id": vendor._id })
        .then(vendor => vendor.comments);
        res = await chai.request(server)
          .put(`/vendor/${regionID}/${vendor._id}/comments`)
          .send({
            "field": "comments",
            "payload": {
              "commentDate": new Date("2019-12-12T12:10:00Z"),
              "text": commentText
            }
          });
        updatedComments = await Vendor.collection.findOne({ "_id": vendor._id })
        .then(vendor => vendor.comments);
      });

      it('Expect vendor comments length to be increased by 1', function() {
        expect(updatedComments.length).to.be.equal(prevComments.length + 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });

      it(`Expect new comment in vendor to be '${commentText}'`, async function() {
        expect(updatedComments[1].text).to.be.equal(commentText);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });
    });
  });

  afterEach(function(done) {
    seed.emptyRegionsCollection()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
