const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const faker = require('faker');
const migrate = require('../index.js');
const { MONGO_CONNECT } = require('../../../../config');

const getUrl = () => {
  // just removes the db name at the end
  const splitMongoConnect = MONGO_CONNECT.split('/');
  const mongoBaseConnect = splitMongoConnect.slice(0, splitMongoConnect.length - 1).join('/');
  return `${mongoBaseConnect}/${faker.internet.password(6)}`;
};

const createConnection = async (url) => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 1,
  });
  await client.connect();
  const db = client.db();
  return { client, db };
};

const testUp = (url, migration) => migrate({
  url,
  locksCollection: crypto.randomBytes(8).toString('hex'),
  migrations: [migration],
}).then(async (results) => {
  const { client, db } = await createConnection(url);
  return {
    results, db, client,
  };
});

const verifyResults = (expect, results) => {
  Object.keys(results).forEach((resultId) => {
    expect(results[resultId].status).to.be.equal('ok');
  });
};


module.exports = {
  createConnection,
  testUp,
  verifyResults,
  getUrl,
};
