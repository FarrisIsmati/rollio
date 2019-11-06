// DEPENDENCIES
const dbConnection = require('../index');

// SCHEMAS
const { CommentSchema } = require('../schemas/vendor-schema');
const { VendorSchema } = require('../schemas/vendor-schema');
const { MenuSchema } = require('../schemas/vendor-schema');
const { TweetSchema } = require('../schemas/vendor-schema');
const { LocationSchema } = require('../schemas/vendor-schema');
const RegionSchema = require('../schemas/region-schema');
const UserSchema = require('../schemas/user-schema');

dbConnection.model('Vendor', VendorSchema);
dbConnection.model('Comment', CommentSchema);
dbConnection.model('Menu', MenuSchema);
dbConnection.model('Tweet', TweetSchema);
dbConnection.model('Location', LocationSchema);
dbConnection.model('Region', RegionSchema);
dbConnection.model('User', UserSchema);

module.exports = dbConnection;
