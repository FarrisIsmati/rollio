/* eslint-disable no-console */
// DEPENDENCIES
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../../config');
const util = require('../../util/util');

// Creates a promise returning version of all redisClient functions
bluebird.promisifyAll(redis.RedisClient.prototype);

const redisConfig = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

const redisConnect = {
  backoffMultiplyer: 2,
  connectAttempts: 0,
  connect() {
    const client = redis.createClient(redisConfig);

    client.on('error', (err) => {
      console.log('Redis: Connection failed retrying again');
      if (this.connectAttempts < 8) {
        this.connectAttempts += 1;
        const time = util.backoff(this.backoffMultiplyer);
        this.backoffMultiplyer *= 1.5;
        console.log(`time: ${time}`);
        console.log(`attempts: ${this.connectAttempts}`);
        return this.connect();
      }
      return err;
    });
    client.on('ready', () => {
      console.log('Redis: Successfull connection');
      return true;
    });

    return client;
  },
};

const redisClient = redisConnect.connect();

module.exports = redisClient;
