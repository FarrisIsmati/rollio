// DEPENDENCIES
const mq = require('../index');
const twitter = require('../../twitter/index');

const receiveVendorList = () => {
  let stream;
  mq.receive('twitterid', async (msg) => {
    const vendorList = JSON.parse(msg.content);
    console.log(`Received VendorIDs, length: ${vendorList.split(',').length}`);
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
