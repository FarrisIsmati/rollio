//DEPENDENCIES
const mongoose                = require('../connection');
const LocationSchema       = require('./VendorSchema').LocationSchema;

//REGION SCHEMA
const RegionSchema = new mongoose.Schema({
  name : { type: String, required: true },
  totalDailyActive : { type: Number, required: false },
  location : { type: String, required: true},
  coordinates : { type: LocationSchema, required: true },
  timezone : { type: String, required: true, enum: ['EST'] }
});

module.exports = RegionSchema;
