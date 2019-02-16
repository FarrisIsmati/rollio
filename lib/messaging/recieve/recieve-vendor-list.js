//LIB
const mq = require('../index');
const twitter = require('../../twitter/index');

const recieveVendorList = () => {
  let stream;
  mq.recieve('twitterid', async msg => {
    const vendorList = JSON.parse(msg.content);
    //Reset stream if recieved an updated vendors
    if (!stream) {
      stream = twitter.streamClient(vendorList);
    } else {
      const streamConnection = await stream;
      await streamConnection.destroy();
      stream = twitter.streamClient(vendorList);
    }
  });
}

module.exports = recieveVendorList;
