//DEPENDENCIES
const mongoose  = require('./mongodb');

//SCHEMAS
const CommentSchema = require('../db/schemas/vendor-schema').CommentSchema;
const VendorSchema = require('../db/schemas/vendor-schema').VendorSchema;
const MenuSchema = require('../db/schemas/vendor-schema').MenuSchema;
const TweetSchema = require('../db/schemas/vendor-schema').TweetSchema;
const LocationSchema = require('../db/schemas/vendor-schema').LocationSchema;
const RegionSchema = require('../db/schemas/region-schema');

mongoose.model('Vendor', VendorSchema);
mongoose.model('Comment', CommentSchema);
mongoose.model('Menu', MenuSchema);
mongoose.model('Tweet', TweetSchema);
mongoose.model('Coordinates', LocationSchema);
mongoose.model('Region', RegionSchema);

module.exports = mongoose;
