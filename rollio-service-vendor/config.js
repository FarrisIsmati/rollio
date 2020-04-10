/* eslint-disable prefer-destructuring */
// ENV
require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  REGION,
  YELP_API_KEY,
  YELP_CLIENT_ID,
} = process.env;

let MONGO_CONNECT;
let REDIS_HOST;
let REDIS_PORT;
let REDIS_TWITTER_CHANNEL;
let RABBITMQ_CONNECT;
let TWITTER_CONFIG;
let JWT_SECRET;
let CLOUDWATCH_ACCESS_KEY_ID;
let CLOUDWATCH_SECRET_ACCESS_KEY;
let CLOUDWATCH_REGION;

switch (NODE_ENV) {
  case 'PRODUCTION':
    MONGO_CONNECT = process.env.MONGO_PROD;
    REDIS_HOST = process.env.REDIS_HOST_PROD;
    REDIS_PORT = process.env.REDIS_PORT_PROD;
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_PROD;
    REDIS_TWITTER_CHANNEL = process.env.REDIS_TWITTER_CHANNEL_PROD;
    TWITTER_CONFIG = {
      consumerKey: process.env.TWITTER_CONSUMER_KEY_PROD,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET_PROD,
      callbackURL: process.env.OAUTH_CALLBACK_PROD,
    };
    JWT_SECRET = process.env.SECRET_PROD;
    CLOUDWATCH_ACCESS_KEY_ID = process.env.CLOUDWATCH_ACCESS_KEY_ID_PROD;
    CLOUDWATCH_SECRET_ACCESS_KEY = process.env.CLOUDWATCH_SECRET_ACCESS_KEY_PROD;
    CLOUDWATCH_REGION = process.env.CLOUDWATCH_REGION_PROD;
    break;
  case 'DEVELOPMENT_LOCAL':
    MONGO_CONNECT = process.env.MONGO_DEV_LOCAL;
    REDIS_PORT = process.env.REDIS_PORT_LOCAL;
    REDIS_HOST = process.env.REDIS_HOST_LOCAL;
    REDIS_TWITTER_CHANNEL = process.env.REDIS_TWITTER_CHANNEL_DEV;
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_LOCAL;
    TWITTER_CONFIG = {
      consumerKey: process.env.TWITTER_CONSUMER_KEY_LOCAL,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET_LOCAL,
      callbackURL: process.env.OAUTH_CALLBACK_LOCAL,
    };
    JWT_SECRET = process.env.SECRET_LOCAL;
    break;
  case 'TEST_LOCAL':
    MONGO_CONNECT = process.env.MONGO_TEST_LOCAL;
    REDIS_PORT = process.env.REDIS_PORT_LOCAL;
    REDIS_HOST = process.env.REDIS_HOST_LOCAL;
    REDIS_TWITTER_CHANNEL = process.env.REDIS_TWITTER_CHANNEL_TEST;
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_LOCAL;
    TWITTER_CONFIG = {
      consumerKey: process.env.TWITTER_CONSUMER_KEY_LOCAL,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET_LOCAL,
      callbackURL: process.env.OAUTH_CALLBACK_LOCAL,
    };
    JWT_SECRET = process.env.SECRET_LOCAL;
    break;
  case 'DEVELOPMENT_DOCKER':
    MONGO_CONNECT = process.env.MONGO_DEV_DOCKER;
    REDIS_PORT = process.env.REDIS_PORT_DOCKER;
    REDIS_HOST = process.env.REDIS_HOST_DOCKER;
    REDIS_TWITTER_CHANNEL = process.env.REDIS_TWITTER_CHANNEL_DEV;
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_DOCKER;
    TWITTER_CONFIG = {
      consumerKey: process.env.TWITTER_CONSUMER_KEY_LOCAL,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET_LOCAL,
      callbackURL: process.env.OAUTH_CALLBACK_LOCAL,
    };
    JWT_SECRET = process.env.SECRET_LOCAL;
    CLOUDWATCH_ACCESS_KEY_ID = process.env.CLOUDWATCH_ACCESS_KEY_ID_DEV;
    CLOUDWATCH_SECRET_ACCESS_KEY = process.env.CLOUDWATCH_SECRET_ACCESS_KEY_DEV;
    CLOUDWATCH_REGION = process.env.CLOUDWATCH_REGION_DEV;
    break;
  case 'TEST_DOCKER':
    MONGO_CONNECT = process.env.MONGO_TEST_DOCKER;
    REDIS_PORT = process.env.REDIS_PORT_DOCKER;
    REDIS_HOST = process.env.REDIS_HOST_DOCKER;
    REDIS_TWITTER_CHANNEL = process.env.REDIS_TWITTER_CHANNEL_TEST;
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_DOCKER;
    TWITTER_CONFIG = {
      consumerKey: process.env.TWITTER_CONSUMER_KEY_LOCAL,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET_LOCAL,
      callbackURL: process.env.OAUTH_CALLBACK_LOCAL,
    };
    JWT_SECRET = process.env.SECRET_LOCAL;
    break;
  default:
}

// Get the current server ID
// Once hosted on AWS, get instance ID
// https://stackoverflow.com/questions/37350416/how-to-get-instanceid-via-ec2-api
// const meta  = new AWS.MetadataService();
// const SERVER_ID = await meta.request('/latest/meta-data/instance-id')
const uuidv1 = require('uuid/v1');

const SERVER_ID = uuidv1();

module.exports = {
  NODE_ENV,
  SERVER_ID,
  PORT,
  REGION,
  YELP_API_KEY,
  YELP_CLIENT_ID,
  MONGO_CONNECT,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_TWITTER_CHANNEL,
  RABBITMQ_CONNECT,
  TWITTER_CONFIG,
  JWT_SECRET,
  CLOUDWATCH_ACCESS_KEY_ID,
  CLOUDWATCH_SECRET_ACCESS_KEY,
  CLOUDWATCH_REGION,
};
