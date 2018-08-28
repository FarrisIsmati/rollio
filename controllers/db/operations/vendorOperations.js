//DEPENDENCIES
const mongoose            = require('../schemas/AllSchemas');

//SCHEMA
const Vendor              = mongoose.model('Vendor');

//DB VENDOR OPERATIONS
const vendorOperations = {
  getVendor: function(id) {
    return Vendor.findById(id)
    .then( vendor => vendor )
    .catch( err => err );
  }
}

//EXPORT
module.exports = vendorOperations;
