// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('../../lib/db/mongo/mongoose/index');
const { app } = require('../../index');

const { expect } = chai;

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

// SCHEMAS
const Region = mongoose.model('Region');

chai.use(chaiHttp);

describe('Region Routes', () => {
  let regionID;

  before((done) => {
    seed.runSeed().then(async () => {
      regionID = await Region.findOne().then(region => region._id);
      done();
    });
  });

  describe('GET', () => {
    describe('/region/:id', () => {
      it('expect to get a region', (done) => {
        chai.request(app)
          .get(`/region/${regionID}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body._id).to.have.same.id(regionID);
            done();
          });
      });
    });
  });

  describe('GET', () => {
    describe('/region/name/:name', () => {
      it('expect to get a region by name', (done) => {
        chai.request(app)
          .get('/region/name/WASHINGTONDC')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.be.equal('WASHINGTONDC');
            done();
          });
      });
    });
  });

  after((done) => {
    seed.emptyRegions()
      .then(() => seed.emptyVendors())
      .then(() => done());
  });
});
