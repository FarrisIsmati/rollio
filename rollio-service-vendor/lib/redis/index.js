/* eslint-disable no-console */
// DEPENDENCIES
const redis = require('redis');
const bluebird = require('bluebird');
const lodash = require('lodash');
const config = require('../../config');
const util = require('../util/util');
const logger = require('../log/index')('redis/index');

// SOCKET
const { io } = require('../sockets/index');

// CONFIG
const {
  REDIS_TWITTER_CHANNEL,
  SERVER_ID,
} = require('../../config');

// Creates a promise returning version of all redisClient functions
bluebird.promisifyAll(redis.RedisClient.prototype);

const redisConfig = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

const { isTest } = config;

const redisConnect = {
  backoffMultiplyer: 2,
  connectAttempts: 0,
  async _onError() {
    if (redisConnect.connectAttempts < 8) {
      redisConnect.connectAttempts += 1;
      util.backoff(redisConnect.backoffMultiplyer);
      redisConnect.backoffMultiplyer *= 1.5;
      logger.error(`Redis Client: Connection failed trying again, attempts: ${redisConnect.connectAttempts}`);
      
      return redisConnect.connect();
    }
    logger.error('Redis Client: I couldn`t connect, sorry man I fucked up');
    return err;
  },
  connect() {
    const client = redis.createClient(redisConfig);
    const sub = redis.createClient(redisConfig);
    const pub = redis.createClient(redisConfig);

    // Client for caching and rate limiting
    client.on('error', async (err) => {
      redisConnect._onError(err);
    });

    client.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      if (!isTest) {
        logger.info('Redis Client: Successfully connected');
      }
      return true;
    });

    // Listens to messages on a channel, seperate scope from client key space
    sub.on('error', (err) => {
      redisConnect._onError(err);
    });

    sub.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      if (!isTest) {
        logger.info('Redis Subscriber: Successfully connected');
      }
      sub.subscribe(REDIS_TWITTER_CHANNEL);
      if (!isTest) {
        logger.info(`Redis Subscriber: Subscribed to channel ${REDIS_TWITTER_CHANNEL}`);
      }
      return true;
    });

    // Forward tweet data to frontend users
    sub.on('message', (channel, msg) => {
      const message = JSON.parse(msg);
      if (message.serverID !== SERVER_ID) {
        if (!isTest) {
          logger.info(`Redis Subscriber: Received message from server: ${SERVER_ID}`);
          logger.info(`Redis Subscriber: ${message}`);
        }
        io.sockets.emit(message.type, lodash.omit(message, ['serverID']));
      }
    });

    // Publishes to messages to a channel, seperate scope from client key space
    pub.on('error', (err) => {
      return redisConnect._onError(err);
    });

    pub.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      if (!isTest) {
        logger.info('Redis Publisher: Successfully connected');
      }
      return true;
    });

    return { client, pub, sub };
  },
};

const redisClient = redisConnect.connect();

module.exports = {
  redisClient,
  redisConnect
};
