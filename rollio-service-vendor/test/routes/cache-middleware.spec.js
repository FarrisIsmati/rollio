// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');
const sinonExpressMock = require('sinon-express-mock');
const mongoose = require('../../lib/db/mongo/mongoose/index');

const { mockReq, mockRes } = sinonExpressMock;
const client = require('../../lib/db/redis/index');

// MIDDLEWARE
const { checkCache, regionRouteOps, vendorRouteOps } = require('../../lib/routes/middleware/db-operations');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

chai.use(sinonChai);

describe('Cache Middleware', () => {
  const regionName = 'WASHINGTONDC';
  const twitterId = '1053649707493404678';
  let regionId;
  let vendorId;

  before(async () => {
    await seed.runSeed().then(async () => {
      regionId = await Region.findOne({ name: regionName }).then(region => region._id);
      vendorId = await Vendor.findOne({
        regionID: regionId,
        twitterID: twitterId,
      })
        .then(vendor => vendor._id);
    });
  });

  afterEach(async () => {
    await client.flushallAsync();
  });

  describe('Check Cache Method', () => {
    const body = {
      method: 'testGETCache',
      path: 'testPATHCache',
      params: {
        id: 'region123',
      },
    };

    const req = mockReq(body);
    const res = mockRes();

    const payload = {
      collectionKey: 'region',
      queryKey: `q::method::${req.method}::regionID::${req.path}`,
      ops: () => 'test123',
    };

    beforeEach(async () => {
      await client.delAsync(payload.collectionKey, `q::method::${req.method}::regionID::${req.path}`);
    });

    it('expect to set data to a route that is not found in the cache', async () => {
      const checkCacheRes = await checkCache(req, res, payload);
      expect(checkCacheRes).to.equal(payload.ops());
    });

    it('expect to set data to a route that is found in the cache', async () => {
      const data = '123test';
      const updatedPayload = {
        ...payload,
        // eslint-disable-next-line no-shadow
        ops: (req, res, cb) => cb(data),
      };

      // Cache the data
      await checkCache(req, res, updatedPayload);
      // See if data was cached
      const value = await client.hgetAsync(payload.collectionKey, payload.queryKey);

      expect(value).to.equal(JSON.stringify(data));
    });
  });

  describe('Get Region Route Ops Method', () => {
    let body;
    let req;
    let res;

    before(() => {
      body = {
        method: 'GET',
        path: regionId.toString(),
        params: {
          id: regionId,
        },
      };
      req = mockReq(body);
      res = mockRes();
    });

    it('expect Region Route Operations getRegionId method to save the req path into the cache', async () => {
      const isInCacheBefore = await client.hgetAsync('region', `q::method::GET::path::${regionId}`);
      await regionRouteOps.getRegionId(req, res);
      const isInCacheAfter = await client.hgetAsync('region', `q::method::GET::path::${regionId}`)
        .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter).to.be.an('object');
      expect(isInCacheAfter.name).to.be.equal(regionName);
    });
  });

  describe('Get Vendor Route Ops Method', () => {
    let body;
    let res;

    before(() => {
      body = {
        method: 'GET',
        path: `/${regionId.toString()}`,
        params: {
          regionID: regionId,
        },
      };
      res = mockRes();
    });

    it('expect Vendor Route Operations getVendorById method to save the req path into the cache', async () => {
      const bodyVendorById = {
        ...body,
        path: `/${regionId.toString()}/${vendorId.toString()}`,
        params: {
          regionID: regionId,
          vendorID: vendorId,
        },
      };
      const reqVendorById = mockReq(bodyVendorById);

      const isInCacheBefore = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/${vendorId}`);
      await vendorRouteOps.getVendorById(reqVendorById, res);
      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/${vendorId}`)
        .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter).to.be.an('object');
      expect(isInCacheAfter).to.have.own.property('twitterID');
    });

    it('expect Vendor Route Operations getVendors method to save the req NON QS path into the cache', async () => {
      const reqGetVendors = mockReq(body);

      const isInCacheBefore = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}`);
      await vendorRouteOps.getVendors(reqGetVendors, res);
      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}`)
        .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter).to.be.an('array');
      expect(isInCacheAfter[0]).to.have.own.property('description');
    });

    it('expect Vendor Route Operations getVendorsAsObject method to return an object of equal length that of getVendors operation', async () => {
      const bodyObj = { ...body, path: `${body.path}/object`}
      const reqGetVendorsObj = mockReq(bodyObj);
      const reqGetVendors = mockReq(body);

      await vendorRouteOps.getVendorsAsObject(reqGetVendorsObj, res);
      const isInCacheAfterObject = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/object`)
        .then(cachedRes => JSON.parse(cachedRes));

      await vendorRouteOps.getVendors(reqGetVendors, res);
      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}`)
        .then(cachedRes => JSON.parse(cachedRes));

      const objectsLength = Object.keys(isInCacheAfterObject).length;
      const arrayLength = isInCacheAfter.length;

      expect(isInCacheAfterObject).to.be.an('object');
      expect(objectsLength).to.be.equal(arrayLength);
    });

    it('expect Vendor Route Operations getVendorsAsObject method to save the req NON QS path into the cache', async () => {
      const bodyObj = { ...body, path: `${body.path}/object`}
      const reqGetVendorsObj = mockReq(bodyObj);

      const isInCacheBefore = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/object`);
      await vendorRouteOps.getVendorsAsObject(reqGetVendorsObj, res);
      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/object`)
        .then(cachedRes => JSON.parse(cachedRes));

      const firstKey = Object.keys(isInCacheAfter)[0];

      expect(isInCacheBefore).to.be.null;
      expect(isInCacheAfter[firstKey]).to.have.own.property('description');
    });
  });

  describe('Put Vendor Route Ops Method', () => {
    let res;
    let locationId;

    before(async () => {
      locationId = await Vendor.findOne({ _id: vendorId })
        .then(vendor => vendor.locationHistory[0]._id);
      res = mockRes();
    });

    it('expect putRegionIdVendorIdLocationTypeLocationIDAccuracy method to clear the cache on path regionId/vendorId', async () => {
      const bodyPutVendorLocationAccuracy = {
        method: 'PUT',
        params: {
          regionID: regionId,
          vendorID: vendorId,
        },
        body: {
          type: 'locationHistory',
          locationID: locationId,
          amount: 1,
        },
      };
      const bodyVendorById = {
        method: 'GET',
        path: `/${regionId.toString()}/${vendorId.toString()}`,
        params: {
          regionID: regionId,
          vendorID: vendorId,
        },
      };
      const reqPutVendorLocationAccuracy = mockReq(bodyPutVendorLocationAccuracy);
      const reqVendorById = mockReq(bodyVendorById);

      await vendorRouteOps.getVendorById(reqVendorById, res);
      const isInCacheBefore = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/${vendorId}`)
        .then(cachedRes => JSON.parse(cachedRes));

      await vendorRouteOps
        .putRegionIdVendorIdLocationTypeLocationIDAccuracy(reqPutVendorLocationAccuracy, res);

      const isInCacheAfter = await client.hgetAsync('vendor', `q::method::GET::path::/${regionId}/${vendorId}`)
        .then(cachedRes => JSON.parse(cachedRes));

      expect(isInCacheBefore).to.be.an('object');
      expect(isInCacheAfter).to.be.null;
    });
  });

  after((done) => {
    seed.emptyRegions()
      .then(() => seed.emptyVendors())
      .then(() => done());
  });
});
