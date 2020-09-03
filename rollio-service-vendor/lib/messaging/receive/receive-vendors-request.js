// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index')('messaging/receive/receive-vendors-request');
const config = require('../../../config');

// LIB
const send = require('../send/send-vendor-twitterid');

const receive = {
  async _receiveVendorRequestProcess(msg) {
    // eslint-disable-next-line no-console
    logger.info(`Vendors list request received: ${JSON.stringify(msg.content)}`);
    const twitterServiceRequest = msg.content;

    // Send updated vendors list
    if (twitterServiceRequest) {
      await send.sendVendorTwitterIDs();
    }

    return twitterServiceRequest;
  },
  receiveRequest() {
    mq.receive(config.AWS_SQS_REQUEST_VENDORS, async (msg) => receive._receiveVendorRequestProcess(msg));
  }
}

module.exports = receive;
