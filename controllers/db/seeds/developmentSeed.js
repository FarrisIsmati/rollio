//DEPENDCIES
const mongoose      = require('../schemas/AllSchemas');

//SCHEMAS
const Vendor        = mongoose.model('Vendor');

const emptyVendorCollection = () => {
  Vendor.deleteMany({})
  .then(() => {
    console.log(`Emptied Vendor collection in ${process.env.NODE_ENV} enviroment`);
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
}

module.export = { emptyVendorCollection };
