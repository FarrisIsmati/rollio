// DEPENDENCIES
const mq = require('../index');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const recieveVendorsRequest = () => {
  mq.recieve('requestVendors', async (msg) => {
    console.log('I recieved a request for vendors by the twitter service');
    const requestVendorsResponse = JSON.parse(msg.content);
    // Send updated vendors list
    if (requestVendorsResponse) {
      await sendVendorTwitterIDs();
    }
    return requestVendorsResponse;
  });
};

module.exports = recieveVendorsRequest;
