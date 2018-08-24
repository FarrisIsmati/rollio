//DEPENDCIES
const mongoose      = require('../schemas/AllSchemas');

//SCHEMAS
const Vendor        = mongoose.model('Vendor');
const Region        = mongoose.model('Region');

//DATA
const vendorsData   = require('./developmentSeedJSON').vendors;
const regionsData   = require('./developmentSeedJSON').regions;

const emptyRegionsCollection = (seedRegions) => {
  //FUTURE
  //Region.bulkWrite([{deleteMany:{}, insertOne: {}}])
  //INSERT MIGHT NOT WORK
  //DO YOU REALLY NEED TO SEPERATE EACH BIT OUT AS A FUNCTION NOT SURE WHAT/HOW/IF I NEED TO TEST SEED FILE
  
  Region.deleteMany({})
  .then(() => {
    console.log(`Emptied Region collection in ${process.env.NODE_ENV} enviroment`);

    if (seedRegions)
      seedRegions();
  })
  .catch((err) => {
    console.log(err);
  });
}

const emptyVendorsCollection = () => {
  Vendor.deleteMany({})
  .then(() => {
    console.log(`Emptied Vendor collection in ${process.env.NODE_ENV} enviroment`);
  })
  .catch(err => {
    console.log(err);
  });
}

const seedRegions = () => {
  Region.collection.insertMany(regionsData)
  .then(res => {
    console.log(`Seeded regions in Region collection in ${process.env.NODE_ENV} enviroment`);
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
}

emptyRegionsCollection(seedRegions);
emptyVendorsCollection();

//EXPORT TO TEST
module.export = { emptyRegionsCollection, emptyVendorsCollection, seedRegions };
