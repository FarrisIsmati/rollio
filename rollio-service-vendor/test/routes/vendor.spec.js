// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('../../lib/db/mongo/mongoose/index');
const { app } = require('../../index');

const { expect } = chai;

// OPERATIONS
const { incrementVendorConsecutiveDaysInactive } = require('../../lib/db/mongo/operations/vendor-ops');

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');
const seedData = require('../../lib/db/mongo/data/dev');

// SCHEMAS
const Region = mongoose.model('Region');
const Vendor = mongoose.model('Vendor');

chai.use(chaiHttp);

describe('Vendor Routes', () => {
  let regionID;
  let vendor;
  let locationID;
  let userLocationID;

  beforeEach((done) => {
    seed.runSeed().then(async () => {
      regionID = await Region.findOne().then(region => region._id);
      vendor = await Vendor.findOne({ regionID: await regionID });
      locationID = vendor.locationHistory[0]._id;
      userLocationID = vendor.userLocationHistory[0]._id;
      done();
    });
  });

  describe('GET', () => {
    describe('/vendor/:regionID', () => {
      it('expect to get all food trucks', (done) => {
        chai.request(app)
          .get(`/vendor/${regionID}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.equal(seedData.vendors.length);
            done();
          });
      });
    });

    describe('/vendor/:regionID/object', () => {
      it('expect to get an object back', (done) => {
        chai.request(app)
          .get(`/vendor/${regionID}/object`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(Object.keys(res.body).length).to.be.equal(seedData.vendors.length);
            done();
          });
      });
    });

    describe('Query String Route', () => {
      describe('/vendor/:regionID/?querystring', () => {
        it('expect to get a vendor with the specified Query String: ?categories[]=Venezuelan&categories[]=Arepa', (done) => {
          chai.request(app)
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

      describe('/vendor/:regionID/?querystring test that it returns updated data after searching for it (Making sure deleting cache functionality worked)', () => {
        it('expect to get a vendor with the specified Query String: ?categories[]=Venezuelan&categories[]=Arepa with incremented consecutive days inactive', async () => {
          const queryResBefore = await chai.request(app)
            .get(`/vendor/${regionID}/?categories[]=Venezuelan&categories[]=Arepa`);

          const queryResParsedBefore = JSON.parse(queryResBefore.res.text);
          const vendorID = queryResParsedBefore[0].id;
          const daysInactiveBefore = queryResParsedBefore[0].consecutiveDaysInactive;

          await incrementVendorConsecutiveDaysInactive(regionID, vendorID);

          const queryResAfter = await chai.request(app)
            .get(`/vendor/${regionID}/?categories[]=Venezuelan&categories[]=Arepa`);

          const queryResParsedAfter = JSON.parse(queryResAfter.res.text);

          const daysInactiveAfter = queryResParsedAfter[0].consecutiveDaysInactive;

          expect(daysInactiveAfter).to.equal(daysInactiveBefore + 1);
        });
      });
    });

    describe('/vendor/:regionID/:vendorID', () => {
      it('expect to get a vendor', (done) => {
        chai.request(app)
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

  describe('PUT', () => {
    describe('/vendor/:regionID/:vendorID/locationaccuracy', () => {
      it('expect a vendor locationHistory instance\'s accuracy to be increased by 1', async () => {
        const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorPrev => vendorPrev.locationHistory[0].accuracy);

        const res = await chai.request(app)
          .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
          .send({
            type: 'locationHistory',
            locationID,
            amount: 1,
          });

        const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorUpdated => vendorUpdated.locationHistory[0].accuracy);

        expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy + 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });

      it('expect a vendor locationHistory instance\'s accuracy to be decreased by 1', async () => {
        const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorPrev => vendorPrev.locationHistory[0].accuracy);

        const res = await chai.request(app)
          .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
          .send({
            type: 'locationHistory',
            locationID,
            amount: -1,
          });

        const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorUpdated => vendorUpdated.locationHistory[0].accuracy);

        expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy - 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });

      it('expect a vendor userLocationHistory instance\'s accuracy to be increased by 1', async () => {
        const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('userLocationHistory')
          .then(vendorPrev => vendorPrev.userLocationHistory[0].accuracy);

        const res = await chai.request(app)
          .put(`/vendor/${regionID}/${vendor._id}/locationaccuracy`)
          .send({
            type: 'userLocationHistory',
            locationID: userLocationID,
            amount: 1,
          });

        const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('userLocationHistory')
          .then(vendorUpdated => vendorUpdated.userLocationHistory[0].accuracy);

        expect(updatedLocationAccuracy).to.be.equal(prevLocationAccuracy + 1);
        expect(res.body.nModified).to.be.equal(1);
        expect(res).to.have.status(200);
      });
    });

    describe('/vendor/:regionID/:vendorID/comments', () => {
      let prevComments;
      let res;
      let updatedComments;
      const commentText = 'new comment';

      beforeEach(async () => {
        prevComments = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.comments);
        res = await chai.request(app)
          .put(`/vendor/${regionID}/${vendor._id}/comments`)
          .send({
            text: commentText,
          });
        updatedComments = await Vendor.findOne({ _id: vendor._id })
          .then(vendorUpdated => vendorUpdated.comments);
      });

      it('expect vendor comments length to be increased by 1', (done) => {
        expect(updatedComments.length).to.be.equal(prevComments.length + 1);
        expect(res).to.have.status(200);
        done();
      });

      it(`expect new comment in vendor to be '${commentText}'`, (done) => {
        expect(updatedComments[0].text).to.be.equal(commentText);
        expect(res).to.have.status(200);
        done();
      });

      it('expect new comment name in vendor to be Some Dude', (done) => {
        expect(updatedComments[0].name).to.be.equal('Some Dude');
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  afterEach((done) => {
    seed.emptyRegions()
      .then(() => seed.emptyVendors())
      .then(() => done());
  });
});
