//DEPENDENCIES
const mongoose = require('../../lib/db/mongo/mongoose/index');
const server = require('../../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
//SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');
//SCHEMAS
const Region = mongoose.model('Region');
const Vendor = mongoose.model('Vendor');

chai.use(chaiHttp);

describe('Vendor Routes', function() {
  let regionID;
  let vendor;
  let locationID;
  let userLocationID;

  beforeEach(function(done){
    seed.runSeed().then(async () => {
      regionID = await Region.findOne().then(region => region._id);
      vendor = await Vendor.findOne({"regionID": await regionID});
      locationID = vendor.locationHistory[0]._id;
      userLocationID = vendor.userLocationHistory[0]._id;
      done();
    });
  });

  describe('GET', function() {
    describe('/vendor/:regionID', function() {
      it('expect to get all food trucks', function(done) {
        chai.request(server)
          .get(`/vendor/${regionID}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.equal(5);
            done();
          });
      });
    });

    describe('/vendor/:regionID/?querystring', function() {
      it('expect to get a vendor with the specified Query String: ?categories[]=Venezuelan&categories[]=Arepa', function(done) {
        chai.request(server)
          .get(`/vendor/${regionID}/?categories[]=Venezuelan&categories[]=Arepa`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body[0].categories).to.include('Venezuelan');
            expect(res.body[0].categories).to.include('Arepa');
            expect(res.body.length).to.be.equal(1);
            done();
          });
      });
    });

    describe('/vendor/:regionID/:vendorID', function() {
      it('expect to get a vendor', function(done) {
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
      it('expect a vendor locationHistory instance\'s accuracy to be increased by 1', async function() {
        const prevLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.locationHistory[0].accuracy);

        const res = await chai.request(server)
          .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
          .send({
            "type": "locationHistory",
            "locationID": locationID,
            "amount": 1
          });

        const updatedLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.locationHistory[0].accuracy);

        expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy + 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });

      it('expect a vendor locationHistory instance\'s accuracy to be decreased by 1', async function() {
        const prevLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.locationHistory[0].accuracy);

        const res = await chai.request(server)
          .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
          .send({
            "type": "locationHistory",
            "locationID": locationID,
            "amount": -1
          });

        const updatedLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.locationHistory[0].accuracy);

        expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy - 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });

      it('expect a vendor userLocationHistory instance\'s accuracy to be increased by 1', async function() {
        const prevLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.userLocationHistory[0].accuracy);

        const res = await chai.request(server)
          .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
          .send({
            "type": "userLocationHistory",
            "locationID": userLocationID,
            "amount": 1
          });

        const updatedLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.userLocationHistory[0].accuracy);

        expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy + 1);
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
        prevComments = await Vendor.findOne({ "_id": vendor._id })
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
        updatedComments = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.comments);
      });

      it('expect vendor comments length to be increased by 1', function(done) {
        expect(updatedComments.length).to.be.equal(prevComments.length + 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
        done();
      });

      it(`expect new comment in vendor to be '${commentText}'`, function(done) {
        expect(updatedComments[0].text).to.be.equal(commentText);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  afterEach(function(done) {
    seed.emptyRegions()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
});
