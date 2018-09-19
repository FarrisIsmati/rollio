//DEPENDENCIES
const mongoose      = require('../schemas/AllSchemas');
const util          = require('util');

//APIS
const yelp          = require('yelp-fusion');
const yelpAPIKey    = process.env.YELP_API_KEY;
const yelpClient    = yelp.client(yelpAPIKey);

//SCHEMAS
const Vendor        = mongoose.model('Vendor');
const Region        = mongoose.model('Region');

//DATA
const vendorsData   = require('./developmentSeedJSON').vendors;
const regionsData   = require('./developmentSeedJSON').regions;


const seedObj = {
  emptyRegions : function() {
    return Region.deleteMany({})
    .then(() => {
      if (process.env.NODE_ENV != 'TEST')
        console.log(`Emptied Region collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch((err) => {
      console.log(err);
    });
  },
  seedRegions : function() {
    return Region.insertMany(regionsData)
    .then(res => {
      if (process.env.NODE_ENV != 'TEST')
        console.log(`Seeded regions in Region collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch(err => {
      console.log(err);
    })
  },
  emptyVendors : function() {
    return Vendor.deleteMany({})
    .then(() => {
      if (process.env.NODE_ENV != 'TEST')
        console.log(`Emptied Vendor collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch(err => {
      console.log(err);
    });
  },
  seedVendors : async function(regionName) {
    const region = await Region.findOne(
      { name: regionName }
    );
    const regionID = await region._id;

    const isTestEnv = process.env.NODE_ENV === 'TEST';

    //Run all async operations on seed data (collect data from various api's per vendor)
    const vendorsAsyncUpdated = vendorsData.map(async vendor => await this.asyncUpdateVendor({vendor, regionID, isTestEnv}));

    //Resolve all promises within vendorsAsyncUpdated
    const vendorsAsyncUpdatedResolved = await Promise.all(vendorsAsyncUpdated);

    //Seed all vendors into collection
    return await Vendor.insertMany(vendorsAsyncUpdatedResolved)
      .then(res => {
        if (process.env.NODE_ENV != 'TEST')
          console.log(`Seeded vendors in Vendor collection in ${process.env.NODE_ENV} enviroment`);
      })
      .catch(err => {
        console.log(err);
      })
  },
  asyncUpdateVendor : async function(params) {
    const { vendor, regionID, isTestEnv } = params;
    const payload = { ...vendor, regionID };

    //If running tests, dont make calls to the Yelp API to preserve 5,000 daily limit
    //Also set as a param and not checking actual ENV for when you want to test this function alone
    if (vendor.yelpId && !isTestEnv){
      const yelpDataString = await yelpClient.business(vendor.yelpId).then(res => res.body);
      const yelpData = JSON.parse(yelpDataString);
      payload.yelpRating = yelpData.rating;
      payload.price = yelpData.price;
    }

    return payload
  },
  runSeed : function() {
    return this.emptyRegions()
    .then(() => this.seedRegions())
    .then(() => this.emptyVendors())
    .then(() => this.seedVendors("WASHINGTONDC"));
  }
};

//EXPORT TO TEST
module.exports = seedObj;
