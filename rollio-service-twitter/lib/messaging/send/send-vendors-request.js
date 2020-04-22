// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('send-vendors-request');
const config = require('../../../config');

// Get proper message name depending on if service is SQS or RabbitMQ
const getMessageLocation = (msg) => {
  if (config.AWS_ENV) {
    switch (msg) {
      case 'requestVendors':
        return config.AWS_SQS_REQUEST_VENDORS;
      default:
        logger.error(`No QUEUE URL associated with ${msg}`);
    }
  }

  return msg;
};

const sendVendorsRequest = async () => {
  await mq.send(getMessageLocation('requestVendors'), true);
  logger.info('RabbitMQ: Sent request for vendors');
};

module.exports = sendVendorsRequest;
