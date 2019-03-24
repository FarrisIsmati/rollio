//DEPENDENCIES
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const sinonExpressMock = require('sinon-express-mock');
const { mockReq, mockRes } = sinonExpressMock;
const client = require('../../lib/db/redis/index');

//MIDDLEWARE
const { checkCache } = require('../../lib/routes/middleware/db-operations');

chai.use(sinonChai);

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
