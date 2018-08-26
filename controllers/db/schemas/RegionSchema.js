//DEPENDENCIES
const mongoose     = require('../connection');

//REGION SCHEMA
const RegionSchema = new mongoose.Schema({
  name : { type: String, required: true },
  location : { type: String, required: true},
  timezone : { type: String, required: true, enum: ['EST'] }
});

module.exports = RegionSchema;
