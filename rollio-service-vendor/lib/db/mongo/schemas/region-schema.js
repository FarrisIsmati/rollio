// DEPENDENCIES
const mongoose = require('../index');
const { LocationSchema } = require('./vendor-schema');

// REGION SCHEMA
const RegionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  coordinates: { type: LocationSchema, required: true },
  timezone: { type: String, required: true, enum: ['EST'] },
});

module.exports = RegionSchema;
