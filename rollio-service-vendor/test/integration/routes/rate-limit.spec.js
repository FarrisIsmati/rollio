// DEPENDENCIES
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');
const sinonExpressMock = require('sinon-express-mock');

const { mockReq, mockRes } = sinonExpressMock;
const redis = require('../../../lib/redis/index');
const { client } = redis.redisClient;
const { routeLimitVendorOp } = require('../../../lib/routes/middleware/rate-limit');

chai.use(sinonChai);

describe('Rate Limit Middleware', () => {
  const body = {
    method: 'testMethod',
    path: 'testPath',
    params: {
      regionID: 'testId',
      vendorID: 'testId',
    },
    connection: {
      remoteAddress: 'testIP:123',
    },
  };

  const key = `rl::method::${body.method}::path::${body.path}::regionID::${body.params.regionID}::vendorID::${body.params.vendorID}`;

  const req = mockReq(body);
  const res = mockRes();

  it('expect routeLimitVendorOp to successfully add an IP to a path', async () => {
    const result = await routeLimitVendorOp(req, res);

    expect(result).to.be.true;
  });

  it('expect routeLimitVendorOp to fail to add the same IP to the same path', async () => {
    const resultFirst = await routeLimitVendorOp(req, res);
    const resultSecond = await routeLimitVendorOp(req, res);

    expect(resultFirst).to.be.true;
    expect(resultSecond).to.be.null;
  });

  it('expect routeLimitVendorOp to successfully add two IPs to the same path', async () => {
    const req2 = mockReq({ ...body, connection: { remoteAddress: 'testIP:456' } });
    const resultFirst = await routeLimitVendorOp(req, res);
    const resultSecond = await routeLimitVendorOp(req2, res);

    expect(resultFirst).to.be.true;
    expect(resultSecond).to.be.true;
  });

  afterEach((done) => {
    client.del(key);
    done();
  });
});
