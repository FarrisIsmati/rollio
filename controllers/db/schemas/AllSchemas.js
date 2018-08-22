//DEPENDENCIES
const mongoose     = require('../connection');

//IMPORT ALL SCHEMAS
const VendorSchema        = require('./VendorSchema').VendorSchema;
const MenuSchema          = require('./VendorSchema').MenuSchema;
const TweetSchema         = require('./VendorSchema').TweetSchema;
const CoordinatesSchema   = require('./VendorSchema').CoordinatesSchema;
const RegionSchema        = require('./RegionSchema');

//ATTACH ALL SCHEMAS TO MONGOOSE
mongoose.model('Vendor', VendorSchema);
mongoose.model('Menu', MenuSchema);
mongoose.model('Tweet', TweetSchema);
mongoose.model('Coordinates', CoordinatesSchema);
mongoose.model('Region', RegionSchema);

//EXPORT ALL SCHEMAS
module.exports = mongoose;
