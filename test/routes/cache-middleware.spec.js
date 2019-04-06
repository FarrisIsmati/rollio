//DEPENDENCIES
const mongoose = require('../../lib/db/mongo/mongoose/index');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const sinonExpressMock = require('sinon-express-mock');
const { mockReq, mockRes } = sinonExpressMock;
const client = require('../../lib/db/redis/index');
//MIDDLEWARE
const { checkCache, regionRouteOps, vendorRouteOps } = require('../../lib/routes/middleware/db-operations');
//SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
//SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

chai.use(sinonChai);

describe('Cache Middleware', function() {
  const regionName = 'WASHINGTONDC';
  let regionId;
  let vendorId;
  const twitterId = '1053649707493404678';

  before(async function() {
    await seed.runSeed().then(async () => {
      regionId = await Region.findOne({'name': regionName}).then(region => region._id);
      vendorId = await Vendor.findOne({
        'regionID': regionId,
        'twitterID': twitterId
      })
      .then(vendor => vendor._id);
    });
  });

  afterEach(async function() {
    await client.flushallAsync();
  })

  describe('Check Cache Method', function() {
    const body = {
      method: 'testGETCache',
      path: 'testPATHCache',
      params: {
        id: 'region123'
      }
    }

    const req = mockReq(body);
    const res = mockRes();

    const payload = {
      collectionKey: 'region',
      queryKey: `q::method::${req.method}::regionID::${req.path}`,
      ops: () => 'test123'
    }

    beforeEach(async function() {
      await client.delAsync(payload.collectionKey, `q::method::${req.method}::regionID::${req.path}`);
    })

    it('expect to set data to a route that is not found in the cache', async function() {
      const checkCacheRes = await checkCache(req, res, payload);
      expect(checkCacheRes).to.equal(payload.ops());
    });

    it('expect to set data to a route that is found in the cache', async function() {
      const data = '123test';
      const updatedPayload = { ...payload, ops: (req, res, cb) => {
        return cb(data)
      }}

      //Cache the data
      await checkCache(req, res, updatedPayload);
      //See if data was cached
      const value = await client.hgetAsync(payload.collectionKey, payload.queryKey)

      expect(value).to.equal(JSON.stringify(data));
    });
  });

  describe('Get Region Route Ops Method', function() {
    let body;
    let req;
    let res;

    before(function(){
       body = {
        method: 'GET',
        path: regionId.toString(),
        params: {
          id: regionId
        }
      }
       req = mockReq(body);
       res = mockRes();
    });

    it('expect Region Route Operations getRegionId method to save the req path into the cache', async function() {
      const isInCacheBefore = await client.hgetAsync('region', `q::method::GET::path::${regionId}`);
      await regionRouteOps.getRegionId(req, res);
      const isInCacheAfter = await client.hgetAsync('region', `q::method::GET::path::${regionId}`)
      .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter).to.be.a('object');
      expect(isInCacheAfter.name).to.be.equal(regionName);
    });
  });

  describe('Get Vendor Route Ops Method', function() {
    let body;
    let req;
    let res;

    before(function(){
      body = {
        method: 'GET',
        path: `${regionId.toString()}`,
        params: {
          regionID: regionId
        }
      }
      req = mockReq(body);
      res = mockRes();
    });

    it('expect Vendor Route Operations getVendors method to save the req NON QS path into the cache', async function() {
      const isInCacheBefore = await client.hgetAsync('vendor', `q::method::GET::path::${regionId}`);
      await vendorRouteOps.getVendors(req, res);
      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::${regionId}`)
      .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter).to.be.an('array');
      expect(isInCacheAfter[0]).to.have.own.property('twitterID');
    });

    it('expect Vendor Route Operations getVendors method to save the req QS path into the cache', async function() {
      body = {
        ...body,
        query: {
          creditCard: 'y'
        }
      }
      req = mockReq(body);

      const isInCacheBefore = await client.hgetAsync('vendor', `q::method::GET::path::${regionId}::query::{"creditCard":"y"}`);
      await vendorRouteOps.getVendors(req, res);
      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::${regionId}::query::{"creditCard":"y"}`)
      .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter).to.be.an('array');
      expect(isInCacheAfter[0]).to.have.own.property('creditCard');
    });
  });

  after(function(done) {
    seed.emptyRegions()
    .then(() => seed.emptyVendors())
    .then(() => done());
  });
})
