// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('messaging/receive/receive-vendors-request');
const config = require('../../../config');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const receiveVendorsRequest = () => {
  mq.receive(config.AWS_SQS_REQUEST_VENDORS, async (msg) => {
    // eslint-disable-next-line no-console
    logger.info(`Vendors list request received: ${JSON.stringify(msg.content)}`);
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
