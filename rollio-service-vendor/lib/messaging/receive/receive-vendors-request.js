// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('messaging/receive/receive-vendors-request');
const config = require('../../../config');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

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

const receiveVendorsRequest = () => {
  mq.receive(getMessageLocation('requestVendors'), async (msg) => {
    // eslint-disable-next-line no-console
    logger.info(`Vendors list requrest recieved: ${JSON.stringify(msg.content)}`);
    const twitterServiceRequest = msg.content;

    // Send updated vendors list
    if (twitterServiceRequest) {
      await sendVendorTwitterIDs();
    }
    return twitterServiceRequest;
  });
};

module.exports = {
  recieveRequest: receiveVendorsRequest,
};
