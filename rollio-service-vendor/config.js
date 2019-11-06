// ENV
require('dotenv').config();

const {
  NODE_ENV, PORT, REGION, YELP_API_KEY, YELP_CLIENT_ID,
} = process.env;

let MONGO_CONNECT;
let REDIS_HOST;
let REDIS_PORT;
let RABBITMQ_CONNECT;
let TWITTER_CONFIG;
let JWT_SECRET;

switch (NODE_ENV) {
  case 'PRODUCTION':
    MONGO_CONNECT = process.env.MONGO_PROD;
    REDIS_HOST = process.env.REDIS_HOST_PROD;
    REDIS_PORT = process.env.REDIS_PORT_PROD;
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_PROD;
    break;
  case 'DEVELOPMENT_LOCAL':
    MONGO_CONNECT = process.env.MONGO_DEV_LOCAL;
    REDIS_PORT = process.env.REDIS_PORT_LOCAL;
    REDIS_HOST = process.env.REDIS_HOST_LOCAL;
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
    RABBITMQ_CONNECT = process.env.RABBITMQ_SERVER_ID_DOCKER;
    break;
  case 'TEST_DOCKER':
    MONGO_CONNECT = process.env.MONGO_TEST_DOCKER;
    REDIS_PORT = process.env.REDIS_PORT_DOCKER;
    REDIS_HOST = process.env.REDIS_HOST_DOCKER;
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

module.exports = {
  NODE_ENV,
  PORT,
  REGION,
  YELP_API_KEY,
  YELP_CLIENT_ID,
  MONGO_CONNECT,
  REDIS_PORT,
  REDIS_HOST,
  RABBITMQ_CONNECT,
  TWITTER_CONFIG,
  JWT_SECRET,
};
