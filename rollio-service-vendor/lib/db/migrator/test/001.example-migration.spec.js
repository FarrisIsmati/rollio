// DEPENDENCIES
const chai = require('chai');
const chaid = require('chaid');

chai.use(chaid);
const { expect } = chai;
const { ObjectId } = require('mongodb');
const {
  testUp, verifyResults, createConnection, getUrl,
} = require('./utils.js');
const migration = require('../migrations/001.example-migration');

describe('example migration', () => {
  const state = {};
  before(async () => {
    state.url = getUrl();
    const { db, client } = await createConnection(state.url);
    state.db = db;
    state.client = client;
    // the example migration I made sets any vendor with the name '1' to have 1 numTrucks
    // it's just a dumb example to test that this all works
    state.vendorToUpdate = {
      _id: ObjectId(),
      numTrucks: 2,
      name: '1',
    };
    state.vendorToLeaveAlone = {
      _id: ObjectId(),
      numTrucks: 2,
      name: '2',
    };
    state.vendors = [
      state.vendorToUpdate,
      state.vendorToLeaveAlone,
    ];
    await db.collection('vendors').insertMany(state.vendors);
  });

  // After all tests are finished drop database and close connection
  after((done) => {
    state.db.dropDatabase(() => {
      state.client.close(done);
    });
  });

  it('does the thing it was supposed to do', async () => {
    const { results, db } = await testUp(state.url, migration);
    verifyResults(expect, results);
    const vendors = await db.collection('vendors').find().toArray();
    expect(vendors.length).to.be.equal(state.vendors.length);
    vendors.forEach((vendor) => {
      expect(vendor.numTrucks).to.be.equal(Number(vendor.name));
    });
  });
});
