// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('send-vendors-request');
const config = require('../../../config');

const sendVendorsRequest = async () => {
  await mq.send(config.AWS_SQS_REQUEST_VENDORS, true);
  logger.info('Message Service: Sent request for vendors');
};

module.exports = sendVendorsRequest;
