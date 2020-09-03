// DEPENDENCIES
const mq = require('../index');
const twitter = require('../../twitter/index');
const logger = require('../../log/index')('receive-vendor-list');
const config = require('../../../config');

const receive = {
  stream: null,
  async _mqReceive(msg) {
    const vendorList = msg.content;

    logger.info(`Received VendorIDs, length: ${vendorList.split(',').length}`);

    // Reset stream if received an updated vendors list
    if (!receive.stream) {
      receive.stream = twitter.streamClient(vendorList);
    } else {
      const streamConnection = await receive.stream;
      await streamConnection.destroy();
      receive.stream = twitter.streamClient(vendorList);
    }
  },
  receiveVendorList() {
    mq.receive(config.AWS_SQS_TWITTER_IDS, receive._mqReceive);
  }
}

module.exports = receive;

