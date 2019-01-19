//DEPENDENCIES
const dbConnection = require('../index');

//SCHEMAS
const CommentSchema = require('../schemas/vendor-schema').CommentSchema;
const VendorSchema = require('../schemas/vendor-schema').VendorSchema;
const MenuSchema = require('../schemas/vendor-schema').MenuSchema;
const TweetSchema = require('../schemas/vendor-schema').TweetSchema;
const LocationSchema = require('../schemas/vendor-schema').LocationSchema;
const RegionSchema = require('../schemas/region-schema');

dbConnection.model('Vendor', VendorSchema);
dbConnection.model('Comment', CommentSchema);
dbConnection.model('Menu', MenuSchema);
dbConnection.model('Tweet', TweetSchema);
dbConnection.model('Coordinates', LocationSchema);
dbConnection.model('Region', RegionSchema);

module.exports = dbConnection;
