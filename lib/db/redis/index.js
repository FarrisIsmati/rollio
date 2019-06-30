/* eslint-disable no-console */
// DEPENDENCIES
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../../config');
const util = require('../../util/util');
const logger = require('../../log/index');

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
      if (this.connectAttempts < 8) {
        this.connectAttempts += 1;
        util.backoff(this.backoffMultiplyer);
        this.backoffMultiplyer *= 1.5;
        logger.error(`Redis: Connection failed trying again, attempts: ${this.connectAttempts}`);
        return this.connect();
      }
      logger.error('Redis: I couldn`t connect, sorry man I fucked up');
      return err;
    });
    client.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      logger.info('Redis: Successfully connected');
      return true;
    });

    return client;
  },
};

const redisClient = redisConnect.connect();

module.exports = redisClient;
