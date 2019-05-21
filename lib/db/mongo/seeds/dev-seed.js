/* eslint-disable no-console */
// DEPENDENCIES
const yelp = require('yelp-fusion');
const mongoose = require('../mongoose/index');
const config = require('../../../../config');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');

// DATA
const vendorsData = require('../data/dev').vendors;
const regionsData = require('../data/dev').regions;

const yelpAPIKey = config.YELP_API_KEY;
const yelpClient = yelp.client(yelpAPIKey);

const seedObj = {
  emptyRegions() {
    return Region.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied Region collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  seedRegions() {
    return Region.insertMany(regionsData)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded regions in Region collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  emptyVendors() {
    return Vendor.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied Vendor collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  async seedVendors(regionName) {
    const region = await Region.findOne(
      { name: regionName },
    );
    const regionID = await region._id;
    let isTestEnv = false;

    if (config.NODE_ENV === 'TEST_LOCAL' || config.NODE_ENV === 'TEST_DOCKER') {
      isTestEnv = true;
    }

    // Run all async operations on seed data (collect data from various api's per vendor)
    const vendorsAsyncUpdated = vendorsData.map(
      async vendor => this.asyncUpdateVendor({ vendor, regionID, isTestEnv })
        .catch((err) => {
          console.log(err);
          throw err;
        }),
    );
    // Resolve all promises within vendorsAsyncUpdated
    const vendorsAsyncUpdatedResolved = await Promise.all(vendorsAsyncUpdated);
    // Seed all vendors into collection
    return Vendor.insertMany(vendorsAsyncUpdatedResolved)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded vendors in Vendor collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  async asyncUpdateVendor(params) {
    const { vendor, regionID, isTestEnv } = params;
    const payload = { ...vendor, regionID };
    // If running tests, dont make calls to the Yelp API to preserve 5,000 daily limit
    // Also set as a param and not checking actual ENV for when you want to test this function alone
    if (vendor.yelpId && !isTestEnv) {
      const yelpDataString = await yelpClient.business(vendor.yelpId).then(res => res.body);
      const yelpData = JSON.parse(yelpDataString);
      payload.yelpRating = yelpData.rating;
      payload.price = yelpData.price;
    }
    return payload;
  },
  runSeed() {
    return this.emptyRegions()
      .then(() => this.seedRegions())
      .then(() => this.emptyVendors())
      .then(() => this.seedVendors('WASHINGTONDC'));
  },
};

// seedObj.runSeed();
module.exports = seedObj;
