// DEPENDENCIES
const mq = require('../index');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const recieveVendorsRequest = () => {
  mq.recieve('requestVendors', async (msg) => {
    // eslint-disable-next-line no-console
    console.log('Vendors list request recieved');
    const requestVendorsResponse = JSON.parse(msg.content);

    // Send updated vendors list
    if (requestVendorsResponse) {
      await sendVendorTwitterIDs();
    }
    return requestVendorsResponse;
  });
};

module.exports = recieveVendorsRequest;
