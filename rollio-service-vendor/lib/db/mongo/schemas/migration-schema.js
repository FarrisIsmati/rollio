const mongoose = require('mongoose');

const MigrationSchema = new mongoose.Schema({
  id: {
    type: String, required: true, trim: true, unique: true,
  },
  started: { type: Date, required: true },
  finished: { type: Date, required: true },
  message: { type: String, requried: true },
});

module.exports = MigrationSchema;
