// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('messaging/receive/receive-vendors-request');
const config = require('../../../config');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const recieve = {
  async _recieveVendorRequestProcess(msg) {
    // eslint-disable-next-line no-console
    logger.info(`Vendors list request received: ${JSON.stringify(msg.content)}`);
    const twitterServiceRequest = msg.content;

    // Send updated vendors list
    if (twitterServiceRequest) {
      await sendVendorTwitterIDs();
    }
    return twitterServiceRequest;
  },
  receiveRequest() {
    mq.receive(config.AWS_SQS_REQUEST_VENDORS, async (msg) => _recieveVendorRequestProcess(msg));
  }
}

module.exports = recieve;
