// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../lib/db/mongo/mongoose/index');
const { app } = require('../../index');
const { JWT_SECRET } = require('../../config');

const { expect } = chai;

// OPERATIONS
const { incrementVendorConsecutiveDaysInactive } = require('../../lib/db/mongo/operations/vendor-ops');

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');
const seedData = require('../../lib/db/mongo/data/dev');

// SCHEMAS
const Region = mongoose.model('Region');
const Vendor = mongoose.model('Vendor');
const User = mongoose.model('User');

chai.use(chaiHttp);

describe('Vendor Routes', () => {
  let regionID;
  let vendor;
  let locationID;
  let userLocationID;

  beforeEach((done) => {
    seed.runSeed().then(async () => {
      regionID = await Region.findOne().then(region => region._id);
      vendor = await Vendor.findOne({
        regionID: await regionID, 'locationHistory.0': { $exists: true }, 'userLocationHistory.0': { $exists: true },
      });
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
            expect(String(res.body._id)).to.equal(String(vendor._id));
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

    describe('/vendor/:regionID/:vendorID/update', () => {
      let allUsers;
      let customer;
      let selectedVendorUser;
      let secondVendorUser;
      let admin;
      let customerToken;
      let selectedVendorUserToken;
      let secondVendorToken;
      let regionId;
      let adminToken;
      let selectedVendor;
      const data = { field: ['dailyActive', 'type'], data: [true, 'airstream'] };

      beforeEach((done) => {
        seed.runSeed().then(async () => {
          allUsers = await User.find().select('+twitterProvider');
          regionId = await Region.findOne().then(region => region._id);
          customer = allUsers.find(user => user.type === 'customer');
          customerToken = jwt.sign({
            id: customer._id,
          }, JWT_SECRET, { expiresIn: 60 * 60 });
          admin = allUsers.find(user => user.type === 'admin');
          adminToken = jwt.sign({
            id: admin._id,
          }, JWT_SECRET, { expiresIn: 60 * 60 });
          const vendors = allUsers.filter(user => user.type === 'vendor' && user.vendorID);
          [selectedVendorUser] = vendors;
          selectedVendorUserToken = jwt.sign({
            id: selectedVendorUser._id,
          }, JWT_SECRET, { expiresIn: 60 * 60 });
          secondVendorUser = vendors[1];
          secondVendorToken = jwt.sign({
            id: secondVendorUser._id,
          }, JWT_SECRET, { expiresIn: 60 * 60 });
          selectedVendor = await Vendor.findOne({ _id: selectedVendorUser.vendorID });
          done();
        });
      });

      it('expect 403 error if no auth token passed', (done) => {
        chai.request(app)
          .put(`/vendor/${regionId}/${selectedVendor._id}/update`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });

      it('expect 403, if user is just a customer', (done) => {
        chai.request(app)
          .put(`/vendor/${regionID}/${selectedVendor._id}/update`)
          .set('Authorization', `Bearer ${customerToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });

      it('expect 403, if user is just a vendor, but trying to update a different vendor', (done) => {
        chai.request(app)
          .put(`/vendor/${regionID}/${selectedVendor._id}/update`)
          .set('Authorization', `Bearer ${secondVendorToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });

      it('expect 404, if vendorID does not match any vendors in the system', (done) => {
        chai.request(app)
          .put(`/vendor/${regionID}/${ObjectId()}/update`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });

      // it('expect 200 and successful update if vendor updates a vendor they own', (done) => {
      //   chai.request(app)
      //     .put(`/vendor/${regionID}/${selectedVendor._id}/update`)
      //     .set('Authorization', `Bearer ${selectedVendorUserToken}`)
      //     .send(data)
      //     .end((err, res) => {
      //       expect(res).to.have.status(200);
      //       data.field.forEach((field, index) => {
      //         expect(res.body.vendor[field]).to.be.equal(data.data[index]);
      //       });
      //       done();
      //     });
      // });

      it('expect 200 and successful update if an admin updates a vendor', (done) => {
        chai.request(app)
          .put(`/vendor/${regionID}/${selectedVendor._id}/update`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(200);
            data.field.forEach((field, index) => {
              expect(res.body.vendor[field]).to.be.equal(data.data[index]);
            });
            done();
          });
      });
    });
  });

  describe('POST', () => {
    let allUsers;
    let customer;
    let vendorUser;
    let admin;
    let customerToken;
    let vendorToken;
    let regionId;
    let adminToken;
    const baseData = {
      name: 'fake truck', type: 'mobileTruck', description: 'blah blah', creditCard: 'y',
    };
    const defaultData = {
      approved: false,
      dailyActive: false,
      consecutiveDaysInactive: 0,
      __v: 0,
      categories: [],
      comments: [],
      locationHistory: [],
      menu: [],
      tweetHistory: [],
      userLocationHistory: [],
    };

    beforeEach((done) => {
      seed.runSeed().then(async () => {
        allUsers = await User.find().select('+twitterProvider');
        regionId = await Region.findOne().then(region => region._id);
        customer = allUsers.find(user => user.type === 'customer');
        customerToken = jwt.sign({
          id: customer._id,
        }, JWT_SECRET, { expiresIn: 60 * 60 });
        admin = allUsers.find(user => user.type === 'admin');
        adminToken = jwt.sign({
          id: admin._id,
        }, JWT_SECRET, { expiresIn: 60 * 60 });
        vendorUser = allUsers.find(user => user.type === 'vendor' && !user.vendorID);
        vendorToken = jwt.sign({
          id: vendorUser._id,
        }, JWT_SECRET, { expiresIn: 60 * 60 });
        done();
      });
    });


    describe('/vendor/:regionID/new', () => {
      it('expect 403 error if no auth token passed', (done) => {
        const data = { ...baseData, twitterID: 'test' };
        chai.request(app)
          .post(`/vendor/${regionId}/new`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });

      it('expect 403, if user is just a customer', (done) => {
        const data = { ...baseData, twitterID: 'notOverridden' };
        chai.request(app)
          .post(`/vendor/${regionID}/new`)
          .set('Authorization', `Bearer ${customerToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });

      it('expect 500 if required fields are missing', (done) => {
        const data = { twitterID: 'blah' };
        chai.request(app)
          .post(`/vendor/${regionID}/new`)
          .set('Authorization', `Bearer ${vendorToken}`)
          .send(data)
          .then((res) => {
            expect(res).to.have.status(500);
            expect(res.body.message.includes('Vendor validation')).to.be.true;
            done();
          });
      });

      it('expect vendor to be created with twitterID matching the vendor twitter id, if user is a vendor', (done) => {
        const data = { ...baseData, twitterID: 'overridden' };
        chai.request(app)
          .post(`/vendor/${regionId}/new`)
          .set('Authorization', `Bearer ${vendorToken}`)
          .send(data)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.deep.equal({
              vendor: {
                ...data,
                ...defaultData,
                twitterID: String(vendorUser.twitterProvider.id),
                regionID: regionId.toString(),
                creditCard: 'y',
                description: 'blah blah',
                _id: res.body.vendor._id,
                updateDate: res.body.vendor.updateDate,
                date: res.body.vendor.date,
              },
            });
            return res.body.vendor;
          })
        // should also update the user's vendorID field with the newly created vendor's id
          .then(newVendor => User.findOne({ _id: vendorUser._id, vendorID: newVendor._id }))
          .then((updatedVendor) => {
            expect(!!updatedVendor).to.be.true;
            done();
          });
      });

      it('expect vendor to be created , if user is an admin', (done) => {
        const data = { ...baseData, twitterID: 'notOverridden' };
        chai.request(app)
          .post(`/vendor/${regionID}/new`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.deep.equal({
              vendor: {
                ...data,
                ...defaultData,
                approved: true,
                twitterID: data.twitterID,
                regionID: regionId.toString(),
                creditCard: 'y',
                description: 'blah blah',
                _id: res.body.vendor._id,
                updateDate: res.body.vendor.updateDate,
                date: res.body.vendor.date,
              },
            });
            done();
          });
      });
    });
  });

  afterEach((done) => {
    seed.emptySeed()
      .then(() => done());
  });
});
