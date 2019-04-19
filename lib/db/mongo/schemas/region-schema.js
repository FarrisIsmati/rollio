// DEPENDENCIES
const mongoose = require('../index');
const { VendorSchema } = require('./vendor-schema');
const { LocationSchema } = require('./vendor-schema');

// REGION SCHEMA
const RegionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dailyActiveVendorIDs:
  [{ type: mongoose.Schema.Types.ObjectId, ref: VendorSchema, required: false }],
  location: { type: String, required: true },
  coordinates: { type: LocationSchema, required: true },
  timezone: { type: String, required: true, enum: ['EST'] },
});

module.exports = RegionSchema;
