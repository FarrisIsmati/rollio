// DEPENDENCIES
const mq = require('../index');
const twitter = require('../../twitter/index');
const logger = require('../../log/index')('receive-vendor-list');
const config = require('../../../config');

const receiveVendorList = () => {
  let stream;
  mq.receive(config.AWS_SQS_TWITTER_IDS, async (msg) => {
    const vendorList = msg.content;
    logger.info(`Received VendorIDs, length: ${vendorList.split(',').length}`);

    // Reset stream if received an updated vendors list
    if (!stream) {
      stream = twitter.streamClient(vendorList);
    } else {
      const streamConnection = await stream;
      await streamConnection.destroy();
      stream = twitter.streamClient(vendorList);
    }
  });
};

module.exports = receiveVendorList;
