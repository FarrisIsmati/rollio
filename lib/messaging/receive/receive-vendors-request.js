// DEPENDENCIES
const mq = require('../index');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const receiveVendorsRequest = () => {
  mq.receive('requestVendors', async (msg) => {
    // eslint-disable-next-line no-console
    console.log('Vendors list request received');
    const twitterServiceRequest = JSON.parse(msg.content);

    // Send updated vendors list
    if (twitterServiceRequest) {
      await sendVendorTwitterIDs();
    }
    return twitterServiceRequest;
  });
};

module.exports = receiveVendorsRequest;
