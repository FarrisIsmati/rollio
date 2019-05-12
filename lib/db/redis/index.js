/* eslint-disable no-console */
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../../config');

const redisConfig = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

const client = redis.createClient(redisConfig);

client.on('error', (err) => {
  console.error(`error :${err}`);
});

client.on('ready', () => {
  console.log('ready');
});

// Creates a promise returning version of all redisClient functions
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = client;
