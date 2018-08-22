//DEPENDCIES
const mongoose      = require('../schemas/AllSchemas');

//SCHEMAS
const Vendor        = mongoose.model('Vendor');

Vendor.remove({})
.then(() => {
  process.exit();
})
.catch((err) => {
  console.log(err);
});
