//DEPENDCIES
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
      console.log(`Emptied Region collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch((err) => {
      console.log(err);
    });
  },
  seedRegions : function() {
    return Region.collection.insertMany(regionsData)
    .then(res => {
      console.log(`Seeded regions in Region collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch(err => {
      console.log(err);
    })
  },
  emptyVendors : function() {
    return Vendor.deleteMany({})
    .then(() => {
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
      console.log(`Seeded vendors in Vendor collection in ${process.env.NODE_ENV} enviroment`);
    })
    .catch(err => {
      console.log(err);
    })
  },
  runSeed : function() {
    this.emptyRegionsCollection()
    .then(() => this.seedRegions())
    .then(() => this.emptyVendors())
    .then(() => this.seedVendors("WASHINGTONDC"))
    .then(() => process.exit());
  }
};

seedObj.runSeed();

//EXPORT TO TEST
module.export = seedObj;
