/* eslint-disable no-console */
// DEPENDENCIES
// const yelp = require('yelp-fusion');
const mongoose = require('../mongoose/index');
const config = require('../../../../config');
const logger = require('../../../log/index')('mongo/seeds/dev-seed');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
const Tweet = mongoose.model('Tweet');
const Location = mongoose.model('Location');
const User = mongoose.model('User');

// DATA
const {
  vendors: vendorsData,
  regions: regionsData,
  tweets: tweetData,
  locations: locationData,
  users: usersData,
} = require('../data/dev');
const { ObjectId } = require('mongodb');


// const yelpAPIKey = config.YELP_API_KEY;
// const yelpClient = yelp.client(yelpAPIKey);

const seedObj = {
  seedUsers() {
    return User.insertMany(usersData)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded users in User collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  emptyUsers() {
    return User.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied User collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  emptyRegions() {
    return Region.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied Region collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  seedRegions() {
    return Region.insertMany(regionsData)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded regions in Region collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  emptyTweets() {
    return Tweet.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied Tweet collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  seedTweets() {
    return Tweet.insertMany(tweetData)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded tweets in Tweet collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  emptyLocations() {
    return Location.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied Location collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  seedLocations() {
    return Location.insertMany(locationData)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded locations in Location collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  emptyVendors() {
    return Vendor.deleteMany({})
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Emptied Vendor collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
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
      async vendor => { return {...vendor, regionID } }
    );

    // Resolve all promises within vendorsAsyncUpdated
    const vendorsAsyncUpdatedResolved = await Promise.all(vendorsAsyncUpdated);

    // Seed all vendors into collection
    return Vendor.insertMany(vendorsAsyncUpdatedResolved)
      .then(() => {
        if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(`Seeded vendors in Vendor collection in ${config.NODE_ENV} enviroment`); }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
  runSeed() {
    return this.emptySeed()
      .then(() => this.seedRegions())
      .then(() => this.seedVendors('WASHINGTONDC'))
      .then(() => this.seedTweets())
      .then(() => this.seedLocations())
      .then(() => this.seedUsers())
      .catch((err) => {
        console.log(`error seeding DB: ${err}`);
        throw err;
      });
  },
  emptySeed() {
    return this.emptyRegions()
      .then(() => this.emptyVendors())
      .then(() => this.emptyTweets())
      .then(() => this.emptyLocations())
      .then(() => this.emptyUsers())
      .catch((err) => {
        console.log(`error emptying DB: ${err}`);
        throw err;
      });
  },
};

// seedObj.runSeed();
module.exports = seedObj;
