/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('mongoose');
const config = require('../../../config');

const options = {
  autoIndex: false,
  useNewUrlParser: true,
};

mongoose.connect(config.MONGO_CONNECT, options)
  .then(() => console.log(`Connected to ${config.NODE_ENV} DB`))
  .catch(err => console.log(err));

module.exports = mongoose;
