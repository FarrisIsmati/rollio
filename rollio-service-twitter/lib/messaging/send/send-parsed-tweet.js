// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('send-parsed-tweet');
const config = require('../../../config');

// Get proper message name depending on if service is SQS or RabbitMQ
const getMessageLocation = (msg) => {
  if (config.AWS_ENV) {
    switch (msg) {
      case 'parsedTweets':
        return config.AWS_SQS_PARSED_TWEETS;
      default:
        logger.error(`No QUEUE URL associated with ${msg}`);
    }
  }

  return msg;
};

const sendParsedTweet = async (tweet) => {
  await mq.send(getMessageLocation('parsedTweets'), tweet);
};

module.exports = sendParsedTweet;
