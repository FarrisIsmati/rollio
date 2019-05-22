/* eslint-disable no-console */
// DEPENDENCIES
const mongoose = require('mongoose');
const config = require('../../../config');
const util = require('../../util/util');

const options = {
  autoIndex: false,
  useNewUrlParser: true,
};

let connectionStatus = false;

const connectToMongoDB = () => util.retryExternalServiceConnection(
  () => mongoose.connect(config.MONGO_CONNECT, options)
    .then((mongoConnection) => {
      console.log(`MongoDB: Successfully connected to ${config.NODE_ENV} DB`);
      connectionStatus = false;
      return mongoConnection;
    })
    .catch((err) => {
      console.log(err);
      return false;
    }),
  'Mongo',
);

connectToMongoDB();

mongoose.connection.on('disconnected', () => {
  if (!connectionStatus) {
    connectionStatus = true;
    console.log('MongoDB: Disconnected!');
    connectToMongoDB();
  }
});

module.exports = mongoose;
