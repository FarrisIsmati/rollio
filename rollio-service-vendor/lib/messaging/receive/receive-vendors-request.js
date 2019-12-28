// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('messaging/receive/receive-vendors-request');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const receiveVendorsRequest = () => {
  mq.receive('requestVendors', async (msg) => {
    // eslint-disable-next-line no-console
    logger.info(`Vendors list requrest recieved: ${msg.content}`);
    const twitterServiceRequest = JSON.parse(msg.content);

    // Send updated vendors list
    if (twitterServiceRequest) {
      await sendVendorTwitterIDs();
    }
    return twitterServiceRequest;
  });
};

module.exports = receiveVendorsRequest;
