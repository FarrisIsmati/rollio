/* eslint-disable no-console */
// DEPENDENCIES
const redis = require('redis');
const bluebird = require('bluebird');
const { omit } = require('lodash');
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

const redisConnect = {
  backoffMultiplyer: 2,
  connectAttempts: 0,
  connect() {
    const client = redis.createClient(redisConfig);
    const sub = redis.createClient(redisConfig);
    const pub = redis.createClient(redisConfig);

    // Client for caching and rate limiting
    client.on('error', async (err) => {
      if (this.connectAttempts < 8) {
        this.connectAttempts += 1;
        util.backoff(this.backoffMultiplyer);
        this.backoffMultiplyer *= 1.5;
        logger.error(`Redis Client: Connection failed trying again, attempts: ${this.connectAttempts}`);

        return this.connect();
      }
      logger.error('Redis Client: I couldn`t connect, sorry man I fucked up');
      return err;
    });

    client.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      logger.info('Redis Client: Successfully connected');
      return true;
    });

    // Listens to messages on a channel, seperate scope from client key space
    sub.on('error', (err) => {
      if (this.connectAttempts < 8) {
        this.connectAttempts += 1;
        util.backoff(this.backoffMultiplyer);
        this.backoffMultiplyer *= 1.5;
        logger.error(`Redis Subscriber: Connection failed trying again, attempts: ${this.connectAttempts}`);
        return this.connect();
      }
      logger.error('Redis Subscriber: I couldn`t connect, sorry man I fucked up');
      return err;
    });

    sub.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      logger.info('Redis Subscriber: Successfully connected');
      sub.subscribe(REDIS_TWITTER_CHANNEL);
      logger.info(`Redis Subscriber: Subscribed to channel ${REDIS_TWITTER_CHANNEL}`);
      return true;
    });

    // Forward tweet data to frontend users
    sub.on('message', (channel, msg) => {
      const message = JSON.parse(msg);
      if (message.serverID !== SERVER_ID) {
        logger.info(`Redis Subscriber: Received message from server: ${SERVER_ID}`);
        logger.info(`Redis Subscriber: ${message}`);
        io.sockets.emit('TWITTER_DATA', omit(message, ['serverID']));
      }
    });

    // Publishes to messages to a channel, seperate scope from client key space
    pub.on('error', (err) => {
      if (this.connectAttempts < 8) {
        this.connectAttempts += 1;
        util.backoff(this.backoffMultiplyer);
        this.backoffMultiplyer *= 1.5;
        logger.error(`Redis Publisher: Connection failed trying again, attempts: ${this.connectAttempts}`);
        return this.connect();
      }
      logger.error('Redis Publisher: I couldn`t connect, sorry man I fucked up');
      return err;
    });

    pub.on('ready', () => {
      this.backoffMultiplyer = 2;
      this.connectAttempts = 0;
      logger.info('Redis Publisher: Successfully connected');
      return true;
    });

    return { client, pub, sub };
  },
};

const redisClient = redisConnect.connect();

module.exports = redisClient;
