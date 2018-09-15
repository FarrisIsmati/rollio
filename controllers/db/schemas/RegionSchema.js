//DEPENDENCIES
const mongoose                = require('../connection');
const CoordinatesSchema       = require('./VendorSchema').CoordinatesSchema;

//REGION SCHEMA
const RegionSchema = new mongoose.Schema({
  name : { type: String, required: true },
  totalDailyActive : { type: Number, required: false },
  location : { type: String, required: true},
  coordinates : { type: CoordinatesSchema, required: true },
  timezone : { type: String, required: true, enum: ['EST'] }
});

module.exports = RegionSchema;
