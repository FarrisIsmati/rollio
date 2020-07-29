// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('../../../lib/db/mongo/mongoose/index');
const { app } = require('../../../index');
const { JWT_SECRET } = require('../../../config');

const { expect } = chai;


// SEED
const seed = require('../../../lib/db/mongo/seeds/dev-seed');

// SCHEMAS
const Location = mongoose.model('Location');
const User = mongoose.model('User');

chai.use(chaiHttp);

describe('Vendor Routes', () => {
  const state = {};

  beforeEach((done) => {
    seed.runSeed().then(async () => {
      state.allUsers = await User.find({}).select('+twitterProvider').lean();
      state.locations = await Location.find({}).sort([['startDate', -1]]).lean();
      const customer = state.allUsers.find(user => user.type === 'customer');
      state.customerToken = jwt.sign({
        id: customer._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      const admin = state.allUsers.find(user => user.type === 'admin');
      state.adminToken = jwt.sign({
        id: admin._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      state.vendorUser = state.allUsers.find(user => user.type === 'vendor' && state.locations.some(location => String(location.vendorID) === String(user.vendorID)));
      state.vendorToken = jwt.sign({
        id: state.vendorUser._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      done();
    });
  });

  describe('GET', () => {
    describe('/locations/filter', () => {
      it('expect to get all locations, sorted by startDate as admin', (done) => {
        chai.request(app)
          .get('/locations/filter')
          .set('Authorization', `Bearer ${state.adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.locations).to.be.a('array');
            expect(res.body.locations.map(location => location._id)).to.deep.equal(state.locations.map(location => String(location._id)));
            done();
          });
      });

      it('expect to get all locations for that vendor, sorted by startDate as vendor', (done) => {
        const { vendorID } = state.vendorUser;
        chai.request(app)
          .get('/locations/filter')
          .set('Authorization', `Bearer ${state.vendorToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.locations).to.be.a('array');
            expect(!!res.body.locations.length).to.be.true;
            expect(res.body.locations.map(location => location._id)).to.deep.equal(state.locations.filter(location => String(location.vendorID) === String(vendorID)).map(location => String(location._id)));
            done();
          });
      });

      it('expect to error as regular customer', (done) => {
        chai.request(app)
          .get('/locations/filter')
          .set('Authorization', `Bearer ${state.customerToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });
    });
  });

  after((done) => {
    seed.emptySeed()
      .then(() => done());
  });
});
