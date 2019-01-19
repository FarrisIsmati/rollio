//DEPENDENCIES
const mongoose                        = require('../../config/mongodb');

//IMPORT ALL SCHEMAS
const CommentSchema                   = require('./VendorSchema').CommentSchema;
const VendorSchema                    = require('./VendorSchema').VendorSchema;
const MenuSchema                      = require('./VendorSchema').MenuSchema;
const TweetSchema                     = require('./VendorSchema').TweetSchema;
const LocationSchema               = require('./VendorSchema').LocationSchema;
const RegionSchema                    = require('./RegionSchema');

//ATTACH ALL SCHEMAS TO MONGOOSE
mongoose.model('Vendor', VendorSchema);
mongoose.model('Comment', CommentSchema);
mongoose.model('Menu', MenuSchema);
mongoose.model('Tweet', TweetSchema);
mongoose.model('Coordinates', LocationSchema);
mongoose.model('Region', RegionSchema);

//EXPORT ALL SCHEMAS
module.exports = mongoose;
