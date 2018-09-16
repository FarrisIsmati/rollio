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
  emptyRegionsCollection : function() {
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
    return Region.collection.insertMany(regionsData)
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
    const region = await Region.collection.findOne(
      { name: regionName }
    );
    const regionID = await region._id;

    const vendorsAsyncUpdated = vendorsData.map(async vendor => await this.asyncUpdateVendor(vendor, regionID));

    const vendorsAsyncUpdatedResolved = await Promise.all(vendorsAsyncUpdated);

    return await Vendor.collection.insertMany(vendorsAsyncUpdatedResolved)
      .then(res => {
        if (process.env.NODE_ENV != 'TEST')
          console.log(`Seeded vendors in Vendor collection in ${process.env.NODE_ENV} enviroment`);
      })
      .catch(err => {
        console.log(err);
      })
  },
  asyncUpdateVendor : async function(vendor, regionID) {
    const payload = { ...vendor, regionID }

    if (vendor.yelpId && process.env.NODE_ENV !== 'TEST'){
      const yelpDataRaw = await yelpClient.business(vendor.yelpId).then(res => res.body);
      const yelpData = JSON.parse(yelpDataRaw);
      payload.yelpRating = yelpData.rating;
      payload.price = yelpData.price;
    } else {
      payload.yelpRating = '8';
      payload.price = '$$';
    }

    return payload
  },
  runSeed : function() {
    return this.emptyRegionsCollection()
    .then(() => this.seedRegions())
    .then(() => this.emptyVendors())
    .then(() => this.seedVendors("WASHINGTONDC"));
  }
};

//EXPORT TO TEST
module.exports = seedObj;
