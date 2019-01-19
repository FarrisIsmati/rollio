//DEPENDENCIES
const mongoose                = require('../../config/mongodb');
const VendorSchema            = require('./VendorSchema').VendorSchema;
const LocationSchema          = require('./VendorSchema').LocationSchema;

//REGION SCHEMA
const RegionSchema = new mongoose.Schema({
  name : { type: String, required: true },
  dailyActiveVendorIDs : [{ type : mongoose.Schema.Types.ObjectId, ref: 'VendorSchema', required: false }],
  location : { type: String, required: true},
  coordinates : { type: LocationSchema, required: true },
  timezone : { type: String, required: true, enum: ['EST'] }
});

module.exports = RegionSchema;
