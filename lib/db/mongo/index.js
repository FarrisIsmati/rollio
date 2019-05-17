/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('mongoose');
const config = require('../../../config');
const util = require('../../util/util');

const options = {
  autoIndex: false,
  useNewUrlParser: true,
};

util.retryExternalServiceConnection(
  () => mongoose.connect(config.MONGO_CONNECT, options)
    .then((mongoConnection) => {
      console.log(`MongoDB: Connected to ${config.NODE_ENV} DB`);
      return mongoConnection;
    })
    .catch((err) => {
      console.log(err);
      return false;
    }),
  'Mongo',
);

module.exports = mongoose;
