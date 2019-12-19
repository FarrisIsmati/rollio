/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('mongoose');
const config = require('../../../config');
const util = require('../../util/util');
const logger = require('../../log/index');

const options = {
  autoIndex: false,
  useNewUrlParser: true,
};

let connectionStatus = false;
// Connect to MongoDB exponential backoff
const connectToMongoDB = () => util.retryExternalServiceConnection(
  () => mongoose.connect(config.MONGO_CONNECT, options)
    .then((mongoConnection) => {
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') {
        logger.info(`MongoDB: Successfully connected to ${config.NODE_ENV} DB`);
      }
      connectionStatus = false;
      return mongoConnection;
    })
    .catch((err) => {
      logger.error(err);
      return false;
    }),
  'Mongo',
);

connectToMongoDB();

// Upon disconnecting attempt to reconnect with exponential backoff once
mongoose.connection.on('disconnected', () => {
  if (!connectionStatus) {
    connectionStatus = true;
    logger.error('MongoDB: Disconnected!');
    connectToMongoDB();
  }
});

module.exports = mongoose;
