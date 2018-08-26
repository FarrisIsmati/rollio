//DEPENDENCIES
const mongoose      = require('../schemas/AllSchemas');
const util          = require('util');

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
    const vendorsUpdatedRegionID = vendorsData.map(vendor => { return { ...vendor, regionID } } );
    return Vendor.collection.insertMany(vendorsUpdatedRegionID)
    .then(res => {
      if (process.env.NODE_ENV != 'TEST')
        console.log(`Seeded vendors in Vendor collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch(err => {
      console.log(err);
    })
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
