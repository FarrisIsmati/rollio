// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('send-parsed-tweet');
const config = require('../../../config');

const sendParsedTweet = async (tweet) => {
  await mq.send(config.AWS_SQS_PARSED_TWEETS, tweet);
  logger.info('Message Service: Sent parsed tweet');
};

module.exports = sendParsedTweet;
