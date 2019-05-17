/* eslint-disable no-console */
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../../config');
const util = require('../../util/util');

const redisConfig = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

// redis.createClient needs to be promisifyed before using the util retry function
const redisCreateClientPromise = redisClientConfig => new Promise((resolve, reject) => {
  const client = redis.createClient(redisClientConfig);
  client.on('error', (err) => {
    reject(err);
  });
  client.on('ready', () => {
    resolve(client);
  });
});

const redisClient = util.retryExternalServiceConnection(
  () => redisCreateClientPromise(redisConfig)
    .then((client) => {
      console.log('Redis: Successfully connected');
      return client;
    })
    .catch((err) => {
      console.log(err);
      return false;
    }),
  'Redis',
);

// Creates a promise returning version of all redisClient functions
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = redisClient;
